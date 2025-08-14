import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Globe, Target, BarChart3, DollarSign, Settings, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Public platform features
  const publicFeatures = [
    {
      title: "About Us",
      description: "Learn about our mission, values, and leadership team",
      icon: Users,
      color: "bg-navy",
      iconColor: "text-white",
      href: "/about"
    },
    {
      title: "Concept",
      description: "Understand our Shared Wealth model and principles",
      icon: Target,
      color: "bg-green",
      iconColor: "text-white",
      href: "/model"
    },
    {
      title: "Tools & Learning",
      description: "Interactive tools and comprehensive training courses",
      icon: Settings,
      color: "bg-gold",
      iconColor: "text-navy",
      href: "/resources"
    },
    {
      title: "Impact Analytics",
      description: "Track and measure your social and economic impact",
      icon: BarChart3,
      color: "bg-navy",
      iconColor: "text-white",
      href: "/collaboration-hub"
    }
  ];

  // Private platform features (require authentication)
  const privateFeatures = [
    {
      title: "Network",
      description: "Connect with Shared Wealth companies worldwide",
      icon: Globe,
      color: "bg-green",
      iconColor: "text-white",
      href: "/network"
    },
    {
      title: "Funding Platform",
      description: "AI-powered funding opportunities and partnerships",
      icon: DollarSign,
      color: "bg-gold",
      iconColor: "text-navy",
      href: "/funding-platform"
    },
    {
      title: "Business Canvas",
      description: "Design your shared wealth business model",
      icon: Target,
      color: "bg-navy",
      iconColor: "text-white",
      href: "/business-canvas"
    },
    {
      title: "Discussion Forums",
      description: "Engage in meaningful conversations with the community",
      icon: Users,
      color: "bg-green",
      iconColor: "text-white",
      href: "/forum"
    },
    {
      title: "News & Updates",
      description: "Stay informed with latest industry insights and updates",
      icon: BarChart3,
      color: "bg-gold",
      iconColor: "text-navy",
      href: "/events"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Welcome Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 bg-white/20 backdrop-blur-sm border border-white/30 text-white">
              <Star className="w-4 h-4 mr-2 text-gold" />
              Welcome to Shared Wealth International
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white">
              Building a World of
              <span className="text-gold block">Shared Prosperity</span>
            </h1>

            {/* Simple Description */}
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Join our global network of companies committed to equitable wealth distribution, 
              inclusive decision-making, and sustainable business practices.
            </p>

            {/* Simple Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
              <div className="flex items-center text-white/90">
                <Users className="w-5 h-5 mr-2 text-gold" />
                <span className="text-lg font-medium">24+ Companies</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30" />
              <div className="flex items-center text-white/90">
                <Globe className="w-5 h-5 mr-2 text-gold" />
                <span className="text-lg font-medium">12 Countries</span>
              </div>
            </div>

            {/* Simple CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 bg-gold hover:bg-gold-light text-navy font-semibold">
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 bg-white text-navy hover:bg-gray-100 font-semibold">
                <Link to="/auth">
                  Sign In
                </Link>
              </Button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Public Features */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Public Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our platform and learn about shared wealth principles - no account required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {publicFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group">
                  <Link to={feature.href} className="block">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-navy/30 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                      <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-navy group-hover:text-navy-light transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore Feature
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Private Features */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Private Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access exclusive features and connect with our community - requires authentication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {privateFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-not-allowed opacity-75">
                    <div className="relative">
                      <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-navy group-hover:text-navy-light transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-gray-500 text-sm font-medium">
                      <Lock className="w-4 h-4 mr-1" />
                      Authentication Required
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, hsl(45 100% 50%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-navy">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-navy/80 max-w-2xl mx-auto">
            Join our network and start your journey toward shared wealth creation today.
          </p>
          <Button asChild size="lg" className="text-lg px-8 bg-navy hover:bg-navy-light text-white font-semibold">
            <Link to="/auth">
              Join Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          {/* Sign In Text */}
          <div className="mt-6 text-navy/80">
            <span>Already have an account? </span>
            <Link to="/auth" className="text-white hover:text-white/90 underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-navy text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <p className="text-gray-300">
            © 2024 Shared Wealth International. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
