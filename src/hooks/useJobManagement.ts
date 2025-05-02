
import React, { useState, useEffect } from 'react';
import { getAllJobs, createJob, updateJob, deleteJob, Job } from '@/lib/jobService';
import { useToast } from './use-toast';

// Type for job form data
export interface JobFormData {
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  requirements: string[];
  lastDate: string;
  jobType: string;
  experienceLevel: string;
  status: string;
  externalLink?: string;
  category?: string;
}

export const useJobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    requirements: [],
    lastDate: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    status: 'Active',
    externalLink: '',
    category: ''
  });

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = () => {
      const jobsList = getAllJobs();
      setJobs(jobsList);
    };

    fetchJobs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add requirement to list
  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  // Remove requirement from list
  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Open edit modal with job data
  const openEditModal = (job: Job) => {
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      salary: job.salary || '',
      requirements: [...job.requirements],
      lastDate: job.lastDate || '',
      jobType: job.jobType || 'Full-time',
      experienceLevel: job.experienceLevel || 'Mid',
      status: job.status || 'Active',
      externalLink: job.externalLink || '',
      category: job.category || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle add job submission
  const handleAddJob = () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.company || !formData.description || !formData.location) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const newJob = createJob({
        ...formData,
        createdAt: new Date().toISOString()
      });

      setJobs(prev => [...prev, newJob]);
      setIsAddModalOpen(false);
      resetForm();

      toast({
        title: "Job Created",
        description: "The job posting has been successfully created."
      });
    } catch (error) {
      console.error("Error adding job:", error);
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit job submission
  const handleEditJob = () => {
    try {
      const jobToUpdate = jobs.find(job => job.title === formData.title && job.company === formData.company);
      
      if (!jobToUpdate) {
        toast({
          title: "Error",
          description: "Job not found.",
          variant: "destructive",
        });
        return;
      }

      const updatedJob = updateJob(jobToUpdate.id, formData);

      if (updatedJob) {
        setJobs(prev => prev.map(job => job.id === jobToUpdate.id ? updatedJob : job));
        setIsEditModalOpen(false);
        resetForm();

        toast({
          title: "Job Updated",
          description: "The job posting has been successfully updated."
        });
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete job
  const handleDeleteJob = (jobId: string) => {
    try {
      const success = deleteJob(jobId);

      if (success) {
        setJobs(prev => prev.filter(job => job.id !== jobId));

        toast({
          title: "Job Deleted",
          description: "The job posting has been successfully deleted."
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      salary: '',
      requirements: [],
      lastDate: '',
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      status: 'Active',
      externalLink: '',
      category: ''
    });
    setRequirementInput('');
  };

  return {
    jobs,
    formData,
    requirementInput,
    isAddModalOpen,
    isEditModalOpen,
    setRequirementInput,
    setIsAddModalOpen,
    setIsEditModalOpen,
    handleInputChange,
    handleSelectChange,
    addRequirement,
    removeRequirement,
    handleAddJob,
    handleEditJob,
    handleDeleteJob,
    openEditModal,
    resetForm
  };
};

export default useJobManagement;
