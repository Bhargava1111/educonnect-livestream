
/**
 * API Service for handling backend operations
 * This file simulates backend API calls using localStorage
 */
import { 
  getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  getAllLiveMeetings, getLiveMeetingsByCourseId, createLiveMeeting, updateLiveMeeting, deleteLiveMeeting,
  getAllJobs, getJobById, createJob, updateJob, deleteJob,
  getAllPlacements, getPlacementById, createPlacement, updatePlacement, deletePlacement,
  getAllAssessments, getAssessmentsByCourseId, createAssessment, updateAssessment, deleteAssessment,
  getAllEnrollments, getEnrollmentsByStudentId, getEnrollmentsByCourseId, createEnrollment, updateEnrollmentProgress,
  getAllPayments, getPaymentsByStudentId, getPaymentsByCourseId, createPayment, updatePayment,
  getCourseStatistics
} from './courseManagement';

import {
  loginStudent, logoutStudent, isStudentLoggedIn, getStudentData,
  registerStudent, updateStudentProfile, enrollStudentInCourse,
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
  getStudentsByEnrolledCourse, resetStudentPassword
} from './studentAuth';

import {
  loginAdmin, logoutAdmin, isAdminLoggedIn, getAdminData
} from './auth';

// Simulated API latency (ms)
const API_LATENCY = 300;

/**
 * Simulate an API request with a delay
 * @param callback - The function to execute
 * @returns Promise that resolves with the result of the callback
 */
const simulateApiRequest = async <T>(callback: () => T): Promise<T> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, API_LATENCY));
  
  // Execute the callback and return its result
  try {
    return callback();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Authentication API
 */
export const AuthAPI = {
  // Student authentication
  loginStudent: (email: string, password: string) => 
    simulateApiRequest(() => loginStudent(email, password)),
  
  registerStudent: (data: any) => 
    simulateApiRequest(() => registerStudent(data)),
  
  logoutStudent: () => 
    simulateApiRequest(() => logoutStudent()),
  
  isStudentLoggedIn: () => 
    simulateApiRequest(() => isStudentLoggedIn()),
  
  getStudentData: () => 
    simulateApiRequest(() => getStudentData()),
  
  updateStudentProfile: (data: any) => 
    simulateApiRequest(() => updateStudentProfile(data)),
  
  // Admin authentication  
  loginAdmin: (email: string, password: string) => 
    simulateApiRequest(() => loginAdmin(email, password)),
  
  logoutAdmin: () => 
    simulateApiRequest(() => logoutAdmin()),
  
  isAdminLoggedIn: () => 
    simulateApiRequest(() => isAdminLoggedIn()),
  
  getAdminData: () => 
    simulateApiRequest(() => getAdminData()),
};

/**
 * Course API
 */
export const CourseAPI = {
  getAllCourses: () => 
    simulateApiRequest(() => getAllCourses()),
  
  getCourseById: (id: string) => 
    simulateApiRequest(() => getCourseById(id)),
  
  createCourse: (course: any) => 
    simulateApiRequest(() => createCourse(course)),
  
  updateCourse: (id: string, course: any) => 
    simulateApiRequest(() => updateCourse(id, course)),
  
  deleteCourse: (id: string) => 
    simulateApiRequest(() => deleteCourse(id)),
  
  getCourseStatistics: (id: string) => 
    simulateApiRequest(() => getCourseStatistics(id)),
};

/**
 * Live Meeting API
 */
export const LiveMeetingAPI = {
  getAllLiveMeetings: () => 
    simulateApiRequest(() => getAllLiveMeetings()),
  
  getLiveMeetingsByCourseId: (courseId: string) => 
    simulateApiRequest(() => getLiveMeetingsByCourseId(courseId)),
  
  createLiveMeeting: (meeting: any) => 
    simulateApiRequest(() => createLiveMeeting(meeting)),
  
  updateLiveMeeting: (id: string, meeting: any) => 
    simulateApiRequest(() => updateLiveMeeting(id, meeting)),
  
  deleteLiveMeeting: (id: string) => 
    simulateApiRequest(() => deleteLiveMeeting(id)),
};

/**
 * Job API
 */
export const JobAPI = {
  getAllJobs: () => 
    simulateApiRequest(() => getAllJobs()),
  
  getJobById: (id: string) => 
    simulateApiRequest(() => getJobById(id)),
  
  createJob: (job: any) => 
    simulateApiRequest(() => createJob(job)),
  
  updateJob: (id: string, job: any) => 
    simulateApiRequest(() => updateJob(id, job)),
  
  deleteJob: (id: string) => 
    simulateApiRequest(() => deleteJob(id)),
};

/**
 * Placement API
 */
export const PlacementAPI = {
  getAllPlacements: () => 
    simulateApiRequest(() => getAllPlacements()),
  
  getPlacementById: (id: string) => 
    simulateApiRequest(() => getPlacementById(id)),
  
  createPlacement: (placement: any) => 
    simulateApiRequest(() => createPlacement(placement)),
  
  updatePlacement: (id: string, placement: any) => 
    simulateApiRequest(() => updatePlacement(id, placement)),
  
  deletePlacement: (id: string) => 
    simulateApiRequest(() => deletePlacement(id)),
};

/**
 * Assessment API
 */
export const AssessmentAPI = {
  getAllAssessments: () => 
    simulateApiRequest(() => getAllAssessments()),
  
  getAssessmentsByCourseId: (courseId: string) => 
    simulateApiRequest(() => getAssessmentsByCourseId(courseId)),
  
  createAssessment: (assessment: any) => 
    simulateApiRequest(() => createAssessment(assessment)),
  
  updateAssessment: (id: string, assessment: any) => 
    simulateApiRequest(() => updateAssessment(id, assessment)),
  
  deleteAssessment: (id: string) => 
    simulateApiRequest(() => deleteAssessment(id)),
};

/**
 * Enrollment API
 */
export const EnrollmentAPI = {
  getAllEnrollments: () => 
    simulateApiRequest(() => getAllEnrollments()),
  
  getEnrollmentsByStudentId: (studentId: string) => 
    simulateApiRequest(() => getEnrollmentsByStudentId(studentId)),
  
  getEnrollmentsByCourseId: (courseId: string) => 
    simulateApiRequest(() => getEnrollmentsByCourseId(courseId)),
  
  createEnrollment: (studentId: string, courseId: string) => 
    simulateApiRequest(() => createEnrollment(studentId, courseId)),
  
  updateEnrollmentProgress: (enrollmentId: string, progress: number) => 
    simulateApiRequest(() => updateEnrollmentProgress(enrollmentId, progress)),
  
  enrollStudentInCourse: (courseId: string | number) => 
    simulateApiRequest(() => enrollStudentInCourse(courseId)),
};

/**
 * Payment API
 */
export const PaymentAPI = {
  getAllPayments: () => 
    simulateApiRequest(() => getAllPayments()),
  
  getPaymentsByStudentId: (studentId: string) => 
    simulateApiRequest(() => getPaymentsByStudentId(studentId)),
  
  getPaymentsByCourseId: (courseId: string) => 
    simulateApiRequest(() => getPaymentsByCourseId(courseId)),
  
  createPayment: (payment: any) => 
    simulateApiRequest(() => createPayment(payment)),
  
  updatePayment: (id: string, status: 'pending' | 'completed' | 'failed', details?: any) => 
    simulateApiRequest(() => updatePayment(id, status, details)),
};

/**
 * Student API for admin operations
 */
export const StudentAPI = {
  getAllStudents: () => 
    simulateApiRequest(() => getAllStudents()),
  
  getStudentById: (id: string) => 
    simulateApiRequest(() => getStudentById(id)),
  
  createStudent: (data: any) => 
    simulateApiRequest(() => createStudent(data)),
  
  updateStudent: (id: string, data: any) => 
    simulateApiRequest(() => updateStudent(id, data)),
  
  deleteStudent: (id: string) => 
    simulateApiRequest(() => deleteStudent(id)),
  
  getStudentsByEnrolledCourse: (courseId: string | number) => 
    simulateApiRequest(() => getStudentsByEnrolledCourse(courseId)),
  
  resetPassword: (email: string, newPassword: string) => 
    simulateApiRequest(() => resetStudentPassword(email, newPassword)),
};
