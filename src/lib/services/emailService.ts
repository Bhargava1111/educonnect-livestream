
import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  event_type: string;
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

// Get email template by name
export const getEmailTemplate = async (name: string): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching email template:', error);
    return null;
  }
};

// Get all email templates
export const getAllEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return [];
  }
};

// Create or update email template
export const saveEmailTemplate = async (templateData: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: EmailTemplate; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .upsert(templateData, { onConflict: 'name' })
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

// Get system settings
export const getSystemSettings = async (settingId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('settings')
      .eq('id', settingId)
      .single();

    if (error) {
      console.error('Error fetching system settings:', error);
      return null;
    }

    return data?.settings;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return null;
  }
};

// Update system settings
export const updateSystemSettings = async (settingId: string, settings: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        id: settingId,
        settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Replace template variables with actual values
export const processEmailTemplate = (template: EmailTemplate, variables: Record<string, string>): { subject: string; html: string; text: string } => {
  let processedSubject = template.subject;
  let processedHtml = template.html_content;
  let processedText = template.text_content;

  // Replace all variables in the format {{variable_name}}
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
    processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), value);
    processedText = processedText.replace(new RegExp(placeholder, 'g'), value);
  });

  return {
    subject: processedSubject,
    html: processedHtml,
    text: processedText
  };
};
