import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  Users, 
  Target,
  Upload,
  X
} from "lucide-react";

interface CompanyRegistrationData {
  name: string;
  sector: string;
  country: string;
  description: string;
  website: string;
  employees: string;
  location: string;
  isSharedWealthLicensed: boolean;
  licenseNumber: string;
  licenseDate: string;
  highlights: string[];
  newHighlight: string;
}

interface CompanyRegistrationProps {
  onCompanyRegistered?: () => void;
}

const CompanyRegistration = ({ onCompanyRegistered }: CompanyRegistrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyRegistrationData>({
    name: '',
    sector: '',
    country: '',
    description: '',
    website: '',
    employees: '',
    location: '',
    isSharedWealthLicensed: false,
    licenseNumber: '',
    licenseDate: '',
    highlights: [],
    newHighlight: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined options
  const sectors = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Agriculture', 'Energy', 'Transportation', 'Retail', 'Construction',
    'Media', 'Consulting', 'Non-profit', 'Other'
  ];

  const countries = [
    'Netherlands', 'Germany', 'Belgium', 'France', 'Switzerland',
    'United Kingdom', 'United States', 'Canada', 'Australia', 'Japan',
    'Singapore', 'Other'
  ];

  const employeeRanges = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.sector) {
      newErrors.sector = 'Sector is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (formData.isSharedWealthLicensed && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required for licensed companies';
    }

    if (formData.isSharedWealthLicensed && !formData.licenseDate) {
      newErrors.licenseDate = 'License date is required for licensed companies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addHighlight = () => {
    if (formData.newHighlight.trim() && !formData.highlights.includes(formData.newHighlight.trim())) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, prev.newHighlight.trim()],
        newHighlight: ''
      }));
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register a company",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create the company in network_companies
      const { data: companyData, error: companyError } = await supabase
        .from('network_companies')
        .insert({
          name: formData.name.trim(),
          sector: formData.sector,
          country: formData.country,
          description: formData.description.trim(),
          website: formData.website.trim() || null,
          employees: parseInt(formData.employees) || null,
          location: formData.location.trim() || formData.country,
          is_shared_wealth_licensed: formData.isSharedWealthLicensed,
          license_number: formData.licenseNumber.trim() || null,
          license_date: formData.licenseDate || null,
          highlights: formData.highlights.length > 0 ? formData.highlights : null,
          status: 'pending',
          impact_score: 0, // Will be calculated later
          shared_value: '€0', // Will be calculated later
          joined_date: new Date().getFullYear().toString()
        })
        .select()
        .single();

      if (companyError) {
        throw companyError;
      }

      // Then, create the user-company relationship
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: companyData.id,
          company_name: formData.name.trim(),
          role: 'owner',
          position: 'Founder/CEO',
          is_shared_wealth_licensed: formData.isSharedWealthLicensed,
          license_number: formData.licenseNumber.trim() || null,
          license_date: formData.licenseDate || null,
          status: 'approved'
        });

      if (userCompanyError) {
        throw userCompanyError;
      }

      setCompanyId(companyData.id);
      setIsSuccess(true);
      
      toast({
        title: "Company Registered Successfully!",
        description: "Your company has been added to the network and is pending approval.",
      });

      // Call the callback to refresh the network
      if (onCompanyRegistered) {
        onCompanyRegistered();
      }

      // Reset form
      setFormData({
        name: '',
        sector: '',
        country: '',
        description: '',
        website: '',
        employees: '',
        location: '',
        isSharedWealthLicensed: false,
        licenseNumber: '',
        licenseDate: '',
        highlights: [],
        newHighlight: ''
      });

    } catch (error: any) {
      console.error('Error registering company:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred while registering your company",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Company Registered Successfully!</CardTitle>
          <CardDescription>
            Your company has been added to the Shared Wealth International network
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your company is now pending approval. Once approved, it will appear in the public network directory.
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => setIsSuccess(false)}
              variant="outline"
            >
              Register Another Company
            </Button>
            <Button asChild>
              <a href="/network">View Network</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-6 h-6" />
          Register Your Company
        </CardTitle>
        <CardDescription>
          Join the Shared Wealth International network and connect with like-minded companies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter company name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                <SelectTrigger className={errors.sector ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector && <p className="text-sm text-red-500">{errors.sector}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees">Company Size</Label>
              <Select value={formData.employees} onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {employeeRanges.map(range => (
                    <SelectItem key={range} value={range}>{range} employees</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Company Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your company's mission, values, and how it contributes to shared wealth creation..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="flex justify-between items-center">
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              <span className="text-sm text-gray-500">
                {formData.description.length}/500 characters
              </span>
            </div>
          </div>

          {/* Website and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourcompany.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">City/Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Amsterdam, Netherlands"
              />
            </div>
          </div>

          {/* Shared Wealth License */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSharedWealthLicensed"
                checked={formData.isSharedWealthLicensed}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  isSharedWealthLicensed: checked as boolean 
                }))}
              />
              <Label htmlFor="isSharedWealthLicensed">
                My company is Shared Wealth Licensed
              </Label>
            </div>

            {formData.isSharedWealthLicensed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 border-l-2 border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="Enter license number"
                    className={errors.licenseNumber ? 'border-red-500' : ''}
                  />
                  {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseDate">License Date *</Label>
                  <Input
                    id="licenseDate"
                    type="date"
                    value={formData.licenseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseDate: e.target.value }))}
                    className={errors.licenseDate ? 'border-red-500' : ''}
                  />
                  {errors.licenseDate && <p className="text-sm text-red-500">{errors.licenseDate}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Company Highlights */}
          <div className="space-y-4">
            <Label>Company Highlights</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newHighlight}
                onChange={(e) => setFormData(prev => ({ ...prev, newHighlight: e.target.value }))}
                placeholder="Add a highlight (e.g., Employee Ownership, Sustainable Practices)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <Button type="button" onClick={addHighlight} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {highlight}
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Registering...' : 'Register Company'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyRegistration;
