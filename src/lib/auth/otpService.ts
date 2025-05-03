
import { Student } from '../types';
import { 
  getAllStudents, 
  getStudentByEmail, 
  updateStudentInStorage,
  generateOTP,
  storeEmailOTP,
  verifyEmailOTP,
  setCurrentStudent
} from './utils';
import { trackStudentLogin } from './activityService';

// Interface for OTP request response
export interface OTPRequestResponse {
  success: boolean;
  message: string;
}

// Request OTP for email login
export const requestEmailOTP = (email: string): OTPRequestResponse => {
  try {
    // Check if student exists with this email
    const student = getStudentByEmail(email);
    
    if (!student) {
      // For security reasons, we don't want to reveal if an email exists
      // So we return success even though we won't send an OTP
      console.log(`No student found with email ${email}, not sending OTP`);
      return {
        success: true,
        message: "If your email is registered, you'll receive a login code shortly."
      };
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store the OTP
    storeEmailOTP(email, otp);
    
    // In a real app, we would send an email here
    // For this demo, we'll log it to the console
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    
    return {
      success: true,
      message: "If your email is registered, you'll receive a login code shortly."
    };
    
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return {
      success: false,
      message: "An error occurred while processing your request."
    };
  }
};

// Verify OTP and login student
export const verifyOTPAndLogin = (
  email: string, 
  otp: string
): { success: boolean; data?: Student; error?: string } => {
  try {
    // Check if OTP is valid
    const isValid = verifyEmailOTP(email, otp);
    
    if (!isValid) {
      return {
        success: false,
        error: "Invalid or expired code. Please try again."
      };
    }
    
    // Find student by email
    const student = getStudentByEmail(email);
    
    if (!student) {
      return {
        success: false,
        error: "No account found with this email"
      };
    }
    
    // Update last login timestamp
    const updatedStudent = {
      ...student,
      lastLoginAt: new Date().toISOString()
    };
    
    // Update the student in localStorage
    updateStudentInStorage(updatedStudent);
    
    // Track login
    trackStudentLogin(updatedStudent.id);
    
    // Set current student
    setCurrentStudent(updatedStudent);
    
    return {
      success: true,
      data: updatedStudent
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      error: "An error occurred during login"
    };
  }
};
