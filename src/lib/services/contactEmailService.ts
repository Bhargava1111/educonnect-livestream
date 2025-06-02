
import { supabase } from '@/integrations/supabase/client';

export const sendContactAutoReply = async (contactData: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    const response = await supabase.functions.invoke('send-contact-auto-reply', {
      body: contactData
    });

    if (response.error) {
      console.error('Error sending contact auto-reply:', response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending contact auto-reply:', error);
    return { success: false, error: error.message };
  }
};
