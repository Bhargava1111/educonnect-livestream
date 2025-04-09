
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { getAllCourses, getCourseById, Course } from "@/lib/courseManagement";
import { getStudentData, enrollStudentInCourse, updateStudentProfile } from '@/lib/studentAuth';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const [courseProgress, setCourseProgress] = useState<{[key: string]: number}>({});

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
        const courses = getAllCourses();
        console.log("Student courses page: Loaded courses:", courses);
        setAllCourses(courses);

        const student = getStudentData();
        console.log("Student data:", student);

        if (student && student.enrolledCourses) {
          const enrolled = courses.filter(course => 
            student.enrolledCourses.includes(course.id)
          );
          setEnrolledCourses(enrolled);
          
          const available = courses.filter(course => 
            !student.enrolledCourses.includes(course.id)
          );
          setAvailableCourses(available);
          
          const progress: {[key: string]: number} = {};
          if (student.enrollments) {
            student.enrollments.forEach(enrollment => {
              progress[enrollment.courseId] = enrollment.progress || 0;
            });
          }
          setCourseProgress(progress);
        } else {
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

    const student = getStudentData();
    if (!student) {
      toast({
        title: "Not Logged In",
        description: "Please log in to enroll in courses.",
        variant: "destructive"
      });
      setIsEnrollmentDialogOpen(false);
      return;
    }

    if (!student.education || !student.education.tenth || !student.education.tenth.school) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your educational details in your profile before enrolling.",
        variant: "destructive"
      });
      setIsEnrollmentDialogOpen(false);
      return;
    }

    // Update student profile with the form data first
    updateStudentProfile({
      aadharNumber: data.aadharNumber,
      education: {
        ...student.education,
        highest: data.education.highest
      }
    });

    // Then enroll the student with just the courseId
    const success = enrollStudentInCourse(selectedCourseId);
    
    if (success) {
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in this course."
      });
      
      const course = allCourses.find(c => c.id === selectedCourseId);
      if (course) {
        setEnrolledCourses(prev => [...prev, course]);
        setAvailableCourses(prev => prev.filter(c => c.id !== selectedCourseId));
        
        setCourseProgress(prev => ({
          ...prev,
          [selectedCourseId]: 0
        }));
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

  const navigateToAvailableCoursesTab = () => {
    const availableTabTrigger = document.querySelector('[data-value="available"]') as HTMLElement;
    if (availableTabTrigger) {
      availableTabTrigger.click();
    }
  };

  const getCourseContentCounts = (course: Course) => {
    let videoCount = 0;
    let materialCount = 0;
    
    if (course.roadmap) {
      course.roadmap.forEach(phase => {
        if (phase.videos) videoCount += phase.videos.length;
        if (phase.materials) materialCount += phase.materials.length;
      });
    }
    
    return { videoCount, materialCount };
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
            enrolledCourses.map(course => {
              const progress = courseProgress[course.id] || 0;
              const { videoCount, materialCount } = getCourseContentCounts(course);
              
              return (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Instructor: {course.instructor || 'TBD'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
                      <div>
                        <p className="text-gray-500">Content</p>
                        <div className="flex gap-2">
                          {videoCount > 0 && (
                            <Badge variant="outline" className="bg-blue-50">
                              {videoCount} Videos
                            </Badge>
                          )}
                          {materialCount > 0 && (
                            <Badge variant="outline" className="bg-green-50">
                              {materialCount} Materials
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {course.roadmap && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Course Roadmap</h4>
                        <div className="space-y-2">
                          {course.roadmap.slice(0, 3).map((phase, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                                progress >= ((index + 1) / course.roadmap!.length) * 100 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="text-sm">{phase.title}</div>
                              {progress >= ((index + 1) / course.roadmap!.length) * 100 && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                              )}
                            </div>
                          ))}
                          {course.roadmap.length > 3 && (
                            <div className="text-xs text-gray-500 pl-8">
                              +{course.roadmap.length - 3} more phases
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
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
              );
            })
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCourses.length === 0 ? (
              <div className="text-center py-10 col-span-2">
                <p className="text-gray-500">No available courses at the moment.</p>
              </div>
            ) : (
              availableCourses.map(course => {
                const { videoCount, materialCount } = getCourseContentCounts(course);
                
                return (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>Instructor: {course.instructor || 'TBD'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{course.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
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
                          <p>{course.courseType || (course.price === 0 ? 'Free' : 'Paid')}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        {videoCount > 0 && (
                          <Badge variant="outline" className="bg-blue-50">
                            {videoCount} Videos
                          </Badge>
                        )}
                        {materialCount > 0 && (
                          <Badge variant="outline" className="bg-green-50">
                            {materialCount} Materials
                          </Badge>
                        )}
                        {course.roadmap && (
                          <Badge variant="outline" className="bg-purple-50">
                            {course.roadmap.length} Phases
                          </Badge>
                        )}
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
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="text-center py-10">
            <p className="text-gray-500">You haven't completed any courses yet.</p>
          </div>
        </TabsContent>
      </Tabs>

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
