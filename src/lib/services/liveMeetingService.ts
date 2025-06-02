
import { supabase } from '@/integrations/supabase/client';

export interface LiveMeeting {
  id: string;
  title: string;
  description: string;
  course_id: string;
  instructor_id?: string;
  instructor_name: string;
  scheduled_date: string;
  duration: string;
  meeting_link: string;
  meeting_id?: string;
  platform: string;
  join_password?: string;
  status: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
}

// Get all live meetings
export const getAllLiveMeetings = async (): Promise<LiveMeeting[]> => {
  try {
    const { data, error } = await supabase
      .from('live_meetings')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching live meetings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching live meetings:', error);
    return [];
  }
};

// Get meetings by course
export const getMeetingsByCourse = async (courseId: string): Promise<LiveMeeting[]> => {
  try {
    const { data, error } = await supabase
      .from('live_meetings')
      .select('*')
      .eq('course_id', courseId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching course meetings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching course meetings:', error);
    return [];
  }
};

// Create a new live meeting
export const createLiveMeeting = async (meetingData: Omit<LiveMeeting, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: LiveMeeting; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('live_meetings')
      .insert(meetingData)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update a live meeting
export const updateLiveMeeting = async (id: string, updates: Partial<LiveMeeting>): Promise<{ success: boolean; data?: LiveMeeting; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('live_meetings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete a live meeting
export const deleteLiveMeeting = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('live_meetings')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
