
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAllPlacements, createPlacement, updatePlacement, deletePlacement, Placement } from "@/lib/courseManagement";
import { Plus, Edit, Trash } from 'lucide-react';

const AdminPlacements = () => {
  const { toast } = useToast();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    company: '',
    position: '',
    year: new Date().getFullYear(),
    salary: '',
    testimonial: '',
    courseCompleted: ''
  });
  
  useEffect(() => {
    loadPlacements();
  }, []);
  
  const loadPlacements = () => {
    const allPlacements = getAllPlacements();
    setPlacements(allPlacements);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      studentName: '',
      company: '',
      position: '',
      year: new Date().getFullYear(),
      salary: '',
      testimonial: '',
      courseCompleted: ''
    });
  };
  
  const handleAddPlacement = () => {
    try {
      const newPlacement = createPlacement({
        ...formData,
        year: Number(formData.year)
      });
      
      toast({
        title: "Placement Added",
        description: `${newPlacement.studentName}'s placement record has been added successfully.`
      });
      
      resetForm();
      setIsAddModalOpen(false);
      loadPlacements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add placement record. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditPlacement = () => {
    if (!selectedPlacement) return;
    
    try {
      updatePlacement(selectedPlacement.id, {
        ...formData,
        year: Number(formData.year)
      });
      
      toast({
        title: "Placement Updated",
        description: `${formData.studentName}'s placement record has been updated successfully.`
      });
      
      setSelectedPlacement(null);
      resetForm();
      setIsEditModalOpen(false);
      loadPlacements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update placement record. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeletePlacement = (placementId: string) => {
    if (confirm("Are you sure you want to delete this placement record?")) {
      try {
        deletePlacement(placementId);
        
        toast({
          title: "Placement Deleted",
          description: "The placement record has been deleted successfully."
        });
        
        loadPlacements();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete placement record. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openEditModal = (placement: Placement) => {
    setSelectedPlacement(placement);
    setFormData({
      studentName: placement.studentName,
      company: placement.company,
      position: placement.position,
      year: placement.year,
      salary: placement.salary,
      testimonial: placement.testimonial || '',
      courseCompleted: placement.courseCompleted
    });
    setIsEditModalOpen(true);
  };
  
  const PlacementForm = ({ onSubmit, onCancel, title, submitLabel }: any) => (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill out the form below to {submitLabel === "Add Placement" ? "create a new placement record" : "update the placement record"}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
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
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary/Package</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="e.g. 6 LPA"
                value={formData.salary}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCompleted">Course Completed</Label>
              <Input
                id="courseCompleted"
                name="courseCompleted"
                value={formData.courseCompleted}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="testimonial">Testimonial</Label>
            <Textarea
              id="testimonial"
              name="testimonial"
              rows={4}
              value={formData.testimonial}
              onChange={handleInputChange}
              placeholder="Student testimonial (optional)"
            />
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
        <h1 className="text-2xl font-bold">Manage Placement Records</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Placement Record
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Course Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No placement records found. Add a new record to get started.</TableCell>
                </TableRow>
              ) : (
                placements.map((placement) => (
                  <TableRow key={placement.id}>
                    <TableCell className="font-medium">{placement.studentName}</TableCell>
                    <TableCell>{placement.company}</TableCell>
                    <TableCell>{placement.position}</TableCell>
                    <TableCell>{placement.year}</TableCell>
                    <TableCell>{placement.salary}</TableCell>
                    <TableCell>{placement.courseCompleted}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditModal(placement)}
                          title="Edit Placement"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePlacement(placement.id)}
                          title="Delete Placement"
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
        <PlacementForm
          onSubmit={handleAddPlacement}
          onCancel={() => setIsAddModalOpen(false)}
          title="Add New Placement Record"
          submitLabel="Add Placement"
        />
      )}
      
      {isEditModalOpen && (
        <PlacementForm
          onSubmit={handleEditPlacement}
          onCancel={() => setIsEditModalOpen(false)}
          title="Edit Placement Record"
          submitLabel="Update Placement"
        />
      )}
    </div>
  );
};

export default AdminPlacements;
