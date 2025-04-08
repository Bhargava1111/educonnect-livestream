
import { Assessment, ASSESSMENTS_KEY, Question } from './types';

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
  type: 'multiple-choice' | 'coding' | 'essay' = 'multiple-choice'
): Question => {
  return {
    id: `question_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    text,
    options,
    correctAnswerIndex,
    points,
    type
  };
};

// Initialize with default assessments if none exist
export const initializeAssessments = (): void => {
  const existingAssessments = localStorage.getItem(ASSESSMENTS_KEY);
  
  if (!existingAssessments) {
    const defaultAssessments: Assessment[] = [];
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(defaultAssessments));
  }
};
