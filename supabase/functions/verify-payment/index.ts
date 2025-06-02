
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();
    
    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET");
    
    if (!razorpaySecret) {
      throw new Error("Razorpay secret not configured");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update payment status
    const { data: transaction, error: updateError } = await supabase
      .from("payment_transactions")
      .update({
        status: "completed",
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq("transaction_id", razorpay_order_id)
      .select()
      .single();

    if (updateError || !transaction) {
      throw new Error("Failed to update payment status");
    }

    // Enroll user in course
    await supabase.from("enrollments").insert({
      student_id: transaction.user_id,
      course_id: transaction.course_id,
      status: "active",
      progress: 0
    });

    // Send confirmation email
    await supabase.functions.invoke('send-payment-confirmation', {
      body: {
        userId: transaction.user_id,
        courseId: transaction.course_id,
        amount: transaction.amount,
        paymentId: razorpay_payment_id
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment verified and enrollment completed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error in verify-payment function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
