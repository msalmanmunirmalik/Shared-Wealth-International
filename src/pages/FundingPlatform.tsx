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
import FundingService from "@/integrations/postgresql/fundingService";
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [smartRecommendations, setSmartRecommendations] = useState<FundingOpportunity[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

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
    const realOpportunities: FundingOpportunity[] = [
      {
        id: '1',
        title: 'Building a Long-Term Africa Union (AU) and European Union (EU) Research and Innovation joint collaboration on Sustainable Renewable Energies',
        description: 'This funding opportunity focuses on establishing long-term collaborative research and innovation partnerships between AU and EU entities in the field of sustainable renewable energies. The initiative aims to accelerate the transition to clean energy systems through joint research, technology development, and knowledge sharing.',
        agency: 'European Commission - HORIZON-CL5-2025-02-D3-15',
        category: 'Renewable Energy',
        amount: '€3,000,000 - €5,000,000',
        deadline: '2025-09-15',
        eligibility: ['AU and EU-based organizations', 'Research institutions', 'Technology companies', 'Energy sector entities'],
        requirements: ['Partnership between AU and EU entities', 'Innovation in renewable energy', 'Sustainable development focus', 'Clear collaboration framework'],
        applicationProcess: 'Two-stage application process with concept note and full proposal',
        contactInfo: 'energypartnership@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl5-2025-02-d3-15',
        tags: ['Renewable Energy', 'AU-EU Partnership', 'Research & Innovation', 'Sustainability'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: '2',
        title: 'Overcoming the barriers for scaling up circular water management in agriculture',
        description: 'This initiative addresses the critical need for sustainable water management in agricultural systems through circular economy principles. It focuses on developing innovative solutions to overcome technical, economic, and regulatory barriers to implementing circular water management practices in agriculture.',
        agency: 'European Commission - HORIZON-CL6-2025-02-FARM2FORK-03',
        category: 'Agriculture & Water Management',
        amount: '€2,500,000 - €4,000,000',
        deadline: '2025-08-20',
        eligibility: ['EU-based organizations', 'Agricultural research institutions', 'Water management companies', 'Environmental technology firms'],
        requirements: ['Circular economy approach', 'Agricultural water management focus', 'Scalability demonstration', 'Stakeholder engagement plan'],
        applicationProcess: 'Single-stage application with comprehensive project proposal',
        contactInfo: 'farm2fork@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-03',
        tags: ['Circular Economy', 'Water Management', 'Agriculture', 'Sustainability'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: '3',
        title: 'Developing a joint AU-EU Agricultural Knowledge and Innovation System (AKIS) supporting the Food and Nutrition Security and Sustainable Agriculture (FNSSA) partnership',
        description: 'This funding opportunity aims to establish a comprehensive Agricultural Knowledge and Innovation System that bridges AU and EU agricultural research and innovation capabilities. The system will support food security, nutrition, and sustainable agriculture practices through knowledge sharing and collaborative innovation.',
        agency: 'European Commission - HORIZON-CL6-2025-02-FARM2FORK-16',
        category: 'Agricultural Innovation',
        amount: '€4,000,000 - €6,000,000',
        deadline: '2025-10-10',
        eligibility: ['AU and EU research institutions', 'Agricultural organizations', 'Knowledge management entities', 'Food security experts'],
        requirements: ['AKIS framework development', 'FNSSA partnership support', 'Knowledge transfer mechanisms', 'Innovation capacity building'],
        applicationProcess: 'Multi-stage application with consortium formation',
        contactInfo: 'akis-fnssa@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-16',
        tags: ['Agricultural Innovation', 'Knowledge Systems', 'Food Security', 'AU-EU Partnership'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: '4',
        title: 'Culture, Creativity and Inclusive Society - 2025',
        description: 'This comprehensive funding program supports cultural and creative initiatives that promote social inclusion, diversity, and cultural heritage preservation. It encompasses projects ranging from digital cultural experiences to community-based cultural activities that strengthen social cohesion.',
        agency: 'European Commission - HORIZON-CL2-2025-01',
        category: 'Culture & Society',
        amount: '€500,000 - €2,500,000',
        deadline: '2025-07-15',
        eligibility: ['Cultural organizations', 'Creative industries', 'Social inclusion entities', 'Heritage preservation groups'],
        requirements: ['Cultural innovation focus', 'Social inclusion impact', 'Community engagement', 'Sustainability considerations'],
        applicationProcess: 'Open call with thematic priorities and regular deadlines',
        contactInfo: 'culture-creativity@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl2-2025-01',
        tags: ['Culture', 'Creativity', 'Social Inclusion', 'Heritage'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: '5',
        title: 'Nutrition in emergency situations - Ready-to-use Supplementary Food (RUSF) and Ready-to-use Therapeutic Food (RUTF)',
        description: 'This funding opportunity focuses on developing and improving ready-to-use nutritional products for emergency situations, particularly addressing malnutrition in crisis-affected populations. It supports innovation in food technology, packaging, and distribution systems for emergency nutrition.',
        agency: 'European Commission - HORIZON-CL6-2025-02-FARM2FORK-17',
        category: 'Emergency Nutrition',
        amount: '€1,500,000 - €3,000,000',
        deadline: '2025-09-30',
        eligibility: ['Food technology companies', 'Humanitarian organizations', 'Nutrition research institutions', 'Emergency response entities'],
        requirements: ['RUSF/RUTF development', 'Emergency situation focus', 'Nutritional efficacy', 'Distribution system innovation'],
        applicationProcess: 'Single-stage application with technical and humanitarian expertise',
        contactInfo: 'emergency-nutrition@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-17',
        tags: ['Emergency Nutrition', 'RUSF/RUTF', 'Humanitarian Aid', 'Food Technology'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: '6',
        title: 'DIGITAL - HADEA',
        description: 'This funding program supports digital transformation initiatives across various sectors, focusing on advanced digital technologies, artificial intelligence, and digital infrastructure development. It aims to accelerate Europe\'s digital competitiveness and technological sovereignty.',
        agency: 'European Commission - HORIZON-CL4-2025-04',
        category: 'Digital Technology',
        amount: '€2,000,000 - €5,000,000',
        deadline: '2025-11-15',
        eligibility: ['Technology companies', 'Digital innovation entities', 'AI research organizations', 'Digital infrastructure providers'],
        requirements: ['Digital innovation focus', 'Technology advancement', 'European digital sovereignty', 'Scalable solutions'],
        applicationProcess: 'Multi-stage application with technology readiness assessment',
        contactInfo: 'digital-hadea@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl4-2025-04',
        tags: ['Digital Technology', 'AI', 'Digital Infrastructure', 'Innovation'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      },
      {
        id: '7',
        title: 'Preparatory action for setting up joint programmes among innovation ecosystems actors',
        description: 'This initiative supports the establishment of collaborative programs between different innovation ecosystem actors, including startups, research institutions, corporations, and investors. It aims to create synergies and strengthen innovation networks across Europe.',
        agency: 'European Commission - HORIZON-EIE-2025-02-CONNECT-01',
        category: 'Innovation Ecosystems',
        amount: '€1,000,000 - €2,500,000',
        deadline: '2025-08-30',
        eligibility: ['Innovation hubs', 'Startup ecosystems', 'Research institutions', 'Corporate innovation teams'],
        requirements: ['Ecosystem collaboration', 'Innovation program design', 'Stakeholder engagement', 'Sustainability planning'],
        applicationProcess: 'Single-stage application with ecosystem mapping and partnership framework',
        contactInfo: 'innovation-ecosystems@ec.europa.eu',
        website: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-eie-2025-02-connect-01',
        tags: ['Innovation Ecosystems', 'Collaboration', 'Startups', 'Networking'],
        isActive: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01')
      }
    ];

    setOpportunities(realOpportunities);
  };

  const loadCompanyProfile = async () => {
    try {
      // Load user's actual company
      const userCompanies = await apiService.getUserCompanies();
      
      if (userCompanies && userCompanies.length > 0) {
        // Use the first company (primary company)
        const company = userCompanies[0];
        
        // Create keywords from company data
        const highlights = [
          company.industry || company.sector,
          company.location,
          'Shared Wealth Principles',
          'Collaborative Partnerships'
        ].filter(Boolean);

        const profile: CompanyProfile = {
          id: company.id,
          name: company.name,
          sector: company.industry || company.sector || 'Business',
          country: company.location || 'International',
          description: company.description || `${company.name} is a partner company of Shared Wealth International`,
          highlights: highlights,
          impactScore: 75
        };

        setCompanyProfile(profile);
      } else {
        // Fallback if no company
        const defaultProfile: CompanyProfile = {
          id: 'user-profile',
          name: user?.email?.split('@')[0] || 'Your Company',
          sector: 'Business',
          country: 'International',
          description: 'Member of Shared Wealth International network',
          highlights: ['Shared Wealth Principles'],
          impactScore: 50
        };
        
        setCompanyProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
      
      // Fallback profile
      const fallbackProfile: CompanyProfile = {
        id: 'fallback',
        name: 'Your Company',
        sector: 'Business',
        country: 'International',
        description: 'Member of Shared Wealth International',
        highlights: ['Business Development'],
        impactScore: 50
      };
      
      setCompanyProfile(fallbackProfile);
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

  const generateSmartRecommendations = () => {
    if (!companyProfile) {
      toast({
        title: "No Company Profile",
        description: "Please complete your company profile to get smart recommendations",
        variant: "destructive"
      });
      return;
    }

    // Extract keywords from company profile
    const companyKeywords = [
      ...companyProfile.sector.toLowerCase().split(/[,\s&]+/),
      ...companyProfile.highlights.map(h => h.toLowerCase()),
      ...companyProfile.description.toLowerCase().split(/[\s,]+/)
    ].filter(word => word.length > 3); // Only meaningful words

    const uniqueKeywords = [...new Set(companyKeywords)];

    // Smart matching algorithm based on keyword overlap
    const recommendations = opportunities.map(opportunity => {
      let matchScore = 0;
      const matchReasons: string[] = [];

      // Combine all opportunity text for keyword matching
      const opportunityText = [
        opportunity.title,
        opportunity.description,
        opportunity.category,
        opportunity.agency,
        ...opportunity.tags,
        ...opportunity.eligibility
      ].join(' ').toLowerCase();

      // 1. Keyword Matching (40 points max)
      let keywordMatches = 0;
      const matchedKeywords: string[] = [];
      
      uniqueKeywords.forEach(keyword => {
        if (opportunityText.includes(keyword)) {
          keywordMatches++;
          matchedKeywords.push(keyword);
        }
      });

      if (keywordMatches > 0) {
        const keywordScore = Math.min(keywordMatches * 5, 40);
        matchScore += keywordScore;
        matchReasons.push(`${keywordMatches} keyword matches: ${matchedKeywords.slice(0, 3).join(', ')}`);
      }

      // 2. Sector/Category Match (30 points max)
      const companySector = companyProfile.sector.toLowerCase();
      const opportunityCategory = opportunity.category.toLowerCase();
      
      if (opportunityCategory.includes(companySector) || companySector.includes(opportunityCategory)) {
        matchScore += 30;
        matchReasons.push(`Perfect sector match: ${opportunity.category}`);
      } else {
        // Check for partial sector alignment
        companySector.split(/[,\s&]+/).forEach(sectorWord => {
          if (opportunityCategory.includes(sectorWord) && sectorWord.length > 3) {
            matchScore += 15;
            matchReasons.push(`Sector alignment: ${sectorWord}`);
          }
        });
      }

      // 3. Geographic Eligibility (20 points max)
      const companyCountry = companyProfile.country.toLowerCase();
      
      if (opportunityText.includes(companyCountry)) {
        matchScore += 20;
        matchReasons.push(`Geographic eligibility: ${companyProfile.country}`);
      } else if (opportunityText.includes('international') || opportunityText.includes('global')) {
        matchScore += 15;
        matchReasons.push('International eligibility');
      }

      // 4. Deadline Urgency (10 points max)
      const daysUntilDeadline = Math.ceil((new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
        matchScore += 10;
        matchReasons.push('Urgent deadline - Apply soon!');
      } else if (daysUntilDeadline > 30 && daysUntilDeadline <= 90) {
        matchScore += 5;
        matchReasons.push('Good timing for application');
      }

      return {
        ...opportunity,
        matchScore: Math.min(matchScore, 100),
        matchReasons
      };
    });

    // Sort by match score and filter meaningful matches
    const topRecommendations = recommendations
      .filter(opp => opp.matchScore >= 30) // Minimum 30% match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    setSmartRecommendations(topRecommendations);
    setShowRecommendations(true);

    // Show toast notification
    toast({
      title: "Smart Recommendations Generated!",
      description: `Found ${topRecommendations.length} funding matches based on your profile keywords`,
    });
  };

  const handleApplyForFunding = (opportunity: FundingOpportunity) => {
    // Open the funding opportunity website in a new tab
    if (opportunity.website) {
      window.open(opportunity.website, '_blank', 'noopener,noreferrer');
    }
    
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
      description: `Redirecting to ${opportunity.title} application page`,
    });
  };

  const handleShareFunding = (opportunity: FundingOpportunity) => {
    const shareUrl = `${window.location.origin}/funding-opportunity/${opportunity.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied",
        description: `Opportunity link copied to clipboard: ${shareUrl}`,
      });
    }).catch(err => {
      console.error('Error copying link:', err);
      toast({
        title: "Error",
        description: "Failed to copy opportunity link",
        variant: "destructive"
      });
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
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
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
              <Button 
                onClick={generateSmartRecommendations}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                disabled={!companyProfile}
              >
                <Target className="w-4 h-4 mr-2" />
                Smart Matches
              </Button>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              >
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
                  <p className="text-sm font-medium text-gray-600">Smart Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{smartRecommendations.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{matches.filter(m => m.status === 'interested' || m.status === 'applied').length}</p>
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
                    const amount = opp.amount.match(/€([\d,]+)/);
                    return sum + (amount ? parseInt(amount[1].replace(/,/g, '')) : 0);
                  }, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Recommendations Section */}
        {showRecommendations && smartRecommendations.length > 0 && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-900">
                      Smart Recommendations for {companyProfile?.name || 'Your Company'}
                    </CardTitle>
                    <CardDescription className="text-emerald-700">
                      AI-powered funding matches based on your company profile
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRecommendations(false)}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartRecommendations.map((opportunity, index) => (
                  <div key={opportunity.id} className="p-4 bg-white rounded-lg border border-emerald-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {opportunity.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {opportunity.amount}
                          </Badge>
                          <Badge className="text-xs bg-emerald-100 text-emerald-800">
                            {opportunity.matchScore}% Match
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-medium text-gray-900">
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{opportunity.description}</p>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-emerald-800 mb-2">Why This Matches:</p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.matchReasons?.slice(0, 3).map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                            {reason}
                          </Badge>
                        ))}
                        {opportunity.matchReasons && opportunity.matchReasons.length > 3 && (
                          <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                            +{opportunity.matchReasons.length - 3} more reasons
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                          onClick={() => handleApplyForFunding(opportunity)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Apply Online
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShareFunding(opportunity)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      {opportunity.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={opportunity.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search funding opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getCategories().map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="small">Under €1M</SelectItem>
                  <SelectItem value="medium">€1M - €3M</SelectItem>
                  <SelectItem value="large">Over €3M</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <div className="grid grid-cols-2 gap-1 w-4 h-4">
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  </div>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <div className="flex flex-col gap-1 w-4 h-4">
                    <div className="w-full h-1 bg-current rounded-sm"></div>
                    <div className="w-full h-1 bg-current rounded-sm"></div>
                    <div className="w-full h-1 bg-current rounded-sm"></div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Opportunities Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opportunity) => {
                  const matchScore = calculateMatchScore(opportunity);
                  const isApplied = matches.some(m => m.opportunityId === opportunity.id);
                  
                  return (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                              {opportunity.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {opportunity.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {opportunity.amount}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge 
                              variant={opportunity.isActive ? "default" : "secondary"}
                              className={`text-xs ${opportunity.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}
                            >
                              {opportunity.isActive ? 'Active' : 'Closed'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {opportunity.description}
                        </p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Agency:</span>
                            <span className="font-medium text-gray-700">{opportunity.agency}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Deadline:</span>
                            <span className="font-medium text-gray-700">
                              {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label className="text-sm font-medium text-gray-700">Tags:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {opportunity.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {opportunity.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{opportunity.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {companyProfile && (
                          <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-emerald-800">Match Score:</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-emerald-200 rounded-full h-2">
                                  <div 
                                    className="bg-emerald-600 h-2 rounded-full" 
                                    style={{ width: `${matchScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-emerald-800">{matchScore}%</span>
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
                                  Apply Online
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleShareFunding(opportunity)}
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                          {opportunity.website && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={opportunity.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => {
                  const matchScore = calculateMatchScore(opportunity);
                  const isApplied = matches.some(m => m.opportunityId === opportunity.id);
                  
                  return (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Main Content */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                                  {opportunity.title}
                                </h3>
                                <p className="text-gray-600 mb-3 leading-relaxed">
                                  {opportunity.description}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-2 ml-4">
                                <Badge 
                                  variant={opportunity.isActive ? "default" : "secondary"}
                                  className={`${opportunity.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}
                                >
                                  {opportunity.isActive ? 'Active' : 'Closed'}
                                </Badge>
                                <Badge variant="outline" className="text-sm font-medium">
                                  {opportunity.amount}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Agency:</span>
                                <p className="font-medium text-gray-700">{opportunity.agency}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <p className="font-medium text-gray-700">{opportunity.category}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Deadline:</span>
                                <p className="font-medium text-gray-700">
                                  {new Date(opportunity.deadline).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {opportunity.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Right Sidebar */}
                          <div className="lg:w-80 space-y-4">
                            {companyProfile && (
                              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-emerald-800">Match Score</span>
                                  <span className="text-lg font-bold text-emerald-800">{matchScore}%</span>
                                </div>
                                <div className="w-full bg-emerald-200 rounded-full h-2 mb-2">
                                  <div 
                                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${matchScore}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-emerald-700">
                                  {matchScore >= 80 ? 'Excellent match!' : 
                                   matchScore >= 60 ? 'Good match' : 
                                   matchScore >= 40 ? 'Moderate match' : 'Limited match'}
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                onClick={() => handleApplyForFunding(opportunity)}
                                disabled={isApplied}
                              >
                                {isApplied ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Already Applied
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Apply Online
                                  </>
                                )}
                              </Button>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => handleShareFunding(opportunity)}
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </Button>
                                {opportunity.website && (
                                  <Button variant="outline" className="flex-1" asChild>
                                    <a href={opportunity.website} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Website
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

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
                  <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                  <SelectItem value="Agriculture & Water Management">Agriculture & Water Management</SelectItem>
                  <SelectItem value="Agricultural Innovation">Agricultural Innovation</SelectItem>
                  <SelectItem value="Culture & Society">Culture & Society</SelectItem>
                  <SelectItem value="Emergency Nutrition">Emergency Nutrition</SelectItem>
                  <SelectItem value="Digital Technology">Digital Technology</SelectItem>
                  <SelectItem value="Innovation Ecosystems">Innovation Ecosystems</SelectItem>
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
            <Button 
              onClick={handleAddFunding}
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              Add Funding Opportunity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundingPlatform;
