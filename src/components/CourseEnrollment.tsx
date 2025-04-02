
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import RazorpayPayment from './RazorpayPayment';
import { isStudentLoggedIn } from '@/lib/studentAuth';

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

  const handlePaymentSuccess = (response: any) => {
    toast({
      title: "Enrollment Successful",
      description: `You have successfully enrolled in ${title}`,
    });
    
    // Navigate to the course
    navigate(`/student/courses`);
  };

  const handleEnroll = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
  };

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
        {isEnrolling ? (
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
