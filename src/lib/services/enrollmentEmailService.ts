
import { supabase } from '@/integrations/supabase/client';
import { getEmailTemplate, getSystemSettings, processEmailTemplate } from './emailService';

export const sendEnrollmentConfirmationEmail = async (studentData: {
  name: string;
  email: string;
  courseName: string;
}) => {
  try {
    // Get enrollment confirmation template
    const template = await getEmailTemplate('enrollment_confirmation');
    if (!template) {
      console.error('Enrollment confirmation template not found');
      return { success: false, error: 'Email template not found' };
    }

    // Get email settings
    const emailSettings = await getSystemSettings('email');
    
    // Process template with variables
    const variables = {
      student_name: studentData.name,
      course_name: studentData.courseName,
      institute_name: emailSettings?.from_name || 'Career Aspire Academy'
    };

    const processedTemplate = processEmailTemplate(template, variables);

    // Send email using edge function
    const emailPayload = {
      to: studentData.email,
      subject: processedTemplate.subject,
      html: processedTemplate.html,
      text: processedTemplate.text,
      from: `${emailSettings?.from_name || 'Career Aspire Academy'} <${emailSettings?.from_email || 'notifications@careeraspire.com'}>`,
      reply_to: emailSettings?.reply_to
    };

    const response = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });

    if (response.error) {
      console.error('Error sending enrollment email:', response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending enrollment confirmation email:', error);
    return { success: false, error: error.message };
  }
};

export const sendPaymentReceiptEmail = async (paymentData: {
  studentName: string;
  studentEmail: string;
  courseName: string;
  amount: string;
  transactionId: string;
}) => {
  try {
    // Get payment receipt template
    const template = await getEmailTemplate('payment_receipt');
    if (!template) {
      console.error('Payment receipt template not found');
      return { success: false, error: 'Email template not found' };
    }

    // Get email settings
    const emailSettings = await getSystemSettings('email');
    
    // Process template with variables
    const variables = {
      student_name: paymentData.studentName,
      course_name: paymentData.courseName,
      amount: paymentData.amount,
      transaction_id: paymentData.transactionId,
      institute_name: emailSettings?.from_name || 'Career Aspire Academy'
    };

    const processedTemplate = processEmailTemplate(template, variables);

    // Send email using edge function
    const emailPayload = {
      to: paymentData.studentEmail,
      subject: processedTemplate.subject,
      html: processedTemplate.html,
      text: processedTemplate.text,
      from: `${emailSettings?.from_name || 'Career Aspire Academy'} <${emailSettings?.from_email || 'notifications@careeraspire.com'}>`,
      reply_to: emailSettings?.reply_to
    };

    const response = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });

    if (response.error) {
      console.error('Error sending payment receipt email:', response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending payment receipt email:', error);
    return { success: false, error: error.message };
  }
};
