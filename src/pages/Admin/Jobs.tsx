
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllJobs, createJob, updateJob, deleteJob, Job } from "@/lib/courseManagement";
import { Plus, Edit, Trash } from 'lucide-react';

const AdminJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    jobType: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote',
    experienceLevel: 'Entry' as 'Entry' | 'Mid' | 'Senior',
    lastDate: '',
    requirements: [] as string[]
  });
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
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      salary: '',
      jobType: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote',
      experienceLevel: 'Entry' as 'Entry' | 'Mid' | 'Senior',
      lastDate: '',
      requirements: []
    });
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
  
  const JobForm = ({ onSubmit, onCancel, title, submitLabel }: any) => (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill out the form below to {submitLabel === "Add Job" ? "create a new job listing" : "update the job listing"}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="e.g. 6-10 LPA"
                value={formData.salary}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value) => handleSelectChange('jobType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select 
                value={formData.experienceLevel} 
                onValueChange={(value) => handleSelectChange('experienceLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry">Entry</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastDate">Last Date to Apply</Label>
            <Input
              id="lastDate"
              name="lastDate"
              type="date"
              value={formData.lastDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add a requirement"
              />
              <Button type="button" onClick={addRequirement} variant="outline">
                Add
              </Button>
            </div>
            <ul className="mt-2 space-y-1">
              {formData.requirements.map((req, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{req}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Job Listings</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Last Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No jobs found. Add a new job to get started.</TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.experienceLevel}</TableCell>
                    <TableCell>{job.salary}</TableCell>
                    <TableCell>{job.lastDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditModal(job)}
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          title="Delete Job"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {isAddModalOpen && (
        <JobForm
          onSubmit={handleAddJob}
          onCancel={() => setIsAddModalOpen(false)}
          title="Add New Job"
          submitLabel="Add Job"
        />
      )}
      
      {isEditModalOpen && (
        <JobForm
          onSubmit={handleEditJob}
          onCancel={() => setIsEditModalOpen(false)}
          title="Edit Job"
          submitLabel="Update Job"
        />
      )}
    </div>
  );
};

export default AdminJobs;

