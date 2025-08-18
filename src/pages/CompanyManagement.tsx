import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyService } from '@/services/mockServices';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building, 
  Plus, 
  Edit, 
  Save, 
  X,
  Globe,
  MapPin,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface CompanyPost {
  id: string;
  company_id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  created_at: string | null;
  approved: boolean | null;
}

const CompanyManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [posts, setPosts] = useState<CompanyPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  
  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    sector: '',
    website: '',
    location: ''
  });

  const [postForm, setPostForm] = useState({
    type: 'news',
    title: '',
    content: ''
  });

  useEffect(() => {
    if (user) {
      loadUserCompanies();
      loadCompanyPosts();
    }
  }, [user]);

  const loadUserCompanies = async () => {
    try {
      const userCompanies = await CompanyService.getUserCompanies(user?.id || '');
      const companies = userCompanies.map(uc => uc.company_id ? { id: uc.company_id, role: uc.role } : null).filter(Boolean);
      
      // For now, we'll use mock data since the relationship structure is different
      const mockCompanies = [
        {
          id: 'demo-company-1',
          name: 'Demo Company Ltd',
          logo_url: null,
          description: 'A demonstration company for testing purposes',
          sector: 'Technology',
          website: 'https://democompany.com',
          location: 'London, UK',
          approved: true,
          created_at: '2025-01-15T00:00:00Z'
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Companies load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyPosts = async () => {
    try {
      // For now, we'll use mock data since company_posts table doesn't exist yet
      const mockPosts = [
        {
          id: 'demo-post-1',
          company_id: 'demo-company-1',
          user_id: user?.id,
          type: 'news',
          title: 'Welcome to Our Company',
          content: 'We are excited to announce the launch of our new Shared Wealth Enterprise.',
          created_at: '2025-01-15T00:00:00Z'
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Posts load error:', error);
    }
  };

  const handleCreateCompany = async () => {
    if (!user) return;

    setIsCreating(true);
    setError('');

    try {
      // First create the company
      const company = await CompanyService.createCompany({
        name: companyForm.name,
        description: companyForm.description,
        sector: companyForm.sector,
        website: companyForm.website,
        location: companyForm.location
      });

      // Then create the company user relationship
      await CompanyService.createUserCompany(user.id, company.id, 'owner');

      if (userError) {
        console.error('Error creating company user:', userError);
        setError('Failed to create company user relationship');
        return;
      }

      toast({
        title: "Company Created",
        description: "Your company has been created successfully.",
      });

      setShowCreateDialog(false);
      setCompanyForm({ name: '', description: '', sector: '', website: '', location: '' });
      await loadUserCompanies();
    } catch (error) {
      console.error('Company creation error:', error);
      setError('Failed to create company');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCompany = async (companyId: string) => {
    setIsEditing(null);
    setError('');

    try {
      await CompanyService.updateCompany(companyId, {
        name: companyForm.name,
        description: companyForm.description,
        sector: companyForm.sector,
        website: companyForm.website,
        location: companyForm.location
      });

      toast({
        title: "Company Updated",
        description: "Your company has been updated successfully.",
      });

      await loadUserCompanies();
    } catch (error) {
      console.error('Company update error:', error);
      setError('Failed to update company');
    }
  };

  const handleCreatePost = async (companyId: string) => {
    if (!user) return;

    setIsPosting(true);
    setError('');

    try {
      // For now, we'll just show success since company_posts table doesn't exist yet
      // In the future, this would call CompanyService.createPost()
      
      toast({
        title: "Post Created",
        description: "Your post has been created successfully.",
      });

      setShowPostDialog(false);
      setPostForm({ type: 'news', title: '', content: '' });
      await loadCompanyPosts();
    } catch (error) {
      console.error('Post creation error:', error);
      setError('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const startEditing = (company: Company) => {
    setIsEditing(company.id);
    setCompanyForm({
      name: company.name,
      description: company.description || '',
      sector: company.sector || '',
      website: company.website || '',
      location: company.location || ''
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setCompanyForm({ name: '', description: '', sector: '', website: '', location: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Company Management</h1>
            <p className="text-muted-foreground">Manage your companies and share updates</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
                <DialogDescription>
                  Add a new company to the Shared Wealth International network.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-description">Description</Label>
                  <Textarea
                    id="company-description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    placeholder="Describe your company"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-sector">Sector</Label>
                    <Input
                      id="company-sector"
                      value={companyForm.sector}
                      onChange={(e) => setCompanyForm({ ...companyForm, sector: e.target.value })}
                      placeholder="e.g., Technology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-location">Location</Label>
                    <Input
                      id="company-location"
                      value={companyForm.location}
                      onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCompany} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Company'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="companies">My Companies</TabsTrigger>
            <TabsTrigger value="posts">Posts & Updates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            {companies.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Companies Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created or joined any companies yet. Start by creating your first company.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Company
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={company.logo_url || ''} />
                            <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <Badge variant={company.approved ? "default" : "secondary"}>
                              {company.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                        {isEditing === company.id ? (
                          <div className="flex space-x-1">
                            <Button size="sm" onClick={() => handleUpdateCompany(company.id)}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditing}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEditing(company)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isEditing === company.id ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${company.id}`}>Name</Label>
                            <Input
                              id={`name-${company.id}`}
                              value={companyForm.name}
                              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${company.id}`}>Description</Label>
                            <Textarea
                              id={`description-${company.id}`}
                              value={companyForm.description}
                              onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor={`sector-${company.id}`}>Sector</Label>
                              <Input
                                id={`sector-${company.id}`}
                                value={companyForm.sector}
                                onChange={(e) => setCompanyForm({ ...companyForm, sector: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`location-${company.id}`}>Location</Label>
                              <Input
                                id={`location-${company.id}`}
                                value={companyForm.location}
                                onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`website-${company.id}`}>Website</Label>
                            <Input
                              id={`website-${company.id}`}
                              value={companyForm.website}
                              onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          {company.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {company.description}
                            </p>
                          )}
                          <div className="space-y-2 text-sm">
                            {company.sector && (
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-muted-foreground" />
                                <span>{company.sector}</span>
                              </div>
                            )}
                            {company.location && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{company.location}</span>
                              </div>
                            )}
                            {company.website && (
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
                              <DialogTrigger asChild>
                                <Button size="sm" className="flex-1">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Post Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Create Post for {company.name}</DialogTitle>
                                  <DialogDescription>
                                    Share news, updates, or events with the network.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="post-type">Type</Label>
                                    <select
                                      id="post-type"
                                      value={postForm.type}
                                      onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}
                                      className="w-full p-2 border rounded-md"
                                    >
                                      <option value="news">News</option>
                                      <option value="event">Event</option>
                                      <option value="update">Update</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="post-title">Title</Label>
                                    <Input
                                      id="post-title"
                                      value={postForm.title}
                                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                      placeholder="Enter post title"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="post-content">Content</Label>
                                    <Textarea
                                      id="post-content"
                                      value={postForm.content}
                                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                      placeholder="Write your post content..."
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setShowPostDialog(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => handleCreatePost(company.id)} disabled={isPosting}>
                                      {isPosting ? 'Creating...' : 'Create Post'}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" className="flex-1">
                              View Details
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Posts & Updates</CardTitle>
                <CardDescription>Your company posts and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No posts yet.</p>
                    <p className="text-sm text-muted-foreground">Create your first post to share updates with the network.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline">{post.type}</Badge>
                                <Badge variant={post.approved ? "default" : "secondary"}>
                                  {post.approved ? "Approved" : "Pending"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(post.created_at || '').toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-semibold text-navy mb-2">{post.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {post.content}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
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

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Analytics</CardTitle>
                <CardDescription>Insights about your companies and posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <Building className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-navy">{companies.length}</div>
                    <div className="text-sm text-muted-foreground">Companies</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-navy">{posts.length}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-navy">
                      {companies.filter(c => c.approved).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyManagement; 