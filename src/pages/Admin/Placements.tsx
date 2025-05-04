
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search } from 'lucide-react';
import { PlacementTable } from '@/components/admin/placements/PlacementTable';
import { PlacementForm } from '@/components/admin/placements/PlacementForm';
import { 
  Placement, 
  getAllPlacements,
  addPlacement,
  updatePlacement,
  deletePlacement,
  exportPlacementsAsCSV
} from '@/lib/placementService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPlacements = () => {
  const { toast } = useToast();
  const [placements, setPlacements] = useState<Placement[]>(() => getAllPlacements());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Placement>>({
    studentName: '',
    studentId: '',
    company: '',
    position: '',
    packageAmount: '',
    placementDate: new Date().toISOString().split('T')[0],
    description: '',
    year: new Date().getFullYear().toString(),
    testimonial: '',
    imageUrl: '',
    courseCompleted: '',
    salary: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');

  // Reset form data
  const resetForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      company: '',
      position: '',
      packageAmount: '',
      placementDate: new Date().toISOString().split('T')[0],
      description: '',
      year: new Date().getFullYear().toString(),
      testimonial: '',
      imageUrl: '',
      courseCompleted: '',
      salary: ''
    });
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Open edit modal
  const handleEdit = (placement: Placement) => {
    setFormData(placement);
    setIsEditModalOpen(true);
  };
  
  // Add new placement
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newPlacement = addPlacement(formData as Omit<Placement, 'id'>);
      setPlacements([newPlacement, ...placements]);
      
      toast({
        title: "Placement Added",
        description: `${newPlacement.studentName}'s placement record has been added.`
      });
      
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding placement:", error);
      
      toast({
        title: "Error",
        description: "Failed to add placement record.",
        variant: "destructive"
      });
    }
  };
  
  // Update existing placement
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Invalid placement ID.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updated = updatePlacement(formData.id, formData);
      
      if (updated) {
        setPlacements(placements.map(p => p.id === updated.id ? updated : p));
        
        toast({
          title: "Placement Updated",
          description: `${updated.studentName}'s placement record has been updated.`
        });
        
        setIsEditModalOpen(false);
        resetForm();
      } else {
        throw new Error("Failed to update placement record");
      }
    } catch (error) {
      console.error("Error updating placement:", error);
      
      toast({
        title: "Error",
        description: "Failed to update placement record.",
        variant: "destructive"
      });
    }
  };
  
  // Delete placement
  const handleDelete = (id: string) => {
    try {
      const success = deletePlacement(id);
      
      if (success) {
        setPlacements(placements.filter(p => p.id !== id));
        
        toast({
          title: "Placement Deleted",
          description: "Placement record has been removed."
        });
      } else {
        throw new Error("Failed to delete placement record");
      }
    } catch (error) {
      console.error("Error deleting placement:", error);
      
      toast({
        title: "Error",
        description: "Failed to delete placement record.",
        variant: "destructive"
      });
    }
  };
  
  // Export CSV
  const handleExportCSV = () => {
    const csvData = exportPlacementsAsCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'placements_export.csv');
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Get unique years for filter
  const years = Array.from(new Set(placements.map(p => p.year).filter(Boolean)));
  
  // Filter placements based on search term and year
  const filteredPlacements = placements.filter(placement => 
    (placement.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.position?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterYear === 'all' || placement.year === filterYear)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Placements</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Placement
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Search placements..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-64">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year || ''}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <PlacementTable 
            placements={filteredPlacements}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      
      {/* Add Placement Modal */}
      {isAddModalOpen && (
        <PlacementForm
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAdd}
          title="Add New Placement"
          submitLabel="Add Placement"
          formData={formData}
          onInputChange={handleInputChange}
        />
      )}
      
      {/* Edit Placement Modal */}
      {isEditModalOpen && (
        <PlacementForm
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
          title="Edit Placement"
          submitLabel="Update Placement"
          formData={formData}
          onInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default AdminPlacements;
