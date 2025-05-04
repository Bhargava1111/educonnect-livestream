
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/lib/jobService';

interface JobFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  submitLabel: string;
  formData: Partial<Job>;
  requirementInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onRequirementInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddRequirement: () => void;
  onRemoveRequirement: (requirement: string) => void;
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={onInputChange}
                placeholder="Enter job title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company || ''}
                onChange={onInputChange}
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={onInputChange}
                placeholder="Enter job location"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary || ''}
                onChange={onInputChange}
                placeholder="e.g. 6-9 LPA"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={onInputChange}
                placeholder="Enter job category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastDate">Last Date to Apply</Label>
              <Input
                id="lastDate"
                name="lastDate"
                type="date"
                value={formData.lastDate || ''}
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select 
                value={formData.jobType || 'Full-time'} 
                onValueChange={(value) => onSelectChange('jobType', value)}
              >
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select 
                value={formData.experienceLevel || 'Entry'} 
                onValueChange={(value) => onSelectChange('experienceLevel', value)}
              >
                <SelectTrigger id="experienceLevel">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry">Entry</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'Open'} 
                onValueChange={(value) => onSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select job status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Filled">Filled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="externalLink">External Application Link (Optional)</Label>
              <Input
                id="externalLink"
                name="externalLink"
                value={formData.externalLink || ''}
                onChange={onInputChange}
                placeholder="https://example.com/apply"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={onInputChange}
              placeholder="Enter job description"
              className="h-24"
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Requirements</Label>
              <div className="flex gap-2">
                <Input
                  value={requirementInput}
                  onChange={onRequirementInputChange}
                  placeholder="Add a requirement"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddRequirement())}
                />
                <Button type="button" onClick={onAddRequirement}>
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requirements?.map((req, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {req}
                  <button
                    type="button"
                    onClick={() => onRemoveRequirement(req)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
