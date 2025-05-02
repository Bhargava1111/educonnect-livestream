
import { Enrollment, ENROLLMENTS_KEY } from './types';

// Initialize enrollments
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

// Enrollment management
export const getAllEnrollments = (): Enrollment[] => {
  return initializeEnrollmentsIfNeeded();
};

export const getEnrollmentsByStudentId = (studentId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const getEnrollmentsByCourseId = (courseId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.courseId === courseId);
};

export const getEnrollment = (studentId: string, courseId: string): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  return enrollments.find(
    enrollment => enrollment.studentId === studentId && enrollment.courseId === courseId
  );
};

export const enrollmentExists = (studentId: string, courseId: string): boolean => {
  return !!getEnrollment(studentId, courseId);
};

export const createEnrollment = (studentId: string, courseId: string): Enrollment | undefined => {
  if (enrollmentExists(studentId, courseId)) {
    console.error("Enrollment already exists for this student and course");
    return undefined;
  }
  
  const enrollments = getAllEnrollments();
  
  const newEnrollment: Enrollment = {
    id: `enrollment_${Date.now()}`,
    studentId,
    courseId,
    enrollmentDate: new Date().toISOString(),
    status: 'active',
    progress: 0,
    completed: false,
    certificateIssued: false
  };
  
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  return newEnrollment;
};

export const updateEnrollment = (
  enrollmentId: string, 
  updates: Partial<Enrollment>
): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  const index = enrollments.findIndex(enrollment => enrollment.id === enrollmentId);
  
  if (index !== -1) {
    enrollments[index] = { ...enrollments[index], ...updates };
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return enrollments[index];
  }
  
  return undefined;
};

export const updateEnrollmentProgress = (
  studentId: string, 
  courseId: string, 
  progress: number
): Enrollment | undefined => {
  const enrollment = getEnrollment(studentId, courseId);
  
  if (!enrollment) return undefined;
  
  // Calculate if the course should be marked as completed
  const completed = progress >= 100;
  
  return updateEnrollment(enrollment.id, { 
    progress, 
    completed,
    // Only update lastAccessedDate if specifically provided
    lastAccessedDate: new Date().toISOString()
  });
};

export const deleteEnrollment = (enrollmentId: string): boolean => {
  const enrollments = getAllEnrollments();
  const filteredEnrollments = enrollments.filter(enrollment => enrollment.id !== enrollmentId);
  
  if (filteredEnrollments.length < enrollments.length) {
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(filteredEnrollments));
    return true;
  }
  
  return false;
};
