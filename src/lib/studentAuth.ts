// Student authentication utility
import { createEnrollment, getEnrollmentsByStudentId } from './courseManagement';

// Session storage key for student auth
const STUDENT_AUTH_KEY = "career_aspire_student_auth";

// Get all students from storage
const getAllStudentsFromStorage = (): any[] => {
  const storedStudents = localStorage.getItem("career_aspire_students");
  return storedStudents ? JSON.parse(storedStudents) : [];
};

// Save students to storage
const saveStudentsToStorage = (students: any[]): void => {
  localStorage.setItem("career_aspire_students", JSON.stringify(students));
};

export const loginStudent = (email: string, password: string, isPhoneLogin = false): { success: boolean; studentData?: any; error?: string } => {
  const students = getAllStudentsFromStorage();
  
  let student;
  
  if (isPhoneLogin) {
    // Login with phone number
    student = students.find(s => s.phone === email);
    if (!student) {
      return { success: false, error: "Phone number not registered" };
    }
  } else {
    // Login with email and password
    student = students.find(
      (s) => s.email.toLowerCase() === email.toLowerCase() && s.password === password
    );
    
    if (!student) {
      return { success: false, error: "Invalid email or password" };
    }
  }
  
  // Don't store password in localStorage for security
  const { password: pwd, ...safeStudentData } = student;
  
  // Store student session in localStorage
  localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify({
    ...safeStudentData,
    isStudent: true,
    loginTime: new Date().toISOString()
  }));
  
  return { success: true, studentData: safeStudentData };
};

export const registerStudent = (studentData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}): { success: boolean; error?: string } => {
  const students = getAllStudentsFromStorage();
  
  // Check if email already exists (case-insensitive)
  if (students.some(s => s.email.toLowerCase() === studentData.email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }
  
  // Check if phone already exists (if provided)
  if (studentData.phone && students.some(s => s.phone === studentData.phone)) {
    return { success: false, error: "Phone number already registered" };
  }
  
  const newStudent = {
    id: `s${Date.now()}`,
    enrolledCourses: [],
    profilePicture: "",
    skills: [],
    isPhoneVerified: true, // Set as verified by default now
    education: {
      tenth: {
        school: '',
        percentage: '',
        yearOfCompletion: ''
      },
      twelfth: {
        school: '',
        percentage: '',
        yearOfCompletion: ''
      },
      degree: {
        university: '',
        course: '',
        percentage: '',
        yearOfCompletion: ''
      }
    },
    aadharNumber: '',
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

// Function to request password reset OTP
export const requestPasswordResetOTP = (email: string): { success: boolean; error?: string } => {
  const students = getAllStudentsFromStorage();
  const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
  
  if (!student) {
    return { success: false, error: "Email not found" };
  }
  
  // In a real app, this would send an email with OTP or reset link
  console.log(`Password reset requested for: ${email}`);
  
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
  skills?: string[];
  education?: {
    tenth: {
      school: string;
      percentage: string;
      yearOfCompletion: string;
    };
    twelfth: {
      school: string;
      percentage: string;
      yearOfCompletion: string;
    };
    degree: {
      university: string;
      course: string;
      percentage: string;
      yearOfCompletion: string;
    };
  };
  aadharNumber?: string;
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

export const resetStudentPassword = (email: string, newPassword: string): { success: boolean; error?: string } => {
  if (!email || !newPassword) {
    return { success: false, error: "Email and new password are required" };
  }
  
  const students = getAllStudentsFromStorage();
  const studentIndex = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  
  if (studentIndex === -1) {
    return { success: false, error: "Email not found" };
  }
  
  // Update password
  students[studentIndex].password = newPassword;
  saveStudentsToStorage(students);
  
  // Log the action (in a real app, you would send a confirmation email)
  console.log(`Password reset successful for email: ${email}`);
  
  return { success: true };
};
