import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Shield, TrendingUp, Calendar, Download } from "lucide-react";

const Services = () => {
  const coreServices = [
    {
      title: "Shared Wealth Framework Adoption Programs",
      description: "Comprehensive consulting services to help organizations implement shared wealth principles tailored to their specific context and industry.",
      features: [
        "Initial readiness assessment",
        "Custom implementation roadmap",
        "Ongoing support and monitoring",
        "Best practices guidance"
      ],
      duration: "3-12 months",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "Strategic & Technical Consulting",
      description: "Expert guidance on legal structures, financial models, and operational frameworks needed for successful shared wealth implementation.",
      features: [
        "Legal structure design",
        "Financial model development",
        "Operational framework design",
        "Compliance guidance"
      ],
      duration: "Project-based",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Inclusive Decision-Making Design & Implementation",
      description: "Specialized services to embed stakeholder voices into governance structures through democratic and collaborative mechanisms.",
      features: [
        "Governance structure design",
        "Stakeholder mapping",
        "Decision-making process implementation",
        "Technology platform setup"
      ],
      duration: "2-6 months",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Social Audit & Impact Validation",
      description: "Comprehensive impact measurement and validation processes to ensure transparency and continuous improvement in shared wealth practices.",
      features: [
        "Impact measurement framework",
        "Annual third-party audits",
        "Public reporting systems",
        "Continuous improvement plans"
      ],
      duration: "Ongoing",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const educationPrograms = [
    {
      title: "Summer Schools",
      description: "Intensive multi-day programs designed to provide deep understanding of shared wealth principles and practical implementation strategies.",
      format: "In-person & Virtual",
      duration: "5 days",
      audience: "Business leaders, social entrepreneurs, policymakers",
      outcomes: [
        "Complete understanding of shared wealth model",
        "Implementation toolkit and templates",
        "Network of like-minded professionals",
        "Certificate of completion"
      ]
    },
    {
      title: "Online Certifications for Businesses",
      description: "Flexible online programs that allow organizations to achieve official 'Shared Wealth Company' status through structured learning and implementation.",
      format: "Self-paced online",
      duration: "3-6 months",
      audience: "Organizations seeking certification",
      outcomes: [
        "Official Shared Wealth Company certification",
        "Comprehensive implementation support",
        "Access to network resources",
        "Ongoing technical assistance"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Services & Offerings
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Comprehensive support to transform your organization through 
              shared wealth principles and equitable business practices.
            </p>
            <div className="flex items-center justify-center gap-8 text-background/90">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>Education Programs</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Consulting Services</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Certification Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Core Consulting Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert guidance and hands-on support to implement shared wealth 
              principles in your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <Card key={service.title} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green/10 rounded-lg text-green">
                        {service.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-navy">{service.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">{service.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-navy mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <ArrowRight className="w-4 h-4 text-green mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Programs */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Education & Certification Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn and master shared wealth principles through our comprehensive 
              educational offerings.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {educationPrograms.map((program, index) => (
              <Card key={program.title} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-navy">{program.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{program.format}</Badge>
                        <Badge variant="outline">{program.duration}</Badge>
                      </div>
                    </div>
                    <Calendar className="w-6 h-6 text-teal" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-navy mb-1">Target Audience:</h4>
                      <p className="text-sm text-muted-foreground">{program.audience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Program Outcomes:</h4>
                      <ul className="space-y-1">
                        {program.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start">
                            <ArrowRight className="w-4 h-4 text-green mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA for Education */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="green" size="lg">
                Register for Summer School
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Online Certifications
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Support */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Implementation Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              End-to-end support to ensure successful transformation to 
              shared wealth principles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="animate-fade-in text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green" />
                </div>
                <CardTitle className="text-xl text-navy">Assessment & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Comprehensive readiness assessment and custom implementation roadmap development.</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in text-center" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal" />
                </div>
                <CardTitle className="text-xl text-navy">Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Hands-on support during transformation with ongoing guidance and best practices.</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in text-center" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange" />
                </div>
                <CardTitle className="text-xl text-navy">Validation & Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Social audits, impact validation, and continuous improvement support for sustained success.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-navy text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Start your journey toward shared wealth creation with our comprehensive 
            services and expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg">
              Schedule Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-navy">
              Download Service Brochure
              <Download className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;