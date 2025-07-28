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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Impact Stories
            </h1>
            <p className="text-xl lg:text-2xl text-white/80 mb-8">
              Real stories of transformation, showcasing the tangible impact 
              of shared wealth principles in action across diverse organizations.
            </p>
            <div className="flex items-center justify-center gap-8 text-white/90">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#eabc27' }} />
                <span>Measurable Results</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" style={{ color: '#eabc27' }} />
                <span>Real Organizations</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" style={{ color: '#eabc27' }} />
                <span>Authentic Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Impact */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#07264e' }}>
              Collective Impact
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#086075' }}>
              The cumulative effect of shared wealth implementation across 
              our global network of companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {overallImpact.map((impact, index) => (
              <Card key={impact.metric} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold" style={{ color: '#34a63b' }}>{impact.value}</CardTitle>
                  <CardDescription className="font-semibold" style={{ color: '#07264e' }}>{impact.metric}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: '#086075' }}>{impact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #086075 0%, #34a63b 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Transformation Stories
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Deep dives into how specific organizations have implemented 
              shared wealth principles and the results they've achieved.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: '#eabc27' }} />
              <span className="font-medium text-white">Filter by sector:</span>
            </div>
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border rounded-md" style={{ borderColor: 'rgba(234, 188, 39, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
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
              <Card key={story.company} className="animate-fade-in overflow-hidden" style={{ animationDelay: `${index * 0.2}s`, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader style={{ background: 'linear-gradient(135deg, rgba(8, 96, 117, 0.1) 0%, rgba(52, 166, 59, 0.1) 100%)' }}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl" style={{ color: '#07264e' }}>{story.company}</CardTitle>
                      <CardDescription className="text-lg font-medium" style={{ color: '#086075' }}>
                        {story.sector} • {story.region}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {story.mechanisms.map(mechanism => (
                        <Badge key={mechanism} variant="secondary" style={{ backgroundColor: 'rgba(234, 188, 39, 0.1)', color: '#eabc27' }}>{mechanism}</Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      {/* Video Section */}
                      <div className="aspect-video rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
                        <div className="text-white text-center">
                          <div className="text-lg font-semibold mb-1">{story.company}</div>
                          <div className="text-sm opacity-90">Impact Story Video</div>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-3" style={{ color: '#07264e' }}>The Story</h4>
                      <p className="mb-4" style={{ color: '#086075' }}>{story.story}</p>
                      
                      <blockquote className="border-l-4 pl-4 italic mb-4" style={{ borderColor: '#34a63b', color: '#086075' }}>
                        "{story.quote}"
                        <footer className="text-sm font-medium mt-2" style={{ color: '#07264e' }}>— {story.keyPerson}</footer>
                      </blockquote>
                      
                      <div className="text-sm" style={{ color: '#086075' }}>
                        <strong>Timeline:</strong> {story.timeline}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: '#07264e' }}>Impact Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {story.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(8, 96, 117, 0.2)' }}>
                            <div className={`text-2xl font-bold mb-1 ${
                              metric.type === 'increase' ? 'text-green' :
                              metric.type === 'financial' ? 'text-teal' :
                              metric.type === 'percentage' ? 'text-orange' :
                              'text-navy'
                            }`} style={{ color: metric.type === 'increase' ? '#34a63b' : metric.type === 'financial' ? '#086075' : metric.type === 'percentage' ? '#eabc27' : '#07264e' }}>
                              {metric.value}
                            </div>
                            <div className="text-xs" style={{ color: '#086075' }}>{metric.label}</div>
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
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#07264e' }}>
                Our Impact Measurement Approach
              </h2>
              <p className="text-xl" style={{ color: '#086075' }}>
                Transparency and rigor in how we measure and validate impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center animate-fade-in" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(52, 166, 59, 0.1)' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#34a63b' }} />
                  </div>
                  <CardTitle className="text-xl" style={{ color: '#07264e' }}>Quantitative Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: '#086075' }}>Financial indicators, engagement scores, and measurable business outcomes tracked over time.</p>
                </CardContent>
              </Card>

              <Card className="text-center animate-fade-in" style={{ animationDelay: '0.1s', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(8, 96, 117, 0.1)' }}>
                    <Users className="w-6 h-6" style={{ color: '#086075' }} />
                  </div>
                  <CardTitle className="text-xl" style={{ color: '#07264e' }}>Stakeholder Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: '#086075' }}>Regular surveys and interviews with employees, customers, and community members.</p>
                </CardContent>
              </Card>

              <Card className="text-center animate-fade-in" style={{ animationDelay: '0.2s', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(234, 188, 39, 0.1)' }}>
                    <Heart className="w-6 h-6" style={{ color: '#eabc27' }} />
                  </div>
                  <CardTitle className="text-xl" style={{ color: '#07264e' }}>Third-Party Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: '#086075' }}>Independent social audits and external verification of reported impact metrics.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #07264e 0%, #086075 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            Create Your Own Impact Story
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Ready to transform your organization and join the growing community 
            of companies creating measurable social and economic impact?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-white" style={{ background: 'linear-gradient(135deg, #eabc27 0%, #34a63b 100%)' }}>
              Start Your Transformation
            </Button>
            <Button variant="outline" size="lg" style={{ borderColor: '#eabc27', color: '#eabc27' }}>
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