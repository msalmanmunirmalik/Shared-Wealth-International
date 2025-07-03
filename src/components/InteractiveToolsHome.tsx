import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ClipboardCheck, Settings, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const InteractiveToolsHome = () => {
  const tools = [
    {
      title: "Readiness Assessment",
      description: "Evaluate your organization's alignment with Shared Wealth principles",
      icon: ClipboardCheck,
      href: "/assessment",
      color: "bg-gradient-to-br from-green/10 to-green/20 border-green/20"
    },
    {
      title: "Impact Calculator",
      description: "Calculate potential financial and social impact of shared wealth practices",
      icon: Calculator,
      href: "/calculator", 
      color: "bg-gradient-to-br from-teal/10 to-teal/20 border-teal/20"
    },
    {
      title: "Governance Simulator",
      description: "Explore how different governance models impact stakeholder outcomes",
      icon: Users,
      href: "/simulator",
      color: "bg-gradient-to-br from-orange/10 to-orange/20 border-orange/20"
    },
    {
      title: "Model Configurator",
      description: "Build your custom Shared Wealth model with our interactive tool",
      icon: Settings,
      href: "/configurator",
      color: "bg-gradient-to-br from-purple/10 to-purple/20 border-purple/20"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
            Interactive Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our suite of interactive tools designed to help you understand, 
            implement, and optimize shared wealth principles in your organization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={tool.title}
              className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in group ${tool.color}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-8 h-8 text-navy" />
                </div>
                <CardTitle className="text-xl text-navy">{tool.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="group-hover:bg-navy group-hover:text-background transition-colors">
                  <Link to={tool.href}>
                    Try Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveToolsHome;