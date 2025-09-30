import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Award,
  Target,
  Users,
  FileText,
  Video,
  HelpCircle,
  Download,
  Share2,
  Bookmark,
  ArrowRight,
  Lock,
  Unlock,
  TrendingUp,
  Lightbulb,
  Calendar
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz' | 'workshop' | 'case-study';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites: string[];
  resources: {
    type: 'pdf' | 'video' | 'link' | 'template';
    title: string;
    url: string;
  }[];
  learningObjectives: string[];
  tags: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: LearningModule[];
  totalDuration: number;
  progress: number;
  certificate: boolean;
  level: 'foundation' | 'intermediate' | 'advanced';
}

const LearningPath = () => {
  const [selectedPath, setSelectedPath] = useState<string>('shared-wealth-foundation');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Dummy data for learning paths
  const learningPaths: LearningPath[] = [
    {
      id: 'shared-wealth-foundation',
      title: 'Shared Wealth Foundation',
      description: 'Master the fundamentals of shared wealth principles and implementation strategies.',
      totalDuration: 480,
      progress: 65,
      certificate: true,
      level: 'foundation',
      modules: [
        {
          id: 'intro-to-shared-wealth',
          title: 'Introduction to Shared Wealth',
          description: 'Understanding the core principles and benefits of shared wealth models.',
          type: 'video',
          duration: 45,
          difficulty: 'beginner',
          isCompleted: true,
          isLocked: false,
          prerequisites: [],
          resources: [
            { type: 'pdf', title: 'Shared Wealth Principles Guide', url: '#' },
            { type: 'video', title: 'Introduction Video', url: '#' }
          ],
          learningObjectives: [
            'Understand shared wealth core principles',
            'Identify benefits for stakeholders',
            'Recognize implementation challenges'
          ],
          tags: ['fundamentals', 'principles', 'benefits']
        },
        {
          id: 'legal-framework',
          title: 'Legal Framework & Compliance',
          description: 'Essential legal considerations for implementing shared wealth structures.',
          type: 'reading',
          duration: 60,
          difficulty: 'intermediate',
          isCompleted: true,
          isLocked: false,
          prerequisites: ['intro-to-shared-wealth'],
          resources: [
            { type: 'pdf', title: 'Legal Framework Guide', url: '#' },
            { type: 'template', title: 'Compliance Checklist', url: '#' }
          ],
          learningObjectives: [
            'Understand legal requirements',
            'Navigate compliance challenges',
            'Implement proper governance'
          ],
          tags: ['legal', 'compliance', 'governance']
        },
        {
          id: 'stakeholder-engagement',
          title: 'Stakeholder Engagement Strategies',
          description: 'Effective communication and engagement with all stakeholders.',
          type: 'workshop',
          duration: 90,
          difficulty: 'intermediate',
          isCompleted: false,
          isLocked: false,
          prerequisites: ['legal-framework'],
          resources: [
            { type: 'pdf', title: 'Communication Strategy Template', url: '#' },
            { type: 'video', title: 'Stakeholder Workshop', url: '#' }
          ],
          learningObjectives: [
            'Develop communication strategies',
            'Build stakeholder trust',
            'Handle resistance effectively'
          ],
          tags: ['communication', 'stakeholders', 'engagement']
        },
        {
          id: 'implementation-planning',
          title: 'Implementation Planning & Execution',
          description: 'Step-by-step guide to planning and executing shared wealth implementation.',
          type: 'case-study',
          duration: 120,
          difficulty: 'advanced',
          isCompleted: false,
          isLocked: true,
          prerequisites: ['stakeholder-engagement'],
          resources: [
            { type: 'pdf', title: 'Implementation Roadmap', url: '#' },
            { type: 'template', title: 'Project Plan Template', url: '#' }
          ],
          learningObjectives: [
            'Create implementation roadmap',
            'Manage project timelines',
            'Monitor progress effectively'
          ],
          tags: ['implementation', 'planning', 'execution']
        }
      ]
    },
    {
      id: 'advanced-governance',
      title: 'Advanced Governance & Leadership',
      description: 'Advanced strategies for governance structures and leadership in shared wealth organizations.',
      totalDuration: 360,
      progress: 25,
      certificate: true,
      level: 'advanced',
      modules: [
        {
          id: 'governance-models',
          title: 'Governance Models & Structures',
          description: 'Exploring different governance models for shared wealth organizations.',
          type: 'video',
          duration: 75,
          difficulty: 'advanced',
          isCompleted: true,
          isLocked: false,
          prerequisites: [],
          resources: [
            { type: 'pdf', title: 'Governance Models Guide', url: '#' },
            { type: 'video', title: 'Case Studies', url: '#' }
          ],
          learningObjectives: [
            'Compare governance models',
            'Select appropriate structure',
            'Implement governance framework'
          ],
          tags: ['governance', 'models', 'structures']
        },
        {
          id: 'leadership-development',
          title: 'Leadership in Shared Wealth',
          description: 'Developing leadership skills for shared wealth organizations.',
          type: 'workshop',
          duration: 120,
          difficulty: 'advanced',
          isCompleted: false,
          isLocked: true,
          prerequisites: ['governance-models'],
          resources: [
            { type: 'pdf', title: 'Leadership Development Guide', url: '#' },
            { type: 'template', title: 'Leadership Assessment', url: '#' }
          ],
          learningObjectives: [
            'Develop leadership competencies',
            'Build collaborative culture',
            'Drive organizational change'
          ],
          tags: ['leadership', 'development', 'culture']
        }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'workshop': return <Users className="w-4 h-4" />;
      case 'case-study': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentPath = learningPaths.find(path => path.id === selectedPath);
  const completedModules = currentPath?.modules.filter(m => m.isCompleted).length || 0;
  const totalModules = currentPath?.modules.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
          <p className="text-gray-600">Structured learning experiences to master shared wealth implementation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
          <Button>
            <Bookmark className="w-4 h-4 mr-2" />
            My Progress
          </Button>
        </div>
      </div>

      {/* Learning Paths Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <Card 
            key={path.id} 
            className={`border-0 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer ${
              selectedPath === path.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedPath(path.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription className="mt-2">{path.description}</CardDescription>
                </div>
                <Badge className={getLevelColor(path.level)}>
                  {path.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progress:</span>
                <span className="font-medium">{path.progress}%</span>
              </div>
              <Progress value={path.progress} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{Math.round(path.totalDuration / 60)}h</p>
                </div>
                <div>
                  <p className="text-gray-500">Modules</p>
                  <p className="font-medium">{path.modules.length}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {path.certificate && (
                    <Award className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {path.certificate ? 'Certificate included' : 'No certificate'}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Path Details */}
      {currentPath && (
        <div className="space-y-6">
          {/* Path Header */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">{currentPath.title}</h2>
                  <p className="text-blue-700 mt-1">{currentPath.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{Math.round(currentPath.totalDuration / 60)} hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{completedModules}/{totalModules} modules completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{currentPath.progress}% complete</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{currentPath.progress}%</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Overall Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Learning Modules</h3>
            {currentPath.modules.map((module, index) => (
              <Card key={module.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Module Number */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        module.isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : module.isLocked 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-blue-100 text-blue-600'
                      }`}>
                        {module.isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                    </div>

                    {/* Module Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            {module.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                            {!module.isLocked && !module.isCompleted && <Unlock className="w-4 h-4 text-green-500" />}
                            {module.isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                            <span>{module.title}</span>
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                          >
                            <ArrowRight className={`w-4 h-4 transition-transform ${
                              expandedModule === module.id ? 'rotate-90' : ''
                            }`} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(module.type)}
                          <span className="capitalize">{module.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration} min</span>
                        </div>
                        {module.isCompleted && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>

                      {/* Expanded Module Details */}
                      {expandedModule === module.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          {/* Learning Objectives */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                            <ul className="space-y-1">
                              {module.learningObjectives.map((objective, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Resources */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Resources</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {module.resources.map((resource, idx) => (
                                <Button key={idx} variant="outline" size="sm" className="justify-start">
                                  {resource.type === 'pdf' && <FileText className="w-4 h-4 mr-2" />}
                                  {resource.type === 'video' && <Play className="w-4 h-4 mr-2" />}
                                  {resource.type === 'template' && <Download className="w-4 h-4 mr-2" />}
                                  {resource.type === 'link' && <Share2 className="w-4 h-4 mr-2" />}
                                  {resource.title}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                            <div className="flex flex-wrap gap-1">
                              {module.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            {!module.isLocked && !module.isCompleted && (
                              <Button>
                                <Play className="w-4 h-4 mr-2" />
                                Start Module
                              </Button>
                            )}
                            {module.isCompleted && (
                              <Button variant="outline">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                            )}
                            <Button variant="outline">
                              <Bookmark className="w-4 h-4 mr-2" />
                              Bookmark
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certificate Section */}
          {currentPath.certificate && (
            <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">Course Certificate</h3>
                    <p className="text-yellow-700 mt-1">
                      Complete all modules to earn your certificate in {currentPath.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-200">
                      View Certificate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningPath; 