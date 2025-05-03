
import { Enrollment, ENROLLMENTS_KEY } from './types';

// Initialize enrollments if not present
const initializeEnrollmentsIfNeeded = (): Enrollment[] => {
  const existingEnrollments = localStorage.getItem(ENROLLMENTS_KEY);
  
  if (existingEnrollments) {
    return JSON.parse(existingEnrollments);
  } else {
    const defaultEnrollments: Enrollment[] = [];
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(defaultEnrollments));
    return defaultEnrollments;
  }
};

// Enrollment CRUD operations
export const getAllEnrollments = (): Enrollment[] => {
  return initializeEnrollmentsIfNeeded();
};

export const getEnrollmentById = (id: string): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  return enrollments.find(enrollment => enrollment.id === id);
};

export const getEnrollmentsByCourse = (courseId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.courseId === courseId);
};

// Add this function to maintain compatibility with courseService imports
export const getEnrollmentsByCourseId = getEnrollmentsByCourse;

export const getEnrollmentsByStudent = (studentId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const createEnrollment = (studentId: string, courseId: string): Enrollment => {
  const enrollments = getAllEnrollments();
  const newEnrollment: Enrollment = {
    id: `enrollment_${Date.now()}`,
    studentId,
    courseId,
    enrollmentDate: new Date().toISOString(),
    status: 'active',
    progress: 0,
    completed: false,
    certificateIssued: false,
    lastAccessedDate: new Date().toISOString()
  };
  
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  return newEnrollment;
};

export const updateEnrollment = (id: string, updatedEnrollment: Partial<Enrollment>): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  const index = enrollments.findIndex(enrollment => enrollment.id === id);
  
  if (index !== -1) {
    enrollments[index] = { ...enrollments[index], ...updatedEnrollment };
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return enrollments[index];
  }
  
  return undefined;
};

export const deleteEnrollment = (id: string): boolean => {
  const enrollments = getAllEnrollments();
  const filteredEnrollments = enrollments.filter(enrollment => enrollment.id !== id);
  
  if (filteredEnrollments.length < enrollments.length) {
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(filteredEnrollments));
    return true;
  }
  
  return false;
};

// Function to check if an enrollment exists
export const enrollmentExists = (studentId: string, courseId: string): boolean => {
  const enrollments = getAllEnrollments();
  return enrollments.some(enrollment => enrollment.studentId === studentId && enrollment.courseId === courseId);
};

// Export enrollments as CSV
export const exportEnrollmentsAsCSV = (courseId?: string): string => {
  const enrollments = courseId ? getEnrollmentsByCourse(courseId) : getAllEnrollments();
  
  // CSV header
  let csv = 'ID,Student ID,Course ID,Enrollment Date,Status,Progress,Completed,Certificate Issued,Last Accessed Date\n';
  
  // Add rows
  enrollments.forEach(enrollment => {
    csv += `${enrollment.id},${enrollment.studentId},${enrollment.courseId},${enrollment.enrollmentDate},${enrollment.status},${enrollment.progress},${enrollment.completed},${enrollment.certificateIssued},${enrollment.lastAccessedDate || 'N/A'}\n`;
  });
  
  return csv;
};
