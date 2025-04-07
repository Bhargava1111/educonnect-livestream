
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useJobManagement } from '@/hooks/useJobManagement';
import { JobForm } from '@/components/admin/jobs/JobForm';
import { JobTable } from '@/components/admin/jobs/JobTable';

const AdminJobs = () => {
  const {
    jobs,
    formData,
    requirementInput,
    isAddModalOpen,
    isEditModalOpen,
    setRequirementInput,
    setIsAddModalOpen,
    setIsEditModalOpen,
    handleInputChange,
    handleSelectChange,
    addRequirement,
    removeRequirement,
    handleAddJob,
    handleEditJob,
    handleDeleteJob,
    openEditModal
  } = useJobManagement();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Job Listings</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <JobTable 
            jobs={jobs}
            onEdit={openEditModal}
            onDelete={handleDeleteJob}
          />
        </CardContent>
      </Card>
      
      {isAddModalOpen && (
        <JobForm
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddJob}
          title="Add New Job"
          submitLabel="Add Job"
          formData={formData}
          requirementInput={requirementInput}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onRequirementInputChange={(e) => setRequirementInput(e.target.value)}
          onAddRequirement={addRequirement}
          onRemoveRequirement={removeRequirement}
        />
      )}
      
      {isEditModalOpen && (
        <JobForm
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditJob}
          title="Edit Job"
          submitLabel="Update Job"
          formData={formData}
          requirementInput={requirementInput}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onRequirementInputChange={(e) => setRequirementInput(e.target.value)}
          onAddRequirement={addRequirement}
          onRemoveRequirement={removeRequirement}
        />
      )}
    </div>
  );
};

export default AdminJobs;
