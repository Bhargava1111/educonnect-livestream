
import { supabase } from '@/integrations/supabase/client';
import { StudentActivityRow } from '../types';

// Get student login history
export const getStudentLoginHistory = async (studentId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .eq('activity_type', 'login')
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error("Error fetching login history:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching login history:", error);
    return [];
  }
};

// Get student activity
export const getStudentActivity = async (studentId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error("Error fetching student activity:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching student activity:", error);
    return [];
  }
};

// Format active time
export const formatActiveTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};

// Get student total active time
export const getStudentTotalActiveTime = async (studentId: string): Promise<number> => {
  // This would require custom analytics logic based on your activity tracking
  // For now, returning a placeholder value
  return 120; // 2 hours in minutes
};

// Get student last active time
export const getStudentLastActiveTime = async (studentId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('student_activities')
      .select('timestamp')
      .eq('student_id', studentId)
      .order('timestamp', { ascending: false })
      .limit(1);
      
    if (error || !data || data.length === 0) {
      return null;
    }
    
    return data[0].timestamp;
  } catch (error) {
    console.error("Error getting last active time:", error);
    return null;
  }
};
