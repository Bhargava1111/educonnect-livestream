
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppMessage {
  to: string;
  message: string;
  templateName?: string;
  templateData?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, templateName, templateData }: WhatsAppMessage = await req.json();
    
    const whatsappApiUrl = Deno.env.get("WHATSAPP_API_URL");
    const whatsappToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    
    if (!whatsappApiUrl || !whatsappToken) {
      throw new Error("WhatsApp API credentials not configured");
    }

    let payload;
    
    if (templateName) {
      // Send template message
      payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: templateData ? [
            {
              type: "body",
              parameters: templateData.map((data: string) => ({ type: "text", text: data }))
            }
          ] : []
        }
      };
    } else {
      // Send text message
      payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      };
    }

    const response = await fetch(`${whatsappApiUrl}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${whatsappToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${JSON.stringify(result)}`);
    }

    // Log the message
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabase.from('whatsapp_logs').insert({
      to_number: to,
      message: message || `Template: ${templateName}`,
      status: 'sent',
      whatsapp_message_id: result.messages?.[0]?.id
    });

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.messages?.[0]?.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error in whatsapp-notify function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
