import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ListChecks, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllCourses } from '@/lib/courseManagement';
import { createLiveMeeting } from '@/lib/liveMeetingService';
import { LiveMeeting } from '@/lib/types';

const AdminSchedule = () => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingInstructor, setMeetingInstructor] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(new Date());
  const [meetingTime, setMeetingTime] = useState('09:00');
  const [meetingDuration, setMeetingDuration] = useState('60 minutes');
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const allCourses = getAllCourses();
    setCourses(allCourses);
    if (allCourses.length > 0) {
      setSelectedCourse(allCourses[0].id);
    }
  }, []);

  const handleAddMeeting = () => {
    if (!selectedCourse || !meetingTitle || !meetingDescription || !meetingInstructor || !meetingDate || !meetingTime || !meetingLink) {
      alert('Please fill in all fields.');
      return;
    }

    // Format the date and time properly for the scheduledDate field
    const formattedDate = meetingDate ? meetingDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const scheduledDate = `${formattedDate}T${meetingTime}:00`;

    // Create a new meeting with all required fields
    const newMeetingData: Omit<LiveMeeting, "id"> = {
      courseId: selectedCourse,
      title: meetingTitle,
      description: meetingDescription,
      hostName: meetingInstructor,
      scheduledDate: scheduledDate,
      duration: meetingDuration,
      meetingLink: meetingLink,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      // For backward compatibility
      instructor: meetingInstructor,
      date: formattedDate,
      time: meetingTime,
      link: meetingLink
    };

    createLiveMeeting(newMeetingData);

    setMeetingTitle('');
    setMeetingDescription('');
    setMeetingInstructor('');
    setMeetingDate(undefined);
    setMeetingTime('09:00');
    setMeetingDuration('60 minutes');
    setMeetingLink('');
    alert('Meeting scheduled successfully!');
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5" />
            Schedule Live Meeting
          </CardTitle>
          <CardDescription>
            Plan and schedule your live meetings
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                type="text"
                id="title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="description">Meeting Description</Label>
              <Input
                type="text"
                id="description"
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                type="text"
                id="instructor"
                value={meetingInstructor}
                onChange={(e) => setMeetingInstructor(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="60 minutes">60 minutes</SelectItem>
                  <SelectItem value="90 minutes">90 minutes</SelectItem>
                  <SelectItem value="120 minutes">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !meetingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {meetingDate ? format(meetingDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={meetingDate}
                    onSelect={setMeetingDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                type="time"
                id="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="link">Meeting Link</Label>
            <Input
              type="text"
              id="link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          <Button onClick={handleAddMeeting}>Schedule Meeting</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSchedule;
