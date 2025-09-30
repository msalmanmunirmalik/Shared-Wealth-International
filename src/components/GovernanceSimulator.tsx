import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Building, Heart, Zap, Clock, TrendingUp } from "lucide-react";

const GovernanceSimulator = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [selectedDecision, setSelectedDecision] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const scenarios = [
    {
      id: "product-launch",
      title: "New Product Launch",
      description: "Your company is considering launching a new product line that requires significant investment and will affect all stakeholders.",
      context: "The product has potential for high returns but also carries risks. Different stakeholders have varying perspectives on priorities and approach."
    },
    {
      id: "market-challenge",
      title: "Market Challenge Response",
      description: "Your industry is facing disruption from new competitors and changing customer preferences.",
      context: "Quick adaptation is needed, but the response strategy will impact jobs, investments, and company direction significantly."
    },
    {
      id: "policy-implementation",
      title: "New Workplace Policy",
      description: "Implementing a new flexible working policy that will affect productivity, culture, and employee satisfaction.",
      context: "The policy could improve work-life balance but may create operational challenges and require new management approaches."
    }
  ];

  const decisions = {
    "product-launch": [
      { id: "aggressive", text: "Aggressive Launch - High investment, fast timeline" },
      { id: "cautious", text: "Cautious Approach - Pilot testing, gradual rollout" },
      { id: "innovative", text: "Innovative Partnership - Collaborate with external partners" }
    ],
    "market-challenge": [
      { id: "pivot", text: "Strategic Pivot - Change business model significantly" },
      { id: "compete", text: "Direct Competition - Improve existing offerings" },
      { id: "differentiate", text: "Market Differentiation - Focus on unique value proposition" }
    ],
    "policy-implementation": [
      { id: "immediate", text: "Immediate Implementation - Roll out to all employees" },
      { id: "phased", text: "Phased Approach - Department by department" },
      { id: "voluntary", text: "Voluntary Adoption - Optional participation initially" }
    ]
  };

  const governanceModels = [
    {
      id: "top-down",
      name: "Top-Down",
      description: "Leadership makes decisions with minimal stakeholder input"
    },
    {
      id: "consultative",
      name: "Consultative",
      description: "Leadership seeks input but retains final decision authority"
    },
    {
      id: "collaborative",
      name: "Collaborative",
      description: "Stakeholders work together to develop solutions"
    },
    {
      id: "democratic",
      name: "Democratic",
      description: "Stakeholders vote on decisions with majority rule"
    },
    {
      id: "consensus",
      name: "Consensus-Driven",
      description: "All stakeholders must agree before proceeding"
    }
  ];

  const stakeholders = [
    { id: "employees", name: "Employees", icon: Users, color: "text-green" },
    { id: "management", name: "Management", icon: Building, color: "text-navy" },
    { id: "customers", name: "Customers", icon: Heart, color: "text-teal" },
    { id: "community", name: "Community", icon: Users, color: "text-orange" },
    { id: "investors", name: "Investors", icon: TrendingUp, color: "text-purple-600" }
  ];

  const getOutcomes = () => {
    if (!selectedScenario || !selectedDecision || !selectedModel) return null;

    // Simplified outcome logic - in reality this would be more sophisticated
    const outcomes: Record<string, { morale: string; satisfaction: string; speed: string; explanation: string }> = {
      "top-down": {
        morale: "Low",
        satisfaction: "Low", 
        speed: "Fast",
        explanation: "Quick decisions but stakeholders feel excluded, leading to resistance and low buy-in."
      },
      "consultative": {
        morale: "Medium",
        satisfaction: "Medium",
        speed: "Medium",
        explanation: "Stakeholders appreciate being heard, though some may feel their input isn't fully valued."
      },
      "collaborative": {
        morale: "High",
        satisfaction: "High",
        speed: "Medium",
        explanation: "Strong stakeholder engagement and ownership, with good balance of input and efficiency."
      },
      "democratic": {
        morale: "High",
        satisfaction: "High",
        speed: "Slow",
        explanation: "High stakeholder satisfaction but decision-making can be slower due to voting processes."
      },
      "consensus": {
        morale: "Medium",
        satisfaction: "Medium",
        speed: "Very Slow",
        explanation: "While everyone agrees, the process can be lengthy and may lead to compromise solutions."
      }
    };

    return outcomes[selectedModel];
  };

  const getScoreColor = (score: string) => {
    switch (score.toLowerCase()) {
      case "high": return "bg-green text-background";
      case "medium": return "bg-orange text-background";
      case "low": return "bg-red-500 text-background";
      case "fast": return "bg-green text-background";
      case "slow": return "bg-orange text-background";
      case "very slow": return "bg-red-500 text-background";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const runSimulation = () => {
    if (selectedScenario && selectedDecision && selectedModel) {
      setShowResults(true);
    }
  };

  const reset = () => {
    setSelectedScenario("");
    setSelectedDecision("");
    setSelectedModel("");
    setShowResults(false);
  };

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);
  const availableDecisions = selectedScenario ? decisions[selectedScenario as keyof typeof decisions] : [];
  const outcomes = getOutcomes();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-navy">Interactive Governance Simulator</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore how different governance models affect stakeholder outcomes in various business scenarios
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Simulation Setup</CardTitle>
            <CardDescription>
              Choose a scenario, decision, and governance model to see the impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scenario Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-navy">1. Select Business Scenario</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a scenario..." />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedScenarioData && (
                <div className="p-3 bg-gradient-subtle rounded-md">
                  <p className="text-sm text-muted-foreground">{selectedScenarioData.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{selectedScenarioData.context}</p>
                </div>
              )}
            </div>

            {/* Decision Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-navy">2. Choose Decision Option</label>
              <Select value={selectedDecision} onValueChange={setSelectedDecision} disabled={!selectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a decision approach..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDecisions.map(decision => (
                    <SelectItem key={decision.id} value={decision.id}>
                      {decision.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Governance Model Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-navy">3. Select Governance Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose governance approach..." />
                </SelectTrigger>
                <SelectContent>
                  {governanceModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={runSimulation} 
                disabled={!selectedScenario || !selectedDecision || !selectedModel}
                className="flex-1"
                variant="green"
              >
                <Zap className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-navy">Simulation Results</CardTitle>
            <CardDescription>
              Impact analysis for each stakeholder group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResults ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Configure the simulation above to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Outcomes */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Badge className={getScoreColor(outcomes?.morale || "")}>
                      {outcomes?.morale}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Morale</p>
                  </div>
                  <div className="text-center">
                    <Badge className={getScoreColor(outcomes?.satisfaction || "")}>
                      {outcomes?.satisfaction}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <Badge className={getScoreColor(outcomes?.speed || "")}>
                      {outcomes?.speed}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Decision Speed</p>
                  </div>
                </div>

                {/* Stakeholder Impact */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-navy">Stakeholder Impact:</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {stakeholders.map(stakeholder => {
                      const Icon = stakeholder.icon;
                      return (
                        <div key={stakeholder.id} className="flex items-center justify-between p-3 bg-gradient-subtle rounded-md">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 ${stakeholder.color}`} />
                            <span className="font-medium">{stakeholder.name}</span>
                          </div>
                          <Badge className={getScoreColor(outcomes?.satisfaction || "")}>
                            {outcomes?.satisfaction}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 bg-gradient-subtle rounded-md">
                  <h4 className="font-semibold text-navy mb-2">Why This Outcome?</h4>
                  <p className="text-sm text-muted-foreground">{outcomes?.explanation}</p>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Learn How to Implement Inclusive Decision-Making
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernanceSimulator;