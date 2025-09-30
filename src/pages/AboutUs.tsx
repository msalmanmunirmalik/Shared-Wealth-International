import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart,
  Target,
  Users,
  Globe,
  Award,
  Star,
  ArrowRight,
  Calendar,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from '@/services/api';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar_url: string;
  position: string;
  company_name: string;
  location: string;
  website: string;
  linkedin: string;
  twitter: string;
  role: string;
  email: string;
}

const AboutUs = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      // Load directors and founding members for the About Us page
      const [directorsResponse, foundingMembersResponse] = await Promise.all([
        apiService.getTeamMembers('director'),
        apiService.getTeamMembers('founding_member')
      ]);

      const directors = directorsResponse.success ? directorsResponse.data || [] : [];
      const foundingMembers = foundingMembersResponse.success ? foundingMembersResponse.data || [] : [];
      
      // Combine and format the data
      const allMembers = [...directors, ...foundingMembers].map(member => ({
        ...member,
        name: `${member.first_name} ${member.last_name}`,
        featured: member.role === 'director' || member.role === 'founding_member',
        expertise: member.position ? [member.position] : ['Leadership', 'Strategy'],
        email: member.email
      }));

      setTeamMembers(allMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
      setError('Failed to load team members');
      // Fallback to hardcoded data if API fails
      setTeamMembers([
        {
          id: '1',
          first_name: 'Cliff',
          last_name: 'Southcombe',
          name: 'Cliff Southcombe',
          role: 'Founder & CEO',
          bio: 'Pioneering sustainable business models with 25+ years of experience in social enterprise and community development.',
          avatar_url: '/lovable-uploads/cliff-southcombe.png',
          position: 'Founder & CEO',
          company_name: 'Shared Wealth International',
          expertise: ['Social Enterprise', 'Community Development', 'Sustainable Business'],
          location: 'Wales, UK',
          email: 'socialenterpriseuk@gmail.com',
          linkedin: 'https://www.linkedin.com/in/cliff-southcombe-052b8a1/',
          twitter: '',
          website: '',
          featured: true
        },
        {
          id: '2',
          first_name: 'Dr. Salman',
          last_name: 'Malik',
          name: 'Dr. Salman Malik',
          role: 'Chief Technology Officer',
          bio: 'Technology leader driving digital transformation and innovation in sustainable business practices.',
          avatar_url: '/lovable-uploads/amad-sami.png',
          position: 'Chief Technology Officer',
          company_name: 'Shared Wealth International',
          expertise: ['Digital Innovation', 'Technology Strategy', 'Sustainable Tech'],
          location: 'San Francisco, CA',
          email: 'salman@sharedwealth.org',
          linkedin: 'https://linkedin.com/in/salmanmalik',
          twitter: 'https://twitter.com/salmanmalik',
          website: '',
          featured: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback hardcoded team members for when API is not available
  const fallbackTeamMembers = [
    {
      name: "Cliff Southcombe",
      role: "Founder & CEO",
      bio: "Pioneering sustainable business models with 25+ years of experience in social enterprise and community development.",
      avatar: "/lovable-uploads/cliff-southcombe.png",
      expertise: ["Social Enterprise", "Community Development", "Sustainable Business"],
      location: "Wales, UK",
      email: "cliff@sharedwealth.org",
      linkedin: "https://linkedin.com/in/cliffsouthcombe",
      twitter: "https://twitter.com/cliffsouthcombe",
      featured: true
    },
    {
      name: "Dr. Salman Malik",
      role: "Chief Technology Officer",
      bio: "Technology leader driving digital transformation and innovation in sustainable business practices.",
      avatar: "/lovable-uploads/amad-sami.png",
      expertise: ["Digital Innovation", "Technology Strategy", "Sustainable Tech"],
      location: "San Francisco, CA",
      email: "salman@sharedwealth.org",
      linkedin: "https://linkedin.com/in/salmanmalik",
      twitter: "https://twitter.com/salmanmalik",
      featured: true
    },
    {
      name: "James Perry",
      role: "Head of Partnerships",
      bio: "Building strategic partnerships and fostering collaboration between businesses, governments, and communities.",
      avatar: "/placeholder.svg",
      expertise: ["Strategic Partnerships", "Stakeholder Engagement", "Business Development"],
      location: "London, UK",
      email: "james@sharedwealth.org",
      linkedin: "https://linkedin.com/in/jamesperry",
      twitter: "https://twitter.com/jamesperry",
      featured: false
    },
    {
      name: "Sarah Johnson",
      role: "Impact Measurement Lead",
      bio: "Expert in measuring and quantifying social and environmental impact for sustainable business initiatives.",
      avatar: "/placeholder.svg",
      expertise: ["Impact Measurement", "Data Analytics", "ESG Reporting"],
      location: "Amsterdam, Netherlands",
      email: "sarah@sharedwealth.org",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson",
      featured: false
    },
    {
      name: "Michael Rodriguez",
      role: "Community Engagement Director",
      bio: "Connecting businesses with communities to create meaningful and lasting positive impact.",
      avatar: "/placeholder.svg",
      expertise: ["Community Engagement", "Social Impact", "Stakeholder Relations"],
      location: "Austin, TX",
      email: "michael@sharedwealth.org",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      twitter: "https://twitter.com/michaelrodriguez",
      featured: false
    },
    {
      name: "Emma Thompson",
      role: "Learning & Development Manager",
      bio: "Designing educational programs and resources to empower businesses in their shared wealth journey.",
      avatar: "/placeholder.svg",
      expertise: ["Learning Design", "Capacity Building", "Educational Technology"],
      location: "Toronto, Canada",
      email: "emma@sharedwealth.org",
      linkedin: "https://linkedin.com/in/emmathompson",
      twitter: "https://twitter.com/emmathompson",
      featured: false
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Foundation",
      description: "Shared Wealth International was founded with a vision to transform business practices for the common good.",
      icon: Heart
    },
    {
      year: "2019",
      title: "First Partnerships",
      description: "Established partnerships with 10 pioneering companies committed to shared wealth principles.",
      icon: Users
    },
    {
      year: "2020",
      title: "Digital Platform Launch",
      description: "Launched our comprehensive digital platform to support businesses in their shared wealth journey.",
      icon: Globe
    },
    {
      year: "2021",
      title: "European Expansion",
      description: "Expanded operations across Europe, reaching 50+ partner companies and 1000+ business leaders.",
      icon: TrendingUp
    },
    {
      year: "2022",
      title: "Impact Recognition",
      description: "Recognized as a leading organization in sustainable business transformation and social impact.",
      icon: Award
    },
    {
      year: "2023",
      title: "Global Network",
      description: "Built a global network of 200+ companies across 25 countries, creating €50M+ in shared value.",
      icon: Star
    },
    {
      year: "2024",
      title: "Innovation Hub",
      description: "Launched our innovation hub to accelerate the development of next-generation shared wealth solutions.",
      icon: Lightbulb
    }
  ];

  const values = [
    {
      title: "Collaboration",
      description: "We believe in the power of partnerships and collective action to create meaningful change.",
      icon: Users,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      title: "Innovation",
      description: "We continuously innovate to develop cutting-edge solutions for sustainable business transformation.",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    {
      title: "Integrity",
      description: "We operate with transparency, honesty, and accountability in all our relationships and actions.",
      icon: Shield,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      title: "Impact",
      description: "We measure our success by the positive impact we create for businesses, communities, and the environment.",
      icon: Target,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    }
  ];

  return (
    <div className="p-6 space-y-12" style={{ backgroundColor: 'rgb(224, 230, 235)' }}>
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Heart className="w-10 h-10" style={{ color: 'rgb(245, 158, 11)' }} />
          <h1 className="text-5xl font-bold" style={{ color: 'rgb(30, 58, 138)' }}>
            About Shared Wealth International
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          We are a global movement dedicated to transforming business practices for the common good. 
          Our mission is to create a world where businesses thrive by creating value for all stakeholders - 
          shareholders, employees, communities, and the environment.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Globe className="w-4 h-4 mr-1" />
            Global Network
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Award className="w-4 h-4 mr-1" />
            Award Winning
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Star className="w-4 h-4 mr-1" />
            Industry Leader
          </Badge>
        </div>
      </div>

      {/* Background Story */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Our Story
        </h2>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: 'rgb(30, 58, 138)' }}>
                  The Beginning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Founded in 2018 by Cliff Southcombe, Shared Wealth International emerged from a simple yet powerful 
                  observation: traditional business models were creating wealth for shareholders while leaving 
                  communities and the environment behind.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  What started as a small initiative in Wales has grown into a global movement, connecting 
                  businesses, communities, and innovators who believe in creating shared value for all stakeholders.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: 'rgb(30, 58, 138)' }}>
                  The Transformation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Today, we work with over 200 companies across 25 countries, helping them implement 
                  shared wealth principles that create sustainable value for everyone involved.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our digital platform, tools, and community support businesses in measuring impact, 
                  building partnerships, and creating lasting positive change in their communities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
              <CardTitle className="text-2xl" style={{ color: 'rgb(30, 58, 138)' }}>
                Our Vision
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              A world where businesses are engines of positive change, creating sustainable value that benefits 
              shareholders, employees, communities, and the environment equally.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-sm">Businesses as community partners</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-sm">Sustainable economic growth</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-sm">Environmental stewardship</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" style={{ color: 'rgb(245, 158, 11)' }} />
              <CardTitle className="text-2xl" style={{ color: 'rgb(30, 58, 138)' }}>
                Our Mission
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              To empower businesses with the tools, knowledge, and community support they need to implement 
              shared wealth principles and create lasting positive impact.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-sm">Provide comprehensive tools and resources</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-sm">Build a supportive global community</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-sm">Measure and celebrate impact</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-lg ${value.color}`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Our Journey
        </h2>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: 'rgb(245, 158, 11)' }}>
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <milestone.icon className="w-6 h-6" style={{ color: 'rgb(245, 158, 11)' }} />
                      <h3 className="text-xl font-semibold" style={{ color: 'rgb(30, 58, 138)' }}>
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                {index < milestones.length - 1 && (
                  <div className="absolute bottom-0 left-8 transform translate-y-full">
                    <ArrowRight className="w-6 h-6 rotate-90" style={{ color: 'rgb(245, 158, 11)' }} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'rgb(30, 58, 138)' }}>
          Meet Our Team
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Showing default team information</p>
          </div>
        ) : (
          <>
            {/* Featured Team Members */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {teamMembers.filter(member => member.featured).map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-20 h-20">
                        <AvatarImage src={member.avatar_url || member.avatar} />
                    <AvatarFallback className="text-xl" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1" style={{ color: 'rgb(30, 58, 138)' }}>
                      {member.name}
                    </h3>
                    <p className="text-lg font-medium mb-2" style={{ color: 'rgb(245, 158, 11)' }}>
                      {member.role}
                    </p>
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${member.email}`} className="hover:underline">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.filter(member => !member.featured).map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                        <AvatarImage src={member.avatar_url || member.avatar} />
                  <AvatarFallback className="text-lg" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium" style={{ color: 'rgb(245, 158, 11)' }}>
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {member.expertise.slice(0, 2).map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{member.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
          </>
        )}
      </div>

      {/* Call to Action */}
      <Card className="text-center" style={{ backgroundColor: 'white', borderColor: 'rgb(245, 158, 11)' }}>
        <CardContent className="p-8">
          <Users className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgb(245, 158, 11)' }} />
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'rgb(30, 58, 138)' }}>
            Join Our Mission
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ready to transform your business and create lasting positive impact? 
            Join our global community of shared wealth pioneers.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" asChild style={{ backgroundColor: 'rgb(30, 58, 138)' }}>
              <Link to="/resources">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Tools & Learning
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild style={{ borderColor: 'rgb(245, 158, 11)', color: 'rgb(245, 158, 11)' }}>
              <Link to="/network">
                <Users className="w-5 h-5 mr-2" />
                Join Network
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUs; 