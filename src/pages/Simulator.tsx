import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Users, 
  Building,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Target
} from "lucide-react";

interface GovernanceModel {
  id: string;
  name: string;
  description: string;
  employeeParticipation: number;
  decisionSpeed: number;
  stakeholderInfluence: number;
  implementationComplexity: number;
  cost: number;
  benefits: string[];
  challenges: string[];
}

const Simulator = () => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const governanceModels: GovernanceModel[] = [
    {
      id: "consensus",
      name: "Consensus-Based",
      description: "All stakeholders must agree on major decisions",
      employeeParticipation: 95,
      decisionSpeed: 30,
      stakeholderInfluence: 90,
      implementationComplexity: 80,
      cost: 70,
      benefits: ["High employee satisfaction", "Inclusive decision-making", "Strong buy-in"],
      challenges: ["Slow decision-making", "Complex implementation", "Potential gridlock"]
    },
    {
      id: "representative",
      name: "Representative Democracy",
      description: "Elected representatives make decisions on behalf of stakeholders",
      employeeParticipation: 75,
      decisionSpeed: 60,
      stakeholderInfluence: 70,
      implementationComplexity: 50,
      cost: 50,
      benefits: ["Balanced representation", "Reasonable speed", "Scalable"],
      challenges: ["Potential disconnect", "Election complexity", "Representation gaps"]
    },
    {
      id: "advisory",
      name: "Advisory Council",
      description: "Stakeholder council advises leadership on key decisions",
      employeeParticipation: 60,
      decisionSpeed: 70,
      stakeholderInfluence: 50,
      implementationComplexity: 40,
      cost: 30,
      benefits: ["Quick implementation", "Leadership control", "Stakeholder input"],
      challenges: ["Limited influence", "Token participation", "Leadership dependency"]
    },
    {
      id: "hybrid",
      name: "Hybrid Model",
      description: "Combines multiple approaches for different decision types",
      employeeParticipation: 80,
      decisionSpeed: 55,
      stakeholderInfluence: 75,
      implementationComplexity: 65,
      cost: 60,
      benefits: ["Flexible approach", "Balanced outcomes", "Adaptable"],
      challenges: ["Complex design", "Clear boundaries needed", "Training required"]
    }
  ];

  const companySizes = [
    { value: "small", label: "Small (1-50 employees)", factor: 1.2 },
    { value: "medium", label: "Medium (51-200 employees)", factor: 1.0 },
    { value: "large", label: "Large (201-1000 employees)", factor: 0.8 },
    { value: "enterprise", label: "Enterprise (1000+ employees)", factor: 0.6 }
  ];

  const industries = [
    { value: "tech", label: "Technology", factor: 1.1 },
    { value: "manufacturing", label: "Manufacturing", factor: 0.9 },
    { value: "services", label: "Services", factor: 1.0 },
    { value: "finance", label: "Financial Services", factor: 0.8 },
    { value: "healthcare", label: "Healthcare", factor: 0.9 },
    { value: "education", label: "Education", factor: 1.2 }
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const model = governanceModels.find(m => m.id === selectedModel);
      const sizeFactor = companySizes.find(s => s.value === companySize)?.factor || 1.0;
      const industryFactor = industries.find(i => i.value === industry)?.factor || 1.0;
      
      if (!model) return;

      // Calculate adjusted metrics
      const adjustedParticipation = Math.min(100, model.employeeParticipation * sizeFactor);
      const adjustedSpeed = Math.max(10, model.decisionSpeed * industryFactor);
      const adjustedComplexity = Math.min(100, model.implementationComplexity * sizeFactor);
      const adjustedCost = Math.min(100, model.cost * sizeFactor);

      // Calculate overall score
      const overallScore = (
        (adjustedParticipation * 0.3) +
        (adjustedSpeed * 0.2) +
        (model.stakeholderInfluence * 0.25) +
        ((100 - adjustedComplexity) * 0.15) +
        ((100 - adjustedCost) * 0.1)
      );

      // Determine recommendation
      let recommendation = "Consider alternative models";
      let recommendationColor = "text-red-600";
      
      if (overallScore >= 80) {
        recommendation = "Excellent fit - Recommended";
        recommendationColor = "text-green-600";
      } else if (overallScore >= 65) {
        recommendation = "Good fit - Recommended with modifications";
        recommendationColor = "text-yellow-600";
      } else if (overallScore >= 50) {
        recommendation = "Moderate fit - Consider carefully";
        recommendationColor = "text-orange-600";
      }

      setResults({
        model,
        adjustedParticipation,
        adjustedSpeed,
        adjustedComplexity,
        adjustedCost,
        overallScore,
        recommendation,
        recommendationColor,
        sizeFactor,
        industryFactor
      });
      setIsSimulating(false);
    }, 1500);
  };

  const resetSimulator = () => {
    setSelectedModel("");
    setCompanySize("");
    setIndustry("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-violet-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <Settings className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Governance Simulator</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Simulate different governance scenarios and decision-making processes for your organization.
          </p>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navy">
                    <Settings className="w-5 h-5 mr-2" />
                    Simulation Parameters
                  </CardTitle>
                  <CardDescription>
                    Configure your organization's characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Governance Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a governance model" />
                      </SelectTrigger>
                      <SelectContent>
                        {governanceModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Size</label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={runSimulation} 
                    disabled={!selectedModel || !companySize || !industry || isSimulating}
                    className="w-full"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Model Details */}
              {selectedModel && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-navy">Model Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const model = governanceModels.find(m => m.id === selectedModel);
                      if (!model) return null;
                      
                      return (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                          
                          <div>
                            <h4 className="font-medium mb-2">Benefits:</h4>
                            <ul className="space-y-1">
                              {model.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Challenges:</h4>
                            <ul className="space-y-1">
                              {model.challenges.map((challenge, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  {/* Overall Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Simulation Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${results.recommendationColor}`}>
                          {results.overallScore.toFixed(0)}%
                        </div>
                        <div className={`text-xl font-medium ${results.recommendationColor}`}>
                          {results.recommendation}
                        </div>
                      </div>
                      
                      <Progress value={results.overallScore} className="w-full" />
                    </CardContent>
                  </Card>

                  {/* Metrics Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Employee Participation</span>
                          <span className="text-sm font-bold">{results.adjustedParticipation.toFixed(0)}%</span>
                        </div>
                        <Progress value={results.adjustedParticipation} className="w-full" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Decision Speed</span>
                          <span className="text-sm font-bold">{results.adjustedSpeed.toFixed(0)}%</span>
                        </div>
                        <Progress value={results.adjustedSpeed} className="w-full" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Stakeholder Influence</span>
                          <span className="text-sm font-bold">{results.model.stakeholderInfluence}%</span>
                        </div>
                        <Progress value={results.model.stakeholderInfluence} className="w-full" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Implementation Complexity</span>
                          <span className="text-sm font-bold">{results.adjustedComplexity.toFixed(0)}%</span>
                        </div>
                        <Progress value={results.adjustedComplexity} className="w-full" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cost</span>
                          <span className="text-sm font-bold">{results.adjustedCost.toFixed(0)}%</span>
                        </div>
                        <Progress value={results.adjustedCost} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Implementation Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Start with pilot programs</div>
                            <div className="text-sm text-muted-foreground">Test the model with a small group first</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Users className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Train all stakeholders</div>
                            <div className="text-sm text-muted-foreground">Ensure everyone understands the process</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Monitor and adjust</div>
                            <div className="text-sm text-muted-foreground">Regularly evaluate and refine the approach</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-navy mb-2">Ready to Simulate?</h3>
                    <p className="text-muted-foreground">
                      Select your parameters and run the simulation to see how different governance models would perform in your organization.
                    </p>
                  </CardContent>
                </Card>
              )}

              {results && (
                <div className="flex justify-center">
                  <Button onClick={resetSimulator} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Simulation
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Simulator;