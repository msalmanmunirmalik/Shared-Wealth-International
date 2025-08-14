import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  LogOut
} from "lucide-react";

interface AdminUser {
  id: string;
  user_id: string;
  role: 'superadmin' | 'admin' | 'moderator' | 'support';
  permissions: Record<string, boolean>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user: {
    email: string;
    created_at: string;
  };
}

interface CompanyApplication {
  id: string;
  company_name: string;
  sector: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  applicant_role: string;
  applicant_position: string;
  created_at: string;
  user: {
    email: string;
  };
}

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  pendingApplications: number;
  activeCompanies: number;
  totalAdmins: number;
  recentActivity: number;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    pendingApplications: 0,
    activeCompanies: 0,
    totalAdmins: 0,
    recentActivity: 0
  });
  const [companyApplications, setCompanyApplications] = useState<CompanyApplication[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);

      // Load admin user data
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select(`
          *,
          user:user_id(email, created_at)
        `)
        .eq('user_id', user?.id)
        .single();

      if (adminError) {
        console.error('Error loading admin data:', adminError);
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive"
        });
        return;
      }

      setAdminUser(adminData);

      // Load company applications
      await loadCompanyApplications();

      // Load admin users (if superadmin)
      if (adminData.role === 'superadmin') {
        await loadAdminUsers();
      }

      // Load platform stats
      await loadPlatformStats();

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('company_applications')
        .select(`
          *,
          user:user_id(email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading company applications:', error);
      } else {
        setCompanyApplications(data || []);
      }
    } catch (error) {
      console.error('Error loading company applications:', error);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          *,
          user:user_id(email, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading admin users:', error);
      } else {
        setAdminUsers(data || []);
      }
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  };

  const loadPlatformStats = async () => {
    try {
      // For now, we'll use mock data since the tables don't exist yet
      // In production, this would query the actual database
      setStats({
        totalUsers: Math.floor(Math.random() * 1000) + 100,
        totalCompanies: Math.floor(Math.random() * 500) + 50,
        pendingApplications: companyApplications.filter(app => app.status === 'pending').length,
        activeCompanies: Math.floor(Math.random() * 400) + 40,
        totalAdmins: adminUsers.length + 1, // +1 for current user
        recentActivity: Math.floor(Math.random() * 100) + 10
      });
    } catch (error) {
      console.error('Error loading platform stats:', error);
    }
  };

  const handleCompanyAction = async (companyId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      // For now, we'll simulate the action since the tables don't exist yet
      // In production, this would update the database
      
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // Update local state
      setCompanyApplications(prev => 
        prev.map(app => 
          app.id === companyId 
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast({
        title: "Success",
        description: `Company application ${action}d successfully`,
      });

      // Close dialog
      setShowCompanyDetails(false);
      setSelectedCompany(null);
      setAdminNotes("");

      // Reload stats
      await loadPlatformStats();

    } catch (error) {
      console.error(`Error ${action}ing company:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} company`,
        variant: "destructive"
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

  const filteredApplications = companyApplications.filter(app => {
    const matchesSearch = app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
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
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="w-4 h-4 text-purple-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'moderator':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'support':
        return <UserCheck className="w-4 h-4 text-orange-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Button onClick={handleSignOut}>Return to Platform</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRoleIcon(adminUser.role)}
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <Badge variant="secondary" className="ml-2">
                  {adminUser.role.charAt(0).toUpperCase() + adminUser.role.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
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
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            {adminUser.role === 'superadmin' && (
              <TabsTrigger value="admins">Admins</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Admins</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeCompanies.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("companies")}
                  >
                    <Building className="w-6 h-6" />
                    <span>Review Applications</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="w-6 h-6" />
                    <span>Manage Users</span>
                  </Button>
                  
                  {adminUser.role === 'superadmin' && (
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => setActiveTab("admins")}
                    >
                      <Shield className="w-6 h-6" />
                      <span>Manage Admins</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Company Applications</h2>
              <Button onClick={loadCompanyApplications}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search companies or applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map((application) => (
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
                              <Label className="text-sm font-medium text-gray-700">Applicant</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                {application.user.email}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Role</Label>
                              <p className="text-sm text-gray-600 mt-1">{application.applicant_role}</p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Position</Label>
                              <p className="text-sm text-gray-600 mt-1">{application.applicant_position}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(application);
                                setShowCompanyDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            
                            {application.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleCompanyAction(application.id, 'approve')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                                
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleCompanyAction(application.id, 'reject')}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>User management interface will be displayed here</p>
                    <p className="text-sm">Coming soon with comprehensive user controls</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab (Superadmin Only) */}
          {adminUser.role === 'superadmin' && (
            <TabsContent value="admins" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Admin Users</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </div>

              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <Card key={admin.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getRoleIcon(admin.role)}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {admin.user.email}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Role: {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(admin.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant={admin.is_active ? "default" : "secondary"}>
                            {admin.is_active ? "Active" : "Inactive"}
                          </Badge>
                          
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          
                          {admin.role !== 'superadmin' && (
                            <Button variant="outline" size="sm">
                              <Ban className="w-4 h-4 mr-2" />
                              {admin.is_active ? "Suspend" : "Activate"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Company Details Dialog */}
      <Dialog open={showCompanyDetails} onOpenChange={setShowCompanyDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Company Application Details</DialogTitle>
            <DialogDescription>
              Review and manage company application
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Company Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company Name:</span>
                      <span className="font-medium">{selectedCompany.company_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sector:</span>
                      <span>{selectedCompany.sector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span>{selectedCompany.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedCompany.status)}>
                        {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Applicant Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedCompany.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span>{selectedCompany.applicant_role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span>{selectedCompany.applicant_position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied:</span>
                      <span>{new Date(selectedCompany.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Input
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleCompanyAction(selectedCompany.id, 'approve', adminNotes)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => handleCompanyAction(selectedCompany.id, 'reject', adminNotes)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
                
                <Button variant="outline" onClick={() => setShowCompanyDetails(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
