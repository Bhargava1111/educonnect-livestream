
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define the props interface for the component
interface RazorpayPaymentProps {
  amount: number;
  courseName: string;
  description?: string;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  courseName,
  description = "Course Payment",
  onSuccess,
  onFailure
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      await loadRazorpay();
      
      // In a real implementation, you would get this from the backend
      const orderId = "order_" + Math.random().toString(36).substring(2, 15);
      
      const options = {
        key: "rzp_test_YOUR_TEST_KEY", // Replace with your Razorpay Key ID
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Career Aspire Technology",
        description: description,
        order_id: orderId,
        handler: function (response: any) {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          if (onSuccess) onSuccess(response);
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        notes: {
          course_name: courseName
        },
        theme: {
          color: "#3563E9" // Matches the eduBlue color
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast({
        title: "Payment Failed",
        description: "Unable to initialize payment gateway. Please try again later.",
        variant: "destructive",
      });
      if (onFailure) onFailure(error);
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isProcessing}
      className="bg-eduBlue-600 hover:bg-eduBlue-700"
    >
      {isProcessing ? "Processing..." : `Pay ₹${amount}`}
    </Button>
  );
};

export default RazorpayPayment;
