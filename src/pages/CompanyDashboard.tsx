import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyDashboardService } from "@/services/mockServices";
import { apiService } from "@/services/api";
import SocialLicenseAgreement from "@/components/SocialLicenseAgreement";

// Import Social Features
import { ReactionButton } from "@/components/social/ReactionButton";
import { FollowButton } from "@/components/social/FollowButton";
import { ShareButton } from "@/components/social/ShareButton";
import { FileUpload } from "@/components/files/FileUpload";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3, 
  Building,
  Plus,
  Mail,
  Star,
  Award,
  Activity,
  Clock,
  DollarSign,
  ArrowUpRight,
  Globe,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  ExternalLink,
  Download,
  Share2,
  Filter,
  Search,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  CheckCircle2,
  Clock4,
  AlertTriangle,
  LogOut,
  Play,
  Heart
} from "lucide-react";

interface CompanyApplication {
  id: string;
  company_name: string;
  sector: string;
  country: string;
  description: string | null;
  website: string | null;
  employees: number | null;
  location: string | null;
  is_shared_wealth_licensed: boolean;
  license_number: string | null;
  license_date: string | null;
  applicant_role: string;
  applicant_position: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  admin_notes: string | null;
  admin_id: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface NetworkCompany {
  id: string;
  name: string;
  sector: string;
  country: string;
  description: string | null;
  employees: number | null;
  impact_score: number | null;
  shared_value: string | null;
  joined_date: string;
  website: string | null;
  logo: string | null;
  highlights: string[] | null;
  location: string | null;
  status: string;
  is_shared_wealth_licensed: boolean;
  license_number: string | null;
  license_date: string | null;
  created_at: string;
  updated_at: string;
  contact_email: string | null;
  contact_phone: string | null;
}

interface UserCompany {
  id: string;
  user_id: string;
  company_id: string;
  role: string;
  position: string;
  is_primary_contact: boolean;
  permissions: string[];
  joined_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  companies: NetworkCompany;
}

interface DashboardStats {
  totalCompanies: number;
  networkPartners: number;
  growthRate: number;
  activeProjects: number;
  pendingApplications: number;
  approvedCompanies: number;
  // Social Metrics
  totalReactions: number;
  totalShares: number;
  totalConnections: number;
  socialEngagement: number;
}

interface Activity {
  id: string;
  type: 'company_added' | 'meeting_scheduled' | 'impact_updated' | 'connection_made' | 'license_approved';
  title: string;
  description: string;
  company_id?: string;
  company_name?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const UserDashboard = () => {
  const { user, isAdmin, signOut, isDemoMode } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [companies, setCompanies] = useState<NetworkCompany[]>([]);
  const [userCompanies, setUserCompanies] = useState<any[]>([]);
  const [networkCompanies, setNetworkCompanies] = useState<NetworkCompany[]>([]);
  const [applications, setApplications] = useState<CompanyApplication[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    networkPartners: 0,
    growthRate: 0,
    activeProjects: 0,
    pendingApplications: 0,
    approvedCompanies: 0,
    // Social Metrics
    totalReactions: 0,
    totalShares: 0,
    totalConnections: 0,
    socialEngagement: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showSocialLicense, setShowSocialLicense] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<NetworkCompany | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Add Company Form State
  const [newCompany, setNewCompany] = useState({
    name: "",
    sector: "",
    countries: [] as string[], // Changed from single country to array
    description: "",
    employees: "",
    website: "",
    location: "",
    is_shared_wealth_licensed: false,
    license_number: "",
    license_date: "",
    applicant_role: "",
    applicant_position: "",
    logo: null as File | null,
    logo_url: ""
  });

  // Current country input state
  const [currentCountry, setCurrentCountry] = useState("");

  // Social License Agreement State
  const [agreementData, setAgreementData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadActivities();
      loadSocialMetrics();
    }
  }, [user]);

  const loadSocialMetrics = async () => {
    try {
      if (!user?.id) return;

      // Load user's reaction history
      const reactionsResponse = await apiService.getUserReactions(100);
      if (reactionsResponse.success) {
        setStats(prev => ({ ...prev, totalReactions: reactionsResponse.data.length }));
      }

      // Load user's sharing history
      const sharesResponse = await apiService.getUserShares(100);
      if (sharesResponse.success) {
        setStats(prev => ({ ...prev, totalShares: sharesResponse.data.length }));
      }

      // Load user's connections
      const connectionsResponse = await apiService.getConnectionStats(user.id);
      if (connectionsResponse.success) {
        const connectionStats = connectionsResponse.data;
        setStats(prev => ({ 
          ...prev, 
          totalConnections: connectionStats.followersCount + connectionStats.followingCount,
          socialEngagement: Math.round((connectionStats.followersCount + connectionStats.followingCount) * 0.8)
        }));
      }

    } catch (error) {
      console.error('Error loading social metrics:', error);
    }
  };

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load user companies using real API
      const userCompaniesData = await apiService.getUserCompanies();
      const networkCompaniesData = await apiService.getCompanies();
      
      console.log('🔍 DEBUG - User Companies Data:', userCompaniesData);
      console.log('🔍 DEBUG - Network Companies Data Length:', networkCompaniesData.length);
      
      const dashboardData = {
        userCompanies: userCompaniesData,
        networkCompanies: networkCompaniesData
      };
      
      setUserCompanies(dashboardData.userCompanies.map((company: any) => ({
        ...company,
        highlights: company.highlights || company.description || 'No highlights available',
        location: company.location || company.country || 'Location not specified'
      })));
      setNetworkCompanies(dashboardData.networkCompanies.map((company: any) => ({
        ...company,
        highlights: company.highlights || company.description || 'No highlights available',
        location: company.location || company.country || 'Location not specified'
      })));
      
      // Keep user companies and network companies separate
      // Only set user companies for the "My Companies" tab
      const userCompaniesForDisplay = (dashboardData.userCompanies || []).map(uc => ({
        id: uc.id,
        name: uc.name || uc.company_name || 'Unknown Company',
        sector: uc.sector || 'Technology',
        country: uc.country || 'United Kingdom',
        description: uc.description || 'Company description',
        website: uc.website || '',
        employees: uc.employees || 10,
        is_shared_wealth_licensed: uc.is_shared_wealth_licensed || false,
        license_number: uc.license_number || '',
        license_date: uc.license_date || '',
        status: uc.status || 'active',
        created_at: uc.created_at || new Date().toISOString(),
        updated_at: uc.updated_at || new Date().toISOString(),
        impact_score: 0,
        highlights: uc.description ? [uc.description] : ['No highlights available'],
        location: uc.country || 'Location not specified',
        shared_value: 0,
        joined_date: uc.created_at || new Date().toISOString(),
        logo: '',
        contact_email: '',
        contact_phone: ''
      }));
      
      // Set network companies for the overview/network section
      const networkCompaniesForDisplay = (dashboardData.networkCompanies || []).map((nc: any) => ({
        ...nc,
        highlights: nc.highlights || nc.description ? [nc.description] : ['No highlights available'],
        location: nc.location || nc.country || 'Location not specified'
      }));
      
      // Set companies to user companies only for the "My Companies" tab
      console.log('🔍 DEBUG - Setting companies to user companies only:', userCompaniesForDisplay.length, 'companies');
      console.log('🔍 DEBUG - User companies for display:', userCompaniesForDisplay.map(c => c.name));
      setCompanies(userCompaniesForDisplay);

      // Calculate real stats based on actual data
      const totalCompanies = userCompaniesForDisplay.length;
      const networkPartners = networkCompaniesForDisplay.length;
      
      // Only calculate growth rate if there are companies to compare
      const growthRate = totalCompanies > 0 ? Math.round((totalCompanies / Math.max(totalCompanies - 1, 1)) * 100) : 0;
      
      // For now, set these to 0 since we don't have real data yet
      const activeProjects = 0; // Will be updated when projects table exists
      const pendingApplications = applications.filter(app => app.status === 'pending').length;
      const approvedCompanies = applications.filter(app => app.status === 'approved').length;

      setStats({
        totalCompanies,
        networkPartners,
        growthRate,
        activeProjects,
        pendingApplications,
        approvedCompanies
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      // For now, set empty activities since we don't have real data yet
      // In production, this would load from a real activities table
      setActivities([]);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    }
  };

  const handleAddCompany = async () => {
    try {
      if (!newCompany.name || !newCompany.sector || newCompany.countries.length === 0 || !newCompany.applicant_role || !newCompany.applicant_position) {
      toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

      // Show social license agreement
      setShowSocialLicense(true);
    
    } catch (error) {
      console.error('Error preparing company application:', error);
    toast({
        title: "Error",
        description: "Failed to prepare company application",
        variant: "destructive"
      });
    }
  };

  const handleAgreementSigned = async (agreementData: any) => {
    try {
      // Submit company application to admin system for approval
      const companyApplicationData = {
        name: newCompany.name,
        description: newCompany.description,
        industry: newCompany.sector, // Map sector to industry for API
        location: newCompany.location,
        website: newCompany.website,
        size: newCompany.employees ? (parseInt(newCompany.employees) < 50 ? 'small' : parseInt(newCompany.employees) < 200 ? 'medium' : 'large') : 'small',
        status: 'pending', // Submit as pending for admin approval
        // Additional fields from the form
        countries: newCompany.countries,
        employees: newCompany.employees ? parseInt(newCompany.employees) : null,
        is_shared_wealth_licensed: newCompany.is_shared_wealth_licensed,
        license_number: newCompany.license_number || null,
        license_date: newCompany.license_date || null,
        applicant_role: newCompany.applicant_role,
        applicant_position: newCompany.applicant_position,
        // Agreement data
        agreement_data: {
          agreement_version: agreementData.agreementVersion,
          user_signature: agreementData.userSignature,
          signed_at: agreementData.signedAt,
          ip_address: agreementData.ipAddress,
          user_agent: agreementData.userAgent,
          company_name: agreementData.companyName,
          representative_name: agreementData.representativeName
        },
        // Logo data
        logo_file: newCompany.logo,
        logo_url: newCompany.logo_url
      };

      // Submit to admin system via API
      const response = await apiService.createCompany(companyApplicationData);
      
      if (response && response.success !== false) {
      toast({
          title: "Success",
          description: "Company application submitted successfully. Pending admin approval.",
        });

        setShowSocialLicense(false);
        setShowAddCompany(false);
        setNewCompany({
          name: "",
          sector: "",
          countries: [],
          description: "",
          employees: "",
          website: "",
          location: "",
          is_shared_wealth_licensed: false,
          license_number: "",
          license_date: "",
          applicant_role: "",
          applicant_position: "",
          logo: null,
          logo_url: ""
        });
        setCurrentCountry("");

        // Add to local state for demonstration
        const newApplication: CompanyApplication = {
          id: response.id || Date.now().toString(),
          company_name: newCompany.name,
          sector: newCompany.sector,
          countries: newCompany.countries,
          description: newCompany.description,
          website: newCompany.website,
          employees: newCompany.employees ? parseInt(newCompany.employees) : null,
          location: newCompany.location,
          is_shared_wealth_licensed: newCompany.is_shared_wealth_licensed,
          license_number: newCompany.license_number || null,
          license_date: newCompany.license_date || null,
          applicant_role: newCompany.applicant_role,
          applicant_position: newCompany.applicant_position,
          status: 'pending',
          admin_notes: null,
          admin_id: null,
          reviewed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setApplications(prev => [newApplication, ...prev]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingApplications: prev.pendingApplications + 1
        }));
      } else {
        throw new Error('Failed to submit company application');
      }

    } catch (error) {
      console.error('Error submitting company application:', error);
      toast({
        title: "Error",
        description: "Failed to submit company application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompanyClick = (company: NetworkCompany) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === "all" || company.sector === filterSector;
    const matchesStatus = filterStatus === "all" || company.status === filterStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const sectors = [...new Set(companies.map(c => c.sector))];
  const statuses = [...new Set(companies.map(c => c.status))];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock4 className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'under_review':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
              </div>
          </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
                <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-lg text-gray-600">Manage your companies and network connections</p>
                    </div>
            <div className="flex space-x-3">
              <Button onClick={loadUserData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowAddCompany(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
              {isAdmin && (
                <Button onClick={() => window.location.href = '/admin'} variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button onClick={signOut} variant="outline" className="bg-red-600 text-white hover:bg-blue-700">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
          </div>
        </div>

      </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Demo Mode Active</h3>
                  <p className="text-green-100 text-sm">You're exploring the platform with sample data. Sign up for a real account to access all features.</p>
                    </div>
                </div>
              <Button 
                onClick={() => window.location.href = '/auth'} 
                variant="outline" 
                className="bg-white text-green-600 hover:bg-green-50 border-white"
              >
                Sign Up
              </Button>
        </div>
      </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 border shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Overview</TabsTrigger>
            <TabsTrigger value="my-companies" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">My Companies</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Network</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Analytics</TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Activities</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Applications</TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Social</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Building className="w-6 h-6 text-slate-600" />
            </div>
          <div>
                    <p className="text-sm font-medium text-slate-600">Total Companies</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.totalCompanies > 0 ? stats.totalCompanies : 0}
            </p>
          </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Users className="w-6 h-6 text-slate-600" />
        </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Network Partners</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.networkPartners > 0 ? stats.networkPartners : 0}
                    </p>
      </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-slate-600" />
                      </div>
          <div>
                    <p className="text-sm font-medium text-slate-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.growthRate > 0 ? `${stats.growthRate}%` : '0%'}
            </p>
          </div>
                    </div>
                </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Activity className="w-6 h-6 text-slate-600" />
          </div>
                      <div>
                    <p className="text-sm font-medium text-slate-600">Active Projects</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.activeProjects > 0 ? stats.activeProjects : 0}
                    </p>
                      </div>
                    </div>
                </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Clock className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                    <p className="text-sm font-medium text-slate-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.pendingApplications > 0 ? stats.pendingApplications : 0}
                    </p>
                      </div>
                    </div>
                </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                    <p className="text-sm font-medium text-slate-600">Approved Companies</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.approvedCompanies > 0 ? stats.approvedCompanies : 0}
                    </p>
                      </div>
                    </div>
                </Card>

              {/* Social Metrics Cards */}
              <Card className="p-6 border border-blue-200 bg-blue-50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                    <p className="text-sm font-medium text-blue-600">Total Reactions</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.totalReactions || 0}
                    </p>
                      </div>
                    </div>
                </Card>

              <Card className="p-6 border border-green-200 bg-green-50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Share2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                    <p className="text-sm font-medium text-green-600">Content Shares</p>
                    <p className="text-2xl font-bold text-green-900">
                      {stats.totalShares || 0}
                    </p>
                      </div>
                    </div>
                </Card>

              <Card className="p-6 border border-purple-200 bg-purple-50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
              </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600">Social Connections</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {stats.totalConnections || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-orange-200 bg-orange-50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-600">Social Engagement</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {stats.socialEngagement || 0}%
                    </p>
                  </div>
                </div>
              </Card>
              </div>

            {/* Recent Activities Preview */}
            <Card>
                  <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest network activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                {activities.length > 0 ? (
                    <div className="space-y-4">
                    {activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-500' : 
                          activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                            <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                          </div>
                    ))}
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("activities")}>
                        View All Activities
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-2">No activities yet</p>
                    <p className="text-sm text-gray-400">Your network activities will appear here</p>
                  </div>
                )}
                  </CardContent>
                </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="my-companies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Companies</h2>
              <Button 
                onClick={() => setShowAddCompany(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
                            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                          </div>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
                    </div>

            {filteredCompanies.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {companies.length === 0 ? "No Companies Yet" : "No Companies Found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {companies.length === 0 
                      ? "Start by adding your first company to the network"
                      : "Try adjusting your search or filters"
                    }
                  </p>
                  {companies.length === 0 && (
                    <Button 
                      onClick={() => setShowAddCompany(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Company
                    </Button>
                  )}
                  </CardContent>
                </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <Card 
                    key={company.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleCompanyClick(company)}
                  >
                  <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Owner</Badge>
                          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                            {company.status}
                          </Badge>
              </div>
            </div>
                      <CardDescription className="flex items-center space-x-2">
                        <span>{company.sector}</span>
                        <span>•</span>
                        <span>{company.country}</span>
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {company.description || 'No description available'}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Employees</span>
                          <span className="font-medium">{company.employees || 'N/A'}</span>
                          </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Impact Score</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{company.impact_score || 'N/A'}</span>
                            </div>
                          </div>
                        {company.is_shared_wealth_licensed && (
                          <div className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Licensed</span>
                        </div>
                        )}
                      </div>

                      {/* Social Features */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ReactionButton
                              postId={company.id}
                              postType="company_post"
                              className="text-sm"
                            />
                            <ShareButton
                              contentId={company.id}
                              contentType="company_post"
                              contentTitle={company.name}
                              className="text-sm"
                            />
                          </div>
                          <FollowButton
                            targetUserId={company.id}
                            targetUserName={company.name}
                            connectionType="colleague"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                      ))}
                    </div>
            )}
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Network Companies</h2>
              <Badge variant="secondary" className="text-sm">
                {networkCompanies.length} Companies
              </Badge>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {[...new Set(networkCompanies.map(c => c.sector))].map(sector => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Network Companies Grid */}
            {networkCompanies.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Network Companies</h3>
                  <p className="text-gray-600 mb-6">
                    Network companies will appear here once they join the platform
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networkCompanies.filter(company => {
                  const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       company.description?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesSector = filterSector === "all" || company.sector === filterSector;
                  const matchesStatus = filterStatus === "all" || company.status === filterStatus;
                  
                  return matchesSearch && matchesSector && matchesStatus;
                }).map((company) => (
                  <Card 
                    key={company.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </CardTitle>
                        <Badge variant={company.status === 'approved' ? 'default' : 'secondary'}>
                          {company.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-600">
                        {company.sector} • {company.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {company.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{company.employees || 'Unknown'} employees</span>
                        <span>Joined {new Date(company.joined_date).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Company Applications</h2>
              <Badge variant="secondary" className="text-sm">
                {applications.length} Applications
              </Badge>
            </div>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start by submitting your first company application
                  </p>
                  <Button onClick={() => setShowAddCompany(true)}>
                              <Plus className="w-4 h-4 mr-2" />
                    Submit Application
                            </Button>
                  </CardContent>
                </Card>
            ) : (
                            <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(application.status)}
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.company_name}
                            </h3>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', ' ')}
                            </Badge>
              </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                              <Label className="text-sm font-medium text-gray-700">Sector</Label>
                              <p className="text-sm text-gray-600 mt-1">{application.sector}</p>
                              </div>
                            
                              <div>
                              <Label className="text-sm font-medium text-gray-700">Country</Label>
                              <p className="text-sm text-gray-600 mt-1">{application.country}</p>
                              </div>
                            
                              <div>
                              <Label className="text-sm font-medium text-gray-700">Your Role</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                {application.applicant_role} • {application.applicant_position}
                              </p>
                              </div>
                            </div>

                          {application.description && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium text-gray-700">Description</Label>
                              <p className="text-sm text-gray-600 mt-1">{application.description}</p>
            </div>
          )}

                          {application.admin_notes && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <Label className="text-sm font-medium text-yellow-800">Admin Notes</Label>
                              <p className="text-sm text-yellow-700 mt-1">{application.admin_notes}</p>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                              </Button>
                            {application.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Application
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
                      <CardHeader>
                <CardTitle>Impact Analytics</CardTitle>
                <CardDescription>Track your companies' impact over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Impact charts and analytics will be displayed here</p>
                    <p className="text-sm">Coming soon with real-time data visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
                      <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest network activities and updates</CardDescription>
                      </CardHeader>
                      <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' : 
                        activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                              <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        {activity.company_name && (
                          <p className="text-xs text-blue-600 mt-1">{activity.company_name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                              </div>
                            </div>
                          ))}
                        </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Social Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span>Social Activity Feed</span>
                  </CardTitle>
                  <CardDescription>Recent social interactions and content</CardDescription>
                </CardHeader>
                <CardContent>
                            <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">You reacted to</span>
                          <span className="text-blue-600">TechCorp Innovation</span>
                        </div>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ReactionButton
                          postId="sample-post-1"
                          postType="company_post"
                          className="text-sm"
                        />
                        <ShareButton
                          contentId="sample-post-1"
                          contentType="company_post"
                          contentTitle="TechCorp Innovation"
                          className="text-sm"
                                />
                              </div>
                              </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>J</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">John Smith</span>
                          <span>shared</span>
                          <span className="text-blue-600">GreenTech Solutions</span>
                        </div>
                        <span className="text-sm text-gray-500">4 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FollowButton
                          targetUserId="sample-user-1"
                          targetUserName="John Smith"
                          connectionType="colleague"
                          className="text-sm"
                                />
                              </div>
                            </div>
                  </div>
                      </CardContent>
                    </Card>

              {/* Social Connections */}
              <Card>
                      <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Social Connections</span>
                  </CardTitle>
                  <CardDescription>Manage your professional network</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Jane Smith</p>
                          <p className="text-sm text-gray-500">CEO at InnovateCorp</p>
                          </div>
                      </div>
                      <FollowButton
                        targetUserId="sample-user-2"
                        targetUserName="Jane Smith"
                        connectionType="colleague"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>MD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Mike Davis</p>
                          <p className="text-sm text-gray-500">CTO at TechStart</p>
                        </div>
                      </div>
                      <FollowButton
                        targetUserId="sample-user-3"
                        targetUserName="Mike Davis"
                        connectionType="mentor"
                        className="text-sm"
                      />
                    </div>
                        </div>
                      </CardContent>
                    </Card>

              {/* File Upload */}
              <Card>
                      <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span>File Management</span>
                  </CardTitle>
                  <CardDescription>Upload and manage company documents</CardDescription>
                      </CardHeader>
                      <CardContent>
                  <FileUpload
                    onUploadComplete={(files) => {
                      console.log('Files uploaded:', files);
                      toast({
                        title: "Success",
                        description: `${files.length} file(s) uploaded successfully`,
                      });
                    }}
                    maxFiles={5}
                    acceptedTypes={['image/*', 'application/pdf', 'text/*']}
                  />
                </CardContent>
              </Card>

              {/* Social Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <span>Social Analytics</span>
                  </CardTitle>
                  <CardDescription>Your social engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-900">{stats.totalReactions || 0}</p>
                      <p className="text-sm text-blue-600">Total Reactions</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Share2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-green-900">{stats.totalShares || 0}</p>
                      <p className="text-sm text-green-600">Content Shares</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold text-purple-900">{stats.totalConnections || 0}</p>
                      <p className="text-sm text-purple-600">Connections</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-2xl font-bold text-orange-900">{stats.socialEngagement || 0}%</p>
                      <p className="text-sm text-orange-600">Engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Company Dialog */}
      <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
                            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                              <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add New Company</DialogTitle>
                                <DialogDescription>
              Submit a new company application to join the Shared Wealth International network.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto px-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Select value={newCompany.sector} onValueChange={(value) => setNewCompany({...newCompany, sector: value})}>
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
                      if (currentCountry.trim() && !newCompany.countries.includes(currentCountry.trim())) {
                        setNewCompany({
                          ...newCompany,
                          countries: [...newCompany.countries, currentCountry.trim()]
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
                    if (currentCountry.trim() && !newCompany.countries.includes(currentCountry.trim())) {
                      setNewCompany({
                        ...newCompany,
                        countries: [...newCompany.countries, currentCountry.trim()]
                      });
                      setCurrentCountry('');
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                                  </div>
              {newCompany.countries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newCompany.countries.map((country, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    >
                      {country}
                      <button
                        type="button"
                        onClick={() => {
                          setNewCompany({
                            ...newCompany,
                            countries: newCompany.countries.filter((_, i) => i !== index)
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
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees</Label>
              <Input
                id="employees"
                type="number"
                value={newCompany.employees}
                onChange={(e) => setNewCompany({...newCompany, employees: e.target.value})}
                placeholder="Enter number of employees"
                                  />
                                </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={newCompany.website}
                onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                placeholder="https://example.com"
                                    />
                                  </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newCompany.location}
                onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                placeholder="City, Country"
                                    />
                                  </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-role">Your Role *</Label>
              <Select value={newCompany.applicant_role} onValueChange={(value) => setNewCompany({...newCompany, applicant_role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
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
            <div className="space-y-2">
              <Label htmlFor="applicant-position">Your Position *</Label>
              <Input
                id="applicant-position"
                value={newCompany.applicant_position}
                onChange={(e) => setNewCompany({...newCompany, applicant_position: e.target.value})}
                placeholder="e.g., CEO, Director, Manager"
                                    />
                                  </div>
                                  </div>
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
                                    <Textarea 
              id="description"
              value={newCompany.description}
              onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
              placeholder="Describe your company's mission, values, and shared wealth approach..."
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
                      const previewUrl = URL.createObjectURL(file);
                      setNewCompany({...newCompany, logo: file, logo_url: previewUrl});
                    }
                  }}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                                  </div>
                    {newCompany.logo_url && (
                      <div className="max-w-32 max-h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={newCompany.logo_url} 
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
                                
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shared-wealth-licensed"
                checked={newCompany.is_shared_wealth_licensed}
                onCheckedChange={(checked) => setNewCompany({...newCompany, is_shared_wealth_licensed: checked as boolean})}
              />
              <Label htmlFor="shared-wealth-licensed">
                My company is already Shared Wealth licensed
              </Label>
                                </div>
            {newCompany.is_shared_wealth_licensed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-number">License Number</Label>
                  <Input
                    id="license-number"
                    value={newCompany.license_number}
                    onChange={(e) => setNewCompany({...newCompany, license_number: e.target.value})}
                    placeholder="Enter license number"
                                  />
                                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-date">License Date</Label>
                  <Input
                    id="license-date"
                    type="date"
                    value={newCompany.license_date}
                    onChange={(e) => setNewCompany({...newCompany, license_date: e.target.value})}
                                  />
                              </div>
              </div>
            )}
                                </div>
                              </div>
                              <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setShowAddCompany(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCompany}
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              Continue to Agreement
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

      {/* Social License Agreement Dialog */}
      <Dialog open={showSocialLicense} onOpenChange={setShowSocialLicense}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <SocialLicenseAgreement
            companyName={newCompany.name}
            companyData={{
              name: newCompany.name,
              sector: newCompany.sector,
              country: newCompany.country,
              description: newCompany.description,
              applicant_role: newCompany.applicant_role,
              applicant_position: newCompany.applicant_position
            }}
            onAgreementSigned={handleAgreementSigned}
            onCancel={() => setShowSocialLicense(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Company Details Dialog */}
      <Dialog open={showCompanyDetails} onOpenChange={setShowCompanyDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              Company details and management options
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Company Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sector:</span>
                      <span>{selectedCompany.sector}</span>
                        </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span>{selectedCompany.country}</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employees:</span>
                      <span>{selectedCompany.employees || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={selectedCompany.status === 'active' ? 'default' : 'secondary'}>
                        {selectedCompany.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Impact Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impact Score:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{selectedCompany.impact_score || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shared Value:</span>
                      <span>{selectedCompany.shared_value || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Licensed:</span>
                      <span>{selectedCompany.is_shared_wealth_licensed ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCompany.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedCompany.description}</p>
            </div>
          )}

              <div className="flex space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Company
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
      </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard; 