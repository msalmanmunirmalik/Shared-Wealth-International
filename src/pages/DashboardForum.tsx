import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare,
  Search,
  Plus,
  Filter,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Users,
  TrendingUp,
  Star
} from "lucide-react";

const DashboardForum = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Dummy forum data
  const forumPosts = [
    {
      id: 1,
      title: "Best practices for measuring social impact in tech startups?",
      content: "I'm working on implementing a social impact measurement framework for our tech startup. What metrics do you find most valuable for tracking progress?",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg",
        company: "TechCorp Innovations",
        role: "Impact Manager"
      },
      category: "impact",
      tags: ["Impact Measurement", "Tech", "Startup"],
      likes: 24,
      replies: 8,
      views: 156,
      isBookmarked: true,
      isLiked: false,
      createdAt: "2 hours ago",
      lastReply: "30 minutes ago",
      isHot: true
    },
    {
      id: 2,
      title: "Sustainable supply chain partnerships - how to find the right partners?",
      content: "We're looking to build sustainable supply chain partnerships. Any recommendations on how to identify and approach potential partners?",
      author: {
        name: "Michael Rodriguez",
        avatar: "/placeholder.svg",
        company: "Green Harvest Co.",
        role: "Operations Director"
      },
      category: "partnerships",
      tags: ["Supply Chain", "Partnerships", "Sustainability"],
      likes: 18,
      replies: 12,
      views: 203,
      isBookmarked: false,
      isLiked: true,
      createdAt: "1 day ago",
      lastReply: "3 hours ago",
      isHot: false
    },
    {
      id: 3,
      title: "ESG reporting tools comparison - what's working for you?",
      content: "We're evaluating different ESG reporting tools. Would love to hear about your experiences with various platforms and what you recommend.",
      author: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg",
        company: "Pathway Technologies",
        role: "Sustainability Lead"
      },
      category: "compliance",
      tags: ["ESG", "Reporting", "Tools"],
      likes: 31,
      replies: 15,
      views: 342,
      isBookmarked: true,
      isLiked: false,
      createdAt: "3 days ago",
      lastReply: "1 day ago",
      isHot: true
    },
    {
      id: 4,
      title: "Team building activities for remote sustainable teams",
      content: "Looking for creative team building activities that work well for remote teams focused on sustainability. Any suggestions?",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg",
        company: "EcoSolutions",
        role: "HR Manager"
      },
      category: "leadership",
      tags: ["Team Building", "Remote Work", "Leadership"],
      likes: 12,
      replies: 6,
      views: 89,
      isBookmarked: false,
      isLiked: false,
      createdAt: "4 days ago",
      lastReply: "2 days ago",
      isHot: false
    },
    {
      id: 5,
      title: "Funding opportunities for impact-driven startups in Europe",
      content: "We're based in Europe and looking for funding opportunities specifically for impact-driven startups. Any recommendations?",
      author: {
        name: "Lisa Anderson",
        avatar: "/placeholder.svg",
        company: "Impact Ventures",
        role: "Founder"
      },
      category: "funding",
      tags: ["Funding", "Europe", "Startup"],
      likes: 27,
      replies: 11,
      views: 178,
      isBookmarked: false,
      isLiked: true,
      createdAt: "5 days ago",
      lastReply: "1 day ago",
      isHot: false
    },
    {
      id: 6,
      title: "Innovation workshop ideas for sustainable product development",
      content: "Planning an innovation workshop focused on sustainable product development. What activities and frameworks have worked well for you?",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        company: "Innovation Lab",
        role: "Innovation Manager"
      },
      category: "innovation",
      tags: ["Innovation", "Product Development", "Workshop"],
      likes: 19,
      replies: 9,
      views: 134,
      isBookmarked: true,
      isLiked: false,
      createdAt: "1 week ago",
      lastReply: "3 days ago",
      isHot: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', count: forumPosts.length },
    { id: 'impact', name: 'Impact Measurement', count: forumPosts.filter(p => p.category === 'impact').length },
    { id: 'partnerships', name: 'Partnerships', count: forumPosts.filter(p => p.category === 'partnerships').length },
    { id: 'compliance', name: 'Compliance', count: forumPosts.filter(p => p.category === 'compliance').length },
    { id: 'leadership', name: 'Leadership', count: forumPosts.filter(p => p.category === 'leadership').length },
    { id: 'funding', name: 'Funding', count: forumPosts.filter(p => p.category === 'funding').length },
    { id: 'innovation', name: 'Innovation', count: forumPosts.filter(p => p.category === 'innovation').length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'impact':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partnerships':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'compliance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'leadership':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'funding':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'innovation':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Community Forum
          </h1>
          <p className="text-gray-600 mt-1">Connect, share, and learn from the Shared Wealth community</p>
        </div>
        <Button className="flex items-center space-x-2" style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            style={selectedCategory === category.id ? { backgroundColor: 'rgb(30, 58, 138)' } : {}}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold hover:underline cursor-pointer" style={{ color: 'rgb(30, 58, 138)' }}>
                          {post.title}
                        </h3>
                        {post.isHot && (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </Badge>
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={post.isLiked ? "default" : "outline"} 
                        size="sm"
                        style={post.isLiked ? { backgroundColor: 'rgb(30, 58, 138)' } : {}}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.isLiked ? 'Liked' : 'Like'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 pt-2 border-t" style={{ borderColor: 'rgb(224, 230, 235)' }}>
                    <span>By {post.author.name}</span>
                    <span>•</span>
                    <span>{post.author.role} at {post.author.company}</span>
                    <span>•</span>
                    <span>Last reply {post.lastReply}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
              No Discussions Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                style={{ backgroundColor: 'rgb(30, 58, 138)' }}
              >
                Clear Filters
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Start a Discussion</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardForum; 