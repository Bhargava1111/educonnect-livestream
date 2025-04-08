
import { Job, JOBS_KEY } from './types';

// Re-export the Job type
export type { Job };

// Initialize jobs if not present
const initializeJobsIfNeeded = (): Job[] => {
  const existingJobs = localStorage.getItem(JOBS_KEY);
  
  if (existingJobs) {
    return JSON.parse(existingJobs);
  } else {
    const defaultJobs: Job[] = [
      {
        id: 'job_1',
        title: 'Software QA Engineer',
        company: 'TechSolutions Inc',
        location: 'Bangalore, India',
        description: 'We are looking for a skilled QA Engineer to ensure the quality of our software products through manual and automated testing.',
        requirements: [
          'Knowledge of software testing methodologies',
          'Experience with test case creation and execution',
          'Familiarity with bug tracking tools',
          'Basic understanding of programming concepts'
        ],
        salary: '6-9 LPA',
        appliedCount: 12,
        createdAt: new Date().toISOString(),
        lastDate: '2023-12-31',
        jobType: 'Full-time',
        experienceLevel: 'Mid'
      },
      {
        id: 'job_2',
        title: 'Automation Test Engineer',
        company: 'Innovative Systems',
        location: 'Hyderabad, India',
        description: 'Join our QA team to develop and maintain automated test frameworks using Selenium and other modern testing tools.',
        requirements: [
          'Strong knowledge of Selenium WebDriver',
          'Experience with Java or Python for test automation',
          'Understanding of CI/CD pipelines',
          'Knowledge of API testing'
        ],
        salary: '10-15 LPA',
        appliedCount: 8,
        createdAt: new Date().toISOString(),
        lastDate: '2023-12-15',
        jobType: 'Full-time',
        experienceLevel: 'Senior'
      }
    ];
    localStorage.setItem(JOBS_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
};

// Jobs CRUD operations
export const getAllJobs = (): Job[] => {
  return initializeJobsIfNeeded();
};

export const getJobById = (id: string): Job | undefined => {
  const jobs = getAllJobs();
  return jobs.find(job => job.id === id);
};

export const createJob = (job: Omit<Job, 'id'>): Job => {
  const jobs = getAllJobs();
  const newJob = {
    ...job,
    id: `job_${Date.now()}`,
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
