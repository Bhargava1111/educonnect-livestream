
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getAllCourses, Course } from "@/lib/courseManagement";
import { getStudentData, enrollStudentInCourse } from '@/lib/studentAuth';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface EnrollmentFormData {
  aadharNumber: string;
  education: {
    highest: string;
  };
  payment: {
    method: string;
  };
}

const StudentCourses = () => {
  const { toast } = useToast();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const form = useForm<EnrollmentFormData>({
    defaultValues: {
      aadharNumber: "",
      education: {
        highest: ""
      },
      payment: {
        method: "online"
      }
    }
  });

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

  const handleEnrollClick = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourseId(courseId);
      setSelectedCourse(course);
      setIsEnrollmentDialogOpen(true);
    }
  };

  const handleEnrollSubmit = (data: EnrollmentFormData) => {
    if (!selectedCourseId) return;

    // Check if user has completed profile
    const student = getStudentData();
    if (!student || !student.education || !student.education.tenth.school) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your educational details in your profile before enrolling.",
        variant: "destructive"
      });
      setIsEnrollmentDialogOpen(false);
      return;
    }

    const success = enrollStudentInCourse(selectedCourseId);
    
    if (success) {
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in this course."
      });
      
      // Update the lists
      const course = allCourses.find(c => c.id === selectedCourseId);
      if (course) {
        setEnrolledCourses(prev => [...prev, course]);
        setAvailableCourses(prev => prev.filter(c => c.id !== selectedCourseId));
      }
      setIsEnrollmentDialogOpen(false);
    } else {
      toast({
        title: "Enrollment Failed",
        description: "Please log in to enroll in courses.",
        variant: "destructive"
      });
    }
  };

  // Helper function to navigate to available courses tab
  const navigateToAvailableCoursesTab = () => {
    const availableTabTrigger = document.querySelector('[data-value="available"]') as HTMLElement;
    if (availableTabTrigger) {
      availableTabTrigger.click();
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
                onClick={navigateToAvailableCoursesTab}
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
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p>{course.price === 0 ? 'Free' : 'Paid'}</p>
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
                        <p>{course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p>{course.price === 0 ? 'Free' : 'Paid'}</p>
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
                      onClick={() => handleEnrollClick(course.id)}
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

      {/* Enrollment Dialog */}
      <Dialog open={isEnrollmentDialogOpen} onOpenChange={setIsEnrollmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enroll in {selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Please confirm your details to enroll in this course.
              {selectedCourse?.price !== 0 && (
                <span className="font-medium block mt-2">
                  Course fee: ₹{selectedCourse?.price?.toLocaleString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleEnrollSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number (for verification)</Label>
              <Input 
                id="aadharNumber"
                placeholder="Enter your 12-digit Aadhar number"
                {...form.register("aadharNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Highest Education</Label>
              <Input 
                id="education"
                placeholder="E.g., Bachelor of Science"
                {...form.register("education.highest")}
              />
              <p className="text-sm text-gray-500">
                Note: You can manage your complete education details in your profile.
              </p>
            </div>

            {selectedCourse?.price !== 0 && (
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      value="online" 
                      {...form.register("payment.method")} 
                      defaultChecked
                    />
                    <span>Online Payment (Credit/Debit Card, UPI)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      value="bank" 
                      {...form.register("payment.method")}
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEnrollmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm Enrollment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentCourses;
