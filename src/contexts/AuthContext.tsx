
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check if user is admin - this is simplified, in a real app you might check roles in a database
        if (currentSession?.user) {
          const userEmail = currentSession.user.email;
          setIsAdmin(userEmail === 'Bhargava@123');
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check if user is admin
      if (currentSession?.user) {
        const userEmail = currentSession.user.email;
        setIsAdmin(userEmail === 'Bhargava@123');
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Track login activity
      if (data.user) {
        const { error: activityError } = await supabase.from('student_activities').insert({
          student_id: data.user.id,
          activity_type: 'login',
          context: { method: 'email' }
        });

        if (activityError) {
          console.error('Failed to track login activity:', activityError);
        }
      }

      // Redirect based on role
      if (data.user?.email === 'Bhargava@123') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  // Sign in with phone
  const signInWithPhone = async (phone: string, password: string) => {
    try {
      // First, get user by phone from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .single();

      if (profileError) {
        return { success: false, error: 'No account found with this phone number' };
      }

      if (!profileData?.id) {
        return { success: false, error: 'No account found with this phone number' };
      }

      // Then get the email for that user
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profileData.id);

      if (userError || !userData?.user?.email) {
        return { success: false, error: 'Failed to find user account' };
      }

      // Now sign in with the email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Track login activity
      if (data.user) {
        const { error: activityError } = await supabase.from('student_activities').insert({
          student_id: data.user.id,
          activity_type: 'login',
          context: { method: 'phone' }
        });

        if (activityError) {
          console.error('Failed to track login activity:', activityError);
        }
      }

      // Redirect based on role
      if (data.user?.email === 'Bhargava@123') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return { success: true };
    } catch (error) {
      console.error('Phone login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  // Sign up with email
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please check your email for verification.",
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'An error occurred during registration'
      };
    }
  };

  const signOut = async () => {
    try {
      // Track logout activity if user exists
      if (user) {
        const { error: activityError } = await supabase.from('student_activities').insert({
          student_id: user.id,
          activity_type: 'logout',
          context: {}
        });

        if (activityError) {
          console.error('Failed to track logout activity:', activityError);
        }
      }

      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const value = {
    session,
    user,
    isAdmin,
    isLoading,
    signIn,
    signInWithPhone,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
