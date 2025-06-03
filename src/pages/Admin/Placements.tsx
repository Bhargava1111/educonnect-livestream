
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search } from 'lucide-react';
import { PlacementTable } from '@/components/admin/placements/PlacementTable';
import { PlacementForm } from '@/components/admin/placements/PlacementForm';
import { Placement } from '@/lib/types';
import { 
  getAllPlacements, 
  createPlacement, 
  updatePlacement, 
  deletePlacement
} from '@/lib/placementService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPlacements = () => {
  const { toast } = useToast();
  const [placements, setPlacements] = useState<Placement[]>(getAllPlacements());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPlacement, setEditPlacement] = useState<Placement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');

  // Get unique years for filtering
  const years = Array.from(new Set(placements.map(placement => placement.year).filter(Boolean)));

  // Filter placements based on search term and year
  const filteredPlacements = placements.filter(placement => 
    (placement.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterYear === 'all' || placement.year === filterYear)
  );

  // Handle CSV export
  const handleExportCSV = () => {
    const headers = [
      'Student Name',
      'Company',
      'Position',
      'Package',
      'Placement Date',
      'Course',
      'Year',
      'Description',
      'Testimonial'
    ];
    
    const csvData = filteredPlacements.map(placement => [
      placement.studentName,
      placement.company,
      placement.position,
      placement.packageAmount || placement.salary,
      new Date(placement.placementDate).toLocaleDateString(),
      placement.courseCompleted || placement.course,
      placement.year,
      placement.description?.replace(/,/g, ';') || '',
      placement.testimonial?.replace(/,/g, ';') || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'placements_export.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddPlacement = (placementData: Omit<Placement, 'id'>) => {
    try {
      const newPlacement = createPlacement(placementData);
      setPlacements([newPlacement, ...placements]);
      
      toast({
        title: "Placement Added",
        description: `${newPlacement.studentName}'s placement has been added.`
      });
      
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding placement:", error);
      
      toast({
        title: "Error",
        description: "Failed to add placement record.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (placement: Placement) => {
    setEditPlacement(placement);
    setIsEditModalOpen(true);
  };

  const handleEditPlacement = (updatedData: Partial<Placement>) => {
    if (!editPlacement) return;

    try {
      const updated = updatePlacement(editPlacement.id, updatedData);
      
      if (updated) {
        setPlacements(placements.map(p => p.id === updated.id ? updated : p));
        
        toast({
          title: "Placement Updated",
          description: `${updated.studentName}'s placement has been updated.`
        });
        
        setIsEditModalOpen(false);
        setEditPlacement(null);
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

  const handleDeletePlacement = (id: string) => {
    try {
      const success = deletePlacement(id);
      
      if (success) {
        setPlacements(placements.filter(p => p.id !== id));
        
        toast({
          title: "Placement Deleted",
          description: "Placement record has been removed."
        });
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
            onEdit={openEditModal}
            onDelete={handleDeletePlacement}
          />
        </CardContent>
      </Card>
      
      {isAddModalOpen && (
        <PlacementForm
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPlacement}
          title="Add New Placement"
          submitLabel="Add Placement"
        />
      )}
      
      {isEditModalOpen && editPlacement && (
        <PlacementForm
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditPlacement(null);
          }}
          onSubmit={handleEditPlacement}
          title="Edit Placement"
          submitLabel="Update Placement"
          defaultValues={editPlacement}
        />
      )}
    </div>
  );
};

export default AdminPlacements;
