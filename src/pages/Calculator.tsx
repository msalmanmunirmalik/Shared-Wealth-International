import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator as CalculatorIcon, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  ArrowRight,
  RefreshCw
} from "lucide-react";

const Calculator = () => {
  const [formData, setFormData] = useState({
    companySize: '',
    currentProfit: '',
    profitSharingPercentage: '',
    employeeCount: '',
    communityInvestment: ''
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateImpact = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const size = parseInt(formData.companySize) || 0;
      const profit = parseInt(formData.currentProfit) || 0;
      const sharing = parseInt(formData.profitSharingPercentage) || 0;
      const employees = parseInt(formData.employeeCount) || 0;
      const community = parseInt(formData.communityInvestment) || 0;

      const sharedProfit = (profit * sharing) / 100;
      const perEmployee = employees > 0 ? sharedProfit / employees : 0;
      const totalInvestment = sharedProfit + community;
      const roi = profit > 0 ? (totalInvestment / profit) * 100 : 0;

      setResults({
        sharedProfit,
        perEmployee,
        totalInvestment,
        roi,
        employeeEngagement: Math.min(95, 60 + (sharing * 0.5)),
        communityImpact: Math.min(90, 50 + (community / profit * 100)),
        retentionRate: Math.min(98, 85 + (sharing * 0.3))
      });
      setIsCalculating(false);
    }, 1500);
  };

  const resetCalculator = () => {
    setFormData({
      companySize: '',
      currentProfit: '',
      profitSharingPercentage: '',
      employeeCount: '',
      communityInvestment: ''
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <CalculatorIcon className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Impact Calculator</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Calculate the potential benefits and ROI of implementing shared wealth practices in your organization.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <CalculatorIcon className="w-5 h-5 mr-2" />
                  Organization Details
                </CardTitle>
                <CardDescription>
                  Enter your organization's information to calculate potential impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companySize">Company Size (Revenue $M)</Label>
                    <Input
                      id="companySize"
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentProfit">Annual Profit ($K)</Label>
                    <Input
                      id="currentProfit"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.currentProfit}
                      onChange={(e) => handleInputChange('currentProfit', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profitSharingPercentage">Profit Sharing %</Label>
                    <Input
                      id="profitSharingPercentage"
                      type="number"
                      placeholder="e.g., 15"
                      value={formData.profitSharingPercentage}
                      onChange={(e) => handleInputChange('profitSharingPercentage', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.employeeCount}
                      onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="communityInvestment">Community Investment ($K)</Label>
                  <Input
                    id="communityInvestment"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.communityInvestment}
                    onChange={(e) => handleInputChange('communityInvestment', e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={calculateImpact} 
                    disabled={isCalculating}
                    className="flex-1"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <CalculatorIcon className="w-4 h-4 mr-2" />
                        Calculate Impact
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetCalculator}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  {/* Key Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Impact Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ${results.sharedProfit.toLocaleString()}K
                          </div>
                          <div className="text-sm text-muted-foreground">Shared Profit</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${results.perEmployee.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Per Employee</div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.roi.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">ROI on Investment</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Impact Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Employee Engagement</span>
                          <span className="text-sm font-bold">{results.employeeEngagement.toFixed(1)}%</span>
                        </div>
                        <Progress value={results.employeeEngagement} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Community Impact</span>
                          <span className="text-sm font-bold">{results.communityImpact.toFixed(1)}%</span>
                        </div>
                        <Progress value={results.communityImpact} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Retention Rate</span>
                          <span className="text-sm font-bold">{results.retentionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={results.retentionRate} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Start with 10-15% profit sharing</div>
                            <div className="text-sm text-muted-foreground">Gradual implementation reduces risk</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Include all employees</div>
                            <div className="text-sm text-muted-foreground">Universal participation increases engagement</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Measure and communicate impact</div>
                            <div className="text-sm text-muted-foreground">Regular reporting builds trust and momentum</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <CalculatorIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-navy mb-2">Ready to Calculate?</h3>
                    <p className="text-muted-foreground">
                      Fill in your organization's details and click "Calculate Impact" to see the potential benefits.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculator;