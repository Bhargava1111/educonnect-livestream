
import { supabase } from '@/integrations/supabase/client';

export interface PaymentAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averageOrderValue: number;
  revenueByMonth: Array<{ month: string; revenue: number; transactions: number }>;
  topCourses: Array<{ courseId: string; courseName: string; revenue: number; enrollments: number }>;
}

export interface PaymentTransaction {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  payment_id: string;
  order_id?: string;
  payment_method?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_details?: any;
  created_at: string;
  updated_at: string;
  student_name?: string;
  course_name?: string;
}

export const getPaymentAnalytics = async (): Promise<PaymentAnalytics> => {
  try {
    // Get all payment transactions
    const { data: transactions, error } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        profiles!payment_transactions_student_id_fkey(first_name, last_name),
        courses!payment_transactions_course_id_fkey(title)
      `);

    if (error) throw error;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate basic metrics
    const totalTransactions = transactions?.length || 0;
    const successfulPayments = transactions?.filter(t => t.status === 'completed').length || 0;
    const failedPayments = transactions?.filter(t => t.status === 'failed').length || 0;
    const pendingPayments = transactions?.filter(t => t.status === 'pending').length || 0;

    const completedTransactions = transactions?.filter(t => t.status === 'completed') || [];
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const monthlyTransactions = completedTransactions.filter(t => {
      const transactionDate = new Date(t.created_at);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const averageOrderValue = completedTransactions.length > 0 ? totalRevenue / completedTransactions.length : 0;

    // Revenue by month (last 12 months)
    const revenueByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = completedTransactions.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear();
      });
      
      revenueByMonth.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0),
        transactions: monthTransactions.length
      });
    }

    // Top courses by revenue
    const courseRevenue = new Map();
    completedTransactions.forEach(t => {
      const courseId = t.course_id;
      const courseName = t.courses?.title || 'Unknown Course';
      const current = courseRevenue.get(courseId) || { courseName, revenue: 0, enrollments: 0 };
      current.revenue += Number(t.amount);
      current.enrollments += 1;
      courseRevenue.set(courseId, current);
    });

    const topCourses = Array.from(courseRevenue.entries())
      .map(([courseId, data]) => ({ courseId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalRevenue,
      monthlyRevenue,
      totalTransactions,
      successfulPayments,
      failedPayments,
      pendingPayments,
      averageOrderValue,
      revenueByMonth,
      topCourses
    };
  } catch (error) {
    console.error('Error fetching payment analytics:', error);
    throw error;
  }
};

export const getPaymentTransactions = async (limit = 50, offset = 0): Promise<PaymentTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        profiles!payment_transactions_student_id_fkey(first_name, last_name),
        courses!payment_transactions_course_id_fkey(title)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(transaction => ({
      ...transaction,
      student_name: transaction.profiles ? 
        `${transaction.profiles.first_name || ''} ${transaction.profiles.last_name || ''}`.trim() : 
        'Unknown Student',
      course_name: transaction.courses?.title || 'Unknown Course'
    }));
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    throw error;
  }
};

export const refundPayment = async (transactionId: string, reason?: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        status: 'refunded',
        payment_details: { refund_reason: reason, refunded_at: new Date().toISOString() },
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    // Here you would typically call your payment gateway's refund API
    // For now, we'll just update the database status

    return { success: true, data };
  } catch (error) {
    console.error('Error processing refund:', error);
    return { success: false, error };
  }
};

export const exportPaymentData = (transactions: PaymentTransaction[]): string => {
  const headers = [
    'Transaction ID',
    'Student Name',
    'Course',
    'Amount',
    'Currency',
    'Payment Method',
    'Status',
    'Date',
    'Payment ID'
  ].join(',');

  const rows = transactions.map(t => [
    t.id,
    t.student_name || '',
    t.course_name || '',
    t.amount,
    t.currency,
    t.payment_method || '',
    t.status,
    new Date(t.created_at).toLocaleDateString(),
    t.payment_id
  ].join(','));

  return [headers, ...rows].join('\n');
};
