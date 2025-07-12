import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ContentManager } from '@/components/admin/ContentManager';
import { DirectorsManager } from '@/components/admin/DirectorsManager';
import { PartnersManager } from '@/components/admin/PartnersManager';
import { AdminUsersManager } from '@/components/admin/AdminUsersManager';
import { LogOut, Users, FileText, Building, UserCog } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <Badge variant="secondary">Administrator</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
              >
                View Site
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="directors" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Directors</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Partners</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <UserCog className="w-4 h-4" />
              <span>Admin Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Edit website content sections including hero, about, and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Directors Management</CardTitle>
                <CardDescription>
                  Manage director profiles, images, and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DirectorsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Partners & Networks</CardTitle>
                <CardDescription>
                  Manage partner organizations and their logos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PartnersManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>
                  Manage admin users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUsersManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;