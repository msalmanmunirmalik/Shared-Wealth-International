import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Shield, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
  last_login?: string;
}

interface AdminInvitation {
  id: string;
  email: string;
  invited_by: string;
  token: string;
  expires_at: string;
  is_used: boolean;
}

export const SecureAdminSetup = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminSetup();
  }, []);

  const checkAdminSetup = async () => {
    try {
      // Check if any admin users exist
      const { data: admins, error: adminError } = await supabase
        .from('admin_users')
        .select('*');

      if (adminError) {
        console.error('Error checking admin setup:', adminError);
        return;
      }

      if (!admins || admins.length === 0) {
        // No admin users exist - show setup form
        setShowSetupForm(true);
      } else {
        // Admin users exist - load admin management
        setAdminUsers(admins);
        await loadInvitations();
      }
    } catch (error) {
      console.error('Setup check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  const createInitialSuperAdmin = async () => {
    if (!setupPassword || setupPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setInviteLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to create the initial admin",
          variant: "destructive"
        });
        return;
      }

      // Create super admin user
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
          user_id: user.id,
          email: user.email,
          is_super_admin: true
        });

      if (adminError) throw adminError;

      toast({
        title: "Success",
        description: "Super admin account created successfully!"
      });

      setShowSetupForm(false);
      await checkAdminSetup();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create super admin",
        variant: "destructive"
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const inviteAdmin = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setInviteLoading(true);
    try {
      // Generate secure invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Create invitation
      const { error } = await supabase
        .from('admin_invitations')
        .insert({
          email: inviteEmail,
          invited_by: user?.id,
          token: token,
          expires_at: expiresAt.toISOString(),
          is_used: false
        });

      if (error) throw error;

      // Send invitation email (you can integrate with your email service)
      const invitationLink = `${window.location.origin}/admin/invite?token=${token}`;
      
      // For now, show the link in a toast (in production, send via email)
      toast({
        title: "Invitation Sent",
        description: `Invitation link: ${invitationLink}`,
      });

      setInviteEmail('');
      setIsInviteDialogOpen(false);
      await loadInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const revokeInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation revoked successfully"
      });

      await loadInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to revoke invitation",
        variant: "destructive"
      });
    }
  };

  const removeAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin removed successfully"
      });

      await checkAdminSetup();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove admin",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showSetupForm) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Initial Admin Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This is the first time setting up admin access. Create your super admin account.
          </p>
          
          <div>
            <Label htmlFor="setup-password">Super Admin Password</Label>
            <div className="relative">
              <Input
                id="setup-password"
                type={showPassword ? "text" : "password"}
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                placeholder="Enter secure password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <Button 
            onClick={createInitialSuperAdmin}
            disabled={inviteLoading || setupPassword.length < 8}
            className="w-full"
          >
            <Lock className="w-4 h-4 mr-2" />
            Create Super Admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Admin Users
            </CardTitle>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New Admin</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                  <Button 
                    onClick={inviteAdmin}
                    disabled={inviteLoading}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">{admin.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {admin.is_super_admin && (
                    <Badge variant="secondary">Super Admin</Badge>
                  )}
                </div>
                {!admin.is_super_admin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAdmin(admin.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.filter(inv => !inv.is_used).map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeInvitation(invitation.id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 