
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentData {
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const createPayment = async (paymentData: PaymentData) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentData
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Payment Creation Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (paymentDetails: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: paymentDetails
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Payment Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createPayment,
    verifyPayment,
    isProcessing
  };
};
