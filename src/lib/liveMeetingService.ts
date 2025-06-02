
// Re-export everything from the new service for backward compatibility
export * from './services/liveMeetingService';

// Legacy function mappings for existing code
import { 
  getAllLiveMeetings as getAll,
  createLiveMeeting as create,
  updateLiveMeeting as update,
  deleteLiveMeeting as remove,
  getMeetingsByCourse
} from './services/liveMeetingService';

export const getAllMeetings = getAll;
export const createMeeting = create;
export const updateMeeting = update;
export const deleteMeeting = remove;
export { getMeetingsByCourse };

// Add the missing updateMeetingStatuses function
export const updateMeetingStatuses = () => {
  // This was a localStorage-based function, now it's handled by the database
  console.log('Meeting statuses are automatically managed by the database');
};
