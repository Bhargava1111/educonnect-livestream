
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CourseNotFound: React.FC = () => {
  const navigate = useNavigate();
  
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
};

export default CourseNotFound;
