import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import {
  User,
  Mail,
  Lock,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Settings,
  Activity,
  BarChart3,
  Calendar,
  Building2,
  FileText,
  Heart,
  Share2,
  Bookmark,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface UserProfileProps {
  userId?: string;
  isEditable?: boolean;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  isEditable = false,
  className = ""
}) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = userId 
        ? await apiService.getUser(userId)
        : await apiService.getProfile();
      
      if (response.success) {
        setUser(response.data);
        setEditData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          bio: response.data.bio || '',
          avatar: response.data.avatar || ''
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiService.updateProfile(editData);
      if (response.success) {
        setUser(response.data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 w-32 rounded"></div>
                <div className="bg-gray-200 h-3 w-24 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 w-full rounded"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
          <p className="text-gray-600">The requested user profile could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </CardTitle>
          {isEditable && !isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-blue-600 font-semibold text-xl">
                {user.firstName?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editData.firstName}
                      onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editData.lastName}
                      onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={editData.avatar}
                    onChange={(e) => setEditData(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status}
                  </Badge>
                  {user.emailVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Bio</Label>
          {isEditing ? (
            <Textarea
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          ) : (
            <p className="text-gray-600 mt-1">
              {user.bio || 'No bio available'}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{user.companiesCount || 0}</div>
            <div className="text-sm text-gray-600">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{user.followersCount || 0}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{user.filesCount || 0}</div>
            <div className="text-sm text-gray-600">Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user.contentCount || 0}</div>
            <div className="text-sm text-gray-600">Content</div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface UserStatsProps {
  userId: string;
  className?: string;
}

export const UserStats: React.FC<UserStatsProps> = ({
  userId,
  className = ""
}) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserStats();
  }, [userId]);

  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserStats(userId);
      if (response.success) {
        setStats(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load user statistics",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
      toast({
        title: "Error",
        description: "Failed to load user statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="animate-pulse bg-gray-200 h-8 w-12 mx-auto mb-2 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-3 w-16 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Statistics</h3>
          <p className="text-gray-600">No statistics available for this user.</p>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    { label: 'Content Created', value: stats.content_created || 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Reactions Given', value: stats.reactions_given || 0, icon: Heart, color: 'text-red-600' },
    { label: 'Content Shared', value: stats.content_shared || 0, icon: Share2, color: 'text-green-600' },
    { label: 'Content Bookmarked', value: stats.content_bookmarked || 0, icon: Bookmark, color: 'text-purple-600' },
    { label: 'Connections Made', value: stats.connections_made || 0, icon: Users, color: 'text-orange-600' },
    { label: 'Files Uploaded', value: stats.files_uploaded || 0, icon: FileText, color: 'text-indigo-600' },
    { label: 'Companies Joined', value: stats.companies_joined || 0, icon: Building2, color: 'text-pink-600' },
    { label: 'Files Shared', value: stats.files_shared || 0, icon: Share2, color: 'text-cyan-600' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-lg font-semibold text-gray-900">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface UserActivityProps {
  userId: string;
  className?: string;
}

export const UserActivity: React.FC<UserActivityProps> = ({
  userId,
  className = ""
}) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserActivity();
  }, [userId]);

  const loadUserActivity = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserActivity(userId, { limit: 20 });
      if (response.success) {
        setActivities(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load user activity",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading user activity:', error);
      toast({
        title: "Error",
        description: "Failed to load user activity",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="animate-pulse bg-gray-200 w-2 h-2 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
          <p className="text-gray-600">This user hasn't been active recently.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface UserManagementProps {
  className?: string;
}

export const UnifiedUserManagement: React.FC<UserManagementProps> = ({
  className = ""
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllUsers({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        limit: 50
      });
      if (response.success) {
        setUsers(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        loadUsers();
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  <div className="bg-gray-200 h-3 w-1/4 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.first_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                  {user.status}
                </Badge>
                {user.email_verified && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
