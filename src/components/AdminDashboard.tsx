import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { 
  Users, 
  Building, 
  FileText, 
  DollarSign, 
  BookOpen, 
  MessageSquare,
  Settings,
  Shield,
  Crown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Globe,
  Database,
  LogOut,
  Loader2,
  PieChart,
  Trophy,
  LineChart,
  MapPin,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { Navigate } from "react-router-dom";

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
}

interface Analytics {
  platformGrowth: {
    totalUsers: number;
    totalCompanies: number;
    totalFundingOpportunities: number;
    totalApplications: number;
  };
  userEngagement: {
    activeUsers: number;
    newUsersThisMonth: number;
    userGrowthRate: number;
  };
  companyMetrics: {
    pendingCompanies: number;
    approvedCompanies: number;
    rejectedCompanies: number;
    averageApprovalTime: number;
  };
  fundingMetrics: {
    totalOpportunities: number;
    totalApplications: number;
    applicationRate: number;
    successRate: number;
  };
  sectorDistribution: Array<{ sector: string; count: number }>;
  geographicDistribution: Array<{ location: string; count: number }>;
  monthlyGrowth: Array<{ month: string; users: number; companies: number }>;
}

interface FundingAnalytics {
  opportunities: Array<{
    id: string;
    title: string;
    category: string;
    amount: string;
    deadline: string;
    applicationCount: number;
    status: string;
  }>;
  categories: Array<{ category: string; count: number }>;
  trends: Array<{ month: string; applications: number; opportunities: number }>;
}

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

interface Company {
  id: string;
  name: string;
  description: string;
  sector: string;
  location: string;
  website?: string;
  status: string;
  created_at: string;
}

interface FundingOpportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string;
  url: string;
  status: string;
  created_at: string;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  status: string;
  published_at?: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  status: string;
  created_at: string;
}

interface SystemHealth {
  server: {
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      arrayBuffers: number;
    };
    cpu: {
      loadAverage: number[];
      usage: number;
    };
    platform: string;
    nodeVersion: string;
    timestamp: string;
  };
  database: {
    connected: boolean;
    responseTime: number;
    activeConnections: number;
    totalQueries: number;
    errorRate: number;
  };
  api: {
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    slowRequestPercentage: number;
    requestsPerMinute: number;
  };
  security: {
    failedLogins: number;
    blockedRequests: number;
    suspiciousActivity: number;
    lastSecurityEvent: string;
  };
}

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  averageResponseTime: number;
  totalRequests: number;
  errorRate: number;
  lastAccessed: string;
}

interface DatabaseMetrics {
  tableName: string;
  rowCount: number;
  size: string;
  lastUpdated: string;
  indexCount: number;
}

interface SecurityEvent {
  id: string;
  type: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: string;
}

interface FundingApplication {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  company_id: string;
  application_data: {
    project_title: string;
    project_description: string;
    requested_amount: number;
    project_duration: string;
    team_size: number;
    previous_experience: string;
    business_plan: string;
    financial_projections: string;
    sustainability_plan: string;
    expected_outcomes: string;
  };
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  approved_at?: string;
  funded_at?: string;
  completed_at?: string;
  review_notes?: string;
  rejection_reason?: string;
  funding_amount?: number;
  created_at: string;
  updated_at: string;
}

interface FundingAnalytics {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalFundingDisbursed: number;
  averageApplicationValue: number;
  successRate: number;
  applicationsByCategory: Array<{ category: string; count: number; amount: number }>;
  applicationsByStatus: Array<{ status: string; count: number }>;
  monthlyTrends: Array<{ month: string; applications: number; approvals: number; funding: number }>;
  topApplicants: Array<{ company_id: string; company_name: string; applications: number; approvals: number; total_funding: number }>;
}

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [fundingAnalytics, setFundingAnalytics] = useState<FundingAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [fundingOpportunities, setFundingOpportunities] = useState<FundingOpportunity[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetrics[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [fundingApplications, setFundingApplications] = useState<FundingApplication[]>([]);
  
  // Modal states
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false);
  const [createFundingOpen, setCreateFundingOpen] = useState(false);
  const [createNewsOpen, setCreateNewsOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [userForm, setUserForm] = useState({ email: '', password: '', role: 'user' });
  const [currentCountry, setCurrentCountry] = useState('');
  const [companyForm, setCompanyForm] = useState({ 
    name: '', 
    description: '', 
    industry: '', 
    size: 'small', 
    location: '', 
    website: '',
    // Additional comprehensive fields
    sector: '',
    countries: [] as string[], // Changed from single country to array
    employees: '',
    applicant_role: '',
    applicant_position: '',
    is_shared_wealth_licensed: false,
    license_number: '',
    license_date: '',
    logo: null as File | null,
    logo_url: ''
  });
  const [fundingForm, setFundingForm] = useState({
    title: '',
    category: '',
    description: '',
    amount: '',
    deadline: '',
    eligibility: '',
    url: '',
    status: 'active'
  });
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    status: 'draft'
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: 100,
    status: 'upcoming'
  });

  useEffect(() => {
    if (user && !isAdmin) {
      setError('You do not have admin privileges. Please contact a system administrator.');
    } else if (user && isAdmin) {
      loadAdminData();
      toast({
        title: "Welcome to Admin Dashboard",
        description: "You have successfully accessed the admin panel.",
      });
    }
  }, [user, isAdmin, toast]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading admin data...');
      
      // Helper function to add delay between API calls
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Load critical data first (batch 1)
      console.log('📊 Loading critical data...');
      const [statsData, companiesData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getCompanies()
      ]);
      
      setStats(statsData);
      setCompanies(companiesData);
      
      // Small delay to prevent rate limiting
      await delay(100);
      
      // Load user and analytics data (batch 2)
      console.log('👥 Loading user and analytics data...');
      const [usersData, analyticsData] = await Promise.all([
        apiService.getAdminUsers(),
        apiService.getAnalytics()
      ]);
      
      setUsers(usersData);
      setAnalytics(analyticsData);
      
      await delay(100);
      
      // Load content data (batch 3)
      console.log('📰 Loading content data...');
      const [newsData, eventsData, fundingData] = await Promise.all([
        apiService.getNewsArticles(),
        apiService.getEvents(),
        apiService.getFundingOpportunities()
      ]);
      
      setNewsArticles(newsData);
      setEvents(eventsData);
      setFundingOpportunities(fundingData);
      
      await delay(100);
      
      // Load funding analytics (batch 4)
      console.log('💰 Loading funding analytics...');
      const [fundingAnalyticsData, applicationsData] = await Promise.all([
        apiService.getFundingAnalytics(),
        apiService.getFundingApplications()
      ]);
      
      setFundingAnalytics(fundingAnalyticsData);
      setFundingApplications(applicationsData);
      
      await delay(100);
      
      // Load monitoring data (batch 5)
      console.log('📊 Loading monitoring data...');
      const [healthData, performanceData, databaseData, securityData] = await Promise.all([
        apiService.getSystemHealth(),
        apiService.getPerformanceMetrics(),
        apiService.getDatabaseMetrics(),
        apiService.getSecurityEvents(20)
      ]);
      
      setSystemHealth(healthData);
      setPerformanceMetrics(performanceData);
      setDatabaseMetrics(databaseData);
      setSecurityEvents(securityData);
      
      console.log('✅ Admin data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      await loadAdminData(); // Reload data
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      await apiService.createUser(userForm.email, userForm.password, userForm.role);
      await loadAdminData(); // Reload data
      setCreateUserOpen(false);
      setUserForm({ email: '', password: '', role: 'user' });
      toast({
        title: "Success",
        description: `User ${userForm.email} created successfully. Credentials sent to email.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      await apiService.deleteUser(userId);
      await loadAdminData(); // Reload data
      toast({
        title: "Success",
        description: `User ${userEmail} deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCompany = async () => {
    try {
      // Prepare comprehensive company data for admin creation
      const companyData = {
        name: companyForm.name,
        description: companyForm.description,
        industry: companyForm.sector || companyForm.industry, // Use sector if available, fallback to industry
        location: companyForm.location,
        website: companyForm.website,
        size: companyForm.employees ? (parseInt(companyForm.employees) < 50 ? 'small' : parseInt(companyForm.employees) < 200 ? 'medium' : 'large') : companyForm.size,
        status: 'approved', // Admin-created companies are approved by default
        // Additional comprehensive fields
        countries: companyForm.countries,
        employees: companyForm.employees ? parseInt(companyForm.employees) : null,
        is_shared_wealth_licensed: companyForm.is_shared_wealth_licensed,
        license_number: companyForm.license_number || null,
        license_date: companyForm.license_date || null,
        applicant_role: companyForm.applicant_role || 'admin',
        applicant_position: companyForm.applicant_position || 'Administrator',
        // Admin creation metadata
        created_by_admin: true,
        admin_notes: 'Company created directly by admin',
        // Logo data
        logo_file: companyForm.logo,
        logo_url: companyForm.logo_url
      };

      await apiService.createCompany(companyData);
      await loadAdminData(); // Reload data
      setCreateCompanyOpen(false);
      setCurrentCountry('');
      setCompanyForm({ 
        name: '', 
        description: '', 
        industry: '', 
        size: 'small', 
        location: '', 
        website: '',
        sector: '',
        countries: [],
        employees: '',
        applicant_role: '',
        applicant_position: '',
        is_shared_wealth_licensed: false,
        license_number: '',
        license_date: '',
        logo: null,
        logo_url: ''
      });
      toast({
        title: "Success",
        description: `Company ${companyForm.name} created successfully.`,
      });
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    try {
      await apiService.deleteCompany(companyId);
      await loadAdminData(); // Reload data
      toast({
        title: "Success",
        description: `Company ${companyName} deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApproveCompany = async (companyId: string, companyName: string) => {
    try {
      await apiService.approveCompany(companyId);
      await loadAdminData(); // Reload data
      toast({
        title: "Success",
        description: `Company ${companyName} approved successfully.`,
      });
    } catch (error) {
      console.error('Error approving company:', error);
      toast({
        title: "Error",
        description: "Failed to approve company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectCompany = async (companyId: string, companyName: string) => {
    try {
      await apiService.rejectCompany(companyId);
      await loadAdminData(); // Reload data
      toast({
        title: "Success",
        description: `Company ${companyName} rejected.`,
      });
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast({
        title: "Error",
        description: "Failed to reject company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading only if we don't have user info yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900">Loading Admin Dashboard...</h2>
          <p className="text-blue-700 mt-2">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900">Loading Admin Data...</h2>
          <p className="text-blue-700 mt-2">Please wait while we fetch the latest information.</p>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-blue-900">Access Denied</CardTitle>
            <CardDescription className="text-blue-600">
              {error || "You don't have permission to access the admin dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Navigate to="/" replace />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white border-b border-blue-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Administrator Dashboard</h1>
                <p className="text-sm text-blue-600">Platform Management & Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 shadow-sm">
                Administrator
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Analytics</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Content</TabsTrigger>
            <TabsTrigger value="funding" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Funding</TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Companies</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Users</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-blue-600">Registered users</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Total Companies</CardTitle>
                  <Building className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{stats?.totalCompanies || 0}</div>
                  <p className="text-xs text-green-600">Registered companies</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700">Pending Companies</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">{stats?.pendingCompanies || 0}</div>
                  <p className="text-xs text-amber-600">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-700">Approved Companies</CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900">{stats?.approvedCompanies || 0}</div>
                  <p className="text-xs text-emerald-600">Active companies</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Quick Actions</CardTitle>
                <CardDescription className="text-blue-600">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab("users")}
                    className="h-auto p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Manage Users</div>
                      <div className="text-xs opacity-90">View and edit user accounts</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("companies")}
                    className="h-auto p-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Building className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Manage Companies</div>
                      <div className="text-xs opacity-90">Review company applications</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={loadAdminData}
                    className="h-auto p-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Refresh Data</div>
                      <div className="text-xs opacity-90">Update all statistics</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Growth */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">{analytics?.platformGrowth.totalUsers || 0}</div>
                      <div className="text-sm text-blue-600">Total Users</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-900">{analytics?.platformGrowth.totalCompanies || 0}</div>
                      <div className="text-sm text-green-600">Total Companies</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-900">{analytics?.platformGrowth.totalFundingOpportunities || 0}</div>
                      <div className="text-sm text-purple-600">Funding Opportunities</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-900">{analytics?.platformGrowth.totalApplications || 0}</div>
                      <div className="text-sm text-orange-600">Applications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Engagement */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">Active Users (30 days)</span>
                      <span className="text-lg font-bold text-green-900">{analytics?.userEngagement.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">New Users This Month</span>
                      <span className="text-lg font-bold text-blue-900">{analytics?.userEngagement.newUsersThisMonth || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">Growth Rate</span>
                      <span className="text-lg font-bold text-purple-900">{analytics?.userEngagement.userGrowthRate || 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Metrics */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Company Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-amber-900">{analytics?.companyMetrics.pendingCompanies || 0}</div>
                    <div className="text-sm text-amber-600">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{analytics?.companyMetrics.approvedCompanies || 0}</div>
                    <div className="text-sm text-green-600">Approved</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-red-900">{analytics?.companyMetrics.rejectedCompanies || 0}</div>
                    <div className="text-sm text-red-600">Rejected</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">{analytics?.companyMetrics.averageApprovalTime || 0}</div>
                    <div className="text-sm text-blue-600">Avg. Approval (days)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funding Analytics */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Funding Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">{analytics?.fundingMetrics.totalOpportunities || 0}</div>
                    <div className="text-sm text-purple-600">Total Opportunities</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">{analytics?.fundingMetrics.totalApplications || 0}</div>
                    <div className="text-sm text-blue-600">Total Applications</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{analytics?.fundingMetrics.applicationRate || 0}%</div>
                    <div className="text-sm text-green-600">Application Rate</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-900">{analytics?.fundingMetrics.successRate || 0}%</div>
                    <div className="text-sm text-orange-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sector Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                <CardHeader>
                  <CardTitle className="text-indigo-900 flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Sector Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics?.sectorDistribution.map((sector, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="text-sm font-medium">{sector.sector}</span>
                        <Badge variant="secondary">{sector.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
                <CardHeader>
                  <CardTitle className="text-teal-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics?.geographicDistribution.map((location, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="text-sm font-medium">{location.location}</span>
                        <Badge variant="secondary">{location.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Growth Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100">
              <CardHeader>
                <CardTitle className="text-rose-900 flex items-center">
                  <LineChart className="w-5 h-5 mr-2" />
                  Monthly Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.monthlyGrowth.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-900">{month.users}</div>
                          <div className="text-xs text-blue-600">Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-900">{month.companies}</div>
                          <div className="text-xs text-green-600">Companies</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Content Management Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funding Opportunities */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="text-purple-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Funding Opportunities
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Manage funding opportunities and applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Opportunities</span>
                      <Badge variant="secondary">{fundingOpportunities.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active</span>
                      <Badge variant="secondary">{fundingOpportunities.filter(f => f.status === 'active').length}</Badge>
                    </div>
                    <Dialog open={createFundingOpen} onOpenChange={setCreateFundingOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Opportunity
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create Funding Opportunity</DialogTitle>
                          <DialogDescription>
                            Add a new funding opportunity to the platform.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funding-title" className="text-right">Title</Label>
                            <Input
                              id="funding-title"
                              value={fundingForm.title}
                              onChange={(e) => setFundingForm({...fundingForm, title: e.target.value})}
                              className="col-span-3"
                              placeholder="Funding opportunity title"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funding-category" className="text-right">Category</Label>
                            <Input
                              id="funding-category"
                              value={fundingForm.category}
                              onChange={(e) => setFundingForm({...fundingForm, category: e.target.value})}
                              className="col-span-3"
                              placeholder="e.g., Innovation, Sustainability"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funding-description" className="text-right">Description</Label>
                            <Textarea
                              id="funding-description"
                              value={fundingForm.description}
                              onChange={(e) => setFundingForm({...fundingForm, description: e.target.value})}
                              className="col-span-3"
                              placeholder="Detailed description"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funding-amount" className="text-right">Amount</Label>
                            <Input
                              id="funding-amount"
                              value={fundingForm.amount}
                              onChange={(e) => setFundingForm({...fundingForm, amount: e.target.value})}
                              className="col-span-3"
                              placeholder="e.g., €50,000 - €100,000"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funding-deadline" className="text-right">Deadline</Label>
                            <Input
                              id="funding-deadline"
                              type="date"
                              value={fundingForm.deadline}
                              onChange={(e) => setFundingForm({...fundingForm, deadline: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funding-url" className="text-right">URL</Label>
                            <Input
                              id="funding-url"
                              value={fundingForm.url}
                              onChange={(e) => setFundingForm({...fundingForm, url: e.target.value})}
                              className="col-span-3"
                              placeholder="Application URL"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateFundingOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={async () => {
                            try {
                              await apiService.createFundingOpportunity(fundingForm);
                              await loadAdminData();
                              setCreateFundingOpen(false);
                              setFundingForm({
                                title: '', category: '', description: '', amount: '', 
                                deadline: '', eligibility: '', url: '', status: 'active'
                              });
                              toast({
                                title: "Success",
                                description: "Funding opportunity created successfully.",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to create funding opportunity.",
                                variant: "destructive",
                              });
                            }
                          }}>
                            Create
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* News Articles */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    News & Updates
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Manage platform news and announcements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Articles</span>
                      <Badge variant="secondary">{newsArticles.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Published</span>
                      <Badge variant="secondary">{newsArticles.filter(n => n.status === 'published').length}</Badge>
                    </div>
                    <Dialog open={createNewsOpen} onOpenChange={setCreateNewsOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Article
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create News Article</DialogTitle>
                          <DialogDescription>
                            Create a new news article or announcement.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="news-title" className="text-right">Title</Label>
                            <Input
                              id="news-title"
                              value={newsForm.title}
                              onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                              className="col-span-3"
                              placeholder="Article title"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="news-category" className="text-right">Category</Label>
                            <Input
                              id="news-category"
                              value={newsForm.category}
                              onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                              className="col-span-3"
                              placeholder="e.g., Announcement, Update"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="news-content" className="text-right">Content</Label>
                            <Textarea
                              id="news-content"
                              value={newsForm.content}
                              onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                              className="col-span-3"
                              rows={6}
                              placeholder="Article content"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="news-author" className="text-right">Author</Label>
                            <Input
                              id="news-author"
                              value={newsForm.author}
                              onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                              className="col-span-3"
                              placeholder="Author name"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="news-status" className="text-right">Status</Label>
                            <Select value={newsForm.status} onValueChange={(value) => setNewsForm({...newsForm, status: value})}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateNewsOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={async () => {
                            try {
                              await apiService.createNewsArticle(newsForm);
                              await loadAdminData();
                              setCreateNewsOpen(false);
                              setNewsForm({
                                title: '', content: '', category: '', author: '', status: 'draft'
                              });
                              toast({
                                title: "Success",
                                description: "News article created successfully.",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to create news article.",
                                variant: "destructive",
                              });
                            }
                          }}>
                            Create
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Events
                  </CardTitle>
                  <CardDescription className="text-orange-600">
                    Manage platform events and workshops
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Events</span>
                      <Badge variant="secondary">{events.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Upcoming</span>
                      <Badge variant="secondary">{events.filter(e => e.status === 'upcoming').length}</Badge>
                    </div>
                    <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create Event</DialogTitle>
                          <DialogDescription>
                            Create a new platform event or workshop.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-title" className="text-right">Title</Label>
                            <Input
                              id="event-title"
                              value={eventForm.title}
                              onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                              className="col-span-3"
                              placeholder="Event title"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-description" className="text-right">Description</Label>
                            <Textarea
                              id="event-description"
                              value={eventForm.description}
                              onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                              className="col-span-3"
                              rows={4}
                              placeholder="Event description"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-start" className="text-right">Start Date</Label>
                            <Input
                              id="event-start"
                              type="datetime-local"
                              value={eventForm.start_date}
                              onChange={(e) => setEventForm({...eventForm, start_date: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-end" className="text-right">End Date</Label>
                            <Input
                              id="event-end"
                              type="datetime-local"
                              value={eventForm.end_date}
                              onChange={(e) => setEventForm({...eventForm, end_date: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-location" className="text-right">Location</Label>
                            <Input
                              id="event-location"
                              value={eventForm.location}
                              onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                              className="col-span-3"
                              placeholder="Event location"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-participants" className="text-right">Max Participants</Label>
                            <Input
                              id="event-participants"
                              type="number"
                              value={eventForm.max_participants}
                              onChange={(e) => setEventForm({...eventForm, max_participants: parseInt(e.target.value)})}
                              className="col-span-3"
                              placeholder="100"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateEventOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={async () => {
                            try {
                              await apiService.createEvent(eventForm);
                              await loadAdminData();
                              setCreateEventOpen(false);
                              setEventForm({
                                title: '', description: '', start_date: '', end_date: '', 
                                location: '', max_participants: 100, status: 'upcoming'
                              });
                              toast({
                                title: "Success",
                                description: "Event created successfully.",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to create event.",
                                variant: "destructive",
                              });
                            }
                          }}>
                            Create
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funding Opportunities List */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-900">Recent Funding Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fundingOpportunities.slice(0, 5).map((opportunity) => (
                      <div key={opportunity.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{opportunity.title}</div>
                        <div className="text-xs text-gray-600">{opportunity.category}</div>
                        <div className="text-xs text-gray-500">{opportunity.amount}</div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant={opportunity.status === 'active' ? 'default' : 'secondary'}>
                            {opportunity.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Funding Opportunity</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{opportunity.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={async () => {
                                    try {
                                      await apiService.deleteFundingOpportunity(opportunity.id);
                                      await loadAdminData();
                                      toast({
                                        title: "Success",
                                        description: "Funding opportunity deleted successfully.",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Failed to delete funding opportunity.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* News Articles List */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-900">Recent News Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {newsArticles.slice(0, 5).map((article) => (
                      <div key={article.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{article.title}</div>
                        <div className="text-xs text-gray-600">{article.category}</div>
                        <div className="text-xs text-gray-500">by {article.author}</div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                            {article.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{article.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={async () => {
                                    try {
                                      await apiService.deleteNewsArticle(article.id);
                                      await loadAdminData();
                                      toast({
                                        title: "Success",
                                        description: "News article deleted successfully.",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Failed to delete news article.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events List */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-orange-900">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.slice(0, 5).map((event) => (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-gray-600">{event.location}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={async () => {
                                    try {
                                      await apiService.deleteEvent(event.id);
                                      await loadAdminData();
                                      toast({
                                        title: "Success",
                                        description: "Event deleted successfully.",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Failed to delete event.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            {/* Funding Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Total Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">
                    {fundingAnalytics?.totalApplications || 0}
                  </div>
                  <div className="text-sm text-green-600">
                    {fundingAnalytics?.pendingApplications || 0} pending review
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">
                    {fundingAnalytics?.approvedApplications || 0}
                  </div>
                  <div className="text-sm text-blue-600">
                    {fundingAnalytics?.successRate || 0}% success rate
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="text-purple-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Total Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">
                    €{(fundingAnalytics?.totalFundingDisbursed || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">
                    Avg: €{(fundingAnalytics?.averageApplicationValue || 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="text-orange-900 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Rejected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">
                    {fundingAnalytics?.rejectedApplications || 0}
                  </div>
                  <div className="text-sm text-orange-600">
                    {fundingAnalytics?.totalApplications ? Math.round(((fundingAnalytics?.rejectedApplications || 0) / fundingAnalytics.totalApplications) * 100) : 0}% rejection rate
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Funding Applications
                </CardTitle>
                <CardDescription>
                  Manage and review funding applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fundingApplications.slice(0, 10).map((application) => (
                    <div key={application.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{application.application_data?.project_title || 'Untitled Project'}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Requested: €{application.application_data?.requested_amount?.toLocaleString() || '0'}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Submitted: {new Date(application.submitted_at).toLocaleDateString()}
                          </div>
                          {application.funding_amount && (
                            <div className="text-sm text-green-600 mt-1">
                              Approved Amount: €{application.funding_amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            application.status === 'approved' ? 'default' :
                            application.status === 'rejected' ? 'destructive' :
                            application.status === 'funded' ? 'default' :
                            'secondary'
                          }>
                            {application.status}
                          </Badge>
                          <div className="flex space-x-1">
                            {application.status === 'submitted' && (
                              <>
                                <Button size="sm" variant="outline" onClick={async () => {
                                  try {
                                    const fundingAmount = application.application_data?.requested_amount || 0;
                                    await apiService.approveFundingApplication(application.id, fundingAmount, 'Approved by admin');
                                    await loadAdminData();
                                    toast({
                                      title: "Success",
                                      description: "Application approved successfully.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to approve application.",
                                      variant: "destructive",
                                    });
                                  }
                                }}>
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={async () => {
                                  try {
                                    await apiService.rejectFundingApplication(application.id, 'Rejected by admin');
                                    await loadAdminData();
                                    toast({
                                      title: "Success",
                                      description: "Application rejected successfully.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to reject application.",
                                      variant: "destructive",
                                    });
                                  }
                                }}>
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this funding application? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={async () => {
                                    try {
                                      await apiService.deleteFundingApplication(application.id);
                                      await loadAdminData();
                                      toast({
                                        title: "Success",
                                        description: "Application deleted successfully.",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Failed to delete application.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funding Opportunities with Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Funding Opportunities
                </CardTitle>
                <CardDescription>
                  View funding opportunities with application statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fundingOpportunities.slice(0, 6).map((opportunity) => (
                    <div key={opportunity.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">{opportunity.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{opportunity.category}</div>
                      <div className="text-xs text-gray-500 mt-1">{opportunity.amount}</div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-600">
                          {opportunity.current_applications || 0} applications
                        </div>
                        <Badge variant={opportunity.status === 'active' ? 'default' : 'secondary'}>
                          {opportunity.status}
                        </Badge>
                      </div>
                      {opportunity.success_rate !== undefined && (
                        <div className="text-xs text-green-600 mt-1">
                          {opportunity.success_rate.toFixed(1)}% success rate
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Applications by Category */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Applications by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fundingAnalytics?.applicationsByCategory?.map((category, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">{category.category}</div>
                      <div className="text-lg font-bold text-blue-900">{category.count} applications</div>
                      <div className="text-sm text-green-600">€{category.amount.toLocaleString()} total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Applicants */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Top Applicants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fundingAnalytics?.topApplicants?.slice(0, 5).map((applicant, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{applicant.company_name}</div>
                          <div className="text-xs text-gray-600">
                            {applicant.applications} applications • {applicant.approvals} approvals
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-900">
                            €{applicant.total_funding.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">total funding</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server Health */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Server Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">
                        {systemHealth ? Math.round(systemHealth.server.uptime / 3600) : 0}h
                      </div>
                      <div className="text-sm text-blue-600">Uptime</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-900">
                        {systemHealth ? Math.round(systemHealth.server.memory.heapUsed / 1024 / 1024) : 0}MB
                      </div>
                      <div className="text-sm text-green-600">Memory Used</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-900">
                        {systemHealth ? Math.round(systemHealth.server.cpu.usage) : 0}%
                      </div>
                      <div className="text-sm text-purple-600">CPU Usage</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-900">
                        {systemHealth?.server.nodeVersion || 'N/A'}
                      </div>
                      <div className="text-sm text-orange-600">Node Version</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Database Health */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">Connection Status</span>
                      <Badge variant={systemHealth?.database.connected ? 'default' : 'destructive'}>
                        {systemHealth?.database.connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-lg font-bold text-green-900">
                        {systemHealth?.database.responseTime || 0}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-lg font-bold text-red-900">
                        {systemHealth?.database.errorRate || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium">Total Queries</span>
                      <span className="text-lg font-bold text-blue-900">
                        {systemHealth?.database.totalQueries || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Performance */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  API Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">{systemHealth?.api.totalRequests || 0}</div>
                    <div className="text-sm text-purple-600">Total Requests</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-red-900">{systemHealth?.api.totalErrors || 0}</div>
                    <div className="text-sm text-red-600">Total Errors</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">{systemHealth?.api.averageResponseTime || 0}ms</div>
                    <div className="text-sm text-blue-600">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-900">{systemHealth?.api.requestsPerMinute || 0}</div>
                    <div className="text-sm text-orange-600">Requests/Min</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Monitoring */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-red-900">{systemHealth?.security.failedLogins || 0}</div>
                    <div className="text-sm text-red-600">Failed Logins</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-900">{systemHealth?.security.blockedRequests || 0}</div>
                    <div className="text-sm text-orange-600">Blocked Requests</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">{systemHealth?.security.suspiciousActivity || 0}</div>
                    <div className="text-sm text-purple-600">Suspicious Activity</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-sm font-bold text-gray-900">
                      {systemHealth?.security.lastSecurityEvent || 'No recent events'}
                    </div>
                    <div className="text-xs text-gray-600">Last Security Event</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  API Endpoint Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Endpoint</th>
                        <th className="text-left p-2">Method</th>
                        <th className="text-left p-2">Avg Response Time</th>
                        <th className="text-left p-2">Total Requests</th>
                        <th className="text-left p-2">Error Rate</th>
                        <th className="text-left p-2">Last Accessed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceMetrics.slice(0, 10).map((metric, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-mono text-sm">{metric.endpoint}</td>
                          <td className="p-2">
                            <Badge variant={metric.method === 'GET' ? 'default' : 'secondary'}>
                              {metric.method}
                            </Badge>
                          </td>
                          <td className="p-2">{metric.averageResponseTime}ms</td>
                          <td className="p-2">{metric.totalRequests}</td>
                          <td className="p-2">
                            <Badge variant={metric.errorRate > 5 ? 'destructive' : 'default'}>
                              {metric.errorRate}%
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-gray-600">
                            {new Date(metric.lastAccessed).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Database Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Database Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {databaseMetrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">{metric.tableName}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        <div>Rows: {metric.rowCount}</div>
                        <div>Size: {metric.size}</div>
                        <div>Indexes: {metric.indexCount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{event.description}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {event.type} • {event.ipAddress} • {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={
                          event.severity === 'critical' ? 'destructive' :
                          event.severity === 'high' ? 'destructive' :
                          event.severity === 'medium' ? 'secondary' : 'default'
                        }>
                          {event.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-900 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Company Management
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Review and approve company applications, manage existing companies
                    </CardDescription>
                  </div>
                  <Dialog open={createCompanyOpen} onOpenChange={setCreateCompanyOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle>Create New Company</DialogTitle>
                        <DialogDescription>
                          Create a comprehensive company profile for the Shared Wealth International network.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto px-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        {/* Company Name */}
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name *</Label>
                          <Input
                            id="company-name"
                            value={companyForm.name}
                            onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                            placeholder="Enter company name"
                          />
                        </div>
                        
                        {/* Sector */}
                        <div className="space-y-2">
                          <Label htmlFor="sector">Sector *</Label>
                          <Select value={companyForm.sector} onValueChange={(value) => setCompanyForm({...companyForm, sector: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sector" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technology">Technology</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Energy">Energy</SelectItem>
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Countries */}
                        <div className="space-y-2">
                          <Label htmlFor="countries">Countries of Operation *</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="countries"
                              value={currentCountry}
                              onChange={(e) => setCurrentCountry(e.target.value)}
                              placeholder="Enter country name"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (currentCountry.trim() && !companyForm.countries.includes(currentCountry.trim())) {
                                    setCompanyForm({
                                      ...companyForm,
                                      countries: [...companyForm.countries, currentCountry.trim()]
                                    });
                                    setCurrentCountry('');
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                if (currentCountry.trim() && !companyForm.countries.includes(currentCountry.trim())) {
                                  setCompanyForm({
                                    ...companyForm,
                                    countries: [...companyForm.countries, currentCountry.trim()]
                                  });
                                  setCurrentCountry('');
                                }
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          {companyForm.countries.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {companyForm.countries.map((country, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 hover:bg-green-200"
                                >
                                  {country}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCompanyForm({
                                        ...companyForm,
                                        countries: companyForm.countries.filter((_, i) => i !== index)
                                      });
                                    }}
                                    className="ml-2 hover:text-red-600"
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            Press Enter or click + to add countries. Click × to remove.
                          </p>
                        </div>
                        
                        {/* Number of Employees */}
                        <div className="space-y-2">
                          <Label htmlFor="employees">Number of Employees</Label>
                          <Input
                            id="employees"
                            type="number"
                            value={companyForm.employees}
                            onChange={(e) => setCompanyForm({...companyForm, employees: e.target.value})}
                            placeholder="Enter number of employees"
                          />
                        </div>
                        
                        {/* Website */}
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={companyForm.website}
                            onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                            placeholder="https://example.com"
                          />
                        </div>
                        
                        {/* Location */}
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={companyForm.location}
                            onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                            placeholder="City, Country"
                          />
                        </div>
                        
                        {/* Applicant Role */}
                        <div className="space-y-2">
                          <Label htmlFor="applicant-role">Applicant Role *</Label>
                          <Select value={companyForm.applicant_role} onValueChange={(value) => setCompanyForm({...companyForm, applicant_role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="consultant">Consultant</SelectItem>
                              <SelectItem value="advisor">Advisor</SelectItem>
                              <SelectItem value="investor">Investor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Applicant Position */}
                        <div className="space-y-2">
                          <Label htmlFor="applicant-position">Applicant Position *</Label>
                          <Input
                            id="applicant-position"
                            value={companyForm.applicant_position}
                            onChange={(e) => setCompanyForm({...companyForm, applicant_position: e.target.value})}
                            placeholder="e.g., CEO, Director, Manager"
                          />
                        </div>
                      </div>
                      
                      {/* Company Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          value={companyForm.description}
                          onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                          placeholder="Describe the company's mission, values, and shared wealth approach..."
                          rows={4}
                        />
                      </div>
                      
                      {/* Company Logo Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="logo">Company Logo</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Input
                              id="logo"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setCompanyForm({...companyForm, logo: file});
                                  // Create preview URL
                                  const previewUrl = URL.createObjectURL(file);
                                  setCompanyForm({...companyForm, logo: file, logo_url: previewUrl});
                                }
                              }}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                          </div>
                        {companyForm.logo_url && (
                          <div className="max-w-32 max-h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={companyForm.logo_url} 
                              alt="Logo preview" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Recommended size: 200x200px. Supported formats: JPG, PNG, GIF
                        </p>
                      </div>
                      
                      {/* Shared Wealth License Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="shared-wealth-licensed"
                            checked={companyForm.is_shared_wealth_licensed}
                            onChange={(e) => setCompanyForm({...companyForm, is_shared_wealth_licensed: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="shared-wealth-licensed">
                            Company is already Shared Wealth licensed
                          </Label>
                        </div>
                        {companyForm.is_shared_wealth_licensed && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="license-number">License Number</Label>
                              <Input
                                id="license-number"
                                value={companyForm.license_number}
                                onChange={(e) => setCompanyForm({...companyForm, license_number: e.target.value})}
                                placeholder="Enter license number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="license-date">License Date</Label>
                              <Input
                                id="license-date"
                                type="date"
                                value={companyForm.license_date}
                                onChange={(e) => setCompanyForm({...companyForm, license_date: e.target.value})}
                              />
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                      
                      <DialogFooter className="flex-shrink-0">
                        <Button variant="outline" onClick={() => setCreateCompanyOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" onClick={handleCreateCompany}>
                          Create Company
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-green-600">Loading companies...</p>
                    </div>
                  ) : companies.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-green-600">No companies registered yet</p>
                      <p className="text-sm text-green-500">
                        Companies will appear here once users start registering their businesses.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Debug: companies array length = {companies.length}
                      </p>
                    </div>
                  ) : (
                    companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-green-900">{company.name}</p>
                            <p className="text-sm text-green-600">{company.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant={company.status === 'approved' ? 'default' : company.status === 'pending' ? 'secondary' : 'destructive'}
                                className={
                                  company.status === 'approved' ? 'bg-green-600' : 
                                  company.status === 'pending' ? 'bg-yellow-500' : 'bg-red-600'
                                }
                              >
                                {company.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {company.sector} • {company.location}
                              </span>
                              <span className="text-xs text-gray-500">
                                Created: {new Date(company.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {company.status === 'pending' && (
                            <>
                              <Button 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApproveCompany(company.id, company.name)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectCompany(company.id, company.name)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {company.website && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(company.website, '_blank')}
                            >
                              <Globe className="w-4 h-4 mr-1" />
                              Website
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Company</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete company {company.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCompany(company.id, company.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Company
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-900 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      User Management
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Manage user accounts, permissions, and access levels
                    </CardDescription>
                  </div>
                  <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account and send credentials to their email.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            className="col-span-3"
                            placeholder="user@example.com"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password" className="text-right">
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={userForm.password}
                            onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                            className="col-span-3"
                            placeholder="Temporary password"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">
                            Role
                          </Label>
                          <Select value={userForm.role} onValueChange={(value) => setUserForm({...userForm, role: value})}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="superadmin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleCreateUser}>
                          Create User
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-blue-600">Loading users...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-blue-600">No users found</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Debug: users array length = {users.length}
                      </p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">{user.email}</p>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={user.role === 'admin' ? 'default' : 'secondary'}
                                className={user.role === 'admin' ? 'bg-blue-600' : 'bg-gray-500'}
                              >
                                {user.role}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </span>
                              {user.last_login && (
                                <span className="text-xs text-gray-500">
                                  Last login: {new Date(user.last_login).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="border border-blue-300 rounded px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                          <Badge 
                            variant={user.is_active ? 'default' : 'destructive'}
                            className={user.is_active ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete user {user.email}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Settings className="w-10 h-10 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-3">System Settings</h2>
              <p className="text-blue-600 max-w-2xl mx-auto text-lg">
                Configure platform settings, manage content, and monitor system health.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
