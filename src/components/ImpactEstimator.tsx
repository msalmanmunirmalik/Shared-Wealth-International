import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Heart, Calculator, AlertCircle } from "lucide-react";

const ImpactEstimator = () => {
  const [inputs, setInputs] = useState({
    revenue: 1000000,
    employees: 50,
    profitMargin: 15,
    sharePercentage: 10
  });
  
  const [results, setResults] = useState({
    sharedValue: 0,
    productivityIncrease: 0,
    retentionBenefit: 0,
    socialImpactRating: "Moderate"
  });

  useEffect(() => {
    calculateImpact();
  }, [inputs]);

  const calculateImpact = () => {
    const { revenue, employees, profitMargin, sharePercentage } = inputs;
    
    // Calculate estimated shared profit
    const annualProfit = revenue * (profitMargin / 100);
    const sharedValue = annualProfit * (sharePercentage / 100);
    
    // Estimate productivity increase (2-5% based on sharing percentage)
    const productivityMultiplier = 0.02 + (sharePercentage / 100) * 0.03;
    const productivityIncrease = revenue * productivityMultiplier;
    
    // Estimate retention benefit (reduced turnover costs)
    const avgSalaryCost = revenue / employees * 0.3; // Rough estimate
    const turnoverReduction = Math.min(sharePercentage / 5, 20); // Max 20% reduction
    const retentionBenefit = (avgSalaryCost * 0.3) * (turnoverReduction / 100) * employees;
    
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
      socialImpactRating
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-navy">Shared Wealth Impact Estimator</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get a data-driven glimpse into the potential benefits of implementing shared wealth practices in your organization
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-navy">
              <Calculator className="w-5 h-5 mr-2" />
              Company Information
            </CardTitle>
            <CardDescription>
              Enter your company details to calculate potential impact
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
              <Label htmlFor="profit-margin">Current Profit Margin (%)</Label>
              <Input
                id="profit-margin"
                type="number"
                value={inputs.profitMargin}
                onChange={(e) => setInputs({...inputs, profitMargin: Number(e.target.value)})}
                placeholder="15"
              />
            </div>
            
            <div className="space-y-4">
              <Label>Desired % of Profit/Value to Share: {inputs.sharePercentage}%</Label>
              <Slider
                value={[inputs.sharePercentage]}
                onValueChange={(value) => setInputs({...inputs, sharePercentage: value[0]})}
                max={25}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5%</span>
                <span>25%</span>
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
                <Heart className="w-8 h-8 mx-auto mb-2 text-navy" />
                <Badge className={`text-sm ${getRatingColor(results.socialImpactRating)}`}>
                  {results.socialImpactRating}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">Social Impact Rating</div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-semibold text-navy">Key Benefits Summary:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Estimated {formatPercentage((results.productivityIncrease / inputs.revenue) * 100)} increase in productivity</li>
                <li>• Potential {formatPercentage(Math.min(inputs.sharePercentage / 5, 20))} reduction in employee turnover</li>
                <li>• Enhanced stakeholder engagement and loyalty</li>
                <li>• Improved company reputation and competitive advantage</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

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