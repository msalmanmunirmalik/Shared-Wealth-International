import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, X, Shield, Users, Crown } from 'lucide-react';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'founding_member' | 'media_manager' | 'member';
  company_name: string | null;
  position: string | null;
  is_active: boolean;
  created_at: string;
}

export const AdminUsersManager = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'admins' | 'users'>('admins');
  const { toast } = useToast();

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive"
      });
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive"
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchAdminUsers(), fetchProfiles()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const promoteToAdmin = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('make_user_admin', {
        user_email: newUserEmail,
        is_super: isSuperAdmin
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User promoted to admin successfully"
      });
      
      fetchData();
      setNewUserEmail('');
      setIsSuperAdmin(false);
      setIsAdminDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user to admin",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: Profile['role']) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully"
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const removeAdminUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from admin users?`)) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user removed successfully"
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove admin user",
        variant: "destructive"
      });
    }
  };

  const toggleSuperAdmin = async (adminUser: AdminUser) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_super_admin: !adminUser.is_super_admin })
        .eq('id', adminUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Super admin status ${!adminUser.is_super_admin ? 'granted' : 'revoked'}`
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update super admin status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const getRoleBadgeVariant = (role: Profile['role']) => {
    switch (role) {
      case 'admin': return 'default';
      case 'founding_member': return 'secondary';
      case 'media_manager': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role: Profile['role']) => {
    switch (role) {
      case 'admin': return Shield;
      case 'founding_member': return Crown;
      case 'media_manager': return Users;
      default: return Users;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('admins')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'admins' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Admin Users ({adminUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'users' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Users ({profiles.length})
        </button>
      </div>

      {/* Admin Users Tab */}
      {activeTab === 'admins' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Admin Users</h3>
            <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Shield className="w-4 h-4 mr-2" />
                  Promote to Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Promote User to Admin</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      User must already have an account
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_super_admin"
                      checked={isSuperAdmin}
                      onChange={(e) => setIsSuperAdmin(e.target.checked)}
                    />
                    <Label htmlFor="is_super_admin">Super Admin</Label>
                    <p className="text-sm text-muted-foreground">
                      (Can manage other admin users)
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={promoteToAdmin}>
                      <Save className="w-4 h-4 mr-2" />
                      Promote User
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdminDialogOpen(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {adminUsers.map((adminUser) => (
              <Card key={adminUser.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{adminUser.email}</h4>
                        {adminUser.is_super_admin && (
                          <Badge variant="secondary">
                            <Shield className="w-3 h-3 mr-1" />
                            Super Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(adminUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSuperAdmin(adminUser)}
                      >
                        {adminUser.is_super_admin ? 'Revoke' : 'Grant'} Super Admin
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeAdminUser(adminUser.id, adminUser.email)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {adminUsers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No admin users found. Create an account first, then promote yourself to admin.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* All Users Tab */}
      {activeTab === 'users' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Users</h3>
            <p className="text-sm text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>

          <div className="grid gap-4">
            {profiles.map((profile) => {
              const RoleIcon = getRoleIcon(profile.role);
              return (
                <Card key={profile.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">
                            {profile.full_name || profile.email}
                          </h4>
                          <Badge variant={getRoleBadgeVariant(profile.role)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {profile.role.replace('_', ' ')}
                          </Badge>
                          {!profile.is_active && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        {profile.company_name && (
                          <p className="text-sm text-muted-foreground">
                            {profile.position} at {profile.company_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={profile.role}
                          onValueChange={(value: Profile['role']) => updateUserRole(profile.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="media_manager">Media Manager</SelectItem>
                            <SelectItem value="founding_member">Founding Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {profiles.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No users found. Users will appear here when they create accounts.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};