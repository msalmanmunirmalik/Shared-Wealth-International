import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Simplified navigation structure
  const mainNavigation = [
    { 
      name: "About Us", 
      href: "/about-us",
      description: "Learn about our story, vision, and team",
      icon: "💙"
    },
    { 
      name: "Concept", 
      href: "/model",
      description: "Understand shared wealth principles",
      icon: "📚"
    },
    { 
      name: "Network", 
      href: "/network",
      description: "Connect with partner companies",
      icon: "🌐"
    },
    { 
      name: "Impact", 
      href: "/collaboration-hub",
      description: "Track and share impact stories",
      icon: "📊"
    },
    { 
      name: "Tools & Learning", 
      href: "/resources",
      description: "Interactive tools, calculators, and learning resources",
      icon: "🛠️"
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/60420f71-0b50-4e40-a77c-25c13b6e0a56.png" 
                alt="Shared Wealth International Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-navy">Shared Wealth International Network</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group relative px-3 py-2 text-sm font-medium nav-link rounded-md hover:bg-accent/50"
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {item.description}
                </div>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/company-dashboard">
                  <Button variant="ghost" className="nav-link">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="nav-link"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=signin">
                  <Button variant="ghost" className="nav-link">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="btn-primary">
                    Join Network
                  </Button>
                </Link>
              </>
            )}
            
            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="text-sm bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-navy"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium nav-link rounded-md hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/company-dashboard">
                      <Button variant="ghost" className="w-full justify-start nav-link">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full justify-start nav-link"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth?mode=signin">
                      <Button variant="ghost" className="w-full nav-link">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup">
                      <Button className="w-full btn-primary">
                        Join Network
                      </Button>
                    </Link>
                  </div>
                )}
                
                {/* Mobile Language Selector */}
                <div className="pt-2">
                  <select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    className="w-full text-sm bg-transparent border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;