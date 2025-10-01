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
import { NetworkService } from "@/services/mockServices";
import { apiService } from "@/services/api";
import { NetworkCompany, UserCompany } from "@/types";
import { useSearchParams } from "react-router-dom";
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
  RefreshCw,
  Clock,
  MapPin as LocationIcon
} from "lucide-react";



const NetworkPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("my-network");
  const [myNetworkCompanies, setMyNetworkCompanies] = useState<NetworkCompany[]>([]);
  const [allNetworkCompanies, setAllNetworkCompanies] = useState<NetworkCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<NetworkCompany[]>([]);
  const [events, setEvents] = useState<any[]>([]);
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
    const tab = searchParams.get("tab");
    if (tab && ["my-network", "directory", "events"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "my-network") {
      filterCompanies(myNetworkCompanies);
    } else if (activeTab === "directory") {
      filterCompanies(allNetworkCompanies);
    }
  }, [searchTerm, selectedSector, selectedCountry, selectedStatus, myNetworkCompanies, allNetworkCompanies, activeTab]);

  const loadNetworkData = async () => {
    try {
      setIsLoading(true);
      
      // Load all companies for the "Companies Directory" tab
      const companiesResponse = await apiService.getCompanies() as any;
      const allCompanies = companiesResponse?.data || [];
      
      const networkCompanies = allCompanies.map((company: any) => ({
        id: company.id,
        name: company.name,
        description: company.description,
        industry: company.sector || company.industry,
        size: company.size || 'medium',
        location: company.location,
        website: company.website,
        status: company.status,
        created_at: company.created_at,
        updated_at: company.updated_at,
        connection_strength: 60,
        shared_projects: 0,
        collaboration_score: 65,
        // Additional properties for display
        sector: company.sector || company.industry,
        country: company.location,
        role: 'member', // Default role since we're not using user_companies table
        is_shared_wealth_licensed: company.is_shared_wealth_licensed,
        joined_date: company.created_at,
        employees: company.employees,
        impact_score: company.impact_score
      }));
      
      // Set all companies for the "Companies Directory" tab
      setAllNetworkCompanies(networkCompanies);
      
      // For "My Network" tab, try to load user's companies, but fall back to empty array
      try {
        const userCompaniesResponse = await apiService.getUserCompanies() as any;
        console.log('🔍 Network Debug - getUserCompanies response:', userCompaniesResponse);
        
        // Handle different response formats
        let userCompanies = [];
        if (userCompaniesResponse?.success && userCompaniesResponse?.data) {
          userCompanies = userCompaniesResponse.data;
        } else if (Array.isArray(userCompaniesResponse)) {
          userCompanies = userCompaniesResponse;
        } else if (userCompaniesResponse?.data && Array.isArray(userCompaniesResponse.data)) {
          userCompanies = userCompaniesResponse.data;
        }
        
        const myNetworkCompanies = userCompanies.map((company: any) => ({
          id: company.id,
          name: company.name,
          description: company.description,
          industry: company.sector || company.industry,
          size: company.size || 'medium',
          location: company.location,
          website: company.website,
          status: company.status,
          created_at: company.created_at,
          updated_at: company.updated_at,
          connection_strength: 85,
          shared_projects: 0,
          collaboration_score: 75,
          // Additional properties for display
          sector: company.sector || company.industry,
          country: company.location,
          role: company.role || 'member',
          is_shared_wealth_licensed: company.is_shared_wealth_licensed,
          joined_date: company.created_at,
          employees: company.employees,
          impact_score: company.impact_score
        }));
        setMyNetworkCompanies(myNetworkCompanies);
        console.log('🔍 Network Debug - My Network companies:', myNetworkCompanies.length);
      } catch (error) {
        console.log('User companies not available, showing empty network:', error);
        setMyNetworkCompanies([]);
      }

      // Load events data
      try {
        const eventsData = await apiService.getEvents();
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      }
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
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(company => company.industry === selectedSector);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(company => company.location === selectedCountry);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(company => company.status === selectedStatus);
    }

    setFilteredCompanies(filtered);
  };

  const getSectors = (companies: NetworkCompany[]) => {
    const sectors = [...new Set(companies.map(company => company.industry))];
    return sectors.sort();
  };

  const getCountries = (companies: NetworkCompany[]) => {
    const countries = [...new Set(companies.map(company => company.location))];
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

  const handleAddToNetwork = async (company: NetworkCompany) => {
    try {
      console.log('🔗 Adding company to network:', company.name, company.id);
      
      const result = await apiService.addCompanyToNetwork(company.id, 'member');
      
      if (result.success) {
        toast({
          title: "Success",
          description: `${company.name} has been added to your network`,
        });
        
        // Refresh the network data to show the new company
        await loadNetworkData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add company to network",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding company to network:', error);
      toast({
        title: "Error",
        description: "Failed to add company to network",
        variant: "destructive",
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-network" className="flex items-center space-x-2">
              <Users2 className="w-4 h-4" />
              <span>My Network</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Companies Directory</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
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
                              <span>{(company as any).sector}</span>
                              <span>•</span>
                              <span>{(company as any).country}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant="default" className="text-xs">
                            {(company as any).role || 'Owner'}
                          </Badge>
                          {(company as any).is_shared_wealth_licensed && (
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
                          <span>{new Date((company as any).joined_date).toLocaleDateString()}</span>
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
                            <span>{(company as any).sector}</span>
                            <span>•</span>
                            <span>{(company as any).country}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{(company as any).impact_score || 'N/A'}</span>
                        </div>
                        {(company as any).is_shared_wealth_licensed && (
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
                        <span>{(company as any).employees || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span>{company.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Joined:</span>
                        <span>{new Date((company as any).joined_date).toLocaleDateString()}</span>
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
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleAddToNetwork(company)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Network
                        </Button>
                        {company.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
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

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Network Events</h2>
                <p className="text-gray-600">Discover and join upcoming events in the Shared Wealth network</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {events.length} Events
              </Badge>
            </div>

            {events.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
                  <p className="text-gray-600 mb-6">
                    Check back soon for upcoming networking events, workshops, and conferences.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </CardDescription>
                        </div>
                        <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(event.start_date).toLocaleDateString()}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <LocationIcon className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.end_date && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                              {new Date(event.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            RSVP
                          </Button>
                          <Button variant="outline" size="sm">
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
        </Tabs>
      </div>
    </div>
  );
};

export default NetworkPage;