
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from 'lucide-react';
import CourseTable from '@/components/admin/courses/CourseTable';
import CourseForm from '@/components/admin/courses/CourseForm';
import { useCourseManagement, initialFormData } from '@/components/admin/courses/useCourseManagement';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAllCourses } from "@/lib/courseManagement";

const AdminCourses = () => {
  const { toast } = useToast();
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

  const [publicCoursesCount, setPublicCoursesCount] = useState(0);

  // Force load courses when the component mounts
  useEffect(() => {
    console.log("AdminCourses: Loading courses");
    loadCourses();
    
    // Count courses that are displayed on the public courses page
    const allCourses = getAllCourses();
    const activeCourses = allCourses.filter(course => 
      course.status === 'Active' || course.status === undefined
    );
    setPublicCoursesCount(activeCourses.length);
  }, [loadCourses]);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {publicCoursesCount} courses visible on public page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.open('/courses', '_blank')}>
            <FileText className="mr-2 h-4 w-4" />
            View Public Courses
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <AlertTitle>Course Management</AlertTitle>
        <AlertDescription>
          Courses with "Active" status will be displayed on the public courses page. 
          Use the status field to control course visibility.
        </AlertDescription>
      </Alert>
      
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
          description="Create a new course for the platform. Active courses will be visible on the public page."
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
          description="Update course details. Toggle status to control visibility on the public page."
        />
      )}
    </div>
  );
};

export default AdminCourses;
