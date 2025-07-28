import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen,
  Target,
  Users,
  TrendingUp,
  Globe,
  Heart,
  Shield,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Star,
  Award
} from "lucide-react";

const SharedWealthModel = () => {
  const principles = [
    {
      id: 1,
      title: "Shared Value Creation",
      description: "Businesses create value that benefits all stakeholders - shareholders, employees, communities, and the environment.",
      icon: Target,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: 2,
      title: "Stakeholder Collaboration",
      description: "Foster partnerships between businesses, governments, NGOs, and communities to achieve common goals.",
      icon: Users,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: 3,
      title: "Sustainable Growth",
      description: "Economic growth that is environmentally sustainable and socially inclusive for long-term prosperity.",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: 4,
      title: "Global Impact",
      description: "Address global challenges through local action, creating positive ripple effects worldwide.",
      icon: Globe,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    {
      id: 5,
      title: "Purpose-Driven Business",
      description: "Businesses operate with a clear social and environmental purpose beyond profit maximization.",
      icon: Heart,
      color: "bg-red-100 text-red-800 border-red-200"
    },
    {
      id: 6,
      title: "Transparency & Accountability",
      description: "Open communication and responsible practices that build trust with all stakeholders.",
      icon: Shield,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  ];

  const modelStages = [
    {
      stage: 1,
      title: "Assessment & Alignment",
      description: "Evaluate current business practices and align with shared wealth principles",
      activities: [
        "Stakeholder mapping and engagement",
        "Impact assessment and baseline measurement",
        "Purpose and values alignment",
        "Gap analysis and opportunity identification"
      ]
    },
    {
      stage: 2,
      title: "Strategy Development",
      description: "Develop comprehensive strategies for shared value creation",
      activities: [
        "Shared value proposition design",
        "Partnership strategy development",
        "Resource allocation and investment planning",
        "Risk management and mitigation strategies"
      ]
    },
    {
      stage: 3,
      title: "Implementation & Execution",
      description: "Execute strategies through collaborative partnerships and innovative approaches",
      activities: [
        "Partnership formation and management",
        "Pilot programs and testing",
        "Capacity building and skill development",
        "Technology and innovation integration"
      ]
    },
    {
      stage: 4,
      title: "Measurement & Optimization",
      description: "Track progress, measure impact, and continuously improve performance",
      activities: [
        "Impact measurement and reporting",
        "Performance monitoring and evaluation",
        "Stakeholder feedback and engagement",
        "Continuous improvement and scaling"
      ]
    }
  ];

  const successStories = [
    {
      company: "Pathway Technologies",
      industry: "Technology",
      impact: "€2.1M in social value created",
      story: "Implemented sustainable technology solutions that reduced carbon emissions by 40% while creating 150 new jobs in underserved communities.",
      metrics: ["40% carbon reduction", "150 jobs created", "€2.1M social value"]
    },
    {
      company: "Green Harvest Co.",
      industry: "Agriculture",
      impact: "€1.8M in environmental benefits",
      story: "Developed regenerative farming practices that improved soil health, increased crop yields by 25%, and provided training to 500 local farmers.",
      metrics: ["25% yield increase", "500 farmers trained", "€1.8M environmental value"]
    },
    {
      company: "TechCorp Innovations",
      industry: "Software",
      impact: "€1.5M in community development",
      story: "Created digital literacy programs that reached 10,000 students and provided technology access to 50 schools in rural areas.",
      metrics: ["10,000 students reached", "50 schools supported", "€1.5M community value"]
    }
  ];

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Shared Wealth Model
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive framework for creating sustainable value that benefits all stakeholders - 
          businesses, communities, and the environment.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-4 h-4 mr-1" />
            Proven Framework
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Star className="w-4 h-4 mr-1" />
            Industry Leading
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Award className="w-4 h-4 mr-1" />
            Award Winning
          </Badge>
        </div>
      </div>

      {/* Core Principles */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Core Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle) => (
            <Card key={principle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${principle.color}`}>
                    <principle.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{principle.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {principle.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Implementation Model */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Implementation Model
        </h2>
        <div className="space-y-6">
          {modelStages.map((stage, index) => (
            <Card key={stage.stage} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: 'rgb(245, 158, 11)' }}>
                      {stage.stage}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                      {stage.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{stage.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < modelStages.length - 1 && (
                  <div className="absolute bottom-0 left-8 transform translate-y-full">
                    <ArrowRight className="w-6 h-6 rotate-90" style={{ color: 'rgb(245, 158, 11)' }} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Success Stories
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{story.company}</CardTitle>
                  <Badge variant="outline">{story.industry}</Badge>
                </div>
                <CardDescription className="text-sm font-medium text-green-600">
                  {story.impact}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{story.story}</p>
                <div className="space-y-2">
                  {story.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                      <span className="text-sm font-medium">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="text-center" style={{ backgroundColor: 'white', borderColor: 'rgb(245, 158, 11)' }}>
        <CardContent className="p-8">
          <Lightbulb className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgb(245, 158, 11)' }} />
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'rgb(30, 58, 138)' }}>
            Ready to Implement the Shared Wealth Model?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join hundreds of companies already creating sustainable value through the Shared Wealth framework. 
            Start your journey today with our comprehensive tools and resources.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
              <BookOpen className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button variant="outline" size="lg" style={{ borderColor: 'rgb(245, 158, 11)', color: 'rgb(245, 158, 11)' }}>
              <Users className="w-5 h-5 mr-2" />
              Join Network
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedWealthModel; 