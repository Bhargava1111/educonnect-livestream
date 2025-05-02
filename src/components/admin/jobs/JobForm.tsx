
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFormData } from '@/hooks/useJobManagement';

interface JobFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitLabel: string;
  formData: JobFormData;
  requirementInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onRequirementInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddRequirement: () => void;
  onRemoveRequirement: (index: number) => void;
}

export const JobForm: React.FC<JobFormProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
  formData,
  requirementInput,
  onInputChange,
  onSelectChange,
  onRequirementInputChange,
  onAddRequirement,
  onRemoveRequirement
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                onChange={onInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value) => onSelectChange('jobType', value)}
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
                onValueChange={(value) => onSelectChange('experienceLevel', value)}
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastDate">Last Date to Apply</Label>
              <Input
                id="lastDate"
                name="lastDate"
                type="date"
                value={formData.lastDate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalLink">External Application Link</Label>
              <Input
                id="externalLink"
                name="externalLink"
                type="url"
                placeholder="https://example.com/apply"
                value={formData.externalLink || ''}
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status || 'Active'} 
              onValueChange={(value) => onSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={requirementInput}
                onChange={onRequirementInputChange}
                placeholder="Add a requirement"
                onKeyDown={(e) => e.key === 'Enter' && onAddRequirement()}
              />
              <Button type="button" onClick={onAddRequirement} variant="outline">
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
                    onClick={() => onRemoveRequirement(index)}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
