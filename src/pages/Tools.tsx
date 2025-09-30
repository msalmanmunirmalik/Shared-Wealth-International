import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  BookOpen, 
  Users, 
  Brain, 
  Lightbulb,
  Star,
  Calculator,
  BarChart3,
  MessageSquare,
  Heart,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const tools = [
    {
      name: 'Funding Platform',
      description: 'AI-powered funding matching and opportunity discovery',
      icon: DollarSign,
      href: '/funding-platform',
      category: 'Core Tools',
      features: ['AI Matching', 'Funding Opportunities', 'Partnership Suggestions']
    },
    {
      name: 'Business Canvas',
      description: 'Interactive Shared Wealth Business Model Canvas',
      icon: Target,
      href: '/business-canvas',
      category: 'Core Tools',
      features: ['Business Modeling', 'Collaboration', 'Export & Share']
    },
    {
      name: 'Impact Analytics',
      description: 'Track and visualize your social and economic impact',
      icon: BarChart3,
      href: '/impact-analytics',
      category: 'Analytics',
      features: ['Impact Metrics', 'Data Visualization', 'Reporting']
    },
    {
      name: 'AI Insights',
      description: 'AI-powered insights and recommendations',
      icon: Brain,
      href: '/ai-insights',
      category: 'AI Tools',
      features: ['Smart Analysis', 'Predictions', 'Recommendations']
    },
    {
      name: 'Calculator',
      description: 'Financial and impact calculation tools',
      icon: Calculator,
      href: '/calculator',
      category: 'Utilities',
      features: ['ROI Calculator', 'Impact Metrics', 'Financial Planning']
    },
    {
      name: 'Assessment',
      description: 'Evaluate your readiness and capabilities',
      icon: Star,
      href: '/assessment',
      category: 'Learning',
      features: ['Self-Assessment', 'Progress Tracking', 'Recommendations']
    },
    {
      name: 'Simulator',
      description: 'Simulate different scenarios and outcomes',
      icon: Lightbulb,
      href: '/simulator',
      category: 'Planning',
      features: ['Scenario Planning', 'Risk Analysis', 'Outcome Prediction']
    },
    {
      name: 'Configurator',
      description: 'Configure and customize your tools',
      icon: Settings,
      href: '/configurator',
      category: 'Settings',
      features: ['Customization', 'Preferences', 'Integration']
    },
    {
      name: 'Wealth Analyzer',
      description: 'Analyze wealth distribution and opportunities',
      icon: TrendingUp,
      href: '/wealth-analyzer',
      category: 'Analytics',
      features: ['Wealth Metrics', 'Distribution Analysis', 'Opportunity Mapping']
    },
    {
      name: 'Communication Optimizer',
      description: 'Optimize stakeholder communication',
      icon: MessageSquare,
      href: '/communication-optimizer',
      category: 'Communication',
      features: ['Stakeholder Mapping', 'Communication Planning', 'Feedback Analysis']
    },
    {
      name: 'Values Assessment',
      description: 'Assess and align organizational values',
      icon: Heart,
      href: '/values-assessment',
      category: 'Learning',
      features: ['Values Alignment', 'Culture Assessment', 'Team Building']
    },
    {
      name: 'Stakeholder Mapping',
      description: 'Map and analyze stakeholder relationships',
      icon: Users,
      href: '/stakeholder-mapping',
      category: 'Planning',
      features: ['Stakeholder Analysis', 'Relationship Mapping', 'Engagement Planning']
    },
    {
      name: 'Decision Framework',
      description: 'Structured decision-making framework',
      icon: Target,
      href: '/decision-framework',
      category: 'Planning',
      features: ['Decision Matrix', 'Risk Assessment', 'Outcome Analysis']
    },
    {
      name: 'IP Simulator',
      description: 'Intellectual property strategy simulation',
      icon: Brain,
      href: '/ip-simulator',
      category: 'Strategy',
      features: ['IP Strategy', 'Protection Planning', 'Value Assessment']
    }
  ];

  const categories = ['Core Tools', 'Analytics', 'AI Tools', 'Utilities', 'Learning', 'Planning', 'Settings', 'Communication', 'Strategy'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tools & Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive suite of tools and learning resources designed to help you 
            build, grow, and optimize your shared wealth initiatives.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button variant="outline" className="rounded-full">
            All Tools
          </Button>
          {categories.map((category) => (
            <Button key={category} variant="ghost" className="rounded-full">
              {category}
            </Button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.name} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <tool.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <CardDescription className="text-gray-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link to={tool.href}>
                    <Button className="w-full" variant="outline">
                      Open Tool
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Resources Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learning Resources
            </h2>
            <p className="text-lg text-gray-600">
              Enhance your knowledge with our curated learning materials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Documentation</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive guides and tutorials for all tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Browse Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Community</CardTitle>
                </div>
                <CardDescription>
                  Connect with other users and share experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Best Practices</CardTitle>
                </div>
                <CardDescription>
                  Proven strategies and success stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
