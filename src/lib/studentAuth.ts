// Student authentication utility
import { createEnrollment, getEnrollmentsByStudentId } from './courseManagement';
import { LoginHistory, StudentActivity, STUDENT_ACTIVITY_KEY } from './types';

// Session storage key for student auth
const STUDENT_AUTH_KEY = "career_aspire_student_auth";
const LOGIN_HISTORY_KEY = "career_aspire_login_history";

// Get all students from storage
const getAllStudentsFromStorage = (): any[] => {
  const storedStudents = localStorage.getItem("career_aspire_students");
  return storedStudents ? JSON.parse(storedStudents) : [];
};

// Save students to storage
const saveStudentsToStorage = (students: any[]): void => {
  localStorage.setItem("career_aspire_students", JSON.stringify(students));
};

// Save login history
const saveLoginHistory = (userId: string, success: boolean, failureReason?: string): void => {
  const history = localStorage.getItem(LOGIN_HISTORY_KEY);
  const loginHistory: LoginHistory[] = history ? JSON.parse(history) : [];
  
  const newEntry: LoginHistory = {
    id: `login_${Date.now()}`,
    userId,
    timestamp: new Date().toISOString(),
    success,
    ipAddress: '127.0.0.1', // Placeholder in browser environment
    userAgent: navigator.userAgent,
    failureReason
  };
  
  loginHistory.push(newEntry);
  localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(loginHistory));
};

// Track student activity
const trackStudentActivity = (studentId: string): void => {
  const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
  const activityLog: StudentActivity[] = activities ? JSON.parse(activities) : [];
  
  // Create new activity record for this session
  const newActivity: StudentActivity = {
    id: `activity_${Date.now()}`,
    studentId,
    loginTime: new Date().toISOString(),
    pages: [],
    device: {
      browser: getBrowserInfo(),
      os: getOSInfo(),
      device: getDeviceInfo()
    }
  };
  
  activityLog.push(newActivity);
  localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify(activityLog));
};

// Helper functions for device info
const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
  return 'Unknown';
};

const getOSInfo = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'MacOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
};

const getDeviceInfo = (): string => {
  if (/Mobi|Android/i.test(navigator.userAgent)) return 'Mobile';
  if (/iPad|Tablet/i.test(navigator.userAgent)) return 'Tablet';
  return 'Desktop';
};

export const loginStudent = (loginId: string, password: string, isPhoneLogin = false): { success: boolean; studentData?: any; error?: string } => {
  const students = getAllStudentsFromStorage();
  
  let student;
  
  if (isPhoneLogin) {
    // Extract phone number without country code for comparison
    const phoneNumber = loginId.replace(/^\+\d+\s*/, '');
    student = students.find(s => s.phone.replace(/^\+\d+\s*/, '') === phoneNumber);
    
    if (!student) {
      saveLoginHistory(loginId, false, "Phone number not registered");
      return { success: false, error: "Phone number not registered" };
    }
  } else {
    // Login with email and password
    student = students.find(
      (s) => s.email.toLowerCase() === loginId.toLowerCase() && s.password === password
    );
    
    if (!student) {
      saveLoginHistory(loginId, false, "Invalid email or password");
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
  
  // Record login history
  saveLoginHistory(student.id, true);
  
  // Track student activity
  trackStudentActivity(student.id);
  
  return { success: true, studentData: safeStudentData };
};

export const registerStudent = (studentData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
}): { success: boolean; error?: string } => {
  const students = getAllStudentsFromStorage();
  
  // Check if email already exists (case-insensitive)
  if (students.some(s => s.email.toLowerCase() === studentData.email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }
  
  // Format phone with country code if provided
  let formattedPhone = studentData.phone || '';
  if (studentData.countryCode && formattedPhone && !formattedPhone.startsWith('+')) {
    formattedPhone = `${studentData.countryCode} ${formattedPhone}`;
  }
  
  // Check if phone already exists (if provided)
  if (formattedPhone && students.some(s => s.phone === formattedPhone)) {
    return { success: false, error: "Phone number already registered" };
  }
  
  // Combine first and last name if provided
  let fullName = studentData.name;
  if (studentData.firstName && studentData.lastName) {
    fullName = `${studentData.firstName} ${studentData.lastName}`;
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
    firstName: studentData.firstName || '',
    lastName: studentData.lastName || '',
    name: fullName,
    email: studentData.email,
    password: studentData.password,
    phone: formattedPhone,
    address: studentData.address || '',
    countryCode: studentData.countryCode || '+91' // Default to India
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
  
  // Record login history
  saveLoginHistory(newStudent.id, true);
  
  // Track student activity
  trackStudentActivity(newStudent.id);
  
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
  // Update activity record with logout time
  const studentData = getStudentData();
  if (studentData && studentData.id) {
    const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
    if (activities) {
      const activityLog: StudentActivity[] = JSON.parse(activities);
      // Find the most recent activity for this student
      const studentActivities = activityLog.filter(a => a.studentId === studentData.id);
      if (studentActivities.length > 0) {
        const lastActivityIndex = activityLog.indexOf(studentActivities[studentActivities.length - 1]);
        if (lastActivityIndex !== -1) {
          const loginTime = new Date(activityLog[lastActivityIndex].loginTime).getTime();
          const logoutTime = new Date().getTime();
          const activeDuration = Math.round((logoutTime - loginTime) / 1000); // Convert to seconds
          
          activityLog[lastActivityIndex].logoutTime = new Date().toISOString();
          activityLog[lastActivityIndex].activeDuration = activeDuration;
          
          localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify(activityLog));
        }
      }
    }
  }
  
  // Remove auth session
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

// Function to get student login history
export const getStudentLoginHistory = (studentId: string) => {
  const history = localStorage.getItem(LOGIN_HISTORY_KEY);
  if (!history) return [];
  
  try {
    const loginHistory: LoginHistory[] = JSON.parse(history);
    return loginHistory.filter(entry => entry.userId === studentId);
  } catch (error) {
    return [];
  }
};

// Function to get student activity data
export const getStudentActivity = (studentId: string) => {
  const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
  if (!activities) return [];
  
  try {
    const activityLog: StudentActivity[] = JSON.parse(activities);
    return activityLog.filter(activity => activity.studentId === studentId);
  } catch (error) {
    return [];
  }
};

// Function to get total active time for a student
export const getStudentTotalActiveTime = (studentId: string): number => {
  const activities = getStudentActivity(studentId);
  return activities.reduce((total, activity) => {
    return total + (activity.activeDuration || 0);
  }, 0);
};

// Function to format active time in hours, minutes, seconds
export const formatActiveTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${remainingSeconds}s`);
  
  return parts.join(' ');
};

// Function to get last active time for student
export const getStudentLastActiveTime = (studentId: string): string | null => {
  const activities = getStudentActivity(studentId);
  if (activities.length === 0) return null;
  
  // Sort by login time, descending
  activities.sort((a, b) => 
    new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime()
  );
  
  return activities[0].logoutTime || activities[0].loginTime;
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
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  aadharNumber?: string;
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
  profilePicture?: string;
}): { success: boolean; student?: any; error?: string } => {
  // Format name
  let fullName = studentData.name;
  if (studentData.firstName && studentData.lastName) {
    fullName = `${studentData.firstName} ${studentData.lastName}`;
  }
  
  // Format phone with country code if provided
  let formattedPhone = studentData.phone || '';
  if (studentData.countryCode && formattedPhone && !formattedPhone.startsWith('+')) {
    formattedPhone = `${studentData.countryCode} ${formattedPhone}`;
  }
  
  const enhancedStudentData = {
    ...studentData,
    name: fullName,
    phone: formattedPhone
  };
  
  return registerStudent(enhancedStudentData);
};

export const updateStudent = (id: string, data: Partial<any>): boolean => {
  const students = getAllStudentsFromStorage();
  const studentIndex = students.findIndex(s => s.id === id);
  
  if (studentIndex === -1) return false;
  
  // Format phone with country code if provided
  if (data.phone && data.countryCode && !data.phone.startsWith('+')) {
    data.phone = `${data.countryCode} ${data.phone}`;
  }
  
  // If both first and last name are provided, update the full name
  if (data.firstName && data.lastName) {
    data.name = `${data.firstName} ${data.lastName}`;
  }
  
  students[studentIndex] = {
    ...students[studentIndex],
    ...data
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

// Change student password by admin (no verification needed)
export const changeStudentPasswordByAdmin = (studentId: string, newPassword: string): { success: boolean; error?: string } => {
  if (!studentId || !newPassword) {
    return { success: false, error: "Student ID and new password are required" };
  }
  
  const students = getAllStudentsFromStorage();
  const studentIndex = students.findIndex(s => s.id === studentId);
  
  if (studentIndex === -1) {
    return { success: false, error: "Student not found" };
  }
  
  // Update password
  students[studentIndex].password = newPassword;
  saveStudentsToStorage(students);
  
  return { success: true };
};

// Export student data as CSV
export const exportStudentsAsCSV = (): string => {
  const students = getAllStudents();
  
  // CSV header
  let csv = 'ID,Name,Email,Phone,Registration Date,Number of Enrolled Courses\n';
  
  // Add rows
  students.forEach(student => {
    const enrolledCourseCount = student.enrolledCourses ? student.enrolledCourses.length : 0;
    const registrationDate = student.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : 'N/A';
    
    csv += `${student.id},"${student.name}","${student.email}","${student.phone || 'N/A'}","${registrationDate}",${enrolledCourseCount}\n`;
  });
  
  return csv;
};
