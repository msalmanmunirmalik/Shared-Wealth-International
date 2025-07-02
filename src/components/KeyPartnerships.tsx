import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, MapPin } from "lucide-react";

const partnerships = [
  {
    id: "terratai",
    name: "Terratai Ltd",
    type: "Flagship Enterprise",
    description: "Strategic Social Licence Agreement transitioning Terratai into a flagship Shared Wealth enterprise.",
    keyCommitments: [
      "Opening ownership and governance structures",
      "Implementing employee phantom share programs",
      "Democratic decision-making for product development",
      "Transparent value distribution frameworks"
    ],
    keyPerson: "Matt Legget - Strategic Partnership Lead",
    impact: "First major technology company to fully adopt the Shared Wealth model",
    location: "United Kingdom"
  },
  {
    id: "pathway",
    name: "Pathway Points Ltd",
    type: "Strategic Collaboration",
    description: "Comprehensive partnership promoting the innovative Pathway housing and finance model across Scotland and beyond.",
    keyCommitments: [
      "Pathways Scotland Initiative implementation",
      "Community-focused Pathway Clubs development",
      "IT-powered governance platform deployment",
      "Two-way value agreement frameworks"
    ],
    keyPerson: "Partnership Team - Housing Innovation",
    impact: "Revolutionary approach to community-owned housing and finance",
    location: "Scotland",
    supportingEntities: [
      "Sustainable-Roots Limited",
      "Tallarna Limited", 
      "Life Sciences Healthcare",
      "Two Hands Consultancy Limited",
      "Maven Housing Limited"
    ]
  }
];

const supportingGroup = [
  {
    name: "SEi Caledonia Ltd",
    role: "Legal & Strategic Support",
    description: "Providing legal frameworks and strategic guidance for Shared Wealth implementation."
  },
  {
    name: "Spark CIC",
    role: "Community Development",
    description: "Driving grassroots community engagement and local economic development initiatives."
  },
  {
    name: "LocoSoco PLC",
    role: "Platform & Technology",
    description: "Social enterprise platform connecting communities with shared wealth opportunities."
  },
  {
    name: "World Health Innovation Summit (WHIS)",
    role: "Global Health Impact",
    description: "Integrating Shared Wealth principles into global health innovation and policy."
  },
  {
    name: "Nigerian Capital Development Fund (NCDF)",
    role: "Financial Innovation",
    description: "Promoting shared wealth creation across Nigerian enterprises and communities."
  },
  {
    name: "Media Cultured Ltd",
    role: "Media & Communications",
    description: "Strategic communications and media outreach for the Shared Wealth movement."
  }
];

const KeyPartnerships = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Strategic Partnerships
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our key strategic alliances and supporting entities driving the global adoption 
            of Shared Wealth principles across diverse sectors.
          </p>
        </div>

        {/* Main Partnerships */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {partnerships.map((partnership, index) => (
            <Card 
              key={partnership.id} 
              className="animate-fade-in hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                    <span className="text-charcoal font-bold">
                      {partnership.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                    {partnership.type}
                  </span>
                </div>
                <CardTitle className="text-xl text-charcoal">{partnership.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {partnership.description}
                </CardDescription>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {partnership.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">Key Commitments:</h4>
                    <ul className="space-y-1">
                      {partnership.keyCommitments.map((commitment, idx) => (
                        <li key={idx} className="flex items-start text-sm text-muted-foreground">
                          <Star className="w-3 h-3 text-gold mt-0.5 mr-2 flex-shrink-0" />
                          {commitment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {partnership.supportingEntities && (
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Supporting Entities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partnership.supportingEntities.map((entity, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                          >
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground italic mb-2">
                      <strong>Impact:</strong> {partnership.impact}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Key Contact:</strong> {partnership.keyPerson}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* The Shared Wealth Group */}
        <div className="bg-card rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-charcoal mb-4">
              The Shared Wealth Group
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our supporting network of specialized entities providing comprehensive expertise 
              across legal, financial, media, and community development domains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportingGroup.map((entity, index) => (
              <div 
                key={entity.name}
                className="bg-background p-4 rounded-lg border border-border animate-fade-in hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-3">
                  <Users className="w-5 h-5 text-gold mr-2" />
                  <span className="font-semibold text-charcoal">{entity.name}</span>
                </div>
                <div className="text-xs text-gold bg-gold/10 px-2 py-1 rounded mb-2 inline-block">
                  {entity.role}
                </div>
                <p className="text-sm text-muted-foreground">
                  {entity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Interested in strategic partnership opportunities? Let's discuss how we can collaborate 
            to expand the Shared Wealth movement.
          </p>
          <Button variant="gold" size="lg">
            Explore Partnership
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default KeyPartnerships;