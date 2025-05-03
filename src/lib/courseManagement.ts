
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

// Get these functions from studentAuth instead of defining them here
// to avoid circular imports
import {
  getStudentLoginHistory,
  getStudentActivity,
  getStudentTotalActiveTime,
  formatActiveTime,
  getStudentLastActiveTime
} from './studentAuth';

// Re-export them
export {
  getStudentLoginHistory,
  getStudentActivity,
  getStudentTotalActiveTime,
  formatActiveTime,
  getStudentLastActiveTime
};
