
// A centralized API service that manages all API calls
import { Assessment, Course, Job } from './types';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } from './courseService';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from './jobService';
import { getAllAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment } from './assessmentService';
import { getAllLiveMeetings, getLiveMeetingById, createLiveMeeting, updateLiveMeeting, deleteLiveMeeting } from './liveMeetingService';
import { 
  getCurrentStudent, isStudentLoggedIn, loginStudent, logoutStudent, registerStudent, updateStudentProfile 
} from './studentAuth';
import { createEnrollment } from './enrollmentService';
import { createPayment, updatePayment } from './paymentService';
import { getAllPlacements, getPlacementById, createPlacement, updatePlacement, deletePlacement } from './placementService';

// Mock API response delay
const API_DELAY = 500; // milliseconds

// Simulate async API call
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, API_DELAY);
  });
};

// Student API endpoints
export const apiLoginStudent = async (phone: string, password: string) => {
  try {
    // Directly use the synchronous function but wrap in Promise for API consistency
    return simulateApiCall({ 
      success: true, 
      data: loginStudent(phone, password)
    });
  } catch (error) {
    return simulateApiCall({ 
      success: false, 
      error: (error as Error).message 
    });
  }
};

export const apiRegisterStudent = async (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  country: string
) => {
  try {
    return simulateApiCall({ 
      success: true, 
      data: registerStudent(firstName, lastName, phone, email, password, country)
    });
  } catch (error) {
    return simulateApiCall({ 
      success: false, 
      error: (error as Error).message 
    });
  }
};

export const apiLogoutStudent = async () => {
  logoutStudent();
  return simulateApiCall({ success: true });
};

export const apiGetCurrentStudent = async () => {
  const student = getCurrentStudent();
  return simulateApiCall({ 
    success: !!student, 
    data: student 
  });
};

export const apiIsStudentLoggedIn = async () => {
  return simulateApiCall({ 
    success: true, 
    data: isStudentLoggedIn() 
  });
};

export const apiUpdateStudentProfile = async (studentId: string, updates: any) => {
  try {
    const result = updateStudentProfile(studentId, updates);
    return simulateApiCall({ 
      success: !!result, 
      data: result 
    });
  } catch (error) {
    return simulateApiCall({ 
      success: false, 
      error: (error as Error).message 
    });
  }
};

// Course API endpoints
export const apiGetAllCourses = async () => {
  return simulateApiCall({ 
    success: true, 
    data: getAllCourses() 
  });
};

export const apiGetCourseById = async (id: string) => {
  const course = getCourseById(id);
  return simulateApiCall({ 
    success: !!course, 
    data: course 
  });
};

export const apiCreateCourse = async (course: Omit<Course, 'id'>) => {
  return simulateApiCall({ 
    success: true, 
    data: createCourse(course) 
  });
};

export const apiUpdateCourse = async (id: string, updates: Partial<Course>) => {
  const result = updateCourse(id, updates);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

export const apiDeleteCourse = async (id: string) => {
  return simulateApiCall({ 
    success: deleteCourse(id)
  });
};

// Jobs API endpoints
export const apiGetAllJobs = async () => {
  return simulateApiCall({ 
    success: true, 
    data: getAllJobs() 
  });
};

export const apiGetJobById = async (id: string) => {
  const job = getJobById(id);
  return simulateApiCall({ 
    success: !!job, 
    data: job 
  });
};

export const apiCreateJob = async (job: Omit<Job, 'id'>) => {
  return simulateApiCall({ 
    success: true, 
    data: createJob(job) 
  });
};

export const apiUpdateJob = async (id: string, updates: Partial<Job>) => {
  const result = updateJob(id, updates);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

export const apiDeleteJob = async (id: string) => {
  return simulateApiCall({ 
    success: deleteJob(id)
  });
};

// Enrollment API endpoints
export const apiEnrollStudentInCourse = async (studentId: string, courseId: string) => {
  const result = createEnrollment(studentId, courseId);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

// Payment API endpoints
export const apiCreatePayment = async (paymentData: any) => {
  return simulateApiCall({ 
    success: true, 
    data: createPayment(paymentData) 
  });
};

export const apiUpdatePaymentStatus = async (paymentId: string, status: 'success' | 'pending' | 'failed') => {
  const result = updatePayment(paymentId, status);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

// Assessment API endpoints
export const apiGetAllAssessments = async () => {
  return simulateApiCall({ 
    success: true, 
    data: getAllAssessments() 
  });
};

export const apiGetAssessmentById = async (id: string) => {
  const assessment = getAssessmentById(id);
  return simulateApiCall({ 
    success: !!assessment, 
    data: assessment 
  });
};

export const apiCreateAssessment = async (assessment: Omit<Assessment, 'id'>) => {
  return simulateApiCall({ 
    success: true, 
    data: createAssessment(assessment) 
  });
};

export const apiUpdateAssessment = async (id: string, updates: Partial<Assessment>) => {
  const result = updateAssessment(id, updates);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

export const apiDeleteAssessment = async (id: string) => {
  return simulateApiCall({ 
    success: deleteAssessment(id)
  });
};

// Live Meeting API endpoints
export const apiGetAllLiveMeetings = async () => {
  return simulateApiCall({ 
    success: true, 
    data: getAllLiveMeetings() 
  });
};

export const apiGetLiveMeetingById = async (id: string) => {
  const liveMeeting = getLiveMeetingById(id);
  return simulateApiCall({ 
    success: !!liveMeeting, 
    data: liveMeeting 
  });
};

export const apiCreateLiveMeeting = async (liveMeetingData: any) => {
  return simulateApiCall({ 
    success: true, 
    data: createLiveMeeting(liveMeetingData) 
  });
};

export const apiUpdateLiveMeeting = async (id: string, updates: any) => {
  const result = updateLiveMeeting(id, updates);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

export const apiDeleteLiveMeeting = async (id: string) => {
  return simulateApiCall({ 
    success: deleteLiveMeeting(id)
  });
};

// Placements API endpoints
export const apiGetAllPlacements = async () => {
  return simulateApiCall({ 
    success: true, 
    data: getAllPlacements() 
  });
};

export const apiGetPlacementById = async (id: string) => {
  const placement = getPlacementById(id);
  return simulateApiCall({ 
    success: !!placement, 
    data: placement 
  });
};

export const apiCreatePlacement = async (placementData: any) => {
  return simulateApiCall({ 
    success: true, 
    data: createPlacement(placementData) 
  });
};

export const apiUpdatePlacement = async (id: string, updates: any) => {
  const result = updatePlacement(id, updates);
  return simulateApiCall({ 
    success: !!result, 
    data: result 
  });
};

export const apiDeletePlacement = async (id: string) => {
  return simulateApiCall({ 
    success: deletePlacement(id)
  });
};

// Generic error handling
export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  return {
    success: false,
    error: error?.message || "An unknown error occurred"
  };
};
