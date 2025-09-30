import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import {
  BarChart3,
  Users,
  Building2,
  FileText,
  Heart,
  Share2,
  Bookmark,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageCircle,
  Calendar,
  Settings,
  RefreshCw
} from "lucide-react";

interface DashboardWidgetProps {
  id: string;
  type: string;
  title: string;
  config: any;
  data?: any;
  onRefresh?: () => void;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  type,
  title,
  config,
  data,
  onRefresh,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      await onRefresh();
      setIsLoading(false);
    }
  };

  const renderWidgetContent = () => {
    switch (type) {
      case 'welcome':
        return <WelcomeWidget data={data} />;
      case 'analytics':
        return <AnalyticsWidget data={data} config={config} />;
      case 'recent_content':
        return <RecentContentWidget data={data} config={config} />;
      case 'notifications':
        return <NotificationsWidget data={data} config={config} />;
      case 'activity_feed':
        return <ActivityFeedWidget data={data} config={config} />;
      case 'company_stats':
        return <CompanyStatsWidget data={data} />;
      case 'team_members':
        return <TeamMembersWidget data={data} config={config} />;
      case 'platform_stats':
        return <PlatformStatsWidget data={data} />;
      case 'system_health':
        return <SystemHealthWidget data={data} />;
      default:
        return <div className="p-4 text-center text-gray-500">Unknown widget type: {type}</div>;
    }
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

const WelcomeWidget: React.FC<{ data?: any }> = ({ data }) => {
  const user = data?.user;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">
        {greeting}, {user?.first_name || 'User'}!
      </h3>
      <p className="text-sm text-gray-600">
        Welcome to your dashboard. Here's what's happening today.
      </p>
      {data?.companies && data.companies.length > 0 && (
        <div className="flex items-center space-x-2 mt-3">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            {data.companies.length} company{data.companies.length !== 1 ? 'ies' : ''} connected
          </span>
        </div>
      )}
    </div>
  );
};

const AnalyticsWidget: React.FC<{ data?: any; config?: any }> = ({ data, config }) => {
  const analytics = data?.analytics || {};
  const period = config?.period || '30d';

  const metrics = [
    {
      label: 'Content Created',
      value: analytics.content_created || 0,
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      label: 'Reactions Given',
      value: analytics.reactions_given || 0,
      icon: Heart,
      color: 'text-red-500'
    },
    {
      label: 'Content Shared',
      value: analytics.content_shared || 0,
      icon: Share2,
      color: 'text-green-500'
    },
    {
      label: 'Connections Made',
      value: analytics.connections_made || 0,
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">Analytics ({period})</h4>
        <BarChart3 className="w-4 h-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <div className="text-lg font-semibold">{metric.value}</div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentContentWidget: React.FC<{ data?: any; config?: any }> = ({ data, config }) => {
  const content = data?.recentContent || [];
  const limit = config?.limit || 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">Recent Content</h4>
        <FileText className="w-4 h-4 text-gray-400" />
      </div>
      {content.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No content yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {content.slice(0, limit).map((item: any) => (
            <div key={item.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NotificationsWidget: React.FC<{ data?: any; config?: any }> = ({ data, config }) => {
  const notifications = data?.notifications || [];
  const limit = config?.limit || 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">Notifications</h4>
        <Bell className="w-4 h-4 text-gray-400" />
      </div>
      {notifications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.slice(0, limit).map((notification: any) => (
            <div key={notification.id} className={`p-2 rounded-lg ${!notification.is_read ? 'bg-blue-50 border-l-2 border-blue-500' : 'bg-gray-50'}`}>
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActivityFeedWidget: React.FC<{ data?: any; config?: any }> = ({ data, config }) => {
  const activities = data?.activityFeed || [];
  const limit = config?.limit || 10;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">Activity Feed</h4>
        <Activity className="w-4 h-4 text-gray-400" />
      </div>
      {activities.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.slice(0, limit).map((activity: any) => (
            <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
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
      )}
    </div>
  );
};

const CompanyStatsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const company = data?.company;
  const analytics = data?.analytics;

  if (!company) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No company data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-blue-500" />
        <h4 className="text-sm font-medium text-gray-600">{company.name}</h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold">{analytics?.content_created || 0}</div>
          <div className="text-xs text-gray-500">Content Created</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{analytics?.total_reactions || 0}</div>
          <div className="text-xs text-gray-500">Total Reactions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{analytics?.total_shares || 0}</div>
          <div className="text-xs text-gray-500">Total Shares</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{company.team_size || 0}</div>
          <div className="text-xs text-gray-500">Team Members</div>
        </div>
      </div>
    </div>
  );
};

const TeamMembersWidget: React.FC<{ data?: any; config?: any }> = ({ data, config }) => {
  const team = data?.team || [];
  const limit = config?.limit || 10;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">Team Members</h4>
        <Users className="w-4 h-4 text-gray-400" />
      </div>
      {team.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No team members</p>
        </div>
      ) : (
        <div className="space-y-2">
          {team.slice(0, limit).map((member: any) => (
            <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {member.first_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {member.first_name} {member.last_name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PlatformStatsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const platform = data?.platform;

  if (!platform) {
    return (
      <div className="text-center py-4 text-gray-500">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No platform data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h4 className="text-sm font-medium text-gray-600">Platform Statistics</h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold">{platform.total_users || 0}</div>
          <div className="text-xs text-gray-500">Total Users</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{platform.total_companies || 0}</div>
          <div className="text-xs text-gray-500">Total Companies</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{platform.total_content || 0}</div>
          <div className="text-xs text-gray-500">Total Content</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{platform.total_reactions || 0}</div>
          <div className="text-xs text-gray-500">Total Reactions</div>
        </div>
      </div>
    </div>
  );
};

const SystemHealthWidget: React.FC<{ data?: any }> = ({ data }) => {
  const system = data?.system;

  if (!system) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No system data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-green-500" />
        <h4 className="text-sm font-medium text-gray-600">System Health</h4>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Database</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Healthy
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">API</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Online
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Notifications</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Active
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Uptime</span>
          <span className="text-sm font-medium text-gray-900">99.9%</span>
        </div>
      </div>
    </div>
  );
};

interface UnifiedDashboardProps {
  dashboardType?: 'user' | 'company' | 'admin';
  companyId?: string;
  className?: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  dashboardType = 'user',
  companyId,
  className = ""
}) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [dashboardType, companyId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (dashboardType === 'company' && companyId) {
        response = await apiService.getCompanyDashboard(companyId);
      } else if (dashboardType === 'admin') {
        response = await apiService.getAdminDashboard();
      } else {
        response = await apiService.getDashboard();
      }

      if (response.success) {
        setDashboardData(response.data);
        
        // Load widgets configuration
        const widgetsResponse = await apiService.getDashboardWidgets(dashboardType);
        if (widgetsResponse.success) {
          setWidgets(widgetsResponse.data);
        }
      } else {
        setError(response.message || 'Failed to load dashboard data');
        toast({
          title: "Error",
          description: response.message || "Failed to load dashboard data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWidgetRefresh = async (widgetId: string) => {
    // Implement widget-specific refresh logic
    await loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-64">
              <CardHeader>
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-500 mb-4">
          <BarChart3 className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadDashboardData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            id={widget.id}
            type={widget.type}
            title={widget.title}
            config={widget.config}
            data={dashboardData}
            onRefresh={() => handleWidgetRefresh(widget.id)}
            className={`col-span-${widget.position.w} row-span-${widget.position.h}`}
          />
        ))}
      </div>
    </div>
  );
};
