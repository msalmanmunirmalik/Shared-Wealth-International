import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Handshake, Target, TrendingUp, Building, Users, Globe, Award } from "lucide-react";

const Partnerships = () => {
  const keyPartnerships = [
    {
      name: "Terratai Ltd",
      type: "Flagship Partnership",
      description: "Through our comprehensive Social Licence Agreement, Terratai Ltd has become our flagship Shared Wealth enterprise, demonstrating the full transformation from traditional business to equitable wealth distribution.",
      keyPerson: "Matt Legget",
      achievements: [
        "Implemented phantom share program (15% value sharing)",
        "Established democratic governance structure",
        "Created inclusive decision-making platform",
        "Achieved 40% increase in employee engagement"
      ],
      focus: "Technology & Democratic Governance"
    },
    {
      name: "Pathway Points Ltd",
      type: "Strategic Collaboration",
      description: "Our partnership with Pathway Points focuses on promoting and implementing the innovative Pathway housing and finance model, creating sustainable community wealth building solutions.",
      keyPerson: "Partnership Team",
      achievements: [
        "Launched Pathways Scotland Initiative",
        "Established Pathway Clubs network",
        "Implemented IT-powered governance systems",
        "Created two-way value agreements framework"
      ],
      focus: "Housing & Community Finance"
    }
  ];

  const supportingEntities = [
    {
      category: "The Shared Wealth Group",
      entities: [
        { name: "SEi Caledonia Ltd", role: "Legal & Regulatory Support", focus: "Corporate structuring and compliance" },
        { name: "Spark CIC", role: "Community Development", focus: "Social impact and community engagement" },
        { name: "LocoSoco PLC", role: "Technology Solutions", focus: "Digital platforms and governance tools" },
        { name: "World Health Innovation Summit (WHIS)", role: "Healthcare Innovation", focus: "Health-focused shared wealth models" },
        { name: "Nigerian Capital Development Fund (NCDF)", role: "Financial Services", focus: "International funding and development" },
        { name: "Media Cultured Ltd", role: "Communications & Media", focus: "Brand development and outreach" }
      ]
    },
    {
      category: "Pathway Supporting Network",
      entities: [
        { name: "Sustainable-Roots Limited", role: "Environmental Impact", focus: "Sustainable development practices" },
        { name: "Tallarna Limited", role: "Strategic Consulting", focus: "Business model innovation" },
        { name: "Life Sciences Healthcare", role: "Healthcare Solutions", focus: "Health-centered community models" },
        { name: "Two Hands Consultancy Limited", role: "Implementation Support", focus: "Operational transformation" },
        { name: "Maven Housing Limited", role: "Housing Solutions", focus: "Community housing development" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Strategic Partnerships
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Building a powerful ecosystem of organizations committed to 
              shared wealth creation and equitable business transformation.
            </p>
            <div className="flex items-center justify-center gap-8 text-background/90">
              <div className="flex items-center">
                <Handshake className="w-5 h-5 mr-2" />
                <span>Strategic Alliances</span>
              </div>
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                <span>Shared Goals</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>Collective Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Partnerships */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Flagship Partnerships
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deep collaborative relationships that exemplify the power of 
              shared wealth principles in action.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {keyPartnerships.map((partnership, index) => (
              <Card key={partnership.name} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-navy">{partnership.name}</CardTitle>
                      <CardDescription className="text-teal font-medium mt-1">
                        {partnership.type}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{partnership.focus}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{partnership.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {partnership.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <ArrowRight className="w-4 h-4 text-green mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-navy">Key Contact:</span> {partnership.keyPerson}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Entities */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Supporting Network
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A diverse ecosystem of specialized organizations providing expertise, 
              resources, and implementation support.
            </p>
          </div>

          {supportingEntities.map((group, groupIndex) => (
            <div key={group.category} className="mb-12">
              <h3 className="text-2xl font-bold text-navy mb-6 text-center">{group.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.entities.map((entity, index) => (
                  <Card key={entity.name} className="animate-fade-in hover:shadow-md transition-all duration-300" style={{ animationDelay: `${(groupIndex * 6 + index) * 0.1}s` }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-navy">{entity.name}</CardTitle>
                      <CardDescription className="text-teal font-medium">
                        {entity.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{entity.focus}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Impact */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Collective Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Together, our partnerships are creating measurable change in how 
              businesses operate and value is distributed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold text-green mb-2">15+</div>
              <p className="text-muted-foreground">Strategic Partners</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-teal mb-2">£2M+</div>
              <p className="text-muted-foreground">Value Shared Annually</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-orange mb-2">500+</div>
              <p className="text-muted-foreground">Employees Benefiting</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-navy mb-2">8</div>
              <p className="text-muted-foreground">Countries Represented</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-navy text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Become a Strategic Partner
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Join our ecosystem of organizations committed to transforming business 
            through shared wealth creation and equitable governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg">
              Explore Partnership Opportunities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-navy">
              Download Partnership Framework
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;