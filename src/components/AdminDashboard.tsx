import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LogOut,
  Loader2
} from "lucide-react";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simple check if user exists in admin_users table
      const { data, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (adminError) {
        console.error('Error checking admin status:', adminError);
        setError('Failed to verify admin privileges. Please check if you have admin access.');
        return;
      }

      if (data) {
        setIsAdmin(true);
        toast({
          title: "Welcome to Admin Dashboard",
          description: "You have successfully accessed the admin panel.",
        });
      } else {
        setError('You do not have admin privileges. Please contact a system administrator.');
      }

    } catch (error) {
      console.error('Error checking admin status:', error);
      setError('An unexpected error occurred while checking admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900">Loading Admin Dashboard...</h2>
          <p className="text-blue-600 mt-2">Please wait while we verify your access</p>
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
              <Navigate to="/dashboard" replace />
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
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Overview</TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Companies</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Users</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-700 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="w-10 h-10 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-3">Platform Overview</h2>
              <p className="text-blue-600 max-w-2xl mx-auto text-lg">
                Welcome to the Shared Wealth International admin dashboard. Here you can manage companies, users, and platform settings.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Building className="w-10 h-10 text-emerald-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-3">Company Management</h2>
              <p className="text-blue-600 max-w-2xl mx-auto text-lg">
                Review and approve company applications, manage existing companies, and monitor network growth.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-3">User Management</h2>
              <p className="text-blue-600 max-w-2xl mx-auto text-lg">
                Manage user accounts, permissions, and access levels across the platform.
              </p>
            </div>
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
