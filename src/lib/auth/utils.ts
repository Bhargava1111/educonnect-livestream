
import { Student } from '../types';

// Common storage keys
export const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activities';
export const PASSWORD_RESET_REQUESTS_KEY = 'career_aspire_password_reset_requests';

// Function to generate a unique ID
export const generateId = (): string => {
  return `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Function to get all students from localStorage
export const getAllStudents = (): Student[] => {
  const students = localStorage.getItem('career_aspire_students');
  return students ? JSON.parse(students) : [];
};

// Function to get a student by ID from localStorage
export const getStudentById = (id: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.id === id);
};

// Function to get a student by email from localStorage
export const getStudentByEmail = (email: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.email === email);
};

// Function to get a student by phone from localStorage
export const getStudentByPhone = (phone: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.phone === phone);
};

// Function to update a student in localStorage
export const updateStudentInStorage = (updatedStudent: Student): void => {
  const students = getAllStudents();
  const updatedStudents = students.map(student =>
    student.id === updatedStudent.id ? updatedStudent : student
  );
  localStorage.setItem('career_aspire_students', JSON.stringify(updatedStudents));
};

// Function to get the current student from localStorage
export const getCurrentStudent = (): Student | null => {
  const student = localStorage.getItem('current_student');
  return student ? JSON.parse(student) : null;
};

// Function to set the current student in localStorage
export const setCurrentStudent = (student: Student | null): void => {
  if (student) {
    localStorage.setItem('current_student', JSON.stringify(student));
  } else {
    localStorage.removeItem('current_student');
  }
};

// Function to clear the current student from localStorage (logout)
export const clearCurrentStudent = (): void => {
  localStorage.removeItem('current_student');
};

// Initialize students in localStorage if not present
export const initializeStudents = (): void => {
  if (!localStorage.getItem('career_aspire_students')) {
    const defaultStudents: Student[] = [
      {
        id: 'student_123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        country: 'USA',
        createdAt: new Date().toISOString(),
        name: 'John Doe'
      },
      {
        id: 'student_456',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '987-654-3210',
        email: 'jane.smith@example.com',
        country: 'Canada',
        createdAt: new Date().toISOString(),
        name: 'Jane Smith'
      }
    ];
    localStorage.setItem('career_aspire_students', JSON.stringify(defaultStudents));
  }
};

// Initialize student activity tracking
export const initializeStudentActivity = () => {
  if (!localStorage.getItem(STUDENT_ACTIVITY_KEY)) {
    localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify([]));
  }
};

// Call initializers
initializeStudents();
initializeStudentActivity();
