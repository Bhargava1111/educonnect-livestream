
import { Student } from '../types';

// Constants
export const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activities';
export const STUDENT_LOGIN_KEY = 'student_login_history';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

// Get a student by ID - added for proper export
export const getStudentById = (id: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.id === id);
};
