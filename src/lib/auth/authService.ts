
import { supabase } from '@/integrations/supabase/client';
import { StudentData } from '../types';

// Check if a student is logged in
export const isStudentLoggedIn = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking student login status:", error);
    return false;
  }
};

// Login a student
export const loginStudent = async (email: string, password: string): Promise<{ success: boolean, data?: any, error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "No user data returned" };
    }

    // Track login activity
    const { error: activityError } = await supabase.from('student_activities').insert({
      student_id: data.user.id,
      activity_type: 'login',
      context: { method: 'email' }
    });

    if (activityError) {
      console.error("Error tracking login activity:", activityError);
    }

    return {
      success: true,
      data: data.user
    };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, error: "An unexpected error occurred during login" };
  }
};

// Logout a student
export const logoutStudent = async (): Promise<{ success: boolean, error?: string }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData.session?.user) {
      // Track logout activity
      const { error: activityError } = await supabase.from('student_activities').insert({
        student_id: sessionData.session.user.id,
        activity_type: 'logout',
        context: {}
      });

      if (activityError) {
        console.error("Error tracking logout activity:", activityError);
      }
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, error: "An unexpected error occurred during logout" };
  }
};
