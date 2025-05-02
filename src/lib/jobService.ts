
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
        experienceLevel: 'Mid',
        status: 'Active',
        externalLink: 'https://example.com/apply'
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
        experienceLevel: 'Senior',
        status: 'Active',
        externalLink: 'https://example.com/apply'
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

export const getActiveJobs = (): Job[] => {
  const jobs = getAllJobs();
  return jobs.filter(job => {
    const hasExpired = job.lastDate && new Date(job.lastDate) < new Date();
    return !hasExpired && (job.status !== 'Inactive');
  });
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
    createdAt: job.createdAt || new Date().toISOString(),
    appliedCount: job.appliedCount || 0,
    status: job.status || 'Active'
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

// Function to track job application clicks
export const incrementJobApplyCount = (id: string): boolean => {
  const jobs = getAllJobs();
  const index = jobs.findIndex(job => job.id === id);
  
  if (index !== -1) {
    const currentCount = jobs[index].appliedCount || 0;
    jobs[index].appliedCount = currentCount + 1;
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return true;
  }
  
  return false;
};

// Export job data as CSV
export const exportJobsAsCSV = (): string => {
  const jobs = getAllJobs();
  
  // CSV header
  let csv = 'ID,Title,Company,Location,Salary,Job Type,Experience Level,Last Date,Applied Count,Status\n';
  
  // Add rows
  jobs.forEach(job => {
    csv += `${job.id},"${job.title}","${job.company}","${job.location}","${job.salary || 'N/A'}","${job.jobType || 'N/A'}","${job.experienceLevel || 'N/A'}","${job.lastDate || 'N/A'}",${job.appliedCount || 0},"${job.status || 'Active'}"\n`;
  });
  
  return csv;
};
