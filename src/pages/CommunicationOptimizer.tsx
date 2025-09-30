import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Users,
  MessageSquare,
  Mail,
  Phone,
  Video,
  Globe,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw
} from "lucide-react";

const CommunicationOptimizer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [communicationData, setCommunicationData] = useState({
    channels: [
      {
        name: "Email",
        usage: 85,
        inclusivity: 70,
        effectiveness: 75,
        stakeholders: ["Employees", "Investors", "Partners"],
        frequency: "Daily",
        cost: "Low"
      },
      {
        name: "Team Meetings",
        usage: 60,
        inclusivity: 80,
        effectiveness: 85,
        stakeholders: ["Employees", "Management"],
        frequency: "Weekly",
        cost: "Medium"
      },
      {
        name: "Video Calls",
        usage: 70,
        inclusivity: 75,
        effectiveness: 80,
        stakeholders: ["Employees", "Remote Teams", "Partners"],
        frequency: "Weekly",
        cost: "Low"
      },
      {
        name: "Town Halls",
        usage: 30,
        inclusivity: 90,
        effectiveness: 85,
        stakeholders: ["All Stakeholders"],
        frequency: "Monthly",
        cost: "Medium"
      },
      {
        name: "Social Media",
        usage: 40,
        inclusivity: 60,
        effectiveness: 50,
        stakeholders: ["Community", "Customers"],
        frequency: "Daily",
        cost: "Low"
      },
      {
        name: "Newsletters",
        usage: 50,
        inclusivity: 65,
        effectiveness: 60,
        stakeholders: ["Employees", "Community"],
        frequency: "Monthly",
        cost: "Low"
      }
    ],
    stakeholders: [
      { name: "Employees", engagement: 75, satisfaction: 70 },
      { name: "Management", engagement: 85, satisfaction: 80 },
      { name: "Investors", engagement: 60, satisfaction: 65 },
      { name: "Partners", engagement: 55, satisfaction: 60 },
      { name: "Community", engagement: 40, satisfaction: 45 },
      { name: "Customers", engagement: 50, satisfaction: 55 }
    ]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([
    {
      category: "Inclusive Decision Making",
      current: "Top-down decision making with limited stakeholder input",
      recommendation: "Implement participatory decision-making processes with regular stakeholder forums",
      impact: "High",
      effort: "Medium",
      timeline: "6-12 months"
    },
    {
      category: "Communication Channels",
      current: "Email-heavy communication with limited face-to-face interaction",
      recommendation: "Diversify channels with more interactive and inclusive formats",
      impact: "Medium",
      effort: "Low",
      timeline: "3-6 months"
    },
    {
      category: "Stakeholder Engagement",
      current: "Low engagement with community and customer stakeholders",
      recommendation: "Create dedicated engagement programs for external stakeholders",
      impact: "High",
      effort: "Medium",
      timeline: "6-12 months"
    },
    {
      category: "Feedback Mechanisms",
      current: "Limited feedback collection and response systems",
      recommendation: "Implement comprehensive feedback loops with regular response cycles",
      impact: "Medium",
      effort: "Low",
      timeline: "3-6 months"
    }
  ]);

  const steps = [
    { id: 1, title: "Channel Assessment", description: "Analyze current communication channels" },
    { id: 2, title: "Stakeholder Mapping", description: "Map stakeholder engagement and needs" },
    { id: 3, title: "Optimization Strategy", description: "Develop inclusive communication strategy" },
    { id: 4, title: "Implementation Plan", description: "Create action roadmap" }
  ];

  const handleChannelChange = (channelIndex: number, property: string, value: number) => {
    setCommunicationData(prev => ({
      ...prev,
      channels: prev.channels.map((channel, index) => 
        index === channelIndex 
          ? { ...channel, [property]: value }
          : channel
      )
    }));
  };

  const handleStakeholderChange = (stakeholderIndex: number, property: string, value: number) => {
    setCommunicationData(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.map((stakeholder, index) => 
        index === stakeholderIndex 
          ? { ...stakeholder, [property]: value }
          : stakeholder
      )
    }));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const avgInclusivity = communicationData.channels.reduce((sum, channel) => sum + channel.inclusivity, 0) / communicationData.channels.length;
      const avgEffectiveness = communicationData.channels.reduce((sum, channel) => sum + channel.effectiveness, 0) / communicationData.channels.length;
      const avgStakeholderEngagement = communicationData.stakeholders.reduce((sum, stakeholder) => sum + stakeholder.engagement, 0) / communicationData.stakeholders.length;

      // Calculate optimization score (0-100)
      const optimizationScore = Math.min(100, 
        (avgInclusivity * 0.4) + 
        (avgEffectiveness * 0.3) + 
        (avgStakeholderEngagement * 0.3)
      );

      // Determine optimization level
      let optimizationLevel = "Needs Improvement";
      let optimizationColor = "text-red-600";
      let recommendations = [];

      if (optimizationScore >= 80) {
        optimizationLevel = "Excellent";
        optimizationColor = "text-green-600";
        recommendations = [
          "Maintain current communication practices",
          "Consider expanding to new channels",
          "Document best practices for others"
        ];
      } else if (optimizationScore >= 60) {
        optimizationLevel = "Good";
        optimizationColor = "text-blue-600";
        recommendations = [
          "Increase inclusivity of existing channels",
          "Improve stakeholder engagement",
          "Add more interactive formats"
        ];
      } else if (optimizationScore >= 40) {
        optimizationLevel = "Moderate";
        optimizationColor = "text-yellow-600";
        recommendations = [
          "Implement stakeholder forums",
          "Create digital collaboration platforms",
          "Establish feedback mechanisms"
        ];
      } else {
        optimizationLevel = "Needs Improvement";
        optimizationColor = "text-red-600";
        recommendations = [
          "Develop comprehensive communication strategy",
          "Build stakeholder engagement programs",
          "Create inclusive decision-making processes"
        ];
      }

      setAnalysisResults({
        optimizationScore,
        optimizationLevel,
        optimizationColor,
        recommendations,
        metrics: {
          avgInclusivity,
          avgEffectiveness,
          avgStakeholderEngagement
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setCommunicationData({
      channels: [
        {
          name: "Email",
          usage: 85,
          inclusivity: 70,
          effectiveness: 75,
          stakeholders: ["Employees", "Investors", "Partners"],
          frequency: "Daily",
          cost: "Low"
        },
        {
          name: "Team Meetings",
          usage: 60,
          inclusivity: 80,
          effectiveness: 85,
          stakeholders: ["Employees", "Management"],
          frequency: "Weekly",
          cost: "Medium"
        },
        {
          name: "Video Calls",
          usage: 70,
          inclusivity: 75,
          effectiveness: 80,
          stakeholders: ["Employees", "Remote Teams", "Partners"],
          frequency: "Weekly",
          cost: "Low"
        },
        {
          name: "Town Halls",
          usage: 30,
          inclusivity: 90,
          effectiveness: 85,
          stakeholders: ["All Stakeholders"],
          frequency: "Monthly",
          cost: "Medium"
        },
        {
          name: "Social Media",
          usage: 40,
          inclusivity: 60,
          effectiveness: 50,
          stakeholders: ["Community", "Customers"],
          frequency: "Daily",
          cost: "Low"
        },
        {
          name: "Newsletters",
          usage: 50,
          inclusivity: 65,
          effectiveness: 60,
          stakeholders: ["Employees", "Community"],
          frequency: "Monthly",
          cost: "Low"
        }
      ],
      stakeholders: [
        { name: "Employees", engagement: 75, satisfaction: 70 },
        { name: "Management", engagement: 85, satisfaction: 80 },
        { name: "Investors", engagement: 60, satisfaction: 65 },
        { name: "Partners", engagement: 55, satisfaction: 60 },
        { name: "Community", engagement: 40, satisfaction: 45 },
        { name: "Customers", engagement: 50, satisfaction: 55 }
      ]
    });
    setAnalysisResults(null);
  };

  const renderChannelAssessment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Communication Channel Analysis</span>
          </CardTitle>
          <CardDescription>
            Current usage, inclusivity, and effectiveness of communication channels
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communicationData.channels.map((channel, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{channel.name}</CardTitle>
                <Badge variant="outline">{channel.frequency}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Usage</span>
                    <span>{channel.usage}%</span>
                  </div>
                  <Slider
                    value={[channel.usage]}
                    onValueChange={(value) => handleChannelChange(index, 'usage', value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Inclusivity</span>
                    <span>{channel.inclusivity}%</span>
                  </div>
                  <Slider
                    value={[channel.inclusivity]}
                    onValueChange={(value) => handleChannelChange(index, 'inclusivity', value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Effectiveness</span>
                    <span>{channel.effectiveness}%</span>
                  </div>
                  <Slider
                    value={[channel.effectiveness]}
                    onValueChange={(value) => handleChannelChange(index, 'effectiveness', value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Stakeholders:</h4>
                <div className="flex flex-wrap gap-1">
                  {channel.stakeholders.map((stakeholder, sIndex) => (
                    <Badge key={sIndex} variant="secondary" className="text-xs">
                      {stakeholder}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Cost: <Badge variant="outline" className="text-xs">{channel.cost}</Badge></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStakeholderMapping = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Stakeholder Engagement Analysis</span>
          </CardTitle>
          <CardDescription>
            Current engagement levels and satisfaction of different stakeholder groups
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communicationData.stakeholders.map((stakeholder, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement</span>
                  <span>{stakeholder.engagement}%</span>
                </div>
                <Progress value={stakeholder.engagement} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Satisfaction</span>
                  <span>{stakeholder.satisfaction}%</span>
                </div>
                <Progress value={stakeholder.satisfaction} className="h-2" />
              </div>
              
              <div className="text-sm text-gray-600">
                {stakeholder.engagement < 60 && (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>Needs improvement</span>
                  </div>
                )}
                {stakeholder.engagement >= 60 && stakeholder.engagement < 80 && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Good</span>
                  </div>
                )}
                {stakeholder.engagement >= 80 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Excellent</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Strengths:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Strong internal communication channels</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Good management engagement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Effective team meeting structure</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Areas for Improvement:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Low community engagement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Limited customer communication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Need for more inclusive decision-making</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <Button 
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2"
              style={{ backgroundColor: 'rgb(30, 58, 138)' }}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>Run Analysis</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetAnalysis}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Optimization Score</h3>
                <div className="text-3xl font-bold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                  {analysisResults.optimizationScore.toFixed(1)}%
                </div>
                <div className={`text-lg font-semibold mb-4 ${analysisResults.optimizationColor}`}>
                  {analysisResults.optimizationLevel}
                </div>
                <Progress value={analysisResults.optimizationScore} className="h-3" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Inclusivity:</span>
                    <span className="font-semibold">{analysisResults.metrics.avgInclusivity.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Effectiveness:</span>
                    <span className="font-semibold">{analysisResults.metrics.avgEffectiveness.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stakeholder Engagement:</span>
                    <span className="font-semibold">{analysisResults.metrics.avgStakeholderEngagement.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <div className="space-y-2">
                {analysisResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderOptimizationStrategy = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Optimization Recommendations</span>
          </CardTitle>
          <CardDescription>
            Strategic recommendations for improving inclusive communication and decision-making
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {optimizationRecommendations.map((recommendation, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{recommendation.category}</CardTitle>
                <Badge 
                  variant={recommendation.impact === 'High' ? 'default' : 'secondary'}
                  className={recommendation.impact === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {recommendation.impact} Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-1">Current State:</h4>
                <p className="text-sm">{recommendation.current}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-1">Recommendation:</h4>
                <p className="text-sm">{recommendation.recommendation}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span>Effort:</span>
                  <Badge variant="outline" className="text-xs">
                    {recommendation.effort}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Timeline:</span>
                  <Badge variant="outline" className="text-xs">
                    {recommendation.timeline}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Communication Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Stakeholder Forums",
                description: "Regular forums for all stakeholders to discuss decisions",
                inclusivity: 95,
                frequency: "Quarterly"
              },
              {
                name: "Digital Collaboration Platform",
                description: "Online platform for inclusive decision-making",
                inclusivity: 90,
                frequency: "Continuous"
              },
              {
                name: "Community Advisory Board",
                description: "Representative board for community input",
                inclusivity: 85,
                frequency: "Monthly"
              },
              {
                name: "Customer Feedback Sessions",
                description: "Regular sessions to gather customer input",
                inclusivity: 80,
                frequency: "Monthly"
              },
              {
                name: "Transparency Reports",
                description: "Regular reports on decisions and their impact",
                inclusivity: 75,
                frequency: "Quarterly"
              },
              {
                name: "Open Innovation Platform",
                description: "Platform for collaborative problem-solving",
                inclusivity: 85,
                frequency: "Continuous"
              }
            ].map((channel, index) => (
              <Card key={index} className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{channel.name}</CardTitle>
                  <CardDescription className="text-sm">{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Inclusivity</span>
                        <span>{channel.inclusivity}%</span>
                      </div>
                      <Progress value={channel.inclusivity} className="h-2" />
                    </div>
                    <div className="text-sm text-gray-600">
                      Frequency: {channel.frequency}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderImplementationPlan = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Implementation Roadmap</span>
          </CardTitle>
          <CardDescription>
            Step-by-step plan to implement inclusive communication and decision-making
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {[
          {
            phase: "Phase 1: Foundation (Months 1-3)",
            tasks: [
              "Establish communication audit and baseline metrics",
              "Create stakeholder engagement strategy",
              "Develop inclusive decision-making framework",
              "Set up feedback collection systems"
            ]
          },
          {
            phase: "Phase 2: Channel Development (Months 4-6)",
            tasks: [
              "Launch stakeholder forums and advisory boards",
              "Implement digital collaboration platform",
              "Create transparency reporting system",
              "Establish community engagement programs"
            ]
          },
          {
            phase: "Phase 3: Optimization (Months 7-12)",
            tasks: [
              "Monitor and optimize new channels",
              "Expand successful programs",
              "Develop advanced decision-making processes",
              "Create long-term sustainability plan"
            ]
          }
        ].map((phase, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{phase.phase}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Users className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Communication Channel Optimizer
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Map and optimize communication channels for inclusive decision-making across all stakeholders. 
          Identify opportunities to improve engagement and create more inclusive processes.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id}
              </div>
              <div className="ml-3">
                <div className="font-semibold">{step.title}</div>
                <div className="text-sm text-gray-600">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 mx-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {currentStep === 1 && renderChannelAssessment()}
        {currentStep === 2 && renderStakeholderMapping()}
        {currentStep === 3 && renderOptimizationStrategy()}
        {currentStep === 4 && renderImplementationPlan()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <Button
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          style={{ backgroundColor: 'rgb(30, 58, 138)' }}
        >
          {currentStep === steps.length ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default CommunicationOptimizer; 