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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = localStorage.getItem('session');
        const storedUser = localStorage.getItem('user');
        const storedIsAdmin = localStorage.getItem('isAdmin');

        if (storedSession && storedUser) {
          const parsedSession = JSON.parse(storedSession);
          const parsedUser = JSON.parse(storedUser);
          const parsedIsAdmin = storedIsAdmin === 'true';

          setSession(parsedSession);
          setUser(parsedUser);
          setIsAdmin(parsedIsAdmin);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear invalid data
        localStorage.removeItem('session');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
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
        
        // Check if user is admin
        try {
          const adminCheck = await apiService.isAdmin(response.session.user.id);
          setIsAdmin(adminCheck);
          
          // Store in localStorage
          localStorage.setItem('session', JSON.stringify(response.session));
          localStorage.setItem('user', JSON.stringify(response.session.user));
          localStorage.setItem('isAdmin', adminCheck.toString());
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

  const signUp = async (email: string, password: string) => {
    try {
      await apiService.signUp(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await apiService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
    }
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
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
