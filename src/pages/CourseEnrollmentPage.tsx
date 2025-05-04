
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '@/lib/courseManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import { useToast } from '@/hooks/use-toast';
import { isStudentLoggedIn } from '@/lib/studentAuth';

const CourseEnrollmentPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch course data
  const course = courseId ? getCourseById(courseId) : null;
  
  // Check if student is logged in
  React.useEffect(() => {
    if (!isStudentLoggedIn()) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the enrollment form.",
        variant: "destructive",
      });
      navigate('/login', { state: { redirectAfterLogin: `/course-enrollment/${courseId}` } });
    }
  }, [navigate, toast, courseId]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Render loading state or error if course not found
  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">
              {courseId ? "Course not found" : "Loading course..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Course
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Duration: {course.duration}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Level: {course.level}
          </span>
          {course.price > 0 ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Price: ₹{course.price.toLocaleString()}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Free
            </span>
          )}
        </div>
      </div>
      
      <EnrollmentForm 
        formType="course" 
        relatedId={courseId || ''} 
      />
    </div>
  );
};

export default CourseEnrollmentPage;
