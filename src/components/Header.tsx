import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home,
  Users, 
  BookOpen, 
  Globe, 
  TrendingUp, 
  Settings, 
  Menu,
  X,
  MessageCircle,
  User,
  DollarSign,
  Target
} from "lucide-react";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const mainNavigation = [
    { name: 'About Us', href: '/about', icon: Users },
    { name: 'Concept', href: '/model', icon: BookOpen },
    { name: 'Network', href: '/network', icon: Globe },
    { name: 'Impact Analytics', href: '/impact-analytics', icon: TrendingUp },
    { name: 'Funding Platform', href: '/funding-platform', icon: DollarSign },
    { name: 'Business Canvas', href: '/business-canvas', icon: Target },
    { name: 'Tools & Learning', href: '/resources', icon: Settings }
  ];

  const renderNavItem = (item: any) => {
    // Skip protected routes for non-authenticated users
    if (item.protected && !user) return null;

    return (
      <Link
        key={item.href}
        to={item.href}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive(item.href)
            ? 'bg-primary text-primary-foreground'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <item.icon className={`mr-2 h-4 w-4 ${
          isActive(item.href) ? 'text-primary-foreground' : 'text-gray-400'
        }`} />
        {item.name}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/60420f71-0b50-4e40-a77c-25c13b6e0a56.png" 
                alt="Shared Wealth International Logo" 
                className="w-8 h-8"
              />
              <div className="hidden md:block">
                <span className="text-xl font-bold text-gray-900">Shared Wealth International</span>
                <p className="text-sm text-gray-600">Network</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavigation.map(item => renderNavItem(item))}
          </nav>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">EN</option>
              <option value="nl">NL</option>
              <option value="de">DE</option>
              <option value="fr">FR</option>
            </select>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block">{user.email?.split('@')[0]}</span>
                  </Button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        to="/user-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-1">
              {mainNavigation.map(item => renderNavItem(item))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;