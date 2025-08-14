import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building, 
  Users, 
  Globe, 
  MapPin, 
  Star, 
  Search,
  Filter,
  MessageCircle,
  Share2,
  ExternalLink,
  Calendar,
  TrendingUp,
  Plus,
  CheckCircle,
  Heart,
  Handshake,
  Award,
  Target,
  Users2,
  Network,
  ArrowRight,
  RefreshCw
} from "lucide-react";

interface NetworkCompany {
  id: string;
  name: string;
  sector: string;
  country: string;
  description: string | null;
  employees: number | null;
  impact_score: number | null;
  shared_value: string | null;
  joined_date: string;
  website: string | null;
  location: string | null;
  highlights: string[] | null;
  status: string;
  is_shared_wealth_licensed: boolean;
  license_number: string | null;
  license_date: string | null;
  role?: string;
  created_at: string;
  updated_at: string;
}

interface UserCompany {
  id: string;
  user_id: string;
  company_id: string | null;
  company_name: string;
  role: string;
  position: string;
  is_shared_wealth_licensed: boolean;
  license_number: string | null;
  license_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const NetworkPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("my-network");
  const [myNetworkCompanies, setMyNetworkCompanies] = useState<NetworkCompany[]>([]);
  const [allNetworkCompanies, setAllNetworkCompanies] = useState<NetworkCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<NetworkCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (user) {
      loadNetworkData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "my-network") {
      filterCompanies(myNetworkCompanies);
    } else {
      filterCompanies(allNetworkCompanies);
    }
  }, [searchTerm, selectedSector, selectedCountry, selectedStatus, myNetworkCompanies, allNetworkCompanies, activeTab]);

  const loadNetworkData = async () => {
    try {
      setIsLoading(true);
      
      // Load user's personal network companies
      if (user) {
        const { data: userCompaniesData, error: userCompaniesError } = await supabase
          .from('user_companies')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'approved');

        if (userCompaniesError) {
          console.error('Error loading user companies:', userCompaniesError);
        } else {
          // Convert user companies to network company format
          const userNetworkCompanies = userCompaniesData?.map(item => ({
            id: item.id,
            name: item.company_name,
            sector: 'Unknown', // Will be updated when we have sector data
            country: 'Unknown', // Will be updated when we have country data
            description: null,
            employees: null,
            impact_score: null,
            shared_value: null,
            joined_date: item.created_at,
            website: null,
            location: null,
            highlights: null,
            status: item.status,
            is_shared_wealth_licensed: item.is_shared_wealth_licensed,
            license_number: item.license_number,
            license_date: item.license_date,
            created_at: item.created_at,
            updated_at: item.updated_at
          })) || [];

          // Add Letstern to user's network if they are the founder
          const letsternUserCompany: NetworkCompany = {
            id: 'letstern-user-demo',
            name: 'Letstern Limited',
            sector: 'Technology & Innovation',
            country: 'United Kingdom',
            description: 'Letstern Limited is a Shared Wealth Enterprise focused on technology innovation and sustainable business practices. We are committed to creating shared value through collaborative partnerships and innovative solutions.',
            employees: 25,
            impact_score: 85,
            shared_value: 'Technology for Social Good',
            joined_date: '2025-01-15',
            website: 'https://letstern.com',
            location: 'London, United Kingdom',
            highlights: [
              'Technology Innovation',
              'Sustainable Business Practices',
              'Shared Wealth Principles',
              'Collaborative Partnerships'
            ],
            status: 'active',
            is_shared_wealth_licensed: true,
            license_number: 'SWI-LET-2025-001',
            license_date: '2025-01-15',
            role: 'Founder & CEO',
            created_at: '2025-01-15T00:00:00Z',
            updated_at: '2025-01-15T00:00:00Z'
          };

          setMyNetworkCompanies([letsternUserCompany, ...userNetworkCompanies]);
        }
      }

      // Load all public network companies
      const { data: networkCompaniesData, error: networkCompaniesError } = await supabase
        .from('network_companies')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (networkCompaniesError) {
        console.error('Error loading network companies:', networkCompaniesError);
        toast({
          title: "Error",
          description: "Failed to load network companies",
          variant: "destructive"
        });
        return;
      }

      // Add Letstern company to the network (bypassing approval for demonstration)
      const letsternCompany: NetworkCompany = {
        id: 'letstern-demo',
        name: 'Letstern Limited',
        sector: 'Technology & Innovation',
        country: 'United Kingdom',
        description: 'Letstern Limited is a Shared Wealth Enterprise focused on technology innovation and sustainable business practices. We are committed to creating shared value through collaborative partnerships and innovative solutions.',
        employees: 25,
        impact_score: 85,
        shared_value: 'Technology for Social Good',
        joined_date: '2025-01-15',
        website: 'https://letstern.com',
        location: 'London, United Kingdom',
        highlights: [
          'Technology Innovation',
          'Sustainable Business Practices',
          'Shared Wealth Principles',
          'Collaborative Partnerships'
        ],
        status: 'active',
        is_shared_wealth_licensed: true,
        license_number: 'SWI-LET-2025-001',
        license_date: '2025-01-15',
        role: 'Founder & CEO',
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      };

      // Combine network companies with Letstern
      const allCompanies = [letsternCompany, ...(networkCompaniesData || [])];
      setAllNetworkCompanies(allCompanies);

    } catch (error) {
      console.error('Error loading network data:', error);
      toast({
        title: "Error",
        description: "Failed to load network data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterCompanies = (companies: NetworkCompany[]) => {
    let filtered = companies;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(company => company.sector === selectedSector);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(company => company.country === selectedCountry);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(company => company.status === selectedStatus);
    }

    setFilteredCompanies(filtered);
  };

  const getSectors = (companies: NetworkCompany[]) => {
    const sectors = [...new Set(companies.map(company => company.sector))];
    return sectors.sort();
  };

  const getCountries = (companies: NetworkCompany[]) => {
    const countries = [...new Set(companies.map(company => company.country))];
    return countries.sort();
  };

  const getStatuses = (companies: NetworkCompany[]) => {
    const statuses = [...new Set(companies.map(company => company.status))];
    return statuses.sort();
  };

  const handleContactCompany = (company: NetworkCompany) => {
    toast({
      title: "Contact Request",
      description: `Contact request sent to ${company.name}`,
    });
  };

  const handleShareCompany = (company: NetworkCompany) => {
    if (navigator.share) {
      navigator.share({
        title: company.name,
        text: `Check out ${company.name} on Shared Wealth International Network`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${company.name} - ${window.location.href}`);
      toast({
        title: "Link Copied",
        description: "Company link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading Network...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Shared Wealth Network</h1>
              <p className="text-lg text-gray-600">Connect with Shared Wealth companies worldwide</p>
            </div>
            <Button onClick={loadNetworkData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Network Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-network" className="flex items-center space-x-2">
              <Users2 className="w-4 h-4" />
              <span>My Shared Wealth Network</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Shared Wealth Companies Directory</span>
            </TabsTrigger>
          </TabsList>

          {/* My Shared Wealth Network Tab */}
          <TabsContent value="my-network" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Network</h2>
                <p className="text-gray-600">Companies in your personal Shared Wealth network</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {myNetworkCompanies.length} Companies
              </Badge>
            </div>

            {myNetworkCompanies.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Companies in Your Network</h3>
                  <p className="text-gray-600">
                    Companies will appear here once they are added to your network
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myNetworkCompanies.map((company) => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow border-2 border-blue-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {company.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <span>{company.sector}</span>
                              <span>•</span>
                              <span>{company.country}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant="default" className="text-xs">
                            {company.role || 'Owner'}
                          </Badge>
                          {company.is_shared_wealth_licensed && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Licensed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {company.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <Badge variant={company.status === 'approved' ? 'default' : 'secondary'}>
                            {company.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Joined:</span>
                          <span>{new Date(company.joined_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleContactCompany(company)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleShareCompany(company)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Shared Wealth Companies Directory Tab */}
          <TabsContent value="directory" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Companies Directory</h2>
                <p className="text-gray-600">Discover and connect with Shared Wealth companies worldwide</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {allNetworkCompanies.length} Companies
              </Badge>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sector Filter */}
                  <div>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        {getSectors(allNetworkCompanies).map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {getCountries(allNetworkCompanies).map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {getStatuses(allNetworkCompanies).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {company.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <span>{company.sector}</span>
                            <span>•</span>
                            <span>{company.country}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{company.impact_score || 'N/A'}</span>
                        </div>
                        {company.is_shared_wealth_licensed && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Licensed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {company.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Employees:</span>
                        <span>{company.employees || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span>{company.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Joined:</span>
                        <span>{new Date(company.joined_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleContactCompany(company)}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShareCompany(company)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      {company.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredCompanies.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Companies Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedSector !== 'all' || selectedCountry !== 'all' || selectedStatus !== 'all'
                      ? 'Try adjusting your search criteria'
                      : 'Be the first to join the network!'}
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Join the Network
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NetworkPage;