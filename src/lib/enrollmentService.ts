import { Enrollment, ENROLLMENTS_KEY } from './types';
import { getCourseById, updateCourse } from './courseService';

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

export const createEnrollment = (studentId: string, courseId: string): Enrollment => {
  const enrollments = getAllEnrollments();
  
  const existingEnrollment = enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId
  );
  
  if (existingEnrollment) {
    return existingEnrollment;
  }
  
  const newEnrollment: Enrollment = {
    id: `enrollment_${Date.now()}`,
    studentId,
    courseId,
    enrollmentDate: new Date().toISOString(),
    progress: 0,
    completed: false,
    certificateIssued: false
  };
  
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  
  const course = getCourseById(courseId);
  if (course) {
    updateCourse(courseId, { 
      students: (course.students || 0) + 1 
    });
  }
  
  return newEnrollment;
};

export const updateEnrollmentProgress = (
  enrollmentId: string, 
  progress: number
): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  const index = enrollments.findIndex(enrollment => enrollment.id === enrollmentId);
  
  if (index !== -1) {
    const isCompleted = progress >= 100;
    
    enrollments[index] = { 
      ...enrollments[index], 
      progress, 
      completed: isCompleted,
      ...(isCompleted && { certificateIssued: true })
    };
    
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return enrollments[index];
  }
  
  return undefined;
};
