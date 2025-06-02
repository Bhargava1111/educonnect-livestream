
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Placement } from '@/lib/types';

interface PlacementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Placement, 'id'>) => void;
  title: string;
  submitLabel: string;
  defaultValues?: Placement;
}

export const PlacementForm: React.FC<PlacementFormProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
  defaultValues
}) => {
  const [formData, setFormData] = useState<Omit<Placement, 'id'>>({
    studentId: defaultValues?.studentId || '',
    studentName: defaultValues?.studentName || '',
    company: defaultValues?.company || '',
    position: defaultValues?.position || '',
    packageAmount: defaultValues?.packageAmount || defaultValues?.salary || '',
    placementDate: defaultValues?.placementDate || new Date().toISOString().split('T')[0],
    description: defaultValues?.description || '',
    testimonial: defaultValues?.testimonial || '',
    year: defaultValues?.year || new Date().getFullYear().toString(),
    courseCompleted: defaultValues?.courseCompleted || '',
    imageUrl: defaultValues?.imageUrl || defaultValues?.image || '',
    salary: defaultValues?.salary || defaultValues?.packageAmount || '',
    course: defaultValues?.course || defaultValues?.courseCompleted || '',
    image: defaultValues?.image || defaultValues?.imageUrl || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Enter the placement details below. Click {submitLabel} when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="packageAmount">Package Amount</Label>
                <Input
                  id="packageAmount"
                  name="packageAmount"
                  value={formData.packageAmount}
                  onChange={handleChange}
                  placeholder="E.g. 5.5 LPA"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="placementDate">Placement Date</Label>
                <Input
                  id="placementDate"
                  name="placementDate"
                  type="date"
                  value={formData.placementDate.split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course">Course Completed</Label>
                <Input
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the placement"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="testimonial">Student Testimonial</Label>
              <Textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="Student testimonial about their experience"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL to company logo or student photo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
