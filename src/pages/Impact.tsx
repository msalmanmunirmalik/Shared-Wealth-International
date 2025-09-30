import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  Heart, 
  Target,
  Award,
  BarChart3
} from 'lucide-react';

const Impact = () => {
  const impactMetrics = [
    {
      title: 'Social Impact',
      value: '2.3M+',
      description: 'People positively impacted',
      icon: Users,
      color: 'text-blue-600',
      progress: 85,
      details: ['Education access', 'Healthcare improvement', 'Community development']
    },
    {
      title: 'Economic Value',
      value: '$156M+',
      description: 'Economic value created',
      icon: DollarSign,
      color: 'text-green-600',
      progress: 78,
      details: ['Job creation', 'Income generation', 'Business growth']
    },
    {
      title: 'Environmental Impact',
      value: '45K+',
      description: 'Tons of CO2 reduced',
      icon: Globe,
      color: 'text-emerald-600',
      progress: 92,
      details: ['Renewable energy', 'Sustainable practices', 'Carbon reduction']
    },
    {
      title: 'Partnerships',
      value: '1,200+',
      description: 'Active partnerships',
      icon: Heart,
      color: 'text-red-600',
      progress: 88,
      details: ['Cross-sector collaboration', 'International cooperation', 'Community engagement']
    }
  ];

  const impactStories = [
    {
      title: 'Rural Education Initiative',
      company: 'EduTech Solutions',
      location: 'Kenya',
      impact: 'Improved education access for 50,000+ students',
      metrics: ['Literacy rate increased by 40%', 'School attendance up 60%', 'Teacher training for 200+ educators'],
      category: 'Education',
      year: '2023'
    },
    {
      title: 'Sustainable Agriculture Program',
      company: 'GreenFarm Co.',
      location: 'India',
      impact: 'Enhanced farming practices for 25,000+ farmers',
      metrics: ['Crop yield increased by 35%', 'Water usage reduced by 30%', 'Income growth of 45%'],
      category: 'Agriculture',
      year: '2023'
    },
    {
      title: 'Clean Energy Access',
      company: 'SolarPower Initiative',
      location: 'Bangladesh',
      impact: 'Provided clean energy to 100,000+ households',
      metrics: ['CO2 reduction of 15,000 tons', 'Energy cost savings of 60%', 'Job creation for 500+ people'],
      category: 'Energy',
      year: '2023'
    },
    {
      title: 'Healthcare Innovation',
      company: 'MedTech Solutions',
      location: 'Ghana',
      impact: 'Improved healthcare access for 75,000+ people',
      metrics: ['Patient outcomes improved by 50%', 'Healthcare costs reduced by 40%', 'Medical staff trained: 150+'],
      category: 'Healthcare',
      year: '2023'
    }
  ];

  const globalReach = [
    { region: 'Africa', countries: 15, projects: 45, impact: 'High' },
    { region: 'Asia', countries: 12, projects: 38, impact: 'High' },
    { region: 'Latin America', countries: 8, projects: 22, impact: 'Medium' },
    { region: 'Europe', countries: 6, projects: 18, impact: 'Medium' },
    { region: 'North America', countries: 3, projects: 12, impact: 'Medium' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Track and Share Impact Stories
            </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover how Shared Wealth International and our partner companies are creating 
            measurable positive change across the globe. From social impact to environmental 
            sustainability, see the real-world results of shared wealth principles in action.
          </p>
        </div>

        {/* Impact Metrics Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Global Impact Overview
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>
                      <metric.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {metric.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{metric.progress}%</span>
                    </div>
                    <Progress value={metric.progress} className="h-2" />
                    <div className="space-y-1">
                      {metric.details.map((detail, idx) => (
                        <div key={idx} className="text-xs text-gray-500">
                          • {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      {/* Impact Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Featured Impact Stories
            </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {impactStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <CardTitle className="text-xl">{story.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {story.company} • {story.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{story.category}</Badge>
                  </div>
                  <p className="text-gray-700 font-medium">{story.impact}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Key Metrics:</h4>
                    <div className="space-y-2">
                      {story.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700 text-sm">{metric}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      Year: {story.year}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Reach */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Global Reach & Distribution
              </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {globalReach.map((region, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{region.region}</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">{region.countries}</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="text-xl font-semibold text-green-600">{region.projects}</div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </div>
                  <Badge 
                    variant={region.impact === 'High' ? 'default' : 'secondary'}
                    className="mt-3"
                  >
                    {region.impact} Impact
                  </Badge>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">
            Share Your Impact Story
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Are you creating positive change? Share your impact story and inspire others 
            to join the shared wealth movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Submit Story
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;