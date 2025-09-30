import React, { useState, useEffect } from 'react';
import { Users, Heart, Share2, TrendingUp, Activity, MessageCircle, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { ReactionButton } from '@/components/social/ReactionButton';
import { FollowButton } from '@/components/social/FollowButton';
import { ShareButton } from '@/components/social/ShareButton';

interface DashboardStats {
  totalCompanies: number;
  networkPartners: number;
  growthRate: number;
  activeProjects: number;
  pendingApplications: number;
  approvedCompanies: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface TrendingContent {
  contentId: string;
  contentType: string;
  title: string;
  shareCount: number;
  reactionCount: number;
  author: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export const SocialDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [trendingContent, setTrendingContent] = useState<TrendingContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [statsResponse, activitiesResponse, trendingResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivities(10),
        apiService.getTrendingSharedContent(5, '7d')
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (activitiesResponse.success) {
        setRecentActivities(activitiesResponse.data);
      }

      if (trendingResponse.success) {
        setTrendingContent(trendingResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.growthRate || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Partners</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.networkPartners || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user?.avatarUrl} />
                      <AvatarFallback>
                        {activity.user ? getInitials(activity.user.firstName, activity.user.lastName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                          {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'Unknown User'}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Content */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingContent.map((content) => (
                  <div key={content.contentId} className="p-3 rounded-lg border hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={content.author.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(content.author.firstName, content.author.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{content.title}</p>
                        <p className="text-xs text-gray-500">
                          by {content.author.firstName} {content.author.lastName}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-gray-500">{content.reactionCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-gray-500">{content.shareCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <ReactionButton
                            postId={content.contentId}
                            postType={content.contentType}
                            className="text-xs"
                          />
                          <ShareButton
                            contentId={content.contentId}
                            contentType={content.contentType}
                            contentTitle={content.title}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Social Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reactions">Reactions</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="sharing">Sharing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reactions" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reaction System</h3>
                <p className="text-gray-600">
                  Users can react to content with 7 different reaction types: like, dislike, love, laugh, wow, sad, and angry.
                </p>
                <div className="flex items-center space-x-4">
                  <ReactionButton
                    postId="demo-post-1"
                    postType="forum_topic"
                    className="text-sm"
                  />
                  <span className="text-sm text-gray-500">Try the reaction system above</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="connections" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Following System</h3>
                <p className="text-gray-600">
                  Users can follow each other, view followers/following lists, and discover mutual connections.
                </p>
                <div className="flex items-center space-x-4">
                  <FollowButton
                    targetUserId="demo-user-1"
                    targetUserName="Demo User"
                    className="text-sm"
                  />
                  <span className="text-sm text-gray-500">Follow system demo</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sharing" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Sharing</h3>
                <p className="text-gray-600">
                  Share content across multiple platforms including internal, LinkedIn, Twitter, Facebook, and email.
                </p>
                <div className="flex items-center space-x-4">
                  <ShareButton
                    contentId="demo-content-1"
                    contentType="forum_topic"
                    contentTitle="Demo Content"
                    className="text-sm"
                  />
                  <span className="text-sm text-gray-500">Try the sharing system above</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
