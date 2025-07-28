import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator,
  TrendingUp,
  Users,
  Building,
  Lightbulb,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw
} from "lucide-react";

const WealthAnalyzer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wealthData, setWealthData] = useState({
    shares: {
      totalValue: 10000000,
      ownership: {
        founders: 60,
        investors: 25,
        employees: 10,
        community: 5
      }
    },
    ip: {
      totalValue: 5000000,
      distribution: {
        patents: 40,
        trademarks: 25,
        copyrights: 20,
        tradeSecrets: 15
      }
    },
    assets: {
      totalValue: 8000000,
      distribution: {
        physical: 35,
        financial: 30,
        digital: 20,
        human: 15
      }
    },
    revenue: {
      totalValue: 15000000,
      distribution: {
        productSales: 50,
        services: 30,
        licensing: 15,
        other: 5
      }
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const [sharingRecommendations, setSharingRecommendations] = useState([
    {
      category: "Share Ownership",
      current: "60% founders, 25% investors, 10% employees, 5% community",
      recommendation: "Implement employee stock ownership plan (ESOP) to increase employee ownership to 20%",
      impact: "High",
      effort: "Medium",
      timeline: "12-18 months"
    },
    {
      category: "IP Sharing",
      current: "100% company owned",
      recommendation: "Create IP sharing program with 10% of IP value shared with creators and community",
      impact: "Medium",
      effort: "High",
      timeline: "6-12 months"
    },
    {
      category: "Asset Distribution",
      current: "100% company controlled",
      recommendation: "Establish community asset fund with 5% of physical assets for community use",
      impact: "Medium",
      effort: "Low",
      timeline: "3-6 months"
    },
    {
      category: "Revenue Sharing",
      current: "100% company retained",
      recommendation: "Implement 5% revenue sharing with employees and 2% with community partners",
      impact: "High",
      effort: "Medium",
      timeline: "6-12 months"
    }
  ]);

  const steps = [
    { id: 1, title: "Wealth Assessment", description: "Analyze current wealth distribution" },
    { id: 2, title: "Sharing Opportunities", description: "Identify potential sharing models" },
    { id: 3, title: "Impact Analysis", description: "Evaluate sharing impact" },
    { id: 4, title: "Implementation Plan", description: "Create action roadmap" }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateTotalWealth = () => {
    return wealthData.shares.totalValue + wealthData.ip.totalValue + 
           wealthData.assets.totalValue + wealthData.revenue.totalValue;
  };

  const handleWealthChange = (category: string, subcategory: string, value: number) => {
    if (category === 'shares' && subcategory === 'totalValue') {
      setWealthData(prev => ({
        ...prev,
        shares: { ...prev.shares, totalValue: value }
      }));
    } else if (category === 'ip' && subcategory === 'totalValue') {
      setWealthData(prev => ({
        ...prev,
        ip: { ...prev.ip, totalValue: value }
      }));
    } else if (category === 'assets' && subcategory === 'totalValue') {
      setWealthData(prev => ({
        ...prev,
        assets: { ...prev.assets, totalValue: value }
      }));
    } else if (category === 'revenue' && subcategory === 'totalValue') {
      setWealthData(prev => ({
        ...prev,
        revenue: { ...prev.revenue, totalValue: value }
      }));
    }
  };

  const handleOwnershipChange = (stakeholder: string, value: number) => {
    setWealthData(prev => ({
      ...prev,
      shares: {
        ...prev.shares,
        ownership: {
          ...prev.shares.ownership,
          [stakeholder]: value
        }
      }
    }));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const totalWealth = calculateTotalWealth();
      const employeeOwnership = wealthData.shares.ownership.employees;
      const communityInvolvement = wealthData.shares.ownership.community;
      const ipSharing = 0; // Currently 0% IP sharing
      const revenueSharing = 0; // Currently 0% revenue sharing

      // Calculate sharing score (0-100)
      const sharingScore = Math.min(100, 
        (employeeOwnership * 0.4) + 
        (communityInvolvement * 0.3) + 
        (ipSharing * 0.2) + 
        (revenueSharing * 0.1)
      );

      // Determine analysis level
      let analysisLevel = "Low Sharing";
      let analysisColor = "text-red-600";
      let recommendations = [];

      if (sharingScore >= 80) {
        analysisLevel = "Excellent Sharing";
        analysisColor = "text-green-600";
        recommendations = [
          "Maintain current sharing practices",
          "Consider expanding to new stakeholders",
          "Document best practices for others"
        ];
      } else if (sharingScore >= 60) {
        analysisLevel = "Good Sharing";
        analysisColor = "text-blue-600";
        recommendations = [
          "Increase IP sharing with creators",
          "Implement revenue sharing programs",
          "Expand community involvement"
        ];
      } else if (sharingScore >= 40) {
        analysisLevel = "Moderate Sharing";
        analysisColor = "text-yellow-600";
        recommendations = [
          "Implement employee stock ownership plan",
          "Create IP sharing framework",
          "Establish community partnerships"
        ];
      } else {
        analysisLevel = "Low Sharing";
        analysisColor = "text-red-600";
        recommendations = [
          "Start with employee ownership programs",
          "Develop IP sharing policies",
          "Build community engagement programs"
        ];
      }

      setAnalysisResults({
        totalWealth,
        sharingScore,
        analysisLevel,
        analysisColor,
        recommendations,
        metrics: {
          employeeOwnership,
          communityInvolvement,
          ipSharing,
          revenueSharing
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setWealthData({
      shares: {
        totalValue: 10000000,
        ownership: {
          founders: 60,
          investors: 25,
          employees: 10,
          community: 5
        }
      },
      ip: {
        totalValue: 5000000,
        distribution: {
          patents: 40,
          trademarks: 25,
          copyrights: 20,
          tradeSecrets: 15
        }
      },
      assets: {
        totalValue: 8000000,
        distribution: {
          physical: 35,
          financial: 30,
          digital: 20,
          human: 15
        }
      },
      revenue: {
        totalValue: 15000000,
        distribution: {
          productSales: 50,
          services: 30,
          licensing: 15,
          other: 5
        }
      }
    });
    setAnalysisResults(null);
  };

  const renderWealthDistribution = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Shares</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              {formatCurrency(wealthData.shares.totalValue)}
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Total Value</label>
              <Slider
                value={[wealthData.shares.totalValue]}
                onValueChange={(value) => handleWealthChange('shares', 'totalValue', value[0])}
                max={50000000}
                min={1000000}
                step={100000}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Founders</span>
                  <span>{wealthData.shares.ownership.founders}%</span>
                </div>
                <Slider
                  value={[wealthData.shares.ownership.founders]}
                  onValueChange={(value) => handleOwnershipChange('founders', value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Investors</span>
                  <span>{wealthData.shares.ownership.investors}%</span>
                </div>
                <Slider
                  value={[wealthData.shares.ownership.investors]}
                  onValueChange={(value) => handleOwnershipChange('investors', value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Employees</span>
                  <span>{wealthData.shares.ownership.employees}%</span>
                </div>
                <Slider
                  value={[wealthData.shares.ownership.employees]}
                  onValueChange={(value) => handleOwnershipChange('employees', value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Community</span>
                  <span>{wealthData.shares.ownership.community}%</span>
                </div>
                <Slider
                  value={[wealthData.shares.ownership.community]}
                  onValueChange={(value) => handleOwnershipChange('community', value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Intellectual Property</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatCurrency(wealthData.ip.totalValue)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Patents</span>
                <span>{wealthData.ip.distribution.patents}%</span>
              </div>
              <Progress value={wealthData.ip.distribution.patents} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Trademarks</span>
                <span>{wealthData.ip.distribution.trademarks}%</span>
              </div>
              <Progress value={wealthData.ip.distribution.trademarks} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Copyrights</span>
                <span>{wealthData.ip.distribution.copyrights}%</span>
              </div>
              <Progress value={wealthData.ip.distribution.copyrights} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Trade Secrets</span>
                <span>{wealthData.ip.distribution.tradeSecrets}%</span>
              </div>
              <Progress value={wealthData.ip.distribution.tradeSecrets} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Assets</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {formatCurrency(wealthData.assets.totalValue)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Physical</span>
                <span>{wealthData.assets.distribution.physical}%</span>
              </div>
              <Progress value={wealthData.assets.distribution.physical} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Financial</span>
                <span>{wealthData.assets.distribution.financial}%</span>
              </div>
              <Progress value={wealthData.assets.distribution.financial} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Digital</span>
                <span>{wealthData.assets.distribution.digital}%</span>
              </div>
              <Progress value={wealthData.assets.distribution.digital} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Human</span>
                <span>{wealthData.assets.distribution.human}%</span>
              </div>
              <Progress value={wealthData.assets.distribution.human} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {formatCurrency(wealthData.revenue.totalValue)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Product Sales</span>
                <span>{wealthData.revenue.distribution.productSales}%</span>
              </div>
              <Progress value={wealthData.revenue.distribution.productSales} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Services</span>
                <span>{wealthData.revenue.distribution.services}%</span>
              </div>
              <Progress value={wealthData.revenue.distribution.services} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Licensing</span>
                <span>{wealthData.revenue.distribution.licensing}%</span>
              </div>
              <Progress value={wealthData.revenue.distribution.licensing} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>Other</span>
                <span>{wealthData.revenue.distribution.other}%</span>
              </div>
              <Progress value={wealthData.revenue.distribution.other} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Total Wealth Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center mb-4">
            {formatCurrency(calculateTotalWealth())}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {((wealthData.shares.totalValue / calculateTotalWealth()) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Shares</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">
                {((wealthData.ip.totalValue / calculateTotalWealth()) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">IP</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-600">
                {((wealthData.assets.totalValue / calculateTotalWealth()) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Assets</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {((wealthData.revenue.totalValue / calculateTotalWealth()) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Revenue</div>
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
                <h3 className="text-lg font-semibold mb-4">Sharing Score</h3>
                <div className="text-3xl font-bold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                  {analysisResults.sharingScore.toFixed(1)}%
                </div>
                <div className={`text-lg font-semibold mb-4 ${analysisResults.analysisColor}`}>
                  {analysisResults.analysisLevel}
                </div>
                <Progress value={analysisResults.sharingScore} className="h-3" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Employee Ownership:</span>
                    <span className="font-semibold">{analysisResults.metrics.employeeOwnership}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Involvement:</span>
                    <span className="font-semibold">{analysisResults.metrics.communityInvolvement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP Sharing:</span>
                    <span className="font-semibold">{analysisResults.metrics.ipSharing}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Sharing:</span>
                    <span className="font-semibold">{analysisResults.metrics.revenueSharing}%</span>
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

  const renderSharingRecommendations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Sharing Opportunities</span>
          </CardTitle>
          <CardDescription>
            Based on your current wealth distribution, here are recommended sharing strategies
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sharingRecommendations.map((recommendation, index) => (
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
    </div>
  );

  const renderImpactAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Sharing Impact Analysis</span>
          </CardTitle>
          <CardDescription>
            Projected impact of implementing sharing recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">+25%</div>
              <div className="text-sm text-gray-600">Employee Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">+15%</div>
              <div className="text-sm text-gray-600">Community Impact</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">+30%</div>
              <div className="text-sm text-gray-600">Innovation Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Increased employee retention and motivation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Enhanced community relationships</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Improved innovation and creativity</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Better stakeholder alignment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Enhanced brand reputation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Legal and regulatory compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Tax implications of wealth sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Administrative complexity</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Stakeholder resistance</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Implementation timeline</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderImplementationPlan = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Implementation Roadmap</span>
          </CardTitle>
          <CardDescription>
            Step-by-step plan to implement wealth sharing recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {[
          {
            phase: "Phase 1: Foundation (Months 1-3)",
            tasks: [
              "Conduct stakeholder analysis and engagement",
              "Develop legal framework for wealth sharing",
              "Create communication strategy",
              "Establish baseline metrics"
            ]
          },
          {
            phase: "Phase 2: Pilot Programs (Months 4-9)",
            tasks: [
              "Launch employee stock ownership pilot",
              "Implement revenue sharing program",
              "Test IP sharing models",
              "Monitor and adjust based on feedback"
            ]
          },
          {
            phase: "Phase 3: Scale & Optimize (Months 10-18)",
            tasks: [
              "Expand successful pilot programs",
              "Implement community asset sharing",
              "Optimize sharing models based on data",
              "Develop long-term sustainability plan"
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
          <Calculator className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Wealth Distribution Analyzer
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Analyze all aspects of your company's wealth including shares, IP, assets, and revenue. 
          Identify opportunities for better wealth sharing across stakeholders.
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
        {currentStep === 1 && renderWealthDistribution()}
        {currentStep === 2 && renderSharingRecommendations()}
        {currentStep === 3 && renderImpactAnalysis()}
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

export default WealthAnalyzer; 