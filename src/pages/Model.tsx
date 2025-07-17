import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Heart,
  Building,
  Calculator,
  Settings,
  BarChart3,
  CheckCircle,
  Lightbulb,
  Globe,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const Model = () => {
  const principles = [
    {
      icon: Users,
      title: "Stakeholder Ownership",
      description: "All stakeholders - employees, customers, communities - have ownership stakes in the business",
      color: "from-blue-50 to-indigo-100"
    },
    {
      icon: Target,
      title: "Equitable Distribution",
      description: "Wealth is distributed fairly among all contributors to value creation",
      color: "from-green-50 to-emerald-100"
    },
    {
      icon: Shield,
      title: "Democratic Governance",
      description: "Inclusive decision-making processes that give voice to all stakeholders",
      color: "from-purple-50 to-violet-100"
    },
    {
      icon: Heart,
      title: "Community Impact",
      description: "Business success directly benefits the communities where we operate",
      color: "from-orange-50 to-amber-100"
    }
  ];

  const components = [
    {
      title: "Phantom Shares",
      description: "Virtual ownership that provides financial benefits without legal ownership",
      benefits: ["No dilution of existing shares", "Immediate implementation", "Flexible structure"],
      icon: BarChart3
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
      icon: Calculator
    },
    {
      step: "2",
      title: "Design",
      description: "Create customized shared wealth model for your organization",
      icon: Settings
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
      icon: Heart
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Shared Wealth Model</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            A revolutionary approach to business that ensures wealth is shared equitably 
            among all stakeholders while maintaining profitability and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="green" className="text-white">
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="green" className="text-white">
              <Link to="/network">See Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Core Principles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The foundation of our shared wealth model is built on these four key principles.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-navy" />
                    </div>
                    <CardTitle className="text-navy">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Model Components */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Model Components</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real examples of companies that have successfully implemented our shared wealth model.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-navy">Terratai Ltd</CardTitle>
                  <Badge variant="secondary">Manufacturing</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Implemented phantom shares and democratic governance, resulting in 40% increase 
                  in employee engagement and £120K annually shared with stakeholders.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-green-600">40%</div>
                    <div className="text-muted-foreground">Engagement Increase</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">£120K</div>
                    <div className="text-muted-foreground">Annual Shared Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-navy">GreenEnergy Co</CardTitle>
                  <Badge variant="secondary">Renewable Energy</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Achieved 15% profit sharing with employees and community investment programs, 
                  creating sustainable local development and strong stakeholder relationships.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-green-600">15%</div>
                    <div className="text-muted-foreground">Profit Sharing</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">95%</div>
                    <div className="text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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