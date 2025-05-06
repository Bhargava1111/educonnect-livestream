
// This file now exports from the AuthContext
import { 
  useAuth 
} from '@/contexts/AuthContext';

// Re-export all auth-related functions from the old implementation for backward compatibility
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
  getStudentById,
  getAllStudents,
  registerStudent,
  updateStudentProfile
} from './courseManagement';

// Export the new auth hook for components that want to directly use the new system
export { useAuth };
