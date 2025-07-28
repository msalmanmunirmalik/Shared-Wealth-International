import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building, 
  Users, 
  MapPin, 
  Globe, 
  TrendingUp, 
  Star,
  ArrowRight,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  DollarSign,
  Target,
  Heart,
  Briefcase,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  sector: string;
  country: string;
  description: string;
  employees: number;
  sharedValue: string;
  impactScore: number;
  joinedDate: string;
  website: string;
  logo: string;
  highlights: string[];
  location: string;
  status: string;
}

const Network = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('network_companies')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Database error:', error);
        // Fallback to hardcoded data if database is not available
        setCompanies(fallbackCompanies);
        setIsLoading(false);
        return;
      }

      // If database is empty, use fallback data
      if (!data || data.length === 0) {
        console.log('Database is empty, using fallback data');
        setCompanies(fallbackCompanies);
        setIsLoading(false);
        return;
      }

      // Transform the data to match our Company interface
      const companiesData: Company[] = data.map(company => ({
        id: company.id,
        name: company.name,
        sector: company.sector,
        country: company.country,
        description: company.description || '',
        employees: company.employees || 0,
        sharedValue: company.shared_value || '€0',
        impactScore: company.impact_score || 0,
        joinedDate: company.joined_date || new Date().getFullYear().toString(),
        website: company.website || '',
        logo: company.logo || '',
        highlights: company.highlights || [],
        location: company.location || company.country,
        status: company.status
      }));

      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies(fallbackCompanies);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || company.sector === selectedSector;
    const matchesCountry = selectedCountry === "all" || company.country === selectedCountry;
    
    return matchesSearch && matchesSector && matchesCountry;
  });

  const sectors = [...new Set(companies.map(company => company.sector))];
  const countries = [...new Set(companies.map(company => company.country))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Hero Section */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Our Network
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/80">
              Discover companies committed to shared wealth creation and sustainable business practices
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" style={{ color: '#eabc27' }} />
                <span className="text-white/90">{companies.length} Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" style={{ color: '#eabc27' }} />
                <span className="text-white/90">{countries.length} Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5" style={{ color: '#eabc27' }} />
                <span className="text-white/90">{sectors.length} Sectors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: 'rgb(224, 230, 235)' }}
                />
              </div>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-full sm:w-48" style={{ borderColor: 'rgb(224, 230, 235)' }}>
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full sm:w-48" style={{ borderColor: 'rgb(224, 230, 235)' }}>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              {filteredCompanies.length} of {companies.length} companies
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'rgb(245, 158, 11)' }}></div>
              <p className="mt-4" style={{ color: 'rgb(107, 114, 128)' }}>Loading companies...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>No companies found</h3>
              <p style={{ color: 'rgb(107, 114, 128)' }}>Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'white', borderColor: 'rgb(224, 230, 235)' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2" style={{ color: 'rgb(30, 58, 138)' }}>{company.name}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                          <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>{company.location}</span>
                        </div>
                        <Badge className="text-xs" style={{ backgroundColor: 'rgb(245, 158, 11)', color: 'white' }}>
                          {company.sector}
                        </Badge>
                      </div>
                      {company.logo && (
                        <img 
                          src={company.logo} 
                          alt={`${company.name} logo`} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4" style={{ color: 'rgb(75, 85, 99)' }}>
                      {company.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                        <div className="text-lg font-semibold" style={{ color: 'rgb(30, 58, 138)' }}>{company.employees}</div>
                        <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Employees</div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                        <div className="text-lg font-semibold" style={{ color: 'rgb(30, 58, 138)' }}>{company.sharedValue}</div>
                        <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Shared Value</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" style={{ color: 'rgb(245, 158, 11)' }} />
                        <span className="text-sm font-medium" style={{ color: 'rgb(30, 58, 138)' }}>
                          {company.impactScore}/10
                        </span>
                      </div>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </div>

                    {company.highlights && company.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2" style={{ color: 'rgb(30, 58, 138)' }}>Highlights:</h4>
                        <div className="flex flex-wrap gap-1">
                          {company.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(107, 114, 128)' }}>
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button asChild size="sm" className="flex-1" style={{ backgroundColor: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}>
                        <Link to={`/companies/${company.id}`}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                      {company.website && (
                        <Button asChild size="sm" variant="outline" style={{ borderColor: 'rgb(224, 230, 235)', color: 'rgb(30, 58, 138)' }}>
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
          )}
        </div>
      </section>
    </div>
  );
};

// Fallback data for when database is not available
const fallbackCompanies: Company[] = [
  {
    id: "1",
    name: "Pathway Technologies",
    sector: "Technology",
    country: "Netherlands",
    description: "Leading software company implementing shared wealth principles through employee ownership and profit sharing.",
    employees: 150,
    sharedValue: "€2.4M",
    impactScore: 9.2,
    joinedDate: "2023",
    website: "https://pathway-tech.com",
    logo: "",
    highlights: ["Employee Ownership", "Profit Sharing", "Sustainable Growth"],
    location: "Amsterdam, Netherlands",
    status: "active"
  },
  {
    id: "2",
    name: "Green Harvest Co.",
    sector: "Agriculture",
    country: "Germany",
    description: "Organic farming cooperative that shares profits with farmers and invests in sustainable practices.",
    employees: 85,
    sharedValue: "€1.8M",
    impactScore: 8.7,
    joinedDate: "2023",
    website: "https://greenharvest.de",
    logo: "",
    highlights: ["Cooperative Model", "Organic Farming", "Community Impact"],
    location: "Berlin, Germany",
    status: "active"
  },
  {
    id: "3",
    name: "Community Bank",
    sector: "Finance",
    country: "Belgium",
    description: "Ethical banking institution focused on community development and shared financial success.",
    employees: 200,
    sharedValue: "€3.2M",
    impactScore: 8.9,
    joinedDate: "2023",
    website: "https://communitybank.be",
    logo: "",
    highlights: ["Ethical Banking", "Community Development", "Financial Inclusion"],
    location: "Brussels, Belgium",
    status: "active"
  },
  {
    id: "4",
    name: "EcoBuild Solutions",
    sector: "Construction",
    country: "France",
    description: "Sustainable construction company with worker cooperatives and environmental focus.",
    employees: 120,
    sharedValue: "€1.9M",
    impactScore: 8.5,
    joinedDate: "2023",
    website: "https://ecobuild.fr",
    logo: "",
    highlights: ["Worker Cooperatives", "Sustainable Building", "Green Materials"],
    location: "Paris, France",
    status: "active"
  },
  {
    id: "5",
    name: "HealthFirst Clinic",
    sector: "Healthcare",
    country: "Switzerland",
    description: "Healthcare provider implementing shared wealth through staff ownership and community health programs.",
    employees: 95,
    sharedValue: "€2.1M",
    impactScore: 9.0,
    joinedDate: "2023",
    website: "https://healthfirst.ch",
    logo: "",
    highlights: ["Staff Ownership", "Community Health", "Preventive Care"],
    location: "Zurich, Switzerland",
    status: "active"
  },
  {
    id: "6",
    name: "TechCorp Innovations",
    sector: "Technology",
    country: "Netherlands",
    description: "Innovative tech startup with equity sharing and collaborative decision-making.",
    employees: 75,
    sharedValue: "€1.5M",
    impactScore: 8.3,
    joinedDate: "2023",
    website: "https://techcorp.nl",
    logo: "",
    highlights: ["Equity Sharing", "Innovation", "Collaborative Culture"],
    location: "Rotterdam, Netherlands",
    status: "active"
  }
];

export default Network;