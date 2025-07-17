import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Target, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Download,
  Play,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Star,
  Clock,
  Globe,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("tools");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["tools", "guides", "cases", "webinars", "research", "events", "forum"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const interactiveTools = [
    {
      title: "Impact Calculator",
      description: "Calculate potential benefits and ROI of implementing shared wealth practices",
      icon: Calculator,
      status: "Live",
      time: "5 min",
      path: "/calculator",
      features: ["ROI Analysis", "Employee Impact", "Community Benefits"],
      color: "from-blue-50 to-indigo-100"
    },
    {
      title: "Readiness Assessment",
      description: "Evaluate your organization's readiness for shared wealth implementation",
      icon: Target,
      status: "Live",
      time: "10 min",
      path: "/assessment",
      features: ["Organizational Readiness", "Stakeholder Analysis", "Implementation Roadmap"],
      color: "from-green-50 to-emerald-100"
    },
    {
      title: "Governance Simulator",
      description: "Simulate different governance scenarios and decision-making processes",
      icon: Settings,
      status: "Live",
      time: "15 min",
      path: "/simulator",
      features: ["Governance Models", "Decision Scenarios", "Stakeholder Impact"],
      color: "from-purple-50 to-violet-100"
    },
    {
      title: "Model Configurator",
      description: "Design your custom shared wealth model with interactive components",
      icon: BarChart3,
      status: "Live",
      time: "20 min",
      path: "/configurator",
      features: ["Model Design", "Component Selection", "Customization Options"],
      color: "from-orange-50 to-amber-100"
    }
  ];

  const guides = [
    {
      title: "Shared Wealth Implementation Guide",
      description: "Comprehensive step-by-step guide for implementing shared wealth principles",
      type: "PDF Guide",
      pages: 45,
      downloadUrl: "#",
      icon: FileText,
      tags: ["Implementation", "Step-by-Step", "Best Practices"]
    },
    {
      title: "Phantom Shares Framework",
      description: "Detailed framework for implementing phantom share programs",
      type: "Template",
      pages: 32,
      downloadUrl: "#",
      icon: TrendingUp,
      tags: ["Phantom Shares", "Employee Ownership", "Templates"]
    },
    {
      title: "Democratic Governance Handbook",
      description: "Handbook for implementing inclusive decision-making processes",
      type: "Handbook",
      pages: 28,
      downloadUrl: "#",
      icon: Users,
      tags: ["Governance", "Decision-Making", "Inclusive"]
    },
    {
      title: "Community Investment Toolkit",
      description: "Toolkit for developing community investment and engagement programs",
      type: "Toolkit",
      pages: 38,
      downloadUrl: "#",
      icon: Globe,
      tags: ["Community", "Investment", "Engagement"]
    }
  ];

  const caseStudies = [
    {
      title: "Terratai Ltd: Phantom Shares Success",
      description: "How Terratai achieved 40% increase in employee engagement through phantom shares",
      company: "Terratai Ltd",
      sector: "Manufacturing",
      impact: "40% Engagement Increase",
      readTime: "8 min",
      image: "/lovable-uploads/terratai-logo.png",
      tags: ["Phantom Shares", "Employee Engagement", "Manufacturing"]
    },
    {
      title: "GreenEnergy Co: Profit Sharing Model",
      description: "Case study of 15% profit sharing implementation and community investment",
      company: "GreenEnergy Co",
      sector: "Renewable Energy",
      impact: "15% Profit Sharing",
      readTime: "10 min",
      image: "",
      tags: ["Profit Sharing", "Community Investment", "Energy"]
    },
    {
      title: "CommunityBank: Stakeholder Governance",
      description: "Implementing stakeholder governance in financial services",
      company: "CommunityBank",
      sector: "Financial Services",
      impact: "Stakeholder Governance",
      readTime: "12 min",
      image: "",
      tags: ["Governance", "Financial Services", "Stakeholders"]
    }
  ];

  const webinars = [
    {
      title: "Introduction to Shared Wealth Principles",
      description: "Learn the fundamentals of shared wealth and how it transforms business",
      duration: "45 min",
      speaker: "Cliff Southcombe",
      date: "2024-01-15",
      attendees: 234,
      recordingUrl: "#",
      tags: ["Introduction", "Fundamentals", "Overview"]
    },
    {
      title: "Implementing Phantom Share Programs",
      description: "Practical guide to designing and implementing phantom share programs",
      duration: "60 min",
      speaker: "James Perry",
      date: "2024-01-22",
      attendees: 189,
      recordingUrl: "#",
      tags: ["Phantom Shares", "Implementation", "Practical"]
    },
    {
      title: "Democratic Governance in Practice",
      description: "Real-world examples of democratic governance implementation",
      duration: "50 min",
      speaker: "Dr. Salman Malik",
      date: "2024-01-29",
      attendees: 156,
      recordingUrl: "#",
      tags: ["Governance", "Democratic", "Examples"]
    }
  ];

  const research = [
    {
      title: "The Impact of Shared Wealth on Employee Engagement",
      description: "Research study analyzing the correlation between shared wealth and employee satisfaction",
      authors: "Dr. Elena Petrova, Dr. Rachel Green",
      publication: "Journal of Business Ethics",
      year: 2023,
      citations: 45,
      downloadUrl: "#",
      tags: ["Research", "Employee Engagement", "Academic"]
    },
    {
      title: "Economic Benefits of Stakeholder Capitalism",
      description: "Comprehensive analysis of stakeholder capitalism vs traditional shareholder models",
      authors: "Dr. Thomas Wright, Marcus Rodriguez",
      publication: "Harvard Business Review",
      year: 2023,
      citations: 89,
      downloadUrl: "#",
      tags: ["Research", "Stakeholder Capitalism", "Economics"]
    },
    {
      title: "Community Investment ROI Analysis",
      description: "Quantitative analysis of return on investment for community investment programs",
      authors: "David Kim, Sarah Chen",
      publication: "Social Enterprise Journal",
      year: 2023,
      citations: 32,
      downloadUrl: "#",
      tags: ["Research", "ROI", "Community Investment"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Resources & Tools</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Access interactive tools, guides, case studies, and research to help you 
            implement shared wealth principles in your organization.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
              <TabsTrigger value="guides">Guides & Templates</TabsTrigger>
              <TabsTrigger value="cases">Case Studies</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
            </TabsList>

            {/* Interactive Tools */}
            <TabsContent value="tools" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Interactive Tools</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Use our interactive tools to assess, calculate, and design your shared wealth implementation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {interactiveTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-navy" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {tool.status}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {tool.time}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-navy">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-navy mb-2">Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {tool.features.map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <Link to={tool.path}>
                            Launch Tool
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Guides & Templates */}
            <TabsContent value="guides" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Guides & Templates</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Download comprehensive guides, templates, and frameworks to support your implementation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {guides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-navy" />
                          </div>
                          <div>
                            <CardTitle className="text-navy">{guide.title}</CardTitle>
                            <CardDescription>{guide.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-muted-foreground">
                            {guide.type} • {guide.pages} pages
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {guide.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <a href={guide.downloadUrl}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Case Studies */}
            <TabsContent value="cases" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Case Studies</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Learn from real-world examples of successful shared wealth implementations.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((study, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{study.sector}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {study.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-navy text-lg">{study.title}</CardTitle>
                      <CardDescription>{study.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-green-600 mb-2">
                          Impact: {study.impact}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {study.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <Link to={`/case-studies/${study.company.toLowerCase().replace(/\s+/g, '-')}`}>
                          Read Case Study
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Webinars */}
            <TabsContent value="webinars" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Webinars & Recordings</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Watch expert-led webinars and learn from industry leaders.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinars.map((webinar, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{webinar.duration}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" />
                          {webinar.attendees}
                        </div>
                      </div>
                      <CardTitle className="text-navy text-lg">{webinar.title}</CardTitle>
                      <CardDescription>{webinar.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          Speaker: {webinar.speaker}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {webinar.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <a href={webinar.recordingUrl}>
                          <Play className="w-4 h-4 mr-2" />
                          Watch Recording
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Research */}
            <TabsContent value="research" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Research & Publications</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Access academic research and publications on shared wealth principles.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {research.map((paper, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{paper.year}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          {paper.citations} citations
                        </div>
                      </div>
                      <CardTitle className="text-navy">{paper.title}</CardTitle>
                      <CardDescription>{paper.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          Authors: {paper.authors}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Publication: {paper.publication}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {paper.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <a href={paper.downloadUrl}>
                          <Download className="w-4 h-4 mr-2" />
                          Download Paper
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events */}
            <TabsContent value="events" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Events & Networking</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join our community events, workshops, and networking opportunities.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Workshop</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Mar 15, 2024
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Shared Wealth Implementation Workshop</CardTitle>
                    <CardDescription>Hands-on workshop for implementing shared wealth practices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Location: Virtual / London
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Implementation</Badge>
                        <Badge variant="outline" className="text-xs">Workshop</Badge>
                        <Badge variant="outline" className="text-xs">Networking</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/events">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Conference</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Apr 22, 2024
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Annual Shared Wealth Summit</CardTitle>
                    <CardDescription>Join industry leaders and practitioners for our annual conference</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Location: Manchester, UK
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Conference</Badge>
                        <Badge variant="outline" className="text-xs">Networking</Badge>
                        <Badge variant="outline" className="text-xs">Keynotes</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/events">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Networking</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        May 10, 2024
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Community Meetup</CardTitle>
                    <CardDescription>Connect with fellow shared wealth practitioners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Location: Various Cities
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Networking</Badge>
                        <Badge variant="outline" className="text-xs">Community</Badge>
                        <Badge variant="outline" className="text-xs">Local</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/events">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button asChild size="lg">
                  <Link to="/events">
                    View All Events
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            {/* Forum */}
            <TabsContent value="forum" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Community Forum</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Connect with the shared wealth community, ask questions, and share experiences.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Implementation</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        24 replies
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Getting Started with Profit Sharing</CardTitle>
                    <CardDescription>Tips and best practices for implementing profit sharing programs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Started by: Sarah Johnson • 2 days ago
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Profit Sharing</Badge>
                        <Badge variant="outline" className="text-xs">Implementation</Badge>
                        <Badge variant="outline" className="text-xs">Best Practices</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/forum">
                        Join Discussion
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Governance</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        18 replies
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Employee Board Representation</CardTitle>
                    <CardDescription>Experiences with employee representation on company boards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Started by: Michael Chen • 1 week ago
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Governance</Badge>
                        <Badge variant="outline" className="text-xs">Board</Badge>
                        <Badge variant="outline" className="text-xs">Experience</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/forum">
                        Join Discussion
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Community</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        32 replies
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Measuring Social Impact</CardTitle>
                    <CardDescription>How do you measure the social impact of shared wealth initiatives?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Started by: Elena Petrova • 3 days ago
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Impact</Badge>
                        <Badge variant="outline" className="text-xs">Measurement</Badge>
                        <Badge variant="outline" className="text-xs">Social</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/forum">
                        Join Discussion
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">Resources</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        15 replies
                      </div>
                    </div>
                    <CardTitle className="text-navy text-lg">Recommended Reading List</CardTitle>
                    <CardDescription>Share your favorite books and resources on shared wealth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Started by: David Kim • 5 days ago
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Resources</Badge>
                        <Badge variant="outline" className="text-xs">Books</Badge>
                        <Badge variant="outline" className="text-xs">Learning</Badge>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/forum">
                        Join Discussion
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button asChild size="lg">
                  <Link to="/forum">
                    Join the Forum
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Use our tools and resources to begin your shared wealth journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="green">
              <Link to="/dashboard">Start Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
              <Link to="/model">Learn Our Model</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;