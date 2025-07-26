import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Handshake, 
  Calendar,
  Building,
  Globe,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import RealTimeActivityFeed from '@/components/RealTimeActivityFeed';
import CollaborationMeetingForm from '@/components/CollaborationMeetingForm';
import GrowthMetricsForm from '@/components/GrowthMetricsForm';
import CollaborationAnalytics from '@/components/CollaborationAnalytics';
import { useToast } from '@/hooks/use-toast';

const CollaborationHub = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSuccess = () => {
    // Refresh the activity feed when new data is added
    toast({
      title: "Success",
      description: "Your update has been shared with the community!",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-navy mb-4">
          Shared Wealth Collaboration Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect, collaborate, and track the impact of Shared Wealth International's network. 
          See real-time updates from member companies and measure our collective success.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Active Companies</p>
                <p className="text-2xl font-bold text-blue-900">25+</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Collaborations</p>
                <p className="text-2xl font-bold text-green-900">150+</p>
              </div>
              <Handshake className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Growth Metrics</p>
                <p className="text-2xl font-bold text-purple-900">300+</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Avg Impact</p>
                <p className="text-2xl font-bold text-yellow-900">8.5/10</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live Feed
          </TabsTrigger>
          <TabsTrigger value="collaborate" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaborate
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            About
          </TabsTrigger>
        </TabsList>

        {/* Live Activity Feed */}
        <TabsContent value="activity" className="space-y-6">
          <RealTimeActivityFeed />
        </TabsContent>

        {/* Collaboration Tools */}
        <TabsContent value="collaborate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collaboration Meeting Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Log Collaboration Meeting
                </CardTitle>
                <CardDescription>
                  Record meetings with other Shared Wealth companies and track their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Example Meeting</h4>
                    <p className="text-sm text-blue-700">
                      "Pathway had a meeting with Gugs (founder/director of Shared Wealth company). 
                      Meeting notes and how this meeting helped Pathway grow."
                    </p>
                  </div>
                  <CollaborationMeetingForm 
                    companyId="your-company-id" 
                    onSuccess={handleSuccess}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Growth Metrics Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Track Growth Metrics
                </CardTitle>
                <CardDescription>
                  Log your company's growth and measure Shared Wealth International's contribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Example Growth</h4>
                    <p className="text-sm text-green-700">
                      "Ike had a meeting with Amjid and Amjid helped Pathway with marketing and 
                      media reach, introducing them to Muslim communities."
                    </p>
                  </div>
                  <GrowthMetricsForm 
                    companyId="your-company-id" 
                    onSuccess={handleSuccess}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                How the Collaboration Hub Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Log Activities</h4>
                  <p className="text-sm text-muted-foreground">
                    Record meetings, collaborations, and growth metrics with other Shared Wealth companies
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Track Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Measure how Shared Wealth International contributes to your company's success
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Share Success</h4>
                  <p className="text-sm text-muted-foreground">
                    Your updates appear in the real-time feed, inspiring other companies and building the movement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics" className="space-y-6">
          <CollaborationAnalytics />
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The Shared Wealth Collaboration Hub is designed to demonstrate the real-world impact 
                  of our movement. By tracking collaborations, meetings, and growth metrics, we can:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Show tangible value created through our network</li>
                  <li>• Identify successful collaboration patterns</li>
                  <li>• Measure Shared Wealth International's contribution to company growth</li>
                  <li>• Build recognition as a powerful movement for change</li>
                  <li>• Improve strategies for future company onboarding</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Community Building</h4>
                      <p className="text-sm text-muted-foreground">
                        See how companies help each other grow and create a sense of mutual support
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Analytics & Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Track which connections lead to the most value and identify successful patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Movement Recognition</h4>
                      <p className="text-sm text-muted-foreground">
                        Showcase real-world impact and build credibility for the Shared Wealth movement
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-navy to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Join the Shared Wealth Movement
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start logging your collaborations and growth metrics today. Help us demonstrate 
                the power of shared wealth principles and build a stronger, more connected community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-navy">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationHub; 