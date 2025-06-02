
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = "https://ttkbtoxcmbshcqfpcike.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, supabaseServiceKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactRequest = await req.json();

    // Get email settings
    const { data: emailSettings } = await supabase
      .from('system_settings')
      .select('settings')
      .eq('id', 'email')
      .single();

    const settings = emailSettings?.settings || {};
    
    // Check if auto-reply is enabled
    if (!settings.auto_reply_enabled) {
      return new Response(JSON.stringify({ message: "Auto-reply is disabled" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get auto-reply template
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'auto_reply')
      .eq('is_active', true)
      .single();

    if (!template) {
      return new Response(JSON.stringify({ error: "Auto-reply template not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Process template variables
    const variables = {
      name,
      institute_name: settings.from_name || 'Career Aspire Academy'
    };

    let processedSubject = template.subject;
    let processedHtml = template.html_content;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
      processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), value);
    });

    // Send auto-reply email
    const emailPayload = {
      to: email,
      subject: processedSubject,
      html: processedHtml,
      from: `${settings.from_name || 'Career Aspire Academy'} <${settings.from_email || 'notifications@careeraspire.com'}>`,
      reply_to: settings.reply_to
    };

    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send auto-reply email');
    }

    return new Response(JSON.stringify({ message: "Auto-reply sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-auto-reply function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
