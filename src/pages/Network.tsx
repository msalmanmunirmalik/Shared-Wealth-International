import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Building, Filter } from "lucide-react";
import { useState } from "react";

const Network = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    sector: "all",
    region: "all",
    size: "all"
  });

  const companies = [
    {
      name: "Terratai Ltd",
      sector: "Technology",
      region: "UK",
      size: "Medium",
      description: "Digital solutions company implementing phantom shares and democratic governance structures.",
      mechanisms: ["Phantom Shares", "Democratic Governance"],
      location: "Scotland, UK",
      employees: "50-100"
    },
    {
      name: "Pathway Points Ltd",
      sector: "Housing & Finance",
      region: "UK",
      size: "Medium",
      description: "Housing and finance model focused on community stakeholding and inclusive decision-making.",
      mechanisms: ["Community Stakeholding", "IT-Powered Governance"],
      location: "Scotland, UK",
      employees: "25-50"
    },
    {
      name: "Green Tech Solutions",
      sector: "Environmental",
      region: "Europe",
      size: "Small",
      description: "Renewable energy company with employee ownership and environmental impact focus.",
      mechanisms: ["Employee Ownership", "Social Audit"],
      location: "Berlin, Germany",
      employees: "10-25"
    },
    {
      name: "Community Care Co-op",
      sector: "Healthcare",
      region: "North America",
      size: "Large",
      description: "Healthcare cooperative providing community-owned healthcare services.",
      mechanisms: ["Cooperative Structure", "Community Governance"],
      location: "Toronto, Canada",
      employees: "200+"
    },
    {
      name: "Sustainable Farming Network",
      sector: "Agriculture",
      region: "Africa",
      size: "Medium",
      description: "Agricultural network promoting farmer ownership and sustainable practices.",
      mechanisms: ["Farmer Ownership", "Value-Led Approach"],
      location: "Kenya",
      employees: "50-100"
    },
    {
      name: "Ethical Manufacturing Hub",
      sector: "Manufacturing",
      region: "Asia",
      size: "Large",
      description: "Manufacturing company with worker cooperatives and transparent governance.",
      mechanisms: ["Worker Cooperatives", "Transparent Governance"],
      location: "Mumbai, India",
      employees: "300+"
    }
  ];

  const filteredCompanies = companies.filter(company => {
    return (selectedFilters.sector === "all" || company.sector === selectedFilters.sector) &&
           (selectedFilters.region === "all" || company.region === selectedFilters.region) &&
           (selectedFilters.size === "all" || company.size === selectedFilters.size);
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Our Global Network
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Meet the 20+ companies pioneering shared wealth creation across 
              diverse sectors and regions worldwide.
            </p>
            <div className="flex items-center justify-center gap-8 text-background/90">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                <span>20+ Companies</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>6 Continents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-navy">Filter by:</span>
            </div>
            
            <select 
              value={selectedFilters.sector}
              onChange={(e) => setSelectedFilters({...selectedFilters, sector: e.target.value})}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Housing & Finance">Housing & Finance</option>
              <option value="Environmental">Environmental</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>

            <select 
              value={selectedFilters.region}
              onChange={(e) => setSelectedFilters({...selectedFilters, region: e.target.value})}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Regions</option>
              <option value="UK">UK</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
            </select>

            <select 
              value={selectedFilters.size}
              onChange={(e) => setSelectedFilters({...selectedFilters, size: e.target.value})}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Sizes</option>
              <option value="Small">Small (10-25)</option>
              <option value="Medium">Medium (25-100)</option>
              <option value="Large">Large (100+)</option>
            </select>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedFilters({sector: "all", region: "all", size: "all"})}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Shared Wealth Companies
            </h2>
            <p className="text-xl text-muted-foreground">
              Showing {filteredCompanies.length} companies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company, index) => (
              <Card key={company.name} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-navy">{company.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {company.location}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{company.sector}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{company.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-navy text-sm mb-1">Shared Wealth Mechanisms:</h4>
                      <div className="flex flex-wrap gap-1">
                        {company.mechanisms.map((mechanism) => (
                          <Badge key={mechanism} variant="outline" className="text-xs">
                            {mechanism}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {company.employees} employees
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-navy text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join Our Growing Network
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Ready to transform your business and become part of the global 
            Shared Wealth movement?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg">
              Apply to Join Network
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-navy">
              Download Partnership Guide
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Network;