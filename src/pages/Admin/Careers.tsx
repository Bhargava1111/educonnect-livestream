
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CareerOpportunity {
  id: string;
  title: string;
  description: string;
  requirements: string;
  applyUrl: string;
  createdAt: string;
}

const AdminCareers = () => {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>(() => {
    const saved = localStorage.getItem('career_opportunities');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<CareerOpportunity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    applyUrl: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      applyUrl: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveOpportunities = (newOpportunities: CareerOpportunity[]) => {
    localStorage.setItem('career_opportunities', JSON.stringify(newOpportunities));
    setOpportunities(newOpportunities);
  };

  const handleAddOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOpportunity: CareerOpportunity = {
      id: `opp_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    
    const newOpportunities = [newOpportunity, ...opportunities];
    saveOpportunities(newOpportunities);
    
    toast({
      title: "Career Opportunity Added",
      description: `${newOpportunity.title} has been added.`
    });
    
    setIsAddModalOpen(false);
    resetForm();
  };

  const openEditModal = (opportunity: CareerOpportunity) => {
    setCurrentOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      description: opportunity.description,
      requirements: opportunity.requirements,
      applyUrl: opportunity.applyUrl,
    });
    setIsEditModalOpen(true);
  };

  const handleEditOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOpportunity) return;
    
    const updatedOpportunity: CareerOpportunity = {
      ...currentOpportunity,
      ...formData,
    };
    
    const newOpportunities = opportunities.map(opp => 
      opp.id === updatedOpportunity.id ? updatedOpportunity : opp
    );
    
    saveOpportunities(newOpportunities);
    
    toast({
      title: "Career Opportunity Updated",
      description: `${updatedOpportunity.title} has been updated.`
    });
    
    setIsEditModalOpen(false);
    setCurrentOpportunity(null);
    resetForm();
  };

  const handleDeleteOpportunity = (id: string) => {
    const newOpportunities = opportunities.filter(opp => opp.id !== id);
    saveOpportunities(newOpportunities);
    
    toast({
      title: "Career Opportunity Deleted",
      description: "The opportunity has been removed."
    });
  };

  // Form component for add/edit operations
  const OpportunityForm = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    title, 
    submitLabel 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (e: React.FormEvent) => void; 
    title: string; 
    submitLabel: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Fill in the details for this career opportunity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="requirements">Requirements</label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="applyUrl">Application URL</label>
              <Input
                id="applyUrl"
                name="applyUrl"
                type="url"
                value={formData.applyUrl}
                onChange={handleInputChange}
                required
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Career Opportunities</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Opportunity
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No career opportunities found
                    </TableCell>
                  </TableRow>
                ) : (
                  opportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell className="font-medium">{opp.title}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {opp.description.length > 100 
                          ? opp.description.substring(0, 100) + '...' 
                          : opp.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(opp.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => openEditModal(opp)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => handleDeleteOpportunity(opp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {isAddModalOpen && (
        <OpportunityForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddOpportunity}
          title="Add Career Opportunity"
          submitLabel="Add Opportunity"
        />
      )}
      
      {isEditModalOpen && (
        <OpportunityForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentOpportunity(null);
            resetForm();
          }}
          onSubmit={handleEditOpportunity}
          title="Edit Career Opportunity"
          submitLabel="Update Opportunity"
        />
      )}
    </div>
  );
};

export default AdminCareers;
