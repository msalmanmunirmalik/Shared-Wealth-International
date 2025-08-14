import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Building, Users, Plus, Shield, Heart, Globe } from 'lucide-react';

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
      navigate("/company-dashboard");
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
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      setSuccess('Sign in successful!');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp(email, password, {
        full_name: fullName,
        company_name: companyName,
        company_description: companyDescription,
        role: role,
        invitation_code: invitationCode,
        signup_type: signupType
      });
      setSuccess('Account created successfully! Please check your email to verify your account.');
      resetForm();
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(resetEmail);
      setSuccess('Password reset link sent to your email!');
      setShowReset(false);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Shared Wealth International</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join the global network of enterprises committed to creating shared wealth and sustainable business practices
          </p>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="container mx-auto px-6 py-4">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {mode === "signin" ? <Lock className="w-6 h-6 text-blue-600" /> : <User className="w-6 h-6 text-blue-600" />}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {mode === "signin" ? "Welcome Back" : "Join the Network"}
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                {mode === "signin"
                  ? "Sign in to access your Shared Wealth dashboard"
                  : "Create your account and start building shared wealth"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Tabs for Sign In/Sign Up */}
              <Tabs value={mode} onValueChange={(value) => setMode(value as 'signin' | 'signup')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4 mt-6">
                  {showReset ? (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          value={resetEmail}
                          onChange={e => setResetEmail(e.target.value)}
                          required
                          autoFocus
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" 
                        onClick={() => setShowReset(false)}
                      >
                        Back to Sign In
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          autoFocus
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            placeholder="Enter your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                          onClick={() => setShowReset(true)}
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </form>
                  )}
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4 mt-6">
                  {!signupType ? (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">How would you like to join?</h3>
                        <p className="text-sm text-gray-600">Choose the option that best fits your situation</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <button
                          type="button"
                          onClick={() => handleSignupTypeSelect('new-company')}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                              <Building className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Create New Company</h4>
                              <p className="text-sm text-gray-600">Start a new enterprise in the Shared Wealth network</p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSignupTypeSelect('join-company')}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Join Existing Company</h4>
                              <p className="text-sm text-gray-600">Join a company that's already part of the network</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {signupType === 'new-company' ? 'Create New Company' : 'Join Existing Company'}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={goBackToSignupType}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            placeholder="Create a password (min 6 characters)"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirm Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            placeholder="Confirm your password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(v => !v)}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {signupType === 'new-company' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                              Company Name *
                            </Label>
                            <Input
                              id="companyName"
                              type="text"
                              value={companyName}
                              onChange={e => setCompanyName(e.target.value)}
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter your company name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="companyDescription" className="text-sm font-medium text-gray-700">
                              Company Description
                            </Label>
                            <Input
                              id="companyDescription"
                              type="text"
                              value={companyDescription}
                              onChange={e => setCompanyDescription(e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Brief description of your company (optional)"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                              Your Role *
                            </Label>
                            <Input
                              id="role"
                              type="text"
                              value={role}
                              onChange={e => setRole(e.target.value)}
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="e.g., CEO, Founder, Director"
                            />
                          </div>
                        </>
                      )}

                      {signupType === 'join-company' && (
                        <div className="space-y-2">
                          <Label htmlFor="invitationCode" className="text-sm font-medium text-gray-700">
                            Invitation Code *
                          </Label>
                          <Input
                            id="invitationCode"
                            type="text"
                            value={invitationCode}
                            onChange={e => setInvitationCode(e.target.value)}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter the invitation code from your team"
                          />
                        </div>
                      )}

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>

              {/* Footer Links */}
              <div className="pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  {mode === "signin" ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
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
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                        onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Social Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Global Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;