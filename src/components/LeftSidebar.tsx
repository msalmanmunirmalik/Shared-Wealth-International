import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, Building, Users, Calendar, FileText, MessageSquare, Target, DollarSign, BarChart3, Brain, BookOpen, Star, TrendingUp, Globe, Settings, ChevronRight, Bell, User
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
    { id: 'company-dashboard', name: 'Company Dashboard', icon: Home, description: 'Main dashboard', primary: true },
    { id: 'network', name: 'Network', icon: Globe, description: 'Company network' },
    { id: 'funding-platform', name: 'Funding Platform', icon: DollarSign, description: 'Funding opportunities' },
    { id: 'business-canvas', name: 'Business Canvas', icon: Target, description: 'Business model canvas' },
    { id: 'tools-learning', name: 'Tools & Learning', icon: Settings, description: 'Learning resources' }
  ];

  const renderNavItem = (item: any) => (
    <button
      key={item.id}
      onClick={() => onTabChange(item.id)}
      className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        activeTab === item.id
          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
      } ${item.primary ? 'mb-2' : ''}`}
    >
      <div className={`p-2 rounded-lg ${
        activeTab === item.id 
          ? 'bg-blue-100 text-blue-600' 
          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
      }`}>
        <item.icon className="h-5 w-5" />
      </div>
      {!isCollapsed && (
        <div className="ml-3 flex-1 text-left">
          <div className="font-semibold">{item.name}</div>
          {item.description && (
            <div className={`text-xs mt-1 ${
              activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {item.description}
            </div>
          )}
        </div>
      )}
      {!isCollapsed && (
        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
          activeTab === item.id ? 'rotate-90 text-blue-500' : 'group-hover:rotate-90'
        }`} />
      )}
    </button>
  );

  return (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 shadow-lg ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-blue-200">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <Bell className="w-3 h-3 mr-1" />
                      Notifications
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2">
          {mainNavigation.map(item => renderNavItem(item))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        {!isCollapsed ? (
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-gray-50">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-white hover:bg-gray-50"
              onClick={handleSignOut}
            >
              <User className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Button variant="outline" size="sm" className="p-2 bg-white hover:bg-gray-50">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="p-2 bg-white hover:bg-gray-50">
              <User className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
