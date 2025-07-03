import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Trash2, Plus, BookOpen } from "lucide-react";

interface Component {
  id: string;
  name: string;
  category: "creation" | "decision" | "value";
  description: string;
  benefits: string[];
}

const ModelConfigurator = () => {
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const [activeCategory, setActiveCategory] = useState<"creation" | "decision" | "value">("creation");

  const componentLibrary: Component[] = [
    // Shared Wealth Creation
    {
      id: "esop",
      name: "Employee Stock Ownership Plan (ESOP)",
      category: "creation",
      description: "Traditional employee ownership through stock allocation",
      benefits: ["Direct ownership stake", "Aligned incentives", "Retention tool"]
    },
    {
      id: "phantom-shares",
      name: "Phantom Share Program",
      category: "creation",
      description: "Value participation without equity dilution",
      benefits: ["No equity dilution", "Flexible structure", "Performance-based"]
    },
    {
      id: "profit-sharing",
      name: "Profit Sharing Pool",
      category: "creation",
      description: "Systematic distribution of company profits",
      benefits: ["Direct profit participation", "Performance motivation", "Transparent rewards"]
    },
    {
      id: "ip-sharing",
      name: "Intellectual Property Sharing",
      category: "creation",
      description: "Revenue sharing from employee-generated innovations",
      benefits: ["Innovation incentive", "Fair value recognition", "Ongoing rewards"]
    },
    {
      id: "revenue-sharing",
      name: "Revenue Sharing Model",
      category: "creation",
      description: "Percentage of revenue distributed to stakeholders",
      benefits: ["Predictable sharing", "Growth alignment", "Simple structure"]
    },

    // Inclusive Decision-Making
    {
      id: "employee-council",
      name: "Employee Representative Council",
      category: "decision",
      description: "Elected employee representatives in governance",
      benefits: ["Democratic representation", "Voice in decisions", "Improved communication"]
    },
    {
      id: "stakeholder-board",
      name: "Multi-Stakeholder Board",
      category: "decision",
      description: "Board representation for various stakeholder groups",
      benefits: ["Diverse perspectives", "Balanced decisions", "Stakeholder alignment"]
    },
    {
      id: "digital-voting",
      name: "Digital Voting Platform",
      category: "decision",
      description: "Technology-enabled democratic decision-making",
      benefits: ["Transparent process", "Easy participation", "Real-time feedback"]
    },
    {
      id: "consensus-building",
      name: "Consensus Building Process",
      category: "decision",
      description: "Structured approach to reaching agreement",
      benefits: ["High buy-in", "Thorough consideration", "Collaborative solutions"]
    },
    {
      id: "advisory-panels",
      name: "Stakeholder Advisory Panels",
      category: "decision",
      description: "Regular consultation with key stakeholder groups",
      benefits: ["Ongoing input", "Specialized expertise", "Relationship building"]
    },

    // Value-Led Approach
    {
      id: "social-audit",
      name: "Annual Social Audit",
      category: "value",
      description: "Independent assessment of social and environmental impact",
      benefits: ["Transparency", "Accountability", "Continuous improvement"]
    },
    {
      id: "mutual-agreements",
      name: "Two-Way Value Agreements",
      category: "value",
      description: "Contracts with mutual obligations and benefits",
      benefits: ["Shared responsibility", "Ethical foundation", "Long-term thinking"]
    },
    {
      id: "impact-metrics",
      name: "Impact Measurement Framework",
      category: "value",
      description: "Systematic tracking of social and environmental outcomes",
      benefits: ["Evidence-based decisions", "Progress tracking", "Stakeholder confidence"]
    },
    {
      id: "ethical-guidelines",
      name: "Comprehensive Ethical Guidelines",
      category: "value",
      description: "Detailed framework for ethical business practices",
      benefits: ["Clear standards", "Decision guidance", "Risk mitigation"]
    },
    {
      id: "community-benefit",
      name: "Community Benefit Requirements",
      category: "value",
      description: "Formal commitments to local community development",
      benefits: ["Social license", "Local support", "Positive impact"]
    }
  ];

  const categories = [
    { id: "creation", name: "Shared Wealth Creation", color: "bg-green text-background" },
    { id: "decision", name: "Inclusive Decision-Making", color: "bg-teal text-background" },
    { id: "value", name: "Value-Led Approach", color: "bg-orange text-background" }
  ];

  const availableComponents = componentLibrary.filter(
    comp => comp.category === activeCategory && !selectedComponents.find(sel => sel.id === comp.id)
  );

  const addComponent = (component: Component) => {
    setSelectedComponents([...selectedComponents, component]);
  };

  const removeComponent = (componentId: string) => {
    setSelectedComponents(selectedComponents.filter(comp => comp.id !== componentId));
  };

  const generateSummary = () => {
    if (selectedComponents.length === 0) return "No components selected yet.";

    const creationComponents = selectedComponents.filter(c => c.category === "creation");
    const decisionComponents = selectedComponents.filter(c => c.category === "decision");
    const valueComponents = selectedComponents.filter(c => c.category === "value");

    let summary = "Your Custom Shared Wealth Model:\n\n";

    if (creationComponents.length > 0) {
      summary += "WEALTH CREATION MECHANISMS:\n";
      creationComponents.forEach(comp => {
        summary += `• ${comp.name}: ${comp.description}\n`;
      });
      summary += "\n";
    }

    if (decisionComponents.length > 0) {
      summary += "DECISION-MAKING STRUCTURES:\n";
      decisionComponents.forEach(comp => {
        summary += `• ${comp.name}: ${comp.description}\n`;
      });
      summary += "\n";
    }

    if (valueComponents.length > 0) {
      summary += "VALUE-LED FRAMEWORKS:\n";
      valueComponents.forEach(comp => {
        summary += `• ${comp.name}: ${comp.description}\n`;
      });
    }

    return summary;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || "bg-muted text-muted-foreground";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-navy">Build Your Shared Wealth Model</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore and combine different mechanisms to create a custom Shared Wealth model tailored to your organization
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Component Library */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Component Library</CardTitle>
              <CardDescription>
                Browse mechanisms organized by the three pillars of Shared Wealth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id as any)}
                    className={activeCategory === category.id ? getCategoryColor(category.id) : ""}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Components Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {availableComponents.map(component => (
                  <Card key={component.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-navy">{component.name}</CardTitle>
                          <Badge className={`mt-1 ${getCategoryColor(component.category)}`} variant="secondary">
                            {categories.find(c => c.id === component.category)?.name}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addComponent(component)}
                          className="ml-2"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{component.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-navy">Key Benefits:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {component.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {availableComponents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>All components from this category have been added to your model.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Components & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Your Model</CardTitle>
              <CardDescription>
                Selected components ({selectedComponents.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedComponents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Add components from the library to build your model</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedComponents.map(component => (
                    <div key={component.id} className="flex items-start justify-between p-3 bg-gradient-subtle rounded-md">
                      <div className="flex-1">
                        <p className="font-medium text-navy text-sm">{component.name}</p>
                        <Badge className={`mt-1 text-xs ${getCategoryColor(component.category)}`} variant="secondary">
                          {categories.find(c => c.id === component.category)?.name}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeComponent(component.id)}
                        className="ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Summary */}
          {selectedComponents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Model Summary</CardTitle>
                <CardDescription>
                  Your custom Shared Wealth framework
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-subtle rounded-md">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {generateSummary()}
                  </pre>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="green" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Model Summary
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Get Implementation Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelConfigurator;