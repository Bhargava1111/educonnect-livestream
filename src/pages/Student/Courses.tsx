
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ExternalLink } from 'lucide-react';

const StudentCourses = () => {
  const enrolledCourses = [
    {
      id: 1,
      name: "Python Full Stack Development",
      instructor: "Dr. Smith",
      progress: 65,
      startDate: "May 10, 2023",
      endDate: "Aug 10, 2023",
      nextSession: "Tomorrow, 2:00 PM"
    },
    {
      id: 2,
      name: "Cybersecurity Fundamentals",
      instructor: "Mrs. Johnson",
      progress: 42,
      startDate: "June 5, 2023",
      endDate: "Sep 5, 2023",
      nextSession: "Wed, 3:30 PM"
    }
  ];

  const availableCourses = [
    {
      id: 3,
      name: "Java Backend Development",
      instructor: "Mr. Davis",
      duration: "12 weeks",
      startDate: "July 15, 2023",
    },
    {
      id: 4,
      name: "MERN Stack Development",
      instructor: "Ms. Wilson",
      duration: "14 weeks",
      startDate: "July 20, 2023",
    },
    {
      id: 5,
      name: "MEAN Stack Development",
      instructor: "Mrs. Brown",
      duration: "14 weeks",
      startDate: "August 1, 2023",
    },
    {
      id: 6,
      name: "Advanced Ethical Hacking",
      instructor: "Mr. Thompson",
      duration: "10 weeks",
      startDate: "August 10, 2023",
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Courses</h1>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
          <TabsTrigger value="completed">Completed Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4 mt-4">
          {enrolledCourses.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>Instructor: {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-eduBlue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p>{course.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p>{course.endDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Session</p>
                    <p>{course.nextSession}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Materials
                  </Button>
                  <Button variant="outline" size="sm">
                    Assignments
                  </Button>
                  <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
                    Continue Learning <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCourses.map(course => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>Instructor: {course.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p>{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p>{course.startDate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                    <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="text-center py-10">
            <p className="text-gray-500">You haven't completed any courses yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCourses;
