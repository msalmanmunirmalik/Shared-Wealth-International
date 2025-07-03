import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Search, BookOpen, FileText, Video, Calendar } from "lucide-react";
import { useState } from "react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const resources = [
    {
      title: "Become a Shared Wealth Enterprise Toolkit",
      description: "Comprehensive guide with templates and frameworks to transform your organization into a shared wealth enterprise.",
      type: "Toolkit",
      category: "Implementation",
      format: "PDF",
      pages: "45 pages",
      downloadUrl: "#"
    },
    {
      title: "Phantom Shares Implementation Guide",
      description: "Step-by-step guide to implementing phantom share programs for employee wealth sharing without equity dilution.",
      type: "Guide",
      category: "Financial Models",
      format: "PDF",
      pages: "28 pages",
      downloadUrl: "#"
    },
    {
      title: "Democratic Governance Framework",
      description: "Framework for establishing inclusive decision-making processes and stakeholder governance structures.",
      type: "Framework",
      category: "Governance",
      format: "PDF",
      pages: "32 pages",
      downloadUrl: "#"
    },
    {
      title: "Social Audit Methodology",
      description: "Comprehensive methodology for conducting social audits and measuring shared wealth impact.",
      type: "Methodology",
      category: "Impact Measurement",
      format: "PDF",
      pages: "38 pages",
      downloadUrl: "#"
    },
    {
      title: "Community Stakeholding Models",
      description: "Research paper examining different approaches to community participation in business value creation.",
      type: "Research",
      category: "Community Engagement",
      format: "PDF",
      pages: "52 pages",
      downloadUrl: "#"
    },
    {
      title: "Legal Structures for Shared Wealth",
      description: "White paper analyzing legal frameworks and structures that support shared wealth business models.",
      type: "White Paper",
      category: "Legal",
      format: "PDF",
      pages: "41 pages",
      downloadUrl: "#"
    }
  ];

  const blogPosts = [
    {
      title: "The Evolution from SEi to Shared Wealth International",
      date: "2025-06-15",
      author: "Cliff Southcombe",
      excerpt: "Exploring the journey of transformation and the lessons learned in our evolution toward comprehensive shared wealth frameworks.",
      readTime: "8 min read"
    },
    {
      title: "IT-Powered Governance: The Future of Democratic Decision-Making",
      date: "2025-06-01",
      author: "James Perry",
      excerpt: "How technology is enabling more inclusive and efficient governance structures in modern organizations.",
      readTime: "6 min read"
    },
    {
      title: "Measuring Impact: The Social Audit Framework in Action",
      date: "2025-05-20",
      author: "Muhammad Malik",
      excerpt: "Real-world examples of how our social audit framework creates transparency and drives continuous improvement.",
      readTime: "10 min read"
    }
  ];

  const events = [
    {
      title: "Shared Wealth Summer School 2025",
      date: "July 15-19, 2025",
      location: "Edinburgh, Scotland",
      type: "In-person",
      description: "Intensive 5-day program covering all aspects of shared wealth implementation."
    },
    {
      title: "Monthly Webinar: Phantom Shares Deep Dive",
      date: "July 25, 2025",
      location: "Online",
      type: "Virtual",
      description: "Detailed exploration of phantom share mechanisms and implementation strategies."
    },
    {
      title: "Democratic Governance Workshop",
      date: "August 10, 2025",
      location: "London, UK",
      type: "In-person",
      description: "Hands-on workshop for implementing inclusive decision-making processes."
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(resources.map(r => r.category))];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Resources & Thought Leadership
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Access our comprehensive library of guides, research, and insights 
              to advance your shared wealth journey.
            </p>
            <div className="flex items-center justify-center gap-8 text-background/90">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>Practical Guides</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <span>Research Papers</span>
              </div>
              <div className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                <span>Webinars & Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Library */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Resource Library
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive collection of toolkits, guides, and frameworks 
              for implementing shared wealth principles.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <Card key={resource.title} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">{resource.type}</Badge>
                      <CardTitle className="text-lg text-navy">{resource.title}</CardTitle>
                      <CardDescription className="text-teal font-medium">
                        {resource.category}
                      </CardDescription>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{resource.format}</span>
                    <span>{resource.pages}</span>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & News */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest thinking and developments in 
              shared wealth creation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={post.title} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <CardTitle className="text-xl text-navy">{post.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between text-sm">
                      <span>By {post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <Button variant="outline" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our educational events, workshops, and webinars to deepen 
              your understanding of shared wealth principles.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <Card key={event.title} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={event.type === "Virtual" ? "secondary" : "outline"} className="mb-2">
                        {event.type}
                      </Badge>
                      <CardTitle className="text-lg text-navy">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="text-sm mt-1">{event.location}</div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <Button variant="green" size="sm" className="w-full">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-navy text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest resources, insights, 
            and updates from the shared wealth community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-background text-foreground"
            />
            <Button variant="green" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;