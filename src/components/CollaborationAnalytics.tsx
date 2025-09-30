import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  Handshake, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Globe,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  totalMeetings: number;
  totalGrowthMetrics: number;
  totalConnections: number;
  averageImpactScore: number;
  topCollaborationTypes: Array<{ type: string; count: number }>;
  recentGrowth: Array<{ date: string; value: number; type: string }>;
  sharedWealthContributions: Array<{ contribution: string; count: number }>;
  companyActivity: Array<{ company: string; activities: number }>;
}

const CollaborationAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const { user } = useAuth();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      // Load collaboration meetings
      const { data: meetings } = await supabase
        .from('collaboration_meetings')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      // Load growth metrics
      const { data: growthMetrics } = await supabase
        .from('company_growth_metrics')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      // Load network connections
      const { data: connections } = await supabase
        .from('network_connections')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      // Load activity feed
      const { data: activities } = await supabase
        .from('activity_feed')
        .select(`
          *,
          company:companies(name)
        `)
        .gte('created_at', daysAgo.toISOString());

      // Calculate analytics
      const analyticsData: AnalyticsData = {
        totalMeetings: meetings?.length || 0,
        totalGrowthMetrics: growthMetrics?.length || 0,
        totalConnections: connections?.length || 0,
        averageImpactScore: calculateAverageImpactScore(meetings),
        topCollaborationTypes: calculateTopCollaborationTypes(connections),
        recentGrowth: calculateRecentGrowth(growthMetrics),
        sharedWealthContributions: calculateSharedWealthContributions(meetings, growthMetrics),
        companyActivity: calculateCompanyActivity(activities)
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Analytics load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageImpactScore = (meetings: any[]) => {
    if (!meetings || meetings.length === 0) return 0;
    const scores = meetings.map(m => m.impact_score).filter(s => s !== null);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  };

  const calculateTopCollaborationTypes = (connections: any[]) => {
    if (!connections) return [];
    const typeCounts: { [key: string]: number } = {};
    connections.forEach(conn => {
      typeCounts[conn.connection_type] = (typeCounts[conn.connection_type] || 0) + 1;
    });
    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateRecentGrowth = (metrics: any[]) => {
    if (!metrics) return [];
    return metrics
      .sort((a, b) => new Date(b.metric_date).getTime() - new Date(a.metric_date).getTime())
      .slice(0, 10)
      .map(m => ({
        date: m.metric_date,
        value: m.metric_value,
        type: m.metric_type
      }));
  };

  const calculateSharedWealthContributions = (meetings: any[], metrics: any[]) => {
    const contributions: { [key: string]: number } = {};
    
    // Count meeting contributions
    meetings?.forEach(meeting => {
      if (meeting.shared_wealth_contribution) {
        const contribution = meeting.shared_wealth_contribution;
        contributions[contribution] = (contributions[contribution] || 0) + 1;
      }
    });

    // Count growth metric contributions
    metrics?.forEach(metric => {
      if (metric.shared_wealth_impact) {
        const contribution = metric.shared_wealth_impact;
        contributions[contribution] = (contributions[contribution] || 0) + 1;
      }
    });

    return Object.entries(contributions)
      .map(([contribution, count]) => ({ contribution, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateCompanyActivity = (activities: any[]) => {
    if (!activities) return [];
    const companyCounts: { [key: string]: number } = {};
    activities.forEach(activity => {
      const companyName = activity.company?.name || 'Unknown';
      companyCounts[companyName] = (companyCounts[companyName] || 0) + 1;
    });
    return Object.entries(companyCounts)
      .map(([company, activities]) => ({ company, activities }))
      .sort((a, b) => b.activities - a.activities)
      .slice(0, 10);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Collaboration Analytics</h2>
          <p className="text-muted-foreground">
            Insights from Shared Wealth International's real-time collaboration network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Meetings</p>
                <p className="text-2xl font-bold text-navy">{analytics.totalMeetings}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Metrics</p>
                <p className="text-2xl font-bold text-navy">{analytics.totalGrowthMetrics}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Connections</p>
                <p className="text-2xl font-bold text-navy">{analytics.totalConnections}</p>
              </div>
              <Handshake className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Impact Score</p>
                <p className="text-2xl font-bold text-navy">{analytics.averageImpactScore.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Collaboration Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Collaboration Types
            </CardTitle>
            <CardDescription>
              Most common types of connections between companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCollaborationTypes.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shared Wealth Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Shared Wealth Impact
            </CardTitle>
            <CardDescription>
              How Shared Wealth International is creating value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.sharedWealthContributions.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contribution {index + 1}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.contribution}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Growth Metrics
            </CardTitle>
            <CardDescription>
              Latest growth achievements from member companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentGrowth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{item.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Active Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Most Active Companies
            </CardTitle>
            <CardDescription>
              Companies with the most collaboration activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.companyActivity.map((item, index) => (
                <div key={item.company} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.company}</span>
                  </div>
                  <Badge variant="secondary">{item.activities} activities</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-navy mb-2">
              Shared Wealth International Impact Summary
            </h3>
            <p className="text-muted-foreground">
              Over the last {timeRange} days, our community has facilitated{' '}
              <span className="font-semibold">{analytics.totalMeetings}</span> collaboration meetings,{' '}
              <span className="font-semibold">{analytics.totalConnections}</span> network connections, and tracked{' '}
              <span className="font-semibold">{analytics.totalGrowthMetrics}</span> growth metrics with an average impact score of{' '}
              <span className="font-semibold">{analytics.averageImpactScore.toFixed(1)}/10</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationAnalytics; 