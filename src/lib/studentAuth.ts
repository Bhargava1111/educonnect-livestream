// Simple student authentication service
const CURRENT_STUDENT_KEY = 'career_aspire_current_student';
const STUDENTS_KEY = 'career_aspire_students';

// Student interface
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  profilePicture?: string;
  createdAt: string;
  lastLoginAt?: string;
  name?: string; // Added for compatibility
  enrolledCourses?: string[]; // Added to track enrolled courses
}

// Get all students
export const getAllStudents = (): Student[] => {
  const studentsData = localStorage.getItem(STUDENTS_KEY);
  return studentsData ? JSON.parse(studentsData) : [];
};

// Get student by ID
export const getStudentById = (id: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.id === id);
};

// Get student by phone
export const getStudentByPhone = (phone: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.phone === phone);
};

// Register a new student
export const registerStudent = (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  country: string
): { success: boolean, data?: Student, error?: string } => {
  try {
    // Check if student with phone already exists
    if (getStudentByPhone(phone)) {
      return {
        success: false,
        error: "A student with this phone number already exists"
      };
    }
    
    // Create new student
    const newStudent: Student = {
      id: `student_${Date.now()}`,
      firstName,
      lastName,
      phone,
      email,
      country,
      enrolledCourses: [],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      name: `${firstName} ${lastName}` // Add combined name field
    };
    
    // Store student data
    const students = getAllStudents();
    students.push(newStudent);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    
    // Store password separately (in a real app this would be hashed)
    localStorage.setItem(`student_password_${newStudent.id}`, password);
    
    // Auto login after registration
    setCurrentStudent(newStudent);
    
    // Initialize activity tracking
    updateStudentLastActiveTime(newStudent.id);
    
    return {
      success: true,
      data: newStudent
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Login a student
export const loginStudent = (
  phoneOrEmail: string,
  password: string,
  isPhoneLogin: boolean = false
): { success: boolean, data?: Student, error?: string } => {
  try {
    let student;
    
    if (isPhoneLogin) {
      student = getStudentByPhone(phoneOrEmail);
    } else {
      const students = getAllStudents();
      student = students.find(s => s.email === phoneOrEmail);
    }
    
    if (!student) {
      return {
        success: false,
        error: isPhoneLogin ? "No account found with this phone number" : "No account found with this email address"
      };
    }
    
    const storedPassword = localStorage.getItem(`student_password_${student.id}`);
    
    if (password !== storedPassword) {
      return {
        success: false,
        error: "Incorrect password"
      };
    }
    
    // Update last login time
    const updatedStudent = {
      ...student,
      lastLoginAt: new Date().toISOString()
    };
    
    // Update the student in storage
    const students = getAllStudents();
    const studentIndex = students.findIndex(s => s.id === student.id);
    students[studentIndex] = updatedStudent;
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    
    // Log this login
    const loginHistory = getStudentLoginHistory(student.id);
    loginHistory.push({
      timestamp: new Date().toISOString(),
      device: navigator.userAgent
    });
    localStorage.setItem(`student_login_history_${student.id}`, JSON.stringify(loginHistory));
    
    // Update last active time
    updateStudentLastActiveTime(student.id);
    
    // Set as current student
    setCurrentStudent(updatedStudent);
    
    return {
      success: true,
      data: updatedStudent
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Logout current student
export const logoutStudent = (): void => {
  localStorage.removeItem(CURRENT_STUDENT_KEY);
};

// Get current student
export const getCurrentStudent = (): Student | null => {
  const currentStudentData = localStorage.getItem(CURRENT_STUDENT_KEY);
  return currentStudentData ? JSON.parse(currentStudentData) : null;
};

// Get student data - added for compatibility
export const getStudentData = (): Student | null => {
  return getCurrentStudent();
};

// Set current student
export const setCurrentStudent = (student: Student): void => {
  localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
};

// Check if a student is logged in
export const isStudentLoggedIn = (): boolean => {
  return !!getCurrentStudent();
};

// Update student profile
export const updateStudentProfile = (
  studentId: string,
  updates: Partial<Omit<Student, 'id' | 'createdAt'>>
): Student | null => {
  const students = getAllStudents();
  const studentIndex = students.findIndex(s => s.id === studentId);
  
  if (studentIndex === -1) {
    return null;
  }
  
  const updatedStudent = {
    ...students[studentIndex],
    ...updates
  };
  
  students[studentIndex] = updatedStudent;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  
  // Update current student if this is the logged-in user
  const currentStudent = getCurrentStudent();
  if (currentStudent && currentStudent.id === studentId) {
    setCurrentStudent(updatedStudent);
  }
  
  return updatedStudent;
};

// Add missing functions for compatibility

// Enroll student in course
export const enrollStudentInCourse = (studentId: string, courseId: string): boolean => {
  const student = getStudentById(studentId);
  
  if (!student) {
    return false;
  }
  
  if (!student.enrolledCourses) {
    student.enrolledCourses = [];
  }
  
  if (!student.enrolledCourses.includes(courseId)) {
    student.enrolledCourses.push(courseId);
    return updateStudentProfile(studentId, { enrolledCourses: student.enrolledCourses }) !== null;
  }
  
  return true;
};

// Create student
export const createStudent = (studentData: Omit<Student, 'id' | 'createdAt'>): Student => {
  const { firstName, lastName, phone, email, country } = studentData;
  return registerStudent(firstName, lastName, phone, email, 'defaultPassword', country);
};

// Update student
export const updateStudent = (studentId: string, studentData: Partial<Student>): Student | null => {
  return updateStudentProfile(studentId, studentData);
};

// Delete student
export const deleteStudent = (studentId: string): boolean => {
  const students = getAllStudents();
  const filteredStudents = students.filter(student => student.id !== studentId);
  
  if (filteredStudents.length < students.length) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(filteredStudents));
    localStorage.removeItem(`student_password_${studentId}`);
    return true;
  }
  
  return false;
};

// Get students by enrolled course
export const getStudentsByEnrolledCourse = (courseId: string): Student[] => {
  const students = getAllStudents();
  return students.filter(student => 
    student.enrolledCourses && student.enrolledCourses.includes(courseId)
  );
};

// Reset student password
export const resetStudentPassword = (studentId: string, newPassword: string): boolean => {
  const student = getStudentById(studentId);
  
  if (!student) {
    return false;
  }
  
  localStorage.setItem(`student_password_${studentId}`, newPassword);
  return true;
};

// Add function for password reset OTP
export const requestPasswordResetOTP = (email: string): { success: boolean, message: string } => {
  // In a real application, this would send an OTP to the student's email
  console.log(`Password reset OTP requested for ${email}`);
  
  // For demo purposes, store a fake OTP in localStorage
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(`password_reset_otp_${email}`, otp);
  localStorage.setItem(`password_reset_otp_time_${email}`, Date.now().toString());
  
  console.log(`Generated OTP for ${email}: ${otp}`);
  
  return {
    success: true,
    message: "OTP sent successfully to the email address"
  };
};

// Verify password reset OTP
export const verifyPasswordResetOTP = (email: string, otp: string): boolean => {
  const storedOTP = localStorage.getItem(`password_reset_otp_${email}`);
  const otpTime = localStorage.getItem(`password_reset_otp_time_${email}`);
  
  if (!storedOTP || !otpTime) {
    return false;
  }
  
  // Check if OTP is expired (15 minutes validity)
  const now = Date.now();
  const otpTimestamp = parseInt(otpTime);
  if (now - otpTimestamp > 15 * 60 * 1000) {
    return false;
  }
  
  return storedOTP === otp;
};

// Student activity tracking functions
export const getStudentLoginHistory = (studentId: string) => {
  // In a full implementation, this would fetch login history from backend
  const historyKey = `student_login_history_${studentId}`;
  const history = localStorage.getItem(historyKey);
  return history ? JSON.parse(history) : [];
};

export const logStudentActivity = (studentId: string, action: string) => {
  const activityKey = `student_activity_${studentId}`;
  const existingActivities = localStorage.getItem(activityKey);
  const activities = existingActivities ? JSON.parse(existingActivities) : [];
  
  activities.push({
    action,
    timestamp: new Date().toISOString()
  });
  
  localStorage.setItem(activityKey, JSON.stringify(activities));
};

export const getStudentActivity = (studentId: string) => {
  const activityKey = `student_activity_${studentId}`;
  const activities = localStorage.getItem(activityKey);
  return activities ? JSON.parse(activities) : [];
};

export const getStudentTotalActiveTime = (studentId: string) => {
  // In a real implementation, this would calculate based on session data
  const activeTimeKey = `student_active_time_${studentId}`;
  const activeTime = localStorage.getItem(activeTimeKey);
  return activeTime ? parseInt(activeTime) : 0;
};

export const updateStudentActiveTime = (studentId: string, seconds: number) => {
  const activeTimeKey = `student_active_time_${studentId}`;
  const existingTime = localStorage.getItem(activeTimeKey);
  const totalTime = (existingTime ? parseInt(existingTime) : 0) + seconds;
  
  localStorage.setItem(activeTimeKey, totalTime.toString());
  return totalTime;
};

export const formatActiveTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours}h ${minutes}m`;
};

export const getStudentLastActiveTime = (studentId: string) => {
  const lastActiveKey = `student_last_active_${studentId}`;
  return localStorage.getItem(lastActiveKey) || new Date().toISOString();
};

export const updateStudentLastActiveTime = (studentId: string) => {
  const lastActiveKey = `student_last_active_${studentId}`;
  const now = new Date().toISOString();
  localStorage.setItem(lastActiveKey, now);
  return now;
};

// Function to get student enrollments
export const getStudentEnrollments = (studentId: string) => {
  const student = getStudentById(studentId);
  if (!student || !student.enrolledCourses) {
    return [];
  }
  
  return student.enrolledCourses;
};

// Initialize with some test students if none exist
export const initializeStudentsIfNeeded = (): void => {
  const students = getAllStudents();
  
  if (students.length === 0) {
    // Add a test student
    const testStudent: Student = {
      id: 'student_1',
      firstName: 'Test',
      lastName: 'Student',
      phone: '+919876543210',
      email: 'test@example.com',
      country: 'India',
      name: 'Test Student',
      enrolledCourses: ['course_1', 'course_2'],
      createdAt: new Date().toISOString()
    };
    
    // Store the test student
    localStorage.setItem(STUDENTS_KEY, JSON.stringify([testStudent]));
    
    // Store a password for the test student
    localStorage.setItem(`student_password_${testStudent.id}`, 'password123');
  }
};

// Initialize test students
initializeStudentsIfNeeded();
