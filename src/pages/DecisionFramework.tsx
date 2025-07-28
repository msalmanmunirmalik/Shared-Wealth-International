import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Users,
  Settings,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Lightbulb,
  Vote,
  MessageSquare,
  Globe
} from "lucide-react";

interface DecisionProcess {
  id: string;
  name: string;
  description: string;
  inclusivity: number;
  efficiency: number;
  transparency: number;
  stakeholderInvolvement: string[];
  decisionType: string;
}

const DecisionFramework = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const [decisionProcesses, setDecisionProcesses] = useState<DecisionProcess[]>([
    {
      id: "strategic_decisions",
      name: "Strategic Decisions",
      description: "Major company direction and investment decisions",
      inclusivity: 60,
      efficiency: 70,
      transparency: 65,
      stakeholderInvolvement: ["Board", "Leadership", "Key Employees"],
      decisionType: "Consensus"
    },
    {
      id: "operational_decisions",
      name: "Operational Decisions",
      description: "Day-to-day business operations and processes",
      inclusivity: 75,
      efficiency: 85,
      transparency: 70,
      stakeholderInvolvement: ["Management", "Employees", "Stakeholders"],
      decisionType: "Participatory"
    },
    {
      id: "financial_decisions",
      name: "Financial Decisions",
      description: "Budget allocation and financial planning",
      inclusivity: 45,
      efficiency: 80,
      transparency: 55,
      stakeholderInvolvement: ["Finance Team", "Leadership"],
      decisionType: "Consultative"
    },
    {
      id: "community_decisions",
      name: "Community Decisions",
      description: "Community engagement and social impact",
      inclusivity: 85,
      efficiency: 60,
      transparency: 80,
      stakeholderInvolvement: ["Community", "Employees", "Partners"],
      decisionType: "Democratic"
    }
  ]);

  const [stakeholderGroups] = useState([
    { id: "employees", name: "Employees", weight: 30 },
    { id: "customers", name: "Customers", weight: 20 },
    { id: "community", name: "Community", weight: 15 },
    { id: "investors", name: "Investors", weight: 15 },
    { id: "suppliers", name: "Suppliers", weight: 10 },
    { id: "partners", name: "Partners", weight: 10 }
  ]);

  const steps = [
    { id: 1, title: "Process Design", description: "Design decision-making processes" },
    { id: 2, title: "Stakeholder Inclusion", description: "Map stakeholder involvement" },
    { id: 3, title: "Scenario Testing", description: "Test decision scenarios" },
    { id: 4, title: "Implementation Guide", description: "Create action roadmap" }
  ];

  const handleProcessChange = (processId: string, property: string, value: number | string) => {
    setDecisionProcesses(prev => prev.map(process => 
      process.id === processId 
        ? { ...process, [property]: value }
        : process
    ));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const avgInclusivity = decisionProcesses.reduce((sum, p) => sum + p.inclusivity, 0) / decisionProcesses.length;
      const avgEfficiency = decisionProcesses.reduce((sum, p) => sum + p.efficiency, 0) / decisionProcesses.length;
      const avgTransparency = decisionProcesses.reduce((sum, p) => sum + p.transparency, 0) / decisionProcesses.length;

      // Calculate framework score
      const frameworkScore = Math.min(100, 
        (avgInclusivity * 0.4) + 
        (avgEfficiency * 0.3) + 
        (avgTransparency * 0.3)
      );

      // Identify improvement areas
      const improvementAreas = decisionProcesses
        .filter(p => p.inclusivity < 70 || p.transparency < 70)
        .map(p => ({
          process: p.name,
          issues: [
            ...(p.inclusivity < 70 ? ['Low inclusivity'] : []),
            ...(p.transparency < 70 ? ['Low transparency'] : [])
          ]
        }));

      // Determine framework level
      let frameworkLevel = "Basic Framework";
      let frameworkColor = "text-red-600";
      let recommendations = [];

      if (frameworkScore >= 80) {
        frameworkLevel = "Advanced Framework";
        frameworkColor = "text-green-600";
        recommendations = [
          "Maintain current inclusive practices",
          "Document best practices for others",
          "Consider expanding to new decision types"
        ];
      } else if (frameworkScore >= 60) {
        frameworkLevel = "Good Framework";
        frameworkColor = "text-blue-600";
        recommendations = [
          "Improve inclusivity in weak areas",
          "Enhance transparency measures",
          "Expand stakeholder involvement"
        ];
      } else if (frameworkScore >= 40) {
        frameworkLevel = "Basic Framework";
        frameworkColor = "text-yellow-600";
        recommendations = [
          "Implement participatory decision-making",
          "Create transparency protocols",
          "Develop stakeholder engagement programs"
        ];
      } else {
        frameworkLevel = "Limited Framework";
        frameworkColor = "text-red-600";
        recommendations = [
          "Build foundational decision processes",
          "Establish stakeholder communication channels",
          "Create inclusive decision training"
        ];
      }

      setAnalysisResults({
        frameworkScore,
        frameworkLevel,
        frameworkColor,
        recommendations,
        improvementAreas,
        metrics: {
          avgInclusivity,
          avgEfficiency,
          avgTransparency
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetFramework = () => {
    setDecisionProcesses([
      {
        id: "strategic_decisions",
        name: "Strategic Decisions",
        description: "Major company direction and investment decisions",
        inclusivity: 60,
        efficiency: 70,
        transparency: 65,
        stakeholderInvolvement: ["Board", "Leadership", "Key Employees"],
        decisionType: "Consensus"
      },
      {
        id: "operational_decisions",
        name: "Operational Decisions",
        description: "Day-to-day business operations and processes",
        inclusivity: 75,
        efficiency: 85,
        transparency: 70,
        stakeholderInvolvement: ["Management", "Employees", "Stakeholders"],
        decisionType: "Participatory"
      },
      {
        id: "financial_decisions",
        name: "Financial Decisions",
        description: "Budget allocation and financial planning",
        inclusivity: 45,
        efficiency: 80,
        transparency: 55,
        stakeholderInvolvement: ["Finance Team", "Leadership"],
        decisionType: "Consultative"
      },
      {
        id: "community_decisions",
        name: "Community Decisions",
        description: "Community engagement and social impact",
        inclusivity: 85,
        efficiency: 60,
        transparency: 80,
        stakeholderInvolvement: ["Community", "Employees", "Partners"],
        decisionType: "Democratic"
      }
    ]);
    setAnalysisResults(null);
  };

  const renderProcessDesign = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Decision Process Design</span>
          </CardTitle>
          <CardDescription>
            Design and configure inclusive decision-making processes for different types of decisions
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decisionProcesses.map((process) => (
          <Card key={process.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{process.name}</CardTitle>
              <CardDescription>{process.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Inclusivity: {process.inclusivity}%
                </label>
                <Slider
                  value={[process.inclusivity]}
                  onValueChange={(value) => handleProcessChange(process.id, 'inclusivity', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Efficiency: {process.efficiency}%
                </label>
                <Slider
                  value={[process.efficiency]}
                  onValueChange={(value) => handleProcessChange(process.id, 'efficiency', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Transparency: {process.transparency}%
                </label>
                <Slider
                  value={[process.transparency]}
                  onValueChange={(value) => handleProcessChange(process.id, 'transparency', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Decision Type</label>
                <RadioGroup
                  value={process.decisionType}
                  onValueChange={(value) => handleProcessChange(process.id, 'decisionType', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Autocratic" id={`${process.id}-autocratic`} />
                    <Label htmlFor={`${process.id}-autocratic`}>Autocratic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Consultative" id={`${process.id}-consultative`} />
                    <Label htmlFor={`${process.id}-consultative`}>Consultative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Consensus" id={`${process.id}-consensus`} />
                    <Label htmlFor={`${process.id}-consensus`}>Consensus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Democratic" id={`${process.id}-democratic`} />
                    <Label htmlFor={`${process.id}-democratic`}>Democratic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Participatory" id={`${process.id}-participatory`} />
                    <Label htmlFor={`${process.id}-participatory`}>Participatory</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Stakeholder Involvement:</h4>
                <div className="flex flex-wrap gap-1">
                  {process.stakeholderInvolvement.map((stakeholder, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {stakeholder}
                    </Badge>
                  ))}
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
          onClick={resetFramework}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );

  const renderStakeholderInclusion = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Stakeholder Involvement Mapping</span>
          </CardTitle>
          <CardDescription>
            Map how different stakeholder groups are involved in decision-making processes
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholderGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Involvement Weight: {group.weight}%
                  </label>
                  <Progress value={group.weight} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Involved in:</h4>
                  {decisionProcesses
                    .filter(p => p.stakeholderInvolvement.some(s => s.toLowerCase().includes(group.name.toLowerCase())))
                    .map(process => (
                      <div key={process.id} className="text-sm text-gray-600">
                        • {process.name}
                      </div>
                    ))}
                </div>

                <div className="text-sm">
                  <span className="font-medium">Decision Types: </span>
                  <span className="text-gray-600">
                    {decisionProcesses
                      .filter(p => p.stakeholderInvolvement.some(s => s.toLowerCase().includes(group.name.toLowerCase())))
                      .map(p => p.decisionType)
                      .join(', ')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScenarioTesting = () => (
    <div className="space-y-6">
      {analysisResults && (
        <>
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Framework Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                    {analysisResults.frameworkScore.toFixed(1)}%
                  </div>
                  <div className={`text-lg font-semibold mb-4 ${analysisResults.frameworkColor}`}>
                    {analysisResults.frameworkLevel}
                  </div>
                  <Progress value={analysisResults.frameworkScore} className="h-3" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Average Inclusivity:</span>
                      <span className="font-semibold">{analysisResults.metrics.avgInclusivity.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Efficiency:</span>
                      <span className="font-semibold">{analysisResults.metrics.avgEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Transparency:</span>
                      <span className="font-semibold">{analysisResults.metrics.avgTransparency.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Improvement Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.improvementAreas.map((area: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{area.process}</div>
                      <div className="text-sm text-gray-600">
                        Issues: {area.issues.join(', ')}
                      </div>
                    </div>
                    <Badge variant="destructive">Needs Improvement</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderImplementationGuide = () => (
    <div className="space-y-6">
      {analysisResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Implementation Recommendations</span>
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
                    <span className="text-sm">Establish decision-making framework</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Create stakeholder communication channels</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Develop transparency protocols</span>
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
                    <span className="text-sm">Launch pilot decision processes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Train stakeholders on inclusive practices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Monitor and optimize processes</span>
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
          <Settings className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Inclusive Decision Framework
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Design and test inclusive decision-making processes for your organization. 
          Create frameworks that ensure all stakeholders have a voice in important decisions.
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
        {currentStep === 1 && renderProcessDesign()}
        {currentStep === 2 && renderStakeholderInclusion()}
        {currentStep === 3 && renderScenarioTesting()}
        {currentStep === 4 && renderImplementationGuide()}
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

export default DecisionFramework; 