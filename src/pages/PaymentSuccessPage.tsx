import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, FileText } from 'lucide-react';
import { createEnrollment } from '@/lib/enrollmentService';
import { useToast } from '@/hooks/use-toast';
import { useStudentData } from '@/hooks/useStudentData';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { courseId, courseName, paymentMethod } = location.state || {};
  const { student, loading } = useStudentData();
  
  useEffect(() => {
    // If no course data in state, redirect to courses
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    // Create enrollment once student data is loaded
    if (!loading && student && courseId) {
      try {
        // Create enrollment for the student
        createEnrollment(student.id, courseId);
        toast({
          title: "Enrollment Successful",
          description: `You have been enrolled in ${courseName}`,
        });
      } catch (error) {
        console.error("Error creating enrollment:", error);
        toast({
          title: "Error",
          description: "There was an issue enrolling you in the course",
          variant: "destructive",
        });
      }
    }
  }, [courseId, courseName, navigate, toast, student, loading]);
  
  const handleViewCourse = () => {
    navigate(`/courses/${courseId}`);
  };
  
  const handleViewDashboard = () => {
    navigate('/student');
  };
  
  // Show loading state when student data is still loading
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-md">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-lg text-gray-500">Processing your enrollment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <Card className="border-green-100">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment {paymentMethod === 'online' ? 'Successful' : 'Initiated'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            {paymentMethod === 'online' ? (
              <>Your payment for <span className="font-medium">{courseName}</span> has been processed successfully.</>
            ) : paymentMethod === 'bank' ? (
              <>Your bank transfer for <span className="font-medium">{courseName}</span> has been recorded. Please allow 1-2 business days for verification.</>
            ) : (
              <>Your cash payment for <span className="font-medium">{courseName}</span> has been registered. Please visit our center to complete the payment.</>
            )}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border mt-4">
            <h3 className="font-medium text-sm mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Course:</div>
              <div className="text-right">{courseName}</div>
              <div className="text-gray-500">Payment Method:</div>
              <div className="text-right capitalize">{paymentMethod}</div>
              <div className="text-gray-500">Date:</div>
              <div className="text-right">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>A confirmation email has been sent to your registered email address.</p>
            <p className="mt-2">If you have any questions, please contact our support team.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={handleViewCourse}>
            <FileText className="mr-2 h-4 w-4" />
            View Course Material
          </Button>
          <Button variant="outline" className="w-full" onClick={handleViewDashboard}>
            Go to Dashboard
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
