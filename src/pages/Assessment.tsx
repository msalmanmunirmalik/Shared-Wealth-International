import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Building,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw
} from "lucide-react";

interface Question {
  id: string;
  category: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const questions: Question[] = [
    // Leadership & Culture
    {
      id: "leadership_commitment",
      category: "Leadership & Culture",
      question: "How committed is your leadership team to shared wealth principles?",
      options: [
        { value: "not_committed", label: "Not committed", score: 0 },
        { value: "somewhat_committed", label: "Somewhat committed", score: 25 },
        { value: "committed", label: "Committed", score: 50 },
        { value: "very_committed", label: "Very committed", score: 75 },
        { value: "fully_committed", label: "Fully committed", score: 100 }
      ]
    },
    {
      id: "employee_engagement",
      category: "Leadership & Culture",
      question: "What is the current level of employee engagement in decision-making?",
      options: [
        { value: "none", label: "No involvement", score: 0 },
        { value: "minimal", label: "Minimal involvement", score: 25 },
        { value: "moderate", label: "Moderate involvement", score: 50 },
        { value: "high", label: "High involvement", score: 75 },
        { value: "full", label: "Full participation", score: 100 }
      ]
    },
    // Financial Readiness
    {
      id: "financial_stability",
      category: "Financial Readiness",
      question: "How stable is your organization's financial position?",
      options: [
        { value: "unstable", label: "Unstable", score: 0 },
        { value: "struggling", label: "Struggling", score: 25 },
        { value: "stable", label: "Stable", score: 50 },
        { value: "strong", label: "Strong", score: 75 },
        { value: "excellent", label: "Excellent", score: 100 }
      ]
    },
    {
      id: "profit_sharing_experience",
      category: "Financial Readiness",
      question: "Do you have experience with profit sharing or similar programs?",
      options: [
        { value: "none", label: "No experience", score: 0 },
        { value: "basic", label: "Basic understanding", score: 25 },
        { value: "some", label: "Some experience", score: 50 },
        { value: "experienced", label: "Experienced", score: 75 },
        { value: "expert", label: "Expert level", score: 100 }
      ]
    },
    // Stakeholder Readiness
    {
      id: "stakeholder_support",
      category: "Stakeholder Readiness",
      question: "How supportive are key stakeholders (investors, board, employees)?",
      options: [
        { value: "opposed", label: "Opposed", score: 0 },
        { value: "neutral", label: "Neutral", score: 25 },
        { value: "supportive", label: "Supportive", score: 50 },
        { value: "very_supportive", label: "Very supportive", score: 75 },
        { value: "fully_supportive", label: "Fully supportive", score: 100 }
      ]
    },
    {
      id: "communication_channels",
      category: "Stakeholder Readiness",
      question: "How effective are your internal communication channels?",
      options: [
        { value: "poor", label: "Poor", score: 0 },
        { value: "fair", label: "Fair", score: 25 },
        { value: "good", label: "Good", score: 50 },
        { value: "very_good", label: "Very good", score: 75 },
        { value: "excellent", label: "Excellent", score: 100 }
      ]
    },
    // Implementation Capacity
    {
      id: "implementation_team",
      category: "Implementation Capacity",
      question: "Do you have a dedicated team for implementation?",
      options: [
        { value: "none", label: "No team", score: 0 },
        { value: "part_time", label: "Part-time resources", score: 25 },
        { value: "dedicated", label: "Dedicated team", score: 50 },
        { value: "experienced", label: "Experienced team", score: 75 },
        { value: "expert", label: "Expert team", score: 100 }
      ]
    },
    {
      id: "timeline_readiness",
      category: "Implementation Capacity",
      question: "What is your preferred implementation timeline?",
      options: [
        { value: "immediate", label: "Immediate (0-3 months)", score: 25 },
        { value: "short", label: "Short term (3-6 months)", score: 50 },
        { value: "medium", label: "Medium term (6-12 months)", score: 75 },
        { value: "long", label: "Long term (12+ months)", score: 100 }
      ]
    }
  ];

  const categories = ["Leadership & Culture", "Financial Readiness", "Stakeholder Readiness", "Implementation Capacity"];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateResults = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const categoryScores: Record<string, number> = {};
      let totalScore = 0;
      let answeredQuestions = 0;

      questions.forEach(question => {
        const answer = answers[question.id];
        if (answer) {
          const option = question.options.find(opt => opt.value === answer);
          if (option) {
            if (!categoryScores[question.category]) {
              categoryScores[question.category] = 0;
            }
            categoryScores[question.category] += option.score;
            totalScore += option.score;
            answeredQuestions++;
          }
        }
      });

      // Calculate average scores
      const averageScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 0;
      
      Object.keys(categoryScores).forEach(category => {
        const categoryQuestions = questions.filter(q => q.category === category).length;
        categoryScores[category] = categoryScores[category] / categoryQuestions;
      });

      // Determine readiness level
      let readinessLevel = "Not Ready";
      let readinessColor = "text-red-600";
      let recommendations = [];

      if (averageScore >= 80) {
        readinessLevel = "Ready to Implement";
        readinessColor = "text-green-600";
        recommendations = [
          "Begin implementation planning immediately",
          "Set up governance structures",
          "Communicate plan to all stakeholders"
        ];
      } else if (averageScore >= 60) {
        readinessLevel = "Nearly Ready";
        readinessColor = "text-yellow-600";
        recommendations = [
          "Address gaps in stakeholder support",
          "Strengthen communication channels",
          "Consider pilot program first"
        ];
      } else if (averageScore >= 40) {
        readinessLevel = "Needs Preparation";
        readinessColor = "text-orange-600";
        recommendations = [
          "Focus on leadership commitment",
          "Build stakeholder support",
          "Develop implementation capacity"
        ];
      } else {
        readinessLevel = "Not Ready";
        readinessColor = "text-red-600";
        recommendations = [
          "Work on organizational culture",
          "Improve financial stability",
          "Build foundational support"
        ];
      }

      setResults({
        averageScore,
        categoryScores,
        readinessLevel,
        readinessColor,
        recommendations,
        totalQuestions: questions.length,
        answeredQuestions
      });
      setIsCalculating(false);
    }, 1500);
  };

  const resetAssessment = () => {
    setAnswers({});
    setResults(null);
    setCurrentStep(0);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Hero Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <Target className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Readiness Assessment</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/80">
            Evaluate your organization's readiness for implementing shared wealth practices.
          </p>
        </div>
      </section>

      {/* Assessment Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {!results ? (
            <div className="space-y-8">
              {/* Progress */}
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium" style={{ color: '#07264e' }}>Progress</span>
                    <span className="text-sm" style={{ color: '#086075' }}>
                      {currentStep + 1} of {questions.length}
                    </span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>

              {/* Current Question */}
              {currentQuestion && (
                <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" style={{ backgroundColor: 'rgba(234, 188, 39, 0.1)', color: '#eabc27' }}>{currentQuestion.category}</Badge>
                      <span className="text-sm" style={{ color: '#086075' }}>
                        Question {currentStep + 1}
                      </span>
                    </div>
                    <CardTitle style={{ color: '#07264e' }}>{currentQuestion.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                      className="space-y-4"
                    >
                      {currentQuestion.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer" style={{ color: '#086075' }}>
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  style={{ borderColor: '#086075', color: '#086075' }}
                >
                  Previous
                </Button>
                
                {currentStep < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!answers[currentQuestion?.id]}
                    style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)', color: 'white' }}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={calculateResults}
                    disabled={!answers[currentQuestion?.id] || isCalculating}
                    style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)', color: 'white' }}
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Get Results
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-8">
              {/* Overall Score */}
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#07264e' }}>Assessment Results</CardTitle>
                  <CardDescription style={{ color: '#086075' }}>
                    Your organization's readiness for shared wealth implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${results.readinessColor}`}>
                      {results.averageScore.toFixed(0)}%
                    </div>
                    <div className={`text-xl font-medium ${results.readinessColor}`}>
                      {results.readinessLevel}
                    </div>
                    <div className="text-sm mt-2" style={{ color: '#086075' }}>
                      {results.answeredQuestions} of {results.totalQuestions} questions answered
                    </div>
                  </div>
                  
                  <Progress value={results.averageScore} className="w-full" />
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#07264e' }}>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map((category) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: '#07264e' }}>{category}</span>
                        <span className="text-sm font-bold" style={{ color: '#086075' }}>
                          {results.categoryScores[category]?.toFixed(0) || 0}%
                        </span>
                      </div>
                      <Progress value={results.categoryScores[category] || 0} className="w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#07264e' }}>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#34a63b' }} />
                        <div>
                          <div className="font-medium" style={{ color: '#07264e' }}>{recommendation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button onClick={resetAssessment} variant="outline" style={{ borderColor: '#086075', color: '#086075' }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Assessment;