
import React from 'react';
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
  isFree?: boolean;
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
  isFree = false,
  onPaymentSuccess,
  handleExternalPayment,
  handleEnroll
}) => {
  // If the course has a custom payment link
  if (customPaymentLink) {
    return (
      <>
        <Button 
          onClick={handleExternalPayment} 
          className="w-full bg-eduBlue-600 hover:bg-eduBlue-700 flex items-center justify-center"
        >
          {isFree ? 'Enroll Now' : 'Pay Now'} <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        {!isFree && (
          <p className="text-xs text-center text-gray-500">
            You will be redirected to our payment partner
          </p>
        )}
      </>
    );
  }
  
  // If currently in the enrollment process and it's a paid course
  if (isEnrolling && !isFree) {
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
  
  // For free courses or initial enrollment button
  return (
    <Button 
      onClick={handleEnroll} 
      className={`w-full ${isFree ? "bg-green-600 hover:bg-green-700" : "bg-eduBlue-600 hover:bg-eduBlue-700"}`}
    >
      {isFree ? 'Enroll for Free' : 'Enroll Now'}
    </Button>
  );
};

export default CoursePaymentOptions;
