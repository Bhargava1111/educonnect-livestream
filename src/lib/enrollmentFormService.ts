
import { EnrollmentForm, ENROLLMENT_FORMS_KEY } from './types';

// Initialize enrollment forms if not present
const initializeEnrollmentFormsIfNeeded = (): EnrollmentForm[] => {
  const existingForms = localStorage.getItem(ENROLLMENT_FORMS_KEY);
  
  if (existingForms) {
    return JSON.parse(existingForms);
  } else {
    const defaultForms: EnrollmentForm[] = [];
    localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(defaultForms));
    return defaultForms;
  }
};

// Enrollment form CRUD operations
export const getAllEnrollmentForms = (): EnrollmentForm[] => {
  return initializeEnrollmentFormsIfNeeded();
};

export const getEnrollmentFormById = (id: string): EnrollmentForm | undefined => {
  const forms = getAllEnrollmentForms();
  return forms.find(form => form.id === id);
};

export const getEnrollmentFormsByStudentId = (studentId: string): EnrollmentForm[] => {
  const forms = getAllEnrollmentForms();
  return forms.filter(form => form.studentId === studentId);
};

export const getEnrollmentFormsByRelatedId = (relatedId: string): EnrollmentForm[] => {
  const forms = getAllEnrollmentForms();
  return forms.filter(form => form.relatedId === relatedId);
};

export const submitEnrollmentForm = async (form: Omit<EnrollmentForm, 'id'>): Promise<EnrollmentForm> => {
  // Simulate async API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const forms = getAllEnrollmentForms();
      
      const newForm: EnrollmentForm = {
        ...form,
        id: `enrollment_form_${Date.now()}`
      };
      
      forms.push(newForm);
      localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(forms));
      
      // Track this as activity
      try {
        const activityData = {
          id: `activity_${Date.now()}`,
          studentId: form.studentId,
          type: form.formType === 'course' ? 'course_enrollment' : 'job_application',
          context: { relatedId: form.relatedId },
          timestamp: new Date().toISOString()
        };
        
        // Save activity to localStorage if we have a STUDENT_ACTIVITY_KEY constant
        const STUDENT_ACTIVITY_KEY = 'career_aspire_student_activities';
        const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
        const activityArray = activities ? JSON.parse(activities) : [];
        activityArray.push(activityData);
        localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify(activityArray));
      } catch (error) {
        console.error("Error tracking student activity:", error);
      }
      
      resolve(newForm);
    }, 500); // Simulate network delay
  });
};

export const updateEnrollmentFormStatus = (
  id: string, 
  status: 'pending' | 'approved' | 'rejected'
): EnrollmentForm | undefined => {
  const forms = getAllEnrollmentForms();
  const index = forms.findIndex(form => form.id === id);
  
  if (index !== -1) {
    forms[index] = { ...forms[index], status };
    localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(forms));
    return forms[index];
  }
  
  return undefined;
};

export const deleteEnrollmentForm = (id: string): boolean => {
  const forms = getAllEnrollmentForms();
  const filteredForms = forms.filter(form => form.id !== id);
  
  if (filteredForms.length < forms.length) {
    localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(filteredForms));
    return true;
  }
  
  return false;
};
