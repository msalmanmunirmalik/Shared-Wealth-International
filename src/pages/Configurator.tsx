import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Target,
  CheckCircle,
  Settings,
  Save,
  Download,
  RefreshCw
} from "lucide-react";

interface ModelComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  weight: number;
  cost: number;
  impact: number;
}

const Configurator = () => {
  const [modelName, setModelName] = useState("");
  const [components, setComponents] = useState<ModelComponent[]>([
    // Profit Sharing
    {
      id: "profit_sharing",
      name: "Profit Sharing",
      description: "Share company profits with employees",
      category: "Financial",
      enabled: true,
      weight: 15,
      cost: 15,
      impact: 85
    },
    {
      id: "phantom_shares",
      name: "Phantom Shares",
      description: "Virtual equity participation without ownership",
      category: "Financial",
      enabled: false,
      weight: 10,
      cost: 20,
      impact: 90
    },
    {
      id: "employee_ownership",
      name: "Employee Ownership",
      description: "Direct ownership through ESOP or similar",
      category: "Financial",
      enabled: false,
      weight: 25,
      cost: 40,
      impact: 95
    },
    // Governance
    {
      id: "participatory_governance",
      name: "Participatory Governance",
      description: "Employee involvement in decision-making",
      category: "Governance",
      enabled: true,
      weight: 20,
      cost: 10,
      impact: 75
    },
    {
      id: "board_representation",
      name: "Board Representation",
      description: "Employee representation on board",
      category: "Governance",
      enabled: false,
      weight: 15,
      cost: 15,
      impact: 80
    },
    {
      id: "voting_rights",
      name: "Voting Rights",
      description: "Employee voting on key decisions",
      category: "Governance",
      enabled: false,
      weight: 10,
      cost: 5,
      impact: 70
    },
    // Community
    {
      id: "community_investment",
      name: "Community Investment",
      description: "Invest profits in local community",
      category: "Community",
      enabled: true,
      weight: 10,
      cost: 10,
      impact: 65
    },
    {
      id: "stakeholder_engagement",
      name: "Stakeholder Engagement",
      description: "Regular engagement with all stakeholders",
      category: "Community",
      enabled: false,
      weight: 5,
      cost: 5,
      impact: 60
    },
    {
      id: "sustainability_focus",
      name: "Sustainability Focus",
      description: "Environmental and social responsibility",
      category: "Community",
      enabled: false,
      weight: 10,
      cost: 15,
      impact: 70
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModel, setGeneratedModel] = useState<any>(null);

  const toggleComponent = (id: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, enabled: !comp.enabled } : comp
    ));
  };

  const updateWeight = (id: string, value: number[]) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, weight: value[0] } : comp
    ));
  };

  const generateModel = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const enabledComponents = components.filter(comp => comp.enabled);
      const totalWeight = enabledComponents.reduce((sum, comp) => sum + comp.weight, 0);
      const totalCost = enabledComponents.reduce((sum, comp) => sum + comp.cost, 0);
      const averageImpact = enabledComponents.reduce((sum, comp) => sum + comp.impact, 0) / enabledComponents.length;
      
      // Calculate complexity score
      const complexity = Math.min(100, enabledComponents.length * 15 + totalWeight * 0.5);
      
      // Calculate implementation timeline
      const timeline = Math.max(3, Math.ceil(totalCost / 10));
      
      // Generate recommendations
      const recommendations = [];
      if (totalCost > 50) {
        recommendations.push("Consider implementing in phases to manage costs");
      }
      if (complexity > 70) {
        recommendations.push("High complexity - ensure adequate training and support");
      }
      if (enabledComponents.length < 3) {
        recommendations.push("Consider adding more components for comprehensive impact");
      }
      if (averageImpact < 70) {
        recommendations.push("Focus on high-impact components for better results");
      }

      setGeneratedModel({
        name: modelName || "Custom Shared Wealth Model",
        components: enabledComponents,
        totalWeight,
        totalCost,
        averageImpact,
        complexity,
        timeline,
        recommendations,
        categories: [...new Set(enabledComponents.map(comp => comp.category))]
      });
      setIsGenerating(false);
    }, 1500);
  };

  const resetConfigurator = () => {
    setModelName("");
    setComponents(prev => prev.map(comp => ({ ...comp, enabled: false, weight: 10 })));
    setGeneratedModel(null);
  };

  const categories = ["Financial", "Governance", "Community"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Model Configurator</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Design your custom shared wealth model with interactive components and real-time analysis.
          </p>
        </div>
      </section>

      {/* Configurator Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-navy">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Model Configuration
                  </CardTitle>
                  <CardDescription>
                    Customize your shared wealth model components
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="modelName">Model Name</Label>
                    <Input
                      id="modelName"
                      placeholder="Enter your model name"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                    />
                  </div>

                  {categories.map(category => (
                    <div key={category} className="space-y-4">
                      <h3 className="font-semibold text-navy">{category} Components</h3>
                      {components
                        .filter(comp => comp.category === category)
                        .map(component => (
                          <Card key={component.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Switch
                                  checked={component.enabled}
                                  onCheckedChange={() => toggleComponent(component.id)}
                                />
                                <div>
                                  <div className="font-medium">{component.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {component.description}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {component.cost}% cost
                              </Badge>
                            </div>
                            
                            {component.enabled && (
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Weight: {component.weight}%</span>
                                    <span>Impact: {component.impact}%</span>
                                  </div>
                                  <Slider
                                    value={[component.weight]}
                                    onValueChange={(value) => updateWeight(component.id, value)}
                                    max={50}
                                    min={5}
                                    step={5}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                    </div>
                  ))}

                  <Button 
                    onClick={generateModel} 
                    disabled={!modelName || components.filter(c => c.enabled).length === 0 || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating Model...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {generatedModel ? (
                <>
                  {/* Model Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">{generatedModel.name}</CardTitle>
                      <CardDescription>
                        Your custom shared wealth model configuration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {generatedModel.totalCost}%
                          </div>
                          <div className="text-sm text-muted-foreground">Total Cost</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {generatedModel.averageImpact.toFixed(0)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Avg Impact</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {generatedModel.timeline} months
                        </div>
                        <div className="text-sm text-muted-foreground">Implementation Timeline</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Component Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Selected Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedModel.components.map((comp: ModelComponent) => (
                          <div key={comp.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{comp.name}</div>
                              <div className="text-sm text-muted-foreground">{comp.description}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{comp.weight}%</div>
                              <div className="text-sm text-muted-foreground">weight</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-navy">Implementation Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedModel.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">{rec}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Model
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-navy mb-2">Configure Your Model</h3>
                    <p className="text-muted-foreground">
                      Select components, adjust weights, and generate your custom shared wealth model.
                    </p>
                  </CardContent>
                </Card>
              )}

              {generatedModel && (
                <div className="flex justify-center">
                  <Button onClick={resetConfigurator} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Over
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

export default Configurator;