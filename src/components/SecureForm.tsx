import React, { useState, useEffect, FormEvent, ReactNode } from 'react';
import { CSRFProtection, InputSanitizer, RateLimiter } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (data: any) => Promise<void>;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  rateLimitKey?: string;
  maxAttempts?: number;
}

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  onError,
  className = '',
  disabled = false,
  loading = false,
  rateLimitKey = 'form-submission',
  maxAttempts = 5,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  // Initialize CSRF token
  useEffect(() => {
    CSRFProtection.createToken();
  }, []);

  // Check rate limiting
  useEffect(() => {
    if (attempts >= maxAttempts) {
      setIsLocked(true);
      const lockoutDuration = 15 * 60 * 1000; // 15 minutes
      setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
      }, lockoutDuration);
    }
  }, [attempts, maxAttempts]);

  const validateField = (name: string, value: any, validation?: any): string | null => {
    if (validation?.required && (!value || value.toString().trim() === '')) {
      return `${name} is required`;
    }

    if (value && validation?.minLength && value.toString().length < validation.minLength) {
      return `${name} must be at least ${validation.minLength} characters`;
    }

    if (value && validation?.maxLength && value.toString().length > validation.maxLength) {
      return `${name} must be no more than ${validation.maxLength} characters`;
    }

    if (value && validation?.pattern && !validation.pattern.test(value.toString())) {
      return `${name} format is invalid`;
    }

    if (validation?.custom) {
      return validation.custom(value);
    }

    return null;
  };

  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return InputSanitizer.sanitizeString(value);
    }
    return value;
  };

  const handleInputChange = (name: string, value: any) => {
    const sanitizedValue = sanitizeValue(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(fieldName => {
      const value = formData[fieldName];
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (disabled || loading || isLocked || isSubmitting) {
      return;
    }

    // Check rate limiting
    if (!RateLimiter.checkRateLimit(rateLimitKey)) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many form submissions. Please wait before trying again.",
        variant: "destructive"
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setAttempts(prev => prev + 1);

    try {
      // Add CSRF token to form data
      const csrfToken = CSRFProtection.getToken();
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const submissionData = {
        ...formData,
        csrfToken,
      };

      await onSubmit(submissionData);
      
      // Reset form on successful submission
      setFormData({});
      setErrors({});
      setAttempts(0);
      
      toast({
        title: "Success",
        description: "Form submitted successfully",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while submitting the form';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      
      if (onError) {
        onError(errorMessage);
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const { name, type, label, required, placeholder, options, validation } = field;
    const value = formData[name] || '';
    const error = errors[name];

    const commonProps = {
      id: name,
      name,
      value: value,
      onChange: (e: any) => handleInputChange(name, e.target?.value || e),
      disabled: disabled || loading || isSubmitting || isLocked,
      className: error ? 'border-red-500' : '',
      'aria-describedby': error ? `${name}-error` : undefined,
    };

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type={type}
              placeholder={placeholder}
            />
            {error && (
              <p id={`${name}-error`} className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              placeholder={placeholder}
            />
            {error && (
              <p id={`${name}-error`} className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleInputChange(name, val)}
              disabled={disabled || loading || isSubmitting || isLocked}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p id={`${name}-error`} className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={name} className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={value || false}
              onCheckedChange={(checked) => handleInputChange(name, checked)}
              disabled={disabled || loading || isSubmitting || isLocked}
            />
            <Label htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {error && (
              <p id={`${name}-error`} className="text-sm text-red-500 ml-6">
                {error}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={name} className="space-y-2">
            <Label>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(name, val)}
              disabled={disabled || loading || isSubmitting || isLocked}
            >
              {options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                  <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && (
              <p id={`${name}-error`} className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="file"
              onChange={(e) => handleInputChange(name, e.target.files?.[0])}
            />
            {error && (
              <p id={`${name}-error`} className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {isLocked && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <p className="text-sm text-yellow-600">
            Form is temporarily locked due to too many attempts. Please wait before trying again.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={disabled || loading || isSubmitting || isLocked}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>

      {attempts > 0 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Attempts: {attempts}/{maxAttempts}
        </p>
      )}
    </form>
  );
};

// Export form field types for easy usage
export type { FormField };
export default SecureForm;
