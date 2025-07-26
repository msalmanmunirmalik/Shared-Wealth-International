import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Handshake, 
  Calendar, 
  Clock, 
  Star,
  ArrowRight,
  MessageSquare,
  Target,
  Award,
  Building,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ActivityFeedItem {
  id: string;
  activity_type: 'meeting' | 'growth' | 'connection' | 'post' | 'milestone';
  company_id: string;
  user_id: string;
  title: string;
  description: string | null;
  metadata: any;
  is_featured: boolean | null;
  created_at: string;
  company?: {
    name: string;
    logo_url: string | null;
  };
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const RealTimeActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'meeting' | 'growth' | 'connection' | 'post' | 'milestone'>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadActivityFeed();
    setupRealtimeSubscription();
  }, [filter]);

  const loadActivityFeed = async () => {
    try {
      let query = supabase
        .from('activity_feed')
        .select(`
          *,
          company:companies(name, logo_url),
          user:profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading activity feed:', error);
        toast({
          title: "Error",
          description: "Failed to load activity feed",
          variant: "destructive"
        });
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Activity feed error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('activity_feed_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed'
        },
        (payload) => {
          // Add new activity to the top of the list
          setActivities(prev => [payload.new as ActivityFeedItem, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-5 h-5" />;
      case 'growth':
        return <TrendingUp className="w-5 h-5" />;
      case 'connection':
        return <Handshake className="w-5 h-5" />;
      case 'post':
        return <MessageSquare className="w-5 h-5" />;
      case 'milestone':
        return <Award className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growth':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'connection':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'post':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'milestone':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderActivityContent = (activity: ActivityFeedItem) => {
    const metadata = activity.metadata || {};

    switch (activity.activity_type) {
      case 'meeting':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(activity.created_at).toLocaleDateString()}</span>
              {metadata.participants && (
                <span>• {metadata.participants.length} participants</span>
              )}
            </div>
            {metadata.shared_wealth_contribution && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Shared Wealth Contribution:</p>
                <p className="text-sm text-blue-700">{metadata.shared_wealth_contribution}</p>
              </div>
            )}
            {metadata.impact_score && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">Impact Score: {metadata.impact_score}/10</span>
              </div>
            )}
          </div>
        );

      case 'growth':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-green-600">
                {metadata.metric_value} {metadata.metric_unit}
              </div>
              <div className="text-sm text-muted-foreground">
                {metadata.metric_type} growth
              </div>
            </div>
            {metadata.shared_wealth_impact && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-900">Shared Wealth Impact:</p>
                <p className="text-sm text-green-700">{metadata.shared_wealth_impact}</p>
              </div>
            )}
          </div>
        );

      case 'connection':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Handshake className="w-4 h-4" />
              <span>New {metadata.connection_type} connection</span>
            </div>
            {metadata.value_generated && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-purple-900">Value Generated:</p>
                <p className="text-sm text-purple-700">{metadata.value_generated}</p>
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-muted-foreground">{activity.description}</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Real-Time Activity Feed</h2>
          <p className="text-muted-foreground">
            Live updates from the Shared Wealth International community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Activities', count: activities.length },
          { key: 'meeting', label: 'Meetings', count: activities.filter(a => a.activity_type === 'meeting').length },
          { key: 'growth', label: 'Growth', count: activities.filter(a => a.activity_type === 'growth').length },
          { key: 'connection', label: 'Connections', count: activities.filter(a => a.activity_type === 'connection').length },
          { key: 'post', label: 'Posts', count: activities.filter(a => a.activity_type === 'post').length },
          { key: 'milestone', label: 'Milestones', count: activities.filter(a => a.activity_type === 'milestone').length }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.key as any)}
            className="flex items-center gap-2"
          >
            {tab.label}
            <Badge variant="secondary" className="ml-1">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activities yet. Be the first to share an update!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className={`transition-all duration-200 hover:shadow-md ${
              activity.is_featured ? 'ring-2 ring-yellow-200 bg-yellow-50/50' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Company Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={activity.company?.logo_url || ''} />
                    <AvatarFallback>
                      {activity.company?.name?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${getActivityColor(activity.activity_type)}`}
                        >
                          {getActivityIcon(activity.activity_type)}
                          <span className="ml-1 capitalize">{activity.activity_type}</span>
                        </Badge>
                        {activity.is_featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(activity.created_at)}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy">{activity.company?.name}</span>
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-navy">{activity.title}</h3>

                    {/* Content */}
                    {renderActivityContent(activity)}

                    {/* Description */}
                    {activity.description && (
                      <p className="text-muted-foreground">{activity.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {activities.length >= 50 && (
        <div className="text-center">
          <Button variant="outline" onClick={loadActivityFeed}>
            Load More Activities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RealTimeActivityFeed; 