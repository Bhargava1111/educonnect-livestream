import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, CreditCardIcon, FileCheck, Landmark, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCourseById } from '@/lib/courseManagement';
import { isStudentLoggedIn, getStudentData } from '@/lib/studentAuth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getPaymentLink } from '@/lib/paymentService';
import { awaitValue } from '@/utils/authHelpers';
import { useStudentData } from '@/hooks/useStudentData';

const PaymentPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank' | 'cash'>('online');
  const { student, loading } = useStudentData();
  
  // Get course data and payment link
  // First try from location state, then from URL param
  const stateData = location.state || {};
  const courseIdToUse = courseId || stateData.courseId;
  const course = courseIdToUse ? getCourseById(courseIdToUse) : null;
  const paymentLink = courseIdToUse ? getPaymentLink(courseIdToUse) : '';
  
  // Check if student is logged in
  useEffect(() => {
    if (!isStudentLoggedIn()) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the payment page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!course) {
      toast({
        title: "Error",
        description: "Course not found.",
        variant: "destructive",
      });
      navigate('/courses');
    }
  }, [navigate, toast, course]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle payment process
  const handlePayment = () => {
    if (paymentMethod === 'online' && paymentLink) {
      // Redirect to external payment link
      window.open(paymentLink, '_blank');
    } else {
      // Show payment instructions
      toast({
        title: "Payment Instructions",
        description: paymentMethod === 'bank' 
          ? "Bank transfer details have been sent to your registered email." 
          : "Please visit our center to make the cash payment.",
      });
    }
    
    // After initiating payment process, redirect to success page
    navigate('/payment-success', { 
      state: { 
        courseId: courseIdToUse,
        courseName: course?.title,
        paymentMethod 
      } 
    });
  };
  
  // If no course or student data, show loading
  if (!course || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Format student name from available data
  const studentName = student?.name || 
    (student?.firstName && student?.lastName ? `${student.firstName} ${student.lastName}` : "Student");
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
          <CardDescription>
            Select a payment method to complete your enrollment in {course.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 bg-muted/30">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Course:</span>
                <span className="font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Student:</span>
                <span>{studentName}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold">₹{course.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Select Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center cursor-pointer">
                    <CreditCardIcon className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-muted-foreground">Pay with credit/debit card or UPI</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center cursor-pointer">
                    <Landmark className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Bank Transfer</div>
                      <div className="text-sm text-muted-foreground">Make a direct bank transfer</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center cursor-pointer">
                    <Wallet className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Cash Payment</div>
                      <div className="text-sm text-muted-foreground">Pay at our center</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === 'bank' && (
            <div className="border rounded-lg p-4 bg-muted/30 text-sm">
              <h4 className="font-medium mb-2">Bank Transfer Details</h4>
              <div className="space-y-1">
                <p><span className="font-medium">Account Name:</span> Career Aspire</p>
                <p><span className="font-medium">Account Number:</span> XXXX XXXX XXXX 1234</p>
                <p><span className="font-medium">IFSC Code:</span> ABCD0001234</p>
                <p><span className="font-medium">Bank:</span> Example Bank</p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Please include your Student ID and Course ID as reference</p>
            </div>
          )}
          
          {paymentMethod === 'cash' && (
            <div className="border rounded-lg p-4 bg-muted/30 text-sm">
              <h4 className="font-medium mb-2">Cash Payment Instructions</h4>
              <p>Please visit our center at the following address to make your payment:</p>
              <p className="mt-2 font-medium">Career Aspire Learning Center</p>
              <p>123 Education Street, Knowledge Park</p>
              <p>Bangalore, Karnataka - 560001</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Please bring your Student ID and mention the course name when making payment
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} className="w-full">
            {paymentMethod === 'online' ? (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Pay ₹{course.price.toLocaleString()}
              </>
            ) : paymentMethod === 'bank' ? (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Confirm Bank Transfer Details
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Confirm Cash Payment
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;
