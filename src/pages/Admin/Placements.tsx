import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllStudents } from '@/lib/studentAuth';
import { addPlacement, getAllPlacements, updatePlacement, deletePlacement } from '@/lib/placementService';
import { Placement } from '@/lib/types';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus } from 'lucide-react';

const AdminPlacementsPage = () => {
  const { toast } = useToast();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isAddingPlacement, setIsAddingPlacement] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    company: '',
    position: '',
    packageAmount: '',
    placementDate: new Date().toISOString().split('T')[0],
    description: '',
    testimonial: '',
    imageUrl: ''
  });
  const [studentNames, setStudentNames] = useState<{ [key: string]: string }>({});
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [editFormData, setEditFormData] = useState({
    company: '',
    position: '',
    packageAmount: '',
    placementDate: new Date().toISOString().split('T')[0],
    description: '',
    testimonial: '',
    imageUrl: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPlacements();
    fetchStudentNames();
  }, []);

  const fetchPlacements = () => {
    const placementsData = getAllPlacements();
    setPlacements(placementsData);
  };

  const fetchStudentNames = () => {
    const students = getAllStudents();
    const names: { [key: string]: string } = {};
    students.forEach(student => {
      names[student.id] = `${student.firstName} ${student.lastName}`;
    });
    setStudentNames(names);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.company || !formData.position || !formData.packageAmount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newPlacement: Omit<Placement, 'id'> = {
      studentId: formData.studentId,
      company: formData.company,
      position: formData.position,
      packageAmount: formData.packageAmount.toString(), // Convert to string
      placementDate: formData.placementDate,
      description: formData.description || '',
      testimonial: formData.testimonial || '',
      imageUrl: formData.imageUrl || '',
      studentName: studentNames[formData.studentId] || 'Unknown Student'
    };
    
    const result = addPlacement(newPlacement);
    
    if (result) {
      toast({
        title: "Success",
        description: "Placement record added successfully."
      });
      setFormData({
        studentId: '',
        company: '',
        position: '',
        packageAmount: '',
        placementDate: new Date().toISOString().split('T')[0],
        description: '',
        testimonial: '',
        imageUrl: ''
      });
      setIsAddingPlacement(false);
      fetchPlacements();
    } else {
      toast({
        title: "Error",
        description: "Failed to add placement record.",
        variant: "destructive"
      });
    }
  };

  const handleOpenEditModal = (placement: Placement) => {
    setEditingPlacement(placement);
    setEditFormData({
      company: placement.company,
      position: placement.position,
      packageAmount: placement.packageAmount,
      placementDate: placement.placementDate,
      description: placement.description || '',
      testimonial: placement.testimonial || '',
      imageUrl: placement.imageUrl || ''
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPlacement(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPlacement) return;
    
    const updatedPlacement: Placement = {
      ...editingPlacement,
      company: editFormData.company,
      position: editFormData.position,
      packageAmount: editFormData.packageAmount.toString(), // Convert to string
      placementDate: editFormData.placementDate,
      description: editFormData.description || '',
      testimonial: editFormData.testimonial || '',
      imageUrl: editFormData.imageUrl || ''
    };
    
    const result = updatePlacement(updatedPlacement.id, updatedPlacement);
    
    if (result) {
      toast({
        title: "Success",
        description: "Placement record updated successfully."
      });
      fetchPlacements();
      handleCloseEditModal();
    } else {
      toast({
        title: "Error",
        description: "Failed to update placement record.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlacement = (id: string) => {
    const result = deletePlacement(id);
    if (result) {
      toast({
        title: "Success",
        description: "Placement record deleted successfully."
      });
      fetchPlacements();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete placement record.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Placements Management</CardTitle>
            <Button onClick={() => setIsAddingPlacement(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Placement
            </Button>
          </div>
          <CardDescription>Manage student placements</CardDescription>
        </CardHeader>
        <CardContent>
          {isAddingPlacement && (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="studentId">Student</Label>
                <select
                  id="studentId"
                  name="studentId"
                  onChange={handleChange}
                  value={formData.studentId}
                  className="w-full border rounded-md py-2 px-3"
                >
                  <option value="">Select Student</option>
                  {Object.entries(studentNames).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="packageAmount">Package Amount</Label>
                <Input
                  type="number"
                  id="packageAmount"
                  name="packageAmount"
                  value={formData.packageAmount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Placement Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.placementDate && "text-muted-foreground"
                      )}
                    >
                      {formData.placementDate ? format(new Date(formData.placementDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.placementDate ? new Date(formData.placementDate) : undefined}
                      onSelect={(date) => date ? handleChange({ target: { name: 'placementDate', value: date.toISOString().split('T')[0] } } as any : null}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="testimonial">Testimonial</Label>
                <Input
                  type="textarea"
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setIsAddingPlacement(false)}>Cancel</Button>
                <Button type="submit">Add Placement</Button>
              </div>
            </form>
          )}

          {!isAddingPlacement && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placements.map((placement) => (
                    <TableRow key={placement.id}>
                      <TableCell>{studentNames[placement.studentId] || 'Unknown'}</TableCell>
                      <TableCell>{placement.company}</TableCell>
                      <TableCell>{placement.position}</TableCell>
                      <TableCell>{placement.packageAmount}</TableCell>
                      <TableCell>{new Date(placement.placementDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(placement)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePlacement(placement.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Placement Modal */}
      {isEditModalOpen && editingPlacement && (
        <div className="fixed inset-0 z-50 overflow-auto bg-zinc-500/50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Placement</h2>
            <form onSubmit={handleEditSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={editFormData.company}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  type="text"
                  id="position"
                  name="position"
                  value={editFormData.position}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label htmlFor="packageAmount">Package Amount</Label>
                <Input
                  type="number"
                  id="packageAmount"
                  name="packageAmount"
                  value={editFormData.packageAmount}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label>Placement Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editFormData.placementDate && "text-muted-foreground"
                      )}
                    >
                      {editFormData.placementDate ? format(new Date(editFormData.placementDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editFormData.placementDate ? new Date(editFormData.placementDate) : undefined}
                      onSelect={(date) => date ? handleEditChange({ target: { name: 'placementDate', value: date.toISOString().split('T')[0] } } as any : null}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label htmlFor="testimonial">Testimonial</Label>
                <Input
                  type="textarea"
                  id="testimonial"
                  name="testimonial"
                  value={editFormData.testimonial}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={editFormData.imageUrl}
                  onChange={handleEditChange}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={handleCloseEditModal}>Cancel</Button>
                <Button type="submit">Update Placement</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlacementsPage;
