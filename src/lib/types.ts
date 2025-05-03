// Storage keys
export const JOBS_KEY = "career_aspire_jobs";
export const PLACEMENTS_KEY = "career_aspire_placements";
export const COURSES_KEY = "career_aspire_courses";
export const LIVE_MEETINGS_KEY = "career_aspire_live_meetings";
export const ENROLLMENTS_KEY = "career_aspire_enrollments";
export const PAYMENTS_KEY = "career_aspire_payments";
export const CONTACTS_KEY = "career_aspire_contacts";
export const ASSESSMENTS_KEY = "career_aspire_assessments";
export const EMAIL_NOTIFICATIONS_KEY = "career_aspire_email_notifications";
export const STUDENT_ACTIVITY_KEY = "career_aspire_student_activity";
export const ENROLLMENT_FORMS_KEY = "career_aspire_enrollment_forms";

// Job type definition
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
  jobType?: string; // Full-time, Part-time, Contract, etc.
  experienceLevel?: string; // Entry, Mid, Senior
  status?: string; // Active, Inactive, Draft
  externalLink?: string;
  category?: string; // Industry or category
}

// Placement type definition
export interface Placement {
  id: string;
  studentName: string;
  company: string;
  position: string;
  year: number;
  salary: string;
  testimonial?: string;
  courseCompleted?: string;
  imageUrl?: string;
  placementDate?: string;
}

// Course type definition
export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  topics: CourseTopic[];
  imageUrl?: string;
  features?: string[];
  prerequisites?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  ratings?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  students?: number; // Added for student count
  status?: "Active" | "Inactive" | "Coming Soon"; // Added for course status
  instructor?: string; // Added for instructor name
  curriculum?: CourseModule[]; // Changed type from string[] to CourseModule[]
  roadmap?: RoadmapPhase[]; // Added for course roadmap
}

// Course module definition
export interface CourseModule {
  id: string;
  title: string;
  topics: { id: string; title: string }[];
}

// Course topic definition
export interface CourseTopic {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  materials?: CourseMaterial[];
}

// Course material definition
export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
  uploadedAt: string;
}

// Roadmap Phase for course roadmap
export interface RoadmapPhase {
  id?: string; // Made optional to maintain compatibility
  order?: number; // Made optional to maintain compatibility
  phase: number; // Added to match existing code
  title: string;
  description?: string;
  duration: string;
  topics: string[]; // Added to match existing code
  projects: string[]; // Added to match existing code
  milestones?: string[]; // Made optional for backward compatibility
}

// Live meeting definition
export interface LiveMeeting {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  scheduledDate: string;
  duration: string;
  meetingLink: string;
  hostName: string;
  capacity?: number;
  registeredStudents?: string[]; // Array of student IDs
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  recordingUrl?: string;
  createdAt: string;
}

// Enrollment definition
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped' | 'on-hold';
  completionPercentage?: number;
  certificateIssued?: boolean;
  certificateUrl?: string;
  lastAccessedDate?: string;
  progress?: number; // Added for tracking progress
  completed?: boolean; // Added to track completion
}

// Payment definition
export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'success' | 'pending' | 'failed';
  transactionId?: string;
  invoiceUrl?: string;
  paymentId?: string; // Added for payment gateway reference
}

// Contact form submission
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'in-progress' | 'resolved';
  assignedTo?: string;
  notes?: string[];
}

// Assessment definition
export interface Assessment {
  id: string;
  title: string;
  courseId: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam' | 'coding-challenge';
  totalMarks?: number;
  passingMarks?: number;
  passingScore?: number; // Added for compatibility
  dueDate?: string;
  questions?: AssessmentQuestion[];
  createdAt?: string;
  timeLimit?: number; // Added for compatibility
  requiresCamera?: boolean; // Added for compatibility
  requiresScreenshare?: boolean; // Added for compatibility
}

// Assessment question
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blanks' | 'descriptive' | 'coding';
  options?: string[];
  correctAnswer?: string | string[];
  correctAnswerIndex?: number; // Added for compatibility
  marks?: number;
  points?: number; // Added for compatibility
  codingTemplate?: string; // Added for coding questions
}

// Question type (for assessment service)
export interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string | string[];
  marks?: number;
  points?: number; // Added for compatibility
  codingTemplate?: string; // Added for coding questions
}

// Student submission for assessment
export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  answers: { questionId: string; answer: string | string[] }[];
  submittedAt: string;
  isGraded: boolean;
  marksObtained?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

// Email notification
export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentDate: string;
  status: 'sent' | 'failed' | 'pending';
  type: 'welcome' | 'reset-password' | 'enrollment-confirmation' | 'assignment' | 'general' | 'enrollment';
  relatedId?: string;
}

// Student activity tracking
export interface StudentActivity {
  id: string;
  studentId: string;
  loginTime: string;
  logoutTime?: string;
  activeDuration?: number; // in seconds
  pages: {
    path: string;
    timeSpent: number; // in seconds
    enteredAt: string;
    leftAt?: string;
  }[];
  device?: {
    browser: string;
    os: string;
    device: string;
  };
  ipAddress?: string;
}

// Login history for tracking
export interface LoginHistory {
  id: string;
  userId: string;
  timestamp: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
}

// Enrollment form data
export interface EnrollmentForm {
  id: string;
  studentId: string;
  formType: 'course' | 'job';
  relatedId: string; // courseId or jobId
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  
  // Identification Details
  aadharNumber: string;
  certificateId?: string;
  
  // Address Information
  permanentAddress: Address;
  currentAddress: Address;
  isSameAddress: boolean;
  
  // Parent/Guardian Details
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  guardianEmail: string;
  
  // Educational Details
  tenthGrade: EducationDetail;
  twelfthGrade: EducationDetail;
  degree?: EducationDetail;
  postGraduation?: EducationDetail;
  
  // Document Uploads
  certificateUrl?: string;
  photographUrl?: string;
}

// Address interface
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Education detail interface
export interface EducationDetail {
  institutionName: string;
  boardUniversity: string;
  yearOfPassing: string;
  totalMarks: string;
  obtainedMarks: string;
  documentUrl?: string;
}

// Update AssessmentQuestion to include correctAnswerIndex for compatibility
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blanks' | 'descriptive' | 'coding';
  options?: string[];
  correctAnswer?: string | string[];
  correctAnswerIndex?: number; // Added for compatibility
  marks?: number;
  points?: number; // Added for compatibility
  codingTemplate?: string; // Added for coding questions
}

// Question type (for assessment service)
export interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string | string[];
  marks?: number;
  points?: number; // Added for compatibility
  codingTemplate?: string; // Added for coding questions
}

// Update RoadmapPhase to include phase for compatibility
export interface RoadmapPhase {
  id?: string; 
  order?: number;
  phase: number; // Made required for compatibility
  title: string;
  description?: string;
  duration: string;
  topics: string[];
  projects: string[];
  milestones?: string[];
}

// Update CourseModule interface
export interface CourseModule {
  id: string;
  title: string;
  topics: { id: string; title: string }[];
}
