
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAllJobs, createJob, updateJob, deleteJob, Job } from "@/lib/jobService";

export type JobFormData = {
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  lastDate: string;
  requirements: string[];
};

export const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  description: '',
  salary: '',
  jobType: 'Full-time',
  experienceLevel: 'Entry',
  lastDate: '',
  requirements: []
};

export const useJobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [requirementInput, setRequirementInput] = useState('');
  
  useEffect(() => {
    loadJobs();
  }, []);
  
  const loadJobs = () => {
    const allJobs = getAllJobs();
    setJobs(allJobs);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'jobType') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote' 
      }));
    } else if (name === 'experienceLevel') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'Entry' | 'Mid' | 'Senior' 
      }));
    }
  };
  
  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };
  
  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setRequirementInput('');
  };
  
  const handleAddJob = () => {
    try {
      const newJob = createJob({
        ...formData,
        createdAt: new Date().toISOString(),
        appliedCount: 0
      });
      
      toast({
        title: "Job Added",
        description: `${newJob.title} has been added successfully.`
      });
      
      resetForm();
      setIsAddModalOpen(false);
      loadJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditJob = () => {
    if (!selectedJob) return;
    
    try {
      updateJob(selectedJob.id, formData);
      
      toast({
        title: "Job Updated",
        description: `${formData.title} has been updated successfully.`
      });
      
      setSelectedJob(null);
      resetForm();
      setIsEditModalOpen(false);
      loadJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        deleteJob(jobId);
        
        toast({
          title: "Job Deleted",
          description: "The job has been deleted successfully."
        });
        
        loadJobs();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openEditModal = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary || '',
      jobType: job.jobType || 'Full-time',
      experienceLevel: job.experienceLevel || 'Entry',
      lastDate: job.lastDate || '',
      requirements: job.requirements || []
    });
    setIsEditModalOpen(true);
  };

  return {
    jobs,
    formData,
    requirementInput,
    isAddModalOpen,
    isEditModalOpen,
    selectedJob,
    setFormData,
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
