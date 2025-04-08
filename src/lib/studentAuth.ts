
// Student authentication utility
import { createEnrollment, getEnrollmentsByStudentId } from './courseManagement';

// Session storage key for student auth
const STUDENT_AUTH_KEY = "career_aspire_student_auth";

// Mock student users for demo purposes
// In a real app, this would come from a database
const MOCK_STUDENTS = [
  {
    id: "s1",
    email: "student@example.com",
    password: "password123",
    name: "John Doe",
    enrolledCourses: [],
    phone: "9876543210",
    address: "123, Student Housing, Bangalore",
    profilePicture: "",
    registrationDate: "2023-01-15T10:30:00Z"
  },
  {
    id: "s2",
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
    enrolledCourses: ["course_1"],
    phone: "8765432109",
    address: "456, College Road, Mumbai",
    profilePicture: "",
    registrationDate: "2023-02-20T14:45:00Z"
  },
  {
    id: "s3",
    email: "mike@example.com",
    password: "password123",
    name: "Mike Johnson",
    enrolledCourses: ["course_2", "course_3"],
    phone: "7654321098",
    address: "789, Tech Park, Delhi",
    profilePicture: "",
    registrationDate: "2023-03-10T09:15:00Z"
  }
];

// Store students in localStorage if not already present
const initializeStudentsIfNeeded = (): void => {
  const storedStudents = localStorage.getItem("career_aspire_students");
  
  if (!storedStudents) {
    localStorage.setItem("career_aspire_students", JSON.stringify(MOCK_STUDENTS));
  }
};

// Call initialization on module load
initializeStudentsIfNeeded();

// Get all students from storage
const getAllStudentsFromStorage = (): any[] => {
  const storedStudents = localStorage.getItem("career_aspire_students");
  return storedStudents ? JSON.parse(storedStudents) : MOCK_STUDENTS;
};

// Save students to storage
const saveStudentsToStorage = (students: any[]): void => {
  localStorage.setItem("career_aspire_students", JSON.stringify(students));
};

export const loginStudent = (email: string, password: string): { success: boolean; studentData?: any } => {
  const students = getAllStudentsFromStorage();
  
  // Make comparison case-insensitive for email
  const student = students.find(
    (s) => s.email.toLowerCase() === email.toLowerCase() && s.password === password
  );
  
  if (student) {
    // Don't store password in localStorage for security
    const { password, ...safeStudentData } = student;
    
    // Store student session in localStorage
    localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify({
      ...safeStudentData,
      isStudent: true,
      loginTime: new Date().toISOString()
    }));
    
    return { success: true, studentData: safeStudentData };
  }
  
  return { success: false };
};

export const registerStudent = (studentData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}): { success: boolean; error?: string } => {
  const students = getAllStudentsFromStorage();
  
  // Check if email already exists
  if (students.some(s => s.email.toLowerCase() === studentData.email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }
  
  const newStudent = {
    id: `s${Date.now()}`,
    enrolledCourses: [],
    profilePicture: "",
    registrationDate: new Date().toISOString(),
    ...studentData
  };
  
  students.push(newStudent);
  saveStudentsToStorage(students);
  
  // Auto login after registration
  const { password, ...safeStudentData } = newStudent;
  localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify({
    ...safeStudentData,
    isStudent: true,
    loginTime: new Date().toISOString()
  }));
  
  return { success: true };
};

export const logoutStudent = (): void => {
  localStorage.removeItem(STUDENT_AUTH_KEY);
};

export const isStudentLoggedIn = (): boolean => {
  const studentData = localStorage.getItem(STUDENT_AUTH_KEY);
  if (!studentData) return false;
  
  try {
    const student = JSON.parse(studentData);
    return !!student.isStudent;
  } catch (error) {
    return false;
  }
};

export const getStudentData = () => {
  const studentData = localStorage.getItem(STUDENT_AUTH_KEY);
  if (!studentData) return null;
  
  try {
    return JSON.parse(studentData);
  } catch (error) {
    return null;
  }
};

export const updateStudentProfile = (profileData: {
  name?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
}): boolean => {
  const studentData = getStudentData();
  if (!studentData) return false;
  
  const students = getAllStudentsFromStorage();
  const studentIndex = students.findIndex(s => s.id === studentData.id);
  
  if (studentIndex === -1) return false;
  
  // Update student in storage
  students[studentIndex] = {
    ...students[studentIndex],
    ...profileData
  };
  
  saveStudentsToStorage(students);
  
  // Update session data
  localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify({
    ...studentData,
    ...profileData
  }));
  
  return true;
};

export const enrollStudentInCourse = (courseId: string | number): boolean => {
  const studentData = getStudentData();
  
  if (!studentData) return false;
  
  // Add course to enrolled courses if not already enrolled
  // Convert courseId to string to ensure type consistency
  const courseIdString = String(courseId);
  
  if (!studentData.enrolledCourses.includes(courseIdString)) {
    studentData.enrolledCourses.push(courseIdString);
    
    // Update localStorage
    localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify(studentData));
    
    // Create enrollment record
    createEnrollment(studentData.id, courseIdString);
    
    return true;
  }
  
  return false;
};

export const getStudentEnrollments = () => {
  const studentData = getStudentData();
  if (!studentData) return [];
  
  return getEnrollmentsByStudentId(studentData.id);
};

// Admin functions for student management
export const getAllStudents = () => {
  const students = getAllStudentsFromStorage();
  
  return students.map(student => {
    // Don't expose passwords
    const { password, ...safeStudentData } = student;
    return safeStudentData;
  });
};

export const getStudentById = (id: string) => {
  const students = getAllStudentsFromStorage();
  const student = students.find(s => s.id === id);
  
  if (!student) return null;
  
  // Don't expose password
  const { password, ...safeStudentData } = student;
  return safeStudentData;
};

export const createStudent = (studentData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}): { success: boolean; student?: any; error?: string } => {
  return registerStudent(studentData);
};

export const updateStudent = (id: string, data: Partial<any>): boolean => {
  const students = getAllStudentsFromStorage();
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) return false;
  
  // Don't allow changing email or password through this method
  const { email, password, ...safeData } = data;
  
  students[studentIndex] = {
    ...students[studentIndex],
    ...safeData
  };
  
  saveStudentsToStorage(students);
  return true;
};

export const deleteStudent = (id: string): boolean => {
  const students = getAllStudentsFromStorage();
  const filteredStudents = students.filter(s => s.id !== id);
  
  if (filteredStudents.length < students.length) {
    saveStudentsToStorage(filteredStudents);
    return true;
  }
  
  return false;
};

export const getStudentsByEnrolledCourse = (courseId: string | number) => {
  // Convert courseId to string for consistent comparison
  const courseIdString = String(courseId);
  
  const students = getAllStudentsFromStorage();
  
  const studentsInCourse = students.filter(student => 
    student.enrolledCourses.includes(courseIdString)
  );
  
  return studentsInCourse.map(student => {
    // Don't expose passwords
    const { password, ...safeStudentData } = student;
    return safeStudentData;
  });
};

export const resetStudentPassword = (email: string, newPassword: string): boolean => {
  const students = getAllStudentsFromStorage();
  const studentIndex = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  
  if (studentIndex === -1) return false;
  
  students[studentIndex].password = newPassword;
  saveStudentsToStorage(students);
  return true;
};
