import { 
  Course, 
  RoadmapPhase, 
  COURSES_KEY,
  CourseModule
} from './types';
import { getEnrollmentsByCourseId } from './enrollmentService';
import { getPaymentsByCourseId } from './paymentService';

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
        shortDescription: 'Learn manual testing, automation testing, and quality assurance practices',
        description: 'Learn manual testing, automation testing, and quality assurance practices',
        duration: '12 weeks',
        price: 24999,
        level: 'Beginner',
        students: 125,
        ratings: 4.8,
        instructor: 'Priya Sharma',
        status: 'Active',
        category: 'Testing',
        imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
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
      },
      {
        id: 'course_web_dev',
        title: 'Full-Stack Web Development',
        description: 'Master front-end and back-end technologies for complete web applications',
        duration: '14 weeks',
        price: 29999,
        level: 'Intermediate',
        students: 210,
        rating: 4.9,
        instructor: 'Rahul Khanna',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=400',
        curriculum: [
          {
            id: 'module_1',
            title: 'Frontend Development',
            topics: [
              { id: 'topic_1', title: 'HTML5 & CSS3' },
              { id: 'topic_2', title: 'JavaScript Fundamentals' },
              { id: 'topic_3', title: 'React.js' }
            ]
          },
          {
            id: 'module_2',
            title: 'Backend Development',
            topics: [
              { id: 'topic_4', title: 'Node.js' },
              { id: 'topic_5', title: 'Express.js' },
              { id: 'topic_6', title: 'MongoDB' }
            ]
          }
        ],
        roadmap: [
          {
            phase: 1,
            title: "Web Fundamentals",
            duration: "3 weeks",
            topics: ["HTML5", "CSS3", "Responsive Design", "JavaScript Basics", "Git & GitHub"],
            projects: ["Portfolio Website"]
          },
          {
            phase: 2,
            title: "Frontend Development",
            duration: "4 weeks",
            topics: ["JavaScript Advanced", "React.js", "Redux", "UI Libraries", "REST API Interaction"],
            projects: ["E-commerce Frontend"]
          },
          {
            phase: 3,
            title: "Backend Development",
            duration: "4 weeks",
            topics: ["Node.js", "Express.js", "MongoDB", "Authentication", "API Development"],
            projects: ["RESTful API"]
          },
          {
            phase: 4,
            title: "Full Stack Integration",
            duration: "3 weeks",
            topics: ["Full Stack Architecture", "Deployment", "Performance Optimization", "Testing", "Security"],
            projects: ["Complete Web Application"]
          }
        ]
      },
      {
        id: 'course_python',
        title: 'Python Full Stack Development',
        description: 'Learn Python programming and build full-stack web applications',
        duration: '16 weeks',
        price: 27999,
        level: 'Beginner',
        students: 145,
        rating: 4.7,
        instructor: 'Sameer Khan',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?auto=format&fit=crop&w=800&h=400',
        curriculum: [
          {
            id: 'module_1',
            title: 'Python Basics',
            topics: [
              { id: 'topic_1', title: 'Python Syntax & Data Types' },
              { id: 'topic_2', title: 'Control Flow & Functions' },
              { id: 'topic_3', title: 'Object-Oriented Programming' }
            ]
          },
          {
            id: 'module_2',
            title: 'Web Development with Django',
            topics: [
              { id: 'topic_4', title: 'Django Basics' },
              { id: 'topic_5', title: 'Models & Databases' },
              { id: 'topic_6', title: 'Views & Templates' }
            ]
          }
        ],
        roadmap: [
          {
            phase: 1,
            title: "Python Fundamentals",
            duration: "4 weeks",
            topics: ["Python Syntax", "Data Types", "Functions", "OOP", "Modules & Packages"],
            projects: ["Terminal-based Application"]
          },
          {
            phase: 2,
            title: "Web Development Basics",
            duration: "3 weeks",
            topics: ["HTML/CSS", "JavaScript Basics", "DOM Manipulation", "Responsive Design"],
            projects: ["Static Website"]
          },
          {
            phase: 3,
            title: "Django Framework",
            duration: "4 weeks",
            topics: ["Django Setup", "MVT Architecture", "Models & ORM", "Views & URLs", "Templates"],
            projects: ["Blog Application"]
          },
          {
            phase: 4,
            title: "Database & API",
            duration: "3 weeks",
            topics: ["PostgreSQL", "Django REST Framework", "API Design", "Authentication"],
            projects: ["RESTful API Service"]
          },
          {
            phase: 5,
            title: "Frontend Integration",
            duration: "2 weeks",
            topics: ["AJAX", "Fetch API", "Frontend Frameworks Basics", "API Integration"],
            projects: ["Full-stack Web Application"]
          }
        ]
      },
      {
        id: 'course_mern',
        title: 'MERN Stack Development',
        description: 'Become a full-stack developer with MongoDB, Express, React, and Node.js',
        duration: '14 weeks',
        price: 28999,
        level: 'Intermediate',
        students: 132,
        rating: 4.8,
        instructor: 'Alisha Patel',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_cyber',
        title: 'Cybersecurity & Ethical Hacking',
        description: 'Learn cybersecurity principles and ethical hacking techniques',
        duration: '12 weeks',
        price: 29999,
        level: 'Intermediate',
        students: 128,
        rating: 4.9,
        instructor: 'Vikram Singh',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_java',
        title: 'Java Backend Development',
        description: 'Master Java and Spring Boot for enterprise application development',
        duration: '14 weeks',
        price: 26999,
        level: 'Intermediate',
        students: 118,
        rating: 4.7,
        instructor: 'Ravi Kumar',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_data',
        title: 'Data Science & Analytics',
        description: 'Learn data analysis, visualization, and machine learning techniques',
        duration: '14 weeks',
        price: 32999,
        level: 'Intermediate',
        students: 105,
        rating: 4.8,
        instructor: 'Neha Gupta',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_mean',
        title: 'MEAN Stack Development',
        description: 'Build modern web applications with MongoDB, Express, Angular, and Node.js',
        duration: '14 weeks',
        price: 28999,
        level: 'Intermediate',
        students: 98,
        rating: 4.6,
        instructor: 'Arun Mehta',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_frontend',
        title: 'Front-End Development',
        description: 'Master HTML, CSS, JavaScript, and modern frontend frameworks',
        duration: '10 weeks',
        price: 22999,
        level: 'Beginner',
        students: 87,
        rating: 4.7,
        instructor: 'Sneha Sharma',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_mobile',
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile applications with React Native',
        duration: '12 weeks',
        price: 27999,
        level: 'Intermediate',
        students: 75,
        rating: 4.8,
        instructor: 'Rohit Verma',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_devops',
        title: 'DevOps & Cloud Computing',
        description: 'Learn DevOps practices and cloud infrastructure management',
        duration: '12 weeks',
        price: 29999,
        level: 'Advanced',
        students: 62,
        rating: 4.9,
        instructor: 'Amit Sharma',
        status: 'Coming Soon',
        imageUrl: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=800&h=400'
      },
      {
        id: 'course_mca',
        title: 'MCA Program',
        description: 'Comprehensive Master of Computer Applications program with industry-focused curriculum',
        duration: '2 years',
        price: 120000,
        level: 'Advanced',
        students: 45,
        rating: 4.9,
        instructor: 'Dr. Rajesh Kumar',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&h=400'
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
    imageUrl: course.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400',
    students: course.students || 0,
    ratings: course.ratings || 0
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

// Function to get enrollments for a course - directly imported from module
import { getEnrollmentsByCourseId } from './enrollmentService';

// Function to get payments for a course - directly imported from module
import { getPaymentsByCourseId } from './paymentService';

// Utility function to generate course statistics
export const getCourseStatistics = (courseId: string) => {
  // Use imported functions directly instead of require
  const enrollments = getEnrollmentsByCourseId(courseId);
  const payments = getPaymentsByCourseId(courseId);
  
  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const activeStudents = enrollments.filter(e => !e.completed).length;
  const completedStudents = enrollments.filter(e => e.completed).length;
  
  const avgProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
    : 0;
  
  return {
    totalStudents: enrollments.length,
    activeStudents,
    completedStudents,
    totalRevenue,
    avgProgress
  };
};
