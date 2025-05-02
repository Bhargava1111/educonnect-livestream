
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const CourseNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-lg border-2 border-gray-100 max-w-md mx-auto">
      <CardHeader className="text-center border-b pb-6">
        <div className="flex justify-center mb-4">
          <FileText className="h-16 w-16 text-gray-400" />
        </div>
        <CardTitle className="text-2xl">Course Not Found</CardTitle>
        <CardDescription className="text-gray-500 mt-2">
          The requested course could not be found. Please check the course ID and try again or browse our available courses.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center gap-4 pt-4">
        <Button 
          onClick={() => navigate('/courses')} 
          className="bg-eduBlue-600 hover:bg-eduBlue-700"
        >
          Browse Courses
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/')} 
        >
          Return to Home
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseNotFound;
