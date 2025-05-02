
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CourseFeaturesList from './CourseFeaturesList';
import CoursePaymentOptions from './CoursePaymentOptions';

interface CourseEnrollmentCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  isEnrolling: boolean;
  setIsEnrolling: React.Dispatch<React.SetStateAction<boolean>>;
  customPaymentLink: string;
  courseId: string;
  onPaymentSuccess: (response: any) => void;
  handleExternalPayment: () => void;
  handleEnroll: () => void;
}

const CourseEnrollmentCard: React.FC<CourseEnrollmentCardProps> = ({
  title,
  price,
  description,
  features,
  isEnrolling,
  setIsEnrolling,
  customPaymentLink,
  courseId,
  onPaymentSuccess,
  handleExternalPayment,
  handleEnroll
}) => {
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
        <CourseFeaturesList features={features} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-4">
        <CoursePaymentOptions
          isEnrolling={isEnrolling}
          setIsEnrolling={setIsEnrolling}
          customPaymentLink={customPaymentLink}
          price={price}
          title={title}
          courseId={courseId}
          onPaymentSuccess={onPaymentSuccess}
          handleExternalPayment={handleExternalPayment}
          handleEnroll={handleEnroll}
        />
        
        <p className="text-xs text-center text-gray-500">
          Secure payment powered by Razorpay
        </p>
      </CardFooter>
    </Card>
  );
};

export default CourseEnrollmentCard;
