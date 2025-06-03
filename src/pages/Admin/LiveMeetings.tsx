import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar, Clock, Users, Video, Pencil, Trash, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Course } from '@/lib/types';
import {
  getAllLiveMeetings,
  createLiveMeeting,
  updateLiveMeeting,
  deleteLiveMeeting
} from '@/lib/services/liveMeetingService';
import { LiveMeeting } from '@/lib/services/liveMeetingService';
import { getAllCourses } from '@/lib/courseService';

const AdminLiveMeetings = () => {
  const { toast } = useToast();
  
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<LiveMeeting | null>(null);
  const [newMeetingData, setNewMeetingData] = useState({
    title: '',
    description: '',
    course_id: '',
    scheduled_date: '',
    duration: '60 minutes',
    meeting_link: '',
    platform: 'Manual',
    instructor_name: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allMeetings = await getAllLiveMeetings();
      const allCourses = getAllCourses();
      
      setMeetings(allMeetings);
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const resetNewMeetingData = () => {
    setNewMeetingData({
      title: '',
      description: '',
      course_id: '',
      scheduled_date: '',
      duration: '60 minutes',
      meeting_link: '',
      platform: 'Manual',
      instructor_name: ''
    });
  };

  const handleCreateMeeting = async () => {
    if (!newMeetingData.title || !newMeetingData.course_id || !newMeetingData.scheduled_date) {
      toast({
        title: "Missing Information",
        description: "Please provide title, course, and schedule for the meeting.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createLiveMeeting({
        title: newMeetingData.title,
        description: newMeetingData.description,
        course_id: newMeetingData.course_id,
        scheduled_date: newMeetingData.scheduled_date,
        duration: newMeetingData.duration,
        meeting_link: newMeetingData.meeting_link,
        platform: newMeetingData.platform,
        instructor_name: newMeetingData.instructor_name,
        status: 'scheduled'
      });

      if (result.success && result.data) {
        setMeetings(prevMeetings => [result.data!, ...prevMeetings]);
        setIsCreateDialogOpen(false);
        resetNewMeetingData();
        
        toast({
          title: "Meeting Scheduled",
          description: `${result.data.title} has been scheduled successfully.`
        });
      } else {
        throw new Error(result.error || 'Failed to create meeting');
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditMeeting = (meeting: LiveMeeting) => {
    setEditingMeeting(meeting);
    setNewMeetingData({
      title: meeting.title,
      description: meeting.description,
      course_id: meeting.course_id,
      scheduled_date: meeting.scheduled_date,
      duration: meeting.duration,
      meeting_link: meeting.meeting_link,
      platform: meeting.platform,
      instructor_name: meeting.instructor_name
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return;

    try {
      const result = await updateLiveMeeting(editingMeeting.id, {
        title: newMeetingData.title,
        description: newMeetingData.description,
        course_id: newMeetingData.course_id,
        scheduled_date: newMeetingData.scheduled_date,
        duration: newMeetingData.duration,
        meeting_link: newMeetingData.meeting_link,
        platform: newMeetingData.platform,
        instructor_name: newMeetingData.instructor_name
      });

      if (result.success && result.data) {
        setMeetings(prevMeetings => 
          prevMeetings.map(meeting => 
            meeting.id === editingMeeting.id ? result.data! : meeting
          )
        );

        setIsEditDialogOpen(false);
        setEditingMeeting(null);
        resetNewMeetingData();
        
        toast({
          title: "Meeting Updated",
          description: `${newMeetingData.title} has been updated successfully.`
        });
      } else {
        throw new Error(result.error || 'Failed to update meeting');
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      const result = await deleteLiveMeeting(id);
      
      if (result.success) {
        setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== id));
        
        toast({
          title: "Meeting Deleted",
          description: "Meeting has been deleted successfully."
        });
      } else {
        throw new Error(result.error || 'Failed to delete meeting');
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMeetingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewMeetingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Live Meetings</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map(meeting => {
          const course = courses.find(c => c.id === meeting.course_id);
          return (
            <Card key={meeting.id}>
              <CardHeader>
                <CardTitle>{meeting.title}</CardTitle>
                <CardDescription>{course?.title || 'Unknown Course'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>
                    <Calendar className="mr-2 inline-block h-4 w-4" />
                    {new Date(meeting.scheduled_date).toLocaleDateString()}
                  </p>
                  <p>
                    <Clock className="mr-2 inline-block h-4 w-4" />
                    {new Date(meeting.scheduled_date).toLocaleTimeString()} ({meeting.duration})
                  </p>
                  <p>
                    <Video className="mr-2 inline-block h-4 w-4" />
                    Platform: {meeting.platform}
                  </p>
                  <p>
                    <ExternalLink className="mr-2 inline-block h-4 w-4" />
                    <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </p>
                  <Badge variant="secondary">
                    Status: {meeting.status || 'Scheduled'}
                  </Badge>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-4">
                <Button size="sm" variant="outline" onClick={() => handleEditMeeting(meeting)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteMeeting(meeting.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Create a new live meeting for your course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newMeetingData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_id" className="text-right">
                Course
              </Label>
              <Select
                value={newMeetingData.course_id}
                onValueChange={(value) => handleSelectChange('course_id', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduled_date" className="text-right">
                Schedule
              </Label>
              <Input
                type="datetime-local"
                id="scheduled_date"
                name="scheduled_date"
                value={newMeetingData.scheduled_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                name="duration"
                value={newMeetingData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 60 minutes"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meeting_link" className="text-right">
                Meeting Link
              </Label>
              <Input
                type="url"
                id="meeting_link"
                name="meeting_link"
                value={newMeetingData.meeting_link}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor_name" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor_name"
                name="instructor_name"
                value={newMeetingData.instructor_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Select
                value={newMeetingData.platform}
                onValueChange={(value) => handleSelectChange('platform', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newMeetingData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateMeeting}>
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>
              Edit the details of the live meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={newMeetingData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-course_id" className="text-right">
                Course
              </Label>
              <Select
                value={newMeetingData.course_id}
                onValueChange={(value) => handleSelectChange('course_id', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-scheduled_date" className="text-right">
                Schedule
              </Label>
              <Input
                type="datetime-local"
                id="edit-scheduled_date"
                name="scheduled_date"
                value={newMeetingData.scheduled_date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                Duration
              </Label>
              <Input
                id="edit-duration"
                name="duration"
                value={newMeetingData.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-meeting_link" className="text-right">
                Meeting Link
              </Label>
              <Input
                type="url"
                id="edit-meeting_link"
                name="meeting_link"
                value={newMeetingData.meeting_link}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-instructor_name" className="text-right">
                Instructor
              </Label>
              <Input
                id="edit-instructor_name"
                name="instructor_name"
                value={newMeetingData.instructor_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={newMeetingData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateMeeting}>
              Update Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLiveMeetings;
