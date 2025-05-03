
import { Job, JOBS_KEY, STUDENT_ACTIVITY_KEY } from './types';

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
        status: 'Open',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        externalLink: 'https://example.com/apply',
        category: 'Information Technology'
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
        status: 'Open',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        externalLink: 'https://example.com/apply',
        category: 'Information Technology'
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
    return !hasExpired && (job.status === 'Open');
  });
};

export const getJobById = (id: string): Job | undefined => {
  const jobs = getAllJobs();
  return jobs.find(job => job.id === id);
};

export const getJobsByCategory = (category: string): Job[] => {
  const jobs = getActiveJobs();
  return jobs.filter(job => job.category === category);
};

export const createJob = (job: Omit<Job, 'id'>): Job => {
  const jobs = getAllJobs();
  const newJob: Job = {
    ...job,
    id: `job_${Date.now()}`,
    postedAt: job.postedAt || new Date().toISOString(),
    createdAt: job.createdAt || new Date().toISOString(),
    appliedCount: job.appliedCount || 0,
    status: (job.status as 'Open' | 'Closed' | 'Filled') || 'Open',
    type: job.type || 'Full-time'
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

// Function to handle job application
export const applyForJob = (jobId: string, studentId: string): { success: boolean; url?: string } => {
  // Increment the application count
  const success = incrementJobApplyCount(jobId);
  
  if (!success) {
    return { success: false };
  }
  
  // Get the job and return the external application URL if available
  const job = getJobById(jobId);
  
  // Track student activity
  if (studentId) {
    try {
      const activityData = {
        id: `activity_${Date.now()}`,
        studentId: studentId,
        type: 'job_application',
        context: { jobId },
        timestamp: new Date().toISOString()
      };
      
      // Save activity to localStorage
      const activities = localStorage.getItem(STUDENT_ACTIVITY_KEY);
      const activityArray = activities ? JSON.parse(activities) : [];
      activityArray.push(activityData);
      localStorage.setItem(STUDENT_ACTIVITY_KEY, JSON.stringify(activityArray));
    } catch (error) {
      console.error("Error tracking student activity:", error);
    }
  }
  
  return { 
    success: true,
    url: job?.externalLink || job?.applicationLink
  };
};

// Export jobs as CSV
export const exportJobsAsCSV = (): string => {
  const jobs = getAllJobs();
  
  // CSV header
  let csv = 'ID,Title,Company,Location,Type,Status,Requirements,Salary,Posted Date,Last Date\n';
  
  // Add rows
  jobs.forEach(job => {
    const requirements = job.requirements.join('; ').replace(/,/g, ' ');
    csv += `${job.id},${job.title},${job.company},${job.location},${job.type},${job.status},${requirements},${job.salary},${job.postedAt},${job.lastDate || 'N/A'}\n`;
  });
  
  return csv;
};
