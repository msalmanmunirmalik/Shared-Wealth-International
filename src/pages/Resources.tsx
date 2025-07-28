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
  Lightbulb,
  Shield,
  Building,
  ClipboardCheck,
  Upload,
  LayoutDashboard,
  Share2,
  Scale,
  PieChart,
  DollarSign
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
      title: "Wealth Distribution Analyzer",
      description: "Analyze all aspects of company wealth including shares, IP, assets, and identify sharing opportunities",
      icon: Calculator,
      status: "Live",
      time: "15 min",
      path: "/wealth-analyzer",
      features: ["Share Ownership Analysis", "IP Valuation", "Asset Distribution", "Sharing Recommendations"],
      color: "from-blue-50 to-indigo-100"
    },
    {
      title: "Communication Channel Optimizer",
      description: "Map and optimize communication channels for inclusive decision-making across all stakeholders",
      icon: Users,
      status: "Live",
      time: "12 min",
      path: "/communication-optimizer",
      features: ["Channel Mapping", "Inclusivity Assessment", "Decision Flow Analysis", "Optimization Strategies"],
      color: "from-green-50 to-emerald-100"
    },
    {
      title: "Values Alignment Assessment",
      description: "Evaluate how company values align with actual practices and identify improvement areas",
      icon: Target,
      status: "Live",
      time: "18 min",
      path: "/values-assessment",
      features: ["Values Audit", "Practice Analysis", "Gap Identification", "Alignment Roadmap"],
      color: "from-purple-50 to-violet-100"
    },
    {
      title: "Stakeholder Wealth Mapping",
      description: "Map wealth distribution across all stakeholders and identify sharing opportunities",
      icon: BarChart3,
      status: "Live",
      time: "20 min",
      path: "/stakeholder-mapping",
      features: ["Stakeholder Analysis", "Wealth Distribution", "Sharing Models", "Impact Projections"],
      color: "from-orange-50 to-amber-100"
    },
    {
      title: "Inclusive Decision Framework",
      description: "Design and test inclusive decision-making processes for your organization",
      icon: Settings,
      status: "Live",
      time: "25 min",
      path: "/decision-framework",
      features: ["Process Design", "Stakeholder Inclusion", "Scenario Testing", "Implementation Guide"],
      color: "from-pink-50 to-rose-100"
    },
    {
      title: "IP Sharing Simulator",
      description: "Simulate different IP sharing models and their impact on innovation and value creation",
      icon: Lightbulb,
      status: "Live",
      time: "15 min",
      path: "/ip-simulator",
      features: ["IP Valuation", "Sharing Models", "Innovation Impact", "Value Distribution"],
      color: "from-yellow-50 to-amber-100"
    },
    {
      title: "Readiness Assessment",
      description: "Evaluate your organization's readiness for shared wealth implementation",
      icon: TrendingUp,
      status: "Live",
      time: "10 min",
      path: "/assessment",
      features: ["Organizational Readiness", "Stakeholder Analysis", "Implementation Roadmap"],
      color: "from-teal-50 to-cyan-100"
    },
    {
      title: "Governance Simulator",
      description: "Simulate different governance scenarios and decision-making processes",
      icon: Shield,
      status: "Live",
      time: "15 min",
      path: "/simulator",
      features: ["Governance Models", "Decision Scenarios", "Stakeholder Impact"],
      color: "from-indigo-50 to-blue-100"
    }
  ];

  const guides = [
    {
      title: "Shared Wealth Model",
      description: "Comprehensive framework for creating sustainable value that benefits all stakeholders",
      type: "Interactive Guide",
      pages: 60,
      downloadUrl: "/shared-wealth-model",
      icon: BookOpen,
      tags: ["Framework", "Principles", "Implementation"],
      featured: true
    },
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

  const trainingCourses = [
    {
      title: "Managing Working Hours of Staff",
      description: "Learn effective strategies for managing and optimizing staff working hours in a shared wealth environment",
      duration: "2 hours",
      level: "Intermediate",
      instructor: "Dr. Sarah Johnson",
      category: "Operations",
      modules: ["Time Tracking Systems", "Flexible Scheduling", "Work-Life Balance", "Productivity Optimization"],
      icon: Clock,
      color: "from-blue-50 to-indigo-100"
    },
    {
      title: "Stakeholder Engagement",
      description: "Master the art of engaging all stakeholders in decision-making and value creation processes",
      duration: "3 hours",
      level: "Advanced",
      instructor: "Prof. Michael Chen",
      category: "Leadership",
      modules: ["Stakeholder Mapping", "Communication Strategies", "Engagement Models", "Feedback Systems"],
      icon: Users,
      color: "from-green-50 to-emerald-100"
    },
    {
      title: "Directory Companies",
      description: "Understand how to build and manage a directory of companies committed to shared wealth principles",
      duration: "1.5 hours",
      level: "Beginner",
      instructor: "Elena Petrova",
      category: "Networking",
      modules: ["Company Profiling", "Verification Processes", "Network Building", "Collaboration Opportunities"],
      icon: Building,
      color: "from-purple-50 to-violet-100"
    },
    {
      title: "What are Social Economic Models that Work Really Well",
      description: "Explore proven social economic models and their successful implementation strategies",
      duration: "4 hours",
      level: "Advanced",
      instructor: "Dr. Thomas Wright",
      category: "Strategy",
      modules: ["Model Analysis", "Success Factors", "Implementation Roadmaps", "Case Studies"],
      icon: TrendingUp,
      color: "from-orange-50 to-amber-100"
    },
    {
      title: "Standard Company Rule Book that Adheres to Your Values - Shared Wealth",
      description: "Create comprehensive company policies and procedures that align with shared wealth principles",
      duration: "2.5 hours",
      level: "Intermediate",
      instructor: "Legal Team",
      category: "Governance",
      modules: ["Policy Framework", "Value Integration", "Compliance Requirements", "Implementation Guide"],
      icon: FileText,
      color: "from-pink-50 to-rose-100"
    },
    {
      title: "Social Audit Process",
      description: "Learn how to conduct comprehensive social audits to measure and improve your shared wealth impact",
      duration: "3.5 hours",
      level: "Advanced",
      instructor: "Audit Specialists",
      category: "Assessment",
      modules: ["Audit Framework", "Data Collection", "Impact Measurement", "Reporting Standards"],
      icon: ClipboardCheck,
      color: "from-yellow-50 to-amber-100"
    },
    {
      title: "Upload Documents - Reviewed",
      description: "Master the document management and review processes for shared wealth organizations",
      duration: "1 hour",
      level: "Beginner",
      instructor: "Documentation Team",
      category: "Operations",
      modules: ["Document Standards", "Review Processes", "Version Control", "Access Management"],
      icon: Upload,
      color: "from-teal-50 to-cyan-100"
    },
    {
      title: "Cashflow Management / Forecasting Tools",
      description: "Learn advanced cashflow management and forecasting techniques for sustainable business growth",
      duration: "3 hours",
      level: "Intermediate",
      instructor: "Financial Experts",
      category: "Finance",
      modules: ["Cashflow Analysis", "Forecasting Models", "Financial Planning", "Risk Management"],
      icon: BarChart3,
      color: "from-indigo-50 to-blue-100"
    },
    {
      title: "Dashboard to Manage Shared Wealth",
      description: "Design and implement effective dashboards for monitoring and managing shared wealth metrics",
      duration: "2 hours",
      level: "Intermediate",
      instructor: "Data Analytics Team",
      category: "Technology",
      modules: ["Dashboard Design", "KPI Selection", "Data Visualization", "Real-time Monitoring"],
      icon: LayoutDashboard,
      color: "from-emerald-50 to-green-100"
    },
    {
      title: "Phantom Equity Distribution / Share Distribution Platform",
      description: "Implement effective phantom equity and share distribution systems for employee ownership",
      duration: "4 hours",
      level: "Advanced",
      instructor: "Equity Specialists",
      category: "Ownership",
      modules: ["Phantom Equity Design", "Distribution Models", "Platform Implementation", "Legal Compliance"],
      icon: Share2,
      color: "from-red-50 to-pink-100"
    },
    {
      title: "Legal Structures / Company Formation",
      description: "Understand legal structures and company formation processes for shared wealth organizations",
      duration: "3 hours",
      level: "Intermediate",
      instructor: "Legal Advisors",
      category: "Legal",
      modules: ["Legal Structures", "Formation Process", "Compliance Requirements", "Best Practices"],
      icon: Scale,
      color: "from-slate-50 to-gray-100"
    },
    {
      title: "Types of Shares",
      description: "Comprehensive guide to different types of shares and their applications in shared wealth models",
      duration: "2.5 hours",
      level: "Intermediate",
      instructor: "Share Structure Experts",
      category: "Ownership",
      modules: ["Share Types", "Voting Rights", "Dividend Structures", "Transfer Restrictions"],
      icon: PieChart,
      color: "from-cyan-50 to-blue-100"
    },
    {
      title: "Utilising Shares in Lieu of Payment",
      description: "Learn how to effectively use shares as compensation and payment mechanisms",
      duration: "2 hours",
      level: "Advanced",
      instructor: "Compensation Specialists",
      category: "Compensation",
      modules: ["Share-Based Compensation", "Valuation Methods", "Tax Implications", "Implementation Strategies"],
      icon: DollarSign,
      color: "from-lime-50 to-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Tools & Learning</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/80">
            Access interactive tools and comprehensive training courses to help you 
            implement shared wealth principles in your organization.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
              <TabsTrigger value="training">Training Courses</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            {/* Interactive Tools */}
            <TabsContent value="tools" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#07264e' }}>Interactive Tools</h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: '#086075' }}>
                  Use our interactive tools to assess, calculate, and design your shared wealth implementation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {interactiveTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-8 h-8" style={{ color: '#07264e' }} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs" style={{ backgroundColor: 'rgba(52, 166, 59, 0.1)', color: '#34a63b' }}>
                              {tool.status}
                            </Badge>
                            <div className="flex items-center text-xs" style={{ color: '#086075' }}>
                              <Clock className="w-3 h-3 mr-1" />
                              {tool.time}
                            </div>
                          </div>
                        </div>
                        <CardTitle style={{ color: '#07264e' }}>{tool.title}</CardTitle>
                        <CardDescription style={{ color: '#086075' }}>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="text-xs font-semibold mb-2" style={{ color: '#07264e' }}>Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {tool.features.map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="outline" className="text-xs" style={{ borderColor: 'rgba(8, 96, 117, 0.2)', color: '#086075' }}>
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)', color: 'white' }}>
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

            {/* Training Courses */}
            <TabsContent value="training" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#07264e' }}>Training Courses</h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: '#086075' }}>
                  Comprehensive training courses designed to help you master shared wealth implementation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingCourses.map((course, index) => {
                  const Icon = course.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6" style={{ color: '#07264e' }} />
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant="secondary" className="text-xs mb-1" style={{ backgroundColor: 'rgba(234, 188, 39, 0.1)', color: '#eabc27' }}>
                              {course.level}
                            </Badge>
                            <div className="flex items-center text-xs" style={{ color: '#086075' }}>
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg" style={{ color: '#07264e' }}>{course.title}</CardTitle>
                        <CardDescription style={{ color: '#086075' }}>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2" style={{ color: '#07264e' }}>
                            Instructor: {course.instructor}
                          </div>
                          <div className="text-sm mb-3" style={{ color: '#086075' }}>
                            Category: {course.category}
                          </div>
                          <div className="text-xs font-medium mb-2" style={{ color: '#07264e' }}>Modules:</div>
                          <div className="flex flex-wrap gap-1">
                            {course.modules.map((module, moduleIndex) => (
                              <Badge key={moduleIndex} variant="outline" className="text-xs" style={{ borderColor: 'rgba(8, 96, 117, 0.2)', color: '#086075' }}>
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)', color: 'white' }}>
                          <Link to={`/training/${course.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            Enroll Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Events */}
            <TabsContent value="events" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#07264e' }}>Events & Networking</h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: '#086075' }}>
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


          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/80">
            Use our tools and training courses to begin your shared wealth journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-white" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)' }}>
              <Link to="/assessment">Start Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" style={{ borderColor: '#eabc27', color: '#eabc27' }}>
              <Link to="/model">Learn Our Model</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;