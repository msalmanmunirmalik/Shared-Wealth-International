import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Building, Users, Plus } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [signupType, setSignupType] = useState<'new-company' | 'join-company' | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  // Company registration fields
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  
  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    setError('');
    setSuccess('');

    if (!email || !email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode === 'signup') {
      if (!password || !password.trim()) {
        setError('Password is required');
        return false;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return false;
      }

      if (!confirmPassword || !confirmPassword.trim()) {
        setError('Please confirm your password');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (!fullName || !fullName.trim()) {
        setError('Full name is required');
        return false;
      }

      if (signupType === 'new-company') {
        if (!companyName || !companyName.trim()) {
          setError('Company name is required');
          return false;
        }
        if (!role || !role.trim()) {
          setError('Role is required');
          return false;
        }
      }

      if (signupType === 'join-company') {
        if (!invitationCode || !invitationCode.trim()) {
          setError('Invitation code is required');
          return false;
        }
      }
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || !validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll use the existing signUp function
      // In a real implementation, you'd need to extend this to handle company creation
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Please check your email for confirmation.");
        setMode("signin");
        // Reset form
        setSignupType(null);
        setCompanyName("");
        setCompanyDescription("");
        setInvitationCode("");
        setFullName("");
        setRole("");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!resetEmail || !validateEmail(resetEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password reset email sent! Please check your inbox.");
        setShowReset(false);
        setResetEmail("");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as 'signin' | 'signup');
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSignupType(null);
    setCompanyName("");
    setCompanyDescription("");
    setInvitationCode("");
    setFullName("");
    setRole("");
  };

  const handleSignupTypeSelect = (type: 'new-company' | 'join-company') => {
    setSignupType(type);
    setError('');
    setSuccess('');
  };

  const goBackToSignupType = () => {
    setSignupType(null);
    setError('');
    setSuccess('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "signin"
              ? "Welcome back! Sign in to your account."
              : "Join the Shared Wealth Network."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive">{error}</Alert>}
          {success && <Alert>{success}</Alert>}
          
          {showReset ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setShowReset(false)}>
                Back to Sign In
              </Button>
            </form>
          ) : mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-sm text-primary underline hover:text-primary/80"
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          ) : signupType === null ? (
            // Company registration type selection
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-4">How would you like to join Shared Wealth International?</p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                onClick={() => handleSignupTypeSelect('new-company')}
              >
                <Building className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-blue-800">Register a New Company</div>
                  <div className="text-xs text-gray-600">Create a new company profile</div>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
                onClick={() => handleSignupTypeSelect('join-company')}
              >
                <Users className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-green-800">Join an Existing Company</div>
                  <div className="text-xs text-gray-600">Use invitation code to join</div>
                </div>
              </Button>
            </div>
          ) : (
            // Company registration form
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={goBackToSignupType}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <div className="text-sm text-gray-600">
                  {signupType === 'new-company' ? 'Register New Company' : 'Join Existing Company'}
                </div>
              </div>

              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoFocus
              />

              <Label htmlFor="signupEmail">Email</Label>
              <Input
                id="signupEmail"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <Label htmlFor="signupPassword">Password</Label>
              <div className="relative">
                <Input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {signupType === 'new-company' && (
                <>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    required
                  />

                  <Label htmlFor="companyDescription">Company Description (Optional)</Label>
                  <Input
                    id="companyDescription"
                    type="text"
                    value={companyDescription}
                    onChange={e => setCompanyDescription(e.target.value)}
                    placeholder="Brief description of your company"
                  />

                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g., CEO, Founder, Director"
                    required
                  />
                </>
              )}

              {signupType === 'join-company' && (
                <>
                  <Label htmlFor="invitationCode">Invitation Code</Label>
                  <Input
                    id="invitationCode"
                    type="text"
                    value={invitationCode}
                    onChange={e => setInvitationCode(e.target.value)}
                    placeholder="Enter the invitation code from your team"
                    required
                  />
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="text-primary underline hover:text-primary/80"
                  onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-primary underline hover:text-primary/80"
                  onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;