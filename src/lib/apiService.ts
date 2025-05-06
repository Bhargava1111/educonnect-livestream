
// Implement API service methods for interacting with backend services
import axios from 'axios';
import { Student, Course, Job, Placement } from './types';
import {
  isStudentLoggedIn,
  loginStudent,
  logoutStudent,
  getStudentEnrollments
} from './courseManagement';
import { getCurrentStudent, getCurrentStudentSync, mapUserToStudent } from './auth/utils';

// Mock API base URL - would be replaced with actual API URL in production
const API_BASE_URL = 'https://api.careeraspire.com';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from local storage (simulated)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API methods (currently mocked)
export const apiLogin = async (email: string, password: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use the local authentication function for now
    return loginStudent(email, password);
    
    /* Real implementation would be like:
    const response = await api.post('/auth/login', { email, password });
    return { success: true, data: response.data };
    */
  } catch (error: any) {
    console.error("Login API error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Login failed. Please try again."
    };
  }
};

// Student registration API method (currently mocked)
export const apiRegister = async (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  password: string,
  country: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    /* Real implementation would be:
    const response = await api.post('/auth/register', { 
      firstName, lastName, phone, email, password, country 
    });
    return { success: true, data: response.data };
    */
    
    // For now, use the local method
    return { success: true, data: { firstName, lastName, phone, email, country } };
  } catch (error: any) {
    console.error("Registration API error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Registration failed. Please try again."
    };
  }
};

// Course API methods
export const apiGetFeaturedCourses = async (): Promise<Course[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For now, return mock data from localStorage
    const courses = localStorage.getItem('career_aspire_courses');
    const parsedCourses: Course[] = courses ? JSON.parse(courses) : [];
    
    return parsedCourses.filter(course => course.isFeatured && course.isPublished);
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    return [];
  }
};

// Jobs API methods
export const apiGetLatestJobs = async (limit: number = 5): Promise<Job[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For now, return mock data from localStorage
    const jobs = localStorage.getItem('career_aspire_jobs');
    const parsedJobs: Job[] = jobs ? JSON.parse(jobs) : [];
    
    // Sort by posted date (newest first) and limit
    return parsedJobs
      .filter(job => job.status === 'Open')
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    return [];
  }
};

// Placements API methods
export const apiGetRecentPlacements = async (limit: number = 5): Promise<Placement[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For now, return mock data from localStorage
    const placements = localStorage.getItem('career_aspire_placements');
    const parsedPlacements: Placement[] = placements ? JSON.parse(placements) : [];
    
    // Sort by placement date (newest first) and limit
    return parsedPlacements
      .sort((a, b) => new Date(b.placementDate).getTime() - new Date(a.placementDate).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent placements:", error);
    return [];
  }
};

// Contact form API method
export const apiSubmitContactForm = async (formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, just log the form submission
    console.log("Contact form submitted:", formData);
    
    return { 
      success: true,
      message: "Your message has been sent! We will get back to you soon."
    };
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return { 
      success: false,
      error: "Failed to submit your message. Please try again later."
    };
  }
};

// Function to get currently enrolled courses
export const apiGetEnrolledCourses = async (): Promise<Course[]> => {
  try {
    if (!isStudentLoggedIn()) {
      return [];
    }
    
    // First try to get user data synchronously
    let currentStudent = getCurrentStudentSync();
    
    // If sync fails, use async approach
    if (!currentStudent) {
      currentStudent = await getCurrentStudent();
    }
    
    if (!currentStudent) {
      return [];
    }
    
    // Get enrolled courses for the student
    const enrolledCourseIds = await getStudentEnrollments(currentStudent.id);
    
    // Get all courses
    const courses = localStorage.getItem('career_aspire_courses');
    const parsedCourses: Course[] = courses ? JSON.parse(courses) : [];
    
    // Filter courses by enrollment
    return parsedCourses.filter(course => 
      Array.isArray(enrolledCourseIds) && 
      enrolledCourseIds.includes(course.id)
    );
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
};

// Student profile API
export const apiGetStudentProfile = async (): Promise<Student | null> => {
  try {
    if (!isStudentLoggedIn()) {
      return null;
    }
    
    // First try to get user data synchronously
    let currentStudent = getCurrentStudentSync();
    
    // If sync fails, use async approach
    if (!currentStudent) {
      currentStudent = await getCurrentStudent();
    }
    
    return mapUserToStudent(currentStudent);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
};

// Function to update student profile
export const apiUpdateStudentProfile = async (
  profileData: Partial<Student>
): Promise<{ success: boolean; data?: Student; error?: string }> => {
  try {
    if (!isStudentLoggedIn()) {
      return { success: false, error: "Not logged in" };
    }
    
    // First try to get user data synchronously
    let currentStudent = getCurrentStudentSync();
    
    // If sync fails, use async approach
    if (!currentStudent) {
      currentStudent = await getCurrentStudent();
    }
    
    if (!currentStudent) {
      return { success: false, error: "Student not found" };
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const studentObj = mapUserToStudent(currentStudent);
    if (!studentObj) {
      return { success: false, error: "Could not map user to student" };
    }
    
    // Update the student profile
    const updatedStudent: Student = {
      ...studentObj,
      ...profileData
    };
    
    // Save to localStorage
    localStorage.setItem('current_student', JSON.stringify(updatedStudent));
    
    // Also update in the students array
    const students = localStorage.getItem('career_aspire_students');
    if (students) {
      const parsedStudents: Student[] = JSON.parse(students);
      const updatedStudents = parsedStudents.map(s => 
        s.id === updatedStudent.id ? updatedStudent : s
      );
      localStorage.setItem('career_aspire_students', JSON.stringify(updatedStudents));
    }
    
    return { success: true, data: updatedStudent };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { 
      success: false, 
      error: "Failed to update profile. Please try again."
    };
  }
};
