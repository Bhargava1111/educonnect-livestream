
import { Job, JOBS_KEY } from './types';

// Initialize default jobs if not present
const initializeJobsIfNeeded = (): Job[] => {
  const existingJobs = localStorage.getItem(JOBS_KEY);
  
  if (existingJobs) {
    return JSON.parse(existingJobs);
  } else {
    const defaultJobs: Job[] = [
      {
        id: 'job_1',
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'Bangalore',
        description: 'We are looking for a skilled Frontend Developer to join our team.',
        requirements: ['React.js', 'JavaScript', 'CSS', 'HTML'],
        salary: '₹6-10 LPA',
        appliedCount: 45,
        createdAt: new Date().toISOString(),
        lastDate: '2024-02-15',
        jobType: 'Full-time',
        experienceLevel: '2-4 years',
        status: 'Active',
        externalLink: 'https://techcorp.com/careers',
        category: 'Technology',
        type: 'Full-time',
        postedDate: new Date().toISOString(),
        applicationDeadline: '2024-02-15',
        contactEmail: 'hr@techcorp.com',
        isActive: true,
        applicationLink: 'https://techcorp.com/apply'
      },
      {
        id: 'job_2',
        title: 'Backend Developer',
        company: 'StartupXYZ',
        location: 'Mumbai',
        description: 'Join our dynamic team as a Backend Developer working with cutting-edge technologies.',
        requirements: ['Node.js', 'MongoDB', 'Express.js', 'API Development'],
        salary: '₹7-12 LPA',
        appliedCount: 32,
        createdAt: new Date().toISOString(),
        lastDate: '2024-02-20',
        jobType: 'Full-time',
        experienceLevel: '1-3 years',
        status: 'Active',
        externalLink: 'https://startupxyz.com/careers',
        category: 'Technology',
        type: 'Full-time',
        postedDate: new Date().toISOString(),
        applicationDeadline: '2024-02-20',
        contactEmail: 'careers@startupxyz.com',
        isActive: true,
        applicationLink: 'https://startupxyz.com/apply'
      }
    ];
    
    localStorage.setItem(JOBS_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
};

// Job CRUD operations
export const getAllJobs = (): Job[] => {
  return initializeJobsIfNeeded();
};

export const getJobById = (id: string): Job | undefined => {
  const jobs = getAllJobs();
  return jobs.find(job => job.id === id);
};

export const getActiveJobs = (): Job[] => {
  const jobs = getAllJobs();
  return jobs.filter(job => job.isActive);
};

export const createJob = (job: Omit<Job, 'id'>): Job => {
  const jobs = getAllJobs();
  const newJob = {
    ...job,
    id: `job_${Date.now()}`,
    appliedCount: 0,
    createdAt: new Date().toISOString(),
    postedAt: new Date().toISOString()
  };
  
  jobs.push(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return newJob;
};

export const updateJob = (id: string, updatedJob: Partial<Job>): Job | undefined => {
  const jobs = getAllJobs();
  const index = jobs.findIndex(job => job.id === id);
  
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedJob };
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return jobs[index];
  }
  
  return undefined;
};

export const deleteJob = (id: string): boolean => {
  const jobs = getAllJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  
  if (filteredJobs.length < jobs.length) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
    return true;
  }
  
  return false;
};

export const incrementJobApplicationCount = (id: string): void => {
  const job = getJobById(id);
  if (job) {
    updateJob(id, { appliedCount: (job.appliedCount || 0) + 1 });
  }
};

export const applyForJob = (jobId: string, studentId: string): { success: boolean; url?: string } => {
  try {
    incrementJobApplicationCount(jobId);
    const job = getJobById(jobId);
    const applicationUrl = job?.applicationLink || job?.externalLink;
    
    return {
      success: true,
      url: applicationUrl
    };
  } catch (error) {
    console.error('Error applying for job:', error);
    return { success: false };
  }
};

export const getJobApplicationLink = (job: Job): string => {
  return job.applicationLink || job.externalLink || '#';
};

// Re-export Job type for components
export type { Job };
