
// This file exists for backward compatibility and re-exports all auth-related functions
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
} from './courseManagement';
