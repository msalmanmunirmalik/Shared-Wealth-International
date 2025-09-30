import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  Heart, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter
} from 'lucide-react';

const ImpactAnalytics = () => {
  const [timeRange, setTimeRange] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const analyticsData = {
    overview: {
      totalImpact: '2.3M+',
      economicValue: '$156M+',
      activeProjects: '1,200+',
      partnerCompanies: '450+'
    },
    trends: [
      { month: 'Jan', social: 85, economic: 78, environmental: 92 },
      { month: 'Feb', social: 87, economic: 80, environmental: 93 },
      { month: 'Mar', social: 89, economic: 82, environmental: 94 },
      { month: 'Apr', social: 88, economic: 81, environmental: 93 },
      { month: 'May', social: 90, economic: 83, environmental: 95 },
      { month: 'Jun', social: 92, economic: 85, environmental: 96 },
      { month: 'Jul', social: 91, economic: 84, environmental: 95 },
      { month: 'Aug', social: 93, economic: 86, environmental: 96 },
      { month: 'Sep', social: 94, economic: 87, environmental: 97 },
      { month: 'Oct', social: 93, economic: 86, environmental: 96 },
      { month: 'Nov', social: 95, economic: 88, environmental: 97 },
      { month: 'Dec', social: 96, economic: 89, environmental: 98 }
    ],
    sectorBreakdown: [
      { sector: 'Technology', impact: 28, projects: 45, value: '$45M' },
      { sector: 'Healthcare', impact: 22, projects: 38, value: '$38M' },
      { sector: 'Education', impact: 20, projects: 32, value: '$32M' },
      { sector: 'Agriculture', impact: 15, projects: 25, value: '$25M' },
      { sector: 'Energy', impact: 15, projects: 20, value: '$16M' }
    ],
    regionalPerformance: [
      { region: 'Africa', countries: 15, impact: 95, growth: '+12%' },
      { region: 'Asia', countries: 12, impact: 88, growth: '+8%' },
      { region: 'Latin America', countries: 8, impact: 82, growth: '+15%' },
      { region: 'Europe', countries: 6, impact: 78, growth: '+6%' },
      { region: 'North America', countries: 3, impact: 75, growth: '+4%' }
    ]
  };

  const metrics = [
    {
      name: 'Social Impact Score',
      value: '96',
      unit: '/100',
      change: '+2.1%',
      trend: 'up',
      description: 'Overall social impact measurement across all projects'
    },
    {
      name: 'Economic Value Generated',
      value: '$156M',
      unit: '',
      change: '+8.5%',
      trend: 'up',
      description: 'Total economic value created through shared wealth initiatives'
    },
    {
      name: 'Environmental Impact',
      value: '98',
      unit: '/100',
      change: '+1.8%',
      trend: 'up',
      description: 'Environmental sustainability and carbon reduction metrics'
    },
    {
      name: 'Stakeholder Satisfaction',
      value: '94',
      unit: '/100',
      change: '+3.2%',
      trend: 'up',
      description: 'Average satisfaction score from all stakeholders'
    }
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : '↘';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Impact Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analytics and insights into our global impact performance
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Metric Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="social">Social Impact</SelectItem>
                <SelectItem value="economic">Economic Value</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <span className="text-lg text-gray-500 mb-1">
                    {metric.unit}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)} {metric.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalImpact}
              </CardTitle>
              <CardDescription>Total People Impacted</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.economicValue}
              </CardTitle>
              <CardDescription>Economic Value Created</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Target className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.activeProjects}
              </CardTitle>
              <CardDescription>Active Projects</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Globe className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.partnerCompanies}
              </CardTitle>
              <CardDescription>Partner Companies</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sector Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Sector Breakdown</span>
              </CardTitle>
              <CardDescription>
                Impact distribution across different sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.sectorBreakdown.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{sector.sector}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{sector.impact}%</div>
                      <div className="text-sm text-gray-500">{sector.projects} projects</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Regional Performance</span>
              </CardTitle>
              <CardDescription>
                Impact performance by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.regionalPerformance.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{region.impact}/100</div>
                      <div className="text-sm text-green-600">{region.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Impact Trends</span>
            </CardTitle>
            <CardDescription>
              Performance trends over the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive chart would be displayed here</p>
                <p className="text-sm">Showing data for: {timeRange}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Key Insights & Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Top Performers</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Technology sector shows highest impact growth (+28%)</li>
                  <li>• African region leads with 95/100 impact score</li>
                  <li>• Environmental initiatives achieve 98/100 score</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Growth Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Expand Latin America operations (+15% growth)</li>
                  <li>• Increase healthcare sector partnerships</li>
                  <li>• Strengthen North America presence</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpactAnalytics;
