import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Users,
  PieChart,
  TrendingUp,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Target,
  Building,
  Globe
} from "lucide-react";

interface Stakeholder {
  id: string;
  name: string;
  category: string;
  currentWealth: number;
  potentialWealth: number;
  influence: number;
  engagement: number;
  sharingOpportunities: string[];
}

const StakeholderMapping = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: "founders",
      name: "Founders",
      category: "Leadership",
      currentWealth: 6000000,
      potentialWealth: 8000000,
      influence: 90,
      engagement: 85,
      sharingOpportunities: ["Employee stock options", "Community investment fund"]
    },
    {
      id: "employees",
      name: "Employees",
      category: "Internal",
      currentWealth: 1000000,
      potentialWealth: 3000000,
      influence: 60,
      engagement: 70,
      sharingOpportunities: ["ESOP program", "Profit sharing", "Performance bonuses"]
    },
    {
      id: "investors",
      name: "Investors",
      category: "Financial",
      currentWealth: 2500000,
      potentialWealth: 3500000,
      influence: 80,
      engagement: 75,
      sharingOpportunities: ["Impact investment focus", "Community returns"]
    },
    {
      id: "customers",
      name: "Customers",
      category: "External",
      currentWealth: 500000,
      potentialWealth: 1500000,
      influence: 50,
      engagement: 40,
      sharingOpportunities: ["Customer ownership program", "Loyalty rewards"]
    },
    {
      id: "community",
      name: "Local Community",
      category: "External",
      currentWealth: 200000,
      potentialWealth: 800000,
      influence: 40,
      engagement: 30,
      sharingOpportunities: ["Community investment fund", "Local partnerships"]
    },
    {
      id: "suppliers",
      name: "Suppliers",
      category: "Partners",
      currentWealth: 300000,
      potentialWealth: 700000,
      influence: 45,
      engagement: 55,
      sharingOpportunities: ["Supplier equity program", "Shared value creation"]
    }
  ]);

  const steps = [
    { id: 1, title: "Stakeholder Mapping", description: "Map current wealth distribution" },
    { id: 2, title: "Opportunity Analysis", description: "Identify sharing opportunities" },
    { id: 3, title: "Implementation Strategy", description: "Create action plan" }
  ];

  const handleStakeholderChange = (stakeholderId: string, property: string, value: number) => {
    setStakeholders(prev => prev.map(stakeholder => 
      stakeholder.id === stakeholderId 
        ? { ...stakeholder, [property]: value }
        : stakeholder
    ));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const totalCurrentWealth = stakeholders.reduce((sum, s) => sum + s.currentWealth, 0);
      const totalPotentialWealth = stakeholders.reduce((sum, s) => sum + s.potentialWealth, 0);
      const avgInfluence = stakeholders.reduce((sum, s) => sum + s.influence, 0) / stakeholders.length;
      const avgEngagement = stakeholders.reduce((sum, s) => sum + s.engagement, 0) / stakeholders.length;

      // Calculate sharing potential score
      const sharingPotential = Math.min(100, 
        ((totalPotentialWealth - totalCurrentWealth) / totalCurrentWealth) * 50 +
        (avgEngagement * 0.3) +
        (avgInfluence * 0.2)
      );

      // Identify top opportunities
      const opportunities = stakeholders
        .map(s => ({
          stakeholder: s.name,
          opportunity: (s.potentialWealth - s.currentWealth) / s.currentWealth * 100,
          influence: s.influence,
          engagement: s.engagement
        }))
        .sort((a, b) => b.opportunity - a.opportunity)
        .slice(0, 3);

      // Determine strategy level
      let strategyLevel = "Basic Sharing";
      let strategyColor = "text-red-600";
      let recommendations = [];

      if (sharingPotential >= 80) {
        strategyLevel = "Advanced Sharing";
        strategyColor = "text-green-600";
        recommendations = [
          "Implement comprehensive wealth sharing program",
          "Create stakeholder governance structures",
          "Develop long-term partnership models"
        ];
      } else if (sharingPotential >= 60) {
        strategyLevel = "Moderate Sharing";
        strategyColor = "text-blue-600";
        recommendations = [
          "Focus on high-impact stakeholder groups",
          "Implement pilot sharing programs",
          "Build stakeholder engagement platforms"
        ];
      } else if (sharingPotential >= 40) {
        strategyLevel = "Basic Sharing";
        strategyColor = "text-yellow-600";
        recommendations = [
          "Start with employee ownership programs",
          "Develop community engagement initiatives",
          "Create stakeholder communication channels"
        ];
      } else {
        strategyLevel = "Limited Sharing";
        strategyColor = "text-red-600";
        recommendations = [
          "Build stakeholder relationships first",
          "Develop sharing framework",
          "Create engagement programs"
        ];
      }

      setAnalysisResults({
        sharingPotential,
        strategyLevel,
        strategyColor,
        recommendations,
        opportunities,
        metrics: {
          totalCurrentWealth,
          totalPotentialWealth,
          wealthIncrease: ((totalPotentialWealth - totalCurrentWealth) / totalCurrentWealth) * 100,
          avgInfluence,
          avgEngagement
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetMapping = () => {
    setStakeholders([
      {
        id: "founders",
        name: "Founders",
        category: "Leadership",
        currentWealth: 6000000,
        potentialWealth: 8000000,
        influence: 90,
        engagement: 85,
        sharingOpportunities: ["Employee stock options", "Community investment fund"]
      },
      {
        id: "employees",
        name: "Employees",
        category: "Internal",
        currentWealth: 1000000,
        potentialWealth: 3000000,
        influence: 60,
        engagement: 70,
        sharingOpportunities: ["ESOP program", "Profit sharing", "Performance bonuses"]
      },
      {
        id: "investors",
        name: "Investors",
        category: "Financial",
        currentWealth: 2500000,
        potentialWealth: 3500000,
        influence: 80,
        engagement: 75,
        sharingOpportunities: ["Impact investment focus", "Community returns"]
      },
      {
        id: "customers",
        name: "Customers",
        category: "External",
        currentWealth: 500000,
        potentialWealth: 1500000,
        influence: 50,
        engagement: 40,
        sharingOpportunities: ["Customer ownership program", "Loyalty rewards"]
      },
      {
        id: "community",
        name: "Local Community",
        category: "External",
        currentWealth: 200000,
        potentialWealth: 800000,
        influence: 40,
        engagement: 30,
        sharingOpportunities: ["Community investment fund", "Local partnerships"]
      },
      {
        id: "suppliers",
        name: "Suppliers",
        category: "Partners",
        currentWealth: 300000,
        potentialWealth: 700000,
        influence: 45,
        engagement: 55,
        sharingOpportunities: ["Supplier equity program", "Shared value creation"]
      }
    ]);
    setAnalysisResults(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderStakeholderMapping = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Stakeholder Wealth Distribution</span>
          </CardTitle>
          <CardDescription>
            Map current wealth distribution and potential sharing opportunities across all stakeholders
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholders.map((stakeholder) => (
          <Card key={stakeholder.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                <Badge variant="outline">{stakeholder.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Current Wealth: {formatCurrency(stakeholder.currentWealth)}
                </label>
                <Slider
                  value={[stakeholder.currentWealth]}
                  onValueChange={(value) => handleStakeholderChange(stakeholder.id, 'currentWealth', value[0])}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Potential Wealth: {formatCurrency(stakeholder.potentialWealth)}
                </label>
                <Slider
                  value={[stakeholder.potentialWealth]}
                  onValueChange={(value) => handleStakeholderChange(stakeholder.id, 'potentialWealth', value[0])}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Influence: {stakeholder.influence}%
                </label>
                <Slider
                  value={[stakeholder.influence]}
                  onValueChange={(value) => handleStakeholderChange(stakeholder.id, 'influence', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Engagement: {stakeholder.engagement}%
                </label>
                <Slider
                  value={[stakeholder.engagement]}
                  onValueChange={(value) => handleStakeholderChange(stakeholder.id, 'engagement', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Sharing Opportunities:</h4>
                <div className="space-y-1">
                  {stakeholder.sharingOpportunities.map((opportunity, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      • {opportunity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Growth Potential:</span>
                  <span className="font-semibold text-green-600">
                    {((stakeholder.potentialWealth - stakeholder.currentWealth) / stakeholder.currentWealth * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
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
          onClick={resetMapping}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );

  const renderOpportunityAnalysis = () => (
    <div className="space-y-6">
      {analysisResults && (
        <>
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Sharing Potential Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                    {analysisResults.sharingPotential.toFixed(1)}%
                  </div>
                  <div className={`text-lg font-semibold mb-4 ${analysisResults.strategyColor}`}>
                    {analysisResults.strategyLevel}
                  </div>
                  <Progress value={analysisResults.sharingPotential} className="h-3" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Current Wealth:</span>
                      <span className="font-semibold">{formatCurrency(analysisResults.metrics.totalCurrentWealth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Potential Wealth:</span>
                      <span className="font-semibold">{formatCurrency(analysisResults.metrics.totalPotentialWealth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wealth Increase Potential:</span>
                      <span className="font-semibold text-green-600">
                        {analysisResults.metrics.wealthIncrease.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Influence:</span>
                      <span className="font-semibold">{analysisResults.metrics.avgInfluence.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Engagement:</span>
                      <span className="font-semibold">{analysisResults.metrics.avgEngagement.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Sharing Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.opportunities.map((opp: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold text-lg">{opp.stakeholder}</div>
                      <div className="text-sm text-gray-600">
                        Growth Potential: {opp.opportunity.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="text-sm text-gray-600">Influence</div>
                          <div className="font-semibold">{opp.influence}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Engagement</div>
                          <div className="font-semibold">{opp.engagement}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderImplementationStrategy = () => (
    <div className="space-y-6">
      {analysisResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Implementation Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phase 1: Foundation (Months 1-3)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Stakeholder engagement assessment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Develop sharing framework</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Create communication strategy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phase 2: Implementation (Months 4-12)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Launch pilot programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Establish governance structures</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Monitor and adjust programs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <PieChart className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Stakeholder Wealth Mapping
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Map wealth distribution across all stakeholders and identify sharing opportunities. 
          Analyze current wealth allocation and potential for more equitable distribution.
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
        {currentStep === 1 && renderStakeholderMapping()}
        {currentStep === 2 && renderOpportunityAnalysis()}
        {currentStep === 3 && renderImplementationStrategy()}
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
          disabled={currentStep === steps.length || (currentStep === 1 && !analysisResults)}
          style={{ backgroundColor: 'rgb(30, 58, 138)' }}
        >
          {currentStep === steps.length ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default StakeholderMapping; 