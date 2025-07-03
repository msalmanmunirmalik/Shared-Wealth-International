import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LatestNews = () => {
  const news = [
    {
      title: "Terratai Ltd Achieves 40% Increase in Employee Engagement",
      excerpt: "Following the implementation of phantom shares and democratic governance, Terratai demonstrates measurable transformation.",
      date: "2025-06-28",
      category: "Impact Story",
      readTime: "5 min read",
      featured: true
    },
    {
      title: "Summer School 2025 Applications Now Open",
      excerpt: "Join our intensive 5-day program in Edinburgh covering all aspects of shared wealth implementation.",
      date: "2025-06-25",
      category: "Education",
      readTime: "2 min read",
      featured: false
    },
    {
      title: "New Partnership Framework Launched",
      excerpt: "Introducing our enhanced partnership model for organizations looking to join the global shared wealth network.",
      date: "2025-06-20",
      category: "Partnerships",
      readTime: "4 min read",
      featured: false
    },
    {
      title: "Democratic Governance Research Published",
      excerpt: "Our latest white paper explores the impact of inclusive decision-making on organizational performance.",
      date: "2025-06-15",
      category: "Research",
      readTime: "8 min read",
      featured: false
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
            Latest News & Updates
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed about the latest developments, success stories, and insights 
            from the shared wealth community.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-7">
            {news.filter(item => item.featured).map((article, index) => (
              <Card key={article.title} className="h-full hover:shadow-xl transition-all duration-300 animate-fade-in">
                <div className="aspect-video bg-gradient-primary rounded-t-lg flex items-center justify-center mb-6">
                  <div className="text-background text-lg font-semibold">Featured Story</div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-navy mb-3">{article.title}</CardTitle>
                  <CardDescription className="text-lg">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime}
                    </div>
                    <Button variant="green">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Articles */}
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-bold text-navy mb-6">Recent Updates</h3>
            <div className="space-y-4">
              {news.filter(item => !item.featured).map((article, index) => (
                <Card key={article.title} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-navy leading-tight">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link to="/resources">
                  View All News
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;