
// Storage keys for localStorage
export const ENROLLMENTS_KEY = 'career_aspire_enrollments';
export const ASSESSMENTS_KEY = 'career_aspire_assessments';

// Remove duplicate LiveMeeting interface to prevent conflicts
// The LiveMeeting interface is now defined in the services file

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  studentsEnrolled: number;
  features: string[];
  curriculum: CourseModule[];
  instructor: string;
  createdAt: string;
  isPopular?: boolean;
  // Additional fields for database compatibility
  shortDescription?: string;
  imageUrl?: string;
  status?: string;
  students?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  topics: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicationDeadline: string;
  contactEmail: string;
  isActive: boolean;
  // Additional fields for database compatibility
  category?: string;
  lastDate?: string;
  jobType?: string;
  experienceLevel?: string;
  status?: string;
  externalLink?: string;
  appliedCount?: number;
  postedAt?: string;
}

export interface Placement {
  id: string;
  studentName: string;
  course: string;
  company: string;
  position: string;
  salary: string;
  placementDate: string;
  image: string;
  // Additional fields for database compatibility
  studentId?: string;
  packageAmount?: string;
  description?: string;
  testimonial?: string;
  year?: string;
  courseCompleted?: string;
  imageUrl?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: Question[];
  timeLimit: number;
  totalMarks: number;
  passingMarks: number;
  isActive: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  explanation?: string;
  // Legacy field for backward compatibility
  question?: string;
}

// Legacy type alias for backward compatibility
export interface AssessmentQuestion extends Question {}

export interface StudentAssessment {
  id: string;
  studentId: string;
  assessmentId: string;
  responses: AssessmentResponse[];
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'in-progress' | 'completed' | 'graded';
  startedAt: string;
  completedAt?: string;
  timeSpent: number;
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  marksAwarded: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'suspended';
  progress: number;
  completed: boolean;
  certificateIssued: boolean;
  lastAccessedDate?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  createdAt: string;
  lastLoginDate?: string;
  isActive: boolean;
}

// Legacy interface for backward compatibility
export interface StudentData extends Student {
  name?: string;
  enrollmentDate?: string;
  courseProgress?: { [courseId: string]: number };
}
