
import { Enrollment, ENROLLMENTS_KEY, EmailNotification, EMAIL_NOTIFICATIONS_KEY } from './types';
import { getCourseById, updateCourse } from './courseService';

// Initialize enrollments
const initializeEnrollmentsIfNeeded = (): Enrollment[] => {
  const existingEnrollments = localStorage.getItem(ENROLLMENTS_KEY);
  
  if (existingEnrollments) {
    return JSON.parse(existingEnrollments);
  } else {
    const defaultEnrollments: Enrollment[] = [];
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(defaultEnrollments));
    return defaultEnrollments;
  }
};

// Email notification functions
export const createEmailNotification = (notification: Omit<EmailNotification, 'id' | 'sentDate' | 'status'>): EmailNotification => {
  const notifications = getAllEmailNotifications();
  
  const newNotification: EmailNotification = {
    ...notification,
    id: `notification_${Date.now()}`,
    sentDate: new Date().toISOString(),
    status: 'pending'
  };
  
  notifications.push(newNotification);
  localStorage.setItem(EMAIL_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  // In a real-world scenario, this would trigger an actual email sending process
  console.log(`Email notification created: ${newNotification.subject} to ${newNotification.to}`);
  
  // Simulate sending the email
  setTimeout(() => {
    updateEmailNotificationStatus(newNotification.id, 'sent');
  }, 2000);
  
  return newNotification;
};

export const updateEmailNotificationStatus = (id: string, status: 'sent' | 'failed' | 'pending'): void => {
  const notifications = getAllEmailNotifications();
  const index = notifications.findIndex(notification => notification.id === id);
  
  if (index !== -1) {
    notifications[index].status = status;
    localStorage.setItem(EMAIL_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
};

export const getAllEmailNotifications = (): EmailNotification[] => {
  const notifications = localStorage.getItem(EMAIL_NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

// Enrollment management
export const getAllEnrollments = (): Enrollment[] => {
  return initializeEnrollmentsIfNeeded();
};

export const getEnrollmentsByStudentId = (studentId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.studentId === studentId);
};

export const getEnrollmentsByCourseId = (courseId: string): Enrollment[] => {
  const enrollments = getAllEnrollments();
  return enrollments.filter(enrollment => enrollment.courseId === courseId);
};

export const createEnrollment = (studentId: string, courseId: string): Enrollment => {
  const enrollments = getAllEnrollments();
  
  const existingEnrollment = enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId
  );
  
  if (existingEnrollment) {
    return existingEnrollment;
  }
  
  const newEnrollment: Enrollment = {
    id: `enrollment_${Date.now()}`,
    studentId,
    courseId,
    enrollmentDate: new Date().toISOString(),
    progress: 0,
    completed: false,
    certificateIssued: false
  };
  
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  
  const course = getCourseById(courseId);
  if (course) {
    updateCourse(courseId, { 
      students: (course.students || 0) + 1 
    });
    
    // Send email notification
    const student = getStudentById(studentId);
    
    if (student && course) {
      // Create email notification for admin
      createEmailNotification({
        to: "info@careeraspiretechnology.com",
        subject: `New Enrollment: ${course.title}`,
        body: `
Student ID: ${studentId}
Student Name: ${student.name || 'N/A'}
Student Email: ${student.email || 'N/A'}
Course: ${course.title}
Enrollment Date: ${new Date().toLocaleString()}
        `,
        type: 'enrollment',
        relatedId: newEnrollment.id
      });
    }
  }
  
  return newEnrollment;
};

// Helper function to get student info
const getStudentById = (studentId: string) => {
  try {
    const students = localStorage.getItem('career_aspire_users');
    if (students) {
      const parsedStudents = JSON.parse(students);
      return parsedStudents.find((s: any) => s.id === studentId);
    }
  } catch (error) {
    console.error("Error fetching student information:", error);
  }
  return null;
};

export const updateEnrollmentProgress = (
  enrollmentId: string, 
  progress: number
): Enrollment | undefined => {
  const enrollments = getAllEnrollments();
  const index = enrollments.findIndex(enrollment => enrollment.id === enrollmentId);
  
  if (index !== -1) {
    const isCompleted = progress >= 100;
    
    enrollments[index] = { 
      ...enrollments[index], 
      progress, 
      completed: isCompleted,
      ...(isCompleted && { certificateIssued: true })
    };
    
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return enrollments[index];
  }
  
  return undefined;
};

// Export enrollment data as CSV
export const exportEnrollmentsAsCSV = (): string => {
  const enrollments = getAllEnrollments();
  
  // CSV header
  let csv = 'ID,Student ID,Student Name,Student Email,Course ID,Course Name,Enrollment Date,Progress,Completed,Certificate Issued\n';
  
  // Add rows
  enrollments.forEach(enrollment => {
    const student = getStudentById(enrollment.studentId);
    const course = getCourseById(enrollment.courseId);
    
    csv += `${enrollment.id},${enrollment.studentId},${student?.name || 'N/A'},${student?.email || 'N/A'},${enrollment.courseId},${course?.title || 'N/A'},${enrollment.enrollmentDate},${enrollment.progress}%,${enrollment.completed ? 'Yes' : 'No'},${enrollment.certificateIssued ? 'Yes' : 'No'}\n`;
  });
  
  return csv;
};
