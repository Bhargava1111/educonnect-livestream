import { Student } from '../types';
import { 
  getAllStudents, 
  updateStudentInStorage,
  getCurrentStudent,
  setCurrentStudent,
  generateId
} from './utils';

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

// Export getStudentById function
export const getStudentById = (id: string): Student | undefined => {
  const students = getAllStudents();
  return students.find(student => student.id === id);
};

// Export getAllStudents for backward compatibility
export { getAllStudents };

// Function to register a student - make sure this is exported
export const registerStudent = (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  country: string
): { success: boolean; data?: Student; error?: string } => {
  try {
    // Get existing students
    const students = getAllStudents();
    
    // Check if the phone number is already registered
    if (students.some(student => student.phone === phone)) {
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
      createdAt: new Date().toISOString(),
      name: `${firstName} ${lastName}`
    };
    
    // Add the new student to localStorage
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
export const getStudentEnrollments = (studentId?: string): string[] => {
  const id = studentId || getCurrentStudent()?.id;
  if (!id) return [];
  return getEnrolledCourses(id);
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
  const student = getStudentById(studentId);
  
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
