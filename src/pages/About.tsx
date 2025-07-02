import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, MapPin, Calendar } from "lucide-react";

const About = () => {
  const leadership = [
    {
      name: "Cliff Southcombe",
      role: "Lead Facilitator & Strategic Advisor",
      bio: "Visionary leader driving the global Shared Wealth movement with over 20 years of experience in sustainable business models.",
      expertise: "Strategic Planning, Stakeholder Engagement, Social Impact"
    },
    {
      name: "James Perry",
      role: "Shareholding & Governance Specialist",
      bio: "Expert in innovative ownership structures and democratic governance frameworks for equitable wealth distribution.",
      expertise: "Corporate Governance, Phantom Shares, Inclusive Decision-Making"
    },
    {
      name: "Muhammad Malik",
      role: "Legal/Technical Support & Ethical Oversight",
      bio: "Legal expert ensuring ethical implementation of Shared Wealth principles across diverse regulatory environments.",
      expertise: "Legal Frameworks, Regulatory Compliance, Ethical Standards"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About Shared Wealth International
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Building the foundation for a more equitable economic future through 
              shared ownership, inclusive governance, and value-led business practices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Shared Wealth International emerged from the evolution of SEi (Social Enterprise international) 
                into Shared Wealth Ltd, marking a pivotal transformation in our approach to equitable business practices. 
                This evolution was catalyzed by our groundbreaking partnership with Terratai Ltd through a comprehensive 
                Social Licence Agreement.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                What began as a mission to support social enterprises has grown into a comprehensive framework 
                for transforming traditional business models. Today, we serve as the global hub for companies 
                committed to shared wealth creation, connecting over 20 organizations across diverse sectors 
                and geographies.
              </p>
              <p className="text-lg text-muted-foreground">
                Our journey reflects a fundamental shift from charity-based approaches to systematic change 
                in how value is created, shared, and governed in business. We believe that true economic 
                equity requires structural transformation, not just good intentions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-navy">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A world where economic prosperity is shared equitably among all stakeholders, 
                  where businesses operate with transparent governance, and where value creation 
                  serves the common good alongside individual success.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-2xl text-navy">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To accelerate the global adoption of Shared Wealth principles by providing 
                  frameworks, resources, and support for businesses committed to equitable 
                  wealth distribution and inclusive decision-making.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-2xl text-navy">Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Transparency in all operations</li>
                  <li>• Stakeholder-centered governance</li>
                  <li>• Sustainable value creation</li>
                  <li>• Democratic participation</li>
                  <li>• Social and environmental responsibility</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="leadership" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the visionary leaders driving the global Shared Wealth movement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <Card key={leader.name} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-background font-bold text-xl">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-navy text-center">{leader.name}</CardTitle>
                  <CardDescription className="text-center font-medium text-teal">
                    {leader.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{leader.bio}</p>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold text-navy mb-1">Expertise:</p>
                    <p className="text-sm text-muted-foreground">{leader.expertise}</p>
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
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Discover how your organization can implement Shared Wealth principles 
            and become part of our growing global network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="green" size="lg">
              Explore Our Model
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-navy">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;