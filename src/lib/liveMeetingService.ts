
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
        courseId: 'course_1',
        title: 'Introduction to Python Programming',
        description: 'Learn the fundamentals of Python programming including variables, data types, and basic syntax.',
        instructor: 'Dr. Smith',
        date: new Date().toLocaleDateString(),
        time: '14:00',
        duration: '60 minutes',
        link: 'https://meet.google.com/sample-meeting-1',
        status: 'upcoming'
      },
      {
        id: 'meeting_2',
        courseId: 'course_2',
        title: 'React Components & State Management',
        description: 'Deep dive into React components, props, state, and context API.',
        instructor: 'Jane Cooper',
        date: new Date(Date.now() + 86400000).toLocaleDateString(), // tomorrow
        time: '15:30',
        duration: '90 minutes',
        link: 'https://meet.google.com/sample-meeting-2',
        status: 'upcoming'
      },
      {
        id: 'meeting_3',
        courseId: 'course_3',
        title: 'Network Security Essentials',
        description: 'Understanding network vulnerabilities and protection mechanisms.',
        instructor: 'Robert Wilson',
        date: new Date(Date.now() + 172800000).toLocaleDateString(), // day after tomorrow
        time: '11:00',
        duration: '120 minutes',
        link: 'https://meet.google.com/sample-meeting-3',
        status: 'upcoming'
      },
      {
        id: 'meeting_4',
        courseId: 'course_1',
        title: 'Advanced Python: Working with APIs',
        description: 'Learn how to interact with RESTful APIs using Python requests library.',
        instructor: 'Dr. Smith',
        date: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
        time: '14:00',
        duration: '60 minutes',
        link: 'https://meet.google.com/sample-meeting-4',
        status: 'completed'
      },
      {
        id: 'meeting_5',
        courseId: 'course_2',
        title: 'Building a Full-Stack App with MERN',
        description: 'Hands-on workshop to build a complete application using MongoDB, Express, React, and Node.js.',
        instructor: 'Jane Cooper',
        date: new Date(Date.now() - 86400000).toLocaleDateString(), // yesterday
        time: '16:00',
        duration: '120 minutes',
        link: 'https://meet.google.com/sample-meeting-5',
        status: 'completed'
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
    const meetingDate = new Date(`${meeting.date} ${meeting.time}`);
    if (meeting.status === 'upcoming' && meetingDate < now) {
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
    const meetingDate = new Date(`${meeting.date} ${meeting.time}`);
    if (meeting.status === 'upcoming' && meetingDate < now) {
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
  return meetings.filter(meeting => meeting.status === 'upcoming');
};

// Get completed live meetings
export const getCompletedLiveMeetings = (): LiveMeeting[] => {
  const meetings = getAllLiveMeetings();
  return meetings.filter(meeting => meeting.status === 'completed');
};
