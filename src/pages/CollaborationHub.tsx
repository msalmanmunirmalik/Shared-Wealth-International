import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Handshake, 
  Building,
  Heart,
  Calendar,
  DollarSign,
  FileText,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';


// Enhanced dummy data with detailed meeting information
const dummyStats = {
  companiesHelped: 47,
  meetingsFacilitated: 156,
  partnershipsFormed: 23,
  totalValueGenerated: '$12.5M',
  totalParticipants: 892,
  totalInvestments: '$8.2M',
  averageMeetingRating: 9.2
};

// Enhanced meeting data with detailed information
const pathwayMeetings = [
  {
    id: '1',
    title: 'Pathway & TechFlow Strategic Partnership Meeting',
    date: '2024-01-15',
    participants: [
      { name: 'Gugs', company: 'Pathway', role: 'CEO' },
      { name: 'Sarah Chen', company: 'TechFlow', role: 'CTO' },
      { name: 'Ike', company: 'Shared Wealth International', role: 'Facilitator' },
      { name: 'Amjid', company: 'Marketing Expert', role: 'Advisor' }
    ],
    notes: 'Discussed potential collaboration on sustainable technology solutions and market expansion strategies. Explored opportunities for joint product development.',
    outcomes: [
      'Strategic partnership agreement signed',
      'Joint product development roadmap created',
      'Market expansion strategy finalized',
      'Resource sharing framework established'
    ],
    investments: '$2.5M joint investment secured',
    partnerships: ['TechFlow Partnership', 'Marketing Collaboration with Amjid'],
    impact_score: 9,
    shared_wealth_contribution: 'Introduced key decision makers, provided market insights, structured partnership framework, facilitated negotiations',
    location: 'London, UK',
    duration: '3 hours',
    follow_up_actions: [
      'Monthly partnership review meetings',
      'Joint marketing campaign planning',
      'Technical integration planning'
    ]
  },
  {
    id: '2',
    title: 'Pathway Growth Strategy & Investment Meeting',
    date: '2024-01-10',
    participants: [
      { name: 'Gugs', company: 'Pathway', role: 'CEO' },
      { name: 'Emma Thompson', company: 'GreenVentures', role: 'Investment Director' },
      { name: 'Ike', company: 'Shared Wealth International', role: 'Facilitator' },
      { name: 'Dr. Ahmed Hassan', company: 'Islamic Finance Expert', role: 'Advisor' }
    ],
    notes: 'Comprehensive discussion on Pathway\'s growth strategy, focusing on sustainable development and Islamic finance principles. Explored funding options and market opportunities.',
    outcomes: [
      '£1.8M investment secured from GreenVentures',
      'Islamic finance framework implemented',
      'Sustainable development roadmap created',
      'Community engagement strategy developed'
    ],
    investments: '£1.8M investment secured',
    partnerships: ['GreenVentures Investment', 'Islamic Finance Partnership'],
    impact_score: 9,
    shared_wealth_contribution: 'Connected with GreenVentures, introduced Islamic finance expert, facilitated investment negotiations, provided strategic guidance',
    location: 'Manchester, UK',
    duration: '4 hours',
    follow_up_actions: [
      'Quarterly investment review meetings',
      'Islamic finance compliance monitoring',
      'Community impact assessment'
    ]
  },
  {
    id: '3',
    title: 'Pathway Community Outreach & Muslim Community Meeting',
    date: '2024-01-08',
    participants: [
      { name: 'Gugs', company: 'Pathway', role: 'CEO' },
      { name: 'Imam Khalid Rahman', company: 'Local Mosque', role: 'Community Leader' },
      { name: 'Ike', company: 'Shared Wealth International', role: 'Facilitator' },
      { name: 'Fatima Al-Zahra', company: 'Community Development', role: 'Coordinator' },
      { name: 'Amjid', company: 'Marketing Expert', role: 'Advisor' }
    ],
    notes: 'Focused on developing community outreach programs and engaging with Muslim communities. Discussed cultural sensitivity and community development initiatives.',
    outcomes: [
      'Community outreach program launched',
      'Muslim community engagement strategy developed',
      'Cultural sensitivity training implemented',
      'Local partnership agreements signed'
    ],
    investments: '£500K community development fund',
    partnerships: ['Local Mosque Partnership', 'Community Development Alliance'],
    impact_score: 8,
    shared_wealth_contribution: 'Facilitated community connections, provided cultural guidance, coordinated outreach strategy, introduced community leaders',
    location: 'Birmingham, UK',
    duration: '2.5 hours',
    follow_up_actions: [
      'Monthly community meetings',
      'Cultural training sessions',
      'Community impact monitoring'
    ]
  },
  {
    id: '4',
    title: 'Pathway Technology Innovation & IP Sharing Meeting',
    date: '2024-01-05',
    participants: [
      { name: 'Gugs', company: 'Pathway', role: 'CEO' },
      { name: 'Dr. Lisa Park', company: 'Innovation Labs', role: 'Research Director' },
      { name: 'Ike', company: 'Shared Wealth International', role: 'Facilitator' },
      { name: 'Marcus Johnson', company: 'Patent Attorney', role: 'Legal Advisor' }
    ],
    notes: 'Explored innovative technology solutions and IP sharing models. Discussed patent strategies and collaborative research opportunities.',
    outcomes: [
      'IP sharing framework established',
      'Joint research agreement signed',
      'Patent strategy developed',
      'Innovation collaboration launched'
    ],
    investments: '$1.2M research and development fund',
    partnerships: ['Innovation Labs Collaboration', 'IP Sharing Alliance'],
    impact_score: 8,
    shared_wealth_contribution: 'Connected with innovation experts, facilitated IP discussions, provided legal guidance, structured collaboration framework',
    location: 'Cambridge, UK',
    duration: '3.5 hours',
    follow_up_actions: [
      'Bi-weekly innovation meetings',
      'Patent filing coordination',
      'Research progress reviews'
    ]
  }
];

const dummyRecentActivity = [
  {
    id: '1',
    activity_type: 'meeting',
    title: 'Pathway & TechFlow Partnership',
    description: 'SWI connected Pathway with TechFlow, resulting in a strategic partnership.',
    metadata: {
      participants: ['Pathway', 'TechFlow'],
      impact_score: 9,
      shared_wealth_contribution: 'Introduced key decision makers and facilitated partnership discussions'
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    company: { name: 'Pathway' }
  },
  {
    id: '2',
    activity_type: 'growth',
    title: 'GreenEnergy Revenue Growth',
    description: 'GreenEnergy achieved 40% revenue growth through SWI connections.',
    metadata: {
      metric_value: 40,
      metric_unit: 'percentage',
      shared_wealth_impact: 'Connected with investors and strategic partners'
    },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    company: { name: 'GreenEnergy' }
  },
  {
    id: '3',
    activity_type: 'connection',
    title: 'EcoSolutions Partnership Deal',
    description: 'SWI facilitated a $2M partnership deal between EcoSolutions and GlobalTech.',
    metadata: {
      target_company_id: 'globaltech',
      outcome: 'Partnership deal signed',
      value_generated: '$2M partnership agreement'
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    company: { name: 'EcoSolutions' }
  }
];

const CollaborationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-5xl font-bold mb-6 text-white">Impact Analytics</h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Track and measure your social and economic impact through our comprehensive 
              collaboration and analytics platform.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.companiesHelped}</CardTitle>
            <CardDescription>Companies Helped</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Handshake className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.meetingsFacilitated}</CardTitle>
            <CardDescription>Meetings Facilitated</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Building className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.partnershipsFormed}</CardTitle>
            <CardDescription>Partnerships Formed</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.totalValueGenerated}</CardTitle>
            <CardDescription>Value Generated</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <Users className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.totalParticipants}</CardTitle>
            <CardDescription>Total Participants</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.totalInvestments}</CardTitle>
            <CardDescription>Investments Secured</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold">{dummyStats.averageMeetingRating}/10</CardTitle>
            <CardDescription>Average Meeting Rating</CardDescription>
          </CardHeader>
        </Card>
      </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Detailed Meetings</TabsTrigger>
          <TabsTrigger value="stories">Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Impact Stories</h2>
            <p className="text-lg text-gray-600">
              Real-time success stories from companies in the SWI network
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyRecentActivity.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={
                      activity.activity_type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      activity.activity_type === 'growth' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {activity.activity_type === 'meeting' ? 'SWI Meeting' :
                       activity.activity_type === 'growth' ? 'Growth' :
                       'Connection'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {Math.floor((Date.now() - activity.created_at.getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </span>
                  </div>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <CardDescription>{activity.company.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{activity.description}</p>
                  
                  {activity.activity_type === 'meeting' && activity.metadata.shared_wealth_contribution && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">SWI Contribution:</p>
                      <p className="text-sm text-blue-700">{activity.metadata.shared_wealth_contribution}</p>
                    </div>
                  )}
                  
                  {activity.activity_type === 'growth' && activity.metadata.shared_wealth_impact && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">SWI Impact:</p>
                      <p className="text-sm text-green-700">{activity.metadata.shared_wealth_impact}</p>
                    </div>
                  )}
                  
                  {activity.activity_type === 'connection' && activity.metadata.value_generated && (
                    <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800 mb-1">Value Generated:</p>
                      <p className="text-sm text-purple-700">{activity.metadata.value_generated}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
                <Building className="h-6 w-6" />
                Log Your Impact
              </CardTitle>
              <CardDescription className="text-blue-700">
                Company owners and directors can log their impact directly from their company dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-4">
                To log your company's impact with Shared Wealth International, please visit your company dashboard where you can:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-left">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Log SWI Meetings</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Record meeting outcomes</li>
                    <li>• Rate SWI's contribution</li>
                    <li>• Track participant connections</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-green-800 mb-2">📈 Track Growth Impact</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Log revenue growth</li>
                    <li>• Measure customer expansion</li>
                    <li>• Document partnerships</li>
                  </ul>
                </div>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Go to Company Dashboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pathway by Shared Wealth International - Detailed Meetings</h2>
            <p className="text-lg text-gray-600">
              Comprehensive logs of meetings arranged for Pathway, including participants, outcomes, investments, and partnerships
            </p>
          </div>

          <div className="space-y-8">
            {pathwayMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        {meeting.date}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {meeting.duration}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        <MapPin className="w-3 h-3 mr-1" />
                        {meeting.location}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{meeting.impact_score}/10</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{meeting.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Participants Section */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Participants ({meeting.participants.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {meeting.participants.map((participant, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {participant.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            <p className="text-sm text-gray-600">{participant.company} • {participant.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Outcomes Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Meeting Notes
                      </h4>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-700">{meeting.notes}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Key Outcomes
                      </h4>
                      <div className="space-y-2">
                        {meeting.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Investments & Partnerships Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Investments Secured
                      </h4>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-semibold">{meeting.investments}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Handshake className="w-4 h-4 mr-2" />
                        Partnerships Formed
                      </h4>
                      <div className="space-y-2">
                        {meeting.partnerships.map((partnership, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {partnership}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SWI Contribution */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Shared Wealth International Contribution
                    </h4>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-purple-800">{meeting.shared_wealth_contribution}</p>
                    </div>
                  </div>

                  {/* Follow-up Actions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Follow-up Actions
                    </h4>
                    <div className="space-y-2">
                      {meeting.follow_up_actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">
              Real examples of how SWI creates value for companies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyRecentActivity.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={
                      activity.activity_type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      activity.activity_type === 'growth' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {activity.activity_type === 'meeting' ? 'SWI Meeting' :
                       activity.activity_type === 'growth' ? 'Growth' :
                       'Connection'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {Math.floor((Date.now() - activity.created_at.getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </span>
                  </div>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <CardDescription>{activity.company.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{activity.description}</p>
                  
                  {activity.activity_type === 'meeting' && activity.metadata.shared_wealth_contribution && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">SWI Contribution:</p>
                      <p className="text-sm text-blue-700">{activity.metadata.shared_wealth_contribution}</p>
                    </div>
                  )}
                  
                  {activity.activity_type === 'growth' && activity.metadata.shared_wealth_impact && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">SWI Impact:</p>
                      <p className="text-sm text-green-700">{activity.metadata.shared_wealth_impact}</p>
                    </div>
                  )}
                  
                  {activity.activity_type === 'connection' && activity.metadata.value_generated && (
                    <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800 mb-1">Value Generated:</p>
                      <p className="text-sm text-purple-700">{activity.metadata.value_generated}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Share Your Story
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationHub; 