import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)' }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Professional Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <Star className="w-4 h-4 mr-2 text-green-300" />
              Global Hub for Equitable Wealth Distribution
            </div>

            {/* Main Headline */}
            <h1 className="heading-1 mb-6 text-white animate-fade-in-up">
              <span className="text-white font-bold">Empowering</span>{" "}
              <span className="text-green-300 font-bold">
                Shared Wealth
              </span>{" "}
              <span className="text-white font-bold">Creation</span>
            </h1>

            {/* Subheadline */}
            <p className="body-large mb-8 max-w-3xl mx-auto animate-fade-in-up text-white/90">
              Building a global network of over 20 companies committed to shared wealth creation, 
              inclusive decision-making, and value-led approaches to business.
            </p>

            {/* Key Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10 animate-fade-in-up">
              <div className="flex items-center text-white/90">
                <Users className="w-5 h-5 mr-2 text-green-300" />
                <span className="text-lg font-medium">20+ Partner Companies</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20" />
              <div className="flex items-center text-white/90">
                <Star className="w-5 h-5 mr-2 text-green-300" />
                <span className="text-lg font-medium">Global Impact Network</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Button asChild size="lg" className="text-lg px-8 bg-green-500 hover:bg-green-600 text-white border-0">
                <Link to="/model">
                  Explore Our Model
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 bg-green-500 hover:bg-green-600 text-white border-0">
                <Link to="/network">
                  Meet Our Network
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12"
          fill="currentColor"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ color: 'white' }}
        >
          <path d="M0,60 C240,120 480,120 720,60 C960,0 1200,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;