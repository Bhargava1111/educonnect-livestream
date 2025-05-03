
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

// Import and re-export student auth related functions from the new modules
import {
  isStudentLoggedIn,
  loginStudent,
  logoutStudent
} from './auth/authService';

import {
  getStudentLoginHistory,
  getStudentActivity,
  getStudentTotalActiveTime,
  formatActiveTime,
  getStudentLastActiveTime
} from './auth/activityService';

import {
  getStudentEnrollments,
  getStudentData,
  getStudentsByEnrolledCourse,
  enrollStudentInCourse,
  getStudentById 
} from './auth/studentService';

import {
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword
} from './auth/passwordService';

import {
  getCurrentStudent
} from './auth/utils';

// Re-export them
export {
  isStudentLoggedIn,
  loginStudent,
  logoutStudent,
  getStudentLoginHistory,
  getStudentActivity,
  getStudentTotalActiveTime,
  formatActiveTime,
  getStudentLastActiveTime,
  getStudentEnrollments,
  getStudentData,
  getStudentsByEnrolledCourse,
  enrollStudentInCourse,
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword,
  getCurrentStudent,
  getStudentById
};

// For backward compatibility
export const studentAuth = {
  isStudentLoggedIn,
  loginStudent,
  logoutStudent,
  getStudentLoginHistory,
  getStudentActivity,
  getStudentTotalActiveTime,
  formatActiveTime,
  getStudentLastActiveTime,
  getStudentEnrollments,
  getStudentData,
  getStudentsByEnrolledCourse,
  enrollStudentInCourse,
  getCurrentStudent,
  getStudentById,
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword
};
