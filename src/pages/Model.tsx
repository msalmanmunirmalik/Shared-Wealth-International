import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Users, 
  Target, 
  TrendingUp, 
  Globe, 
  Star, 
  Award, 
  Lightbulb, 
  Building, 
  Handshake, 
  DollarSign, 
  Shield,
  ArrowRight,
  Heart,
  BookOpen,
  Quote
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Model = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The Three Pillars of Shared Wealth
  const threePillars = [
    {
      icon: Heart,
      title: "Values",
      description: "Organizations define and live by clear values that reflect both business sense and a commitment to society and the environment.",
      details: "Clear values that guide decision-making and create alignment between business objectives and social impact.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Inclusive Decision-Making",
      description: "Decisions are made transparently and fairly, with input from all relevant stakeholders.",
      details: "Modern organizations with multiple communication channels, teamwork cultures, and agile structures need decision-making that's both efficient and fair.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Sharing Wealth",
      description: "Businesses choose appropriate ways to share the wealth they create, whether through shares, profit-sharing, intellectual property, or other innovative mechanisms.",
      details: "Flexible approaches that go beyond traditional equity sharing to include IP sharing, community investment, and other creative mechanisms.",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  // Real examples from the Shared Wealth story
  const realExamples = [
    {
      company: "LocoSoco",
      ceo: "James Perry",
      model: "Phantom Shares & Democratic Governance",
      quote: "Shared Wealth built loyal customers, motivated employees, incentivised investors, and strengthened our social brand.",
      results: ["Loyal customers", "Motivated employees", "Incentivised investors", "Strengthened social brand"],
      icon: Building,
      color: "from-blue-50 to-indigo-100"
    },
    {
      company: "Solar Ear",
      founder: "Howard Weinstein",
      model: "Intellectual Property Sharing",
      quote: "Wealth can be shared in many different ways — not just through equity. We share our intellectual property to empower others.",
      results: ["IP sharing innovation", "Empowered communities", "Flexible wealth sharing", "Global impact"],
      icon: Lightbulb,
      color: "from-green-50 to-emerald-100"
    },
    {
      company: "SEi Network",
      description: "Global Network",
      model: "Social Licence Agreement",
      quote: "Companies open to sharing wealth are also open to sharing resources and ideas with like-minded people.",
      results: ["40+ countries", "Resource sharing", "Collaboration focus", "Collective impact"],
      icon: Globe,
      color: "from-purple-50 to-violet-100"
    }
  ];

  const components = [
    {
      title: "Phantom Shares",
      description: "Virtual ownership that provides financial benefits without legal ownership",
      benefits: ["No dilution of existing shares", "Immediate implementation", "Flexible structure"],
      icon: TrendingUp
    },
    {
      title: "Profit Sharing",
      description: "Direct distribution of profits to employees and community stakeholders",
      benefits: ["Transparent calculation", "Regular distributions", "Performance-based"],
      icon: TrendingUp
    },
    {
      title: "Democratic Governance",
      description: "Inclusive decision-making processes for key business decisions",
      benefits: ["Representative councils", "Transparent voting", "Stakeholder input"],
      icon: Users
    },
    {
      title: "Community Investment",
      description: "Direct investment in local community development projects",
      benefits: ["Local impact", "Measurable outcomes", "Sustainable development"],
      icon: Building
    }
  ];

  const implementationSteps = [
    {
      step: "1",
      title: "Assessment",
      description: "Evaluate current business model and stakeholder relationships",
      icon: DollarSign
    },
    {
      step: "2",
      title: "Design",
      description: "Create customized shared wealth model for your organization",
      icon: Handshake
    },
    {
      step: "3",
      title: "Implementation",
      description: "Roll out the model with stakeholder training and support",
      icon: CheckCircle
    },
    {
      step: "4",
      title: "Optimization",
      description: "Monitor, measure, and continuously improve the model",
      icon: TrendingUp
    }
  ];

  const benefits = [
    {
      category: "For Employees",
      items: [
        "Direct financial benefits from company success",
        "Greater sense of ownership and engagement",
        "Voice in company decisions",
        "Improved job satisfaction and retention"
      ],
      icon: Users
    },
    {
      category: "For Communities",
      items: [
        "Direct investment in local development",
        "Job creation and economic growth",
        "Improved social infrastructure",
        "Sustainable community partnerships"
      ],
      icon: Lightbulb
    },
    {
      category: "For Businesses",
      items: [
        "Increased employee productivity and loyalty",
        "Enhanced reputation and brand value",
        "Access to new markets and opportunities",
        "Long-term sustainable growth"
      ],
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="flex justify-start mb-6">
            <Button asChild className="bg-white text-navy hover:bg-gray-100 font-semibold px-6 py-2">
              <Link to="/">
                ← Back to Home
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 text-white">Shared Wealth Model</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Born from decades of social enterprise innovation, our Shared Wealth model evolved from 
              FairShares to create flexible frameworks for equitable wealth distribution. Built on three 
              pillars that make business sense while creating sustainable value for all stakeholders.
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#07264e' }}>The Three Pillars of Shared Wealth</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#086075' }}>
              Our model is built on three pillars that evolved from decades of practice and learning.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {threePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                  <CardHeader>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${pillar.color}`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle style={{ color: '#07264e' }}>{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription style={{ color: '#086075' }} className="mb-4">{pillar.description}</CardDescription>
                    <div className="bg-gradient-subtle p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{pillar.details}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Model Components */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #086075 0%, #34a63b 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Model Components</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our comprehensive approach combines multiple mechanisms to ensure equitable wealth distribution.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {components.map((component, index) => {
              const Icon = component.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <CardTitle className="text-navy">{component.title}</CardTitle>
                        <CardDescription>{component.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {component.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Implementation Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured approach to implementing shared wealth principles in your organization.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {implementationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <CardHeader className="pt-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-navy" />
                    </div>
                    <CardTitle className="text-navy">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Benefits for All Stakeholders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our model creates value for everyone involved in the business ecosystem.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                      <CardTitle className="text-navy">{benefit.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefit.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real Examples from Shared Wealth Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Real Examples from Our Network</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Authentic stories from companies that have shaped and proven our Shared Wealth model.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {realExamples.map((example, index) => {
              const Icon = example.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${example.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-navy">{example.company}</CardTitle>
                        <Badge variant="secondary" className="text-xs">{example.model}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-gradient-subtle rounded-lg border-l-4 border-gold">
                      <Quote className="w-4 h-4 text-gold mb-2" />
                      <p className="text-sm font-medium text-navy italic">"{example.quote}"</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        - {example.ceo || example.founder || example.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-navy">Key Results:</p>
                      {example.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-muted-foreground">{result}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the growing network of companies implementing shared wealth principles 
            and creating sustainable value for all stakeholders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="green" className="text-white">
              <Link to="/assessment">Start Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="green" className="text-white">
              <Link to="/network">View Network</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Model;