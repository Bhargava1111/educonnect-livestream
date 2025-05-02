
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search } from 'lucide-react';
import { useJobManagement } from '@/hooks/useJobManagement';
import { JobForm } from '@/components/admin/jobs/JobForm';
import { JobTable } from '@/components/admin/jobs/JobTable';
import { exportJobsAsCSV } from '@/lib/jobService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter jobs based on search term and category
  const filteredJobs = jobs.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || job.category === filterCategory)
  );

  // Get unique categories
  const categories = Array.from(new Set(jobs.map(job => job.category).filter(Boolean)));

  // Handle CSV export
  const handleExportCSV = () => {
    const csvData = exportJobsAsCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'jobs_export.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Job Listings</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Search jobs..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-64">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category || ''}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <JobTable 
            jobs={filteredJobs}
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
