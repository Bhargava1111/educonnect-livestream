
// Storage keys for localStorage
export const ENROLLMENTS_KEY = 'career_aspire_enrollments';
export const ASSESSMENTS_KEY = 'career_aspire_assessments';
export const PAYMENTS_KEY = 'career_aspire_payments';
export const COURSES_KEY = 'career_aspire_courses';
export const JOBS_KEY = 'career_aspire_jobs';
export const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activity';
export const ENROLLMENT_FORMS_KEY = 'career_aspire_enrollment_forms';
export const PLACEMENTS_KEY = 'career_aspire_placements';

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
  updatedAt?: string;
  isPopular?: boolean;
  shortDescription?: string;
  imageUrl?: string;
  status?: string;
  students?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  topics?: string[];
  roadmap?: RoadmapPhase[];
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
  category?: string;
  lastDate?: string;
  jobType?: string;
  experienceLevel?: string;
  status?: string;
  externalLink?: string;
  appliedCount?: number;
  postedAt?: string;
  createdAt?: string;
  applicationLink?: string;
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
  type?: 'quiz' | 'exam' | 'assignment';
  duration?: number;
  passingScore?: number;
  isPublished?: boolean;
  requiresScreenshare?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'descriptive' | 'fill-in-blanks' | 'coding';
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  explanation?: string;
  question?: string;
}

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
  name?: string;
  address?: string;
}

export interface StudentData extends Student {
  enrollmentDate?: string;
  courseProgress?: { [courseId: string]: number };
  profilePicture?: string;
  registrationDate?: string;
  skills?: string[];
  education?: {
    tenth?: any;
    twelfth?: any;
    degree?: any;
  };
  aadharNumber?: string;
}

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

export interface EnrollmentForm {
  id: string;
  studentId: string;
  relatedId: string;
  formType: string;
  status: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  aadharNumber: string;
  permanentAddress: any;
  currentAddress: any;
  isSameAddress: boolean;
  tenthGrade?: any;
  twelfthGrade?: any;
  degree?: any;
  postGraduation?: any;
  fatherName?: string;
  motherName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  certificateId?: string;
  certificateUrl?: string;
  photographUrl?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: string[];
  isActive: boolean;
  phase?: number;
  topics?: string[];
  projects?: string[];
  videos?: Video[];
  materials?: Material[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  description?: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link' | 'image';
  url: string;
  description?: string;
}

export interface OTPVerification {
  id: string;
  email: string;
  phone?: string;
  otp: string;
  type: 'email' | 'sms' | 'whatsapp';
  expiresAt: string;
  verified: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: string;
  type: 'support' | 'general' | 'course';
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  courseId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentGateway: 'razorpay' | 'stripe' | 'upi';
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  event: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface DatabaseTypes {
  StudentActivityRow: {
    id: string;
    student_id: string;
    activity_type: string;
    context: any;
    timestamp: string;
  };
  
  ProfileRow: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    country: string;
    address?: string;
    skills?: string[];
    profile_picture?: string;
    aadhar_number?: string;
    created_at: string;
    updated_at: string;
  };
}
