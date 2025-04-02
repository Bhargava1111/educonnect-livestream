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
  roadmap?: RoadmapPhase[];
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

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  topics: string[];
  projects: string[];
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

export interface LiveMeeting {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  link: string;
  status: 'upcoming' | 'completed';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  appliedCount?: number;
  createdAt: string;
  lastDate?: string;
  jobType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  experienceLevel?: 'Entry' | 'Mid' | 'Senior';
}

export interface Placement {
  id: string;
  studentName: string;
  company: string;
  position: string;
  year: number;
  salary?: string;
  imageUrl?: string;
  testimonial?: string;
  courseCompleted?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  completed: boolean;
  certificateIssued: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  paymentDate: string;
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
}

// Local storage keys
const COURSES_KEY = 'career_aspire_courses';
const ASSESSMENTS_KEY = 'career_aspire_assessments';
const LIVE_MEETINGS_KEY = 'career_aspire_live_meetings';
const JOBS_KEY = 'career_aspire_jobs';
const PLACEMENTS_KEY = 'career_aspire_placements';
const ENROLLMENT_KEY = 'career_aspire_enrollments';
const PAYMENTS_KEY = 'career_aspire_payments';

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

// Initialize live meetings if not present
const initializeLiveMeetingsIfNeeded = (): LiveMeeting[] => {
  const existingMeetings = localStorage.getItem(LIVE_MEETINGS_KEY);
  
  if (existingMeetings) {
    return JSON.parse(existingMeetings);
  } else {
    const defaultMeetings: LiveMeeting[] = [];
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(defaultMeetings));
    return defaultMeetings;
  }
};

// Initialize jobs if not present
const initializeJobsIfNeeded = (): Job[] => {
  const existingJobs = localStorage.getItem(JOBS_KEY);
  
  if (existingJobs) {
    return JSON.parse(existingJobs);
  } else {
    const defaultJobs: Job[] = [
      {
        id: 'job_1',
        title: 'Software QA Engineer',
        company: 'TechSolutions Inc',
        location: 'Bangalore, India',
        description: 'We are looking for a skilled QA Engineer to ensure the quality of our software products through manual and automated testing.',
        requirements: [
          'Knowledge of software testing methodologies',
          'Experience with test case creation and execution',
          'Familiarity with bug tracking tools',
          'Basic understanding of programming concepts'
        ],
        salary: '6-9 LPA',
        appliedCount: 12,
        createdAt: new Date().toISOString(),
        lastDate: '2023-12-31',
        jobType: 'Full-time',
        experienceLevel: 'Mid'
      },
      {
        id: 'job_2',
        title: 'Automation Test Engineer',
        company: 'Innovative Systems',
        location: 'Hyderabad, India',
        description: 'Join our QA team to develop and maintain automated test frameworks using Selenium and other modern testing tools.',
        requirements: [
          'Strong knowledge of Selenium WebDriver',
          'Experience with Java or Python for test automation',
          'Understanding of CI/CD pipelines',
          'Knowledge of API testing'
        ],
        salary: '10-15 LPA',
        appliedCount: 8,
        createdAt: new Date().toISOString(),
        lastDate: '2023-12-15',
        jobType: 'Full-time',
        experienceLevel: 'Senior'
      }
    ];
    localStorage.setItem(JOBS_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
};

// Initialize placements if not present
const initializePlacementsIfNeeded = (): Placement[] => {
  const existingPlacements = localStorage.getItem(PLACEMENTS_KEY);
  
  if (existingPlacements) {
    return JSON.parse(existingPlacements);
  } else {
    const defaultPlacements: Placement[] = [
      {
        id: 'placement_1',
        studentName: 'Ravi Kumar',
        company: 'Infosys',
        position: 'Test Engineer',
        year: 2023,
        salary: '6 LPA',
        testimonial: 'The QA testing course at Career Aspire Technology helped me secure my dream job at Infosys.',
        courseCompleted: 'Software Testing & QA'
      },
      {
        id: 'placement_2',
        studentName: 'Priya Sharma',
        company: 'TCS',
        position: 'QA Automation Specialist',
        year: 2023,
        salary: '7.5 LPA',
        testimonial: 'The hands-on training and mock interviews prepared me well for the industry demands.',
        courseCompleted: 'Software Testing & QA'
      }
    ];
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(defaultPlacements));
    return defaultPlacements;
  }
};

// Initialize enrollments
const initializeEnrollmentsIfNeeded = (): Enrollment[] => {
  const existingEnrollments = localStorage.getItem(ENROLLMENT_KEY);
  
  if (existingEnrollments) {
    return JSON.parse(existingEnrollments);
  } else {
    const defaultEnrollments: Enrollment[] = [];
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(defaultEnrollments));
    return defaultEnrollments;
  }
};

// Initialize payments
const initializePaymentsIfNeeded = (): Payment[] => {
  const existingPayments = localStorage.getItem(PAYMENTS_KEY);
  
  if (existingPayments) {
    return JSON.parse(existingPayments);
  } else {
    const defaultPayments: Payment[] = [];
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(defaultPayments));
    return defaultPayments;
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

// Live Meeting CRUD operations
export const getAllLiveMeetings = (): LiveMeeting[] => {
  return initializeLiveMeetingsIfNeeded();
};

export const getLiveMeetingsByCourseId = (courseId: string): LiveMeeting[] => {
  const meetings = getAllLiveMeetings();
  return meetings.filter(meeting => meeting.courseId === courseId);
};

export const createLiveMeeting = (meeting: Omit<LiveMeeting, 'id'>): LiveMeeting => {
  const meetings = getAllLiveMeetings();
  const newMeeting = {
    ...meeting,
    id: `meeting_${Date.now()}`,
  };
  
  meetings.push(newMeeting);
  localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
  return newMeeting;
};

export const updateLiveMeeting = (id: string, updatedMeeting: Partial<LiveMeeting>): LiveMeeting | undefined => {
  const meetings = getAllLiveMeetings();
  const index = meetings.findIndex(meeting => meeting.id === id);
  
  if (index !== -1) {
    meetings[index] = { ...meetings[index], ...updatedMeeting };
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
    return meetings[index];
  }
  
  return undefined;
};

export const deleteLiveMeeting = (id: string): boolean => {
  const meetings = getAllLiveMeetings();
  const filteredMeetings = meetings.filter(meeting => meeting.id !== id);
  
  if (filteredMeetings.length < meetings.length) {
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(filteredMeetings));
    return true;
  }
  
  return false;
};

// Jobs CRUD operations
export const getAllJobs = (): Job[] => {
  return initializeJobsIfNeeded();
};

export const getJobById = (id: string): Job | undefined => {
  const jobs = getAllJobs();
  return jobs.find(job => job.id === id);
};

export const createJob = (job: Omit<Job, 'id'>): Job => {
  const jobs = getAllJobs();
  const newJob = {
    ...job,
    id: `job_${Date.now()}`,
  };
  
  jobs.push(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return newJob;
};

export const updateJob = (id: string, updatedJob: Partial<Job>): Job | undefined => {
  const jobs = getAllJobs();
  const index = jobs.findIndex(job => job.id === id);
  
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedJob };
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return jobs[index];
  }
  
  return undefined;
};

export const deleteJob = (id: string): boolean => {
  const jobs = getAllJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  
  if (filteredJobs.length < jobs.length) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
    return true;
  }
  
  return false;
};

// Placements CRUD operations
export const getAllPlacements = (): Placement[] => {
  return initializePlacementsIfNeeded();
};

export const getPlacementById = (id: string): Placement | undefined => {
  const placements = getAllPlacements();
  return placements.find(placement => placement.id === id);
};

export const createPlacement = (placement: Omit<Placement, 'id'>): Placement => {
  const placements = getAllPlacements();
  const newPlacement = {
    ...placement,
    id: `placement_${Date.now()}`,
  };
  
  placements.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  return newPlacement;
};

export const updatePlacement = (id: string, updatedPlacement: Partial<Placement>): Placement | undefined => {
  const placements = getAllPlacements();
  const index = placements.findIndex(placement => placement.id === id);
  
  if (index !== -1) {
    placements[index] = { ...placements[index], ...updatedPlacement };
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
    return placements[index];
  }
  
  return undefined;
};

export const deletePlacement = (id: string): boolean => {
  const placements = getAllPlacements();
  const filteredPlacements = placements.filter(placement => placement.id !== id);
  
  if (filteredPlacements.length < placements.length) {
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(filteredPlacements));
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
  
  return false;
};

// Enrollment management
export const getAllEnrollments = (): Enrollment[] => {
  return initializeEnrollmentsIfNeeded();
};

export const getEnrollmentsByStudentId = (studentId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const getEnrollmentsByCourseId = (courseId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.courseId === courseId);
};

export const createEnrollment = (studentId: string, courseId: string): Enrollment => {
  const enrollments = getAllEnrollments();
  
  const existingEnrollment = enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId
  );
  
  if (existingEnrollment) {
    return existingEnrollment;
  }
  
  const newEnrollment: Enrollment = {
    id: `enrollment_${Date.now()}`,
    studentId,
    courseId,
    enrollmentDate: new Date().toISOString(),
    progress: 0,
    completed: false,
    certificateIssued: false
  };
  
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(enrollments));
  
  const course = getCourseById(courseId);
  if (course) {
    updateCourse(courseId, { 
      students: (course.students || 0) + 1 
    });
  }
  
  return newEnrollment;
};

export const updateEnrollmentProgress = (
  enrollmentId: string, 
  progress: number
): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  const index = enrollments.findIndex(enrollment => enrollment.id === enrollmentId);
  
  if (index !== -1) {
    const isCompleted = progress >= 100;
    
    enrollments[index] = { 
      ...enrollments[index], 
      progress, 
      completed: isCompleted,
      ...(isCompleted && { certificateIssued: true })
    };
    
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(enrollments));
    return enrollments[index];
  }
  
  return undefined;
};

// Payment management
export const getAllPayments = (): Payment[] => {
  return initializePaymentsIfNeeded();
};

export const getPaymentsByStudentId = (studentId: string): Payment[] => {
  const payments = getAllPayments();
  return payments.filter(payment => payment.studentId === studentId);
};

export const getPaymentsByCourseId = (courseId: string): Payment[] => {
  const payments = getAllPayments();
  return payments.filter(payment => payment.courseId === courseId);
};

export const createPayment = (payment: Omit<Payment, 'id'>): Payment => {
  const payments = getAllPayments();
  
  const newPayment: Payment = {
    ...payment,
    id: `payment_${Date.now()}`
  };
  
  payments.push(newPayment);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  return newPayment;
};

export const updatePayment = (
  paymentId: string, 
  status: 'pending' | 'completed' | 'failed',
  paymentDetails?: Partial<Payment>
): Payment | undefined => {
  const payments = getAllPayments();
  const index = payments.findIndex(payment => payment.id === paymentId);
  
  if (index !== -1) {
    payments[index] = { 
      ...payments[index], 
      status,
      ...paymentDetails
    };
    
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    
    if (status === 'completed') {
      createEnrollment(payments[index].studentId, payments[index].courseId);
    }
    
    return payments[index];
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
    triggered: false
  });
  
  localStorage.setItem('career_aspire_form_submissions', JSON.stringify(submissions));
  
  console.log(`Form submission received and would be sent to info@careeraspiretechnology.com`);
};

// Contact details for the website
export const contactDetails = {
  email: {
    info: "info@careeraspiretechnology.com",
    support: "support@careeraspiretechnology.com"
  },
  phone: {
    primary: "+91 9876 543 210",
    secondary: "+91 8765 432 101"
  },
  address: {
    line1: "Career Aspire Technology",
    line2: "123, Tech Park, Sector 15",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001"
  },
  social: {
    facebook: "https://facebook.com/careeraspiretechnology",
    twitter: "https://twitter.com/careeraspiretech",
    linkedin: "https://linkedin.com/company/careeraspiretechnology",
    instagram: "https://instagram.com/careeraspiretechnology"
  }
};

// Utility function to generate course statistics
export const getCourseStatistics = (courseId: string) => {
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
