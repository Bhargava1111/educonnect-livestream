
// Local Storage keys
export const COURSES_KEY = 'career_aspire_courses';
export const ENROLLMENTS_KEY = 'career_aspire_enrollments';
export const PAYMENTS_KEY = 'career_aspire_payments';
export const LIVE_MEETINGS_KEY = 'career_aspire_live_meetings';
export const USERS_KEY = 'career_aspire_users';
export const ADMINS_KEY = 'career_aspire_admins';
export const JOBS_KEY = 'career_aspire_jobs';
export const PLACEMENTS_KEY = 'career_aspire_placements';
export const ASSESSMENTS_KEY = 'career_aspire_assessments';
export const CONTACTS_KEY = 'career_aspire_contacts';
export const EMAIL_NOTIFICATIONS_KEY = 'career_aspire_email_notifications';
export const ATTENDANCE_KEY = 'career_aspire_attendance';
export const USER_ACTIVITY_KEY = 'career_aspire_user_activity';

// Course types
export interface Topic {
  id: string;
  title: string;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Material {
  id: string;
  title: string;
  type: 'video' | 'document' | 'link';
  url: string;
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  description?: string;
  topicIndex?: number | null;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  topics: string[];
  projects: string[];
  materials?: Material[];
  videos?: Video[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students?: number;
  rating?: number;
  instructor?: string;
  imageUrl?: string;
  curriculum?: Module[];
  roadmap?: RoadmapPhase[];
  status?: 'Active' | 'Inactive' | 'Coming Soon';
  category?: string;
  courseType?: 'Free' | 'Paid';
  popular?: boolean;
  isFree?: boolean;
  customPaymentLink?: string;
  enrollmentCount?: number;
  learningMaterials?: CourseMaterial[];
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  topicId?: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'video' | 'other';
  uploadDate: string;
  size?: number; // in KB
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  points?: number;
  type?: 'multiple-choice' | 'coding' | 'essay';
  codingTemplate?: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore?: number;
  type?: 'quiz' | 'coding-challenge' | 'project' | 'exam';
  dueDate?: string;
  requiresCamera?: boolean;
  requiresScreenshare?: boolean;
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
  status?: 'Active' | 'Inactive' | 'Draft';
  externalLink?: string;
  category?: string;
  compensation?: string;
  skills?: string[];
  benefits?: string[];
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
  placementDate?: string;
  linkedinProfile?: string;
}

export interface Education {
  tenth: {
    school: string;
    board: string;
    percentage: string;
    yearOfPassing: string;
  };
  twelfth: {
    school: string;
    board: string;
    percentage: string;
    yearOfPassing: string;
  };
  degree: {
    college: string;
    university: string;
    degree: string;
    percentage: string;
    yearOfPassing: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  completed: boolean;
  certificateIssued: boolean;
  aadharNumber?: string;
  education?: string;
  topicProgress?: {
    phaseId: number;
    topicId: number;
    completed: boolean;
    lastAccessDate?: string;
  }[];
  paymentId?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentAmount?: number;
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

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  punchIn: string;
  punchOut: string | null;
  duration: number | null; // in minutes
}

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentDate: string;
  status: 'sent' | 'failed' | 'pending';
  type: 'enrollment' | 'payment' | 'assessment' | 'general';
  relatedId?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  userType: 'student' | 'admin';
  action: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
  sessionId?: string;
  duration?: number; // in seconds
}
