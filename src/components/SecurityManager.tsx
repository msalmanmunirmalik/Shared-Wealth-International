import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Users, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  UserPlus,
  Trash2,
  Edit,
  Copy,
  Download,
  Activity,
  Clock,
  MapPin,
  Mail,
  Phone,
  Building,
  Crown,
  UserCheck,
  UserX
} from "lucide-react";

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number; // 1-5, where 5 is highest
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  loginLocation: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
}

interface SecurityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const SecurityManager = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'logs' | 'settings'>('users');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Dummy data for user roles
  const userRoles: UserRole[] = [
    {
      id: 'owner',
      name: 'Company Owner',
      description: 'Full access to all company features and settings',
      permissions: [
        'manage_users',
        'manage_roles',
        'view_analytics',
        'edit_company_profile',
        'manage_security',
        'export_data',
        'delete_company'
      ],
      level: 5,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'director',
      name: 'Director',
      description: 'High-level access to company operations and team management',
      permissions: [
        'manage_users',
        'view_analytics',
        'edit_company_profile',
        'manage_team',
        'export_data'
      ],
      level: 4,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Team management and operational access',
      permissions: [
        'view_analytics',
        'manage_team',
        'edit_team_profile',
        'view_reports'
      ],
      level: 3,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'member',
      name: 'Team Member',
      description: 'Basic access to company features and personal profile',
      permissions: [
        'view_own_profile',
        'edit_own_profile',
        'view_company_info',
        'participate_community'
      ],
      level: 2,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to company information',
      permissions: [
        'view_company_info',
        'view_public_data'
      ],
      level: 1,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  // Dummy data for users
  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@pathway.com',
      role: 'owner',
      avatar: '',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      loginLocation: 'Berlin, Germany',
      permissions: ['manage_users', 'manage_roles', 'view_analytics', 'edit_company_profile'],
      twoFactorEnabled: true,
      lastPasswordChange: '2024-01-10T14:20:00Z'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@pathway.com',
      role: 'director',
      avatar: '',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      loginLocation: 'Munich, Germany',
      permissions: ['manage_users', 'view_analytics', 'edit_company_profile'],
      twoFactorEnabled: false,
      lastPasswordChange: '2024-01-08T11:45:00Z'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa@pathway.com',
      role: 'manager',
      avatar: '',
      status: 'active',
      lastLogin: '2024-01-14T16:20:00Z',
      loginLocation: 'Hamburg, Germany',
      permissions: ['view_analytics', 'manage_team'],
      twoFactorEnabled: true,
      lastPasswordChange: '2024-01-12T08:30:00Z'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@pathway.com',
      role: 'member',
      avatar: '',
      status: 'pending',
      lastLogin: '2024-01-13T13:45:00Z',
      loginLocation: 'Frankfurt, Germany',
      permissions: ['view_own_profile', 'edit_own_profile'],
      twoFactorEnabled: false,
      lastPasswordChange: '2024-01-05T10:15:00Z'
    }
  ];

  // Dummy data for security logs
  const securityLogs: SecurityLog[] = [
    {
      id: '1',
      user: 'Sarah Johnson',
      action: 'Login',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'Berlin, Germany',
      status: 'success',
      details: 'Successful login via email/password'
    },
    {
      id: '2',
      user: 'Mike Chen',
      action: 'Password Change',
      timestamp: '2024-01-15T09:45:00Z',
      ipAddress: '192.168.1.101',
      location: 'Munich, Germany',
      status: 'success',
      details: 'Password updated successfully'
    },
    {
      id: '3',
      user: 'Unknown',
      action: 'Failed Login',
      timestamp: '2024-01-15T08:20:00Z',
      ipAddress: '203.45.67.89',
      location: 'Unknown',
      status: 'failed',
      details: 'Invalid credentials for user@pathway.com'
    },
    {
      id: '4',
      user: 'Lisa Rodriguez',
      action: 'Role Assignment',
      timestamp: '2024-01-14T16:30:00Z',
      ipAddress: '192.168.1.102',
      location: 'Hamburg, Germany',
      status: 'success',
      details: 'Role changed from Member to Manager'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (roleId: string) => {
    const role = userRoles.find(r => r.id === roleId);
    return role?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Management</h1>
          <p className="text-gray-600">Manage user access, roles, and security settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.twoFactorEnabled).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Roles</p>
                <p className="text-2xl font-bold text-gray-900">{userRoles.length}</p>
              </div>
              <Users className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Events</p>
                <p className="text-2xl font-bold text-gray-900">{securityLogs.length}</p>
              </div>
              <Activity className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('users')}
          className="flex-1"
        >
          <Users className="w-4 h-4 mr-2" />
          Users
        </Button>
        <Button
          variant={activeTab === 'roles' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('roles')}
          className="flex-1"
        >
          <Shield className="w-4 h-4 mr-2" />
          Roles
        </Button>
        <Button
          variant={activeTab === 'logs' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('logs')}
          className="flex-1"
        >
          <Activity className="w-4 h-4 mr-2" />
          Security Logs
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('settings')}
          className="flex-1"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="w-64" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>
                            {userRoles.find(r => r.id === user.role)?.name}
                          </Badge>
                          <Badge className={getUserStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                          {user.twoFactorEnabled && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="w-3 h-3 mr-1" />
                              2FA
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last login</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{user.loginLocation}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userRoles.map((role) => (
              <Card key={role.id} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Crown className="w-5 h-5" />
                        <span>{role.name}</span>
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Badge className={role.color}>
                      Level {role.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {role.permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{permission.replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {users.filter(u => u.role === role.id).length} users
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Security Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Security Activity Log</h2>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {securityLogs.map((log) => (
              <Card key={log.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(log.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{log.action}</h4>
                        <p className="text-sm text-gray-600">{log.user}</p>
                        <p className="text-xs text-gray-500">{log.details}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">{log.ipAddress}</p>
                      <p className="text-xs text-gray-500">{log.location}</p>
                    </div>
                    
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Configure login and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Force all users to enable 2FA</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="8">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Policy</Label>
                    <p className="text-sm text-gray-500">Minimum password requirements</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Access Control Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Manage data access and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-gray-500">Restrict access to specific IPs</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Export</Label>
                    <p className="text-sm text-gray-500">Allow users to export data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-gray-500">Log all user actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityManager; 