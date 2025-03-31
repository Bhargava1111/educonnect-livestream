
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Clock, FileText, Video, Check } from 'lucide-react';
import CourseEnrollment from '@/components/CourseEnrollment';
import { isStudentLoggedIn, getStudentData } from '@/lib/studentAuth';

// Mock course data
const coursesData = {
  '1': {
    id: 1,
    title: 'Full-Stack Web Development',
    description: 'Master front-end and back-end technologies for complete web applications.',
    price: 12999,
    instructor: {
      name: 'Dr. Kumar',
      avatar: '',
      bio: 'Senior Developer with 10+ years of industry experience',
    },
    features: [
      'Access to 60+ hours of video content',
      'Hands-on projects and assignments',
      'Personal mentor support',
      'Industry-recognized certification',
      'Job placement assistance',
      '24/7 doubt resolution'
    ],
    curriculum: [
      {
        title: 'Module 1: HTML & CSS Fundamentals',
        lessons: [
          { title: 'Introduction to HTML', type: 'video', duration: '45 min' },
          { title: 'CSS Styling Basics', type: 'video', duration: '55 min' },
          { title: 'Building Your First Webpage', type: 'exercise', duration: '2 hours' },
        ]
      },
      {
        title: 'Module 2: JavaScript Fundamentals',
        lessons: [
          { title: 'JavaScript Syntax & Variables', type: 'video', duration: '60 min' },
          { title: 'Functions & Objects', type: 'video', duration: '75 min' },
          { title: 'DOM Manipulation', type: 'video', duration: '60 min' },
          { title: 'Building an Interactive Web App', type: 'exercise', duration: '3 hours' },
        ]
      },
      {
        title: 'Module 3: React Frontend Development',
        lessons: [
          { title: 'React Introduction', type: 'video', duration: '45 min' },
          { title: 'Components & Props', type: 'video', duration: '60 min' },
          { title: 'State & Lifecycle', type: 'video', duration: '60 min' },
          { title: 'Building a React App', type: 'exercise', duration: '4 hours' },
        ]
      },
    ]
  },
  // Add more courses as needed
};

const CourseCurriculum = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = coursesData[courseId as keyof typeof coursesData];
  const isLoggedIn = isStudentLoggedIn();
  const studentData = isLoggedIn ? getStudentData() : null;
  
  // Check if student is enrolled in this course
  const isEnrolled = studentData?.enrolledCourses?.includes(Number(courseId));
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
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
                  <Accordion type="single" collapsible className="w-full">
                    {course.curriculum.map((module, moduleIndex) => (
                      <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                        <AccordionTrigger>
                          {module.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                                <div className="flex items-center">
                                  {lesson.type === 'video' ? (
                                    <Video className="h-4 w-4 mr-2 text-eduBlue-600" />
                                  ) : (
                                    <FileText className="h-4 w-4 mr-2 text-eduBlue-600" />
                                  )}
                                  <span>{lesson.title}</span>
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {lesson.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
                      {course.instructor.avatar ? (
                        <AvatarImage src={course.instructor.avatar} />
                      ) : (
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{course.instructor.name}</h3>
                      <p className="text-gray-500">{course.instructor.bio}</p>
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
              courseId={course.id}
              title={course.title}
              price={course.price}
              features={course.features}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCurriculum;
