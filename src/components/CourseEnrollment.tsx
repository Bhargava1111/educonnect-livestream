
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { isStudentLoggedIn } from '@/lib/studentAuth';
import { getPaymentLink } from '@/lib/paymentService';
import { createEnrollment } from '@/lib/enrollmentService';
import { getCourseById } from '@/lib/courseManagement';
import CourseNotFound from './course/CourseNotFound';
import CourseEnrollmentCard from './course/CourseEnrollmentCard';

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
    return <CourseNotFound />;
  }

  return (
    <CourseEnrollmentCard
      title={title}
      price={price}
      description={description}
      features={features}
      isEnrolling={isEnrolling}
      setIsEnrolling={setIsEnrolling}
      customPaymentLink={customPaymentLink}
      courseId={String(courseId)}
      onPaymentSuccess={handlePaymentSuccess}
      handleExternalPayment={handleExternalPayment}
      handleEnroll={handleEnroll}
    />
  );
};

export default CourseEnrollment;
