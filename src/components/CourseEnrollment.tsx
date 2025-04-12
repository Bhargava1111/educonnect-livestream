import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import RazorpayPayment from './RazorpayPayment';
import { isStudentLoggedIn } from '@/lib/studentAuth';
import { getPaymentLink } from '@/lib/paymentService';
import { createEnrollment } from '@/lib/enrollmentService';
import { getCourseById } from '@/lib/courseManagement';

interface CourseEnrollmentProps {
  courseId: string | number;
  title: string;
  price: number;
  description?: string;
  features?: string[];
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({
  courseId,
  title,
  price,
  description = "Enroll in this course to get access to all materials and support.",
  features = [],
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = isStudentLoggedIn();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [customPaymentLink, setCustomPaymentLink] = useState('');
  const [courseExists, setCourseExists] = useState(true);

  useEffect(() => {
    const courseIdStr = String(courseId);
    console.log("Checking course existence for ID:", courseIdStr);
    
    const courseData = getCourseById(courseIdStr);
    console.log("Course data retrieved:", courseData);
    
    if (!courseData) {
      console.warn("Course not found with ID:", courseIdStr);
      setCourseExists(false);
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive",
      });
      return;
    }

    const paymentLink = getPaymentLink(courseIdStr);
    setCustomPaymentLink(paymentLink);
  }, [courseId, toast]);

  const handlePaymentSuccess = (response: any) => {
    if (isLoggedIn) {
      const studentData = localStorage.getItem('career_aspire_student');
      if (studentData) {
        const student = JSON.parse(studentData);
        const enrollment = createEnrollment(student.id, String(courseId));
        
        if (enrollment) {
          toast({
            title: "Enrollment Successful",
            description: `You have successfully enrolled in ${title}`,
          });
          
          navigate(`/student/courses`);
        } else {
          toast({
            title: "Enrollment Failed",
            description: "There was an error enrolling you in this course. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleEnroll = () => {
    if (!courseExists) {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive",
      });
      return;
    }

    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (price === 0) {
      handlePaymentSuccess(null);
      return;
    }

    setIsEnrolling(true);
  };

  const handleExternalPayment = () => {
    if (!courseExists) {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive",
      });
      return;
    }

    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    window.open(customPaymentLink, '_blank');
  };

  if (!courseExists) {
    return (
      <Card className="shadow-lg border-2 border-gray-100">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-2xl">Course Not Found</CardTitle>
          <CardDescription className="text-gray-500 mt-2">
            The requested course could not be found. Please check the course ID and try again.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center pt-4">
          <Button 
            onClick={() => navigate('/courses')} 
            className="bg-eduBlue-600 hover:bg-eduBlue-700"
          >
            Browse Courses
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2 border-gray-100">
      <CardHeader className="text-center border-b pb-6">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-gray-500 mt-2">{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">₹{price}</span>
          <span className="text-gray-500 ml-2">one-time payment</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-4">
        {customPaymentLink ? (
          <>
            <Button 
              onClick={handleExternalPayment} 
              className="w-full bg-eduBlue-600 hover:bg-eduBlue-700 flex items-center justify-center"
            >
              Pay Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-gray-500">
              You will be redirected to our payment partner
            </p>
          </>
        ) : isEnrolling ? (
          <div className="w-full">
            <RazorpayPayment 
              amount={price} 
              courseName={title}
              courseId={String(courseId)}
              description={`Enrollment for ${title}`}
              onSuccess={handlePaymentSuccess}
              onFailure={() => setIsEnrolling(false)}
            />
            <Button 
              variant="ghost" 
              className="w-full mt-2"
              onClick={() => setIsEnrolling(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleEnroll} 
            className="w-full bg-eduBlue-600 hover:bg-eduBlue-700"
          >
            Enroll Now
          </Button>
        )}
        
        <p className="text-xs text-center text-gray-500">
          Secure payment powered by Razorpay
        </p>
      </CardFooter>
    </Card>
  );
};

export default CourseEnrollment;
