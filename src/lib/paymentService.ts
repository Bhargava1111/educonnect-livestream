
import { Payment, PAYMENTS_KEY } from './types';
import { createEnrollment } from './enrollmentService';

// Initialize payments
const initializePaymentsIfNeeded = (): Payment[] => {
  const existingPayments = localStorage.getItem(PAYMENTS_KEY);
  
  if (existingPayments) {
    return JSON.parse(existingPayments);
  } else {
    const defaultPayments: Payment[] = [];
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(defaultPayments));
    return defaultPayments;
  }
};

// Payment management
export const getAllPayments = (): Payment[] => {
  return initializePaymentsIfNeeded();
};

export const getPaymentsByStudentId = (studentId: string): Payment[] => {
  const payments = getAllPayments();
  return payments.filter(payment => payment.studentId === studentId);
};

export const getPaymentsByCourseId = (courseId: string): Payment[] => {
  const payments = getAllPayments();
  return payments.filter(payment => payment.courseId === courseId);
};

export const createPayment = (payment: Omit<Payment, 'id'>): Payment => {
  const payments = getAllPayments();
  
  const newPayment: Payment = {
    ...payment,
    id: `payment_${Date.now()}`
  };
  
  payments.push(newPayment);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  return newPayment;
};

export const updatePayment = (
  paymentId: string, 
  status: 'pending' | 'completed' | 'failed',
  paymentDetails?: Partial<Payment>
): Payment | undefined => {
  const payments = getAllPayments();
  const index = payments.findIndex(payment => payment.id === paymentId);
  
  if (index !== -1) {
    payments[index] = { 
      ...payments[index], 
      status,
      ...paymentDetails
    };
    
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    
    if (status === 'completed') {
      createEnrollment(payments[index].studentId, payments[index].courseId);
    }
    
    return payments[index];
  }
  
  return undefined;
};
