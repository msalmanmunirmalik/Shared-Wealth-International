import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Users, 
  Building, 
  TrendingUp, 
  FileText, 
  ClipboardCheck, 
  Upload, 
  BarChart3, 
  LayoutDashboard, 
  Share2, 
  Scale, 
  PieChart, 
  DollarSign,
  Search,
  Filter,
  ArrowRight,
  Star,
  Play,
  BookOpen,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const TrainingCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const trainingCourses = [
    {
      title: "Managing Working Hours of Staff",
      description: "Learn effective strategies for managing and optimizing staff working hours in a shared wealth environment",
      duration: "2 hours",
      level: "Intermediate",
      instructor: "Dr. Sarah Johnson",
      category: "Operations",
      modules: ["Time Tracking Systems", "Flexible Scheduling", "Work-Life Balance", "Productivity Optimization"],
      icon: Clock,
      color: "from-blue-50 to-indigo-100",
      rating: 4.8,
      students: 1247,
      featured: false
    },
    {
      title: "Stakeholder Engagement",
      description: "Master the art of engaging all stakeholders in decision-making and value creation processes",
      duration: "3 hours",
      level: "Advanced",
      instructor: "Prof. Michael Chen",
      category: "Leadership",
      modules: ["Stakeholder Mapping", "Communication Strategies", "Engagement Models", "Feedback Systems"],
      icon: Users,
      color: "from-green-50 to-emerald-100",
      rating: 4.9,
      students: 2156,
      featured: true
    },
    {
      title: "Directory Companies",
      description: "Understand how to build and manage a directory of companies committed to shared wealth principles",
      duration: "1.5 hours",
      level: "Beginner",
      instructor: "Elena Petrova",
      category: "Networking",
      modules: ["Company Profiling", "Verification Processes", "Network Building", "Collaboration Opportunities"],
      icon: Building,
      color: "from-purple-50 to-violet-100",
      rating: 4.6,
      students: 892,
      featured: false
    },
    {
      title: "What are Social Economic Models that Work Really Well",
      description: "Explore proven social economic models and their successful implementation strategies",
      duration: "4 hours",
      level: "Advanced",
      instructor: "Dr. Thomas Wright",
      category: "Strategy",
      modules: ["Model Analysis", "Success Factors", "Implementation Roadmaps", "Case Studies"],
      icon: TrendingUp,
      color: "from-orange-50 to-amber-100",
      rating: 4.9,
      students: 1893,
      featured: true
    },
    {
      title: "Standard Company Rule Book that Adheres to Your Values - Shared Wealth",
      description: "Create comprehensive company policies and procedures that align with shared wealth principles",
      duration: "2.5 hours",
      level: "Intermediate",
      instructor: "Legal Team",
      category: "Governance",
      modules: ["Policy Framework", "Value Integration", "Compliance Requirements", "Implementation Guide"],
      icon: FileText,
      color: "from-pink-50 to-rose-100",
      rating: 4.7,
      students: 1567,
      featured: false
    },
    {
      title: "Social Audit Process",
      description: "Learn how to conduct comprehensive social audits to measure and improve your shared wealth impact",
      duration: "3.5 hours",
      level: "Advanced",
      instructor: "Audit Specialists",
      category: "Assessment",
      modules: ["Audit Framework", "Data Collection", "Impact Measurement", "Reporting Standards"],
      icon: ClipboardCheck,
      color: "from-yellow-50 to-amber-100",
      rating: 4.8,
      students: 1342,
      featured: false
    },
    {
      title: "Upload Documents - Reviewed",
      description: "Master the document management and review processes for shared wealth organizations",
      duration: "1 hour",
      level: "Beginner",
      instructor: "Documentation Team",
      category: "Operations",
      modules: ["Document Standards", "Review Processes", "Version Control", "Access Management"],
      icon: Upload,
      color: "from-teal-50 to-cyan-100",
      rating: 4.5,
      students: 678,
      featured: false
    },
    {
      title: "Cashflow Management / Forecasting Tools",
      description: "Learn advanced cashflow management and forecasting techniques for sustainable business growth",
      duration: "3 hours",
      level: "Intermediate",
      instructor: "Financial Experts",
      category: "Finance",
      modules: ["Cashflow Analysis", "Forecasting Models", "Financial Planning", "Risk Management"],
      icon: BarChart3,
      color: "from-indigo-50 to-blue-100",
      rating: 4.8,
      students: 2234,
      featured: true
    },
    {
      title: "Dashboard to Manage Shared Wealth",
      description: "Design and implement effective dashboards for monitoring and managing shared wealth metrics",
      duration: "2 hours",
      level: "Intermediate",
      instructor: "Data Analytics Team",
      category: "Technology",
      modules: ["Dashboard Design", "KPI Selection", "Data Visualization", "Real-time Monitoring"],
      icon: LayoutDashboard,
      color: "from-emerald-50 to-green-100",
      rating: 4.7,
      students: 1456,
      featured: false
    },
    {
      title: "Phantom Equity Distribution / Share Distribution Platform",
      description: "Implement effective phantom equity and share distribution systems for employee ownership",
      duration: "4 hours",
      level: "Advanced",
      instructor: "Equity Specialists",
      category: "Ownership",
      modules: ["Phantom Equity Design", "Distribution Models", "Platform Implementation", "Legal Compliance"],
      icon: Share2,
      color: "from-red-50 to-pink-100",
      rating: 4.9,
      students: 1789,
      featured: true
    },
    {
      title: "Legal Structures / Company Formation",
      description: "Understand legal structures and company formation processes for shared wealth organizations",
      duration: "3 hours",
      level: "Intermediate",
      instructor: "Legal Advisors",
      category: "Legal",
      modules: ["Legal Structures", "Formation Process", "Compliance Requirements", "Best Practices"],
      icon: Scale,
      color: "from-slate-50 to-gray-100",
      rating: 4.6,
      students: 1123,
      featured: false
    },
    {
      title: "Types of Shares",
      description: "Comprehensive guide to different types of shares and their applications in shared wealth models",
      duration: "2.5 hours",
      level: "Intermediate",
      instructor: "Share Structure Experts",
      category: "Ownership",
      modules: ["Share Types", "Voting Rights", "Dividend Structures", "Transfer Restrictions"],
      icon: PieChart,
      color: "from-cyan-50 to-blue-100",
      rating: 4.7,
      students: 987,
      featured: false
    },
    {
      title: "Utilising Shares in Lieu of Payment",
      description: "Learn how to effectively use shares as compensation and payment mechanisms",
      duration: "2 hours",
      level: "Advanced",
      instructor: "Compensation Specialists",
      category: "Compensation",
      modules: ["Share-Based Compensation", "Valuation Methods", "Tax Implications", "Implementation Strategies"],
      icon: DollarSign,
      color: "from-lime-50 to-green-100",
      rating: 4.8,
      students: 1654,
      featured: false
    }
  ];

  const categories = ["all", "Operations", "Leadership", "Networking", "Strategy", "Governance", "Assessment", "Finance", "Technology", "Ownership", "Legal", "Compensation"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = trainingCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const featuredCourses = filteredCourses.filter(course => course.featured);
  const regularCourses = filteredCourses.filter(course => !course.featured);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">Training Courses</h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/80 max-w-3xl mx-auto">
            Master shared wealth implementation with our comprehensive training courses designed by industry experts.
          </p>
          <div className="flex items-center justify-center gap-8 text-white/90">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" style={{ color: '#eabc27' }} />
              <span>13 Courses</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" style={{ color: '#eabc27' }} />
              <span>Expert Instructors</span>
            </div>
            <div className="flex items-center">
              <Play className="w-5 h-5 mr-2" style={{ color: '#eabc27' }} />
              <span>Self-Paced Learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8" style={{ background: 'linear-gradient(135deg, #086075 0%, #34a63b 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#086075' }} />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-md text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(234, 188, 39, 0.3)' }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 rounded-md text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(234, 188, 39, 0.3)' }}
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#07264e' }}>Featured Courses</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#086075' }}>
                Our most popular and highly-rated courses to get you started
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, index) => {
                const Icon = course.icon;
                return (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#eabc27' }}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6" style={{ color: '#07264e' }} />
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className="mb-1" style={{ backgroundColor: 'rgba(234, 188, 39, 0.1)', color: '#eabc27' }}>
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                          <div className="flex items-center text-xs" style={{ color: '#086075' }}>
                            <Clock className="w-3 h-3 mr-1" />
                            {course.duration}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg" style={{ color: '#07264e' }}>{course.title}</CardTitle>
                      <CardDescription style={{ color: '#086075' }}>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium" style={{ color: '#07264e' }}>
                            Instructor: {course.instructor}
                          </div>
                          <div className="flex items-center text-sm" style={{ color: '#086075' }}>
                            <Star className="w-4 h-4 mr-1" style={{ color: '#eabc27' }} />
                            {course.rating}
                          </div>
                        </div>
                        <div className="text-sm mb-3" style={{ color: '#086075' }}>
                          Category: {course.category} • {course.students} students
                        </div>
                        <div className="text-xs font-medium mb-2" style={{ color: '#07264e' }}>Modules:</div>
                        <div className="flex flex-wrap gap-1">
                          {course.modules.map((module, moduleIndex) => (
                            <Badge key={moduleIndex} variant="outline" className="text-xs" style={{ borderColor: 'rgba(8, 96, 117, 0.2)', color: '#086075' }}>
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button asChild className="w-full" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)', color: 'white' }}>
                        <Link to={`/training/${course.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          Enroll Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Courses */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#07264e' }}>All Training Courses</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#086075' }}>
              Complete curriculum to master shared wealth implementation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCourses.map((course, index) => {
              const Icon = course.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6" style={{ color: '#07264e' }} />
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="secondary" className="text-xs mb-1" style={{ backgroundColor: 'rgba(234, 188, 39, 0.1)', color: '#eabc27' }}>
                          {course.level}
                        </Badge>
                        <div className="flex items-center text-xs" style={{ color: '#086075' }}>
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg" style={{ color: '#07264e' }}>{course.title}</CardTitle>
                    <CardDescription style={{ color: '#086075' }}>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium" style={{ color: '#07264e' }}>
                          Instructor: {course.instructor}
                        </div>
                        <div className="flex items-center text-sm" style={{ color: '#086075' }}>
                          <Star className="w-4 h-4 mr-1" style={{ color: '#eabc27' }} />
                          {course.rating}
                        </div>
                      </div>
                      <div className="text-sm mb-3" style={{ color: '#086075' }}>
                        Category: {course.category} • {course.students} students
                      </div>
                      <div className="text-xs font-medium mb-2" style={{ color: '#07264e' }}>Modules:</div>
                      <div className="flex flex-wrap gap-1">
                        {course.modules.map((module, moduleIndex) => (
                          <Badge key={moduleIndex} variant="outline" className="text-xs" style={{ borderColor: 'rgba(8, 96, 117, 0.2)', color: '#086075' }}>
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button asChild className="w-full" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)', color: 'white' }}>
                      <Link to={`/training/${course.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        Enroll Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Learning?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already mastered shared wealth implementation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-white" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)' }}>
              <Link to="/resources?tab=training">Browse All Courses</Link>
            </Button>
            <Button asChild size="lg" variant="outline" style={{ borderColor: '#eabc27', color: '#eabc27' }}>
              <Link to="/assessment">Take Readiness Assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingCourses; 