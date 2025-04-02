
import { 
  Course, 
  RoadmapPhase, 
  COURSES_KEY 
} from './types';

// Initialize with some default courses if not present
const initializeCoursesIfNeeded = (): Course[] => {
  const existingCourses = localStorage.getItem(COURSES_KEY);
  
  if (existingCourses) {
    return JSON.parse(existingCourses);
  } else {
    const defaultCourses: Course[] = [
      {
        id: 'course_testing',
        title: 'Software Testing & QA',
        description: 'Learn manual testing, automation testing, and quality assurance practices',
        duration: '12 weeks',
        price: 24999,
        level: 'Beginner',
        students: 125,
        rating: 4.8,
        instructor: 'Priya Sharma',
        curriculum: [
          {
            id: 'module_1',
            title: 'Testing Fundamentals',
            topics: [
              { id: 'topic_1', title: 'Introduction to Software Testing' },
              { id: 'topic_2', title: 'Testing Types and Levels' },
              { id: 'topic_3', title: 'Test Planning and Documentation' }
            ]
          },
          {
            id: 'module_2',
            title: 'Manual Testing Techniques',
            topics: [
              { id: 'topic_4', title: 'Black Box Testing' },
              { id: 'topic_5', title: 'White Box Testing' },
              { id: 'topic_6', title: 'Regression and Smoke Testing' }
            ]
          },
          {
            id: 'module_3',
            title: 'Automation Testing',
            topics: [
              { id: 'topic_7', title: 'Introduction to Selenium' },
              { id: 'topic_8', title: 'Test Automation Frameworks' },
              { id: 'topic_9', title: 'CI/CD Integration' }
            ]
          }
        ],
        roadmap: [
          {
            phase: 1,
            title: "Testing Fundamentals",
            duration: "3 weeks",
            topics: ["SDLC & STLC", "Testing Methodologies", "Test Case Design", "Defect Tracking", "Test Planning"],
            projects: ["Test Plan Document", "Test Case Suite"]
          },
          {
            phase: 2,
            title: "Manual Testing",
            duration: "3 weeks",
            topics: ["Functional Testing", "UI Testing", "Usability Testing", "Cross-Browser Testing", "Mobile Testing"],
            projects: ["E-commerce Application Testing", "Bug Report Documentation"]
          },
          {
            phase: 3,
            title: "Automation Basics",
            duration: "2 weeks",
            topics: ["Introduction to Selenium", "WebDriver Setup", "Element Locators", "Basic Test Scripts", "Test Execution"],
            projects: ["Simple Automated Test Suite"]
          },
          {
            phase: 4,
            title: "Advanced Automation",
            duration: "2 weeks",
            topics: ["TestNG Framework", "Data-Driven Testing", "Page Object Model", "Cross-Browser Automation", "Reporting"],
            projects: ["Framework Implementation"]
          },
          {
            phase: 5,
            title: "API Testing & Tools",
            duration: "1 week",
            topics: ["REST API Basics", "Postman Tool", "JMeter Basics", "Performance Testing", "Security Testing"],
            projects: ["API Test Collection"]
          },
          {
            phase: 6,
            title: "Industry Project & Placement Preparation",
            duration: "1 week",
            topics: ["Project Implementation", "Testing Documentation", "Interview Preparation", "Resume Building", "Mock Interviews"],
            projects: ["End-to-End Testing Project"]
          }
        ]
      }
    ];
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
    id: `course_${Date.now()}`,
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

export const updateCourseRoadmap = (id: string, roadmap: RoadmapPhase[]): Course | undefined => {
  return updateCourse(id, { roadmap });
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

// Utility function to generate course statistics
export const getCourseStatistics = (courseId: string) => {
  // Import these functions to avoid circular dependencies
  const { getEnrollmentsByCourseId } = require('./enrollmentService');
  const { getPaymentsByCourseId } = require('./paymentService');
  
  const enrollments = getEnrollmentsByCourseId(courseId);
  const payments = getPaymentsByCourseId(courseId);
  
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const activeStudents = enrollments.filter(e => !e.completed).length;
  const completedStudents = enrollments.filter(e => e.completed).length;
  
  const avgProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
    : 0;
  
  return {
    totalStudents: enrollments.length,
    activeStudents,
    completedStudents,
    totalRevenue,
    avgProgress
  };
};
