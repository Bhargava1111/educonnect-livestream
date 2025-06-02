
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, conversationId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get conversation history for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    const context = history?.map(msg => ({
      role: msg.role,
      content: msg.content
    })) || [];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are CareerAspire AI, a helpful assistant for an educational platform. Help students with course selection, career guidance, placement preparation, and general educational queries. Be encouraging and professional.' 
          },
          ...context,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store conversation
    await supabase.from('chat_messages').insert([
      {
        conversation_id: conversationId,
        user_id: userId,
        role: 'user',
        content: message
      },
      {
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant',
        content: aiResponse
      }
    ]);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
