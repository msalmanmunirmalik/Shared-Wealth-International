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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Lightbulb,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  ExternalLink,
  Calculator,
  BookOpen,
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
  const navigate = useNavigate();
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
  const [showAddToNetwork, setShowAddToNetwork] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [connectionType, setConnectionType] = useState<string>("member");

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
      loadApplications();
    }
  }, [user]);

  const loadSocialMetrics = async () => {
    try {
      if (!user?.id) return;

      // Social metrics are disabled until APIs are properly implemented
      // Set default values to avoid showing 0s
      setStats(prev => ({ 
        ...prev, 
        totalReactions: 0,
        totalShares: 0,
        totalConnections: 0,
        socialEngagement: 0
      }));

    } catch (error) {
      console.error('Error loading social metrics:', error);
    }
  };

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load user companies using real API
      const userCompaniesResponse = await apiService.getUserCompanies();
      const networkResponse = await apiService.getUserNetwork();
      
      // Extract data from API responses
      const userCompaniesData = userCompaniesResponse?.data || userCompaniesResponse || [];
      const networkData = networkResponse?.data || networkResponse || [];
      
      const dashboardData = {
        userCompanies: userCompaniesData,
        networkCompanies: networkData
      };
      
      const mappedUserCompanies = (Array.isArray(dashboardData.userCompanies) ? dashboardData.userCompanies : []).map((company: any) => ({
        ...company,
        company_name: company.name, // Map name to company_name for consistency
        highlights: company.highlights || company.description || 'No highlights available',
        location: company.location || company.country || 'Location not specified'
      }));
      
      setUserCompanies(mappedUserCompanies);
      // Handle networkCompanies - already extracted above
      const networkCompaniesArray = Array.isArray(dashboardData.networkCompanies) ? dashboardData.networkCompanies : [];
      
      setNetworkCompanies(networkCompaniesArray.map((company: any) => ({
        ...company,
        highlights: company.highlights || company.description || 'No highlights available',
        location: company.location || company.country || 'Location not specified'
      })));
      setCompanies(mappedUserCompanies); // Set companies state for display
      
      // Keep user companies and network companies separate
      // User companies are already set above via setCompanies(mappedUserCompanies)
      
      console.log('🔍 DEBUG - UserDashboard: Setting user companies only:', mappedUserCompanies.length, 'companies');
      console.log('🔍 DEBUG - UserDashboard: User companies:', mappedUserCompanies.map(c => c.name));

      // Calculate real stats based on actual data
      const totalCompanies = mappedUserCompanies.length; // User's companies only
      const networkPartners = networkCompaniesArray.length;
      
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
      if (!user?.id) return;
      
      // Load real activities from API
      const activitiesData = await apiService.getActivities(user.id);
      if (activitiesData.success) {
        setActivities(activitiesData.data || []);
      } else {
        // If no activities API exists yet, create some basic activity from user's companies
        const userCompaniesData = await apiService.getUserCompanies();
        if (userCompaniesData.success && userCompaniesData.data.length > 0) {
          const basicActivities = userCompaniesData.data.map((company: any, index: number) => ({
            id: `basic-activity-${company.id}-${index}`,
            user_name: user.name || user.email,
            action: 'added company',
            company_name: company.company_name,
            timestamp: company.created_at,
            status: 'completed'
          }));
          setActivities(basicActivities);
        } else {
          setActivities([]);
        }
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    }
  };

  const loadApplications = async () => {
    try {
      if (!user?.id) return;
      
      // Load real applications from API
      const applicationsData = await apiService.getUserApplications();
      if (applicationsData.success) {
        setApplications(applicationsData.data || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
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
    navigate(`/company/${company.id}`);
  };

  // Network management functions
  const loadAvailableCompanies = async (search?: string) => {
    try {
      const companies = await apiService.getAvailableCompanies(search);
      setAvailableCompanies(companies);
    } catch (error) {
      console.error('Failed to load available companies:', error);
      toast({
        title: "Error",
        description: "Failed to load available companies",
        variant: "destructive",
      });
    }
  };

  const handleAddToNetwork = async () => {
    if (!selectedCompanyId) {
      toast({
        title: "Error",
        description: "Please select a company to add to your network",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiService.addToNetwork(selectedCompanyId, connectionType);
      toast({
        title: "Success",
        description: "Company added to your network successfully",
      });
      setShowAddToNetwork(false);
      setSelectedCompanyId("");
      setConnectionType("member");
      // Reload network data
      const networkData = await apiService.getUserNetwork();
      setNetworkCompanies(networkData.map((company: any) => ({
        ...company,
        highlights: company.highlights || company.description || 'No highlights available',
        location: company.location || company.country || 'Location not specified'
      })));
    } catch (error) {
      console.error('Failed to add company to network:', error);
      toast({
        title: "Error",
        description: "Failed to add company to network",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromNetwork = async (companyId: string) => {
    try {
      await apiService.removeFromNetwork(companyId);
      toast({
        title: "Success",
        description: "Company removed from your network successfully",
      });
      // Reload network data
      const networkData = await apiService.getUserNetwork();
      setNetworkCompanies(networkData.map((company: any) => ({
        ...company,
        highlights: company.highlights || company.description || 'No highlights available',
        location: company.location || company.country || 'Location not specified'
      })));
    } catch (error) {
      console.error('Failed to remove company from network:', error);
      toast({
        title: "Error",
        description: "Failed to remove company from network",
        variant: "destructive",
      });
    }
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
          <TabsList className="grid w-full grid-cols-3 border shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Overview</TabsTrigger>
            <TabsTrigger value="my-companies" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">My Companies</TabsTrigger>
            <TabsTrigger value="tools-learning" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg transition-all duration-200 text-white hover:text-white/80">Tools & Learning</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">My Companies</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.totalCompanies > 0 ? stats.totalCompanies : 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Impact Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.totalCompanies > 0 ? '8.7' : '0.0'}/10
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tools Completed</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.totalCompanies > 0 ? '3' : '0'}/12
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Network Connections</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.networkPartners > 0 ? stats.networkPartners : 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-slate-600" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Common tasks and shortcuts to get things done faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setShowAddCompany(true)}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <Building className="w-6 h-6" />
                    <span className="text-sm font-medium">Add Company</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/business-canvas')}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    <Target className="w-6 h-6" />
                    <span className="text-sm font-medium">Business Canvas</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/impact-analytics')}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm font-medium">Impact Analytics</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/companies')}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                  >
                    <Building className="w-6 h-6" />
                    <span className="text-sm font-medium">Companies Directory</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-slate-600" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest actions and platform updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
                        <div className="p-2 bg-white rounded-full">
                          <Activity className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                          <p className="text-xs text-slate-500">{activity.timestamp}</p>
                        </div>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No recent activity</p>
                      <p className="text-sm">Start by adding a company or exploring tools</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Announcements */}
            <Card className="p-6 border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span>Platform Updates</span>
                </CardTitle>
                <CardDescription>
                  Latest news and updates from Shared Wealth International
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Star className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">New Business Canvas Tool</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Design and collaborate on shared wealth business models with our enhanced canvas tool.
                        </p>
                        <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                          Try Now
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-900">Network Growth</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Welcome 5 new companies to the Shared Wealth network this month.
                        </p>
                        <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                          View Network
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>

          {/* My Companies Tab */}
          <TabsContent value="my-companies" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Companies</h2>
                <p className="text-slate-600">Manage your companies and track their progress</p>
              </div>
              <Button onClick={() => setShowAddCompany(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border border-slate-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Companies</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userCompanies.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Companies</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userCompanies.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Review</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userCompanies.filter(c => c.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Companies List */}
            <Card className="p-6 border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Your Companies</CardTitle>
                <CardDescription>
                  Manage and track your company applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userCompanies.length > 0 ? (
                  <div className="space-y-4">
                    {userCompanies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-slate-100 rounded-xl">
                            <Building className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{company.name}</h3>
                            <p className="text-sm text-slate-600">{company.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                                {company.status}
                              </Badge>
                              <span className="text-xs text-slate-500">{company.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No companies yet</h3>
                    <p className="text-slate-600 mb-6">Start by adding your first company to the Shared Wealth network</p>
                    <Button onClick={() => setShowAddCompany(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Company
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools & Learning Tab */}
          <TabsContent value="tools-learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tools & Learning</h2>
                <p className="text-slate-600">Access platform tools and learning resources</p>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/business-canvas')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Business Canvas</h3>
                    <p className="text-sm text-slate-600">Design shared wealth models</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Create and collaborate on business models that generate shared value for all stakeholders.
                </p>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Open Tool
                </Button>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/impact-analytics')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Impact Analytics</h3>
                    <p className="text-sm text-slate-600">Measure your impact</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Track and analyze the social, environmental, and economic impact of your initiatives.
                </p>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  Open Tool
                </Button>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/stakeholder-mapping')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Stakeholder Mapping</h3>
                    <p className="text-sm text-slate-600">Identify key stakeholders</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Map and analyze stakeholders to understand their interests and influence.
                </p>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  Open Tool
                </Button>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/value-proposition')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Value Proposition</h3>
                    <p className="text-sm text-slate-600">Define shared value</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Develop compelling value propositions that create shared wealth for all parties.
                </p>
                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                  Open Tool
                </Button>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/governance-framework')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Governance Framework</h3>
                    <p className="text-sm text-slate-600">Design inclusive governance</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Create governance structures that ensure inclusive decision-making and shared ownership.
                </p>
                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Open Tool
                </Button>
              </Card>

              <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/financial-modeling')}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <Calculator className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Financial Modeling</h3>
                    <p className="text-sm text-slate-600">Plan sustainable finances</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Build financial models that support long-term sustainability and shared wealth creation.
                </p>
                <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                  Open Tool
                </Button>
              </Card>
            </div>

            {/* Learning Resources */}
            <Card className="p-6 border border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  <span>Learning Resources</span>
                </CardTitle>
                <CardDescription>
                  Educational content and guides to help you succeed with shared wealth principles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Getting Started</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <Play className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-900">Introduction to Shared Wealth</p>
                          <p className="text-sm text-slate-600">5 min video</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <FileText className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-slate-900">Platform User Guide</p>
                          <p className="text-sm text-slate-600">15 min read</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-slate-900">Building Your Network</p>
                          <p className="text-sm text-slate-600">10 min read</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Advanced Topics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <Target className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-slate-900">Impact Measurement</p>
                          <p className="text-sm text-slate-600">20 min read</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <Settings className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-slate-900">Governance Best Practices</p>
                          <p className="text-sm text-slate-600">25 min read</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                        <Calculator className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="font-medium text-slate-900">Financial Sustainability</p>
                          <p className="text-sm text-slate-600">30 min read</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Company Dialog */}
      <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
                            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

      {/* Add to Network Dialog */}
      <Dialog open={showAddToNetwork} onOpenChange={setShowAddToNetwork}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Company to Network</DialogTitle>
            <DialogDescription>
              Select a company to add to your network and choose the connection type.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-select">Select Company</Label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a company..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} - {company.sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="connection-type">Connection Type</Label>
              <Select value={connectionType} onValueChange={setConnectionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose connection type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCompanyId && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Selected Company Details:</h4>
                {(() => {
                  const company = availableCompanies.find(c => c.id === selectedCompanyId);
                  return company ? (
                    <div className="text-sm text-gray-600">
                      <p><strong>Name:</strong> {company.name}</p>
                      <p><strong>Sector:</strong> {company.sector}</p>
                      <p><strong>Location:</strong> {company.location}</p>
                      {company.description && (
                        <p><strong>Description:</strong> {company.description}</p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddToNetwork(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToNetwork} disabled={!selectedCompanyId}>
              Add to Network
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard; 