
import { Student, COURSES_KEY, STUDENT_ACTIVITY_KEY } from './types';

// Function to generate a unique ID
const generateId = (): string => {
  return `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Initialize students in localStorage if not present
const initializeStudents = (): void => {
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

// Call initializeStudents when the module loads
initializeStudents();

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

// Function to add a new student to localStorage
export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const students = getAllStudents();
  const newStudent: Student = {
    id: generateId(),
    ...student,
    createdAt: new Date().toISOString()
  };
  students.push(newStudent);
  localStorage.setItem('career_aspire_students', JSON.stringify(students));
  return newStudent;
};

// Function to update a student in localStorage
const updateStudentInStorage = (updatedStudent: Student): void => {
  const students = getAllStudents();
  const updatedStudents = students.map(student =>
    student.id === updatedStudent.id ? updatedStudent : student
  );
  localStorage.setItem('career_aspire_students', JSON.stringify(updatedStudents));
};

// Function to update a student
export const updateStudent = (id: string, updatedStudent: Partial<Student>): Student | undefined => {
  const students = getAllStudents();
  const index = students.findIndex(student => student.id === id);
  
  if (index !== -1) {
    students[index] = { ...students[index], ...updatedStudent };
    localStorage.setItem('career_aspire_students', JSON.stringify(students));
    return students[index];
  }
  
  return undefined;
};

// Function to delete a student from localStorage
export const deleteStudent = (id: string): boolean => {
  const students = getAllStudents();
  const filteredStudents = students.filter(student => student.id !== id);
  
  if (filteredStudents.length < students.length) {
    localStorage.setItem('career_aspire_students', JSON.stringify(filteredStudents));
    return true;
  }
  
  return false;
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

// Function to simulate student registration
export const registerStudent = (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  country: string
): { success: boolean; data?: Student; error?: string } => {
  try {
    // Check if the phone number is already registered
    if (getStudentByPhone(phone)) {
      return {
        success: false,
        error: "Phone number already registered"
      };
    }
    
    // Create a new student object
    const newStudent: Student = {
      id: generateId(),
      firstName,
      lastName,
      phone,
      email,
      country,
      createdAt: new Date().toISOString()
    };
    
    // Add the new student to localStorage
    const students = getAllStudents();
    students.push(newStudent);
    localStorage.setItem('career_aspire_students', JSON.stringify(students));
    
    // Set as current student
    setCurrentStudent(newStudent);
    
    return {
      success: true,
      data: newStudent
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred during registration"
    };
  }
};

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

// Function to enroll a student in a course
export const enrollInCourse = (studentId: string, courseId: string): boolean => {
  try {
    const student = getStudentById(studentId);
    
    if (!student) {
      console.error("Student not found");
      return false;
    }
    
    // Get existing enrolled courses or initialize an empty array
    const enrolledCourses = student.enrolledCourses || [];
    
    // Check if the student is already enrolled in the course
    if (enrolledCourses.includes(courseId)) {
      console.warn("Student already enrolled in this course");
      return false;
    }
    
    // Add the course ID to the enrolled courses array
    enrolledCourses.push(courseId);
    
    // Update the student object with the new enrolled courses
    const updatedStudent: Student = {
      ...student,
      enrolledCourses: enrolledCourses
    };
    
    // Update the student in localStorage
    updateStudentInStorage(updatedStudent);
    
    // Set the updated student as the current student if they are logged in
    const currentStudent = getCurrentStudent();
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(updatedStudent);
    }
    
    return true;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return false;
  }
};

// Function to get enrolled courses for a student
export const getEnrolledCourses = (studentId: string): string[] => {
  const student = getStudentById(studentId);
  return student?.enrolledCourses || [];
};

// Function to get student enrollments
export const getStudentEnrollments = (studentId: string): string[] => {
  return getEnrolledCourses(studentId);
};

// Function to get students by enrolled course
export const getStudentsByEnrolledCourse = (courseId: string): Student[] => {
  const students = getAllStudents();
  return students.filter(student => 
    student.enrolledCourses?.includes(courseId)
  );
};

// Function to get student data - returns the current student or a specific student by ID
export const getStudentData = (studentId?: string): Student | null => {
  if (studentId) {
    const student = getStudentById(studentId);
    return student || null;
  }
  return getCurrentStudent();
};

// Function for enrolling a student in a course (alias for backward compatibility)
export const enrollStudentInCourse = (courseId: string, studentId?: string): boolean => {
  const currentStudent = getCurrentStudent();
  const id = studentId || (currentStudent ? currentStudent.id : '');
  
  if (!id) {
    console.error("No student ID provided and no student is logged in");
    return false;
  }
  
  return enrollInCourse(id, courseId);
};

// Function to simulate fetching student profile
export const getStudentProfile = (studentId: string): Student | undefined => {
  // Retrieve student data from localStorage
  const students = getAllStudents();
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    console.warn(`Student with ID ${studentId} not found`);
    return undefined;
  }
  
  return {
    ...student,
    name: `${student.firstName} ${student.lastName}`
  };
};

// Function to update student profile
export const updateStudentProfile = (studentId: string, profileData: Partial<Student>): { success: boolean; error?: string } => {
  try {
    const student = getStudentById(studentId);
    
    if (!student) {
      return { success: false, error: "Student not found" };
    }
    
    // Merge existing student data with updated profile data
    const updatedStudent: Student = {
      ...student,
      ...profileData
    };
    
    // Update student in localStorage
    updateStudentInStorage(updatedStudent);
    
    // If the updated student is the current student, update the current student
    const currentStudent = getCurrentStudent();
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(updatedStudent);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating student profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
};

// Password reset functionality - OTP based
interface PasswordResetRequest {
  email: string;
  otp: string;
  timestamp: number;
  used: boolean;
}

// Store for OTP requests
const PASSWORD_RESET_REQUESTS_KEY = 'career_aspire_password_reset_requests';

const getPasswordResetRequests = (): Record<string, PasswordResetRequest> => {
  const requests = localStorage.getItem(PASSWORD_RESET_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : {};
};

const savePasswordResetRequests = (requests: Record<string, PasswordResetRequest>): void => {
  localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
};

// Function to generate an OTP (6 digit number as string)
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to request a password reset OTP
export const requestPasswordResetOTP = (email: string): { success: boolean; error?: string } => {
  try {
    // Check if the email exists
    const student = getStudentByEmail(email);
    if (!student) {
      // For security reasons, we'll still return success even if the email is not found
      // This prevents user enumeration attacks
      return { success: true };
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with email and timestamp (expires in 15 minutes)
    const requests = getPasswordResetRequests();
    requests[email] = {
      email,
      otp,
      timestamp: Date.now(),
      used: false
    };
    
    savePasswordResetRequests(requests);
    
    // In a real application, we'd send an email with the OTP
    // For this demo, we'll just log it to the console
    console.log(`[DEV MODE] Password reset OTP for ${email}: ${otp}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Failed to process password reset request" };
  }
};

// Function to verify a password reset OTP
export const verifyPasswordResetOTP = (email: string, otp: string): { success: boolean; error?: string } => {
  try {
    const requests = getPasswordResetRequests();
    const request = requests[email];
    
    // Check if there's a request for this email
    if (!request) {
      return { success: false, error: "No password reset request found" };
    }
    
    // Check if the OTP has been used
    if (request.used) {
      return { success: false, error: "This reset code has already been used" };
    }
    
    // Check if the OTP has expired (15 minutes)
    const expirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (Date.now() - request.timestamp > expirationTime) {
      return { success: false, error: "Reset code has expired" };
    }
    
    // Check if the OTP matches
    if (request.otp !== otp) {
      return { success: false, error: "Invalid reset code" };
    }
    
    // Mark OTP as used
    request.used = true;
    requests[email] = request;
    savePasswordResetRequests(requests);
    
    return { success: true };
  } catch (error) {
    console.error("Error verifying password reset OTP:", error);
    return { success: false, error: "Failed to verify reset code" };
  }
};

// Function to reset password after OTP verification
export const resetPassword = (email: string, newPassword: string): { success: boolean; error?: string } => {
  try {
    const student = getStudentByEmail(email);
    
    if (!student) {
      return { success: false, error: "Student not found" };
    }
    
    // In a real implementation, you'd hash the password here
    // For this demo, we'll just update a password field
    const updatedStudent = {
      ...student,
      // In a real implementation, this would be a hashed password
      password: newPassword,
      passwordUpdatedAt: new Date().toISOString()
    };
    
    // Update the student in localStorage
    updateStudentInStorage(updatedStudent);
    
    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
};

// Student activity tracking
interface StudentActivity {
  id: string;
  studentId: string;
  action: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface StudentLoginRecord {
  timestamp: string;
  device: string;
}

// Function to track student activity
export const trackStudentActivity = (
  studentId: string,
  action: string,
  details?: Record<string, any>
): void => {
  try {
    const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
    const activityArray: StudentActivity[] = activities ? JSON.parse(activities) : [];
    
    const newActivity: StudentActivity = {
      id: `activity_${Date.now()}`,
      studentId,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    
    activityArray.push(newActivity);
    localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify(activityArray));
  } catch (error) {
    console.error("Error tracking student activity:", error);
  }
};

// Function to get student activities
export const getStudentActivity = (studentId: string): StudentActivity[] => {
  try {
    const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
    const activityArray: StudentActivity[] = activities ? JSON.parse(activities) : [];
    
    return activityArray.filter(activity => activity.studentId === studentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Error getting student activities:", error);
    return [];
  }
};

// Function to track student login
export const trackStudentLogin = (studentId: string, device: string = "Unknown device"): void => {
  try {
    const key = `student_login_history_${studentId}`;
    const loginHistory = localStorage.getItem(key);
    const historyArray: StudentLoginRecord[] = loginHistory ? JSON.parse(loginHistory) : [];
    
    const newLogin: StudentLoginRecord = {
      timestamp: new Date().toISOString(),
      device
    };
    
    historyArray.push(newLogin);
    localStorage.setItem(key, JSON.stringify(historyArray));
    
    // Also track as an activity
    trackStudentActivity(studentId, "Logged in", { device });
  } catch (error) {
    console.error("Error tracking student login:", error);
  }
};

// Function to get student login history
export const getStudentLoginHistory = (studentId: string): StudentLoginRecord[] => {
  try {
    const key = `student_login_history_${studentId}`;
    const loginHistory = localStorage.getItem(key);
    const historyArray: StudentLoginRecord[] = loginHistory ? JSON.parse(loginHistory) : [];
    
    return historyArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Error getting student login history:", error);
    return [];
  }
};

// Function to get student total active time
export const getStudentTotalActiveTime = (studentId: string): number => {
  try {
    const key = `student_active_time_${studentId}`;
    const activeTime = localStorage.getItem(key);
    return activeTime ? parseInt(activeTime, 10) : 0;
  } catch (error) {
    console.error("Error getting student active time:", error);
    return 0;
  }
};

// Function to increment student active time
export const incrementStudentActiveTime = (studentId: string, seconds: number = 60): void => {
  try {
    const key = `student_active_time_${studentId}`;
    const currentActiveTime = getStudentTotalActiveTime(studentId);
    const newActiveTime = currentActiveTime + seconds;
    localStorage.setItem(key, newActiveTime.toString());
    
    // Update last active timestamp
    localStorage.setItem(`student_last_active_${studentId}`, new Date().toISOString());
  } catch (error) {
    console.error("Error incrementing student active time:", error);
  }
};

// Function to get student last active time
export const getStudentLastActiveTime = (studentId: string): string | null => {
  try {
    const key = `student_last_active_${studentId}`;
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error getting student last active time:", error);
    return null;
  }
};

// Function to format active time in hours and minutes
export const formatActiveTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
};

// Export the logout function for backward compatibility
export const logout = logoutStudent;

// Initialize student activity tracking
const initializeStudentActivity = () => {
  if (!localStorage.getItem(STUDENT_ACTIVITY_KEY)) {
    localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify([]));
  }
};

initializeStudentActivity();
