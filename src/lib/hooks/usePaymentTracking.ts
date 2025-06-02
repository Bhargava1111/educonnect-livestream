
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStudentPaymentTransactions, 
  createPaymentTransaction, 
  updatePaymentTransaction,
  type PaymentTransaction 
} from '@/lib/services/paymentService';

export const usePaymentTracking = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      const userTransactions = await getStudentPaymentTransactions(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error fetching payment transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (transactionData: Omit<PaymentTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    const result = await createPaymentTransaction(transactionData);
    if (result.success) {
      await fetchTransactions(); // Refresh the list
    }
    return result;
  };

  const updateTransaction = async (paymentId: string, updates: Partial<PaymentTransaction>) => {
    const result = await updatePaymentTransaction(paymentId, updates);
    if (result.success) {
      await fetchTransactions(); // Refresh the list
    }
    return result;
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    isLoading,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction
  };
};
