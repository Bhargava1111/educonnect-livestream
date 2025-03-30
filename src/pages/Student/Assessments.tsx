
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Clock, FileText } from 'lucide-react';

const StudentAssessments = () => {
  const pendingAssessments = [
    {
      id: 1,
      title: "MERN Stack - Final Project",
      course: "MERN Stack Development",
      dueDate: "June 20, 2023",
      type: "Project",
      timeLeft: "5 days"
    },
    {
      id: 2,
      title: "Java OOP Concepts",
      course: "Java Backend Development",
      dueDate: "June 15, 2023",
      type: "Quiz",
      timeLeft: "2 days"
    }
  ];

  const completedAssessments = [
    {
      id: 3,
      title: "Python Data Structures",
      course: "Python Full Stack Development",
      submittedDate: "June 5, 2023",
      grade: "85/100",
      feedback: "Good understanding of core concepts"
    },
    {
      id: 4,
      title: "Network Security Fundamentals",
      course: "Cybersecurity Fundamentals",
      submittedDate: "May 28, 2023",
      grade: "92/100",
      feedback: "Excellent work on threat analysis"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Assessments</h1>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingAssessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription>{assessment.course}</CardDescription>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{assessment.timeLeft} left</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="ml-2 text-sm">{assessment.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Due Date:</span>
                      <span className="ml-2 text-sm">{assessment.dueDate}</span>
                    </div>
                  </div>
                  <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedAssessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription>{assessment.course}</CardDescription>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {assessment.grade}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Submitted:</span>
                    <span className="ml-2 text-sm">{assessment.submittedDate}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Feedback:</span>
                    <p className="mt-1 text-sm border-l-2 border-gray-300 pl-3">{assessment.feedback}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAssessments;
