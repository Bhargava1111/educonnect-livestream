
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
): Student => {
  // Check if student with phone already exists
  if (getStudentByPhone(phone)) {
    throw new Error("A student with this phone number already exists");
  }
  
  // Create new student
  const newStudent: Student = {
    id: `student_${Date.now()}`,
    firstName,
    lastName,
    phone,
    email,
    country,
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
  
  return newStudent;
};

// Login a student
export const loginStudent = (phone: string, password: string): Student => {
  const student = getStudentByPhone(phone);
  
  if (!student) {
    throw new Error("No account found with this phone number");
  }
  
  const storedPassword = localStorage.getItem(`student_password_${student.id}`);
  
  if (password !== storedPassword) {
    throw new Error("Incorrect password");
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
  
  // Set as current student
  setCurrentStudent(updatedStudent);
  
  return updatedStudent;
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
  // Implementation would go here
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
  // Implementation would go here
  return [];
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

// Student activity tracking functions
export const getStudentLoginHistory = (studentId: string) => {
  return [];
};

export const getStudentActivity = (studentId: string) => {
  return [];
};

export const getStudentTotalActiveTime = (studentId: string) => {
  return 0;
};

export const formatActiveTime = (seconds: number) => {
  return "0h 0m";
};

export const getStudentLastActiveTime = (studentId: string) => {
  return new Date().toISOString();
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
