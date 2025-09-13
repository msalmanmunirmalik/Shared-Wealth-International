import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, Building, Users, Calendar, FileText, MessageSquare, Target, DollarSign, BarChart3, Brain, BookOpen, Star, TrendingUp, Globe, Settings, ChevronRight, Bell, User, ChevronLeft, HelpCircle
} from 'lucide-react';

interface LeftSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LeftSidebar = ({ isCollapsed, onToggle, activeTab, onTabChange }: LeftSidebarProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const mainNavigation = [
    { id: 'user-dashboard', name: 'User Dashboard', icon: Home, description: 'Main dashboard', primary: true },
    { id: 'news-updates', name: 'News & Updates', icon: FileText, description: 'Latest news and updates' },
    { id: 'network', name: 'Network', icon: Globe, description: 'Company network' },
    { id: 'funding-platform', name: 'Funding Platform', icon: DollarSign, description: 'Funding opportunities' },
    { id: 'business-canvas', name: 'Business Canvas', icon: Target, description: 'Business model canvas' },
    { id: 'tools-learning', name: 'Tools & Learning', icon: Settings, description: 'Learning resources' }
  ];

  const renderNavItem = (item: any) => (
    <button
      key={item.id}
      onClick={() => onTabChange(item.id)}
      className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
        activeTab === item.id
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-l-4 border-amber-400 shadow-lg'
          : 'text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-900 hover:shadow-md'
      } ${item.primary ? 'mb-2' : ''}`}
    >
      <div className={`p-2 rounded-lg ${
        activeTab === item.id 
          ? 'bg-white/20 text-white' 
          : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300'
      }`}>
        <item.icon className="h-5 w-5" />
      </div>
      {!isCollapsed && (
        <div className="ml-3 flex-1 text-left">
          <div className="font-semibold">{item.name}</div>
          {item.description && (
            <div className={`text-xs mt-1 ${
              activeTab === item.id ? 'text-blue-100' : 'text-blue-500'
            }`}>
              {item.description}
            </div>
          )}
        </div>
      )}
      {!isCollapsed && (
        <ChevronRight className={`h-4 w-4 text-blue-400 transition-transform ${
          activeTab === item.id ? 'rotate-90 text-white' : 'group-hover:rotate-90'
        }`} />
      )}
    </button>
  );

  return (
    <div className={`bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 shadow-lg ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* User Profile Section */}
      <div className="p-4 border-b border-slate-200" style={{ background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' }}>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-white/80 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="mt-3 flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/20 text-xs"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="p-2 border-b border-slate-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle()}
          className="w-full hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {mainNavigation.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'text-white shadow-lg' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
            style={activeTab === item.id ? { background: 'linear-gradient(135deg, hsl(220 50% 20%) 0%, hsl(160 50% 40%) 100%)' } : {}}
          >
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
            }`}>
              <item.icon className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <span className="ml-3 flex-1 text-left">{item.name}</span>
            )}
            {!isCollapsed && activeTab === item.id && (
              <ChevronRight className="w-4 h-4 text-white/80" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
            onClick={() => {/* Handle settings */}}
          >
            <Settings className="w-4 h-4 mr-2" />
            {!isCollapsed && "Settings"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
            onClick={() => {/* Handle help */}}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {!isCollapsed && "Help"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
