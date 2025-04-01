
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from 'lucide-react';
import { getStudentData, isStudentLoggedIn } from '@/lib/studentAuth';
import { useNavigate } from 'react-router-dom';

// Mock data for live meetings
const liveMeetings = [
  {
    id: '1',
    title: 'Python Fundamentals Workshop',
    description: 'Learn the fundamentals of Python programming language',
    instructor: 'Dr. Kumar',
    date: '2023-10-15',
    time: '10:00 AM',
    duration: '2 hours',
    link: 'https://meet.google.com/abc-defg-hij',
    courseId: 'course_1',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'React Component Design Patterns',
    description: 'Advanced techniques for designing React components',
    instructor: 'Ms. Sharma',
    date: '2023-10-16',
    time: '2:00 PM',
    duration: '1.5 hours',
    link: 'https://meet.google.com/klm-nopq-rst',
    courseId: 'course_1',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Java Spring Boot Introduction',
    description: 'Getting started with Spring Boot for backend development',
    instructor: 'Mr. Patel',
    date: '2023-10-14',
    time: '11:00 AM',
    duration: '2 hours',
    link: 'https://meet.google.com/uvw-xyz-123',
    courseId: 'course_2',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Database Design Best Practices',
    description: 'Learn how to design efficient and scalable databases',
    instructor: 'Dr. Singh',
    date: '2023-10-17',
    time: '3:00 PM',
    duration: '2 hours',
    link: 'https://meet.google.com/456-789-abc',
    courseId: 'course_3',
    status: 'upcoming'
  }
];

const LiveMeetings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  
  // Check if student is logged in
  const isLoggedIn = isStudentLoggedIn();
  const studentData = isLoggedIn ? getStudentData() : null;
  
  // Filter meetings based on student enrollment and tab selection
  const filteredMeetings = liveMeetings.filter(meeting => {
    // If logged in, only show meetings for enrolled courses
    if (isLoggedIn && studentData && studentData.enrolledCourses) {
      if (!studentData.enrolledCourses.includes(meeting.courseId)) {
        return false;
      }
    }
    
    // Filter based on active tab
    return meeting.status === activeTab;
  });
  
  // Join meeting handler
  const joinMeeting = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Live Sessions</h1>
      
      {!isLoggedIn ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">Please login to view and join live sessions.</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            <Button 
              variant={activeTab === 'upcoming' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Sessions
            </Button>
            <Button 
              variant={activeTab === 'completed' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('completed')}
            >
              Completed Sessions
            </Button>
          </div>
          
          {filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No {activeTab} sessions available.</p>
                {activeTab === 'upcoming' && (
                  <p className="text-sm text-gray-500 mt-2">
                    Check back later for scheduled sessions or enroll in more courses.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMeetings.map((meeting) => (
                <Card key={meeting.id} className="overflow-hidden">
                  <CardHeader className="bg-eduBlue-50 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{meeting.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Instructor: {meeting.instructor}
                        </CardDescription>
                      </div>
                      <Badge variant={meeting.status === 'upcoming' ? 'default' : 'secondary'}>
                        {meeting.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-gray-700">{meeting.description}</p>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{meeting.date}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                    </div>
                    
                    {meeting.status === 'upcoming' && (
                      <Button 
                        className="w-full mt-2" 
                        onClick={() => joinMeeting(meeting.link)}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LiveMeetings;
