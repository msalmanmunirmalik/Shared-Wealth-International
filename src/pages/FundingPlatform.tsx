import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, 
  Target, 
  Lightbulb, 
  Users, 
  Globe, 
  Calendar,
  Search,
  Filter,
  Bookmark,
  Share2,
  Download,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  MapPin,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  MessageCircle,
  Star,
  Award,
  X,
  Zap,
  Heart,
  ArrowRight,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock4
} from "lucide-react";

interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  agency: string;
  category: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  requirements: string[];
  applicationProcess: string;
  contactInfo: string;
  website: string;
  tags: string[];
  isActive: boolean;
  matchScore?: number;
  matchReasons?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface FundingMatch {
  id: string;
  opportunityId: string;
  companyId: string;
  matchScore: number;
  matchReasons: string[];
  status: 'pending' | 'interested' | 'applied' | 'awarded' | 'rejected';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  country: string;
  description: string;
  highlights: string[];
  impactScore: number;
}

const FundingPlatform = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<FundingOpportunity[]>([]);
  const [matches, setMatches] = useState<FundingMatch[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("opportunities");

  // Add Funding Form State
  const [newFunding, setNewFunding] = useState({
    title: "",
    description: "",
    agency: "",
    category: "",
    amount: "",
    deadline: "",
    eligibility: "",
    requirements: "",
    applicationProcess: "",
    contactInfo: "",
    website: "",
    tags: ""
  });

  useEffect(() => {
    if (user) {
      loadFundingData();
      loadCompanyProfile();
    }
  }, [user]);

  useEffect(() => {
    filterOpportunities();
  }, [searchTerm, selectedCategory, selectedAmount, opportunities]);

  const loadFundingData = async () => {
    try {
      setIsLoading(true);
      
      // For now, create sample data since database tables don't exist yet
      createSampleFundingData();

      // Load user's funding matches from local state
      if (user) {
        // For now, use empty matches array
        setMatches([]);
      }

    } catch (error) {
      console.error('Error loading funding data:', error);
      createSampleFundingData();
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleFundingData = () => {
    const sampleOpportunities: FundingOpportunity[] = [
      {
        id: '1',
        title: 'Green Innovation Fund',
        description: 'Funding for companies developing sustainable technologies and green solutions',
        agency: 'European Green Deal',
        category: 'Sustainability',
        amount: '€500,000 - €2,000,000',
        deadline: '2024-12-31',
        eligibility: ['EU-based companies', 'Sustainable focus', 'Innovation-driven'],
        requirements: ['Business plan', 'Impact assessment', 'Financial projections'],
        applicationProcess: 'Online application with supporting documents',
        contactInfo: 'greenfund@eu.eu',
        website: 'https://example.com/green-fund',
        tags: ['Sustainability', 'Innovation', 'Green Tech'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        title: 'Shared Wealth Accelerator',
        description: 'Accelerator program for companies implementing shared wealth models',
        agency: 'Shared Wealth International',
        category: 'Business Model',
        amount: '€100,000 - €500,000',
        deadline: '2024-10-15',
        eligibility: ['Shared wealth principles', 'Growth potential', 'Social impact'],
        requirements: ['Shared wealth implementation plan', 'Stakeholder engagement strategy'],
        applicationProcess: 'Multi-stage application with pitch deck',
        contactInfo: 'accelerator@sharedwealth.org',
        website: 'https://sharedwealth.org/accelerator',
        tags: ['Shared Wealth', 'Accelerator', 'Social Impact'],
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    setOpportunities(sampleOpportunities);
  };

  const loadCompanyProfile = async () => {
    if (!user) return;

    try {
      // For now, create a default company profile since we don't have the database table yet
      setCompanyProfile({
        id: 'default',
        name: 'Your Company',
        sector: 'Technology',
        country: 'United Kingdom',
        description: 'Innovative company implementing shared wealth principles',
        highlights: ['Sustainable practices', 'Employee ownership', 'Community impact'],
        impactScore: 8.5
      });
    } catch (error) {
      console.error('Error loading company profile:', error);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(opportunity =>
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(opportunity => opportunity.category === selectedCategory);
    }

    // Amount filter
    if (selectedAmount !== 'all') {
      filtered = filtered.filter(opportunity => {
        const amount = opportunity.amount.toLowerCase();
        switch (selectedAmount) {
          case 'small':
            return amount.includes('€100,000') || amount.includes('$100,000');
          case 'medium':
            return amount.includes('€500,000') || amount.includes('$500,000');
          case 'large':
            return amount.includes('€2,000,000') || amount.includes('$2,000,000');
          default:
            return true;
        }
      });
    }

    setFilteredOpportunities(filtered);
  };

  const handleAddFunding = async () => {
    try {
      if (!newFunding.title || !newFunding.description || !newFunding.agency) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Create new funding opportunity
      const newOpportunity: FundingOpportunity = {
        id: Date.now().toString(),
        title: newFunding.title,
        description: newFunding.description,
        agency: newFunding.agency,
        category: newFunding.category,
        amount: newFunding.amount,
        deadline: newFunding.deadline,
        eligibility: newFunding.eligibility.split(',').map(item => item.trim()),
        requirements: newFunding.requirements.split(',').map(item => item.trim()),
        applicationProcess: newFunding.applicationProcess,
        contactInfo: newFunding.contactInfo,
        website: newFunding.website,
        tags: newFunding.tags.split(',').map(item => item.trim()),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to local state for now
      setOpportunities(prev => [newOpportunity, ...prev]);

      toast({
        title: "Success",
        description: "Funding opportunity added successfully",
      });

      setShowCreateDialog(false);
      setNewFunding({
        title: "",
        description: "",
        agency: "",
        category: "",
        amount: "",
        deadline: "",
        eligibility: "",
        requirements: "",
        applicationProcess: "",
        contactInfo: "",
        website: "",
        tags: ""
      });

    } catch (error) {
      console.error('Error adding funding opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to add funding opportunity",
        variant: "destructive"
      });
    }
  };

  const calculateMatchScore = (opportunity: FundingOpportunity): number => {
    if (!companyProfile) return 0;

    let score = 0;
    const reasons: string[] = [];

    // Sector match
    if (opportunity.category.toLowerCase().includes(companyProfile.sector.toLowerCase())) {
      score += 25;
      reasons.push('Sector alignment');
    }

    // Impact focus
    if (opportunity.description.toLowerCase().includes('impact') || 
        opportunity.description.toLowerCase().includes('social')) {
      score += 20;
      reasons.push('Social impact focus');
    }

    // Shared wealth alignment
    if (opportunity.description.toLowerCase().includes('shared') || 
        opportunity.description.toLowerCase().includes('wealth') ||
        opportunity.description.toLowerCase().includes('stakeholder')) {
      score += 30;
      reasons.push('Shared wealth alignment');
    }

    // Company size match
    if (opportunity.amount.includes('€100,000') && companyProfile.impactScore < 7) {
      score += 15;
      reasons.push('Size appropriate');
    }

    // Geographic match
    if (opportunity.agency.toLowerCase().includes('european') && 
        companyProfile.country.toLowerCase().includes('united kingdom')) {
      score += 10;
      reasons.push('Geographic eligibility');
    }

    return Math.min(score, 100);
  };

  const handleApplyForFunding = (opportunity: FundingOpportunity) => {
    const matchScore = calculateMatchScore(opportunity);
    const matchReasons = matchScore > 0 ? ['High alignment with company profile'] : ['Limited alignment'];

    const newMatch: FundingMatch = {
      id: Date.now().toString(),
      opportunityId: opportunity.id,
      companyId: companyProfile?.id || '',
      matchScore,
      matchReasons,
      status: 'interested',
      notes: 'Interested in this opportunity',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMatches(prev => [newMatch, ...prev]);

    toast({
      title: "Application Started",
      description: `Application submitted for ${opportunity.title}`,
    });
  };

  const getCategories = () => {
    const categories = [...new Set(opportunities.map(opp => opp.category))];
    return categories.sort();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awarded':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'applied':
        return <Clock4 className="w-4 h-4 text-blue-500" />;
      case 'interested':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awarded':
        return 'bg-green-100 text-green-800';
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interested':
        return 'bg-pink-100 text-pink-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading Funding Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Funding Platform</h1>
              <p className="text-lg text-gray-600">AI-powered funding opportunities and partnerships</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={loadFundingData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Funding
              </Button>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{matches.filter(m => m.status === 'interested' || m.status === 'applied').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Awarded</p>
                  <p className="text-2xl font-bold text-gray-900">{matches.filter(m => m.status === 'awarded').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">€{opportunities.reduce((sum, opp) => {
                    const amount = opp.amount.match(/€(\d+(?:,\d+)*)/);
                    return sum + (amount ? parseInt(amount[1].replace(/,/g, '')) : 0);
                  }, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="opportunities">Funding Opportunities</TabsTrigger>
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Funding Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search funding opportunities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {getCategories().map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Amounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Amounts</SelectItem>
                        <SelectItem value="small">Small (€100K)</SelectItem>
                        <SelectItem value="medium">Medium (€500K)</SelectItem>
                        <SelectItem value="large">Large (€2M+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOpportunities.map((opportunity) => {
                const matchScore = calculateMatchScore(opportunity);
                const isApplied = matches.some(m => m.opportunityId === opportunity.id);
                
                return (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{opportunity.title}</CardTitle>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">{opportunity.category}</Badge>
                            <Badge variant="outline">{opportunity.agency}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {opportunity.amount}
                          </div>
                          <div className="text-sm text-gray-500">
                            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {opportunity.description}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Eligibility:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {opportunity.eligibility.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Tags:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {opportunity.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {companyProfile && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800">Match Score:</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${matchScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-blue-800">{matchScore}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApplyForFunding(opportunity)}
                            disabled={isApplied}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Applied
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Apply Now
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        {opportunity.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={opportunity.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredOpportunities.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Funding Opportunities Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== 'all' || selectedAmount !== 'all'
                      ? 'Try adjusting your search criteria'
                      : 'Be the first to add a funding opportunity!'}
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funding Opportunity
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Funding Matches</h2>
              <Badge variant="secondary" className="text-sm">
                {matches.length} Matches
              </Badge>
            </div>

            {matches.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start applying for funding opportunities to see your matches here
                  </p>
                  <Button onClick={() => setActiveTab("opportunities")}>
                    Browse Opportunities
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => {
                  const opportunity = opportunities.find(opp => opp.id === match.opportunityId);
                  
                  return (
                    <Card key={match.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              {getStatusIcon(match.status)}
                              <h3 className="text-lg font-semibold text-gray-900">
                                {opportunity?.title || 'Unknown Opportunity'}
                              </h3>
                              <Badge className={getStatusColor(match.status)}>
                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Match Score</Label>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${match.matchScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-bold text-gray-900">{match.matchScore}%</span>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Applied Date</Label>
                                <p className="text-sm text-gray-600 mt-1">
                                  {new Date(match.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Opportunity Value</Label>
                                <p className="text-sm text-gray-600 mt-1">
                                  {opportunity?.amount || 'N/A'}
                                </p>
                              </div>
                            </div>

                            {match.notes && (
                              <div className="mb-4">
                                <Label className="text-sm font-medium text-gray-700">Notes</Label>
                                <p className="text-sm text-gray-600 mt-1">{match.notes}</p>
                              </div>
                            )}

                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Contact
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Documents
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Analytics</CardTitle>
                <CardDescription>Track your funding applications and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Funding analytics and charts will be displayed here</p>
                    <p className="text-sm">Coming soon with real-time data visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Funding Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Funding Opportunity</DialogTitle>
            <DialogDescription>
              Share a funding opportunity with the Shared Wealth International community
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Opportunity Title *</Label>
              <Input
                id="title"
                value={newFunding.title}
                onChange={(e) => setNewFunding({...newFunding, title: e.target.value})}
                placeholder="Enter funding opportunity title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agency">Funding Agency *</Label>
              <Input
                id="agency"
                value={newFunding.agency}
                onChange={(e) => setNewFunding({...newFunding, agency: e.target.value})}
                placeholder="Enter funding agency name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={newFunding.category} onValueChange={(value) => setNewFunding({...newFunding, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sustainability">Sustainability</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Business Model">Business Model</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Social Impact">Social Impact</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Funding Amount *</Label>
              <Input
                id="amount"
                value={newFunding.amount}
                onChange={(e) => setNewFunding({...newFunding, amount: e.target.value})}
                placeholder="e.g., €100,000 - €500,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={newFunding.deadline}
                onChange={(e) => setNewFunding({...newFunding, deadline: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={newFunding.website}
                onChange={(e) => setNewFunding({...newFunding, website: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={newFunding.description}
              onChange={(e) => setNewFunding({...newFunding, description: e.target.value})}
              placeholder="Describe the funding opportunity..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eligibility">Eligibility Criteria (comma-separated)</Label>
            <Input
              id="eligibility"
              value={newFunding.eligibility}
              onChange={(e) => setNewFunding({...newFunding, eligibility: e.target.value})}
              placeholder="e.g., EU-based companies, Sustainable focus, Innovation-driven"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
            <Input
              id="requirements"
              value={newFunding.requirements}
              onChange={(e) => setNewFunding({...newFunding, requirements: e.target.value})}
              placeholder="e.g., Business plan, Impact assessment, Financial projections"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="applicationProcess">Application Process</Label>
            <Textarea
              id="applicationProcess"
              value={newFunding.applicationProcess}
              onChange={(e) => setNewFunding({...newFunding, applicationProcess: e.target.value})}
              placeholder="Describe the application process..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="contactInfo"
              value={newFunding.contactInfo}
              onChange={(e) => setNewFunding({...newFunding, contactInfo: e.target.value})}
              placeholder="Email or phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={newFunding.tags}
              onChange={(e) => setNewFunding({...newFunding, tags: e.target.value})}
              placeholder="e.g., Sustainability, Innovation, Green Tech"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFunding}>
              Add Funding Opportunity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundingPlatform;
