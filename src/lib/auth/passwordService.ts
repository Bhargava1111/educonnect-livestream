
import { supabase } from '@/integrations/supabase/client';

// Request password reset OTP
export const requestPasswordResetOTP = async (email: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Verify password reset OTP - not directly applicable with Supabase's flow
// We'll keep this function for backward compatibility but adapt it to Supabase's approach
export const verifyPasswordResetOTP = async (email: string, otp: string): Promise<{ success: boolean, error?: string }> => {
  // Supabase handles OTP verification through the URL params
  // This function is kept for API compatibility but will always return an error
  return { 
    success: false, 
    error: "This function is not supported with Supabase authentication. Please use the reset link sent to your email."
  };
};

// Reset password - updated to take a single argument
export const resetPassword = async (password: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};
