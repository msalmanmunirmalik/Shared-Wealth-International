import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, X, Shield } from 'lucide-react';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
}

export const AdminUsersManager = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const addAdminUser = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add to admin_users table with a placeholder user_id
      // In a real implementation, you'd want to handle user verification differently
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: crypto.randomUUID(), // Temporary - should be replaced with actual user lookup
          email: newUserEmail,
          is_super_admin: isSuperAdmin
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Error",
            description: "This user is already an admin",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Admin user added successfully"
      });
      
      fetchAdminUsers();
      setNewUserEmail('');
      setIsSuperAdmin(false);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add admin user",
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
      
      fetchAdminUsers();
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
      
      fetchAdminUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update super admin status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading admin users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Admin Users ({adminUsers.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="admin@example.com"
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
                <Button onClick={addAdminUser}>
                  <Save className="w-4 h-4 mr-2" />
                  Add User
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
            <p className="text-muted-foreground">No admin users found. Add your first admin user to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};