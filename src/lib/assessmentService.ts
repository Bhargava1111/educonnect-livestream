
import { Assessment, ASSESSMENTS_KEY, Question, AssessmentQuestion } from './types';

// Assessment CRUD operations
export const getAllAssessments = (): Assessment[] => {
  const assessments = localStorage.getItem(ASSESSMENTS_KEY);
  return assessments ? JSON.parse(assessments) : [];
};

export const getAssessmentsByCourseId = (courseId: string): Assessment[] => {
  const assessments = getAllAssessments();
  return assessments.filter(assessment => assessment.courseId === courseId);
};

export const getAssessmentById = (id: string): Assessment | undefined => {
  const assessments = getAllAssessments();
  return assessments.find(assessment => assessment.id === id);
};

export const createAssessment = (assessment: Omit<Assessment, 'id'>): Assessment => {
  const assessments = getAllAssessments();
  const newAssessment = {
    ...assessment,
    id: `assessment_${Date.now()}`,
    questions: assessment.questions || []
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

// Helper function to create question
export const createQuestion = (
  text: string, 
  options: string[], 
  correctAnswerIndex: number,
  points: number = 10,
  type: 'multiple-choice' | 'true-false' | 'short_answer' = 'multiple-choice'
): AssessmentQuestion => {
  return {
    id: `question_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    text: text,
    question: text, // Legacy field
    options,
    correctAnswer: options[correctAnswerIndex],
    marks: points,
    type: type === 'multiple-choice' ? 'multiple-choice' : 
          type === 'true-false' ? 'true-false' : 'descriptive'
  };
};

// Track student assessment attempts
export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  submissionDate: string;
  score: number;
  passed: boolean;
  answers: Record<string, any>;
  recordingUrl?: string;
  screenShareUrl?: string;
}

const ASSESSMENT_ATTEMPTS_KEY = 'career_aspire_assessment_attempts';

export const getStudentAssessmentAttempts = (studentId: string, assessmentId?: string): AssessmentAttempt[] => {
  const attempts = localStorage.getItem(ASSESSMENT_ATTEMPTS_KEY);
  const parsedAttempts: AssessmentAttempt[] = attempts ? JSON.parse(attempts) : [];
  
  return parsedAttempts.filter(attempt => 
    attempt.studentId === studentId && 
    (assessmentId ? attempt.assessmentId === assessmentId : true)
  );
};

export const saveAssessmentAttempt = (attempt: Omit<AssessmentAttempt, 'id'>): AssessmentAttempt => {
  const attempts = localStorage.getItem(ASSESSMENT_ATTEMPTS_KEY);
  const parsedAttempts: AssessmentAttempt[] = attempts ? JSON.parse(attempts) : [];
  
  const newAttempt: AssessmentAttempt = {
    ...attempt,
    id: `attempt_${Date.now()}`
  };
  
  parsedAttempts.push(newAttempt);
  localStorage.setItem(ASSESSMENT_ATTEMPTS_KEY, JSON.stringify(parsedAttempts));
  
  return newAttempt;
};

// Initialize with default assessments if none exist
export const initializeAssessments = (): void => {
  const existingAssessments = localStorage.getItem(ASSESSMENTS_KEY);
  
  if (!existingAssessments) {
    const defaultAssessments: Assessment[] = [
      {
        id: 'assessment_python_basics',
        courseId: 'course_python',
        title: 'Python Basics Assessment',
        description: 'Test your understanding of Python fundamentals',
        questions: [
          {
            id: 'q1_python',
            text: 'What is the output of the following code?',
            question: 'What is the output of the following code?',
            options: ['6', '8', '9', '5'],
            correctAnswer: '8',
            type: 'multiple-choice',
            marks: 10
          },
          {
            id: 'q2_python',
            text: 'Which of the following is used to create a list in Python?',
            question: 'Which of the following is used to create a list in Python?',
            options: ['{}', '[]', '()', '<>'],
            correctAnswer: '[]',
            type: 'multiple-choice',
            marks: 10
          },
          {
            id: 'q3_python',
            text: 'What is the correct file extension for Python files?',
            question: 'What is the correct file extension for Python files?',
            options: ['.py', '.pt', '.pyth', '.p'],
            correctAnswer: '.py',
            type: 'multiple-choice',
            marks: 10
          }
        ],
        timeLimit: 30,
        passingMarks: 70,
        totalMarks: 30,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'assessment_web_dev',
        courseId: 'course_web_dev',
        title: 'HTML & CSS Fundamentals',
        description: 'Test your knowledge of web development basics',
        questions: [
          {
            id: 'q1_web',
            text: 'Which HTML tag is used to create a hyperlink?',
            question: 'Which HTML tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: '<a>',
            type: 'multiple-choice',
            marks: 10
          },
          {
            id: 'q2_web',
            text: 'Which CSS property is used to change the text color?',
            question: 'Which CSS property is used to change the text color?',
            options: ['text-color', 'font-color', 'color', 'foreground-color'],
            correctAnswer: 'color',
            type: 'multiple-choice',
            marks: 10
          }
        ],
        timeLimit: 20,
        passingMarks: 70,
        totalMarks: 20,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(defaultAssessments));
  }
};

// Initialize the assessments if needed
initializeAssessments();
