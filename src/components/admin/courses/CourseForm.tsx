
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseFormProps {
  formData: {
    title: string;
    description: string;
    duration: string;
    price: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor: string;
    imageUrl: string;
    status?: 'Active' | 'Inactive' | 'Coming Soon';
    category?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: 'Beginner' | 'Intermediate' | 'Advanced' | 'Active' | 'Inactive' | 'Coming Soon') => void;
  handleSubmit: () => void;
  handleCancel: () => void;
  submitLabel: string;
  title: string;
  description: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
  handleCancel,
  submitLabel,
  title,
  description
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  placeholder="e.g. 12 weeks" 
                  value={formData.duration} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') => handleSelectChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || 'Active'} 
                  onValueChange={(value: 'Active' | 'Inactive' | 'Coming Soon') => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input 
                  id="instructor" 
                  name="instructor" 
                  value={formData.instructor} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category" 
                  value={formData.category || ''} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Web Development" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleInputChange} 
                placeholder="URL to course image" 
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={formData.imageUrl} 
                    alt="Course Preview" 
                    className="w-full max-h-40 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400';
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseForm;
