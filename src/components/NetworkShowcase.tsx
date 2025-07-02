import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";

interface Company {
  id: string;
  name: string;
  sector: string;
  location: string;
  description: string;
  impact: string;
  logo?: string;
}

const companies: Company[] = [
  {
    id: "terratai",
    name: "Terratai Ltd",
    sector: "Technology & Innovation",
    location: "United Kingdom",
    description: "Leading technology firm implementing phantom share programs and democratic decision-making platforms for product development.",
    impact: "15% phantom shares distributed to employees, 40% increase in employee engagement"
  },
  {
    id: "pathway-points",
    name: "Pathway Points Ltd",
    sector: "Housing & Finance",
    location: "Scotland",
    description: "Pioneering housing and finance solutions with community-focused wealth distribution models.",
    impact: "Community benefit requirements in all projects, 25% profit-sharing with local initiatives"
  },
  {
    id: "sei-caledonia",
    name: "SEi Caledonia Ltd",
    sector: "Consulting & Development",
    location: "Scotland",
    description: "Strategic consulting firm specializing in inclusive business model transformation.",
    impact: "50+ companies supported in Shared Wealth adoption, 200% growth in stakeholder participation"
  },
  {
    id: "spark-cic",
    name: "Spark CIC",
    sector: "Community Interest",
    location: "United Kingdom", 
    description: "Community-focused enterprise driving local economic development through shared ownership models.",
    impact: "Community asset lock ensures 100% reinvestment, 30+ local partnerships established"
  },
  {
    id: "locosoco",
    name: "LocoSoco PLC",
    sector: "Social Enterprise",
    location: "Global",
    description: "Social enterprise platform connecting local communities with shared wealth opportunities worldwide.",
    impact: "Global network of 100+ communities, $2M+ in shared value creation"
  },
  {
    id: "whis",
    name: "World Health Innovation Summit",
    sector: "Healthcare Innovation",
    location: "Global",
    description: "International healthcare summit implementing inclusive decision-making in global health policy.",
    impact: "Multi-stakeholder governance model, 80+ countries participating in democratic health decisions"
  },
  {
    id: "ncdf",
    name: "Nigerian Capital Development Fund",
    sector: "Financial Services",
    location: "Nigeria",
    description: "Development fund promoting shared wealth creation across Nigerian enterprises.",
    impact: "₦50B+ distributed through shared ownership, 500+ Nigerian businesses supported"
  },
  {
    id: "media-cultured",
    name: "Media Cultured Ltd",
    sector: "Media & Communications",
    location: "United Kingdom",
    description: "Media company with transparent profit-sharing and stakeholder governance models.",
    impact: "Editorial decisions democratized, 20% profit-sharing with content creators"
  }
];

const additionalCompanies = [
  "Sustainable-Roots Limited", "Tallarna Limited", "Life Sciences Healthcare",
  "Two Hands Consultancy Limited", "Maven Housing Limited", "Green Future Tech",
  "Community Works Ltd", "Ethical Finance Group", "Social Impact Ventures",
  "Democratic Manufacturing Co", "Inclusive Energy Solutions", "Fair Trade Collective"
];

const NetworkShowcase = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedCompanies = showAll ? companies : companies.slice(0, 6);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Our Growing Network
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the diverse portfolio of over 20 companies implementing Shared Wealth principles 
            across multiple sectors and geographies.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-gold" />
              <span>20+ Active Companies</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gold" />
              <span>8 Key Sectors</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gold" />
              <span>Global Presence</span>
            </div>
          </div>
        </div>

        {/* Interactive Company Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedCompanies.map((company, index) => (
            <Card
              key={company.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedCompany?.id === company.id ? 'ring-2 ring-gold shadow-gold' : ''
              } animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedCompany(selectedCompany?.id === company.id ? null : company)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                    <span className="text-charcoal font-bold text-lg">
                      {company.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {company.sector}
                  </span>
                </div>
                
                <h3 className="font-bold text-charcoal mb-2">{company.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  {company.location}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {company.description}
                </p>

                {selectedCompany?.id === company.id && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                    <h4 className="font-semibold text-charcoal mb-2">Impact Highlights:</h4>
                    <p className="text-sm text-muted-foreground italic">
                      {company.impact}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More/Less Button */}
        {!showAll && (
          <div className="text-center mb-12">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="mb-4"
            >
              View All Companies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Additional Companies Grid */}
        {showAll && (
          <div className="border-t border-border pt-12">
            <h3 className="text-2xl font-bold text-charcoal text-center mb-8">
              Additional Network Partners
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {additionalCompanies.map((company, index) => (
                <div
                  key={company}
                  className="bg-muted p-4 rounded-lg text-center hover:bg-muted/80 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-8 h-8 bg-gradient-gold rounded mx-auto mb-2 flex items-center justify-center">
                    <span className="text-charcoal font-bold text-xs">
                      {company.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal">{company}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Interested in joining our network? Let's explore how your organization can implement Shared Wealth principles.
          </p>
          <Button variant="green" size="lg">
            Partner with Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NetworkShowcase;