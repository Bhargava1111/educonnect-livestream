
// Simple authentication utility for admin login that now uses Supabase

import { supabase } from '@/integrations/supabase/client';

// Admin credentials
export const ADMIN_EMAIL = "Bhargava@123";
export const ADMIN_PASSWORD = "Bhar@123"; // Added password constant for reference

// Session storage key for admin auth
const ADMIN_AUTH_KEY = "career_aspire_admin_auth";

// Admin authentication functions
export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    try {
      // For admin, we'll first try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If Supabase login fails, we'll still allow admin login with hardcoded credentials
      // This helps during initial setup when the admin might not be in Supabase yet
      if (error || !data.user) {
        console.log("Using fallback admin authentication");
      }

      // Store admin session in localStorage
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ 
        email, 
        isAdmin: true,
        loginTime: new Date().toISOString()
      }));
      
      return true;
    } catch (error) {
      console.error("Admin login error:", error);
      // Still allow local admin auth if credentials match
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ 
        email, 
        isAdmin: true,
        loginTime: new Date().toISOString()
      }));
      return true;
    }
  }
  return false;
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem(ADMIN_AUTH_KEY);
  } catch (error) {
    console.error("Admin logout error:", error);
  }
};

export const isAdminLoggedIn = (): boolean => {
  const adminData = localStorage.getItem(ADMIN_AUTH_KEY);
  if (!adminData) return false;
  
  try {
    const admin = JSON.parse(adminData);
    return !!admin.isAdmin;
  } catch (error) {
    return false;
  }
};

export const getAdminData = () => {
  const adminData = localStorage.getItem(ADMIN_AUTH_KEY);
  if (!adminData) return null;
  
  try {
    return JSON.parse(adminData);
  } catch (error) {
    return null;
  }
};
