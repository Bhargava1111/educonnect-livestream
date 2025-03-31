
// Course management utility functions for admin

// Types for course management
export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  curriculum: Module[];
  image?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  students?: number;
  rating?: number;
  instructor?: string;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  duration?: string;
  content?: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  points?: number;
}

// Local storage keys
const COURSES_KEY = 'career_aspire_courses';
const ASSESSMENTS_KEY = 'career_aspire_assessments';

// Initialize with some default courses if not present
const initializeCoursesIfNeeded = (): Course[] => {
  const existingCourses = localStorage.getItem(COURSES_KEY);
  
  if (existingCourses) {
    return JSON.parse(existingCourses);
  } else {
    // Default courses can be defined here
    const defaultCourses: Course[] = [];
    localStorage.setItem(COURSES_KEY, JSON.stringify(defaultCourses));
    return defaultCourses;
  }
};

// Course CRUD operations
export const getAllCourses = (): Course[] => {
  return initializeCoursesIfNeeded();
};

export const getCourseById = (id: string): Course | undefined => {
  const courses = getAllCourses();
  return courses.find(course => course.id === id);
};

export const createCourse = (course: Omit<Course, 'id'>): Course => {
  const courses = getAllCourses();
  const newCourse = {
    ...course,
    id: `course_${Date.now()}`, // Generate a unique ID
  };
  
  courses.push(newCourse);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  return newCourse;
};

export const updateCourse = (id: string, updatedCourse: Partial<Course>): Course | undefined => {
  const courses = getAllCourses();
  const index = courses.findIndex(course => course.id === id);
  
  if (index !== -1) {
    courses[index] = { ...courses[index], ...updatedCourse };
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    return courses[index];
  }
  
  return undefined;
};

export const deleteCourse = (id: string): boolean => {
  const courses = getAllCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  
  if (filteredCourses.length < courses.length) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(filteredCourses));
    return true;
  }
  
  return false;
};

// Assessment CRUD operations
export const getAllAssessments = (): Assessment[] => {
  const assessments = localStorage.getItem(ASSESSMENTS_KEY);
  return assessments ? JSON.parse(assessments) : [];
};

export const getAssessmentsByCourseId = (courseId: string): Assessment[] => {
  const assessments = getAllAssessments();
  return assessments.filter(assessment => assessment.courseId === courseId);
};

export const createAssessment = (assessment: Omit<Assessment, 'id'>): Assessment => {
  const assessments = getAllAssessments();
  const newAssessment = {
    ...assessment,
    id: `assessment_${Date.now()}`,
  };
  
  assessments.push(newAssessment);
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
  return newAssessment;
};

export const updateAssessment = (id: string, updatedAssessment: Partial<Assessment>): Assessment | undefined => {
  const assessments = getAllAssessments();
  const index = assessments.findIndex(assessment => assessment.id === id);
  
  if (index !== -1) {
    assessments[index] = { ...assessments[index], ...updatedAssessment };
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
    return assessments[index];
  }
  
  return undefined;
};

export const deleteAssessment = (id: string): boolean => {
  const assessments = getAllAssessments();
  const filteredAssessments = assessments.filter(assessment => assessment.id !== id);
  
  if (filteredAssessments.length < assessments.length) {
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
    return true;
  }
  
  return undefined;
};

// Form submission tracking
export const trackFormSubmission = (formData: any): void => {
  const formSubmissions = localStorage.getItem('career_aspire_form_submissions') || '[]';
  const submissions = JSON.parse(formSubmissions);
  
  submissions.push({
    ...formData,
    timestamp: new Date().toISOString(),
    triggered: false // Flag to track if it's been sent to the email
  });
  
  localStorage.setItem('career_aspire_form_submissions', JSON.stringify(submissions));
  
  // In a real implementation, you would send this data to the server
  console.log(`Form submission received and would be sent to info@careeraspiretechnology.com`);
};
