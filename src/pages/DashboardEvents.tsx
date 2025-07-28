import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Search,
  Plus,
  Filter,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Bookmark,
  Share2,
  Video,
  Globe,
  Star
} from "lucide-react";

const DashboardEvents = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Dummy events data
  const events = [
    {
      id: 1,
      title: "Sustainable Business Summit 2024",
      description: "Join industry leaders for a comprehensive discussion on building sustainable business models and measuring impact.",
      category: "conference",
      type: "hybrid",
      date: "2024-03-15",
      time: "09:00 - 17:00",
      location: "San Francisco, CA",
      venue: "Moscone Center",
      organizer: {
        name: "Shared Wealth International",
        avatar: "/placeholder.svg"
      },
      attendees: 450,
      maxAttendees: 500,
      price: "$299",
      isFree: false,
      isBookmarked: true,
      isRegistered: false,
      tags: ["Sustainability", "Business", "Networking"],
      featured: true
    },
    {
      id: 2,
      title: "Impact Measurement Workshop",
      description: "Hands-on workshop on implementing effective impact measurement frameworks for your organization.",
      category: "workshop",
      type: "virtual",
      date: "2024-03-20",
      time: "14:00 - 16:00",
      location: "Online",
      venue: "Zoom",
      organizer: {
        name: "Impact Institute",
        avatar: "/placeholder.svg"
      },
      attendees: 120,
      maxAttendees: 150,
      price: "Free",
      isFree: true,
      isBookmarked: false,
      isRegistered: true,
      tags: ["Impact", "Workshop", "Measurement"],
      featured: false
    },
    {
      id: 3,
      title: "ESG Reporting Best Practices",
      description: "Learn from experts about the latest ESG reporting standards and how to implement them effectively.",
      category: "webinar",
      type: "virtual",
      date: "2024-03-25",
      time: "11:00 - 12:30",
      location: "Online",
      venue: "Webinar Platform",
      organizer: {
        name: "ESG Academy",
        avatar: "/placeholder.svg"
      },
      attendees: 85,
      maxAttendees: 200,
      price: "$49",
      isFree: false,
      isBookmarked: true,
      isRegistered: false,
      tags: ["ESG", "Reporting", "Compliance"],
      featured: false
    },
    {
      id: 4,
      title: "Innovation in Sustainable Tech",
      description: "Showcase of cutting-edge sustainable technologies and networking with innovators in the field.",
      category: "networking",
      type: "in-person",
      date: "2024-04-05",
      time: "18:00 - 21:00",
      location: "Austin, TX",
      venue: "Austin Convention Center",
      organizer: {
        name: "Tech for Good",
        avatar: "/placeholder.svg"
      },
      attendees: 200,
      maxAttendees: 250,
      price: "$75",
      isFree: false,
      isBookmarked: false,
      isRegistered: false,
      tags: ["Technology", "Innovation", "Networking"],
      featured: true
    },
    {
      id: 5,
      title: "Leadership in Impact Organizations",
      description: "Interactive session on developing leadership skills specifically for impact-driven organizations.",
      category: "training",
      type: "hybrid",
      date: "2024-04-12",
      time: "10:00 - 16:00",
      location: "New York, NY",
      venue: "Impact Hub NYC",
      organizer: {
        name: "Leadership Academy",
        avatar: "/placeholder.svg"
      },
      attendees: 75,
      maxAttendees: 100,
      price: "$199",
      isFree: false,
      isBookmarked: false,
      isRegistered: false,
      tags: ["Leadership", "Training", "Impact"],
      featured: false
    },
    {
      id: 6,
      title: "Community Impact Stories",
      description: "Hear inspiring stories from community leaders about their impact initiatives and lessons learned.",
      category: "storytelling",
      type: "virtual",
      date: "2024-04-18",
      time: "19:00 - 20:30",
      location: "Online",
      venue: "Live Stream",
      organizer: {
        name: "Community Foundation",
        avatar: "/placeholder.svg"
      },
      attendees: 300,
      maxAttendees: 500,
      price: "Free",
      isFree: true,
      isBookmarked: true,
      isRegistered: true,
      tags: ["Community", "Stories", "Inspiration"],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events', count: events.length },
    { id: 'conference', name: 'Conferences', count: events.filter(e => e.category === 'conference').length },
    { id: 'workshop', name: 'Workshops', count: events.filter(e => e.category === 'workshop').length },
    { id: 'webinar', name: 'Webinars', count: events.filter(e => e.category === 'webinar').length },
    { id: 'networking', name: 'Networking', count: events.filter(e => e.category === 'networking').length },
    { id: 'training', name: 'Training', count: events.filter(e => e.category === 'training').length },
    { id: 'storytelling', name: 'Storytelling', count: events.filter(e => e.category === 'storytelling').length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conference':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'workshop':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'webinar':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'networking':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'training':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'storytelling':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      case 'hybrid':
        return <Globe className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'virtual':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in-person':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hybrid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            Events
          </h1>
          <p className="text-gray-600 mt-1">Discover and join upcoming events in the Shared Wealth community</p>
        </div>
        <Button className="flex items-center space-x-2" style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
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

      {/* Featured Events */}
      {filteredEvents.filter(e => e.featured).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgb(30, 58, 138)' }}>
            Featured Events
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.filter(e => e.featured).map((event) => (
              <Card key={event.id} className="border-2" style={{ borderColor: 'rgb(245, 158, 11)' }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </Badge>
                      <Badge className={getTypeColor(event.type)}>
                        {getTypeIcon(event.type)}
                        <span className="ml-1">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                      </Badge>
                      {event.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bookmark className={`w-4 h-4 ${event.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{event.attendees}/{event.maxAttendees}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={event.organizer.avatar} />
                          <AvatarFallback className="text-xs" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                            {event.organizer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{event.organizer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{event.price}</span>
                        <Button 
                          size="sm" 
                          variant={event.isRegistered ? "outline" : "default"}
                          style={event.isRegistered ? {} : { backgroundColor: 'rgb(30, 58, 138)' }}
                        >
                          {event.isRegistered ? 'Registered' : 'Register'}
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

      {/* All Events */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgb(30, 58, 138)' }}>
          All Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                    <Badge className={getTypeColor(event.type)}>
                      {getTypeIcon(event.type)}
                      <span className="ml-1">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bookmark className={`w-4 h-4 ${event.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Event Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium">{event.price}</span>
                    <Button 
                      size="sm" 
                      variant={event.isRegistered ? "outline" : "default"}
                      style={event.isRegistered ? {} : { backgroundColor: 'rgb(30, 58, 138)' }}
                    >
                      {event.isRegistered ? 'Registered' : 'Register'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>
              No Events Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find events that interest you.
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
                <span>Create Event</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardEvents; 