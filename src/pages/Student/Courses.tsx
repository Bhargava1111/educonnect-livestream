
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getAllCourses, Course } from "@/lib/courseManagement";
import { getStudentData, enrollStudentInCourse } from '@/lib/studentAuth';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

const StudentCourses = () => {
  const { toast } = useToast();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = () => {
      try {
        // Get all courses from the database
        const courses = getAllCourses();
        console.log("Student courses page: Loaded courses:", courses);
        setAllCourses(courses);

        // Get student data to check enrolled courses
        const student = getStudentData();
        console.log("Student data:", student);

        if (student && student.enrolledCourses) {
          // Filter enrolled courses
          const enrolled = courses.filter(course => 
            student.enrolledCourses.includes(course.id)
          );
          setEnrolledCourses(enrolled);
          
          // Filter available courses (not enrolled)
          const available = courses.filter(course => 
            !student.enrolledCourses.includes(course.id)
          );
          setAvailableCourses(available);
        } else {
          // If no enrolled courses or not logged in, show all as available
          setAvailableCourses(courses);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [toast]);

  const handleEnroll = (courseId: string) => {
    const success = enrollStudentInCourse(courseId);
    
    if (success) {
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in this course."
      });
      
      // Update the lists
      const course = allCourses.find(c => c.id === courseId);
      if (course) {
        setEnrolledCourses(prev => [...prev, course]);
        setAvailableCourses(prev => prev.filter(c => c.id !== courseId));
      }
    } else {
      toast({
        title: "Enrollment Failed",
        description: "Please log in to enroll in courses.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading courses...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">My Courses</h1>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
          <TabsTrigger value="completed">Completed Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4 mt-4">
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
              <Button 
                className="mt-4 bg-eduBlue-600 hover:bg-eduBlue-700"
                onClick={() => document.querySelector('[data-value="available"]')?.click()}
              >
                Browse Available Courses
              </Button>
            </div>
          ) : (
            enrolledCourses.map(course => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>Instructor: {course.instructor || 'TBD'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-eduBlue-600 h-2.5 rounded-full" style={{ width: `0%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p>{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Level</p>
                      <p>{course.level || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Materials
                    </Button>
                    <Button variant="outline" size="sm">
                      Assignments
                    </Button>
                    <Link to={`/courses/${course.id}/roadmap`}>
                      <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
                        Continue Learning <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCourses.length === 0 ? (
              <div className="text-center py-10 col-span-2">
                <p className="text-gray-500">No available courses at the moment.</p>
              </div>
            ) : (
              availableCourses.map(course => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Instructor: {course.instructor || 'TBD'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">{course.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p>{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Level</p>
                        <p>{course.level || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p>₹{course.price?.toLocaleString() || 'Free'}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to={`/courses/${course.id}/roadmap`}>
                      <Button variant="outline" size="sm">
                        View Details <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                    <Button 
                      className="bg-eduBlue-600 hover:bg-eduBlue-700" 
                      size="sm"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="text-center py-10">
            <p className="text-gray-500">You haven't completed any courses yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCourses;
