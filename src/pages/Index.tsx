import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Calculator,
  ClipboardCheck,
  Settings,
  Globe,
  Target,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import CorePillars from "@/components/CorePillars";
import Footer from "@/components/Footer";

const Index = () => {
  // Key network statistics
  const networkStats = [
    {
      value: "24+",
      label: "Network Companies",
      icon: Users,
      description: "Global partners implementing shared wealth"
    },
    {
      value: "12",
      label: "Countries",
      icon: Globe,
      description: "International presence and impact"
    },
    {
      value: "$2.4M",
      label: "Shared Value",
      icon: TrendingUp,
      description: "Total value distributed to stakeholders"
    },
    {
      value: "8.7/10",
      label: "Impact Score",
      icon: Star,
      description: "Average social impact rating"
    }
  ];

  // Interactive tools for immediate engagement
  const interactiveTools = [
    {
      title: "Readiness Assessment",
      description: "Evaluate your organization's alignment with Shared Wealth principles",
      icon: ClipboardCheck,
      href: "/assessment",
      time: "5 min"
    },
    {
      title: "Impact Calculator",
      description: "Calculate potential financial and social impact of shared wealth practices",
      icon: Calculator,
      href: "/calculator",
      time: "3 min"
    },
    {
      title: "Model Configurator",
      description: "Build your custom Shared Wealth model with our interactive tool",
      icon: Settings,
      href: "/configurator",
      time: "10 min"
    }
  ];

  // Success stories highlights
  const successStories = [
    {
      company: "Pathway",
      achievement: "40% revenue growth through stakeholder partnerships",
      impact: "Enhanced employee engagement and community relations"
    },
    {
      company: "GreenEnergy",
      achievement: "$2M partnership deal facilitated",
      impact: "Expanded market reach and sustainable growth"
    },
    {
      company: "TechFlow",
      achievement: "150% customer base increase",
      impact: "Improved market validation and network connections"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Hero />
      
      {/* Network Impact Stats */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Network Impact</h2>
            <p className="body-large max-w-2xl mx-auto">
              Our growing network demonstrates the power of shared wealth principles in action
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {networkStats.map((stat, index) => (
              <Card key={index} className="card-professional text-center hover-lift">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-navy/10">
                      <stat.icon className="w-6 h-6 text-navy" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-navy mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Interactive Tools</h2>
            <p className="body-large max-w-2xl mx-auto">
              Start your shared wealth journey with our professional assessment and planning tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interactiveTools.map((tool, index) => (
              <Card key={index} className="card-elevated hover-lift">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-gold/10">
                      <tool.icon className="w-6 h-6 text-gold" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{tool.time}</Badge>
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{tool.description}</CardDescription>
                  <Button asChild className="btn-primary w-full">
                    <Link to={tool.href}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <CorePillars />

      {/* Success Stories */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Success Stories</h2>
            <p className="body-large max-w-2xl mx-auto">
              See how our network partners are transforming their businesses through shared wealth principles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="card-professional hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-navy">{story.company}</CardTitle>
                    <CheckCircle className="w-5 h-5 text-green" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">Achievement</h4>
                    <p className="text-sm text-muted-foreground">{story.achievement}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Impact</h4>
                    <p className="text-sm text-muted-foreground">{story.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding-sm bg-gradient-hero">
        <div className="container mx-auto container-padding text-center">
          <h2 className="heading-2 mb-4 text-white">Ready to Join the Movement?</h2>
          <p className="body-large mb-8 text-white/90 max-w-2xl mx-auto">
            Connect with our network and discover how shared wealth principles can transform your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-lg px-8">
              <Link to="/network">
                Explore Network
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" className="btn-outline text-lg px-8 border-white text-white hover:bg-white hover:text-navy">
              <Link to="/assessment">
                Take Assessment
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
