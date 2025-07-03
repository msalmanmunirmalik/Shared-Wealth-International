import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CorePillars from "@/components/CorePillars";
import InteractiveToolsHome from "@/components/InteractiveToolsHome";
import LatestNews from "@/components/LatestNews";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CorePillars />
      <InteractiveToolsHome />
      
      {/* Minimal Network Showcase */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
              Our Growing Network
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Over 20 companies worldwide implementing shared wealth principles
            </p>
            
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-green" />
                <span className="text-lg">20+ Companies</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-teal" />
                <span className="text-lg">8 Sectors</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange" />
                <span className="text-lg">Global Reach</span>
              </div>
            </div>
            
            <Button asChild variant="green" size="lg">
              <Link to="/network">
                Explore Our Network
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LatestNews />
      <Footer />
    </div>
  );
};

export default Index;
