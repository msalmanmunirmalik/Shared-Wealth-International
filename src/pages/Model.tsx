import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CorePillars from "@/components/CorePillars";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, Star, Circle } from "lucide-react";

const Model = () => {
  const mechanisms = [
    {
      title: "Phantom Share Programs",
      description: "Employee ownership without traditional equity dilution",
      benefits: ["15-25% value sharing", "Increased engagement", "Retention improvement"],
      implementation: "Digital tracking systems with transparent value calculations"
    },
    {
      title: "Community Stakeholding",
      description: "Local community participation in business value creation",
      benefits: ["Community benefit requirements", "Local economic development", "Social license"],
      implementation: "Community councils with formal representation rights"
    },
    {
      title: "IT-Powered Governance",
      description: "Democratic decision-making through technology platforms",
      benefits: ["Transparent voting", "Stakeholder participation", "Efficient consensus"],
      implementation: "Blockchain-based voting with weighted stakeholder representation"
    },
    {
      title: "Social Audit Framework",
      description: "Comprehensive impact measurement and validation",
      benefits: ["Transparent reporting", "Continuous improvement", "Stakeholder confidence"],
      implementation: "Annual third-party audits with public reporting"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              The Shared Wealth Model
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              A comprehensive framework for building equitable, sustainable, and 
              stakeholder-centered business models that benefit everyone.
            </p>
            <Button variant="orange" size="lg">
              Download Framework Guide
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <CorePillars />

      {/* Implementation Mechanisms */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Implementation Mechanisms
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practical tools and frameworks that transform Shared Wealth principles 
              into actionable business practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mechanisms.map((mechanism, index) => (
              <Card key={mechanism.title} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="text-xl text-navy">{mechanism.title}</CardTitle>
                  <CardDescription>{mechanism.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {mechanism.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold text-navy mb-2">Implementation:</h4>
                      <p className="text-sm text-muted-foreground">{mechanism.implementation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Proven Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real results from companies implementing the Shared Wealth model
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold text-green mb-2">40%</div>
              <p className="text-muted-foreground">Increase in Employee Engagement</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-teal mb-2">25%</div>
              <p className="text-muted-foreground">Higher Retention Rates</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-orange mb-2">60%</div>
              <p className="text-muted-foreground">Improved Community Relations</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-navy mb-2">20+</div>
              <p className="text-muted-foreground">Companies Transformed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-navy text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Start your journey toward shared wealth creation with our comprehensive 
            implementation support and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg" asChild>
              <a href="/configurator">
                Build Your Model
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-navy">
              Book Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Model;