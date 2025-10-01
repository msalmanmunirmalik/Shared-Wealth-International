import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ReactionButton } from "@/components/social/ReactionButton";
import { FollowButton } from "@/components/social/FollowButton";
import { ShareButton } from "@/components/social/ShareButton";
import { FileUpload } from "@/components/files/FileUpload";
import { 
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Globe,
  Target,
  Heart,
  Share2,
  Edit, 
  Save, 
  X,
  Plus,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  Handshake,
  Lightbulb,
  Shield,
  FileText,
  Download,
  Upload,
  Settings,
  Eye,
  MessageCircle,
  Star,
  Zap,
  Leaf,
  Home,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  UserPlus,
  UserMinus,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Send,
  Image,
  Video,
  File,
  Search,
  Filter,
  MoreHorizontal,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Bell,
  Lock,
  Unlock,
  Crown,
  Gem,
  Flame,
  Sparkles
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  description: string;
  sector: string;
  location: string;
  website: string;
  logo_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  applicant_user_id: string;
  applicant_role?: string;
  applicant_position?: string;
  industry?: string;
  size?: string;
  is_shared_wealth_licensed?: boolean;
  license_number?: string;
  license_date?: string;
  countries?: string[];
  employees?: number;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  avatar_url?: string;
  start_date: string;
  stakeholder_percentage?: number;
  phantom_shares?: number;
  skills: string[];
  is_active: boolean;
}

interface CompanyPost {
  id: string;
  title: string;
  content: string;
  post_type: 'news' | 'stories' | 'discussions' | 'announcement';
  author_id: string;
  author_name: string;
  media_urls: string[];
  tags: string[];
  reactions: { [key: string]: number };
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

interface CompanyMetrics {
  totalEmployees: number;
  sharedWealthScore: number;
  communityImpact: number;
  sustainabilityRating: number;
  networkConnections: number;
  revenueSharing: number;
  stakeholderSatisfaction: number;
  innovationIndex: number;
  totalPosts: number;
  totalReactions: number;
  totalShares: number;
  engagementRate: number;
  revenueGrowth: number;
  profitMargin: number;
  debtRatio: number;
}

interface ImpactReport {
  id: string;
  period: string;
  socialImpact: number;
  environmentalImpact: number;
  economicImpact: number;
  communityEngagement: number;
  sharedValueCreated: number;
  educationAccess: number;
  studentSupport: number;
  globalReach: number;
  agentNetwork: number;
}

interface Partnership {
  id: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  partnership_type: 'education' | 'agent' | 'institution' | 'collaboration';
  status: 'active' | 'pending' | 'completed';
  start_date: string;
  value_generated: number;
  description: string;
}

const CompanyManagement = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // New comprehensive state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companyNews, setCompanyNews] = useState<CompanyPost[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [editingPost, setEditingPost] = useState<CompanyPost | null>(null);
  const [showAddPartnership, setShowAddPartnership] = useState(false);
  
  // Company metrics
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    totalEmployees: 0,
    sharedWealthScore: 0,
    communityImpact: 0,
    sustainabilityRating: 0,
    networkConnections: 0,
    revenueSharing: 0,
    stakeholderSatisfaction: 0,
    innovationIndex: 0,
    totalPosts: 0,
    totalReactions: 0,
    totalShares: 0,
    engagementRate: 0,
    revenueGrowth: 0,
    profitMargin: 0,
    debtRatio: 0
  });
  
  // Impact reports
  const [impactReports, setImpactReports] = useState<ImpactReport[]>([]);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    sector: '',
    location: '',
    website: '',
    applicant_role: '',
    applicant_position: '',
    is_shared_wealth_licensed: false,
    license_number: '',
    license_date: '',
    countries: [] as string[],
    employees: 0
  });

  // New form states
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    stakeholder_percentage: 0,
    phantom_shares: 0,
    skills: [] as string[],
    phone: '',
    salary: 0
  });

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'news' as const,
    tags: [] as string[],
    media_urls: [] as string[]
  });

  // File upload state for posts
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [newPartnership, setNewPartnership] = useState({
    company_name: '',
    partnership_type: 'collaboration' as const,
    description: '',
    value_generated: 0
  });

  useEffect(() => {
    if (companyId) {
      loadCompanyData();
      loadCompanyMetrics();
      loadImpactReports();
      loadEmployees();
      loadCompanyNews();
      loadPartnerships();
    }
  }, [companyId]);

  const loadCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getCompany(companyId!);
      if (response.success) {
        setCompany(response.data);
        setEditForm({
          name: response.data.name || '',
          description: response.data.description || '',
          sector: response.data.sector || '',
          location: response.data.location || '',
          website: response.data.website || '',
          applicant_role: response.data.applicant_role || '',
          applicant_position: response.data.applicant_position || '',
          is_shared_wealth_licensed: response.data.is_shared_wealth_licensed || false,
          license_number: response.data.license_number || '',
          license_date: response.data.license_date || '',
          countries: response.data.countries || [],
          employees: response.data.employees || 0
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
      toast({
        title: "Error",
        description: "Failed to load company data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    // Simulate loading employees - in real app, this would come from API
    setEmployees([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@letstern.com',
        role: 'CEO',
        department: 'Executive',
        position: 'Chief Executive Officer',
        start_date: '2023-01-15',
        stakeholder_percentage: 15,
        phantom_shares: 1000,
        skills: ['Leadership', 'Strategy', 'Business Development'],
        is_active: true
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@letstern.com',
        role: 'CTO',
        department: 'Technology',
        position: 'Chief Technology Officer',
        start_date: '2023-03-01',
        stakeholder_percentage: 10,
        phantom_shares: 750,
        skills: ['Software Development', 'Architecture', 'AI/ML'],
        is_active: true
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@letstern.com',
        role: 'Manager',
        department: 'Operations',
        position: 'Operations Manager',
        start_date: '2023-06-15',
        stakeholder_percentage: 5,
        phantom_shares: 500,
        skills: ['Operations', 'Process Improvement', 'Team Management'],
        is_active: true
      }
    ]);
  };

  const loadCompanyNews = async () => {
    try {
      // Load real company news from unified content API
      const response = await apiService.getContentByCompany(companyId!, { type: 'news' });
      if (response.success) {
        setCompanyNews(response.data);
      } else {
        // If no news yet, start with empty array
        setCompanyNews([]);
      }
    } catch (error) {
      console.error('Error loading company news:', error);
      setCompanyNews([]);
    }
  };

  const loadPartnerships = async () => {
    // Simulate loading partnerships
    setPartnerships([
      {
        id: '1',
        company_id: 'partner-1',
        company_name: 'Global Education Network',
        partnership_type: 'education',
        status: 'active',
        start_date: '2024-01-15',
        value_generated: 150000,
        description: 'Strategic partnership for global education expansion'
      },
      {
        id: '2',
        company_id: 'partner-2',
        company_name: 'Tech Innovation Hub',
        partnership_type: 'collaboration',
        status: 'active',
        start_date: '2023-11-01',
        value_generated: 75000,
        description: 'Technology collaboration and innovation partnership'
      }
    ]);
  };

  const loadCompanyMetrics = async () => {
    // Simulate loading metrics - in real app, this would come from API
    setMetrics({
      totalEmployees: 25,
      sharedWealthScore: 87,
      communityImpact: 92,
      sustainabilityRating: 78,
      networkConnections: 15,
      revenueSharing: 35,
      stakeholderSatisfaction: 89,
      innovationIndex: 81,
      totalPosts: 12,
      totalReactions: 156,
      totalShares: 45,
      engagementRate: 78,
      revenueGrowth: 25,
      profitMargin: 18,
      debtRatio: 12
    });
  };

  const loadImpactReports = async () => {
    // Simulate loading impact reports
    setImpactReports([
      {
        id: '1',
        period: 'Q3 2024',
        socialImpact: 88,
        environmentalImpact: 75,
        economicImpact: 82,
        communityEngagement: 91,
        sharedValueCreated: 156000,
        educationAccess: 95,
        studentSupport: 92,
        globalReach: 78,
        agentNetwork: 85
      },
      {
        id: '2',
        period: 'Q2 2024',
        socialImpact: 85,
        environmentalImpact: 72,
        economicImpact: 79,
        communityEngagement: 88,
        sharedValueCreated: 142000,
        educationAccess: 92,
        studentSupport: 89,
        globalReach: 75,
        agentNetwork: 82
      }
    ]);
  };

  // Employee CRUD functions
  const handleAddEmployee = async () => {
    try {
      const employee: Employee = {
        id: Date.now().toString(),
        ...newEmployee,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setEmployees([...employees, employee]);
      setNewEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        stakeholder_percentage: 0,
        phantom_shares: 0,
        skills: [],
        phone: '',
        salary: 0
      });
      setShowAddEmployee(false);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive"
      });
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      stakeholder_percentage: employee.stakeholder_percentage,
      phantom_shares: employee.phantom_shares,
      skills: employee.skills,
      phone: employee.phone || '',
      salary: employee.salary || 0
    });
    setShowEditEmployee(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;
    
    try {
      const updatedEmployee: Employee = {
        ...editingEmployee,
        ...newEmployee,
        updated_at: new Date().toISOString()
      };
      
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? updatedEmployee : emp
      ));
      
      setEditingEmployee(null);
      setShowEditEmployee(false);
      setNewEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        stakeholder_percentage: 0,
        phantom_shares: 0,
        skills: [],
        phone: '',
        salary: 0
      });
      
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive"
      });
    }
  };

  const handleToggleEmployeeStatus = async (employeeId: string) => {
    try {
      setEmployees(employees.map(emp => 
        emp.id === employeeId 
          ? { 
              ...emp, 
              status: emp.status === 'active' ? 'inactive' : 'active',
              updated_at: new Date().toISOString()
            }
          : emp
      ));

      toast({
        title: "Success",
        description: "Employee status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive"
      });
    }
  };

  const handleAddPost = async () => {
    try {
      // Create post via unified content API
      const response = await apiService.createContent({
        title: newPost.title,
        content: newPost.content,
        type: newPost.post_type,
          company_id: companyId,
        tags: newPost.tags,
        media_urls: newPost.media_urls,
        is_published: true
      });
      
      if (response.success) {
        // Reload company news to get the latest posts
        await loadCompanyNews();
        
        setNewPost({
          title: '',
          content: '',
          post_type: 'news',
          tags: [],
          media_urls: []
        });
        setUploadedFiles([]); // Reset uploaded files
        setShowAddPost(false);
      toast({
          title: "Success",
          description: "News & Update published successfully",
      });
      } else {
        throw new Error(response.message || 'Failed to create post');
      }
    } catch (error) {
        console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to publish news & update",
        variant: "destructive"
      });
    }
  };

  const handleEditPost = (post: CompanyPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      post_type: post.post_type,
      tags: post.tags,
      media_urls: post.media_urls || []
    });
    setUploadedFiles([]); // Reset uploaded files for edit
    setShowEditPost(true);
  };

  // File upload handlers
  const handleFileUploadComplete = (files: any[]) => {
    setUploadedFiles(files);
    const mediaUrls = files.map(file => file.publicUrl || file.url);
    setNewPost(prev => ({
      ...prev,
      media_urls: [...prev.media_urls, ...mediaUrls]
    }));
  };

  const handleFileUploadError = (error: string) => {
      toast({
      title: "Upload Error",
      description: error,
      variant: "destructive",
    });
  };

  const removeUploadedFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    const mediaUrls = newFiles.map(file => file.publicUrl || file.url);
    setNewPost(prev => ({
      ...prev,
      media_urls: mediaUrls
    }));
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      // Update post via unified content API
      const response = await apiService.updateContent(editingPost.id, {
        title: newPost.title,
        content: newPost.content,
        type: newPost.post_type,
        tags: newPost.tags,
        media_urls: newPost.media_urls,
        is_published: true
      });
      
      if (response.success) {
        // Reload company news to get the latest posts
        await loadCompanyNews();
        
        setEditingPost(null);
        setShowEditPost(false);
        setNewPost({
          title: '',
          content: '',
          post_type: 'news',
          tags: [],
          media_urls: []
        });
        setUploadedFiles([]); // Reset uploaded files
        
        toast({
          title: "Success",
          description: "News & Update updated successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update news & update",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      // Delete post via unified content API
      const response = await apiService.deleteContent(postId);
      
      if (response.success) {
        // Reload company news to get the latest posts
        await loadCompanyNews();
        
        toast({
          title: "Success",
          description: "News & Update deleted successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete news & update",
        variant: "destructive"
      });
    }
  };

  const handleTogglePostPublishStatus = async (postId: string) => {
    try {
      // Find the current post to get its current publish status
      const currentPost = companyNews.find(post => post.id === postId);
      if (!currentPost) {
        throw new Error('Post not found');
      }
      
      // Toggle publish status via unified content API
      const response = await apiService.toggleContentPublishStatus(postId, !currentPost.is_published);
      
      if (response.success) {
        // Reload company news to get the latest posts
        await loadCompanyNews();

      toast({
          title: "Success",
          description: `Post ${!currentPost.is_published ? 'published' : 'unpublished'} successfully`,
        });
      } else {
        throw new Error(response.message || 'Failed to update post status');
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update post status',
        variant: "destructive"
      });
    }
  };

  const handleAddPartnership = async () => {
    try {
      const partnership: Partnership = {
        id: Date.now().toString(),
        company_id: 'new-partner',
        ...newPartnership,
        status: 'pending',
        start_date: new Date().toISOString().split('T')[0]
      };
      setPartnerships([...partnerships, partnership]);
      setNewPartnership({
        company_name: '',
        partnership_type: 'collaboration',
        description: '',
        value_generated: 0
      });
      setShowAddPartnership(false);
      toast({
        title: "Success",
        description: "Partnership request sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create partnership",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiService.updateCompany(companyId!, editForm);
      if (response.success) {
        setCompany(response.data);
        setIsEditing(false);
      toast({
          title: "Success",
          description: "Company updated successfully",
      });
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    if (company) {
      setEditForm({
        name: company.name || '',
      description: company.description || '',
      sector: company.sector || '',
        location: company.location || '',
      website: company.website || '',
        applicant_role: company.applicant_role || '',
        applicant_position: company.applicant_position || ''
      });
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSectorIcon = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'technology': return <Zap className="w-5 h-5" />;
      case 'healthcare': return <Heart className="w-5 h-5" />;
      case 'environment': return <Leaf className="w-5 h-5" />;
      case 'finance': return <DollarSign className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (!company) {
  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600 mb-4">The company you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/user-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                {getSectorIcon(company.sector)}
              </div>
          <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(company.status)}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{company.sector}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{company.location}</span>
          </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Company
              </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
              <Button onClick={() => navigate('/user-dashboard')} variant="ghost">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="posts">News & Updates</TabsTrigger>
            <TabsTrigger value="network">Partnerships & Collaborations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
              <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Company Name</Label>
                  <Input
                              id="name"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                          <div>
                            <Label htmlFor="sector">Sector</Label>
                            <Input
                              id="sector"
                              value={editForm.sector}
                              onChange={(e) => setEditForm({...editForm, sector: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                  <Textarea
                            id="description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location">Location</Label>
                    <Input
                              id="location"
                              value={editForm.location}
                              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    />
                  </div>
                          <div>
                            <Label htmlFor="website">Website</Label>
                    <Input
                              id="website"
                              value={editForm.website}
                              onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                    />
                  </div>
                </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="applicant_role">Your Role</Label>
                  <Input
                              id="applicant_role"
                              value={editForm.applicant_role}
                              onChange={(e) => setEditForm({...editForm, applicant_role: e.target.value})}
                  />
                </div>
                          <div>
                            <Label htmlFor="applicant_position">Position</Label>
                            <Input
                              id="applicant_position"
                              value={editForm.applicant_position}
                              onChange={(e) => setEditForm({...editForm, applicant_position: e.target.value})}
                            />
                </div>
              </div>
        </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                            <p className="text-lg font-semibold">{company.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Sector</Label>
                            <p className="text-lg font-semibold">{company.sector}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Description</Label>
                          <p className="text-gray-700">{company.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Location</Label>
                            <p className="text-gray-700">{company.location}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Website</Label>
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                              {company.website}
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Your Role</Label>
                            <p className="text-gray-700">{company.applicant_role || 'Not specified'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Position</Label>
                            <p className="text-gray-700">{company.applicant_position || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Key Metrics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Shared Wealth Score</span>
                        <span className="text-sm font-bold text-green-600">{metrics.sharedWealthScore}%</span>
                      </div>
                      <Progress value={metrics.sharedWealthScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Community Impact</span>
                        <span className="text-sm font-bold text-blue-600">{metrics.communityImpact}%</span>
                      </div>
                      <Progress value={metrics.communityImpact} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Sustainability</span>
                        <span className="text-sm font-bold text-green-600">{metrics.sustainabilityRating}%</span>
                      </div>
                      <Progress value={metrics.sustainabilityRating} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Innovation Index</span>
                        <span className="text-sm font-bold text-purple-600">{metrics.innovationIndex}%</span>
                      </div>
                      <Progress value={metrics.innovationIndex} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Team & Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Employees</span>
                      <span className="text-lg font-bold">{metrics.totalEmployees}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network Connections</span>
                      <span className="text-lg font-bold">{metrics.networkConnections}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Stakeholder Satisfaction</span>
                      <span className="text-lg font-bold text-green-600">{metrics.stakeholderSatisfaction}%</span>
                    </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Employee Directory</h2>
              <Button onClick={() => setShowAddEmployee(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <Card key={employee.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                          <div>
                          <CardTitle className="text-lg">{employee.name}</CardTitle>
                          <CardDescription>{employee.position}</CardDescription>
                          </div>
                        </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="w-4 h-4" />
                            </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleEmployeeStatus(employee.id)}
                          >
                            {employee.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                      </div>
                      </div>
                    </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium">{employee.email}</span>
                          </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Department</span>
                      <span className="text-sm font-medium">{employee.department}</span>
                          </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium">{employee.phone || 'N/A'}</span>
                            </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Salary</span>
                      <span className="text-sm font-medium">${employee.salary?.toLocaleString() || 'N/A'}</span>
                            </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Stakeholder %</span>
                      <span className="text-sm font-medium text-green-600">{employee.stakeholder_percentage}%</span>
                          </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Phantom Shares</span>
                      <span className="text-sm font-medium">{employee.phantom_shares}</span>
                          </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Start Date</span>
                      <span className="text-sm font-medium">{new Date(employee.start_date).toLocaleDateString()}</span>
                        </div>
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                              </div>
                              </div>
                  </CardContent>
                </Card>
              ))}
                              </div>

            {employees.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first employee to the directory.</p>
                <Button onClick={() => setShowAddEmployee(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Employee
                </Button>
                              </div>
                            )}
          </TabsContent>

          {/* News & Updates Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">News & Updates</h2>
              <Button onClick={() => setShowAddPost(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create News & Update
              </Button>
                          </div>

            <div className="space-y-6">
              {companyNews.map((post) => (
                <Card key={post.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>
                            By {post.author_name} • {new Date(post.published_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{post.post_type.replace('_', ' ')}</Badge>
                        <Badge variant={post.is_published ? 'default' : 'secondary'}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePostPublishStatus(post.id)}
                          >
                            {post.is_published ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                                  </div>
                                  </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{post.content}</p>
                    
                    {/* Display media files */}
                    {post.media_urls && post.media_urls.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Attachments:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {post.media_urls.map((mediaUrl, index) => (
                            <div key={index} className="relative group">
                              {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img
                                  src={mediaUrl}
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                                  <File className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={() => window.open(mediaUrl, '_blank')}
                                >
                                  <Eye className="w-4 h-4 text-white" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <ReactionButton
                          contentId={post.id}
                          contentType="post"
                          initialReactions={post.reactions}
                        />
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments_count}
                        </Button>
                        <ShareButton
                          contentId={post.id}
                          contentType="post"
                          title={post.title}
                                    />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                                    </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {companyNews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No news & updates yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first news & update post.</p>
                <Button onClick={() => setShowAddPost(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Partnerships & Network</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Partnership
                                </Button>
                                  </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
              <CardHeader>
                  <CardTitle className="flex items-center">
                    <Handshake className="w-5 h-5 mr-2" />
                    Active Partnerships
                  </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                          <div>
                            <h4 className="font-semibold">{partnership.company_name}</h4>
                            <p className="text-sm text-gray-500">{partnership.partnership_type}</p>
                                  </div>
                                  </div>
                        <Badge variant={partnership.status === 'active' ? 'default' : 'secondary'}>
                          {partnership.status}
                                </Badge>
                              </div>
                      <p className="text-sm text-gray-600 mb-2">{partnership.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span>Value Generated: ${partnership.value_generated.toLocaleString()}</span>
                        <span>Started: {new Date(partnership.start_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                  ))}
                        </CardContent>
                      </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Network Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{partnerships.length}</div>
                    <p className="text-gray-600">Active Partnerships</p>
                  </div>
                  
                  <Separator />
                  
                        <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Education Partners</span>
                      <span className="text-sm font-bold">{partnerships.filter(p => p.partnership_type === 'education').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Agent Networks</span>
                      <span className="text-sm font-bold">{partnerships.filter(p => p.partnership_type === 'agent').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Institution Partners</span>
                      <span className="text-sm font-bold">{partnerships.filter(p => p.partnership_type === 'institution').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Collaborations</span>
                      <span className="text-sm font-bold">{partnerships.filter(p => p.partnership_type === 'collaboration').length}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${partnerships.reduce((sum, p) => sum + p.value_generated, 0).toLocaleString()}
                    </div>
                    <p className="text-gray-600">Total Value Generated</p>
                  </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{metrics.totalPosts}</div>
                      <p className="text-sm text-gray-600">Total Posts</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">{metrics.totalReactions}</div>
                      <p className="text-sm text-gray-600">Total Reactions</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{metrics.totalShares}</div>
                      <p className="text-sm text-gray-600">Total Shares</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{metrics.engagementRate}%</div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Social Media Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">LinkedIn Engagement</span>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-bold text-green-600">+23%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Twitter Reach</span>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-bold text-green-600">+18%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Facebook Shares</span>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-bold text-green-600">+31%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Achievements & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Shared Wealth Certified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gem className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Education Excellence Award</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Global Impact Recognition</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Student Success Partner</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Innovation Leader</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">Top 10%</div>
                    <p className="text-gray-600">Platform Ranking</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Growth Trends
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monthly Active Users</span>
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-bold text-green-600">+45%</span>
                  </div>
                  </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Content Engagement</span>
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-bold text-green-600">+32%</span>
                    </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network Growth</span>
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-bold text-green-600">+28%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Revenue Growth</span>
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-bold text-green-600">+{metrics.revenueGrowth}%</span>
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                          <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Shared Wealth Score</span>
                        <span className="text-sm font-bold text-green-600">{metrics.sharedWealthScore}%</span>
                      </div>
                      <Progress value={metrics.sharedWealthScore} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Community Impact</span>
                        <span className="text-sm font-bold text-blue-600">{metrics.communityImpact}%</span>
                      </div>
                      <Progress value={metrics.communityImpact} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Stakeholder Satisfaction</span>
                        <span className="text-sm font-bold text-purple-600">{metrics.stakeholderSatisfaction}%</span>
                      </div>
                      <Progress value={metrics.stakeholderSatisfaction} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Innovation Index</span>
                        <span className="text-sm font-bold text-orange-600">{metrics.innovationIndex}%</span>
                      </div>
                      <Progress value={metrics.innovationIndex} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </Tabs>

        {/* Add Employee Dialog */}
        <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to your company directory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                            <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="Enter full name"
                            />
                          </div>
                          <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Enter email address"
                            />
                          </div>
                            <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                              <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Enter job position"
                              />
                            </div>
                            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                              <Input
                  id="department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  placeholder="Enter department"
                              />
                            </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
                          </div>
                          <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                            <Input
                  id="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                  placeholder="Enter salary"
                            />
                          </div>
              <div className="space-y-2">
                <Label htmlFor="stakeholder_percentage">Stakeholder Percentage</Label>
                <Input
                  id="stakeholder_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={newEmployee.stakeholder_percentage}
                  onChange={(e) => setNewEmployee({...newEmployee, stakeholder_percentage: Number(e.target.value)})}
                  placeholder="Enter percentage"
                />
                        </div>
              <div className="space-y-2">
                <Label htmlFor="phantom_shares">Phantom Shares</Label>
                <Input
                  id="phantom_shares"
                  type="number"
                  value={newEmployee.phantom_shares}
                  onChange={(e) => setNewEmployee({...newEmployee, phantom_shares: Number(e.target.value)})}
                  placeholder="Enter phantom shares"
                />
                              </div>
                              </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddEmployee(false)}>
                Cancel
                                </Button>
              <Button onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={showEditEmployee} onOpenChange={setShowEditEmployee}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
                                  <DialogDescription>
                Update employee information.
                                  </DialogDescription>
                                </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="Enter full name"
                />
                                  </div>
                                  <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                                    <Input
                  id="edit-email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Enter email address"
                                    />
                                  </div>
                                  <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Enter job position"
                                    />
                                  </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                  placeholder="Enter salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stakeholder_percentage">Stakeholder Percentage</Label>
                <Input
                  id="edit-stakeholder_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={newEmployee.stakeholder_percentage}
                  onChange={(e) => setNewEmployee({...newEmployee, stakeholder_percentage: Number(e.target.value)})}
                  placeholder="Enter percentage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phantom_shares">Phantom Shares</Label>
                <Input
                  id="edit-phantom_shares"
                  type="number"
                  value={newEmployee.phantom_shares}
                  onChange={(e) => setNewEmployee({...newEmployee, phantom_shares: Number(e.target.value)})}
                  placeholder="Enter phantom shares"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditEmployee(false)}>
                                      Cancel
                                    </Button>
              <Button onClick={handleUpdateEmployee}>
                Update Employee
                                    </Button>
            </DialogFooter>
                              </DialogContent>
                            </Dialog>

        {/* Add Post Dialog */}
        <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create News & Update</DialogTitle>
              <DialogDescription>
                Create a new news & update post for your company.
              </DialogDescription>
            </DialogHeader>
                  <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-post-title">Title</Label>
                <Input
                  id="add-post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
                          </div>
              <div className="space-y-2">
                <Label htmlFor="add-post-type">Type</Label>
                <Select value={newPost.post_type} onValueChange={(value) => setNewPost({...newPost, post_type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="discussions">Discussions</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-post-content">Content</Label>
                <Textarea
                  id="add-post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Write your post content here..."
                  rows={6}
                />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="add-post-tags">Tags (comma-separated)</Label>
                <Input
                  id="add-post-tags"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)})}
                  placeholder="e.g., sustainability, innovation, partnership"
                />
                              </div>
              
              {/* Media Upload Section */}
              <div className="space-y-2">
                <Label>Media Files</Label>
                <FileUpload
                  uploadType="image"
                  multiple={true}
                  maxFiles={5}
                  relatedEntityType="post"
                  relatedEntityId={companyId}
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  className="w-full"
                />
                
                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-blue-600" />
                            <span className="text-sm truncate">{file.originalName}</span>
                            </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="w-4 h-4" />
                            </Button>
                          </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddPost(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPost}>
                Create Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog open={showEditPost} onOpenChange={setShowEditPost}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit News & Update</DialogTitle>
              <DialogDescription>
                Update your news & update post.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-post-title">Title</Label>
                <Input
                  id="edit-post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="edit-post-type">Type</Label>
                <Select value={newPost.post_type} onValueChange={(value) => setNewPost({...newPost, post_type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="discussions">Discussions</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
              <div className="space-y-2">
                <Label htmlFor="edit-post-content">Content</Label>
                <Textarea
                  id="edit-post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Enter post content"
                  rows={6}
                />
                    </div>
              <div className="space-y-2">
                <Label htmlFor="edit-post-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-post-tags"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              {/* Media Upload Section */}
              <div className="space-y-2">
                <Label>Media Files</Label>
                <FileUpload
                  uploadType="image"
                  multiple={true}
                  maxFiles={5}
                  relatedEntityType="post"
                  relatedEntityId={companyId}
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  className="w-full"
                />
                
                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-blue-600" />
                            <span className="text-sm truncate">{file.originalName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditPost(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePost}>
                Update Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompanyManagement; 