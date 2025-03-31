
// Student authentication utility

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
    enrolledCourses: []
  },
  {
    id: "s2",
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
    enrolledCourses: ["course_1"]
  },
  {
    id: "s3",
    email: "mike@example.com",
    password: "password123",
    name: "Mike Johnson",
    enrolledCourses: ["course_2", "course_3"]
  }
];

export const loginStudent = (email: string, password: string): { success: boolean; studentData?: any } => {
  const student = MOCK_STUDENTS.find(
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

export const enrollStudentInCourse = (courseId: string | number) => {
  const studentData = getStudentData();
  
  if (!studentData) return false;
  
  // Add course to enrolled courses if not already enrolled
  if (!studentData.enrolledCourses.includes(courseId)) {
    studentData.enrolledCourses.push(courseId);
    
    // Update localStorage
    localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify(studentData));
    return true;
  }
  
  return false;
};

// Admin functions for student management
export const getAllStudents = () => {
  return MOCK_STUDENTS.map(student => {
    // Don't expose passwords
    const { password, ...safeStudentData } = student;
    return safeStudentData;
  });
};

export const getStudentById = (id: string) => {
  const student = MOCK_STUDENTS.find(s => s.id === id);
  if (!student) return null;
  
  // Don't expose password
  const { password, ...safeStudentData } = student;
  return safeStudentData;
};

export const getStudentsByEnrolledCourse = (courseId: string | number) => {
  const studentsInCourse = MOCK_STUDENTS.filter(student => 
    student.enrolledCourses.includes(courseId)
  );
  
  return studentsInCourse.map(student => {
    // Don't expose passwords
    const { password, ...safeStudentData } = student;
    return safeStudentData;
  });
};
