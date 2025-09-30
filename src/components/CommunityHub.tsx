import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  Star, 
  Calendar, 
  MapPin,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Search,
  Filter,
  Plus,
  Award,
  TrendingUp,
  Lightbulb,
  Handshake,
  Globe
} from "lucide-react";

interface CommunityPost {
  id: string;
  author: {
    name: string;
    company: string;
    avatar: string;
    role: string;
  };
  title: string;
  content: string;
  category: 'experience' | 'question' | 'resource' | 'success' | 'mentorship';
  tags: string[];
  likes: number;
  comments: number;
  date: string;
  isBookmarked: boolean;
  isLiked: boolean;
}

interface MentorshipOpportunity {
  id: string;
  mentor: {
    name: string;
    company: string;
    avatar: string;
    expertise: string[];
  };
  title: string;
  description: string;
  duration: string;
  availability: string;
  topics: string[];
  rating: number;
  sessionsCompleted: number;
}

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'mentorship' | 'resources'>('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dummy data for community posts
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        company: 'Pathway',
        avatar: '',
        role: 'CEO'
      },
      title: 'How we implemented profit-sharing in 6 months',
      content: 'We recently completed our profit-sharing implementation and wanted to share our journey. The key was starting small and building trust gradually...',
      category: 'success',
      tags: ['profit-sharing', 'implementation', 'employee-engagement'],
      likes: 24,
      comments: 8,
      date: '2024-01-15',
      isBookmarked: false,
      isLiked: true
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        company: 'TechFlow',
        avatar: '',
        role: 'CTO'
      },
      title: 'Looking for advice on stakeholder governance models',
      content: 'We\'re exploring different governance structures for our shared wealth model. Has anyone implemented a stakeholder council? What were the challenges?',
      category: 'question',
      tags: ['governance', 'stakeholder-council', 'decision-making'],
      likes: 12,
      comments: 15,
      date: '2024-01-14',
      isBookmarked: true,
      isLiked: false
    },
    {
      id: '3',
      author: {
        name: 'Lisa Rodriguez',
        company: 'GreenVentures',
        avatar: '',
        role: 'Operations Director'
      },
      title: 'Community investment ROI tracking template',
      content: 'I created a template for tracking community investment returns. It includes both financial and social impact metrics. Happy to share if anyone needs it!',
      category: 'resource',
      tags: ['community-investment', 'roi-tracking', 'templates'],
      likes: 31,
      comments: 6,
      date: '2024-01-13',
      isBookmarked: false,
      isLiked: true
    }
  ];

  // Dummy data for mentorship opportunities
  const mentorshipOpportunities: MentorshipOpportunity[] = [
    {
      id: '1',
      mentor: {
        name: 'Dr. James Perry',
        company: 'SWI',
        avatar: '',
        expertise: ['Phantom Shares', 'Governance', 'Legal Structures']
      },
      title: 'Phantom Share Implementation',
      description: 'Expert guidance on implementing phantom share programs, including legal considerations and best practices.',
      duration: '4 sessions',
      availability: 'Weekly',
      topics: ['Legal Framework', 'Valuation Methods', 'Vesting Schedules'],
      rating: 4.9,
      sessionsCompleted: 45
    },
    {
      id: '2',
      mentor: {
        name: 'Emma Wilson',
        company: 'Pathway',
        avatar: '',
        expertise: ['Employee Engagement', 'Change Management', 'Communication']
      },
      title: 'Employee Engagement Strategies',
      description: 'Learn how to effectively communicate and engage employees during shared wealth implementation.',
      duration: '3 sessions',
      availability: 'Bi-weekly',
      topics: ['Communication Plans', 'Training Programs', 'Feedback Systems'],
      rating: 4.8,
      sessionsCompleted: 32
    },
    {
      id: '3',
      mentor: {
        name: 'David Kim',
        company: 'TechCorp',
        avatar: '',
        expertise: ['Technology Integration', 'Digital Platforms', 'Automation']
      },
      title: 'Digital Platform for Shared Wealth',
      description: 'How to leverage technology to manage and track shared wealth programs effectively.',
      duration: '5 sessions',
      availability: 'Monthly',
      topics: ['Platform Selection', 'Data Management', 'Reporting Tools'],
      rating: 4.7,
      sessionsCompleted: 28
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success': return <TrendingUp className="w-4 h-4" />;
      case 'question': return <MessageCircle className="w-4 h-4" />;
      case 'resource': return <BookOpen className="w-4 h-4" />;
      case 'experience': return <Lightbulb className="w-4 h-4" />;
      case 'mentorship': return <Handshake className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'resource': return 'bg-purple-100 text-purple-800';
      case 'experience': return 'bg-orange-100 text-orange-800';
      case 'mentorship': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
          <p className="text-gray-600">Connect, learn, and grow with other shared wealth companies</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Share Experience
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <Users className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Discussions</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resources</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
              <BookOpen className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentors</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Award className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'discussions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('discussions')}
          className="flex-1"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Discussions
        </Button>
        <Button
          variant={activeTab === 'mentorship' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('mentorship')}
          className="flex-1"
        >
          <Handshake className="w-4 h-4 mr-2" />
          Mentorship
        </Button>
        <Button
          variant={activeTab === 'resources' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('resources')}
          className="flex-1"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Resources
        </Button>
      </div>

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search discussions, resources, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'success' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('success')}
              >
                Success Stories
              </Button>
              <Button
                variant={selectedCategory === 'question' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('question')}
              >
                Questions
              </Button>
              <Button
                variant={selectedCategory === 'resource' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('resource')}
              >
                Resources
              </Button>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{post.author.name}</span>
                            <span>•</span>
                            <span>{post.author.company}</span>
                            <span>•</span>
                            <span>{post.author.role}</span>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(post.category)}>
                          {getCategoryIcon(post.category)}
                          <span className="ml-1 capitalize">{post.category}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Heart className={`w-4 h-4 ${post.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'text-blue-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mentorship Tab */}
      {activeTab === 'mentorship' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Mentor</h2>
            <p className="text-gray-600">Connect with experienced leaders who can guide your shared wealth journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorshipOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={opportunity.mentor.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {opportunity.mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center space-x-1 text-sm">
                          <span>{opportunity.mentor.name}</span>
                          <span>•</span>
                          <span>{opportunity.mentor.company}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{opportunity.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{opportunity.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Availability:</span>
                      <span className="font-medium">{opportunity.availability}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{opportunity.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      {opportunity.sessionsCompleted} sessions completed
                    </span>
                    <Button size="sm">
                      Request Mentorship
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Resources</h2>
            <p className="text-gray-600">Access templates, guides, and best practices from the community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource cards would go here */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Implementation Guide
                </CardTitle>
                <CardDescription>Step-by-step guide for shared wealth implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span>PDF Guide</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Downloads:</span>
                    <span>1,234</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Download Resource
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub; 