import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Globe, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Award,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Share2
} from "lucide-react";

interface ImpactMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: 'financial' | 'social' | 'environmental' | 'governance';
  target: number;
  period: 'monthly' | 'quarterly' | 'yearly';
}

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  impact: number;
  category: string;
  date: string;
  participants: string[];
  outcomes: string[];
}

const ImpactAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dummy data for impact metrics
  const impactMetrics: ImpactMetric[] = [
    {
      id: '1',
      name: 'Total Shared Value',
      value: 156000,
      unit: '€',
      change: 12.5,
      trend: 'up',
      category: 'financial',
      target: 200000,
      period: 'monthly'
    },
    {
      id: '2',
      name: 'Employee Retention',
      value: 94,
      unit: '%',
      change: 8.2,
      trend: 'up',
      category: 'social',
      target: 95,
      period: 'quarterly'
    },
    {
      id: '3',
      name: 'Community Investment',
      value: 45000,
      unit: '€',
      change: 25.0,
      trend: 'up',
      category: 'social',
      target: 60000,
      period: 'monthly'
    },
    {
      id: '4',
      name: 'Carbon Footprint Reduction',
      value: 15,
      unit: '%',
      change: -5.2,
      trend: 'down',
      category: 'environmental',
      target: 20,
      period: 'yearly'
    },
    {
      id: '5',
      name: 'Stakeholder Engagement',
      value: 87,
      unit: '%',
      change: 3.1,
      trend: 'up',
      category: 'governance',
      target: 90,
      period: 'quarterly'
    },
    {
      id: '6',
      name: 'Revenue Growth',
      value: 18,
      unit: '%',
      change: 4.5,
      trend: 'up',
      category: 'financial',
      target: 25,
      period: 'monthly'
    }
  ];

  const impactStories: ImpactStory[] = [
    {
      id: '1',
      title: 'Strategic Partnership with TechCorp',
      description: 'Facilitated by SWI, this partnership created €45,000 in shared value and opened new market opportunities.',
      impact: 45000,
      category: 'Partnership',
      date: '2024-01-15',
      participants: ['Pathway', 'TechCorp', 'SWI Team'],
      outcomes: ['Revenue growth', 'Market expansion', 'Technology sharing']
    },
    {
      id: '2',
      title: 'Employee Profit-Sharing Program',
      description: 'Implemented a new profit-sharing model that distributed €28,000 to employees, improving retention.',
      impact: 28000,
      category: 'Employee',
      date: '2024-01-10',
      participants: ['Pathway Team', 'SWI Advisors'],
      outcomes: ['Improved retention', 'Employee satisfaction', 'Shared ownership']
    },
    {
      id: '3',
      title: 'Community Education Initiative',
      description: 'Launched a local education program benefiting 150 students with €15,000 investment.',
      impact: 15000,
      category: 'Community',
      date: '2024-01-05',
      participants: ['Pathway', 'Local Schools', 'SWI'],
      outcomes: ['Educational impact', 'Community goodwill', 'Sustainable development']
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'social': return Users;
      case 'environmental': return Globe;
      case 'governance': return Target;
      default: return BarChart3;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? impactMetrics 
    : impactMetrics.filter(metric => metric.category === selectedCategory);

  const totalImpact = impactMetrics.reduce((sum, metric) => sum + metric.value, 0);
  const averageChange = impactMetrics.reduce((sum, metric) => sum + metric.change, 0) / impactMetrics.length;

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impact</p>
                <p className="text-2xl font-bold text-gray-900">€{totalImpact.toLocaleString()}</p>
                <p className="text-sm text-gray-700">Cumulative value created</p>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Growth</p>
                <p className="text-2xl font-bold text-gray-900">{averageChange.toFixed(1)}%</p>
                <p className="text-sm text-gray-700">Across all metrics</p>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-gray-900">8.7/10</p>
                <p className="text-sm text-gray-700">Overall performance</p>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quarter
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </Button>
        <Button
          variant={selectedCategory === 'financial' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('financial')}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Financial
        </Button>
        <Button
          variant={selectedCategory === 'social' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('social')}
        >
          <Users className="w-4 h-4 mr-2" />
          Social
        </Button>
        <Button
          variant={selectedCategory === 'environmental' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('environmental')}
        >
          <Globe className="w-4 h-4 mr-2" />
          Environmental
        </Button>
        <Button
          variant={selectedCategory === 'governance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('governance')}
        >
          <Target className="w-4 h-4 mr-2" />
          Governance
        </Button>
      </div>

      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => {
          const Icon = getCategoryIcon(metric.category);
          const progressColor = getProgressColor(metric.value, metric.target);
          const progressPercentage = Math.min((metric.value / metric.target) * 100, 100);

          return (
            <Card key={metric.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <CardTitle className="text-sm">{metric.name}</CardTitle>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value.toLocaleString()}{metric.unit}
                    </p>
                    <p className={`text-sm font-medium ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}% from last period
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Target: {metric.target.toLocaleString()}{metric.unit}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{metric.period}</span>
                  <span className="capitalize">{metric.category}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Impact Stories */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Impact Stories
          </CardTitle>
          <CardDescription>
            Detailed stories of how SWI has contributed to your success
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {impactStories.map((story) => (
            <div key={story.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{story.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{story.description}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  €{story.impact.toLocaleString()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Participants:</p>
                  <div className="flex flex-wrap gap-1">
                    {story.participants.map((participant, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Outcomes:</p>
                  <div className="flex flex-wrap gap-1">
                    {story.outcomes.map((outcome, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {new Date(story.date).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactAnalytics; 