import { Student, COURSES_KEY } from './types';

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
export const registerStudent = (studentData: Omit<Student, 'id' | 'createdAt'>): { success: boolean; data?: Student; error?: string } => {
  try {
    // Check if the phone number is already registered
    if (getStudentByPhone(studentData.phone)) {
      return {
        success: false,
        error: "Phone number already registered"
      };
    }
    
    // Create a new student object
    const newStudent: Student = {
      id: generateId(),
      ...studentData,
      createdAt: new Date().toISOString()
    };
    
    // Add the new student to localStorage
    const students = getAllStudents();
    students.push(newStudent);
    localStorage.setItem('career_aspire_students', JSON.stringify(students));
    
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

const getStoredStudents = (): Student[] => {
  const storedStudents = localStorage.getItem('career_aspire_students');
  return storedStudents ? JSON.parse(storedStudents) : [];
};

// Function to simulate student login with phone and password
export const loginWithPhone = (phone: string, password: string): { success: boolean; data?: Student; error?: string } => {
  try {
    const students = getStoredStudents();
    const student = students.find(s => s.phone === phone);
    
    if (!student) {
      return {
        success: false,
        error: "No account found with this phone number"
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
export const logout = (): void => {
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
