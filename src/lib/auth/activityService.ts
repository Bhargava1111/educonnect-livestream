
import { STUDENT_ACTIVITY_KEY } from './utils';

// Activity tracking interfaces
interface StudentActivity {
  id: string;
  studentId: string;
  action: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface StudentLoginRecord {
  timestamp: string;
  device: string;
}

// Function to track student activity
export const trackStudentActivity = (
  studentId: string,
  action: string,
  details?: Record<string, any>
): void => {
  try {
    const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
    const activityArray: StudentActivity[] = activities ? JSON.parse(activities) : [];
    
    const newActivity: StudentActivity = {
      id: `activity_${Date.now()}`,
      studentId,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    
    activityArray.push(newActivity);
    localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify(activityArray));
  } catch (error) {
    console.error("Error tracking student activity:", error);
  }
};

// Function to get student activities
export const getStudentActivity = (studentId: string): StudentActivity[] => {
  try {
    const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
    const activityArray: StudentActivity[] = activities ? JSON.parse(activities) : [];
    
    return activityArray.filter(activity => activity.studentId === studentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Error getting student activities:", error);
    return [];
  }
};

// Function to track student login
export const trackStudentLogin = (studentId: string, device: string = "Unknown device"): void => {
  try {
    const key = `student_login_history_${studentId}`;
    const loginHistory = localStorage.getItem(key);
    const historyArray: StudentLoginRecord[] = loginHistory ? JSON.parse(loginHistory) : [];
    
    const newLogin: StudentLoginRecord = {
      timestamp: new Date().toISOString(),
      device
    };
    
    historyArray.push(newLogin);
    localStorage.setItem(key, JSON.stringify(historyArray));
    
    // Also track as an activity
    trackStudentActivity(studentId, "Logged in", { device });
  } catch (error) {
    console.error("Error tracking student login:", error);
  }
};

// Function to get student login history
export const getStudentLoginHistory = (studentId: string): StudentLoginRecord[] => {
  try {
    const key = `student_login_history_${studentId}`;
    const loginHistory = localStorage.getItem(key);
    const historyArray: StudentLoginRecord[] = loginHistory ? JSON.parse(loginHistory) : [];
    
    return historyArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Error getting student login history:", error);
    return [];
  }
};

// Function to get student total active time
export const getStudentTotalActiveTime = (studentId: string): number => {
  try {
    const key = `student_active_time_${studentId}`;
    const activeTime = localStorage.getItem(key);
    return activeTime ? parseInt(activeTime, 10) : 0;
  } catch (error) {
    console.error("Error getting student active time:", error);
    return 0;
  }
};

// Function to increment student active time
export const incrementStudentActiveTime = (studentId: string, seconds: number = 60): void => {
  try {
    const key = `student_active_time_${studentId}`;
    const currentActiveTime = getStudentTotalActiveTime(studentId);
    const newActiveTime = currentActiveTime + seconds;
    localStorage.setItem(key, newActiveTime.toString());
    
    // Update last active timestamp
    localStorage.setItem(`student_last_active_${studentId}`, new Date().toISOString());
  } catch (error) {
    console.error("Error incrementing student active time:", error);
  }
};

// Function to get student last active time
export const getStudentLastActiveTime = (studentId: string): string | null => {
  try {
    const key = `student_last_active_${studentId}`;
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error getting student last active time:", error);
    return null;
  }
};

// Function to format active time in hours and minutes
export const formatActiveTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
};
