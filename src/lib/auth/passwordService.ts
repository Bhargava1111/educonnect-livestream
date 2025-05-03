
import { getStudentByEmail, updateStudentInStorage } from './utils';

// Password reset interface
export interface PasswordResetRequest {
  email: string;
  otp: string;
  timestamp: number;
  used: boolean;
}

// Storage key
const PASSWORD_RESET_REQUESTS_KEY = 'career_aspire_password_reset_requests';

// Helper functions for password reset requests
const getPasswordResetRequests = (): Record<string, PasswordResetRequest> => {
  const requests = localStorage.getItem(PASSWORD_RESET_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : {};
};

const savePasswordResetRequests = (requests: Record<string, PasswordResetRequest>): void => {
  localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
};

// Function to generate an OTP (6 digit number as string)
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to request a password reset OTP
export const requestPasswordResetOTP = (email: string): { success: boolean; error?: string } => {
  try {
    // Check if the email exists
    const student = getStudentByEmail(email);
    if (!student) {
      // For security reasons, we'll still return success even if the email is not found
      // This prevents user enumeration attacks
      return { success: true };
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with email and timestamp (expires in 15 minutes)
    const requests = getPasswordResetRequests();
    requests[email] = {
      email,
      otp,
      timestamp: Date.now(),
      used: false
    };
    
    savePasswordResetRequests(requests);
    
    // In a real application, we'd send an email with the OTP
    // For this demo, we'll just log it to the console
    console.log(`[DEV MODE] Password reset OTP for ${email}: ${otp}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Failed to process password reset request" };
  }
};

// Function to verify a password reset OTP
export const verifyPasswordResetOTP = (email: string, otp: string): { success: boolean; error?: string } => {
  try {
    const requests = getPasswordResetRequests();
    const request = requests[email];
    
    // Check if there's a request for this email
    if (!request) {
      return { success: false, error: "No password reset request found" };
    }
    
    // Check if the OTP has been used
    if (request.used) {
      return { success: false, error: "This reset code has already been used" };
    }
    
    // Check if the OTP has expired (15 minutes)
    const expirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (Date.now() - request.timestamp > expirationTime) {
      return { success: false, error: "Reset code has expired" };
    }
    
    // Check if the OTP matches
    if (request.otp !== otp) {
      return { success: false, error: "Invalid reset code" };
    }
    
    // Mark OTP as used
    request.used = true;
    requests[email] = request;
    savePasswordResetRequests(requests);
    
    return { success: true };
  } catch (error) {
    console.error("Error verifying password reset OTP:", error);
    return { success: false, error: "Failed to verify reset code" };
  }
};

// Function to reset password after OTP verification
export const resetPassword = (email: string, newPassword: string): { success: boolean; error?: string } => {
  try {
    const student = getStudentByEmail(email);
    
    if (!student) {
      return { success: false, error: "Student not found" };
    }
    
    // In a real implementation, you'd hash the password here
    // For this demo, we'll just update a password field
    const updatedStudent = {
      ...student,
      // In a real implementation, this would be a hashed password
      password: newPassword,
      passwordUpdatedAt: new Date().toISOString()
    };
    
    // Update the student in localStorage
    updateStudentInStorage(updatedStudent);
    
    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
};
