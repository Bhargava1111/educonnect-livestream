
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import RazorpayPayment from '../RazorpayPayment';

interface CoursePaymentOptionsProps {
  isEnrolling: boolean;
  setIsEnrolling: React.Dispatch<React.SetStateAction<boolean>>;
  customPaymentLink: string;
  price: number;
  title: string;
  courseId: string;
  onPaymentSuccess: (response: any) => void;
  handleExternalPayment: () => void;
  handleEnroll: () => void;
}

const CoursePaymentOptions: React.FC<CoursePaymentOptionsProps> = ({
  isEnrolling,
  setIsEnrolling,
  customPaymentLink,
  price,
  title,
  courseId,
  onPaymentSuccess,
  handleExternalPayment,
  handleEnroll
}) => {
  if (customPaymentLink) {
    return (
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
    );
  }
  
  if (isEnrolling) {
    return (
      <div className="w-full">
        <RazorpayPayment 
          amount={price} 
          courseName={title}
          courseId={String(courseId)}
          description={`Enrollment for ${title}`}
          onSuccess={onPaymentSuccess}
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
    );
  }
  
  return (
    <Button 
      onClick={handleEnroll} 
      className="w-full bg-eduBlue-600 hover:bg-eduBlue-700"
    >
      Enroll Now
    </Button>
  );
};

export default CoursePaymentOptions;
