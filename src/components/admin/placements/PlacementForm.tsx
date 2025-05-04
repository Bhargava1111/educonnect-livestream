
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Placement } from '@/lib/types';

interface PlacementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  submitLabel: string;
  formData: Partial<Placement>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PlacementForm: React.FC<PlacementFormProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
  formData,
  onInputChange
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
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName || ''}
                onChange={onInputChange}
                placeholder="Enter student name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId || ''}
                onChange={onInputChange}
                placeholder="Enter student ID"
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
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={onInputChange}
                placeholder="Enter job position"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="packageAmount">Package Amount</Label>
              <Input
                id="packageAmount"
                name="packageAmount"
                value={formData.packageAmount || ''}
                onChange={onInputChange}
                placeholder="e.g. 4.5 LPA"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="placementDate">Placement Date</Label>
              <Input
                id="placementDate"
                name="placementDate"
                type="date"
                value={formData.placementDate?.split('T')[0] || ''}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseCompleted">Course Completed</Label>
              <Input
                id="courseCompleted"
                name="courseCompleted"
                value={formData.courseCompleted || ''}
                onChange={onInputChange}
                placeholder="Enter course name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                value={formData.year || ''}
                onChange={onInputChange}
                placeholder="Enter placement year"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Student/Company Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={onInputChange}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary || ''}
                onChange={onInputChange}
                placeholder="Enter salary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={onInputChange}
              placeholder="Enter placement description"
              className="h-20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="testimonial">Student Testimonial</Label>
            <Textarea
              id="testimonial"
              name="testimonial"
              value={formData.testimonial || ''}
              onChange={onInputChange}
              placeholder="Enter student testimonial"
              className="h-20"
            />
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
