import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Handshake, Target, Award } from 'lucide-react';

// Sample data for showcasing the concept (replace with real API data)
const sampleActivities = [
  {
    id: '1',
    activity_type: 'meeting',
    title: 'Pathway & TechFlow Partnership',
    description: 'SWI connected Pathway with TechFlow, resulting in a strategic partnership.',
    metadata: {
      participants: ['Pathway', 'TechFlow'],
      impact_score: 9,
      shared_wealth_contribution: 'Introduced key decision makers and facilitated partnership discussions'
    },
    is_featured: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    company: { name: 'Pathway' }
  },
  {
    id: '2',
    activity_type: 'growth',
    title: 'GreenEnergy Revenue Growth',
    description: 'GreenEnergy achieved 40% revenue growth through SWI connections.',
    metadata: {
      metric_value: 40,
      metric_unit: 'percentage',
      shared_wealth_impact: 'Connected with investors and strategic partners'
    },
    is_featured: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    company: { name: 'GreenEnergy' }
  },
  {
    id: '3',
    activity_type: 'connection',
    title: 'EcoSolutions Partnership Deal',
    description: 'SWI facilitated a $2M partnership deal between EcoSolutions and GlobalTech.',
    metadata: {
      target_company_id: 'globaltech',
      outcome: 'Partnership deal signed',
      value_generated: '$2M partnership agreement'
    },
    is_featured: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    company: { name: 'EcoSolutions' }
  },
  {
    id: '4',
    activity_type: 'post',
    title: 'Impact Metrics Launched',
    description: 'Companies can now easily track and showcase how SWI creates value for their growth.',
    metadata: { category: 'Platform Update' },
    is_featured: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    company: { name: 'Shared Wealth International' }
  },
  {
    id: '5',
    activity_type: 'meeting',
    title: 'StartupHub Innovation Workshop',
    description: 'SWI organized a workshop connecting 15 startups with industry experts.',
    metadata: {
      participants: ['StartupHub', '15 Startups', 'Industry Experts'],
      impact_score: 8,
      shared_wealth_contribution: 'Organized workshop and facilitated networking sessions'
    },
    is_featured: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    company: { name: 'StartupHub' }
  },
  {
    id: '6',
    activity_type: 'growth',
    title: 'BioTech Customer Growth',
    description: 'BioTech Solutions increased customer base by 150% through SWI network.',
    metadata: {
      metric_value: 150,
      metric_unit: 'percentage',
      shared_wealth_impact: 'Introduced to potential customers and provided market validation'
    },
    is_featured: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    company: { name: 'BioTech Solutions' }
  }
];

const LatestNews: React.FC = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Handshake className="h-4 w-4" />;
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'connection': return <Users className="h-4 w-4" />;
      case 'post': return <Target className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
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
      case 'growth': return 'Growth';
      case 'connection': return 'Connection';
      case 'post': return 'Update';
      default: return 'Activity';
    }
  };

  const featuredActivities = sampleActivities.filter(activity => activity.is_featured);
  const recentActivities = sampleActivities.filter(activity => !activity.is_featured).slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Impact Metrics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Shared Wealth International creates real value for companies. 
            Simple tracking of success stories and measurable impact.
          </p>
        </div>

        {/* Featured Stories */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Featured Success Stories</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getActivityColor(activity.activity_type)}>
                      <span className="mr-1">{getActivityIcon(activity.activity_type)}</span>
                      {getActivityTypeLabel(activity.activity_type)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(activity.created_at)}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {activity.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {activity.company.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {activity.description}
                  </p>
                  
                  {/* Show specific details based on activity type */}
                  {activity.activity_type === 'meeting' && activity.metadata.shared_wealth_contribution && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">SWI Contribution:</p>
                      <p className="text-sm text-blue-700">{activity.metadata.shared_wealth_contribution}</p>
                    </div>
                  )}
                  
                  {activity.activity_type === 'growth' && activity.metadata.shared_wealth_impact && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">SWI Impact:</p>
                      <p className="text-sm text-green-700">{activity.metadata.shared_wealth_impact}</p>
                    </div>
                  )}
                  
                  {activity.activity_type === 'connection' && activity.metadata.value_generated && (
                    <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800 mb-1">Value Generated:</p>
                      <p className="text-sm text-purple-700">{activity.metadata.value_generated}</p>
                  </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          </div>

        {/* Recent Activities */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Network Activity</h3>
            <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getActivityTypeLabel(activity.activity_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{activity.company.name}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
            </div>
            
        {/* Call to Action */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <a href="/collaboration-hub">
              View All Impact Metrics
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
              </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;