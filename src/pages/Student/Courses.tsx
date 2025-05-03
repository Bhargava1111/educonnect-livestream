import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Course } from '@/lib/types';
import { getAllCourses, enrollStudentInCourse } from '@/lib/courseManagement';
import { getCurrentStudent } from '@/lib/auth/utils';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentStudent = getCurrentStudent();

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const allCourses = getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnroll = (course: Course) => {
    if (!currentStudent) {
      toast({
        title: "Not logged in",
        description: "Please login to enroll in the course.",
      });
      navigate('/login');
      return;
    }

    try {
      enrollStudentInCourse(course.id, currentStudent.id);
      toast({
        title: "Enrolled",
        description: `You have successfully enrolled in ${course.title}.`,
      });
      navigate('/student/dashboard');
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center">
        <h1 className="text-3xl font-bold mr-4">Explore Our Courses</h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for courses..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : (
          filteredCourses.map(course => (
            <Card key={course.id} className="bg-white shadow-md rounded-md overflow-hidden">
              {course.imageUrl && (
                <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover" />
              )}
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-sm text-gray-500">{course.shortDescription}</CardDescription>
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">Price: ₹{course.price}</p>
                  <p className="text-gray-700">Level: {course.level}</p>
                </div>
                <Button className="w-full mt-4" onClick={() => handleEnroll(course)}>
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
