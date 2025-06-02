
import { supabase } from '@/integrations/supabase/client';

export interface PaymentTransaction {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  payment_id: string;
  order_id?: string;
  status: string;
  payment_method?: string;
  payment_details?: any;
  created_at: string;
  updated_at: string;
}

// Create a payment transaction
export const createPaymentTransaction = async (transactionData: Omit<PaymentTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: PaymentTransaction; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(transactionData)
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

// Update payment transaction status
export const updatePaymentTransaction = async (paymentId: string, updates: Partial<PaymentTransaction>): Promise<{ success: boolean; data?: PaymentTransaction; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('payment_id', paymentId)
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

// Get payment transactions for a student
export const getStudentPaymentTransactions = async (studentId: string): Promise<PaymentTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment transactions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    return [];
  }
};

// Get all payment transactions (admin only)
export const getAllPaymentTransactions = async (): Promise<PaymentTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all payment transactions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all payment transactions:', error);
    return [];
  }
};

// Get payment transaction by payment ID
export const getPaymentTransaction = async (paymentId: string): Promise<PaymentTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('payment_id', paymentId)
      .single();

    if (error) {
      console.error('Error fetching payment transaction:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching payment transaction:', error);
    return null;
  }
};
