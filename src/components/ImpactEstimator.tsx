import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Heart, Calculator, AlertCircle, Leaf, Target, Zap, BarChart3 } from "lucide-react";

const ImpactEstimator = () => {
  const [inputs, setInputs] = useState({
    revenue: 1000000,
    employees: 50,
    profitMargin: 15,
    sharePercentage: 10,
    industry: "technology",
    companyAge: 5,
    currentTurnover: 15
  });
  
  const [results, setResults] = useState({
    sharedValue: 0,
    productivityIncrease: 0,
    retentionBenefit: 0,
    socialImpactRating: "Moderate",
    environmentalImpact: 0,
    stakeholderSatisfaction: 0,
    totalROI: 0,
    paybackPeriod: 0
  });

  const industries = [
    { value: "technology", label: "Technology", multiplier: 1.2 },
    { value: "manufacturing", label: "Manufacturing", multiplier: 1.0 },
    { value: "healthcare", label: "Healthcare", multiplier: 1.1 },
    { value: "finance", label: "Finance", multiplier: 1.3 },
    { value: "retail", label: "Retail", multiplier: 0.9 },
    { value: "education", label: "Education", multiplier: 1.0 }
  ];

  useEffect(() => {
    calculateImpact();
  }, [inputs]);

  const calculateImpact = () => {
    const { revenue, employees, profitMargin, sharePercentage, industry, companyAge, currentTurnover } = inputs;
    
    // Get industry multiplier
    const industryMultiplier = industries.find(i => i.value === industry)?.multiplier || 1.0;
    
    // Calculate estimated shared profit
    const annualProfit = revenue * (profitMargin / 100);
    const sharedValue = annualProfit * (sharePercentage / 100);
    
    // Enhanced productivity calculation with industry and company age factors
    const baseProductivityMultiplier = 0.02 + (sharePercentage / 100) * 0.03;
    const adjustedMultiplier = baseProductivityMultiplier * industryMultiplier * (1 + companyAge * 0.02);
    const productivityIncrease = revenue * adjustedMultiplier;
    
    // Enhanced retention benefit calculation
    const avgSalaryCost = revenue / employees * 0.3;
    const turnoverReduction = Math.min(sharePercentage / 5, 25); // Max 25% reduction
    const retentionBenefit = (avgSalaryCost * 0.3) * (turnoverReduction / 100) * employees;
    
    // Environmental impact (reduced waste, better resource utilization)
    const environmentalImpact = revenue * 0.005 * (sharePercentage / 10);
    
    // Stakeholder satisfaction score (0-100)
    const stakeholderSatisfaction = Math.min(50 + (sharePercentage * 2) + (companyAge * 2), 95);
    
    // Total ROI calculation
    const totalBenefits = productivityIncrease + retentionBenefit + environmentalImpact;
    const totalROI = ((totalBenefits - sharedValue) / sharedValue) * 100;
    
    // Payback period (months)
    const paybackPeriod = sharedValue > 0 ? (sharedValue / (totalBenefits / 12)) : 0;
    
    // Social impact rating
    let socialImpactRating = "Low";
    if (sharePercentage >= 20) socialImpactRating = "Excellent";
    else if (sharePercentage >= 15) socialImpactRating = "High";
    else if (sharePercentage >= 10) socialImpactRating = "Moderate";
    else if (sharePercentage >= 5) socialImpactRating = "Basic";
    
    setResults({
      sharedValue,
      productivityIncrease,
      retentionBenefit,
      socialImpactRating,
      environmentalImpact,
      stakeholderSatisfaction,
      totalROI,
      paybackPeriod
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Excellent": return "bg-green text-background";
      case "High": return "bg-teal text-background";
      case "Moderate": return "bg-orange text-background";
      case "Basic": return "bg-navy text-background";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return "text-green";
    if (roi >= 100) return "text-teal";
    if (roi >= 50) return "text-orange";
    return "text-red";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-navy">Advanced Shared Wealth Impact Estimator</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get comprehensive insights into the potential financial, social, and environmental impact of implementing shared wealth practices
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-navy">
              <Calculator className="w-5 h-5 mr-2" />
              Company Information
            </CardTitle>
            <CardDescription>
                  Enter your company details for personalized impact analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue</Label>
              <Input
                id="revenue"
                type="number"
                value={inputs.revenue}
                onChange={(e) => setInputs({...inputs, revenue: Number(e.target.value)})}
                placeholder="1000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees</Label>
              <Input
                id="employees"
                type="number"
                value={inputs.employees}
                onChange={(e) => setInputs({...inputs, employees: Number(e.target.value)})}
                placeholder="50"
              />
            </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={inputs.industry} onValueChange={(value) => setInputs({...inputs, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-age">Company Age (Years)</Label>
                  <Input
                    id="company-age"
                    type="number"
                    value={inputs.companyAge}
                    onChange={(e) => setInputs({...inputs, companyAge: Number(e.target.value)})}
                    placeholder="5"
                  />
                </div>
            
            <div className="space-y-2">
              <Label htmlFor="profit-margin">Current Profit Margin (%)</Label>
              <Input
                id="profit-margin"
                type="number"
                value={inputs.profitMargin}
                onChange={(e) => setInputs({...inputs, profitMargin: Number(e.target.value)})}
                placeholder="15"
              />
            </div>

                <div className="space-y-2">
                  <Label htmlFor="turnover">Current Annual Turnover Rate (%)</Label>
                  <Input
                    id="turnover"
                    type="number"
                    value={inputs.currentTurnover}
                    onChange={(e) => setInputs({...inputs, currentTurnover: Number(e.target.value)})}
                    placeholder="15"
                  />
                </div>
            
            <div className="space-y-4">
              <Label>Desired % of Profit/Value to Share: {inputs.sharePercentage}%</Label>
              <Slider
                value={[inputs.sharePercentage]}
                onValueChange={(value) => setInputs({...inputs, sharePercentage: value[0]})}
                    max={30}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5%</span>
                    <span>30%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-navy">
              <TrendingUp className="w-5 h-5 mr-2" />
              Estimated Impact
            </CardTitle>
            <CardDescription>
              Projected benefits of implementing shared wealth practices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green" />
                <div className="text-2xl font-bold text-navy">{formatCurrency(results.sharedValue)}</div>
                <div className="text-sm text-muted-foreground">Value Shared Annually</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-teal" />
                <div className="text-2xl font-bold text-navy">{formatCurrency(results.productivityIncrease)}</div>
                <div className="text-sm text-muted-foreground">Productivity Boost</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-orange" />
                <div className="text-2xl font-bold text-navy">{formatCurrency(results.retentionBenefit)}</div>
                <div className="text-sm text-muted-foreground">Retention Savings</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                    <Leaf className="w-8 h-8 mx-auto mb-2 text-green" />
                    <div className="text-2xl font-bold text-navy">{formatCurrency(results.environmentalImpact)}</div>
                    <div className="text-sm text-muted-foreground">Environmental Value</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stakeholder Satisfaction</span>
                    <span className="text-sm font-bold">{results.stakeholderSatisfaction.toFixed(0)}/100</span>
                  </div>
                  <Progress value={results.stakeholderSatisfaction} className="w-full" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total ROI</span>
                    <span className={`text-sm font-bold ${getROIColor(results.totalROI)}`}>
                      {formatPercentage(results.totalROI)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payback Period</span>
                    <span className="text-sm font-bold">{results.paybackPeriod.toFixed(1)} months</span>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-semibold text-navy">Key Benefits Summary:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Estimated {formatPercentage((results.productivityIncrease / inputs.revenue) * 100)} increase in productivity</li>
                    <li>• Potential {formatPercentage(Math.min(inputs.sharePercentage / 5, 25))} reduction in employee turnover</li>
                    <li>• {formatPercentage((results.environmentalImpact / inputs.revenue) * 100)} of revenue in environmental value creation</li>
                    <li>• {results.stakeholderSatisfaction.toFixed(0)}/100 stakeholder satisfaction score</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Financial Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Investment (Shared Value)</span>
                    <span className="text-sm font-bold">{formatCurrency(results.sharedValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Productivity Gains</span>
                    <span className="text-sm font-bold text-green">{formatCurrency(results.productivityIncrease)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Retention Savings</span>
                    <span className="text-sm font-bold text-teal">{formatCurrency(results.retentionBenefit)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-semibold">Net Benefit</span>
                    <span className="text-sm font-bold text-green">
                      {formatCurrency(results.productivityIncrease + results.retentionBenefit - results.sharedValue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <Heart className="w-5 h-5 mr-2" />
                  Social Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className={`text-lg px-4 py-2 ${getRatingColor(results.socialImpactRating)}`}>
                    {results.socialImpactRating}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Stakeholder Satisfaction</span>
                    <span className="text-sm font-bold">{results.stakeholderSatisfaction.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Employee Engagement</span>
                    <span className="text-sm font-bold">+{(results.stakeholderSatisfaction * 0.8).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Community Trust</span>
                    <span className="text-sm font-bold">+{(results.stakeholderSatisfaction * 0.6).toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <Target className="w-5 h-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">ROI</span>
                    <span className={`text-sm font-bold ${getROIColor(results.totalROI)}`}>
                      {formatPercentage(results.totalROI)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payback Period</span>
                    <span className="text-sm font-bold">{results.paybackPeriod.toFixed(1)} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Environmental Value</span>
                    <span className="text-sm font-bold text-green">{formatCurrency(results.environmentalImpact)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Efficiency Gain</span>
                    <span className="text-sm font-bold text-teal">
                      {formatPercentage((results.productivityIncrease / inputs.revenue) * 100)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <Zap className="w-5 h-5 mr-2" />
                Implementation Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-navy mb-3">Immediate Actions (0-3 months)</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Establish stakeholder advisory council</li>
                    <li>• Design profit-sharing framework</li>
                    <li>• Implement transparent reporting system</li>
                    <li>• Launch employee education program</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-3">Medium-term Goals (3-12 months)</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Launch first profit-sharing distribution</li>
                    <li>• Establish governance platform</li>
                    <li>• Measure and report initial impact</li>
                    <li>• Expand to supplier partnerships</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Disclaimer and CTA */}
      <Card className="bg-gradient-subtle">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <AlertCircle className="w-5 h-5 text-orange mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong>Important Disclaimer:</strong> These calculations provide illustrative estimates based on industry research and benchmarks. 
              Actual results will vary depending on your specific business model, implementation approach, and market conditions. 
              These figures are for planning purposes only and should not be considered guaranteed outcomes.
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg">
              Get Customized Financial Projection
            </Button>
            <Button variant="outline" size="lg">
              Schedule Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactEstimator;