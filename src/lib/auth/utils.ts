
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Student } from '@/lib/types';

// Get the current student - async version
export const getCurrentStudent = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Error getting current student:", error);
    return null;
  }
};

// Get the current session - async version
export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session;
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
};

// Synchronous version that returns cached session user
// This is for backward compatibility with components that expect synchronous behavior
export const getCurrentStudentSync = (): User | null => {
  try {
    // Local storage check for session - manual implementation since 
    // newer versions of Supabase don't have a synchronous session() method
    const localStorageSession = localStorage.getItem('supabase.auth.token');
    if (localStorageSession) {
      try {
        const parsed = JSON.parse(localStorageSession);
        return parsed?.currentSession?.user || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting current student sync:", error);
    return null;
  }
};

// Helper function to map User to Student type
export const mapUserToStudent = (user: User | null): Student | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.user_metadata?.name || `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim(),
    email: user.email || '',
    enrolledCourses: user.user_metadata?.enrolledCourses || [],
    firstName: user.user_metadata?.firstName || '',
    lastName: user.user_metadata?.lastName || '',
    phone: user.user_metadata?.phone || '',
    createdAt: user.created_at || new Date().toISOString(),
    isActive: true
  };
};
