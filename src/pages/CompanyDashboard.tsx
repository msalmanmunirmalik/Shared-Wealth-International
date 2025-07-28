import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3, 
  Brain, 
  BookOpen, 
  Shield,
  Settings,
  Bell,
  Plus,
  Copy,
  Check,
  Mail,
  User,
  Building,
  Home,
  FileText,
  MessageSquare,
  Star,
  Award,
  Activity,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ImpactAnalytics from "@/components/ImpactAnalytics";
import CommunityHub from "@/components/CommunityHub";
import LearningPath from "@/components/LearningPath";
import SecurityManager from "@/components/SecurityManager";
import AIInsights from "@/components/AIInsights";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState("");
  const [invitationRole, setInvitationRole] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("");
  const [isSendingInvitation, setIsSendingInvitation] = useState(false);

  // Dummy data
  const userCompanies = [
    {
      id: "pathway",
      name: "Pathway Technologies",
      role: "Director",
      status: "active",
      employees: 150,
      impactScore: 9.2
    },
    {
      id: "techcorp",
      name: "TechCorp Innovations",
      role: "Owner",
      status: "active",
      employees: 75,
      impactScore: 8.3
    },
    {
      id: "greenharvest",
      name: "Green Harvest Co.",
      role: "Partner",
      status: "pending",
      employees: 85,
      impactScore: 8.7
    }
  ];

  const personalMetrics = {
    totalCompanies: 3,
    totalMeetings: 24,
    totalImpact: "€4.2M",
    avgImpactScore: 8.7
  };

  const dummyRecentMeetings = [
    {
      id: "1",
      title: "SWI Strategy Meeting",
      date: "2024-01-15",
      outcome: "Strategic partnership established",
      impact: "High",
      company: "Pathway Technologies"
    },
    {
      id: "2",
      title: "Growth Planning Session",
      date: "2024-01-12",
      outcome: "Expansion roadmap finalized",
      impact: "Medium",
      company: "TechCorp Innovations"
    },
    {
      id: "3",
      title: "Community Impact Review",
      date: "2024-01-10",
      outcome: "Local initiatives launched",
      impact: "High",
      company: "Green Harvest Co."
    }
  ];

  const dummyActivity = [
    {
      id: "1",
      type: "meeting",
      title: "New SWI meeting scheduled",
      description: "Strategy session with Pathway team",
      time: "2 hours ago",
      company: "Pathway Technologies"
    },
    {
      id: "2",
      type: "impact",
      title: "Impact milestone reached",
      description: "€500K shared value created",
      time: "1 day ago",
      company: "TechCorp Innovations"
    },
    {
      id: "3",
      type: "team",
      title: "New team member joined",
      description: "Sarah Johnson joined as Developer",
      time: "2 days ago",
      company: "Pathway Technologies"
    }
  ];

  const dummyMembers = [
    {
      id: "1",
      name: "John Smith",
      role: "CEO",
      email: "john@pathway.com",
      avatar: "",
      status: "active"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "CTO",
      email: "sarah@pathway.com",
      avatar: "",
      status: "active"
    },
    {
      id: "3",
      name: "Mike Davis",
      role: "CFO",
      email: "mike@pathway.com",
      avatar: "",
      status: "active"
    }
  ];

  const invitationCode = "PATHWAY-2024-001";

  const toggleCompanyExpansion = (companyId: string) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  const handleSendInvitation = async () => {
    if (!invitationEmail || !invitationRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingInvitation(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Invitation Sent!",
      description: `Invitation sent to ${invitationEmail}`,
    });
    
    setInvitationDialogOpen(false);
    setInvitationEmail("");
    setInvitationRole("");
    setInvitationMessage("");
    setIsSendingInvitation(false);
  };

  const copyInvitationCode = async () => {
    try {
      await navigator.clipboard.writeText(invitationCode);
      toast({
        title: "Code Copied!",
        description: "Invitation code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the code manually",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "Employee Retention":
        return Users;
      default:
        return BarChart3;
    }
  };

  const sidebarItems = [
    { id: "profile", label: "My Profile", icon: User, href: "/my-profile" },
    { id: "companies", label: "My Companies", icon: Building, children: userCompanies },
    { id: "resources", label: "Resources", icon: FileText, href: "/resources" },
    { id: "forum", label: "Forum", icon: MessageSquare, href: "/forum" },
    { id: "events", label: "Events", icon: Calendar, href: "/events" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Calendar;
      case "impact":
        return TrendingUp;
      case "team":
        return Users;
      default:
        return Activity;
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      {/* Left Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col`} style={{ borderRight: '1px solid rgb(224, 230, 235)' }}>
        {/* User Profile */}
        <div className="p-4 border-b" style={{ borderColor: 'rgb(224, 230, 235)' }}>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'rgb(30, 58, 138)' }}>
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                  Active Member
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleCompanyExpansion(item.id)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ color: 'rgb(30, 58, 138)' }}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {expandedCompany === item.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  {expandedCompany === item.id && !sidebarCollapsed && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => setActiveTab(`company-${company.id}`)}
                          className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          style={{ color: 'rgb(75, 85, 99)' }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: company.status === 'active' ? 'rgb(34, 197, 94)' : 'rgb(245, 158, 11)' }} />
                          <span className="text-sm truncate">{company.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (item.href) {
                      window.location.href = item.href;
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: 'rgb(30, 58, 138)' }}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t" style={{ borderColor: 'rgb(224, 230, 235)' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: 'rgb(107, 114, 128)' }}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgb(224, 230, 235)' }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab.startsWith('company-') && `${userCompanies.find(c => c.id === activeTab.replace('company-', ''))?.name} Dashboard`}
              {activeTab === 'analytics' && 'Impact Analytics'}
              {activeTab === 'community' && 'Community Hub'}
              {activeTab === 'learning' && 'Learning Paths'}
              {activeTab === 'security' && 'Security & Governance'}
              {activeTab === 'ai-insights' && 'AI Insights'}
            </h1>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Welcome back! Here's what's happening with your companies.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}>
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Personal Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgb(245, 158, 11)' }}>
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>Total Companies</p>
                        <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>{personalMetrics.totalCompanies}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgb(13, 148, 136)' }}>
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>Total Meetings</p>
                        <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>{personalMetrics.totalMeetings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgb(34, 197, 94)' }}>
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>Total Impact</p>
                        <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>{personalMetrics.totalImpact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgb(168, 85, 247)' }}>
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'rgb(107, 114, 128)' }}>Avg. Impact Score</p>
                        <p className="text-2xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>{personalMetrics.avgImpactScore}/10</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity and Meetings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardHeader>
                    <CardTitle style={{ color: 'rgb(30, 58, 138)' }}>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dummyActivity.map((activity) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(245, 158, 11)' }}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: 'rgb(30, 58, 138)' }}>{activity.title}</p>
                              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{activity.description}</p>
                              <p className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>{activity.time} • {activity.company}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Meetings */}
                <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardHeader>
                    <CardTitle style={{ color: 'rgb(30, 58, 138)' }}>Recent Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dummyRecentMeetings.map((meeting) => (
                        <div key={meeting.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(13, 148, 136)' }}>
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: 'rgb(30, 58, 138)' }}>{meeting.title}</p>
                            <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{meeting.outcome}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                className="text-xs" 
                                style={{ 
                                  backgroundColor: meeting.impact === 'High' ? 'rgb(34, 197, 94)' : 'rgb(245, 158, 11)',
                                  color: 'white'
                                }}
                              >
                                {meeting.impact} Impact
                              </Badge>
                              <span className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>
                                {formatDate(meeting.date)} • {meeting.company}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Company-specific tabs */}
          {activeTab.startsWith('company-') && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                  <TabsTrigger value="overview" style={{ color: 'rgb(30, 58, 138)' }}>Overview</TabsTrigger>
                  <TabsTrigger value="analytics" style={{ color: 'rgb(30, 58, 138)' }}>Analytics</TabsTrigger>
                  <TabsTrigger value="community" style={{ color: 'rgb(30, 58, 138)' }}>Community</TabsTrigger>
                  <TabsTrigger value="learning" style={{ color: 'rgb(30, 58, 138)' }}>Learning</TabsTrigger>
                  <TabsTrigger value="security" style={{ color: 'rgb(30, 58, 138)' }}>Security</TabsTrigger>
                  <TabsTrigger value="ai-insights" style={{ color: 'rgb(30, 58, 138)' }}>AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                      <CardHeader>
                        <CardTitle style={{ color: 'rgb(30, 58, 138)' }}>Team Members</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dummyMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white', fontSize: '12px' }}>
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: 'rgb(30, 58, 138)' }}>{member.name}</p>
                                <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{member.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Dialog open={invitationDialogOpen} onOpenChange={setInvitationDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full mt-4" style={{ backgroundColor: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Team Member
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invite Team Member</DialogTitle>
                              <DialogDescription>
                                Send an invitation to join your team on the Shared Wealth platform.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={invitationEmail}
                                  onChange={(e) => setInvitationEmail(e.target.value)}
                                  placeholder="colleague@company.com"
                                  style={{ borderColor: 'rgb(224, 230, 235)' }}
                                />
                              </div>
                              <div>
                                <Label htmlFor="role">Role</Label>
                                <Select value={invitationRole} onValueChange={setInvitationRole}>
                                  <SelectTrigger style={{ borderColor: 'rgb(224, 230, 235)' }}>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="developer">Developer</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="analyst">Analyst</SelectItem>
                                    <SelectItem value="consultant">Consultant</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="message">Personal Message (Optional)</Label>
                                <Textarea
                                  id="message"
                                  value={invitationMessage}
                                  onChange={(e) => setInvitationMessage(e.target.value)}
                                  placeholder="Add a personal message..."
                                  style={{ borderColor: 'rgb(224, 230, 235)' }}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={handleSendInvitation}
                                disabled={isSendingInvitation}
                                style={{ backgroundColor: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}
                              >
                                {isSendingInvitation ? 'Sending...' : 'Send Invitation'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                      <CardHeader>
                        <CardTitle style={{ color: 'rgb(30, 58, 138)' }}>Invitation Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                            <p className="text-sm font-mono text-center" style={{ color: 'rgb(30, 58, 138)' }}>
                              {invitationCode}
                            </p>
                          </div>
                          <Button
                            onClick={copyInvitationCode}
                            variant="outline"
                            className="w-full"
                            style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                      <CardHeader>
                        <CardTitle style={{ color: 'rgb(30, 58, 138)' }}>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Meeting
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full justify-start" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Log Impact
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Log SWI Impact</DialogTitle>
                                <DialogDescription>
                                  Record the impact of your interactions with Shared Wealth International
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="impact-type">Impact Type</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select impact type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="meeting">SWI Meeting</SelectItem>
                                        <SelectItem value="growth">Growth Metric</SelectItem>
                                        <SelectItem value="partnership">Partnership</SelectItem>
                                        <SelectItem value="investment">Investment</SelectItem>
                                        <SelectItem value="community">Community Impact</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="impact-date">Date</Label>
                                    <Input type="date" id="impact-date" />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="impact-title">Title</Label>
                                  <Input id="impact-title" placeholder="e.g., Strategic Partnership Meeting with TechFlow" />
                                </div>
                                
                                <div>
                                  <Label htmlFor="impact-description">Description</Label>
                                  <Textarea 
                                    id="impact-description" 
                                    placeholder="Describe the impact and outcomes..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="participants">Participants</Label>
                                    <Textarea 
                                      id="participants" 
                                      placeholder="List participants (e.g., Gugs from Pathway, Ike from SWI, Amjid)"
                                      rows={2}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="outcomes">Key Outcomes</Label>
                                    <Textarea 
                                      id="outcomes" 
                                      placeholder="List key outcomes and agreements..."
                                      rows={2}
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor="investments">Investments Secured</Label>
                                    <Input id="investments" placeholder="e.g., $2.5M investment" />
                                  </div>
                                  <div>
                                    <Label htmlFor="partnerships">Partnerships Formed</Label>
                                    <Input id="partnerships" placeholder="e.g., TechFlow Partnership" />
                                  </div>
                                  <div>
                                    <Label htmlFor="impact-score">Impact Score (1-10)</Label>
                                    <Input id="impact-score" type="number" min="1" max="10" placeholder="9" />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="swi-contribution">SWI Contribution</Label>
                                  <Textarea 
                                    id="swi-contribution" 
                                    placeholder="How did Shared Wealth International contribute to this impact?"
                                    rows={2}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="follow-up">Follow-up Actions</Label>
                                  <Textarea 
                                    id="follow-up" 
                                    placeholder="List any follow-up actions or next steps..."
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
                                  Log Impact
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" className="w-full justify-start" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}>
                            <Users className="w-4 h-4 mr-2" />
                            Manage Team
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics">
                  <ImpactAnalytics />
                </TabsContent>

                <TabsContent value="community">
                  <CommunityHub />
                </TabsContent>

                <TabsContent value="learning">
                  <LearningPath />
                </TabsContent>

                <TabsContent value="security">
                  <SecurityManager />
                </TabsContent>

                <TabsContent value="ai-insights">
                  <AIInsights />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Other tabs */}
          {activeTab === 'analytics' && <ImpactAnalytics />}
          {activeTab === 'community' && <CommunityHub />}
          {activeTab === 'learning' && <LearningPath />}
          {activeTab === 'security' && <SecurityManager />}
          {activeTab === 'ai-insights' && <AIInsights />}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard; 