
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  getCourseById, updateCourse, Course
} from "@/lib/courseManagement";
import PaymentLinkManager from '@/components/PaymentLinkManager';
import { ArrowLeft, Save } from 'lucide-react';

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      }
      setIsLoading(false);
    }
  }, [courseId]);

  const handleGoBack = () => {
    navigate('/admin/courses');
  };

  if (isLoading) {
    return <div className="p-6">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Course not found. The requested course may have been deleted or doesn't exist.</p>
            <Button onClick={handleGoBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>View and manage course details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="mt-1 text-gray-600">{course.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Duration</h3>
                    <p className="mt-1 text-gray-600">{course.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Level</h3>
                    <p className="mt-1 text-gray-600">{course.level}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Price</h3>
                    <p className="mt-1 text-gray-600">₹{course.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Instructor</h3>
                    <p className="mt-1 text-gray-600">{course.instructor || 'Not assigned'}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate(`/admin/courses/${course.id}/roadmap`)}
                  >
                    Edit Course Roadmap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage payment options for this course</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentLinkManager 
                courseId={course.id} 
                courseName={course.title} 
              />
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">How Payment Links Work</h3>
                <p className="text-sm text-gray-600 mb-3">
                  When you add a payment link, students will be redirected to that link for payment instead of using the default Razorpay integration.
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Payment links can be from any payment processor (Razorpay, PayU, Instamojo, etc.)</li>
                  <li>Make sure to configure success and failure redirect URLs in your payment gateway</li>
                  <li>The link should be a direct checkout link that loads the payment page</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetails;
