
import { Student } from '../types';

// Constants
export const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activities';
export const STUDENT_LOGIN_KEY = 'student_login_history';
export const OTP_STORAGE_KEY = 'career_aspire_email_otps';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get the current student from localStorage
export const getCurrentStudent = (): Student | null => {
  const studentJson = localStorage.getItem('current_student');
  if (!studentJson) return null;
  
  try {
    return JSON.parse(studentJson);
  } catch (error) {
    console.error("Error parsing current student:", error);
    return null;
  }
};

// Set the current student in localStorage
export const setCurrentStudent = (student: Student | null): void => {
  if (student) {
    localStorage.setItem('current_student', JSON.stringify(student));
  } else {
    localStorage.removeItem('current_student');
  }
};

// Clear the current student from localStorage
export const clearCurrentStudent = (): void => {
  localStorage.removeItem('current_student');
};

// Get all students from localStorage
export const getAllStudents = (): Student[] => {
  const students = localStorage.getItem('career_aspire_students');
  if (!students) return [];
  
  try {
    return JSON.parse(students);
  } catch (error) {
    console.error("Error parsing students:", error);
    return [];
  }
};

// Get a student by email
export const getStudentByEmail = (email: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.email === email);
};

// Get a student by phone
export const getStudentByPhone = (phone: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.phone === phone);
};

// Update a student in localStorage
export const updateStudentInStorage = (updatedStudent: Student): void => {
  const students = getAllStudents();
  const index = students.findIndex(s => s.id === updatedStudent.id);
  
  if (index !== -1) {
    students[index] = updatedStudent;
    localStorage.setItem('career_aspire_students', JSON.stringify(students));
  }
};

// Get a student by ID
export const getStudentById = (id: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.id === id);
};

// Store email OTP
export interface EmailOTP {
  email: string;
  otp: string;
  expiresAt: number; // Timestamp in milliseconds
  used: boolean;
}

// Store email OTP
export const storeEmailOTP = (email: string, otp: string): void => {
  // Get existing OTPs
  const otpsJson = localStorage.getItem(OTP_STORAGE_KEY);
  const otps: Record<string, EmailOTP> = otpsJson ? JSON.parse(otpsJson) : {};
  
  // Set expiration time (15 minutes from now)
  const expiresAt = Date.now() + (15 * 60 * 1000);
  
  // Store new OTP
  otps[email] = {
    email,
    otp,
    expiresAt,
    used: false
  };
  
  // Save back to localStorage
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
};

// Verify email OTP
export const verifyEmailOTP = (email: string, otp: string): boolean => {
  // Get stored OTPs
  const otpsJson = localStorage.getItem(OTP_STORAGE_KEY);
  if (!otpsJson) return false;
  
  const otps: Record<string, EmailOTP> = JSON.parse(otpsJson);
  
  // Check if OTP exists for this email
  const storedOTP = otps[email];
  if (!storedOTP) return false;
  
  // Check if OTP is expired
  if (storedOTP.expiresAt < Date.now()) return false;
  
  // Check if OTP has been used
  if (storedOTP.used) return false;
  
  // Check if OTP matches
  if (storedOTP.otp !== otp) return false;
  
  // Mark OTP as used
  storedOTP.used = true;
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
  
  return true;
};
