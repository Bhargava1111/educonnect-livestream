
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  getAllCourses, createCourse, updateCourse, deleteCourse, Course
} from "@/lib/courseManagement";

export interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  imageUrl: string;
}

export const initialFormData: CourseFormData = {
  title: '',
  description: '',
  duration: '',
  price: 0,
  level: 'Beginner',
  instructor: '',
  imageUrl: ''
};

export function useCourseManagement() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  
  const loadCourses = useCallback(() => {
    const allCourses = getAllCourses();
    setCourses(allCourses);
  }, []);
  
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddCourse = () => {
    try {
      const newCourse = createCourse({
        ...formData,
        price: Number(formData.price),
        curriculum: [],
        level: formData.level
      });
      
      toast({
        title: "Course Added",
        description: `${newCourse.title} has been added successfully.`
      });
      
      // Reset form and close modal
      setFormData(initialFormData);
      setIsAddModalOpen(false);
      
      // Reload courses
      loadCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditCourse = () => {
    if (!selectedCourse) return;
    
    try {
      updateCourse(selectedCourse.id, {
        ...formData,
        price: Number(formData.price),
        level: formData.level
      });
      
      toast({
        title: "Course Updated",
        description: `${formData.title} has been updated successfully.`
      });
      
      // Reset and close modal
      setSelectedCourse(null);
      setIsEditModalOpen(false);
      
      // Reload courses
      loadCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        deleteCourse(courseId);
        
        toast({
          title: "Course Deleted",
          description: "The course has been deleted successfully."
        });
        
        // Reload courses
        loadCourses();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete course. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      price: course.price,
      level: course.level || 'Beginner',
      instructor: course.instructor || '',
      imageUrl: course.imageUrl || ''
    });
    setIsEditModalOpen(true);
  };

  return {
    courses,
    formData,
    setFormData,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedCourse,
    handleInputChange,
    handleSelectChange,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    openEditModal,
    loadCourses,
  };
}
