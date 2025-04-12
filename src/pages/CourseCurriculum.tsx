
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Clock, FileText, Video, Check } from 'lucide-react';
import CourseEnrollment from '@/components/CourseEnrollment';
import { isStudentLoggedIn, getStudentData } from '@/lib/studentAuth';
import { getCourseById } from '@/lib/courseManagement';

const CourseCurriculum = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = isStudentLoggedIn();
  const studentData = isLoggedIn ? getStudentData() : null;
  
  // Check if student is enrolled in this course
  const isEnrolled = studentData?.enrolledCourses?.includes(courseId);
  
  useEffect(() => {
    if (courseId) {
      // Fetch the course data from the course management service
      const courseData = getCourseById(courseId);
      console.log("Fetched course data:", courseData);
      setCourse(courseData || null);
      setLoading(false);
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-medium mb-4">Loading course information...</h2>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="shadow-lg border-2 border-gray-100">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle className="text-2xl">Course Not Found</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center mb-4">The requested course could not be found. Please check the course ID and try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          {isEnrolled && (
            <Badge className="bg-green-600 mb-6">You are enrolled in this course</Badge>
          )}

          <Tabs defaultValue="curriculum">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.curriculum && course.curriculum.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {course.curriculum.map((module: any, moduleIndex: number) => (
                        <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                          <AccordionTrigger>
                            {module.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {module.topics && module.topics.map((topic: any, topicIndex: number) => (
                                <div key={topicIndex} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-eduBlue-600" />
                                    <span>{topic.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-500">No curriculum available for this course yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback>{course.instructor ? course.instructor.charAt(0) : 'I'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{course.instructor || 'Instructor information not available'}</h3>
                      <p className="text-gray-500">{course.instructorBio || 'Experienced educator in this field'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No reviews yet for this course.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enrollment Card */}
        <div>
          {isEnrolled ? (
            <Card className="shadow-lg border-2 border-gray-100">
              <CardHeader className="text-center border-b pb-6">
                <CardTitle className="text-2xl">You're Enrolled!</CardTitle>
                <div className="mt-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-center mb-4">You have access to all course materials.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Full Access to Course Content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Certificate of Completion</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Instructor Support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ) : (
            <CourseEnrollment
              courseId={courseId || ''}
              title={course.title}
              price={course.price}
              features={[
                "Access to all course materials",
                "Certificate of completion",
                "Instructor support",
                "Lifetime access",
                "Job placement assistance"
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCurriculum;
