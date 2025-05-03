
import { Student } from '../types';
import { 
  getAllStudents, 
  getStudentByEmail, 
  getStudentByPhone, 
  updateStudentInStorage,
  getCurrentStudent,
  setCurrentStudent,
  clearCurrentStudent
} from './utils';
import { trackStudentLogin } from './activityService';

// Function to check if a student is logged in
export const isStudentLoggedIn = (): boolean => {
  return !!getCurrentStudent();
};

// Function to simulate student login
export const loginStudent = (
  identifier: string, 
  password: string, 
  isPhoneLogin: boolean = false
): { success: boolean; data?: Student; error?: string } => {
  try {
    const students = getAllStudents();
    
    let student: Student | undefined;
    
    if (isPhoneLogin) {
      // Login with phone
      student = students.find(s => s.phone === identifier);
    } else {
      // Login with email
      student = students.find(s => s.email === identifier);
    }
    
    if (!student) {
      return {
        success: false,
        error: isPhoneLogin ? "No account found with this phone number" : "No account found with this email"
      };
    }
    
    // In a real implementation, you'd check the hashed password
    // For this demo, we'll assume the password is correct
    
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
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login"
    };
  }
};

// Function to simulate student logout
export const logoutStudent = (): void => {
  clearCurrentStudent();
};

// Export the logout function for backward compatibility
export const logout = logoutStudent;
