import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero text-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold-light text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4 mr-2" />
              Global Hub for Equitable Wealth Distribution
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Empowering{" "}
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Shared Wealth
              </span>{" "}
              Creation
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-background/80 mb-8 max-w-3xl mx-auto animate-fade-in">
              Building a global network of over 20 companies committed to shared wealth creation, 
              inclusive decision-making, and value-led approaches to business.
            </p>

            {/* Key Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10 animate-fade-in">
              <div className="flex items-center text-background/90">
                <Users className="w-5 h-5 mr-2 text-gold" />
                <span className="text-lg">20+ Partner Companies</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-background/30" />
              <div className="flex items-center text-background/90">
                <Star className="w-5 h-5 mr-2 text-gold" />
                <span className="text-lg">Global Impact Network</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button variant="gold" size="lg" className="text-lg px-8">
                Explore Our Model
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="hero" size="lg" className="text-lg px-8">
                Meet Our Network
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-background"
          fill="currentColor"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C240,120 480,120 720,60 C960,0 1200,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;