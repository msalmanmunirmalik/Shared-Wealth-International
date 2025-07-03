import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Download, Calendar } from "lucide-react";

const ReadinessAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const questions = [
    // Shared Wealth Creation (3 questions)
    {
      category: "Shared Wealth Creation",
      question: "How does your company currently distribute profits or value to employees?",
      options: [
        { text: "No profit sharing - only salaries/wages", value: 1 },
        { text: "Occasional bonuses based on performance", value: 2 },
        { text: "Regular profit sharing with some employees", value: 3 },
        { text: "Systematic profit sharing with most employees", value: 4 },
        { text: "Comprehensive equity/ownership sharing with all employees", value: 5 }
      ]
    },
    {
      category: "Shared Wealth Creation",
      question: "What ownership mechanisms does your company currently have in place?",
      options: [
        { text: "Traditional ownership - shareholders only", value: 1 },
        { text: "Employee stock options for senior staff", value: 2 },
        { text: "Employee stock options for most staff", value: 3 },
        { text: "Phantom shares or profit participation rights", value: 4 },
        { text: "Full employee ownership or cooperative structure", value: 5 }
      ]
    },
    {
      category: "Shared Wealth Creation",
      question: "How does your company approach intellectual property and value creation?",
      options: [
        { text: "Company owns all IP with no employee participation", value: 1 },
        { text: "Recognition programs for employee contributions", value: 2 },
        { text: "Bonus payments for significant IP contributions", value: 3 },
        { text: "IP sharing agreements with key contributors", value: 4 },
        { text: "Systematic IP sharing reflecting all contributors", value: 5 }
      ]
    },
    // Inclusive Decision-Making (2 questions)
    {
      category: "Inclusive Decision-Making",
      question: "To what extent do employees have formal influence in company decisions?",
      options: [
        { text: "No formal input - top-down decisions only", value: 1 },
        { text: "Occasional surveys or feedback sessions", value: 2 },
        { text: "Regular consultation on specific issues", value: 3 },
        { text: "Employee representatives on some committees", value: 4 },
        { text: "Democratic governance with employee voting rights", value: 5 }
      ]
    },
    {
      category: "Inclusive Decision-Making",
      question: "How involved are customers and community in your decision-making?",
      options: [
        { text: "No formal involvement", value: 1 },
        { text: "Market research and customer feedback", value: 2 },
        { text: "Customer advisory panels or community feedback", value: 3 },
        { text: "Regular stakeholder consultation processes", value: 4 },
        { text: "Formal stakeholder representation in governance", value: 5 }
      ]
    },
    // Value-Led Approach (2 questions)
    {
      category: "Value-Led Approach",
      question: "How well documented and integrated are your social/environmental goals?",
      options: [
        { text: "No formal social/environmental mission", value: 1 },
        { text: "Informal commitment to social good", value: 2 },
        { text: "Written mission statement including social goals", value: 3 },
        { text: "Integrated social/environmental strategy with metrics", value: 4 },
        { text: "B-Corp or similar certification with audited impact", value: 5 }
      ]
    },
    {
      category: "Value-Led Approach",
      question: "How are ethical commitments embedded in your business agreements?",
      options: [
        { text: "Standard commercial terms only", value: 1 },
        { text: "Basic ethical clauses in some agreements", value: 2 },
        { text: "Ethical standards in most business agreements", value: 3 },
        { text: "Comprehensive ethical frameworks in all agreements", value: 4 },
        { text: "Mutual accountability agreements with all stakeholders", value: 5 }
      ]
    }
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const calculateResults = () => {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Calculate scores by category
    const categoryScores = {
      "Shared Wealth Creation": answers.slice(0, 3).reduce((sum, answer) => sum + answer, 0),
      "Inclusive Decision-Making": answers.slice(3, 5).reduce((sum, answer) => sum + answer, 0),
      "Value-Led Approach": answers.slice(5, 7).reduce((sum, answer) => sum + answer, 0)
    };
    
    let readinessLevel = "Exploring";
    let levelColor = "orange";
    let description = "You're at the beginning of your shared wealth journey.";
    
    if (percentage >= 70) {
      readinessLevel = "Leading";
      levelColor = "green";
      description = "You're a leader in shared wealth practices with strong foundations.";
    } else if (percentage >= 50) {
      readinessLevel = "Developing";
      levelColor = "teal";
      description = "You're making good progress toward comprehensive shared wealth implementation.";
    }
    
    return {
      totalScore,
      maxScore,
      percentage,
      categoryScores,
      readinessLevel,
      levelColor,
      description
    };
  };

  const getRecommendations = (results: any) => {
    const recommendations = [];
    
    if (results.categoryScores["Shared Wealth Creation"] < 10) {
      recommendations.push({
        title: "Shared Wealth Framework Workshop",
        description: "Learn practical mechanisms for implementing profit sharing and employee ownership."
      });
    }
    
    if (results.categoryScores["Inclusive Decision-Making"] < 7) {
      recommendations.push({
        title: "Governance Design Consultation",
        description: "Design inclusive decision-making structures for your organization."
      });
    }
    
    if (results.categoryScores["Value-Led Approach"] < 7) {
      recommendations.push({
        title: "Social Audit Certification",
        description: "Establish measurable social and environmental impact frameworks."
      });
    }
    
    if (results.percentage >= 70) {
      recommendations.push({
        title: "Network Partnership Program",
        description: "Join our network of leading Shared Wealth Companies as a partner."
      });
    }
    
    return recommendations;
  };

  if (showResults) {
    const results = calculateResults();
    const recommendations = getRecommendations(results);
    
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-navy">Your Shared Wealth Readiness Results</CardTitle>
            <CardDescription>
              Based on your responses across the three core pillars
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Overall Score */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-navy">{results.percentage}%</div>
              <Badge 
                variant={results.levelColor === "green" ? "default" : "secondary"} 
                className={`text-lg px-4 py-2 ${
                  results.levelColor === "green" ? "bg-green text-background" :
                  results.levelColor === "teal" ? "bg-teal text-background" :
                  "bg-orange text-background"
                }`}
              >
                {results.readinessLevel}
              </Badge>
              <p className="text-lg text-muted-foreground">{results.description}</p>
            </div>
            
            {/* Category Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(results.categoryScores).map(([category, score]) => {
                const maxCategoryScore = category === "Inclusive Decision-Making" || category === "Value-Led Approach" ? 10 : 15;
                const categoryPercentage = Math.round((score / maxCategoryScore) * 100);
                
                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg text-navy">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Score:</span>
                          <span className="font-semibold">{score}/{maxCategoryScore}</span>
                        </div>
                        <Progress value={categoryPercentage} className="h-2" />
                        <div className="text-center text-sm font-medium">{categoryPercentage}%</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-navy">Recommended Next Steps</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-navy mb-2">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                      <Button variant="outline" size="sm">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button variant="green" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Full Report
              </Button>
              <Button variant="outline" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Consultation
              </Button>
              <Button variant="outline" size="lg" onClick={resetAssessment}>
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">{currentQ.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl text-navy">Shared Wealth Readiness Assessment</CardTitle>
          <CardDescription>
            Answer 7 questions to discover your organization's readiness for shared wealth implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-xl font-semibold text-navy">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left border border-border rounded-md hover:border-primary hover:bg-accent/50 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 border-2 border-muted-foreground rounded-full group-hover:border-primary flex items-center justify-center">
                    <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadinessAssessment;