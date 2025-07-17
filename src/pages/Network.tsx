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
      // Fallback to hardcoded data on any error
      setCompanies(fallbackCompanies);
    } finally {
      setIsLoading(false);
    }
  };

  // Temporary companies array for fallback
  const fallbackCompanies: Company[] = [
    {
      id: "1",
      name: "Shared Wealth International Ltd",
      sector: "Social Enterprise, Equitable Finance",
      country: "United Kingdom",
      description: "The overarching entity driving the Shared Wealth model globally. Core Shared Wealth Model implementation with global partnerships and strategic development.",
      employees: 50,
      sharedValue: "€5M",
      impactScore: 9.2,
      joinedDate: "2018",
      website: "https://sharedwealth.net",
      logo: "/lovable-uploads/shared-wealth-logo.png",
      highlights: ["Core Shared Wealth Model", "Global Partnerships", "Strategic Development"],
      location: "Global (UK registered)",
      status: "Core Entity"
    },
    {
      id: "2",
      name: "SEi Caledonia Ltd",
      sector: "Social Enterprise, Regional Development",
      country: "United Kingdom",
      description: "Supports political engagement and JV exploration for Pathway in Scotland. Regional development focused on Scottish market.",
      employees: 15,
      sharedValue: "€750K",
      impactScore: 8.5,
      joinedDate: "2019",
      website: "https://seicaledonia.com",
      logo: "/lovable-uploads/sei-caledonia-logo.png",
      highlights: ["Scottish Pathway Support", "Political Engagement", "JV Exploration"],
      location: "Scotland, UK",
      status: "Regional Partner"
    },
    {
      id: "3",
      name: "Spark CIC",
      sector: "Charity, Social Enterprise",
      country: "United Kingdom",
      description: "Part of the Shared Wealth Group, focusing on charitable initiatives and social enterprise development.",
      employees: 10,
      sharedValue: "€300K",
      impactScore: 8.0,
      joinedDate: "2017",
      website: "https://sparkcic.org",
      logo: "/lovable-uploads/spark-cic-logo.png",
      highlights: ["Shared Wealth Group", "Charitable Initiatives", "Social Enterprise"],
      location: "UK",
      status: "Group Member"
    },
    {
      id: "4",
      name: "LocoSoco PLC",
      sector: "UK Public Limited Company",
      country: "United Kingdom",
      description: "Public limited company within the Shared Wealth Group, operating with shared wealth principles.",
      employees: 120,
      sharedValue: "€2.5M",
      impactScore: 7.8,
      joinedDate: "2016",
      website: "https://locosoco.com",
      logo: "/lovable-uploads/locosoco-logo.png",
      highlights: ["Shared Wealth Group", "Public Company", "Shared Principles"],
      location: "UK",
      status: "Group Member"
    },
    {
      id: "5",
      name: "World Health Innovation Summit (WHIS)",
      sector: "Community Interest Company, Health",
      country: "United Kingdom",
      description: "Community Interest Company focused on health innovation and affordable housing for key workers. Currently in discussions with Irish Government.",
      employees: 30,
      sharedValue: "€1.2M",
      impactScore: 8.9,
      joinedDate: "2017",
      website: "https://whis.org",
      logo: "/lovable-uploads/whis-logo.png",
      highlights: ["Health Innovation", "Affordable Housing", "Irish Government Talks"],
      location: "UK/International",
      status: "Strategic Partner"
    },
    {
      id: "6",
      name: "Nigerian Capital Development Fund (NCDF)",
      sector: "Nigerian Company, Capital Development",
      country: "Nigeria",
      description: "Part of Shared Wealth Group, supporting seed investment mobilization and capital development in Nigeria.",
      employees: 40,
      sharedValue: "€1.8M",
      impactScore: 8.7,
      joinedDate: "2018",
      website: "https://ncdf.ng",
      logo: "/lovable-uploads/ncdf-logo.png",
      highlights: ["Shared Wealth Group", "Seed Investment", "Capital Development"],
      location: "Nigeria",
      status: "Group Member"
    },
    {
      id: "7",
      name: "Media Cultured Ltd",
      sector: "Community Interest Company, Media",
      country: "United Kingdom",
      description: "Community Interest Company arranging meetings with leaders and public engagement for Islamic community.",
      employees: 20,
      sharedValue: "€600K",
      impactScore: 7.5,
      joinedDate: "2017",
      website: "https://mediacultured.org",
      logo: "/lovable-uploads/media-cultured-logo.png",
      highlights: ["Leader Engagement", "Public Engagement", "Islamic Community"],
      location: "UK",
      status: "Group Member"
    },
    {
      id: "8",
      name: "Pathway Points Ltd (Pathway)",
      sector: "Housing & Finance Model",
      country: "United Kingdom",
      description: "Innovative housing approach that turns renters into owners. Community wealth building through innovative housing and finance model.",
      employees: 70,
      sharedValue: "€3.5M",
      impactScore: 9.5,
      joinedDate: "2025",
      website: "https://pathwaypoints.org",
      logo: "/lovable-uploads/pathway-logo.png",
      highlights: ["Renters to Owners", "Innovative Housing", "Community Wealth Building"],
      location: "UK & International",
      status: "Flagship Model"
    },
    {
      id: "9",
      name: "Sustainable-Roots Limited (SRL)",
      sector: "Company Limited by Shares",
      country: "United Kingdom",
      description: "Company Limited by Shares supporting Pathway Points initiatives and sustainable development.",
      employees: 5,
      sharedValue: "€150K",
      impactScore: 7.0,
      joinedDate: "2024",
      website: "https://sustainable-roots.co.uk",
      logo: "/lovable-uploads/srl-logo.png",
      highlights: ["Pathway Support", "Sustainable Development", "Limited Company"],
      location: "UK",
      status: "Pathway Partner"
    },
    {
      id: "10",
      name: "Tallarna Limited",
      sector: "Company Limited by Shares",
      country: "United Kingdom",
      description: "Supports Pathway Points and explores Pathway Club-owned enterprises for property refurbishment and eco-fit works.",
      employees: 25,
      sharedValue: "€800K",
      impactScore: 8.2,
      joinedDate: "2024",
      website: "https://tallarna.com",
      logo: "/lovable-uploads/tallarna-logo.png",
      highlights: ["Pathway Support", "Property Refurbishment", "Eco-fit Works"],
      location: "UK",
      status: "Pathway Partner"
    },
    {
      id: "11",
      name: "Life Sciences Healthcare (LSH)",
      sector: "Company Limited by Shares",
      country: "United Kingdom",
      description: "Healthcare company supporting Pathway Points initiatives and life sciences development.",
      employees: 50,
      sharedValue: "€1.5M",
      impactScore: 8.0,
      joinedDate: "2023",
      website: "https://lifescienceshealthcare.co.uk",
      logo: "/lovable-uploads/lsh-logo.png",
      highlights: ["Pathway Support", "Healthcare", "Life Sciences"],
      location: "UK",
      status: "Pathway Partner"
    },
    {
      id: "12",
      name: "Two Hands Consultancy Limited (2HC)",
      sector: "Company Limited by Shares, Consultancy",
      country: "United Kingdom",
      description: "Consultancy and training company supporting Pathway Points, delivering training through remote/AI tutors.",
      employees: 12,
      sharedValue: "€400K",
      impactScore: 7.9,
      joinedDate: "2024",
      website: "https://twohandsconsultancy.co.uk",
      logo: "/lovable-uploads/2hc-logo.png",
      highlights: ["Pathway Support", "Consultancy", "AI Training"],
      location: "UK",
      status: "Pathway Partner"
    },
    {
      id: "13",
      name: "Maven Housing Limited (MHL)",
      sector: "Company Limited by Shares, Housing",
      country: "United Kingdom",
      description: "Housing company supporting Pathway Points initiatives and housing development.",
      employees: 8,
      sharedValue: "€250K",
      impactScore: 7.3,
      joinedDate: "2024",
      website: "https://mavenhousing.co.uk",
      logo: "/lovable-uploads/mhl-logo.png",
      highlights: ["Pathway Support", "Housing Development", "Limited Company"],
      location: "UK",
      status: "Pathway Partner"
    },
    {
      id: "14",
      name: "Terratai Ltd",
      sector: "Flagship Shared Wealth Enterprise",
      country: "United Kingdom",
      description: "Flagship Shared Wealth Enterprise transitioning to Shared Wealth model, opening ownership/governance, considering phantom shares, actively participating in inclusive decision-making models.",
      employees: 35,
      sharedValue: "€1.0M",
      impactScore: 9.1,
      joinedDate: "2025",
      website: "https://terratai.com",
      logo: "/lovable-uploads/terratai-logo.png",
      highlights: ["Shared Wealth Model", "Phantom Shares", "Inclusive Decision-Making"],
      location: "UK",
      status: "Flagship Enterprise"
    },
    {
      id: "15",
      name: "York University",
      sector: "Academia, Research",
      country: "United Kingdom",
      description: "Academic institution collaborating to establish Pathway Chapter, engaging students and stakeholders in housing issues.",
      employees: 0,
      sharedValue: "€0",
      impactScore: 8.5,
      joinedDate: "2023",
      website: "https://york.ac.uk",
      logo: "/lovable-uploads/york-university-logo.png",
      highlights: ["Pathway Chapter", "Student Engagement", "Housing Research"],
      location: "York, UK",
      status: "Academic Partner"
    },
    {
      id: "16",
      name: "Community First Credit Union",
      sector: "Financial Services, Credit Union",
      country: "United Kingdom",
      description: "Credit union collaborating to develop a credit union distribution partner for Pathway.",
      employees: 60,
      sharedValue: "€2.0M",
      impactScore: 8.8,
      joinedDate: "2024",
      website: "https://communityfirstcu.co.uk",
      logo: "/lovable-uploads/community-first-logo.png",
      highlights: ["Pathway Distribution", "Credit Union", "Financial Services"],
      location: "UK",
      status: "Financial Partner"
    },
    {
      id: "17",
      name: "Solar Ear UK",
      sector: "Health Tech",
      country: "United Kingdom",
      description: "Health technology company serving as a third-party partner in the Shared Wealth network.",
      employees: 18,
      sharedValue: "€500K",
      impactScore: 7.6,
      joinedDate: "2023",
      website: "https://solarearuk.com",
      logo: "/lovable-uploads/solar-ear-logo.png",
      highlights: ["Health Tech", "Third-party Partner", "Innovation"],
      location: "UK",
      status: "Third-party Partner"
    },
    {
      id: "18",
      name: "Whitby Shared Wealth Social Enterprise",
      sector: "Social Enterprise",
      country: "United Kingdom",
      description: "Local social enterprise in Whitby serving as a third-party partner in the Shared Wealth network.",
      employees: 8,
      sharedValue: "€200K",
      impactScore: 7.2,
      joinedDate: "2023",
      website: "https://whitbysharedwealth.org",
      logo: "/lovable-uploads/whitby-logo.png",
      highlights: ["Local Enterprise", "Third-party Partner", "Community Focus"],
      location: "Whitby, UK",
      status: "Third-party Partner"
    },
    {
      id: "19",
      name: "SEi Middle East",
      sector: "Social Enterprise, Regional Development",
      country: "Middle East",
      description: "Regional development partner for collaboration in the Partnership Agreement, focusing on Middle Eastern markets.",
      employees: 28,
      sharedValue: "€900K",
      impactScore: 8.4,
      joinedDate: "2024",
      website: "https://seimiddleeast.org",
      logo: "/lovable-uploads/sei-middle-east-logo.png",
      highlights: ["Regional Development", "Third-party Partner", "Middle East Focus"],
      location: "Middle East",
      status: "Regional Partner"
    }
  ];

  const sectors = ["all", ...Array.from(new Set(companies.map(c => c.sector)))];
  const countries = ["all", ...Array.from(new Set(companies.map(c => c.country)))];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || company.sector === selectedSector;
    const matchesCountry = selectedCountry === "all" || company.country === selectedCountry;
    
    return matchesSearch && matchesSector && matchesCountry;
  });

  const stats = [
    { label: "Total Companies", value: companies.length, icon: Building, color: "text-blue-600" },
    { label: "Countries", value: countries.length - 1, icon: Globe, color: "text-green-600" },
    { label: "Sectors", value: sectors.length - 1, icon: Target, color: "text-purple-600" },
    { label: "Total Shared Value", value: "€25.8M", icon: DollarSign, color: "text-emerald-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Core Entity":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Flagship Model":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Flagship Enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Group Member":
        return "bg-navy-100 text-navy-800 border-navy-200";
      case "Strategic Partner":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Pathway Partner":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Academic Partner":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Financial Partner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Third-party Partner":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Regional Partner":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-blue-800 to-indigo-900 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Shared Wealth Network
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Discover the global network of companies pioneering shared wealth practices, 
              creating sustainable value for all stakeholders while driving positive social impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="outline" className="border-blue-300 text-blue-100">
                <Globe className="w-3 h-3 mr-1" />
                Global Network
              </Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-100">
                <Heart className="w-3 h-3 mr-1" />
                Shared Values
              </Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                Sustainable Growth
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-navy mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex items-center space-x-3 flex-1 max-w-md">
                <div className="relative">
                  <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search companies, sectors, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-navy"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-48 h-12 border-2 border-gray-200 focus:border-navy">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector === "all" ? "All Sectors" : sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-48 h-12 border-2 border-gray-200 focus:border-navy">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>
                        {country === "all" ? "All Countries" : country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-navy mb-2">
                  {filteredCompanies.length} Companies Found
                </h2>
                <p className="text-muted-foreground">
                  Explore our network of shared wealth pioneers
                </p>
              </div>
              <Button variant="outline" asChild className="h-12 px-6">
                <Link to="/dashboard">Join Network</Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-12 h-12 text-gray-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold text-navy mb-3">Loading Network...</h3>
                <p className="text-muted-foreground">Fetching companies from the Shared Wealth Network</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCompanies.map((company) => (
                <Card key={company.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      {/* Logo Space */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200 group-hover:border-navy/30 transition-colors">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Building className={`w-8 h-8 text-gray-400 ${company.logo ? 'hidden' : ''}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg font-bold text-navy group-hover:text-navy/80 transition-colors line-clamp-2">
                            {company.name}
                          </CardTitle>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={`text-xs font-medium border ${getStatusColor(company.status)}`}>
                            {company.status}
                          </Badge>
                        </div>
                        
                        <CardDescription className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{company.location}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {company.description}
                    </p>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="text-lg font-bold text-blue-700">{company.employees}</div>
                        <div className="text-xs text-blue-600 font-medium">Employees</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="text-lg font-bold text-green-700">{company.sharedValue}</div>
                        <div className="text-xs text-green-600 font-medium">Shared Value</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="text-lg font-bold text-purple-700">{company.impactScore}/10</div>
                        <div className="text-xs text-purple-600 font-medium">Impact Score</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                        <div className="text-lg font-bold text-amber-700">{company.joinedDate}</div>
                        <div className="text-xs text-amber-600 font-medium">Joined</div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="mb-6">
                      <div className="text-xs font-semibold text-navy mb-3 flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        Key Highlights
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {company.highlights.slice(0, 3).map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/50">
                            {highlight}
                          </Badge>
                        ))}
                        {company.highlights.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-white/50">
                            +{company.highlights.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" asChild className="flex-1 h-10">
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Site
                        </a>
                      </Button>
                      <Button size="sm" asChild className="flex-1 h-10 bg-navy hover:bg-navy/90">
                        <Link to={`/companies/${company.id}`} className="flex items-center justify-center">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredCompanies.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-navy mb-3">No companies found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your search criteria or filters to find companies in our network.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSector("all");
                      setSelectedCountry("all");
                    }}
                    className="h-12 px-8"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Join Our Growing Network</h2>
            <p className="text-xl mb-10 text-blue-100 leading-relaxed">
              Ready to transform your business with shared wealth principles? 
              Join our network of innovative companies creating sustainable value for all stakeholders.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link to="/dashboard" className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Start Assessment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-navy">
                <Link to="/model" className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Learn Our Model
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Network;