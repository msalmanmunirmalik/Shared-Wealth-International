import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Target,
  Heart,
  Users,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Lightbulb
} from "lucide-react";

interface ValueCategory {
  id: string;
  name: string;
  description: string;
  values: {
    id: string;
    name: string;
    description: string;
    currentPractice: number;
    importance: number;
  }[];
}

const ValuesAssessment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const [valueCategories, setValueCategories] = useState<ValueCategory[]>([
    {
      id: "transparency",
      name: "Transparency",
      description: "Open communication and information sharing",
      values: [
        {
          id: "financial_transparency",
          name: "Financial Transparency",
          description: "Open sharing of financial information with stakeholders",
          currentPractice: 60,
          importance: 85
        },
        {
          id: "decision_transparency",
          name: "Decision Transparency",
          description: "Clear communication of decision-making processes",
          currentPractice: 45,
          importance: 80
        },
        {
          id: "performance_transparency",
          name: "Performance Transparency",
          description: "Open sharing of company performance metrics",
          currentPractice: 70,
          importance: 75
        }
      ]
    },
    {
      id: "inclusivity",
      name: "Inclusivity",
      description: "Ensuring all stakeholders have a voice",
      values: [
        {
          id: "employee_inclusion",
          name: "Employee Inclusion",
          description: "Active involvement of employees in decision-making",
          currentPractice: 55,
          importance: 90
        },
        {
          id: "community_inclusion",
          name: "Community Inclusion",
          description: "Engaging local community in company activities",
          currentPractice: 30,
          importance: 70
        },
        {
          id: "stakeholder_diversity",
          name: "Stakeholder Diversity",
          description: "Representation of diverse stakeholder groups",
          currentPractice: 40,
          importance: 85
        }
      ]
    },
    {
      id: "sustainability",
      name: "Sustainability",
      description: "Long-term environmental and social responsibility",
      values: [
        {
          id: "environmental_practices",
          name: "Environmental Practices",
          description: "Implementation of eco-friendly business practices",
          currentPractice: 65,
          importance: 80
        },
        {
          id: "social_impact",
          name: "Social Impact",
          description: "Positive impact on local communities",
          currentPractice: 50,
          importance: 85
        },
        {
          id: "long_term_thinking",
          name: "Long-term Thinking",
          description: "Prioritizing long-term benefits over short-term gains",
          currentPractice: 60,
          importance: 90
        }
      ]
    },
    {
      id: "equity",
      name: "Equity",
      description: "Fair distribution of benefits and opportunities",
      values: [
        {
          id: "wealth_distribution",
          name: "Wealth Distribution",
          description: "Fair distribution of company wealth among stakeholders",
          currentPractice: 35,
          importance: 95
        },
        {
          id: "opportunity_access",
          name: "Opportunity Access",
          description: "Equal access to opportunities for all stakeholders",
          currentPractice: 45,
          importance: 85
        },
        {
          id: "voice_equality",
          name: "Voice Equality",
          description: "Equal voice in company decisions",
          currentPractice: 40,
          importance: 80
        }
      ]
    }
  ]);

  const steps = [
    { id: 1, title: "Values Assessment", description: "Rate current practices and importance" },
    { id: 2, title: "Gap Analysis", description: "Identify alignment gaps" },
    { id: 3, title: "Improvement Plan", description: "Create action roadmap" }
  ];

  const handleValueChange = (categoryId: string, valueId: string, property: string, value: number) => {
    setValueCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            values: category.values.map(val => 
              val.id === valueId 
                ? { ...val, [property]: value }
                : val
            )
          }
        : category
    ));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      let totalAlignment = 0;
      let totalGaps = 0;
      let totalValues = 0;
      const categoryScores: Record<string, number> = {};
      const gaps: any[] = [];

      valueCategories.forEach(category => {
        let categoryAlignment = 0;
        let categoryGaps = 0;
        
        category.values.forEach(value => {
          const alignment = Math.min(100, (value.currentPractice / value.importance) * 100);
          const gap = value.importance - value.currentPractice;
          
          categoryAlignment += alignment;
          categoryGaps += gap;
          totalAlignment += alignment;
          totalGaps += gap;
          totalValues++;

          if (gap > 20) {
            gaps.push({
              category: category.name,
              value: value.name,
              gap: gap,
              importance: value.importance,
              current: value.currentPractice
            });
          }
        });

        categoryScores[category.name] = categoryAlignment / category.values.length;
      });

      const overallAlignment = totalAlignment / totalValues;
      const averageGap = totalGaps / totalValues;

      // Determine alignment level
      let alignmentLevel = "Poor Alignment";
      let alignmentColor = "text-red-600";
      let recommendations = [];

      if (overallAlignment >= 80) {
        alignmentLevel = "Excellent Alignment";
        alignmentColor = "text-green-600";
        recommendations = [
          "Maintain current practices",
          "Document best practices for others",
          "Consider expanding values to new areas"
        ];
      } else if (overallAlignment >= 60) {
        alignmentLevel = "Good Alignment";
        alignmentColor = "text-blue-600";
        recommendations = [
          "Address identified gaps",
          "Strengthen weak areas",
          "Improve communication of values"
        ];
      } else if (overallAlignment >= 40) {
        alignmentLevel = "Moderate Alignment";
        alignmentColor = "text-yellow-600";
        recommendations = [
          "Prioritize high-impact gaps",
          "Develop values implementation plan",
          "Train leadership on values alignment"
        ];
      } else {
        alignmentLevel = "Poor Alignment";
        alignmentColor = "text-red-600";
        recommendations = [
          "Conduct values audit",
          "Develop comprehensive values strategy",
          "Implement values training programs"
        ];
      }

      setAnalysisResults({
        overallAlignment,
        alignmentLevel,
        alignmentColor,
        recommendations,
        categoryScores,
        gaps: gaps.sort((a, b) => b.gap - a.gap).slice(0, 5),
        metrics: {
          averageGap,
          totalValues,
          categoriesWithGaps: Object.keys(categoryScores).filter(cat => categoryScores[cat] < 70).length
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAssessment = () => {
    setValueCategories([
      {
        id: "transparency",
        name: "Transparency",
        description: "Open communication and information sharing",
        values: [
          {
            id: "financial_transparency",
            name: "Financial Transparency",
            description: "Open sharing of financial information with stakeholders",
            currentPractice: 60,
            importance: 85
          },
          {
            id: "decision_transparency",
            name: "Decision Transparency",
            description: "Clear communication of decision-making processes",
            currentPractice: 45,
            importance: 80
          },
          {
            id: "performance_transparency",
            name: "Performance Transparency",
            description: "Open sharing of company performance metrics",
            currentPractice: 70,
            importance: 75
          }
        ]
      },
      {
        id: "inclusivity",
        name: "Inclusivity",
        description: "Ensuring all stakeholders have a voice",
        values: [
          {
            id: "employee_inclusion",
            name: "Employee Inclusion",
            description: "Active involvement of employees in decision-making",
            currentPractice: 55,
            importance: 90
          },
          {
            id: "community_inclusion",
            name: "Community Inclusion",
            description: "Engaging local community in company activities",
            currentPractice: 30,
            importance: 70
          },
          {
            id: "stakeholder_diversity",
            name: "Stakeholder Diversity",
            description: "Representation of diverse stakeholder groups",
            currentPractice: 40,
            importance: 85
          }
        ]
      },
      {
        id: "sustainability",
        name: "Sustainability",
        description: "Long-term environmental and social responsibility",
        values: [
          {
            id: "environmental_practices",
            name: "Environmental Practices",
            description: "Implementation of eco-friendly business practices",
            currentPractice: 65,
            importance: 80
          },
          {
            id: "social_impact",
            name: "Social Impact",
            description: "Positive impact on local communities",
            currentPractice: 50,
            importance: 85
          },
          {
            id: "long_term_thinking",
            name: "Long-term Thinking",
            description: "Prioritizing long-term benefits over short-term gains",
            currentPractice: 60,
            importance: 90
          }
        ]
      },
      {
        id: "equity",
        name: "Equity",
        description: "Fair distribution of benefits and opportunities",
        values: [
          {
            id: "wealth_distribution",
            name: "Wealth Distribution",
            description: "Fair distribution of company wealth among stakeholders",
            currentPractice: 35,
            importance: 95
          },
          {
            id: "opportunity_access",
            name: "Opportunity Access",
            description: "Equal access to opportunities for all stakeholders",
            currentPractice: 45,
            importance: 85
          },
          {
            id: "voice_equality",
            name: "Voice Equality",
            description: "Equal voice in company decisions",
            currentPractice: 40,
            importance: 80
          }
        ]
      }
    ]);
    setAnalysisResults(null);
  };

  const renderValuesAssessment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>Values Alignment Assessment</span>
          </CardTitle>
          <CardDescription>
            Rate how well your current practices align with your stated values
          </CardDescription>
        </CardHeader>
      </Card>

      {valueCategories.map((category) => (
        <Card key={category.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.values.map((value) => (
              <div key={value.id} className="space-y-4 p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-lg">{value.name}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Current Practice Level: {value.currentPractice}%
                    </label>
                    <Slider
                      value={[value.currentPractice]}
                      onValueChange={(val) => handleValueChange(category.id, value.id, 'currentPractice', val[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Importance Level: {value.importance}%
                    </label>
                    <Slider
                      value={[value.importance]}
                      onValueChange={(val) => handleValueChange(category.id, value.id, 'importance', val[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Alignment: </span>
                    <span className={`font-bold ${
                      (value.currentPractice / value.importance) * 100 >= 80 ? 'text-green-600' :
                      (value.currentPractice / value.importance) * 100 >= 60 ? 'text-blue-600' :
                      (value.currentPractice / value.importance) * 100 >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round((value.currentPractice / value.importance) * 100)}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Gap: </span>
                    <span className="font-bold text-red-600">
                      {value.importance - value.currentPractice}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

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
          onClick={resetAssessment}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );

  const renderGapAnalysis = () => (
    <div className="space-y-6">
      {analysisResults && (
        <>
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Overall Alignment Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
                  {analysisResults.overallAlignment.toFixed(1)}%
                </div>
                <div className={`text-xl font-semibold mb-4 ${analysisResults.alignmentColor}`}>
                  {analysisResults.alignmentLevel}
                </div>
                <Progress value={analysisResults.overallAlignment} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analysisResults.categoryScores).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category}</span>
                        <span>{score.toFixed(1)}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Gap:</span>
                    <span className="font-semibold">{analysisResults.metrics.averageGap.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Values Assessed:</span>
                    <span className="font-semibold">{analysisResults.metrics.totalValues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories with Gaps:</span>
                    <span className="font-semibold">{analysisResults.metrics.categoriesWithGaps}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Priority Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.gaps.map((gap: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{gap.value}</div>
                      <div className="text-sm text-gray-600">{gap.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{gap.gap}%</div>
                      <div className="text-sm text-gray-600">
                        {gap.current}% → {gap.importance}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderImprovementPlan = () => (
    <div className="space-y-6">
      {analysisResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Recommended Actions</span>
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
                <CardTitle>Immediate Actions (0-3 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Address top 3 priority gaps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Develop values communication plan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-sm">Train leadership on values alignment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medium-term Actions (3-12 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Implement values monitoring system</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Create stakeholder feedback loops</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">Develop values-based KPIs</span>
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
          <Target className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Values Alignment Assessment
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Evaluate how well your company's actual practices align with your stated values. 
          Identify gaps and create an action plan for better alignment.
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
        {currentStep === 1 && renderValuesAssessment()}
        {currentStep === 2 && renderGapAnalysis()}
        {currentStep === 3 && renderImprovementPlan()}
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

export default ValuesAssessment; 