
import { supabase } from '@/integrations/supabase/client';

// Get the current student
export const getCurrentStudent = async () => {
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
