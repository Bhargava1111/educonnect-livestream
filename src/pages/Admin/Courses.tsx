
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import CourseTable from '@/components/admin/courses/CourseTable';
import CourseForm from '@/components/admin/courses/CourseForm';
import { useCourseManagement, initialFormData } from '@/components/admin/courses/useCourseManagement';

const AdminCourses = () => {
  const {
    courses,
    formData,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    handleInputChange,
    handleSelectChange,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    openEditModal,
    loadCourses
  } = useCourseManagement();
  
  // Load all courses when the component mounts
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Course
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <CourseTable 
            courses={courses} 
            onEdit={openEditModal} 
            onDelete={handleDeleteCourse} 
          />
        </CardContent>
      </Card>
      
      {/* Add Course Modal */}
      {isAddModalOpen && (
        <CourseForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleAddCourse}
          handleCancel={() => setIsAddModalOpen(false)}
          submitLabel="Add Course"
          title="Add New Course"
          description="Create a new course for the platform"
        />
      )}
      
      {/* Edit Course Modal */}
      {isEditModalOpen && (
        <CourseForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleEditCourse}
          handleCancel={() => setIsEditModalOpen(false)}
          submitLabel="Update Course"
          title="Edit Course"
          description="Update course details"
        />
      )}
    </div>
  );
};

export default AdminCourses;
