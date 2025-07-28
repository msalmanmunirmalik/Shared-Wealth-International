import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  BookOpen,
  FileText,
  Video,
  Download,
  Bookmark,
  Share2,
  Filter,
  Star,
  Clock,
  Users
} from "lucide-react";

const DashboardResources = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Dummy resources data
  const resources = [
    {
      id: 1,
      title: "Sustainable Business Model Canvas",
      description: "A comprehensive guide to building sustainable business models that create long-term value.",
      type: "guide",
      category: "business",
      rating: 4.8,
      downloads: 1247,
      views: 3421,
      duration: "45 min read",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      tags: ["Business Model", "Sustainability", "Strategy"],
      isBookmarked: true
    },
    {
      id: 2,
      title: "Impact Measurement Framework",
      description: "Learn how to measure and track your company's social and environmental impact effectively.",
      type: "template",
      category: "impact",
      rating: 4.9,
      downloads: 892,
      views: 2156,
      duration: "30 min read",
      author: "Impact Institute",
      date: "2024-01-10",
      tags: ["Impact", "Measurement", "Analytics"],
      isBookmarked: false
    },
    {
      id: 3,
      title: "Team Collaboration Best Practices",
      description: "Video series on building effective cross-functional teams in sustainable organizations.",
      type: "video",
      category: "leadership",
      rating: 4.7,
      downloads: 567,
      views: 1893,
      duration: "1h 23m",
      author: "Leadership Academy",
      date: "2024-01-08",
      tags: ["Leadership", "Team Building", "Collaboration"],
      isBookmarked: true
    },
    {
      id: 4,
      title: "Financial Planning for Impact Startups",
      description: "Comprehensive financial planning templates and guides for impact-driven startups.",
      type: "template",
      category: "finance",
      rating: 4.6,
      downloads: 734,
      views: 1654,
      duration: "60 min read",
      author: "Finance Hub",
      date: "2024-01-05",
      tags: ["Finance", "Startup", "Planning"],
      isBookmarked: false
    },
    {
      id: 5,
      title: "ESG Reporting Standards",
      description: "Complete guide to ESG reporting standards and best practices for modern businesses.",
      type: "guide",
      category: "compliance",
      rating: 4.8,
      downloads: 1023,
      views: 2789,
      duration: "90 min read",
      author: "ESG Institute",
      date: "2024-01-03",
      tags: ["ESG", "Reporting", "Compliance"],
      isBookmarked: true
    },
    {
      id: 6,
      title: "Innovation Workshop Series",
      description: "Interactive workshop materials for fostering innovation in sustainable business practices.",
      type: "workshop",
      category: "innovation",
      rating: 4.9,
      downloads: 445,
      views: 1234,
      duration: "2h 15m",
      author: "Innovation Lab",
      date: "2024-01-01",
      tags: ["Innovation", "Workshop", "Design Thinking"],
      isBookmarked: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', count: resources.length },
    { id: 'business', name: 'Business Strategy', count: resources.filter(r => r.category === 'business').length },
    { id: 'impact', name: 'Impact Measurement', count: resources.filter(r => r.category === 'impact').length },
    { id: 'leadership', name: 'Leadership', count: resources.filter(r => r.category === 'leadership').length },
    { id: 'finance', name: 'Finance', count: resources.filter(r => r.category === 'finance').length },
    { id: 'compliance', name: 'Compliance', count: resources.filter(r => r.category === 'compliance').length },
    { id: 'innovation', name: 'Innovation', count: resources.filter(r => r.category === 'innovation').length }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="w-5 h-5" />;
      case 'template':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'workshop':
        return <Users className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'template':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'video':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'workshop':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Resources
          </h1>
          <p className="text-gray-600 mt-1">Access tools, guides, and templates for your business growth</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search resources..."
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

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{resource.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Author and Date */}
                <div className="text-xs text-gray-500">
                  <p>By {resource.author}</p>
                  <p>{new Date(resource.date).toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2">
                  <Button size="sm" className="flex-1" style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
              No Resources Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              style={{ backgroundColor: 'rgb(30, 58, 138)' }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardResources; 