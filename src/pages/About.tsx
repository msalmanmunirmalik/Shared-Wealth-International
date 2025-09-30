import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Target, 
  Shield, 
  TrendingUp, 
  Globe, 
  Star, 
  Award, 
  Lightbulb, 
  Linkedin, 
  Mail,
  Calendar,
  BookOpen,
  GraduationCap,
  Handshake,
  Building2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Companies", value: "24+", icon: Users },
    { label: "Countries", value: "40+", icon: Globe },
    { label: "Years Experience", value: "30+", icon: Calendar }
  ];

  // Streamlined journey timeline
  const journeyTimeline = [
    {
      year: "1994",
      title: "The Foundation",
      description: "Cliff Southcombe co-founded the Social Enterprise Partnership with Freer Spreckley, pioneering the social enterprise movement.",
      icon: Building2,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2014-2017",
      title: "The Spark",
      description: "International Summer Schools with Professor Rory Ridley-Duff explored wealth inequality and how business could be part of the solution.",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2017-2020",
      title: "FairShares Innovation",
      description: "Developed FairShares model sharing wealth between workers, customers, communities, and investors. Learned from practice with companies like LocoSoco.",
      icon: Handshake,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      year: "2020-Present",
      title: "Shared Wealth Evolution",
      description: "Evolved to flexible Shared Wealth model with three pillars: Values, Inclusive Decision-Making, and Sharing Wealth.",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Key insights from the journey
  const keyInsights = [
    {
      title: "From Rigid to Flexible",
      description: "FairShares proved too rigid in practice. Solar Ear's Howard Weinstein showed wealth can be shared in many ways - not just through equity.",
      icon: Lightbulb,
      quote: "Wealth can be shared in many different ways — not just through equity"
    },
    {
      title: "Modern Organizations Need Modern Governance",
      description: "SEi's work on inclusive decision-making showed how modern organizations need decision-making that's both efficient and fair.",
      icon: Users,
      quote: "Strictly tying ownership to control was no longer enough"
    },
    {
      title: "Collaboration Over Competition",
      description: "Companies open to sharing wealth are also open to sharing resources and ideas with like-minded people.",
      icon: Handshake,
      quote: "The emphasis shifts from competition to collaboration and replication"
    }
  ];

  // Focused leadership team - core founders and key directors
  const leadership = [
    {
      name: "Cliff Southcombe",
      role: "Founder & Director",
      bio: "Pioneer of the social enterprise movement. Co-founded Social Enterprise Partnership in 1994 with Freer Spreckley, evolving through Social Enterprise Europe to SEi, and now Shared Wealth International. Over 30 years of experience transforming business models.",
      expertise: "Social Enterprise Pioneer, Strategic Planning, Global Movement Building",
      image: "/lovable-uploads/f7f6d7bf-0c80-41f2-885b-a2678b1733ef.png",
      linkedin: "https://www.linkedin.com/in/cliff-southcombe-052b8a1/",
      email: "socialenterpriseuk@gmail.com"
    },
    {
      name: "James Perry",
      role: "Founder & Director",
      bio: "CEO of LocoSoco and expert in innovative ownership structures. Highlighted how Shared Wealth builds loyal customers, motivated employees, incentivised investors, and strengthens social brands.",
      expertise: "Corporate Governance, Phantom Shares, Inclusive Decision-Making",
      image: "/lovable-uploads/a04db650-e312-4313-9485-632a58b8fbf5.png",
      linkedin: "https://www.linkedin.com/in/locosocojames/",
      email: "james@locoso.co"
    },
    
    {
      name: "Dr. Salman Malik",
      role: "Founding Member - Leading Global Initiatives and Learning",
      bio: "Social Entrepreneur in Education & Youth Empowerment, and Health initiatives. Founder of Letstern",
      expertise: "Strategic Planning, Global Partnership Development, Training Programs",
      image: "/lovable-uploads/ab71454c-fd1a-4ed4-995d-21ccae08f423.png",
      linkedin: "https://www.linkedin.com/in/msalmanmunirmalik/",
      email: "msalmanmunirmalik@outlook.com"
    },
    {
      name: "Dr. Gugs Lushai",
      role: "Founding Member",
      bio: "Social Entrepreneur and Fractional Executive has mobilised £900M+ into global infrastructure and innovation - transforming bold ideas into investment-ready ventures with risk-managed execution and measurable social impact.",
      expertise: "Entrepreneurship, Strategic Leadership, Emerging Markets",
      image: "https://drive.google.com/file/d/1TgpBb9WP2IngD6IyQb9__IO4WdAey-PO/view?usp=sharing",
      linkedin: "https://www.linkedin.com/in/gugslushaiphd/",
      email: "gugs@lifesciences-healthcare.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="flex justify-start mb-6">
            <Button asChild className="bg-white text-navy hover:bg-gray-100 font-semibold px-6 py-2">
              <Link to="/">
                ← Back to Home
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white">
              About Shared Wealth International
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90 mb-8">
              From three decades of social enterprise innovation to flexible wealth sharing models. 
              We help businesses create equitable frameworks that benefit everyone.
            </p>
            
            {/* Key Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gold">{stat.value}</div>
                    <div className="text-white/80">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* Our Journey Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From pioneering the social enterprise movement to creating the Shared Wealth model - 
              three decades of innovation and impact.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {journeyTimeline.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={index} className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge variant="outline" className="text-sm font-medium">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-navy">{milestone.title}</h3>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Key Insights from Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lessons learned from three decades of practice and innovation in shared wealth models.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {keyInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gold/10">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <CardTitle className="text-navy text-center">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{insight.description}</p>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-l-4 border-gold">
                      <p className="text-sm font-medium text-navy italic">"{insight.quote}"</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the visionary leaders driving the global Shared Wealth movement
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {leadership.map((leader, index) => (
              <Card key={leader.name} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold/30">
                    {leader.image ? (
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    ) : null}
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-blue-500 to-green-500">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-navy">{leader.name}</CardTitle>
                  <CardDescription className="font-medium text-gray-600">
                    {leader.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 text-gray-600">{leader.bio}</p>
                  <div className="border-t pt-4 mb-4 border-gray-200">
                    <p className="text-xs font-semibold mb-1 text-navy">Expertise:</p>
                    <p className="text-xs text-gray-600">{leader.expertise}</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" asChild className="border-navy text-navy hover:bg-navy hover:text-white">
                      <a href={leader.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-navy text-navy hover:bg-navy hover:text-white">
                      <a href={`mailto:${leader.email}`}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, hsl(45 100% 50%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-navy">Join the Shared Wealth Movement</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-navy/80">
            Be part of the transformation. Whether you're a business leader, employee, 
            or community member, there's a place for you in our network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 bg-navy hover:bg-navy-light text-white font-semibold">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" className="text-lg px-8 bg-green hover:bg-green/90 text-white font-semibold">
              <Link to="/network">Explore Network</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;