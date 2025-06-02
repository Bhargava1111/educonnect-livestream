
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentGatewayProps {
  courseId: string;
  amount: number;
  courseName: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  courseId,
  amount,
  courseName,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-payment', {
        body: {
          courseId,
          amount,
          currency: 'INR',
          paymentMethod
        }
      });

      if (orderError) throw orderError;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CareerAspire',
        description: `Payment for ${courseName}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verifyError) throw verifyError;

            toast({
              title: "Payment Successful!",
              description: "You have been enrolled in the course successfully.",
            });

            onSuccess?.();
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          course_id: courseId
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong during payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <div className="text-sm text-gray-600">
          Course: {courseName}
        </div>
        <div className="text-lg font-semibold">
          Amount: ₹{amount.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer">
                <CreditCard className="w-4 h-4 mr-2" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center cursor-pointer">
                <Smartphone className="w-4 h-4 mr-2" />
                UPI
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Label htmlFor="netbanking" className="flex items-center cursor-pointer">
                <Building2 className="w-4 h-4 mr-2" />
                Net Banking
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Secure payment powered by Razorpay
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;
