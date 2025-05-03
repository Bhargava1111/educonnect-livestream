// This file now serves as a central export point for all services

// Export all types
export * from './types';

// Export all services - preventing circular dependencies by exporting them separately
// rather than using re-exports
export * from './courseService';
export * from './liveMeetingService';
export * from './jobService';
export * from './placementService';
export * from './assessmentService';
export * from './enrollmentService';
export * from './paymentService';
export * from './contactService';
export * from './enrollmentFormService';

// Export student activity tracking functions
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
