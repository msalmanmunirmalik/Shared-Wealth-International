import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Building, Users, Plus, Shield, Heart, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || 'Failed to sign in');
      } else {
        setSuccess('Sign in successful!');
        // The navigation will happen automatically via useEffect when user state changes
      }
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
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message || 'Failed to create account');
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        resetForm();
      }
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
      const { error } = await resetPassword(resetEmail);
      if (error) {
        setError(error.message || 'Failed to send reset link');
      } else {
        setSuccess('Password reset link sent to your email!');
        setShowReset(false);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Shared Wealth International</h1>
          </div>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join the global network of enterprises committed to creating shared wealth and sustainable business practices
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Auth Card */}
          <Card className="shadow-2xl border-0 bg-white overflow-hidden rounded-2xl">
            {/* Card Header */}
            <div className="px-8 py-8" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                  {mode === "signin" ? <Lock className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {mode === "signin" ? "Welcome Back" : "Join the Network"}
                </h2>
                <p className="text-white/80">
                  {mode === "signin"
                    ? "Sign in to access your Shared Wealth dashboard"
                    : "Create your account and start building shared wealth"}
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-8 py-8">
              {/* Tabs */}
              <div className="mb-8">
                <div className="flex bg-slate-100 rounded-xl p-1.5">
                  <button
                    onClick={() => setMode("signin")}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      mode === "signin"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      mode === "signup"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Password Reset Form */}
              {showReset && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Reset Your Password</h3>
                    <p className="text-slate-600">Enter your email address and we'll send you a reset link</p>
                  </div>
                  
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <Label htmlFor="resetEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                        autoFocus
                        className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold rounded-xl" 
                        style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }} 
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50 text-base font-medium rounded-xl" 
                        onClick={() => setShowReset(false)}
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sign In Form */}
              {!showReset && mode === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 pr-12 text-base rounded-xl"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm text-slate-600 hover:text-slate-800 underline hover:no-underline transition-colors font-medium"
                      onClick={() => setShowReset(true)}
                    >
                      Forgot your password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold rounded-xl" 
                    style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }} 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              )}

              {/* Sign Up Form */}
              {!showReset && mode === "signup" && (
                <div>
                  {!signupType ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">How would you like to join?</h3>
                        <p className="text-slate-600">Choose the option that best fits your situation</p>
                      </div>

                      <div className="grid gap-4">
                        <button
                          type="button"
                          onClick={() => handleSignupTypeSelect('new-company')}
                          className="w-full p-6 border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
                              <Building className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-lg">Create New Company</h4>
                              <p className="text-slate-600">Start a new enterprise in the Shared Wealth network</p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSignupTypeSelect('join-company')}
                          className="w-full p-6 border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
                              <Users className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-lg">Join Existing Company</h4>
                              <p className="text-slate-600">Join a company that's already part of the network</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {signupType === 'new-company' ? 'Create New Company' : 'Join Existing Company'}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={goBackToSignupType}
                          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                            Password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                              className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 pr-12 text-base rounded-xl"
                              placeholder="Create a password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                              onClick={() => setShowPassword(v => !v)}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirm Password *
                          </Label>
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                            placeholder="Confirm your password"
                          />
                        </div>
                      </div>

                      {signupType === 'new-company' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">
                              Company Name *
                            </Label>
                            <Input
                              id="companyName"
                              type="text"
                              value={companyName}
                              onChange={e => setCompanyName(e.target.value)}
                              required
                              className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                              placeholder="Enter your company name"
                            />
                          </div>

                          <div>
                            <Label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                              Your Role *
                            </Label>
                            <Input
                              id="role"
                              type="text"
                              value={role}
                              onChange={e => setRole(e.target.value)}
                              required
                              className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                              placeholder="e.g., CEO, Founder, Director"
                            />
                          </div>
                        </div>
                      )}

                      {signupType === 'new-company' && (
                        <div>
                          <Label htmlFor="companyDescription" className="block text-sm font-semibold text-slate-700 mb-2">
                            Company Description
                          </Label>
                          <Textarea
                            id="companyDescription"
                            value={companyDescription}
                            onChange={e => setCompanyDescription(e.target.value)}
                            className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base min-h-[100px] rounded-xl"
                            placeholder="Brief description of your company (optional)"
                          />
                        </div>
                      )}

                      {signupType === 'join-company' && (
                        <div>
                          <Label htmlFor="invitationCode" className="block text-sm font-semibold text-slate-700 mb-2">
                            Invitation Code *
                          </Label>
                          <Input
                            id="invitationCode"
                            type="text"
                            value={invitationCode}
                            onChange={e => setInvitationCode(e.target.value)}
                            required
                            className="w-full h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-base rounded-xl"
                            placeholder="Enter the invitation code from your team"
                          />
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold rounded-xl" 
                        style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }} 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive" className="mt-6 border-red-200 bg-red-50 rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-6 border-green-200 bg-green-50 text-green-800 rounded-xl">
                  <CheckCircle className="h-4 h-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Shield className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Secure & Private</h4>
                  <p className="text-slate-600 text-xs">Enterprise-grade security</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Heart className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Social Impact</h4>
                  <p className="text-slate-600 text-xs">Creating shared wealth</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-xl bg-slate-100">
                  <Globe className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Global Network</h4>
                  <p className="text-slate-600 text-xs">Worldwide connections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-12" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Shared Wealth International</h3>
                </div>
                <p className="text-white/80 mb-4 max-w-md">
                  Building a world of shared prosperity through equitable wealth distribution, inclusive decision-making, and sustainable business practices.
                </p>
                <div className="flex space-x-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/model" className="text-white/80 hover:text-white transition-colors">Concept</Link></li>
                  <li><Link to="/network" className="text-white/80 hover:text-white transition-colors">Network</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-white/80">info@sharedwealth.international</li>
                  <li className="text-white/80">+44 (0) 123 456 7890</li>
                  <li className="text-white/80">Falconhurst, Robin Hoods Bay</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 mt-8 pt-8 text-center">
              <p className="text-white/60 text-sm">
                © 2024 Shared Wealth International. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Auth;