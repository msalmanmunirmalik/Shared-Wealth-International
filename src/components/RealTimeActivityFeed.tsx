import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Handshake, 
  Building,
  Clock, 
  Star,
  Activity
} from 'lucide-react';

// Sample data for showcasing the concept (replace with real API data)
const sampleActivities = [
  {
    id: '1',
    activity_type: 'meeting',
    title: 'Pathway & TechFlow Strategic Partnership Meeting',
    description: 'Shared Wealth International facilitated a breakthrough meeting between Pathway and TechFlow, leading to a strategic partnership that will revolutionize sustainable technology solutions.',
    metadata: {
      participants: ['Pathway', 'TechFlow', 'SWI Team'],
      impact_score: 9,
      shared_wealth_contribution: 'Introduced key decision makers, provided market insights, and structured the partnership framework'
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    company: { name: 'Pathway' }
  },
  {
    id: '2',
    activity_type: 'growth',
    title: 'GreenEnergy Revenue Growth',
    description: 'GreenEnergy achieved 40% revenue growth after SWI connected them with major investors and strategic partners.',
    metadata: {
      metric_value: 40,
      metric_unit: 'percentage',
      shared_wealth_impact: 'Connected with 3 major investors, facilitated 2 strategic partnerships, provided market entry strategy'
    },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    company: { name: 'GreenEnergy' }
  },
  {
    id: '3',
    activity_type: 'connection',
    title: 'New Partnership Connection',
    description: 'SWI facilitated a connection between EcoSolutions and GlobalTech, resulting in a $2M partnership deal.',
    metadata: {
      target_company_id: 'globaltech',
      outcome: 'Successful partnership deal',
      value_generated: '$2M partnership agreement signed'
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    company: { name: 'EcoSolutions' }
  },
  {
    id: '4',
    activity_type: 'meeting',
    title: 'Innovation Workshop with StartupHub',
    description: 'SWI organized an innovation workshop connecting 15 startups with industry experts, resulting in 8 new collaborations.',
    metadata: {
      participants: ['StartupHub', '15 Startups', 'Industry Experts'],
      impact_score: 8,
      shared_wealth_contribution: 'Organized workshop, provided expert speakers, facilitated networking sessions'
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    company: { name: 'StartupHub' }
  },
  {
    id: '5',
    activity_type: 'growth',
    title: 'Customer Acquisition Growth',
    description: 'BioTech Solutions increased customer base by 150% through SWI network introductions.',
    metadata: {
      metric_value: 150,
      metric_unit: 'percentage',
      shared_wealth_impact: 'Introduced to 25 potential customers, provided market validation, facilitated pilot programs'
    },
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    company: { name: 'BioTech Solutions' }
  },
  {
    id: '6',
    activity_type: 'connection',
    title: 'Investor Introduction Success',
    description: 'SWI connected CleanTech with Venture Capital Partners, leading to a $1.5M investment round.',
    metadata: {
      target_company_id: 'venture-capital-partners',
      outcome: 'Investment secured',
      value_generated: '$1.5M investment round closed'
    },
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    company: { name: 'CleanTech' }
  }
];

const RealTimeActivityFeed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Handshake className="h-4 w-4" />;
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'connection': return <Users className="h-4 w-4" />;
      case 'post': return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'growth': return 'bg-green-100 text-green-800';
      case 'connection': return 'bg-purple-100 text-purple-800';
      case 'post': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'SWI Meeting';
      case 'growth': return 'Growth Impact';
      case 'connection': return 'Network Connection';
      case 'post': return 'Platform Update';
      default: return 'Activity';
    }
  };

  const filteredActivities = activeFilter === 'all' 
    ? sampleActivities 
    : sampleActivities.filter(activity => activity.activity_type === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Live Impact Stories</h3>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Updates
            </Badge>
      </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Impact Stories</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="connection">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="mt-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                          {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getActivityTypeLabel(activity.activity_type)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(activity.created_at)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="font-medium">{activity.company.name}</span>
                        {activity.activity_type === 'meeting' && activity.metadata.participants && (
                          <span>{activity.metadata.participants.length} participants</span>
                        )}
                      </div>

                      {/* Activity-specific details */}
                      {activity.activity_type === 'meeting' && activity.metadata.shared_wealth_contribution && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm font-medium text-blue-900 mb-1">Shared Wealth International's Contribution:</p>
                          <p className="text-sm text-blue-700">{activity.metadata.shared_wealth_contribution}</p>
                          {activity.metadata.impact_score && (
                            <div className="flex items-center gap-2 mt-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm">Value Rating: {activity.metadata.impact_score}/10</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activity.activity_type === 'growth' && activity.metadata.shared_wealth_impact && (
                        <div className="mb-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-2xl font-bold text-green-600">
                              {activity.metadata.metric_value} {activity.metadata.metric_unit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Growth achieved
                      </div>
                    </div>
                          <p className="text-sm font-medium text-green-900 mb-1">How Shared Wealth International Helped:</p>
                          <p className="text-sm text-green-700">{activity.metadata.shared_wealth_impact}</p>
                        </div>
                      )}

                      {activity.activity_type === 'connection' && activity.metadata.value_generated && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm font-medium text-purple-900 mb-1">Value Generated:</p>
                          <p className="text-sm text-purple-700">{activity.metadata.value_generated}</p>
                          {activity.metadata.outcome && (
                            <p className="text-sm text-purple-600 mt-1">Outcome: {activity.metadata.outcome}</p>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-500">
          Showing {filteredActivities.length} of {sampleActivities.length} impact stories
        </p>
      </div>
    </div>
  );
};

export default RealTimeActivityFeed; 