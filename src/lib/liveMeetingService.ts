
import { LiveMeeting, LIVE_MEETINGS_KEY } from './types';

// Initialize live meetings if not present
const initializeLiveMeetingsIfNeeded = (): LiveMeeting[] => {
  const existingMeetings = localStorage.getItem(LIVE_MEETINGS_KEY);
  
  if (existingMeetings) {
    return JSON.parse(existingMeetings);
  } else {
    const defaultMeetings: LiveMeeting[] = [];
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(defaultMeetings));
    return defaultMeetings;
  }
};

// Live Meeting CRUD operations
export const getAllLiveMeetings = (): LiveMeeting[] => {
  return initializeLiveMeetingsIfNeeded();
};

export const getLiveMeetingsByCourseId = (courseId: string): LiveMeeting[] => {
  const meetings = getAllLiveMeetings();
  return meetings.filter(meeting => meeting.courseId === courseId);
};

export const createLiveMeeting = (meeting: Omit<LiveMeeting, 'id'>): LiveMeeting => {
  const meetings = getAllLiveMeetings();
  const newMeeting = {
    ...meeting,
    id: `meeting_${Date.now()}`,
  };
  
  meetings.push(newMeeting);
  localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
  return newMeeting;
};

export const updateLiveMeeting = (id: string, updatedMeeting: Partial<LiveMeeting>): LiveMeeting | undefined => {
  const meetings = getAllLiveMeetings();
  const index = meetings.findIndex(meeting => meeting.id === id);
  
  if (index !== -1) {
    meetings[index] = { ...meetings[index], ...updatedMeeting };
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(meetings));
    return meetings[index];
  }
  
  return undefined;
};

export const deleteLiveMeeting = (id: string): boolean => {
  const meetings = getAllLiveMeetings();
  const filteredMeetings = meetings.filter(meeting => meeting.id !== id);
  
  if (filteredMeetings.length < meetings.length) {
    localStorage.setItem(LIVE_MEETINGS_KEY, JSON.stringify(filteredMeetings));
    return true;
  }
  
  return false;
};
