import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Heart, Filter } from "lucide-react";
import { useState } from "react";

const Impact = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const impactStories = [
    {
      company: "Terratai Ltd",
      sector: "Technology",
      region: "UK",
      story: "Through implementing a comprehensive phantom share program, Terratai transformed its workplace culture and financial performance.",
      metrics: [
        { label: "Employee Engagement", value: "+40%", type: "increase" },
        { label: "Value Shared Annually", value: "£120K", type: "financial" },
        { label: "Employee Retention", value: "+25%", type: "increase" },
        { label: "Democratic Decisions", value: "85%", type: "percentage" }
      ],
      keyPerson: "Matt Legget, CEO",
      quote: "The shared wealth model didn't just change our financials – it transformed how we work together as a team.",
      timeline: "Implemented over 18 months",
      mechanisms: ["Phantom Shares", "Democratic Governance", "Social Audit"]
    },
    {
      company: "Pathway Points Ltd",
      sector: "Housing & Finance",
      region: "UK",
      story: "Revolutionizing community housing through innovative financing models that give residents genuine ownership stakes.",
      metrics: [
        { label: "Community Ownership", value: "35%", type: "percentage" },
        { label: "Housing Units Developed", value: "150", type: "number" },
        { label: "Community Satisfaction", value: "+60%", type: "increase" },
        { label: "Local Investment", value: "£2.1M", type: "financial" }
      ],
      keyPerson: "Partnership Team",
      quote: "We're not just building houses – we're building communities where everyone has a stake in the future.",
      timeline: "3-year initiative",
      mechanisms: ["Community Stakeholding", "IT-Powered Governance", "Two-Way Value Agreements"]
    },
    {
      company: "Green Tech Solutions",
      sector: "Environmental",
      region: "Europe",
      story: "A renewable energy startup that embedded environmental and social impact into every business decision from day one.",
      metrics: [
        { label: "CO2 Emissions Reduced", value: "500 tons", type: "environmental" },
        { label: "Employee Ownership", value: "45%", type: "percentage" },
        { label: "Community Energy Projects", value: "12", type: "number" },
        { label: "Revenue Growth", value: "+180%", type: "increase" }
      ],
      keyPerson: "Dr. Sarah Weber, Founder",
      quote: "Shared wealth principles allowed us to align profit with purpose from the very beginning.",
      timeline: "Since founding in 2022",
      mechanisms: ["Employee Ownership", "Environmental Impact Sharing", "Community Governance"]
    },
    {
      company: "Community Care Co-op",
      sector: "Healthcare",
      region: "North America",
      story: "Healthcare cooperative demonstrating how shared ownership can improve both patient outcomes and worker satisfaction.",
      metrics: [
        { label: "Patient Satisfaction", value: "+45%", type: "increase" },
        { label: "Worker-Owners", value: "85%", type: "percentage" },
        { label: "Community Health Programs", value: "25", type: "number" },
        { label: "Cost Savings to Patients", value: "$1.2M", type: "financial" }
      ],
      keyPerson: "Dr. Maria Rodriguez, Medical Director",
      quote: "When healthcare workers own their workplace, everyone benefits – patients, workers, and the community.",
      timeline: "Cooperative structure since 2020",
      mechanisms: ["Worker Cooperative", "Patient Representation", "Community Health Focus"]
    }
  ];

  const overallImpact = [
    { metric: "Total Value Shared", value: "£8.2M", description: "Across all partner companies annually" },
    { metric: "Employees Benefiting", value: "1,200+", description: "Direct beneficiaries of shared wealth programs" },
    { metric: "Communities Served", value: "45", description: "Local communities with active stakeholder representation" },
    { metric: "Democratic Decisions", value: "2,500+", description: "Decisions made through inclusive processes" }
  ];

  const filteredStories = selectedFilter === "all" 
    ? impactStories 
    : impactStories.filter(story => story.sector === selectedFilter);

  const sectors = ["all", ...new Set(impactStories.map(story => story.sector))];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Impact Stories
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Real stories of transformation, showcasing the tangible impact 
              of shared wealth principles in action across diverse organizations.
            </p>
            <div className="flex items-center justify-center gap-8 text-background/90">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>Measurable Results</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Real Organizations</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span>Authentic Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Impact */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Collective Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The cumulative effect of shared wealth implementation across 
              our global network of companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {overallImpact.map((impact, index) => (
              <Card key={impact.metric} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-green">{impact.value}</CardTitle>
                  <CardDescription className="text-navy font-semibold">{impact.metric}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{impact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Transformation Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deep dives into how specific organizations have implemented 
              shared wealth principles and the results they've achieved.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-navy">Filter by sector:</span>
            </div>
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === "all" ? "All Sectors" : sector}
                </option>
              ))}
            </select>
          </div>

          {/* Stories */}
          <div className="space-y-12">
            {filteredStories.map((story, index) => (
              <Card key={story.company} className="animate-fade-in overflow-hidden" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="bg-gradient-subtle">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-navy">{story.company}</CardTitle>
                      <CardDescription className="text-lg font-medium text-teal">
                        {story.sector} • {story.region}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {story.mechanisms.map(mechanism => (
                        <Badge key={mechanism} variant="secondary">{mechanism}</Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-3">The Story</h4>
                      <p className="text-muted-foreground mb-4">{story.story}</p>
                      
                      <blockquote className="border-l-4 border-green pl-4 italic text-muted-foreground mb-4">
                        "{story.quote}"
                        <footer className="text-sm font-medium text-navy mt-2">— {story.keyPerson}</footer>
                      </blockquote>
                      
                      <div className="text-sm text-muted-foreground">
                        <strong>Timeline:</strong> {story.timeline}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-3">Impact Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {story.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center p-3 bg-background rounded-lg border">
                            <div className={`text-2xl font-bold mb-1 ${
                              metric.type === 'increase' ? 'text-green' :
                              metric.type === 'financial' ? 'text-teal' :
                              metric.type === 'percentage' ? 'text-orange' :
                              'text-navy'
                            }`}>
                              {metric.value}
                            </div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
                Our Impact Measurement Approach
              </h2>
              <p className="text-xl text-muted-foreground">
                Transparency and rigor in how we measure and validate impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center animate-fade-in">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green" />
                  </div>
                  <CardTitle className="text-xl text-navy">Quantitative Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Financial indicators, engagement scores, and measurable business outcomes tracked over time.</p>
                </CardContent>
              </Card>

              <Card className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-teal" />
                  </div>
                  <CardTitle className="text-xl text-navy">Stakeholder Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Regular surveys and interviews with employees, customers, and community members.</p>
                </CardContent>
              </Card>

              <Card className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-orange" />
                  </div>
                  <CardTitle className="text-xl text-navy">Third-Party Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Independent social audits and external verification of reported impact metrics.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-navy text-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Create Your Own Impact Story
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Ready to transform your organization and join the growing community 
            of companies creating measurable social and economic impact?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg">
              Start Your Transformation
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-navy">
              Download Impact Framework
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Impact;