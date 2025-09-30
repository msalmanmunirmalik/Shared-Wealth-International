import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Heart, 
  Globe, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const Concept = () => {
  const principles = [
    {
      title: 'Shared Value Creation',
      description: 'Creating economic value while simultaneously addressing societal needs and challenges',
      icon: Target,
      color: 'bg-blue-100 text-blue-800',
      examples: ['Social enterprises', 'Impact investing', 'Sustainable business models']
    },
    {
      title: 'Stakeholder Collaboration',
      description: 'Working together with all stakeholders to achieve mutual benefits and shared success',
      icon: Users,
      color: 'bg-green-100 text-green-800',
      examples: ['Multi-stakeholder partnerships', 'Community engagement', 'Cross-sector collaboration']
    },
    {
      title: 'Sustainable Growth',
      description: 'Pursuing growth that benefits current and future generations without depleting resources',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800',
      examples: ['Circular economy', 'Renewable energy', 'Green technologies']
    },
    {
      title: 'Social Impact',
      description: 'Measuring and maximizing positive social outcomes alongside financial returns',
      icon: Heart,
      color: 'bg-red-100 text-red-800',
      examples: ['Poverty reduction', 'Education access', 'Healthcare improvement']
    },
    {
      title: 'Global Perspective',
      description: 'Addressing global challenges while respecting local contexts and cultures',
      icon: Globe,
      color: 'bg-yellow-100 text-yellow-800',
      examples: ['Climate action', 'Fair trade', 'Cultural exchange']
    },
    {
      title: 'Innovation & Adaptation',
      description: 'Continuously innovating and adapting to meet evolving societal and environmental needs',
      icon: Lightbulb,
      color: 'bg-indigo-100 text-indigo-800',
      examples: ['Technology for good', 'Social innovation', 'Adaptive strategies']
    }
  ];

  const frameworks = [
    {
      name: 'Triple Bottom Line',
      description: 'People, Planet, Profit - measuring success across social, environmental, and financial dimensions',
      metrics: ['Social Impact', 'Environmental Sustainability', 'Financial Viability']
    },
    {
      name: 'Shared Value Framework',
      description: 'Identifying and creating business opportunities that address societal needs',
      metrics: ['Societal Need', 'Business Opportunity', 'Value Creation']
    },
    {
      name: 'Impact Measurement',
      description: 'Systematic approach to measuring and reporting social and environmental impact',
      metrics: ['Input', 'Output', 'Outcome', 'Impact']
    },
    {
      name: 'Stakeholder Theory',
      description: 'Considering the interests of all stakeholders in business decision-making',
      metrics: ['Shareholders', 'Employees', 'Customers', 'Community', 'Environment']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Understanding Shared Wealth Principles
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Shared Wealth International is built on the foundation of creating value that benefits 
            all stakeholders - from individuals and communities to businesses and the environment. 
            Discover the core principles that guide our approach to sustainable, inclusive prosperity.
          </p>
        </div>

        {/* Core Principles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Core Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${principle.color}`}>
                      <principle.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    {principle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">Examples:</h4>
                    <div className="flex flex-wrap gap-2">
                      {principle.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Frameworks & Methodologies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frameworks & Methodologies
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {frameworks.map((framework, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{framework.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {framework.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Key Metrics:</h4>
                    <div className="space-y-2">
                      {framework.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <ArrowRight className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-700">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Apply These Principles?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start implementing shared wealth principles in your organization with our 
            comprehensive tools and learning resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Explore Tools
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concept;
