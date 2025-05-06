
// Simple authentication utility for admin login that now uses Supabase

import { supabase } from '@/integrations/supabase/client';

// Admin credentials
const ADMIN_EMAIL = "Bhargava@123";

// Session storage key for admin auth
const ADMIN_AUTH_KEY = "career_aspire_admin_auth";

// Admin authentication functions
export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  if (email === ADMIN_EMAIL) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        console.error("Admin login error:", error);
        return false;
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
      return false;
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
