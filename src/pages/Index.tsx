import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Globe, Target, BarChart3, DollarSign, Settings, Lock, Heart, TrendingUp, CheckCircle, Building2, Lightbulb, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {

  // Public Features - no account required
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
      color: "bg-green",
      iconColor: "text-white",
      href: "/impact-analytics"
    }
  ];

  // Private Features - network members only
  const privateFeatures = [
    {
      title: "Network",
      description: "Connect with companies committed to shared wealth",
      icon: Globe,
      color: "bg-green",
      iconColor: "text-white",
      href: "/network",
      locked: true
    },
    {
      title: "Funding Platform",
      description: "AI-powered funding opportunities and partnerships",
      icon: DollarSign,
      color: "bg-gold",
      iconColor: "text-navy",
      href: "/funding-platform",
      locked: true
    },
    {
      title: "Business Canvas",
      description: "Design and collaborate on shared wealth business models",
      icon: Building2,
      color: "bg-navy",
      iconColor: "text-white",
      href: "/business-canvas",
      locked: true
    },
    {
      title: "Discussion Forums",
      description: "Join conversations with the shared wealth community",
      icon: Users,
      color: "bg-green",
      iconColor: "text-white",
      href: "/forum",
      locked: true
    },
    {
      title: "News & Updates",
      description: "Stay informed about shared wealth developments",
      icon: Star,
      color: "bg-gold",
      iconColor: "text-navy",
      href: "/news",
      locked: true
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Values-Driven",
      description: "Clear values that reflect business sense and social commitment"
    },
    {
      icon: Users,
      title: "Inclusive Governance",
      description: "Transparent decision-making with stakeholder input"
    },
    {
      icon: TrendingUp,
      title: "Flexible Wealth Sharing",
      description: "Choose appropriate ways to share wealth and success"
    }
  ];

  const stats = [
    { number: "24+", label: "Companies" },
    { number: "40+", label: "Countries" },
    { number: "30+", label: "Years Experience" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Compact and Focused */}
      <section className="py-12" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Beyond Traditional Business
              <span className="text-gold block">Shared Wealth Model</span>
            </h1>
            
            <p className="text-lg mb-6 max-w-2xl mx-auto text-white/90">
              Join companies transforming how wealth is created and shared. 
              Flexible frameworks that benefit everyone.
            </p>

            {/* Key Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gold">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold mb-4 text-navy">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Join the shared wealth community and start transforming your business today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <Link to="/auth">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                  <Link to="/auth">
                    Create Account
                  </Link>
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <span>New to shared wealth? </span>
                <Link to="/model" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Learn about our model first
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Features */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Public Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our platform and learn about shared wealth principles - no account required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-navy text-sm font-medium group-hover:text-navy-light transition-colors">
                        Explore Feature
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                  </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Private Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy">Private Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exclusive features for network members - join to unlock these powerful tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {privateFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-not-allowed opacity-75">
                    <div className="relative">
                      <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                      {feature.locked && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-navy">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm font-medium">
                      <Lock className="w-4 h-4 mr-1" />
                      Join Network Required
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-navy">What Makes Shared Wealth Different?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Three decades of evolution from social enterprise to flexible wealth sharing
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-navy">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
              <blockquote className="text-xl font-medium text-navy mb-4 italic">
                "Shared Wealth built loyal customers, motivated employees, incentivised investors, and strengthened our social brand."
              </blockquote>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">James Perry</span>, CEO of LocoSoco
                  </div>
                  </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, hsl(45 100% 50%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-navy">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 text-navy/80 max-w-2xl mx-auto">
            Join companies that have moved beyond traditional business models. 
            Discover what works in practice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 bg-navy hover:bg-navy-light text-white font-semibold">
              <Link to="/auth">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 text-navy/80">
            <span>Already have an account? </span>
            <Link to="/auth" className="text-white hover:text-white/90 underline font-medium">
              Sign in
              </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-navy text-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300">
            © 2024 Shared Wealth International. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
