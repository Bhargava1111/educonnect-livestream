
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
}

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
