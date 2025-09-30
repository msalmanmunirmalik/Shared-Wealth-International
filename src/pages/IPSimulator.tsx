import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Lightbulb,
  TrendingUp,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Target,
  Users,
  Globe,
  FileText
} from "lucide-react";

interface IPAsset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  potentialValue: number;
  sharingPercentage: number;
  innovationImpact: number;
  creatorInvolvement: number;
}

interface SharingModel {
  id: string;
  name: string;
  description: string;
  creatorShare: number;
  companyShare: number;
  communityShare: number;
  innovationBoost: number;
  complexity: string;
}

const IPSimulator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const [ipAssets, setIpAssets] = useState<IPAsset[]>([
    {
      id: "patent_1",
      name: "Core Technology Patent",
      type: "Patent",
      currentValue: 2000000,
      potentialValue: 3500000,
      sharingPercentage: 0,
      innovationImpact: 85,
      creatorInvolvement: 90
    },
    {
      id: "trademark_1",
      name: "Brand Trademark",
      type: "Trademark",
      currentValue: 800000,
      potentialValue: 1200000,
      sharingPercentage: 0,
      innovationImpact: 60,
      creatorInvolvement: 70
    },
    {
      id: "copyright_1",
      name: "Software Copyright",
      type: "Copyright",
      currentValue: 1500000,
      potentialValue: 2500000,
      sharingPercentage: 0,
      innovationImpact: 90,
      creatorInvolvement: 95
    },
    {
      id: "trade_secret_1",
      name: "Proprietary Algorithm",
      type: "Trade Secret",
      currentValue: 3000000,
      potentialValue: 5000000,
      sharingPercentage: 0,
      innovationImpact: 95,
      creatorInvolvement: 85
    }
  ]);

  const [sharingModels] = useState<SharingModel[]>([
    {
      id: "traditional",
      name: "Traditional Model",
      description: "Company owns 100% of IP, creators receive salary only",
      creatorShare: 0,
      companyShare: 100,
      communityShare: 0,
      innovationBoost: 0,
      complexity: "Low"
    },
    {
      id: "creator_equity",
      name: "Creator Equity Model",
      description: "Creators receive equity in company based on IP contribution",
      creatorShare: 20,
      companyShare: 80,
      communityShare: 0,
      innovationBoost: 25,
      complexity: "Medium"
    },
    {
      id: "revenue_sharing",
      name: "Revenue Sharing Model",
      description: "Creators receive percentage of revenue from IP commercialization",
      creatorShare: 15,
      companyShare: 85,
      communityShare: 0,
      innovationBoost: 30,
      complexity: "Medium"
    },
    {
      id: "open_innovation",
      name: "Open Innovation Model",
      description: "IP shared with community for collaborative development",
      creatorShare: 10,
      companyShare: 70,
      communityShare: 20,
      innovationBoost: 50,
      complexity: "High"
    },
    {
      id: "hybrid_model",
      name: "Hybrid Model",
      description: "Combination of equity, revenue sharing, and community benefits",
      creatorShare: 12,
      companyShare: 73,
      communityShare: 15,
      innovationBoost: 40,
      complexity: "High"
    }
  ]);

  const [selectedModel, setSelectedModel] = useState("traditional");

  const steps = [
    { id: 1, title: "IP Assessment", description: "Evaluate current IP assets" },
    { id: 2, title: "Model Selection", description: "Choose sharing model" },
    { id: 3, title: "Simulation", description: "Run impact simulation" },
    { id: 4, title: "Results Analysis", description: "Analyze outcomes" }
  ];

  const handleAssetChange = (assetId: string, property: string, value: number) => {
    setIpAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, [property]: value }
        : asset
    ));
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const selectedSharingModel = sharingModels.find(m => m.id === selectedModel);
      if (!selectedSharingModel) return;

      const totalCurrentValue = ipAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const totalPotentialValue = ipAssets.reduce((sum, asset) => sum + asset.potentialValue, 0);
      const avgInnovationImpact = ipAssets.reduce((sum, asset) => sum + asset.innovationImpact, 0) / ipAssets.length;
      const avgCreatorInvolvement = ipAssets.reduce((sum, asset) => sum + asset.creatorInvolvement, 0) / ipAssets.length;

      // Calculate innovation boost from sharing model
      const innovationBoost = selectedSharingModel.innovationBoost;
      const enhancedInnovationImpact = Math.min(100, avgInnovationImpact + innovationBoost);

      // Calculate value distribution
      const creatorValue = (totalCurrentValue * selectedSharingModel.creatorShare) / 100;
      const companyValue = (totalCurrentValue * selectedSharingModel.companyShare) / 100;
      const communityValue = (totalCurrentValue * selectedSharingModel.communityShare) / 100;

      // Calculate potential value increase
      const valueIncrease = ((totalPotentialValue - totalCurrentValue) / totalCurrentValue) * 100;
      const enhancedValueIncrease = valueIncrease * (1 + (innovationBoost / 100));

      // Determine model effectiveness
      let effectivenessLevel = "Low Effectiveness";
      let effectivenessColor = "text-red-600";
      let recommendations = [];

      const effectivenessScore = (enhancedInnovationImpact * 0.4) + (enhancedValueIncrease * 0.3) + (avgCreatorInvolvement * 0.3);

      if (effectivenessScore >= 80) {
        effectivenessLevel = "High Effectiveness";
        effectivenessColor = "text-green-600";
        recommendations = [
          "Implement this sharing model immediately",
          "Monitor innovation metrics closely",
          "Consider expanding to other IP assets"
        ];
      } else if (effectivenessScore >= 60) {
        effectivenessLevel = "Good Effectiveness";
        effectivenessColor = "text-blue-600";
        recommendations = [
          "Implement with pilot program first",
          "Focus on high-impact IP assets",
          "Develop clear governance structure"
        ];
      } else if (effectivenessScore >= 40) {
        effectivenessLevel = "Moderate Effectiveness";
        effectivenessColor = "text-yellow-600";
        recommendations = [
          "Consider alternative sharing models",
          "Improve creator engagement first",
          "Start with smaller IP assets"
        ];
      } else {
        effectivenessLevel = "Low Effectiveness";
        effectivenessColor = "text-red-600";
        recommendations = [
          "Reassess sharing model selection",
          "Focus on building creator relationships",
          "Consider traditional model with improvements"
        ];
      }

      setSimulationResults({
        effectivenessScore,
        effectivenessLevel,
        effectivenessColor,
        recommendations,
        selectedModel: selectedSharingModel,
        metrics: {
          totalCurrentValue,
          totalPotentialValue,
          creatorValue,
          companyValue,
          communityValue,
          enhancedInnovationImpact,
          enhancedValueIncrease,
          avgCreatorInvolvement
        }
      });
      setIsSimulating(false);
    }, 2000);
  };

  const resetSimulation = () => {
    setIpAssets([
      {
        id: "patent_1",
        name: "Core Technology Patent",
        type: "Patent",
        currentValue: 2000000,
        potentialValue: 3500000,
        sharingPercentage: 0,
        innovationImpact: 85,
        creatorInvolvement: 90
      },
      {
        id: "trademark_1",
        name: "Brand Trademark",
        type: "Trademark",
        currentValue: 800000,
        potentialValue: 1200000,
        sharingPercentage: 0,
        innovationImpact: 60,
        creatorInvolvement: 70
      },
      {
        id: "copyright_1",
        name: "Software Copyright",
        type: "Copyright",
        currentValue: 1500000,
        potentialValue: 2500000,
        sharingPercentage: 0,
        innovationImpact: 90,
        creatorInvolvement: 95
      },
      {
        id: "trade_secret_1",
        name: "Proprietary Algorithm",
        type: "Trade Secret",
        currentValue: 3000000,
        potentialValue: 5000000,
        sharingPercentage: 0,
        innovationImpact: 95,
        creatorInvolvement: 85
      }
    ]);
    setSelectedModel("traditional");
    setSimulationResults(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderIPAssessment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>IP Asset Assessment</span>
          </CardTitle>
          <CardDescription>
            Evaluate your current IP assets and their potential for sharing
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ipAssets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <Badge variant="outline">{asset.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Current Value: {formatCurrency(asset.currentValue)}
                </label>
                <Slider
                  value={[asset.currentValue]}
                  onValueChange={(value) => handleAssetChange(asset.id, 'currentValue', value[0])}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Potential Value: {formatCurrency(asset.potentialValue)}
                </label>
                <Slider
                  value={[asset.potentialValue]}
                  onValueChange={(value) => handleAssetChange(asset.id, 'potentialValue', value[0])}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Innovation Impact: {asset.innovationImpact}%
                </label>
                <Slider
                  value={[asset.innovationImpact]}
                  onValueChange={(value) => handleAssetChange(asset.id, 'innovationImpact', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Creator Involvement: {asset.creatorInvolvement}%
                </label>
                <Slider
                  value={[asset.creatorInvolvement]}
                  onValueChange={(value) => handleAssetChange(asset.id, 'creatorInvolvement', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Growth Potential:</span>
                  <span className="font-semibold text-green-600">
                    {((asset.potentialValue - asset.currentValue) / asset.currentValue * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderModelSelection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Sharing Model Selection</span>
          </CardTitle>
          <CardDescription>
            Choose the IP sharing model that best fits your organization
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sharingModels.map((model) => (
          <Card 
            key={model.id} 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              selectedModel === model.id ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Badge variant={model.complexity === 'High' ? 'destructive' : model.complexity === 'Medium' ? 'secondary' : 'default'}>
                  {model.complexity}
                </Badge>
              </div>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Creator Share:</span>
                  <span className="font-semibold">{model.creatorShare}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Company Share:</span>
                  <span className="font-semibold">{model.companyShare}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Community Share:</span>
                  <span className="font-semibold">{model.communityShare}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Innovation Boost:</span>
                  <span className="font-semibold text-green-600">+{model.innovationBoost}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Simulation Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center space-x-2"
              style={{ backgroundColor: 'rgb(30, 58, 138)' }}
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Run Simulation</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetSimulation}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResultsAnalysis = () => (
    <div className="space-y-6">
      {simulationResults && (
        <>
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Simulation Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                    {simulationResults.effectivenessScore.toFixed(1)}%
                  </div>
                  <div className={`text-lg font-semibold mb-4 ${simulationResults.effectivenessColor}`}>
                    {simulationResults.effectivenessLevel}
                  </div>
                  <Progress value={simulationResults.effectivenessScore} className="h-3" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Selected Model: {simulationResults.selectedModel.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Creator Share:</span>
                      <span className="font-semibold">{simulationResults.selectedModel.creatorShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Company Share:</span>
                      <span className="font-semibold">{simulationResults.selectedModel.companyShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Share:</span>
                      <span className="font-semibold">{simulationResults.selectedModel.communityShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Innovation Boost:</span>
                      <span className="font-semibold text-green-600">+{simulationResults.selectedModel.innovationBoost}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Creator Value:</span>
                    <span className="font-semibold">{formatCurrency(simulationResults.metrics.creatorValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Value:</span>
                    <span className="font-semibold">{formatCurrency(simulationResults.metrics.companyValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Value:</span>
                    <span className="font-semibold">{formatCurrency(simulationResults.metrics.communityValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Current Value:</span>
                    <span className="font-semibold">{formatCurrency(simulationResults.metrics.totalCurrentValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Enhanced Innovation Impact:</span>
                    <span className="font-semibold">{simulationResults.metrics.enhancedInnovationImpact.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enhanced Value Increase:</span>
                    <span className="font-semibold text-green-600">{simulationResults.metrics.enhancedValueIncrease.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator Involvement:</span>
                    <span className="font-semibold">{simulationResults.metrics.avgCreatorInvolvement.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Potential Value:</span>
                    <span className="font-semibold">{formatCurrency(simulationResults.metrics.totalPotentialValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulationResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Lightbulb className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            IP Sharing Simulator
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Simulate different IP sharing models and their impact on innovation and value creation. 
          Test various approaches to find the optimal sharing strategy for your organization.
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
        {currentStep === 1 && renderIPAssessment()}
        {currentStep === 2 && renderModelSelection()}
        {currentStep === 3 && renderSimulation()}
        {currentStep === 4 && renderResultsAnalysis()}
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
          disabled={currentStep === steps.length || (currentStep === 3 && !simulationResults)}
          style={{ backgroundColor: 'rgb(30, 58, 138)' }}
        >
          {currentStep === steps.length ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default IPSimulator; 