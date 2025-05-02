
import { LiveMeeting, LIVE_MEETINGS_KEY } from './types';

// Initialize live meetings if not present
const initializeLiveMeetingsIfNeeded = (): LiveMeeting[] => {
  const existingMeetings = localStorage.getItem(LIVE_MEETINGS_KEY);
  
  if (existingMeetings) {
    return JSON.parse(existingMeetings);
  } else {
    // Create default sample meetings if none exist
    const defaultMeetings: LiveMeeting[] = [
      {
        id: 'meeting_1',
        title: 'Introduction to Python Programming',
        description: 'Learn the fundamentals of Python programming including variables, data types, and basic syntax.',
        courseId: 'course_1',
        scheduledDate: new Date().toLocaleDateString(),
        duration: '60 minutes',
        meetingLink: 'https://meet.google.com/sample-meeting-1',
        hostName: 'Dr. Smith',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meeting_2',
        title: 'React Components & State Management',
        description: 'Deep dive into React components, props, state, and context API.',
        courseId: 'course_2',
        scheduledDate: new Date(Date.now() + 86400000).toLocaleDateString(), // tomorrow
        duration: '90 minutes',
        meetingLink: 'https://meet.google.com/sample-meeting-2',
        hostName: 'Jane Cooper',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meeting_3',
        title: 'Network Security Essentials',
        description: 'Understanding network vulnerabilities and protection mechanisms.',
        courseId: 'course_3',
        scheduledDate: new Date(Date.now() + 172800000).toLocaleDateString(), // day after tomorrow
        duration: '120 minutes',
        meetingLink: 'https://meet.google.com/sample-meeting-3',
        hostName: 'Robert Wilson',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meeting_4',
        title: 'Advanced Python: Working with APIs',
        description: 'Learn how to interact with RESTful APIs using Python requests library.',
        courseId: 'course_1',
        scheduledDate: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
        duration: '60 minutes',
        meetingLink: 'https://meet.google.com/sample-meeting-4',
        hostName: 'Dr. Smith',
        status: 'completed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meeting_5',
        title: 'Building a Full-Stack App with MERN',
        description: 'Hands-on workshop to build a complete application using MongoDB, Express, React, and Node.js.',
        courseId: 'course_2',
        scheduledDate: new Date(Date.now() - 86400000).toLocaleDateString(), // yesterday
        duration: '120 minutes',
        meetingLink: 'https://meet.google.com/sample-meeting-5',
        hostName: 'Jane Cooper',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(defaultMeetings));
    return defaultMeetings;
  }
};

// Get all meetings without calling updateMeetingStatuses to prevent circular reference
const getMeetingsFromStorage = (): LiveMeeting[] => {
  return initializeLiveMeetingsIfNeeded();
};

// Live Meeting CRUD operations
export const getAllLiveMeetings = (): LiveMeeting[] => {
  const meetings = getMeetingsFromStorage();
  // Update statuses manually here instead of recursively calling
  const now = new Date();
  let updated = false;
  
  meetings.forEach(meeting => {
    const meetingDate = new Date(meeting.scheduledDate);
    if (meeting.status === 'scheduled' && meetingDate < now) {
      meeting.status = 'completed';
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
  }
  
  return meetings;
};

export const getLiveMeetingById = (id: string): LiveMeeting | undefined => {
  const meetings = getMeetingsFromStorage();
  return meetings.find(meeting => meeting.id === id);
};

export const getLiveMeetingsByCourseId = (courseId: string): LiveMeeting[] => {
  const meetings = getMeetingsFromStorage();
  return meetings.filter(meeting => meeting.courseId === courseId);
};

export const createLiveMeeting = (meeting: Omit<LiveMeeting, 'id'>): LiveMeeting => {
  const meetings = getMeetingsFromStorage();
  const newMeeting = {
    ...meeting,
    id: `meeting_${Date.now()}`,
  };
  
  meetings.push(newMeeting);
  localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
  return newMeeting;
};

export const updateLiveMeeting = (id: string, updatedMeeting: Partial<LiveMeeting>): LiveMeeting | undefined => {
  const meetings = getMeetingsFromStorage();
  const index = meetings.findIndex(meeting => meeting.id === id);
  
  if (index !== -1) {
    meetings[index] = { ...meetings[index], ...updatedMeeting };
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
    return meetings[index];
  }
  
  return undefined;
};

export const deleteLiveMeeting = (id: string): boolean => {
  const meetings = getMeetingsFromStorage();
  const filteredMeetings = meetings.filter(meeting => meeting.id !== id);
  
  if (filteredMeetings.length < meetings.length) {
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(filteredMeetings));
    return true;
  }
  
  return false;
};

// Utility function to mark meetings as completed based on date
export const updateMeetingStatuses = (): void => {
  const meetings = getMeetingsFromStorage();
  const now = new Date();
  let updated = false;
  
  meetings.forEach(meeting => {
    const meetingDate = new Date(meeting.scheduledDate);
    if (meeting.status === 'scheduled' && meetingDate < now) {
      meeting.status = 'completed';
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
  }
};

// Get upcoming live meetings
export const getUpcomingLiveMeetings = (): LiveMeeting[] => {
  const meetings = getAllLiveMeetings();
  return meetings.filter(meeting => meeting.status === 'scheduled');
};

// Get completed live meetings
export const getCompletedLiveMeetings = (): LiveMeeting[] => {
  const meetings = getAllLiveMeetings();
  return meetings.filter(meeting => meeting.status === 'completed');
};
