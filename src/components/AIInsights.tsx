import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Calendar,
  MapPin,
  Activity,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Settings,
  Play,
  Pause
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  priority: number;
  timestamp: string;
  actionable: boolean;
  action?: string;
  metrics?: {
    current: number;
    predicted: number;
    unit: string;
  };
}

interface PredictiveMetric {
  id: string;
  name: string;
  currentValue: number;
  predictedValue: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
  factors: string[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
  priority: number;
}

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations' | 'analytics'>('insights');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Dummy data for AI insights
  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'recommendation',
      title: 'Implement Employee Profit-Sharing',
      description: 'Based on your current performance and industry benchmarks, implementing profit-sharing could increase employee retention by 25% and productivity by 15%.',
      confidence: 89,
      impact: 'high',
      category: 'Employee Engagement',
      priority: 1,
      timestamp: '2024-01-15T10:30:00Z',
      actionable: true,
      action: 'Start Implementation',
      metrics: {
        current: 78,
        predicted: 97,
        unit: '%'
      }
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Revenue Growth Forecast',
      description: 'AI predicts 18% revenue growth in Q2 2024 based on current trends, market conditions, and your shared wealth initiatives.',
      confidence: 92,
      impact: 'high',
      category: 'Financial Performance',
      priority: 2,
      timestamp: '2024-01-15T09:15:00Z',
      actionable: false,
      metrics: {
        current: 156000,
        predicted: 184000,
        unit: '€'
      }
    },
    {
      id: '3',
      type: 'alert',
      title: 'Stakeholder Engagement Risk',
      description: 'Stakeholder satisfaction has decreased by 8% this month. Consider scheduling additional communication sessions.',
      confidence: 76,
      impact: 'medium',
      category: 'Stakeholder Relations',
      priority: 3,
      timestamp: '2024-01-15T08:45:00Z',
      actionable: true,
      action: 'Schedule Meeting'
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Community Partnership Opportunity',
      description: 'Local education institutions are showing interest in shared wealth models. Potential partnership could create €50,000 in shared value.',
      confidence: 84,
      impact: 'high',
      category: 'Community Impact',
      priority: 1,
      timestamp: '2024-01-14T16:20:00Z',
      actionable: true,
      action: 'Contact Partners'
    }
  ];

  // Dummy data for predictive metrics
  const predictiveMetrics: PredictiveMetric[] = [
    {
      id: '1',
      name: 'Employee Retention Rate',
      currentValue: 87,
      predictedValue: 94,
      trend: 'up',
      confidence: 89,
      timeframe: 'Q2 2024',
      factors: ['Profit-sharing implementation', 'Improved communication', 'Career development programs']
    },
    {
      id: '2',
      name: 'Revenue Growth',
      currentValue: 12,
      predictedValue: 18,
      trend: 'up',
      confidence: 92,
      timeframe: 'Q2 2024',
      factors: ['Market expansion', 'Product innovation', 'Shared wealth benefits']
    },
    {
      id: '3',
      name: 'Stakeholder Satisfaction',
      currentValue: 82,
      predictedValue: 78,
      trend: 'down',
      confidence: 76,
      timeframe: 'Q2 2024',
      factors: ['Communication gaps', 'Expectation misalignment', 'Process delays']
    },
    {
      id: '4',
      name: 'Community Investment',
      currentValue: 45000,
      predictedValue: 65000,
      trend: 'up',
      confidence: 85,
      timeframe: 'Q2 2024',
      factors: ['New partnerships', 'Increased budget allocation', 'Community programs']
    }
  ];

  // Dummy data for recommendations
  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Implement Profit-Sharing Program',
      description: 'Launch a profit-sharing initiative to improve employee engagement and retention.',
      impact: 'High impact on employee satisfaction and retention',
      effort: 'medium',
      timeframe: '3-6 months',
      category: 'Employee Engagement',
      status: 'in-progress',
      priority: 1
    },
    {
      id: '2',
      title: 'Enhance Stakeholder Communication',
      description: 'Develop a comprehensive communication strategy for all stakeholders.',
      impact: 'Medium impact on stakeholder relations',
      effort: 'low',
      timeframe: '1-2 months',
      category: 'Communication',
      status: 'pending',
      priority: 2
    },
    {
      id: '3',
      title: 'Expand Community Partnerships',
      description: 'Identify and engage with local organizations for shared value creation.',
      impact: 'High impact on community relations and brand',
      effort: 'high',
      timeframe: '6-12 months',
      category: 'Community Impact',
      status: 'pending',
      priority: 3
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'prediction': return <TrendingUp className="w-5 h-5" />;
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity': return <Target className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-100 text-blue-800';
      case 'prediction': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'opportunity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600">Intelligent recommendations and predictive analytics powered by AI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Insights
          </Button>
        </div>
      </div>

      {/* AI Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Insights</p>
                <p className="text-2xl font-bold text-gray-900">{aiInsights.length}</p>
              </div>
              <Brain className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / aiInsights.length)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Impact</p>
                <p className="text-2xl font-bold text-gray-900">
                  {aiInsights.filter(i => i.impact === 'high').length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actionable</p>
                <p className="text-2xl font-bold text-gray-900">
                  {aiInsights.filter(i => i.actionable).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'insights' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('insights')}
          className="flex-1"
        >
          <Brain className="w-4 h-4 mr-2" />
          Insights
        </Button>
        <Button
          variant={activeTab === 'predictions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('predictions')}
          className="flex-1"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Predictions
        </Button>
        <Button
          variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('recommendations')}
          className="flex-1"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Recommendations
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
          className="flex-1"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">AI-Generated Insights</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <Card key={insight.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getInsightColor(insight.type)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getInsightColor(insight.type)}>
                            {insight.type}
                          </Badge>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{insight.confidence}% confidence</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>Priority {insight.priority}</span>
                          </div>
                        </div>
                      </div>

                      {insight.metrics && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Predicted Impact:</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                {insight.metrics.current.toLocaleString()}{insight.metrics.unit}
                              </span>
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                {insight.metrics.predicted.toLocaleString()}{insight.metrics.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Category: {insight.category}
                        </span>
                        {insight.actionable && insight.action && (
                          <Button size="sm">
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Predictive Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictiveMetrics.map((metric) => (
              <Card key={metric.id} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <CardDescription>
                    Prediction for {metric.timeframe} with {metric.confidence}% confidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.currentValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Predicted Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        {metric.predictedValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span>{metric.confidence}%</span>
                    </div>
                    <Progress value={metric.confidence} className="h-2" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                    <div className="space-y-1">
                      {metric.factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Actionable Recommendations</h2>
          
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <Badge className={getStatusColor(rec.status)}>
                          {rec.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Impact</p>
                          <p className="text-gray-600">{rec.impact}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Effort</p>
                          <Badge variant="outline" className="capitalize">
                            {rec.effort}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Timeframe</p>
                          <p className="text-gray-600">{rec.timeframe}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">AI Analytics Dashboard</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Insight Categories</CardTitle>
                <CardDescription>Distribution of AI insights by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Employee Engagement', 'Financial Performance', 'Stakeholder Relations', 'Community Impact'].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Confidence Distribution</CardTitle>
                <CardDescription>AI confidence levels across insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['High (90-100%)', 'Medium (70-89%)', 'Low (50-69%)'].map((level) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights; 