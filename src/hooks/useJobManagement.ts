
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
  status?: 'Active' | 'Inactive' | 'Draft';
  externalLink?: string;
  category?: string;
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
  requirements: [],
  status: 'Active',
  externalLink: '',
  category: '',
};

export const useJobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [requirementInput, setRequirementInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadJobs();
  }, []);
  
  const loadJobs = () => {
    setIsLoading(true);
    try {
      const allJobs = getAllJobs();
      setJobs(allJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load job listings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
    } else if (name === 'status') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as 'Active' | 'Inactive' | 'Draft' 
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast({ title: "Error", description: "Job title is required", variant: "destructive" });
        return;
      }
      if (!formData.company.trim()) {
        toast({ title: "Error", description: "Company name is required", variant: "destructive" });
        return;
      }
      if (!formData.description.trim()) {
        toast({ title: "Error", description: "Job description is required", variant: "destructive" });
        return;
      }
      
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
      console.error("Error adding job:", error);
      toast({
        title: "Error",
        description: "Failed to add job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditJob = () => {
    if (!selectedJob) return;
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast({ title: "Error", description: "Job title is required", variant: "destructive" });
        return;
      }
      if (!formData.company.trim()) {
        toast({ title: "Error", description: "Company name is required", variant: "destructive" });
        return;
      }
      if (!formData.description.trim()) {
        toast({ title: "Error", description: "Job description is required", variant: "destructive" });
        return;
      }
      
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
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setIsLoading(true);
      try {
        deleteJob(jobId);
        
        toast({
          title: "Job Deleted",
          description: "The job has been deleted successfully."
        });
        
        loadJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
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
      requirements: job.requirements || [],
      status: job.status || 'Active',
      externalLink: job.externalLink || '',
      category: job.category || ''
    });
    setIsEditModalOpen(true);
  };
  
  const exportJobsToCSV = () => {
    try {
      const { exportJobsAsCSV } = require('@/lib/jobService');
      const csvContent = exportJobsAsCSV();
      
      // Create a blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Job listings have been exported to CSV."
      });
    } catch (error) {
      console.error("Error exporting jobs:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export job listings. Please try again.",
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
    selectedJob,
    isLoading,
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
    resetForm,
    exportJobsToCSV
  };
};
