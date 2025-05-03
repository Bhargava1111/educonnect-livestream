
// Define common interfaces
export const COURSES_KEY = 'career_aspire_courses';
export const JOBS_KEY = 'career_aspire_jobs';
export const ASSESSMENTS_KEY = 'career_aspire_assessments';
export const LIVE_MEETINGS_KEY = 'career_aspire_live_meetings';
export const ENROLLMENTS_KEY = 'career_aspire_enrollments';
export const PAYMENTS_KEY = 'career_aspire_payments';
export const PLACEMENTS_KEY = 'career_aspire_placements';
export const CONTACTS_KEY = 'career_aspire_contacts';
export const ENROLLMENT_FORMS_KEY = 'career_aspire_enrollment_forms';
export const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activities';
export const EMAIL_NOTIFICATIONS_KEY = 'career_aspire_email_notifications';

// Student interface (updated)
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  profilePicture?: string;
  createdAt: string;
  lastLoginAt?: string;
  name?: string;
  enrolledCourses?: string[]; // Track enrolled courses
}

// Course interface
export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  ratings: number;
  instructor: string;
  status: 'Active' | 'Coming Soon' | 'Ended';
  category: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  topics?: string[];
  popular?: boolean;
  createdAt: string;
  updatedAt?: string;
  curriculum?: CourseModule[];
  roadmap?: RoadmapPhase[];
}

// Course module
export interface CourseModule {
  id: string;
  title: string;
  topics: CourseTopic[];
}

export interface CourseTopic {
  id: string;
  title: string;
}

// Roadmap phase with videos and materials
export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  topics: string[];
  projects: string[];
  videos?: RoadmapVideo[]; // New field: videos for the phase
  materials?: RoadmapMaterial[]; // New field: materials for the phase
}

// Video for roadmap phase
export interface RoadmapVideo {
  id: string;
  title: string;
  url: string;
  description: string;
  topicIndex: number;
}

// Material for roadmap phase
export interface RoadmapMaterial {
  id: string;
  title: string;
  type: 'document' | 'link';
  url: string;
  description: string;
}

// Job interface
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  status: 'Open' | 'Closed' | 'Filled';
  postedAt: string;
  deadlineDate?: string;
  contactEmail?: string;
  applicationLink?: string;
  category?: string;
  experience?: string;
  featured?: boolean;
  appliedCount?: number;
  createdAt?: string;
  lastDate?: string; 
  jobType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  experienceLevel?: string;
  externalLink?: string;
}

// Assessment interfaces
export interface Assessment {
  id: string;
  title: string;
  courseId: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam' | 'coding-challenge';
  totalMarks?: number;
  passingMarks?: number;
  duration?: number; // in minutes
  dueDate?: string;
  questions: AssessmentQuestion[];
  isPublished?: boolean;
  createdAt?: string;
  requiresScreenshare?: boolean;
  requiresCamera?: boolean;
  timeLimit?: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  text?: string; // Added for compatibility
  type: 'multiple-choice' | 'true-false' | 'fill-in-blanks' | 'descriptive' | 'coding';
  options?: string[];
  correctAnswer?: string | string[];
  marks: number;
}

// Live meeting interface
export interface LiveMeeting {
  id: string;
  courseId: string;
  title: string;
  description: string;
  hostName: string; // Renamed from instructor
  scheduledDate: string; // Combined date and time
  duration: string;
  meetingLink: string; // Renamed from link
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'upcoming';
  createdAt: string;
  instructor?: string; // For backwards compatibility
  date?: string; // For backwards compatibility
  time?: string; // For backwards compatibility
  link?: string; // For backwards compatibility
}

// Enrollment interface
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  progress: number;
  completed: boolean;
  certificateIssued: boolean;
  lastAccessedDate?: string;
}

// Payment interfaces
export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  paymentDate: string;
  paymentId: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
}

// Placement interface
export interface Placement {
  id: string;
  studentId: string;
  company: string;
  position: string;
  packageAmount: string;
  placementDate: string;
  description?: string;
  imageUrl?: string;
  testimonial?: string;
  studentName?: string; // Add for backward compatibility
  salary?: string; // Added for compatibility
  year?: string; // Added for compatibility
  courseCompleted?: string; // Added for compatibility
}

// Contact form interface
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

// Enrollment form interface
export interface EnrollmentFormSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId?: string;
  jobId?: string;
  education?: string;
  experience?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'enrolled' | 'rejected';
}

export interface Question {
  id: string;
  question: string;
  text?: string; // Added for compatibility
  type: string;
  options?: string[];
  correctAnswer?: string | string[];
  marks: number;
}

// Added for EnrollmentForm.tsx
export interface EnrollmentForm {
  id: string;
  studentId: string;
  formType: 'course' | 'job';
  relatedId: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  aadharNumber: string;
  certificateId?: string;
  permanentAddress: Address;
  currentAddress: Address;
  isSameAddress: boolean;
  fatherName?: string;
  motherName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  tenthGrade?: EducationDetail;
  twelfthGrade?: EducationDetail;
  degree?: EducationDetail;
  postGraduation?: EducationDetail;
  certificateUrl?: string;
  photographUrl?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EducationDetail {
  institutionName: string;
  boardUniversity: string;
  yearOfPassing: string;
  totalMarks: string;
  obtainedMarks: string;
  documentUrl?: string;
}

export interface EmailNotification {
  id: string;
  subject: string;
  message: string;
  recipientEmail: string;
  status: 'sent' | 'pending' | 'failed';
  sentAt?: string;
  createdAt: string;
}
