import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3, 
  Calculator, 
  Settings, 
  ArrowRight,
  Star,
  Heart,
  User,
  Calendar,
  Activity,
  Building,
  MessageSquare,
  Bell,
  Plus,
  Search,
  Filter,
  BookOpen,
  Globe,
  Lightbulb,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
}

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  path: string;
  color: string;
}

interface RecentActivity {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: any;
}

interface Tool {
  title: string;
  description: string;
  icon: any;
  path: string;
  status: string;
  time: string;
}

const Dashboard = () => {
  const { user } = useAuth();

  const metrics: Metric[] = [
    {
      label: "Network Companies",
      value: "24",
      change: "+3 this month",
      trend: "up",
      icon: Users
    },
    {
      label: "Total Shared Value",
      value: "$2.4M",
      change: "+12% vs last year",
      trend: "up",
      icon: DollarSign
    },
    {
      label: "Average Impact Score",
      value: "8.7/10",
      change: "+0.3 points",
      trend: "up",
      icon: Target
    },
    {
      label: "Active Partnerships",
      value: "156",
      change: "+8 this quarter",
      trend: "up",
      icon: TrendingUp
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: "My Profile",
      description: "Update your information",
      icon: User,
      path: "/profile",
      color: "from-blue-50 to-indigo-100"
    },
    {
      title: "My Companies",
      description: "Manage company associations & network connections",
      icon: Building,
      path: "/companies",
      color: "from-green-50 to-emerald-100"
    },
    {
      title: "Create Event",
      description: "Organize a new event",
      icon: Calendar,
      path: "/network?tab=events",
      color: "from-orange-50 to-amber-100"
    },
    {
      title: "Start Discussion",
      description: "Post in the forum",
      icon: MessageSquare,
      path: "/resources?tab=forum",
      color: "from-purple-50 to-violet-100"
    }
  ];

  const interactiveTools: Tool[] = [
    {
      title: "Impact Calculator",
      description: "Calculate potential benefits and ROI",
      icon: Calculator,
      path: "/calculator",
      status: "Live",
      time: "5 min"
    },
    {
      title: "Readiness Assessment",
      description: "Evaluate organizational readiness",
      icon: Target,
      path: "/assessment",
      status: "Live",
      time: "10 min"
    },
    {
      title: "Governance Simulator",
      description: "Simulate governance scenarios",
      icon: Settings,
      path: "/simulator",
      status: "Live",
      time: "15 min"
    },
    {
      title: "Model Configurator",
      description: "Design custom shared wealth model",
      icon: BarChart3,
      path: "/configurator",
      status: "Live",
      time: "20 min"
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      type: "company_joined",
      title: "TechCorp joined the network",
      description: "New technology company implementing shared wealth model",
      time: "2 hours ago",
      icon: Users
    },
    {
      type: "impact_achieved",
      title: "GreenEnergy reached 15% profit sharing",
      description: "Successfully implemented comprehensive profit-sharing program",
      time: "1 day ago",
      icon: Star
    },
    {
      type: "partnership_formed",
      title: "New partnership with CommunityBank",
      description: "Strategic partnership for financial inclusion initiatives",
      time: "3 days ago",
      icon: Heart
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Welcome back, {user?.email?.split('@')[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening in your Shared Wealth network</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/network">View Network</Link>
            </Button>
            <Button asChild>
              <Link to="/resources">Access Resources</Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6">Network Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold text-navy">{metric.value}</p>
                        <p className={`text-sm ${getTrendColor(metric.trend)}`}>{metric.change}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Actions & Tools */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-navy" />
                      </div>
                      <h3 className="font-semibold text-navy mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={action.path}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Go
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Interactive Tools */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Interactive Tools</h2>
            <div className="space-y-4">
              {interactiveTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-navy" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy">{tool.title}</h3>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs mb-1">
                            {tool.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">{tool.time}</div>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-3">
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
          </div>
        </section>

        {/* Network Progress & Impact Metrics */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Network Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <Target className="w-5 h-5 mr-2" />
                Network Growth
              </CardTitle>
              <CardDescription>Progress towards our 50-company goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Companies in Network</span>
                <span className="text-sm font-bold">24 / 50</span>
              </div>
              <Progress value={48} className="w-full" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-muted-foreground">Sectors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">12</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-muted-foreground">Partnerships</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <TrendingUp className="w-5 h-5 mr-2" />
                Impact Metrics
              </CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Profit Sharing</span>
                  <span className="text-sm font-bold">12.3%</span>
                </div>
                <Progress value={61.5} className="w-full" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Employee Satisfaction</span>
                  <span className="text-sm font-bold">8.7/10</span>
                </div>
                <Progress value={87} className="w-full" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Community Impact</span>
                  <span className="text-sm font-bold">9.2/10</span>
                </div>
                <Progress value={92} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Activity & Resources */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-navy" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-navy">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Resources */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Quick Resources</h2>
            <div className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy">Implementation Guide</h3>
                      <p className="text-sm text-muted-foreground">Step-by-step guide for shared wealth implementation</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full mt-3">
                    <Link to="/resources?tab=guides">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy">Network Directory</h3>
                      <p className="text-sm text-muted-foreground">Browse companies in the shared wealth network</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full mt-3">
                    <Link to="/network">
                      <Globe className="w-4 h-4 mr-2" />
                      Browse Network
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy">Case Studies</h3>
                      <p className="text-sm text-muted-foreground">Learn from successful implementations</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full mt-3">
                    <Link to="/resources?tab=cases">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      View Cases
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-navy to-blue-900 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-6 opacity-90">
                Use our tools and resources to begin your shared wealth journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="green">
                  <Link to="/assessment">Start Assessment</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
                  <Link to="/resources">Explore Resources</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 