
import { Student } from '../types';

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

// Update a student in localStorage
export const updateStudentInStorage = (updatedStudent: Student): void => {
  const students = getAllStudents();
  const index = students.findIndex(s => s.id === updatedStudent.id);
  
  if (index !== -1) {
    students[index] = updatedStudent;
    localStorage.setItem('career_aspire_students', JSON.stringify(students));
  }
};
