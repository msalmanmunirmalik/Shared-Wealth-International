import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, User, Building, MapPin, Globe, Linkedin, Twitter } from 'lucide-react';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  // Enhanced signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [role, setRole] = useState('user');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  
  // Company selection state
  const [companySelectionType, setCompanySelectionType] = useState<'new' | 'existing'>('new');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const { signIn, signUp, resetPassword, signOut, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile image upload handler
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load available companies for selection
  const loadAvailableCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await fetch('https://sharedwealth.net/api/companies');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAvailableCompanies(data || []);
      } else if (data.success && data.data) {
        setAvailableCompanies(data.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load companies",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      });
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Load companies when user selects "existing company"
  useEffect(() => {
    if (companySelectionType === 'existing' && availableCompanies.length === 0) {
      loadAvailableCompanies();
    }
  }, [companySelectionType]);

  // Remove automatic redirect - allow users to access auth page even when logged in
  // This enables users to sign out or switch accounts
  // useEffect(() => {
  //   if (user) {
  //     if (isAdmin && window.location.pathname.includes('/admin')) {
  //       navigate('/admin');
  //     } else {
  //       navigate('/user-dashboard');
  //     }
  //   }
  // }, [user, isAdmin, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate company selection
    if (companySelectionType === 'new' && !company.trim()) {
      toast({
        title: "Error",
        description: "Please enter your company name",
        variant: "destructive",
      });
      return;
    }

    if (companySelectionType === 'existing' && !selectedCompanyId) {
      toast({
        title: "Error",
        description: "Please select your company",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create account with enhanced profile data
      const profileData = {
        email,
        password,
        firstName,
        lastName,
        phone,
        bio,
        position,
        companyName: companySelectionType === 'new' ? company : '', // Only use if new company
        selectedCompanyId: companySelectionType === 'existing' ? selectedCompanyId : null,
        location,
        website,
        linkedin,
        twitter,
        role,
        profileImage
      };

      // Use signUpWithProfile to handle file uploads
      await signUp(email, password, profileData);
      toast({
        title: "Success",
        description: "Account created successfully with complete profile",
      });
      setActiveTab('signin');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      toast({
        title: "Success",
        description: "Password reset email sent",
      });
      setActiveTab('signin');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Show current user info and sign out option if logged in */}
        {user && (
          <Card className="shadow-lg border-0 bg-blue-50/80 backdrop-blur-sm mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Avatar className="w-12 h-12 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => navigate('/user-dashboard')} 
                    variant="outline" 
                    size="sm"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    onClick={async () => {
                      await signOut();
                      toast({
                        title: "Signed Out",
                        description: "You have been signed out successfully",
                      });
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">Account Access</CardTitle>
            <CardDescription className="text-center">
              Choose your authentication method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="signin" id="signin-tab">Sign In</TabsTrigger>
                <TabsTrigger value="signup" id="signup-tab">Sign Up</TabsTrigger>
                <TabsTrigger value="reset" id="reset-tab">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="space-y-4">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profileImagePreview} />
                        <AvatarFallback>
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                          id="profile-image"
                        />
                        <Label htmlFor="profile-image" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name *</Label>
                      <Input
                        id="signup-firstname"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name *</Label>
                      <Input
                        id="signup-lastname"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold">Professional Information</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-position">Position</Label>
                      <Input
                        id="signup-position"
                        placeholder="e.g., CEO, Director, Manager"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>

                    {/* Company Selection */}
                    <div className="space-y-4">
                      <Label>Company Affiliation</Label>
                      <div className="space-y-3">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="new-company"
                              name="company-type"
                              value="new"
                              checked={companySelectionType === 'new'}
                              onChange={(e) => setCompanySelectionType(e.target.value as 'new' | 'existing')}
                              className="text-orange-500"
                            />
                            <Label htmlFor="new-company">I'm creating a new company</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="existing-company"
                              name="company-type"
                              value="existing"
                              checked={companySelectionType === 'existing'}
                              onChange={(e) => setCompanySelectionType(e.target.value as 'new' | 'existing')}
                              className="text-orange-500"
                            />
                            <Label htmlFor="existing-company">I'm part of an existing company</Label>
                          </div>
                        </div>

                        {companySelectionType === 'new' && (
                          <div className="space-y-2">
                            <Label htmlFor="signup-company">Company Name</Label>
                            <Input
                              id="signup-company"
                              placeholder="Your company name"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                            />
                          </div>
                        )}

                        {companySelectionType === 'existing' && (
                          <div className="space-y-2">
                            <Label htmlFor="company-select">Select Your Company</Label>
                            {loadingCompanies ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                <span className="text-sm text-gray-500">Loading companies...</span>
                              </div>
                            ) : (
                              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose your company..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {availableCompanies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{company.name}</span>
                                        <span className="text-xs text-gray-500">
                                          {company.industry} • {company.location}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {selectedCompanyId && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  <strong>Selected:</strong> {
                                    availableCompanies.find(c => c.id === selectedCompanyId)?.name
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-bio">Bio</Label>
                      <Textarea
                        id="signup-bio"
                        placeholder="Tell us about yourself and your professional background..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-role">Role in Shared Wealth</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="director">Director</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location and Links */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold">Location & Links</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-location">Location</Label>
                      <Input
                        id="signup-location"
                        placeholder="City, Country"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-website">Website</Label>
                        <Input
                          id="signup-website"
                          placeholder="https://yourwebsite.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-linkedin">LinkedIn</Label>
                        <Input
                          id="signup-linkedin"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-twitter">Twitter/X</Label>
                      <Input
                        id="signup-twitter"
                        placeholder="https://twitter.com/yourhandle"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold">Account Security</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password *</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account with Profile'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={resetLoading}>
                    {resetLoading ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>&copy; 2024 Shared Wealth International. All rights reserved.</p>
          <p className="mt-1">Building sustainable wealth through collaboration</p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
