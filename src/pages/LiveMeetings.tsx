
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from 'lucide-react';
import { getStudentData, isStudentLoggedIn } from '@/lib/studentAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { LiveMeeting } from '@/lib/services/liveMeetingService';
import { getAllLiveMeetings } from '@/lib/services/liveMeetingService';
import { getAllCourses } from '@/lib/courseService';

const LiveMeetings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if student is logged in
  const isLoggedIn = isStudentLoggedIn();
  
  // Use useCallback to prevent recreation on each render
  const loadData = useCallback(async () => {
    try {
      // Load meetings and courses
      const allMeetings = await getAllLiveMeetings();
      const allCourses = getAllCourses();
      
      setMeetings(allMeetings);
      setCourses(allCourses);

      if (isLoggedIn) {
        try {
          const data = await getStudentData();
          setStudentData(data);
        } catch (err) {
          console.error("Error loading student data:", err);
        }
      }
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);
  
  useEffect(() => {
    loadData();
  }, [activeTab, loadData]);
  
  // Filter meetings based on student enrollment and tab selection
  const filteredMeetings = meetings.filter(meeting => {
    // If logged in, only show meetings for enrolled courses
    if (isLoggedIn && studentData && studentData.enrolledCourses) {
      if (!studentData.enrolledCourses.includes(meeting.course_id)) {
        return false;
      }
    }
    
    // Filter based on active tab and convert database status to legacy format
    const legacyStatus = meeting.status === 'scheduled' ? 'upcoming' : meeting.status;
    return legacyStatus === activeTab;
  });
  
  // Join meeting handler
  const joinMeeting = (link: string) => {
    if (!link) {
      toast({
        title: "Meeting Link Error",
        description: "The meeting link is not available. Please contact support.",
        variant: "destructive"
      });
      return;
    }
    
    // Open meeting link in a new tab
    window.open(link, '_blank');
    
    toast({
      title: "Joining Meeting",
      description: "Redirecting to the meeting room."
    });
  };
  
  // Get course name by ID
  const getCourseNameById = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  // Convert database meeting to legacy format for display
  const convertMeetingForDisplay = (meeting: LiveMeeting) => {
    const date = new Date(meeting.scheduled_date);
    return {
      ...meeting,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      link: meeting.meeting_link,
      courseId: meeting.course_id,
      hostName: meeting.instructor_name,
      status: meeting.status === 'scheduled' ? 'upcoming' : meeting.status
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading meetings...</p>
      </div>
    );
  }

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
              {filteredMeetings.map((meeting) => {
                const displayMeeting = convertMeetingForDisplay(meeting);
                return (
                  <Card key={meeting.id} className="overflow-hidden">
                    <CardHeader className="bg-eduBlue-50 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{meeting.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Course: {getCourseNameById(meeting.course_id)}
                          </CardDescription>
                        </div>
                        <Badge variant={displayMeeting.status === 'upcoming' ? 'default' : 'secondary'}>
                          {displayMeeting.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <p className="text-gray-700">{meeting.description}</p>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{displayMeeting.date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{displayMeeting.time} ({meeting.duration})</span>
                        </div>
                      </div>
                      
                      {displayMeeting.status === 'upcoming' && (
                        <Button 
                          className="w-full mt-2" 
                          onClick={() => joinMeeting(meeting.meeting_link)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LiveMeetings;
