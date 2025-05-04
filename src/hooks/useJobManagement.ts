
import { useState } from 'react';
import { Job, createJob, getAllJobs, updateJob, deleteJob } from '@/lib/jobService';
import { useToast } from '@/hooks/use-toast';

export const useJobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(() => getAllJobs());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    salary: '',
    jobType: 'Full-time',
    experienceLevel: 'Entry',
    status: 'Open',
    category: 'Information Technology',
    lastDate: '',
    externalLink: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: [],
      salary: '',
      jobType: 'Full-time',
      experienceLevel: 'Entry',
      status: 'Open',
      category: 'Information Technology',
      lastDate: '',
      externalLink: ''
    });
    setRequirementInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter(r => r !== requirement) || []
    }));
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Force type assertion since we know we're providing all required fields
      const newJob = createJob(formData as Omit<Job, 'id'>);
      
      setJobs([newJob, ...jobs]);
      
      toast({
        title: "Job Created",
        description: `${newJob.title} job listing has been created.`
      });
      
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding job:", error);
      
      toast({
        title: "Error",
        description: "Failed to create job listing.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (job: Job) => {
    setFormData(job);
    setIsEditModalOpen(true);
  };

  const handleEditJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Invalid job ID.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedJob = updateJob(formData.id, formData);
      
      if (updatedJob) {
        setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
        
        toast({
          title: "Job Updated",
          description: `${updatedJob.title} has been updated.`
        });
        
        setIsEditModalOpen(false);
        resetForm();
      } else {
        throw new Error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      
      toast({
        title: "Error",
        description: "Failed to update job listing.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteJob = (id: string) => {
    try {
      const success = deleteJob(id);
      
      if (success) {
        setJobs(jobs.filter(job => job.id !== id));
        
        toast({
          title: "Job Deleted",
          description: "Job listing has been removed."
        });
      } else {
        throw new Error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      
      toast({
        title: "Error",
        description: "Failed to delete job listing.",
        variant: "destructive"
      });
    }
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
