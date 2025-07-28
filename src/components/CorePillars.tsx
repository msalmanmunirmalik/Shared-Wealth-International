import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Circle } from "lucide-react";

interface Pillar {
  id: string;
  title: string;
  icon: any;
  description: string;
  details: string[];
  examples: string[];
}

const pillars: Pillar[] = [
  {
    id: "shared-wealth",
    title: "Shared Wealth Creation",
    icon: Star,
    description: "Giving stakeholders a genuine share in the value they create.",
    details: [
      "Phantom share programs for employees",
      "Community stakeholding initiatives",
      "Reciprocal ownership structures",
      "Value distribution transparency"
    ],
    examples: [
      "Employee phantom shares at 15% of company value",
      "Community profit-sharing programs",
      "Supplier partnership equity models"
    ]
  },
  {
    id: "inclusive-decision",
    title: "Inclusive Decision-Making",
    icon: Users,
    description: "Embedding stakeholder voices into governance structures.",
    details: [
      "IT-powered governance platforms",
      "Stakeholder representation councils",
      "Democratic decision-making processes",
      "Transparent governance frameworks"
    ],
    examples: [
      "Digital voting platforms for key decisions",
      "Quarterly stakeholder assemblies",
      "Cross-sector advisory boards"
    ]
  },
  {
    id: "value-led",
    title: "Value-Led Approach",
    icon: Circle,
    description: "Ensuring clear social mission and mutual responsibilities.",
    details: [
      "Mission-driven business models",
      "Social impact measurement",
      "Mutual accountability frameworks",
      "Purpose-aligned partnerships"
    ],
    examples: [
      "Annual social audits and impact reports",
      "Community benefit requirements",
      "Environmental and social commitments"
    ]
  }
];

const CorePillars = () => {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">The Three Core Pillars</h2>
          <p className="body-large max-w-3xl mx-auto">
            Our comprehensive framework for building equitable and sustainable business models 
            that benefit all stakeholders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isActive = activePillar === pillar.id;
            
            return (
              <Card
                key={pillar.id}
                className={`cursor-pointer transition-all duration-300 hover-lift card-professional ${
                  isActive ? 'ring-2 ring-gold shadow-lg' : ''
                }`}
                onClick={() => setActivePillar(isActive ? null : pillar.id)}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gold/10">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <CardTitle className="text-xl font-bold text-navy">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>

                {isActive && (
                  <CardContent className="animate-fade-in-up">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">Key Mechanisms:</h4>
                        <ul className="space-y-2">
                          {pillar.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <Circle className="w-2 h-2 mt-2 mr-3 flex-shrink-0 text-gold" />
                              <span className="text-sm text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">Real Examples:</h4>
                        <ul className="space-y-2">
                          {pillar.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start">
                              <Star className="w-2 h-2 mt-2 mr-3 flex-shrink-0 text-gold" />
                              <span className="text-sm italic text-muted-foreground">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Click on each pillar to explore detailed mechanisms and real-world examples
          </p>
        </div>
      </div>
    </section>
  );
};

export default CorePillars;