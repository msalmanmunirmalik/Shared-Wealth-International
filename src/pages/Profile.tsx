import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit, 
  Save, 
  X,
  Plus,
  Calendar,
  MessageSquare,
  Activity,
  Settings,
  Upload,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  company_name: string | null;
  position: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  role: 'admin' | 'founding_member' | 'media_manager' | 'member' | 'user' | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  sector: string | null;
  website: string | null;
  location: string | null;
  approved: boolean | null;
  created_at: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    company_name: '',
    position: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    role: 'member'
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadProfile();
      loadUserCompanies();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      
      if (response.success && response.data) {
        const userProfile = response.data;
        setProfile(userProfile);
        setFormData({
          first_name: userProfile.first_name || '',
          last_name: userProfile.last_name || '',
          bio: userProfile.bio || '',
          company_name: userProfile.company_name || '',
          position: userProfile.position || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          website: userProfile.website || '',
          linkedin: userProfile.linkedin || '',
          twitter: userProfile.twitter || '',
          role: userProfile.role || 'member'
        });
        
        if (userProfile.avatar_url) {
          setProfileImagePreview(userProfile.avatar_url);
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      console.error('Profile load error:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          company_id,
          role,
          is_active,
          companies (
            id,
            name,
            logo_url,
            description,
            sector,
            website,
            location,
            approved,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error loading companies:', error);
        return;
      }

      const userCompanies = data?.map(item => item.companies).filter(Boolean) || [];
      setCompanies(userCompanies);
    } catch (error) {
      console.error('Companies load error:', error);
    }
  };

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

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError('');

    try {
      // If profile image is provided, upload it first
      let avatarUrl = '';
      if (profileImage) {
        try {
          const formData = new FormData();
          formData.append('file', profileImage);
          formData.append('uploadType', 'profile_image');
          
          // Use environment variable for API URL, fallback based on domain
          const getApiBaseUrl = () => {
            if (import.meta.env.VITE_API_URL) {
              return import.meta.env.VITE_API_URL;
            }
            
            const hostname = window.location.hostname;
            
            // Production domains - use Render API
            if (hostname === 'sharedwealth.net' || 
                hostname === 'www.sharedwealth.net' || 
                hostname.includes('sharedwealth')) {
              return 'https://shared-wealth-international.onrender.com/api';
            }
            
            // Development - use localhost
            return 'http://localhost:8080/api';
          };

          const uploadResponse = await fetch(`${getApiBaseUrl()}/files/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')!).access_token : ''}`,
            },
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            avatarUrl = uploadData.data?.publicUrl || '';
          }
        } catch (uploadError) {
          console.warn('Profile image upload failed:', uploadError);
          // Continue without profile image
        }
      }

      // Update profile with backend API
      const response = await apiService.updateUserProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        company_name: formData.company_name,
        position: formData.position,
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        role: formData.role,
        avatar_url: avatarUrl || profile?.avatar_url
      });

      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });

        setIsEditing(false);
        await loadProfile(); // Reload to get updated data
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        company_name: profile.company_name || '',
        position: profile.position || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        twitter: profile.twitter || '',
        role: profile.role || 'member'
      });
      setProfileImagePreview(profile.avatar_url || '');
    }
    setIsEditing(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and company associations</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="text-2xl">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{profile?.full_name || 'No name set'}</CardTitle>
                  <CardDescription>{profile?.position || 'No position set'}</CardDescription>
                  {profile?.role && (
                    <Badge variant="secondary" className="mt-2">
                      {profile.role.replace('_', ' ')}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Your job title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        disabled={!isEditing}
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Twitter handle"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Companies</CardTitle>
                    <CardDescription>Companies you're associated with</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {companies.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't joined any companies yet.</p>
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Join a Company
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                      <Card key={company.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={company.logo_url || ''} />
                              <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-navy">{company.name}</h3>
                              <p className="text-sm text-muted-foreground">{company.sector}</p>
                            </div>
                          </div>
                          {company.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {company.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant={company.approved ? "default" : "secondary"}>
                              {company.approved ? "Approved" : "Pending"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity to show.</p>
                  <p className="text-sm text-muted-foreground">Your activity will appear here as you engage with the platform.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive updates about your companies and network</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile; 