
import { EnrollmentForm, ENROLLMENT_FORMS_KEY } from './types';

// Initialize enrollment forms storage
const initializeEnrollmentForms = (): EnrollmentForm[] => {
  const existingForms = localStorage.getItem(ENROLLMENT_FORMS_KEY);
  
  if (existingForms) {
    return JSON.parse(existingForms);
  } else {
    const defaultForms: EnrollmentForm[] = [];
    localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(defaultForms));
    return defaultForms;
  }
};

// Get all enrollment forms
export const getAllEnrollmentForms = (): EnrollmentForm[] => {
  return initializeEnrollmentForms();
};

// Get enrollment forms by student ID
export const getEnrollmentFormsByStudentId = (studentId: string): EnrollmentForm[] => {
  const forms = getAllEnrollmentForms();
  return forms.filter(form => form.studentId === studentId);
};

// Get enrollment forms by related ID (course or job)
export const getEnrollmentFormsByRelatedId = (relatedId: string): EnrollmentForm[] => {
  const forms = getAllEnrollmentForms();
  return forms.filter(form => form.relatedId === relatedId);
};

// Get enrollment form by ID
export const getEnrollmentFormById = (formId: string): EnrollmentForm | undefined => {
  const forms = getAllEnrollmentForms();
  return forms.find(form => form.id === formId);
};

// Create a new enrollment form
export const createEnrollmentForm = (formData: Omit<EnrollmentForm, 'id' | 'submittedAt' | 'status'>): EnrollmentForm => {
  const forms = getAllEnrollmentForms();
  
  const newForm: EnrollmentForm = {
    ...formData,
    id: `form_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  forms.push(newForm);
  localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(forms));
  
  return newForm;
};

// Update an enrollment form
export const updateEnrollmentForm = (formId: string, formData: Partial<EnrollmentForm>): EnrollmentForm | undefined => {
  const forms = getAllEnrollmentForms();
  const index = forms.findIndex(form => form.id === formId);
  
  if (index !== -1) {
    forms[index] = {
      ...forms[index],
      ...formData
    };
    
    localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(forms));
    return forms[index];
  }
  
  return undefined;
};

// Delete an enrollment form
export const deleteEnrollmentForm = (formId: string): boolean => {
  const forms = getAllEnrollmentForms();
  const filteredForms = forms.filter(form => form.id !== formId);
  
  if (filteredForms.length < forms.length) {
    localStorage.setItem(ENROLLMENT_FORMS_KEY, JSON.stringify(filteredForms));
    return true;
  }
  
  return false;
};

// Change enrollment form status
export const updateEnrollmentFormStatus = (
  formId: string, 
  status: 'pending' | 'approved' | 'rejected'
): EnrollmentForm | undefined => {
  return updateEnrollmentForm(formId, { status });
};

// Export enrollment forms as CSV
export const exportEnrollmentFormsAsCSV = (): string => {
  const forms = getAllEnrollmentForms();
  
  // CSV header
  let csv = 'ID,Student ID,Form Type,Related ID,Submitted Date,Status,First Name,Last Name,Email,Phone,Date of Birth\n';
  
  // Add rows
  forms.forEach(form => {
    csv += `${form.id},${form.studentId},${form.formType},${form.relatedId},${form.submittedAt},${form.status},${form.firstName},${form.lastName},${form.email},${form.phone},${form.dateOfBirth}\n`;
  });
  
  return csv;
};
