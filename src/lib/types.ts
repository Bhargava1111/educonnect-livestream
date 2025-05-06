
import { Database } from '@/integrations/supabase/types';

// Custom types that reference Supabase types
export type Tables = Database['public']['Tables'];
export type CourseRow = Tables['courses']['Row'];
export type ProfileRow = Tables['profiles']['Row'];
export type EnrollmentRow = Tables['enrollments']['Row'];
export type JobRow = Tables['jobs']['Row'];
export type EducationRow = Tables['education']['Row'];
export type EnrollmentFormRow = Tables['enrollment_forms']['Row'];
export type StudentActivityRow = Tables['student_activities']['Row'];

// Export existing types from the previous implementation for backwards compatibility
export const COURSES_KEY = 'career_aspire_courses';
export const JOBS_KEY = 'career_aspire_jobs';
export const ENROLLMENTS_KEY = 'career_aspire_enrollments';
export const ENROLLMENT_FORMS_KEY = 'career_aspire_enrollment_forms';
export const STUDENT_DATA_KEY = 'career_aspire_student_data';
export const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activities';
export const PAYMENTS_KEY = 'career_aspire_payments';

// Legacy types for backward compatibility
export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  price: number;
  level: string;
  students?: number;
  ratings?: number;
  instructor: string;
  status: string;
  category: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  curriculum?: CourseModule[];
  roadmap?: RoadmapPhase[];
}

export interface CourseModule {
  id: string;
  title: string;
  topics: {
    id: string;
    title: string;
  }[];
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  topics: string[];
  projects: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: string;
  progress: number;
  completed?: boolean;
  certificateIssued?: boolean;
  lastAccessedDate?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  appliedCount?: number;
  createdAt: string;
  lastDate?: string;
  jobType?: string;
  experienceLevel?: string;
  status: 'Open' | 'Closed' | 'Filled';
  postedAt: string;
  type: string;
  externalLink?: string;
  category?: string;
  applicationLink?: string;
}

export interface EnrollmentForm {
  id: string;
  studentId: string;
  formType: 'course' | 'job';
  relatedId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  aadharNumber: string;
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
  certificateId?: string;
  certificateUrl?: string;
  photographUrl?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface EducationDetail {
  institutionName: string;
  boardOrUniversity: string;
  yearOfPassing: string;
  percentage: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  registrationDate: string;
  enrolledCourses?: string[];
  skills?: string[];
  education?: {
    tenth?: {
      school: string;
      percentage: string;
      yearOfCompletion: string;
    };
    twelfth?: {
      school: string;
      percentage: string;
      yearOfCompletion: string;
    };
    degree?: {
      university: string;
      course: string;
      percentage: string;
      yearOfCompletion: string;
    };
    highest?: string;
  };
  aadharNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface StudentActivity {
  id: string;
  studentId: string;
  type: 'login' | 'logout' | 'enrollment' | 'course_progress' | 'assessment' | 'job_application';
  context: Record<string, any>;
  timestamp: string;
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

export interface Placement {
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  position: string;
  packageAmount: string;
  placementDate: string;
  description?: string;
  testimonial?: string;
  year: string;
  courseCompleted: string;
  imageUrl?: string;
  salary?: string;
}

// Utility type to convert Supabase table types to application types
export function mapCourseRowToCourse(row: CourseRow): Course {
  return {
    id: row.id.toString(),
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    duration: row.duration,
    price: Number(row.price),
    level: row.level,
    instructor: row.instructor,
    status: row.status,
    category: row.category,
    imageUrl: row.image_url || undefined,
    isFeatured: row.is_featured || false,
    isPublished: row.is_published || true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    topics: row.topics || [],
    curriculum: [], // This would need to be populated separately
    roadmap: [] // This would need to be populated separately
  };
}

export function mapJobRowToJob(row: JobRow): Job {
  return {
    id: row.id.toString(),
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    requirements: row.requirements || [],
    salary: row.salary,
    appliedCount: row.applied_count || 0,
    createdAt: row.posted_at,
    lastDate: row.deadline_date || undefined,
    status: row.status as 'Open' | 'Closed' | 'Filled',
    postedAt: row.posted_at,
    type: row.type,
    externalLink: row.external_link || undefined,
    category: row.category || undefined,
    applicationLink: row.application_link || undefined
  };
}

export function mapEnrollmentRowToEnrollment(row: EnrollmentRow): Enrollment {
  return {
    id: row.id.toString(),
    studentId: row.student_id.toString(),
    courseId: row.course_id.toString(),
    enrollmentDate: row.enrollment_date,
    status: row.status,
    progress: row.progress,
    completed: row.completed || false,
    certificateIssued: row.certificate_issued || false,
    lastAccessedDate: row.last_accessed_date || undefined
  };
}
