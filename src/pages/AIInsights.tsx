import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  Sparkles,
  Zap,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';

const AIInsights = () => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const aiInsights = [
    {
      title: 'Market Opportunity Analysis',
      description: 'AI-identified market gaps and partnership opportunities in sustainable agriculture',
      confidence: 94,
      category: 'Market Intelligence',
      impact: 'High',
      recommendations: [
        'Expand operations in East Africa (Kenya, Tanzania)',
        'Partner with local agricultural cooperatives',
        'Focus on drought-resistant crop varieties'
      ],
      timestamp: '2 hours ago'
    },
    {
      title: 'Stakeholder Engagement Optimization',
      description: 'AI-recommended strategies to improve community participation and satisfaction',
      confidence: 89,
      category: 'Stakeholder Relations',
      impact: 'Medium',
      recommendations: [
        'Implement quarterly community feedback sessions',
        'Create youth engagement programs',
        'Develop transparent reporting mechanisms'
      ],
      timestamp: '1 day ago'
    },
    {
      title: 'Resource Allocation Strategy',
      description: 'AI-optimized resource distribution for maximum social and economic impact',
      confidence: 91,
      category: 'Operations',
      impact: 'High',
      recommendations: [
        'Increase investment in technology infrastructure by 25%',
        'Reallocate 15% of marketing budget to community programs',
        'Prioritize projects with highest impact-to-cost ratio'
      ],
      timestamp: '3 days ago'
    },
    {
      title: 'Risk Assessment & Mitigation',
      description: 'AI-identified potential risks and recommended mitigation strategies',
      confidence: 87,
      category: 'Risk Management',
      impact: 'Medium',
      recommendations: [
        'Diversify supply chain across multiple regions',
        'Implement climate change adaptation measures',
        'Strengthen cybersecurity protocols'
      ],
      timestamp: '1 week ago'
    }
  ];

  const trends = [
    {
      trend: 'Increasing demand for sustainable business models',
      confidence: 96,
      direction: 'up',
      timeframe: 'Next 6 months',
      impact: 'High'
    },
    {
      trend: 'Growing interest in community-based ownership structures',
      confidence: 88,
      direction: 'up',
      timeframe: 'Next 12 months',
      impact: 'Medium'
    },
    {
      trend: 'Rising focus on environmental impact measurement',
      confidence: 92,
      direction: 'up',
      timeframe: 'Next 3 months',
      impact: 'High'
    },
    {
      trend: 'Shift towards stakeholder capitalism models',
      confidence: 85,
      direction: 'up',
      timeframe: 'Next 18 months',
      impact: 'Medium'
    }
  ];

  const handleGenerateInsights = async () => {
    if (!query.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would call an AI service
    }, 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    if (confidence >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Insights
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage artificial intelligence to discover hidden opportunities, 
            optimize strategies, and make data-driven decisions for your shared wealth initiatives.
          </p>
        </div>

        {/* AI Query Interface */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Ask AI for Insights</span>
            </CardTitle>
            <CardDescription>
              Describe your challenge or question, and our AI will provide personalized insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="e.g., How can we improve stakeholder engagement in our rural development project? What are the best practices for measuring social impact in the technology sector?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4" />
                  <span>AI-powered analysis with real-time data</span>
                </div>
                <Button 
                  onClick={handleGenerateInsights}
                  disabled={!query.trim() || isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Insights...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent AI Insights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <span>Recent AI Insights</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {insight.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getImpactColor(insight.impact)}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{insight.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Confidence:</span>
                      <span className={`font-semibold ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Key Recommendations:</h4>
                    <div className="space-y-2">
                      {insight.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Star className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{insight.timestamp}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Trend Analysis */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <span>AI Trend Analysis</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.map((trend, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{trend.trend}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Confidence: <span className={`font-semibold ${getConfidenceColor(trend.confidence)}`}>{trend.confidence}%</span></span>
                        <span>Timeframe: {trend.timeframe}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={getImpactColor(trend.impact)}>
                      {trend.impact}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Trending Up</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Explore Trend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            AI Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Forecast market trends, identify opportunities, and predict potential challenges
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Stakeholder Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Analyze stakeholder behavior, preferences, and engagement patterns
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Performance Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Optimize resource allocation, processes, and strategies for maximum impact
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Harness AI Power?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Start using AI insights to optimize your shared wealth initiatives and 
            discover new opportunities for growth and impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Start AI Analysis
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
