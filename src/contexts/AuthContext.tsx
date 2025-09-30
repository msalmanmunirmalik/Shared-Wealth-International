import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService } from '@/services/api';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  created_at: string;
}

export interface Session {
  user: User;
  access_token: string;
}

interface ProfileData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  position?: string;
  company?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  role?: string;
  profileImage?: File | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData?: ProfileData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  startDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = localStorage.getItem('session');
        const storedUser = localStorage.getItem('user');
        const storedIsAdmin = localStorage.getItem('isAdmin');
        const storedIsDemoMode = localStorage.getItem('isDemoMode');

        if (storedSession && storedUser) {
          const parsedSession = JSON.parse(storedSession);
          const parsedUser = JSON.parse(storedUser);
          const parsedIsAdmin = storedIsAdmin === 'true';
          const parsedIsDemoMode = storedIsDemoMode === 'true';

          setSession(parsedSession);
          setUser(parsedUser);
          setIsAdmin(parsedIsAdmin);
          setIsDemoMode(parsedIsDemoMode);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear invalid data
        localStorage.removeItem('session');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isDemoMode');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.signIn(email, password);
      
      if (response.session) {
        setSession(response.session);
        setUser(response.session.user);
        
        // Store session immediately
        localStorage.setItem('session', JSON.stringify(response.session));
        localStorage.setItem('user', JSON.stringify(response.session.user));
        
        // Check if user is admin with a small delay to ensure token is set
        try {
          // Wait a bit for localStorage to be updated
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const adminCheck = await apiService.isAdmin(response.session.user.id);
          setIsAdmin(adminCheck);
          localStorage.setItem('isAdmin', adminCheck.toString());
          
          console.log('🔐 Auth Debug - Admin check result:', adminCheck);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, profileData?: ProfileData) => {
    try {
      if (profileData) {
        // Enhanced signup with profile data
        await apiService.signUpWithProfile(profileData);
      } else {
        // Basic signup
        await apiService.signUp(email, password);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (!isDemoMode) {
        await apiService.signOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsDemoMode(false);
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isDemoMode');
    }
  };

  const startDemo = () => {
    // Create demo user and session
    const demoUser: User = {
      id: 'demo-user-123',
      email: 'demo@sharedwealth.com',
      role: 'user',
      created_at: new Date().toISOString(),
    };

    const demoSession: Session = {
      user: demoUser,
      access_token: 'demo-token-123',
    };

    setUser(demoUser);
    setSession(demoSession);
    setIsAdmin(false);
    setIsDemoMode(true);

    // Store in localStorage
    localStorage.setItem('session', JSON.stringify(demoSession));
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('isAdmin', 'false');
    localStorage.setItem('isDemoMode', 'true');
  };

  const resetPassword = async (email: string) => {
    try {
      await apiService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    isDemoMode,
    signIn,
    signUp,
    signOut,
    resetPassword,
    startDemo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
