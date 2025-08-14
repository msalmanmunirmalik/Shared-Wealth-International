import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  JWTSecurity, 
  RateLimiter, 
  InputSanitizer, 
  CSRFProtection,
  CookieSecurity,
  SessionSecurity,
  SECURITY_CONFIG 
} from '@/lib/security';
import { secureApi } from '@/lib/secureApi';
import { useToast } from '@/hooks/use-toast';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  remainingAttempts: number;
  isLockedOut: boolean;
}

interface SecureAuthActions {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
  validateSession: () => boolean;
  clearSecurityData: () => void;
}

export const useSecureAuth = (): SecureAuthState & SecureAuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingAttempts, setRemainingAttempts] = useState(SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const { toast } = useToast();

  // Initialize JWT security
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await JWTSecurity.initializeJwks(import.meta.env.VITE_SUPABASE_URL || 'https://ewqwjduvjkddknpqpmfr.supabase.co');
      } catch (error) {
        console.error('Failed to initialize JWT security:', error);
      }
    };

    initializeSecurity();
  }, []);

  // Initialize CSRF protection
  useEffect(() => {
    CSRFProtection.createToken();
  }, []);

  // Session management
  useEffect(() => {
    let sessionTimeout: NodeJS.Timeout;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session) {
            // Start session timeout
            SessionSecurity.startSessionTimeout(() => {
              toast({
                title: "Session Expired",
                description: "Your session has expired. Please sign in again.",
                variant: "destructive"
              });
              signOut();
            }, SECURITY_CONFIG.TOKEN_EXPIRY);
          }
        }
      } catch (error) {
        console.error('Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session) {
          // Reset rate limiting for successful login
          RateLimiter.resetAttempts(session.user.email || 'unknown');
          setRemainingAttempts(SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS);
          setIsLockedOut(false);
          
          // Start session timeout
          SessionSecurity.startSessionTimeout(() => {
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please sign in again.",
              variant: "destructive"
            });
            signOut();
          }, SECURITY_CONFIG.TOKEN_EXPIRY);
          
          toast({
            title: "Welcome!",
            description: `Signed in as ${session.user.email}`,
          });
        } else if (event === 'SIGNED_OUT') {
          // Clear session timeout
          if (sessionTimeout) {
            clearTimeout(sessionTimeout);
          }
          
          // Clear security data
          clearSecurityData();
          
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        }
        
        setLoading(false);
      }
    );

    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: any }> => {
    try {
      // Sanitize inputs
      const sanitizedEmail = InputSanitizer.sanitizeEmail(email);
      
      // Check rate limiting
      if (!RateLimiter.checkRateLimit(sanitizedEmail)) {
        setIsLockedOut(true);
        const remaining = RateLimiter.getRemainingAttempts(sanitizedEmail);
        setRemainingAttempts(remaining);
        
        toast({
          title: "Account Locked",
          description: `Too many failed attempts. Try again in ${SECURITY_CONFIG.LOCKOUT_DURATION / 1000} seconds.`,
          variant: "destructive"
        });
        
        return { error: { message: 'Account temporarily locked due to too many failed attempts' } };
      }

      console.log('Attempting secure sign in for:', sanitizedEmail);
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Update remaining attempts
        const remaining = RateLimiter.getRemainingAttempts(sanitizedEmail);
        setRemainingAttempts(remaining);
        
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Reset rate limiting on successful login
        RateLimiter.resetAttempts(sanitizedEmail);
        setRemainingAttempts(SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS);
        setIsLockedOut(false);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string): Promise<{ error: any }> => {
    try {
      // Sanitize inputs
      const sanitizedEmail = InputSanitizer.sanitizeEmail(email);
      
      // Validate password strength
      const passwordValidation = InputSanitizer.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { 
          error: { 
            message: `Password validation failed: ${passwordValidation.errors.join(', ')}` 
          } 
        };
      }
      
      console.log('Attempting secure sign up for:', sanitizedEmail);
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Check your email",
          description: "Please check your email for a confirmation link",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log('Signing out user:', user?.email);
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Sign out successful');
        setUser(null);
        setSession(null);
        
        // Clear security data
        clearSecurityData();
        
        toast({
          title: "Signed out successfully",
          description: "You have been signed out",
        });
      }
    } catch (error) {
      console.error('Sign out exception:', error);
      toast({
        title: "Sign Out Failed",
        description: "An error occurred while signing out",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.email, toast]);

  const resetPassword = useCallback(async (email: string): Promise<{ error: any }> => {
    try {
      // Sanitize inputs
      const sanitizedEmail = InputSanitizer.sanitizeEmail(email);
      
      console.log('Attempting password reset for:', sanitizedEmail);
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/auth`
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Check your email",
          description: "Password reset instructions sent to your email",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Password reset exception:', error);
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        
        // Reset session timeout
        SessionSecurity.resetSessionTimeout(() => {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive"
          });
          signOut();
        }, SECURITY_CONFIG.TOKEN_EXPIRY);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      // If refresh fails, sign out the user
      await signOut();
    }
  }, [toast, signOut]);

  const validateSession = useCallback((): boolean => {
    return SessionSecurity.validateSession();
  }, []);

  const clearSecurityData = useCallback((): void => {
    secureApi.clearSecurityData();
    setRemainingAttempts(SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS);
    setIsLockedOut(false);
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session,
    remainingAttempts,
    isLockedOut,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
    validateSession,
    clearSecurityData,
  };
};
