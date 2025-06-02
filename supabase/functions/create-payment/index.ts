
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { courseId, amount, currency, paymentMethod }: PaymentRequest = await req.json();
    
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET");
    
    if (!razorpayKeyId || !razorpaySecret) {
      throw new Error("Payment gateway not configured");
    }

    // Create Razorpay order
    const orderPayload = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: `course_${courseId}_${user.id}_${Date.now()}`,
      payment_capture: 1
    };

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpaySecret}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const order = await razorpayResponse.json();
    
    if (!razorpayResponse.ok) {
      throw new Error(`Razorpay error: ${order.error?.description || 'Unknown error'}`);
    }

    // Store payment transaction
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("payment_transactions").insert({
      user_id: user.id,
      course_id: courseId,
      amount: amount,
      currency: currency,
      payment_method: paymentMethod,
      status: "pending",
      payment_gateway: "razorpay",
      transaction_id: order.id,
    });

    return new Response(JSON.stringify({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpayKeyId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error in create-payment function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
