import { 
  Course, 
  RoadmapPhase, 
  COURSES_KEY,
  CourseModule
} from './types';
import { getEnrollmentsByCourse } from './enrollmentService';
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
        rating: 4.8,
        instructor: 'Priya Sharma',
        status: 'Active',
        category: 'Testing',
        imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 125,
        curriculum: [
          {
            id: 'module_1',
            title: 'Testing Fundamentals',
            duration: '3 weeks',
            topics: ['Introduction to Software Testing', 'Testing Types and Levels', 'Test Planning and Documentation']
          },
          {
            id: 'module_2',
            title: 'Manual Testing Techniques',
            duration: '3 weeks',
            topics: ['Black Box Testing', 'White Box Testing', 'Regression and Smoke Testing']
          },
          {
            id: 'module_3',
            title: 'Automation Testing',
            duration: '3 weeks',
            topics: ['Introduction to Selenium', 'Test Automation Frameworks', 'CI/CD Integration']
          }
        ],
        roadmap: [
          {
            id: '1',
            title: "Testing Fundamentals",
            description: "Learn the basics of software testing",
            duration: "3 weeks",
            modules: ["SDLC & STLC", "Testing Methodologies", "Test Case Design", "Defect Tracking", "Test Planning"],
            isActive: true,
            phase: 1,
            topics: ["SDLC & STLC", "Testing Methodologies", "Test Case Design", "Defect Tracking", "Test Planning"],
            projects: ["Test Plan Document", "Test Case Suite"]
          }
        ]
      },
      {
        id: 'course_web_dev',
        title: 'Full-Stack Web Development',
        shortDescription: 'Master front-end and back-end technologies for complete web applications',
        description: 'Master front-end and back-end technologies for complete web applications',
        duration: '14 weeks',
        price: 29999,
        level: 'Intermediate',
        students: 210,
        rating: 4.9,
        instructor: 'Rahul Khanna',
        status: 'Active',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 210,
        curriculum: [
          {
            id: 'module_1',
            title: 'Frontend Development',
            duration: '4 weeks',
            topics: ['HTML5 & CSS3', 'JavaScript Fundamentals', 'React.js']
          },
          {
            id: 'module_2',
            title: 'Backend Development',
            duration: '4 weeks',
            topics: ['Node.js', 'Express.js', 'MongoDB']
          }
        ],
        roadmap: [
          {
            id: '1',
            title: "Web Fundamentals",
            description: "Learn the basics of web development",
            duration: "3 weeks",
            modules: ["HTML5", "CSS3", "Responsive Design", "JavaScript Basics", "Git & GitHub"],
            isActive: true,
            phase: 1,
            topics: ["HTML5", "CSS3", "Responsive Design", "JavaScript Basics", "Git & GitHub"],
            projects: ["Portfolio Website"]
          },
          {
            id: '2',
            title: "Frontend Development",
            description: "Build interactive user interfaces",
            duration: "4 weeks",
            modules: ["JavaScript Advanced", "React.js", "Redux", "UI Libraries", "REST API Interaction"],
            isActive: true,
            phase: 2,
            topics: ["JavaScript Advanced", "React.js", "Redux", "UI Libraries", "REST API Interaction"],
            projects: ["E-commerce Frontend"]
          },
          {
            id: '3',
            title: "Backend Development",
            description: "Create server-side applications",
            duration: "4 weeks",
            modules: ["Node.js", "Express.js", "MongoDB", "Authentication", "API Development"],
            isActive: true,
            phase: 3,
            topics: ["Node.js", "Express.js", "MongoDB", "Authentication", "API Development"],
            projects: ["RESTful API"]
          },
          {
            id: '4',
            title: "Full Stack Integration",
            description: "Combine frontend and backend",
            duration: "3 weeks",
            modules: ["Full Stack Architecture", "Deployment", "Performance Optimization", "Testing", "Security"],
            isActive: true,
            phase: 4,
            topics: ["Full Stack Architecture", "Deployment", "Performance Optimization", "Testing", "Security"],
            projects: ["Complete Web Application"]
          }
        ]
      },
      {
        id: 'course_python',
        title: 'Python Full Stack Development',
        shortDescription: 'Learn Python programming and build full-stack web applications',
        description: 'Learn Python programming and build full-stack web applications',
        duration: '16 weeks',
        price: 27999,
        level: 'Beginner',
        students: 145,
        rating: 4.7,
        instructor: 'Sameer Khan',
        status: 'Active',
        category: 'Programming',
        imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 145,
        curriculum: [
          {
            id: 'module_1',
            title: 'Python Basics',
            duration: '4 weeks',
            topics: ['Python Syntax & Data Types', 'Control Flow & Functions', 'Object-Oriented Programming']
          },
          {
            id: 'module_2',
            title: 'Web Development with Django',
            duration: '4 weeks',
            topics: ['Django Basics', 'Models & Databases', 'Views & Templates']
          }
        ],
        roadmap: [
          {
            id: '1',
            title: "Python Fundamentals",
            description: "Master Python programming basics",
            duration: "4 weeks",
            modules: ["Python Syntax", "Data Types", "Functions", "OOP", "Modules & Packages"],
            isActive: true,
            phase: 1,
            topics: ["Python Syntax", "Data Types", "Functions", "OOP", "Modules & Packages"],
            projects: ["Terminal-based Application"]
          },
          {
            id: '2',
            title: "Web Development Basics",
            description: "Learn web development fundamentals",
            duration: "3 weeks",
            modules: ["HTML/CSS", "JavaScript Basics", "DOM Manipulation", "Responsive Design"],
            isActive: true,
            phase: 2,
            topics: ["HTML/CSS", "JavaScript Basics", "DOM Manipulation", "Responsive Design"],
            projects: ["Static Website"]
          },
          {
            id: '3',
            title: "Django Framework",
            description: "Build web applications with Django",
            duration: "4 weeks",
            modules: ["Django Setup", "MVT Architecture", "Models & ORM", "Views & URLs", "Templates"],
            isActive: true,
            phase: 3,
            topics: ["Django Setup", "MVT Architecture", "Models & ORM", "Views & URLs", "Templates"],
            projects: ["Blog Application"]
          },
          {
            id: '4',
            title: "Database & API",
            description: "Work with databases and APIs",
            duration: "3 weeks",
            modules: ["PostgreSQL", "Django REST Framework", "API Design", "Authentication"],
            isActive: true,
            phase: 4,
            topics: ["PostgreSQL", "Django REST Framework", "API Design", "Authentication"],
            projects: ["RESTful API Service"]
          },
          {
            id: '5',
            title: "Frontend Integration",
            description: "Integrate frontend with backend",
            duration: "2 weeks",
            modules: ["AJAX", "Fetch API", "Frontend Frameworks Basics", "API Integration"],
            isActive: true,
            phase: 5,
            topics: ["AJAX", "Fetch API", "Frontend Frameworks Basics", "API Integration"],
            projects: ["Full-stack Web Application"]
          }
        ]
      },
      {
        id: 'course_mern',
        title: 'MERN Stack Development',
        shortDescription: 'Become a full-stack developer with MongoDB, Express, React, and Node.js',
        description: 'Become a full-stack developer with MongoDB, Express, React, and Node.js',
        duration: '14 weeks',
        price: 28999,
        level: 'Intermediate',
        students: 132,
        rating: 4.8,
        instructor: 'Alisha Patel',
        status: 'Active',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 132,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_cyber',
        title: 'Cybersecurity & Ethical Hacking',
        shortDescription: 'Learn cybersecurity principles and ethical hacking techniques',
        description: 'Learn cybersecurity principles and ethical hacking techniques',
        duration: '12 weeks',
        price: 29999,
        level: 'Intermediate',
        students: 128,
        rating: 4.9,
        instructor: 'Vikram Singh',
        status: 'Active',
        category: 'Security',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 128,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_java',
        title: 'Java Backend Development',
        shortDescription: 'Master Java and Spring Boot for enterprise application development',
        description: 'Master Java and Spring Boot for enterprise application development',
        duration: '14 weeks',
        price: 26999,
        level: 'Intermediate',
        students: 118,
        rating: 4.7,
        instructor: 'Ravi Kumar',
        status: 'Active',
        category: 'Programming',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 118,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_data',
        title: 'Data Science & Analytics',
        shortDescription: 'Learn data analysis, visualization, and machine learning techniques',
        description: 'Learn data analysis, visualization, and machine learning techniques',
        duration: '14 weeks',
        price: 32999,
        level: 'Intermediate',
        students: 105,
        rating: 4.8,
        instructor: 'Neha Gupta',
        status: 'Active',
        category: 'Data Science',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 105,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_mean',
        title: 'MEAN Stack Development',
        shortDescription: 'Build modern web applications with MongoDB, Express, Angular, and Node.js',
        description: 'Build modern web applications with MongoDB, Express, Angular, and Node.js',
        duration: '14 weeks',
        price: 28999,
        level: 'Intermediate',
        students: 98,
        rating: 4.6,
        instructor: 'Arun Mehta',
        status: 'Active',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 98,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_frontend',
        title: 'Front-End Development',
        shortDescription: 'Master HTML, CSS, JavaScript, and modern frontend frameworks',
        description: 'Master HTML, CSS, JavaScript, and modern frontend frameworks',
        duration: '10 weeks',
        price: 22999,
        level: 'Beginner',
        students: 87,
        rating: 4.7,
        instructor: 'Sneha Sharma',
        status: 'Active',
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 87,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_mobile',
        title: 'Mobile App Development',
        shortDescription: 'Build cross-platform mobile applications with React Native',
        description: 'Build cross-platform mobile applications with React Native',
        duration: '12 weeks',
        price: 27999,
        level: 'Intermediate',
        students: 75,
        rating: 4.8,
        instructor: 'Rohit Verma',
        status: 'Active',
        category: 'Mobile Development',
        imageUrl: 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 75,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_devops',
        title: 'DevOps & Cloud Computing',
        shortDescription: 'Learn DevOps practices and cloud infrastructure management',
        description: 'Learn DevOps practices and cloud infrastructure management',
        duration: '12 weeks',
        price: 29999,
        level: 'Advanced',
        students: 62,
        rating: 4.9,
        instructor: 'Amit Sharma',
        status: 'Coming Soon',
        category: 'DevOps',
        imageUrl: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 62,
        curriculum: [],
        roadmap: []
      },
      {
        id: 'course_mca',
        title: 'MCA Program',
        shortDescription: 'Comprehensive Master of Computer Applications program with industry-focused curriculum',
        description: 'Comprehensive Master of Computer Applications program with industry-focused curriculum',
        duration: '2 years',
        price: 120000,
        level: 'Advanced',
        students: 45,
        rating: 4.9,
        instructor: 'Dr. Rajesh Kumar',
        status: 'Active',
        category: 'Academic Program',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&h=400',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&h=400',
        isFeatured: true,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        features: ['Live Classes', 'Hands-on Projects', 'Industry Certification'],
        studentsEnrolled: 45,
        curriculum: [],
        roadmap: []
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
    image: course.imageUrl || course.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400',
    students: course.students || 0,
    studentsEnrolled: course.studentsEnrolled || course.students || 0,
    rating: course.rating || 0,
    features: course.features || [],
    curriculum: course.curriculum || [],
    roadmap: course.roadmap || []
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
  const enrollments = getEnrollmentsByCourse(courseId);
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
