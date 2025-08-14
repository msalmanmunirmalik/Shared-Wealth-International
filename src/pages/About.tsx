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
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Shared Prosperity",
      description: "We believe wealth should be shared equitably among all stakeholders"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building strong communities through collaborative business models"
    },
    {
      icon: Target,
      title: "Sustainable Impact",
      description: "Creating lasting positive change for future generations"
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "Open and honest practices in all our partnerships"
    }
  ];

  const stats = [
    { label: "Network Companies", value: "24", icon: Users },
    { label: "Countries", value: "12", icon: Globe },
    { label: "Total Shared Value", value: "$2.4M", icon: TrendingUp },
    { label: "Impact Score", value: "8.7/10", icon: Star }
  ];

  const leadership = [
    {
      name: "Cliff Southcombe",
      role: "Founder & Director",
      bio: "Visionary leader driving the global Shared Wealth movement with over 20 years of experience in sustainable business models.",
      expertise: "Strategic Planning, Stakeholder Engagement, Social Impact",
      image: "/lovable-uploads/f7f6d7bf-0c80-41f2-885b-a2678b1733ef.png",
      linkedin: "#",
      email: "cliff@sharedwealth.org"
    },
    {
      name: "James Perry",
      role: "Founder & Director",
      bio: "Expert in innovative ownership structures and democratic governance frameworks for equitable wealth distribution.",
      expertise: "Corporate Governance, Phantom Shares, Inclusive Decision-Making",
      image: "/lovable-uploads/a04db650-e312-4313-9485-632a58b8fbf5.png",
      linkedin: "#",
      email: "james@sharedwealth.org"
    },
    {
      name: "Dr. Muhammad Salman Munir Malik",
      role: "Director Global Initiatives and Learning",
      bio: "Strategic expert leading global partnerships and educational programs to expand Shared Wealth principles worldwide.",
      expertise: "Strategic Planning & Execution, Global Partnership Development, Training & Educational Programs",
      image: "/lovable-uploads/ab71454c-fd1a-4ed4-995d-21ccae08f423.png",
      linkedin: "#",
      email: "salman@sharedwealth.org"
    },
    {
      name: "Amad Sami",
      role: "Director, Shared Wealth International",
      bio: "Entrepreneurial leader advancing equitable wealth distribution through strategic ventures across Europe and the Middle East.",
      expertise: "Entrepreneurship, Strategic Leadership, Emerging Markets, Social Innovation",
      image: "/lovable-uploads/amad-sami.png",
      linkedin: "#",
      email: "amad@sharedwealth.org"
    },
    {
      name: "Sarah Chen",
      role: "Director of Operations",
      bio: "Operations specialist with deep expertise in scaling social enterprises and implementing shared wealth models.",
      expertise: "Operations Management, Process Optimization, Change Management",
      image: "",
      linkedin: "#",
      email: "sarah@sharedwealth.org"
    },
    {
      name: "Marcus Rodriguez",
      role: "Director of Technology",
      bio: "Technology leader developing digital platforms for transparent governance and stakeholder engagement.",
      expertise: "Digital Platforms, Blockchain, Governance Technology",
      image: "",
      linkedin: "#",
      email: "marcus@sharedwealth.org"
    },
    {
      name: "Dr. Elena Petrova",
      role: "Director of Research",
      bio: "Research expert analyzing the impact of shared wealth models and developing evidence-based frameworks.",
      expertise: "Impact Measurement, Data Analysis, Academic Research",
      image: "",
      linkedin: "#",
      email: "elena@sharedwealth.org"
    },
    {
      name: "David Kim",
      role: "Director of Partnerships",
      bio: "Partnership strategist building collaborative networks with corporations, governments, and NGOs.",
      expertise: "Partnership Development, Stakeholder Relations, Network Building",
      image: "",
      linkedin: "#",
      email: "david@sharedwealth.org"
    },
    {
      name: "Fatima Al-Zahra",
      role: "Director of Communications",
      bio: "Communications expert amplifying the shared wealth message and building global awareness.",
      expertise: "Strategic Communications, Public Relations, Content Strategy",
      image: "",
      linkedin: "#",
      email: "fatima@sharedwealth.org"
    },
    {
      name: "Robert Thompson",
      role: "Director of Finance",
      bio: "Financial expert ensuring sustainable funding models and transparent financial management.",
      expertise: "Financial Management, Investment Strategy, Risk Assessment",
      image: "",
      linkedin: "#",
      email: "robert@sharedwealth.org"
    },
    {
      name: "Dr. Priya Patel",
      role: "Director of Education",
      bio: "Education specialist developing training programs and educational resources for shared wealth implementation.",
      expertise: "Curriculum Development, Training Programs, Educational Technology",
      image: "",
      linkedin: "#",
      email: "priya@sharedwealth.org"
    },
    {
      name: "Carlos Mendez",
      role: "Director of Latin America",
      bio: "Regional leader expanding shared wealth principles across Latin American markets and communities.",
      expertise: "Latin American Markets, Cultural Adaptation, Regional Development",
      image: "",
      linkedin: "#",
      email: "carlos@sharedwealth.org"
    },
    {
      name: "Yuki Tanaka",
      role: "Director of Asia Pacific",
      bio: "Regional expert advancing shared wealth models in Asian markets with cultural sensitivity.",
      expertise: "Asian Markets, Cultural Integration, Regional Strategy",
      image: "",
      linkedin: "#",
      email: "yuki@sharedwealth.org"
    },
    {
      name: "Aisha Johnson",
      role: "Director of Africa",
      bio: "Regional leader implementing shared wealth solutions across African communities and businesses.",
      expertise: "African Markets, Community Development, Local Partnerships",
      image: "",
      linkedin: "#",
      email: "aisha@sharedwealth.org"
    },
    {
      name: "Dr. Hans Mueller",
      role: "Director of Europe",
      bio: "European expert advancing shared wealth principles across EU markets and regulatory frameworks.",
      expertise: "European Markets, Regulatory Compliance, EU Policy",
      image: "",
      linkedin: "#",
      email: "hans@sharedwealth.org"
    },
    {
      name: "Lisa Anderson",
      role: "Director of Legal Affairs",
      bio: "Legal expert ensuring compliance and developing legal frameworks for shared wealth implementation.",
      expertise: "Legal Compliance, Regulatory Affairs, Contract Law",
      image: "",
      linkedin: "#",
      email: "lisa@sharedwealth.org"
    },
    {
      name: "Michael O'Connor",
      role: "Director of Innovation",
      bio: "Innovation leader developing new models and technologies for enhanced shared wealth implementation.",
      expertise: "Innovation Strategy, Technology Development, Model Design",
      image: "",
      linkedin: "#",
      email: "michael@sharedwealth.org"
    },
    {
      name: "Dr. Rachel Green",
      role: "Director of Sustainability",
      bio: "Sustainability expert ensuring environmental responsibility in all shared wealth initiatives.",
      expertise: "Environmental Sustainability, ESG Standards, Green Business Models",
      image: "",
      linkedin: "#",
      email: "rachel@sharedwealth.org"
    },
    {
      name: "Ahmed Hassan",
      role: "Director of Middle East",
      bio: "Regional leader expanding shared wealth principles across Middle Eastern markets and cultures.",
      expertise: "Middle Eastern Markets, Islamic Finance, Cultural Integration",
      image: "",
      linkedin: "#",
      email: "ahmed@sharedwealth.org"
    },
    {
      name: "Jennifer Walsh",
      role: "Director of Human Resources",
      bio: "HR expert developing inclusive workplace practices and employee engagement strategies.",
      expertise: "Human Resources, Employee Engagement, Workplace Culture",
      image: "",
      linkedin: "#",
      email: "jennifer@sharedwealth.org"
    },
    {
      name: "Dr. Thomas Wright",
      role: "Director of Policy",
      bio: "Policy expert advocating for regulatory frameworks that support shared wealth principles.",
      expertise: "Policy Development, Government Relations, Regulatory Advocacy",
      image: "",
      linkedin: "#",
      email: "thomas@sharedwealth.org"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto container-padding">
          <div className="flex justify-start mb-6">
            <Button asChild className="bg-white text-navy hover:bg-gray-100 font-semibold px-6 py-2">
              <Link to="/">
                ← Back to Home
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="heading-1 mb-6 text-white">About Shared Wealth International</h1>
            <p className="body-large max-w-3xl mx-auto text-white/90">
              We are a global network dedicated to transforming business models through equitable wealth distribution, 
              inclusive decision-making, and sustainable value creation for all stakeholders.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Our Mission</h2>
            <p className="body-large mb-8">
              To create a world where businesses thrive by sharing their success with all stakeholders. 
              We believe that when companies share wealth equitably, everyone benefits - employees, 
              communities, shareholders, and the planet.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="card-professional p-8">
                <h3 className="heading-3 mb-4 text-navy">Our Vision</h3>
                <p className="body-medium">
                  A global economy where every business operates on principles of shared wealth, 
                  creating sustainable prosperity for all.
                </p>
              </div>
              <div className="card-professional p-8">
                <h3 className="heading-3 mb-4 text-navy">Our Approach</h3>
                <p className="body-medium">
                  We provide frameworks, tools, and support to help businesses implement 
                  equitable wealth distribution models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="card-professional text-center hover-lift">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gold/10">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <CardTitle className="text-navy">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-navy/10">
                    <Icon className="w-8 h-8 text-navy" />
                  </div>
                  <div className="text-3xl font-bold mb-2 text-navy">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4 text-white">Leadership Team</h2>
            <p className="body-large text-white/90 max-w-2xl mx-auto">
              Meet the visionary leaders driving the global Shared Wealth movement
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((leader, index) => (
              <Card key={leader.name} className="card-professional hover-lift">
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
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-accent">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-navy">{leader.name}</CardTitle>
                  <CardDescription className="font-medium text-muted-foreground">
                    {leader.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 text-muted-foreground">{leader.bio}</p>
                  <div className="border-t pt-4 mb-4 border-border">
                    <p className="text-xs font-semibold mb-1 text-foreground">Expertise:</p>
                    <p className="text-xs text-muted-foreground">{leader.expertise}</p>
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
      <section className="section-padding-sm bg-gradient-hero">
        <div className="container mx-auto container-padding text-center">
          <h2 className="heading-2 mb-6 text-white">Join the Shared Wealth Movement</h2>
          <p className="body-large mb-8 max-w-2xl mx-auto text-white/90">
            Be part of the transformation. Whether you're a business leader, employee, 
            or community member, there's a place for you in our network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-lg px-8 bg-white text-navy hover:bg-white/90">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" className="btn-outline text-lg px-8 border-white text-white hover:bg-white hover:text-navy">
              <Link to="/network">Explore Network</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;