
// Simple authentication utility for admin login

// Admin credentials
const ADMIN_EMAIL = "Bhargava@123";
const ADMIN_PASSWORD = "careeraspireadmin";

// Session storage key for admin auth
const ADMIN_AUTH_KEY = "career_aspire_admin_auth";

// Admin authentication functions
export const loginAdmin = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Store admin session in localStorage
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ 
      email, 
      isAdmin: true,
      loginTime: new Date().toISOString()
    }));
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
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
