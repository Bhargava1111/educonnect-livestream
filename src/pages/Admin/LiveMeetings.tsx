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
import { LiveMeeting, Course } from '@/lib/types';
import {
  getAllLiveMeetings,
  createLiveMeeting,
  updateLiveMeeting,
  deleteLiveMeeting,
  updateMeetingStatuses
} from '@/lib/liveMeetingService';
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
    courseId: '',
    scheduledAt: '',
    duration: 60,
    meetingLink: '',
    maxParticipants: 50,
    isRecording: false
  });

  useEffect(() => {
    loadData();
    // Update meeting statuses when component mounts
    updateMeetingStatuses();
  }, []);

  const loadData = () => {
    const allMeetings = getAllLiveMeetings();
    const allCourses = getAllCourses();
    
    setMeetings(allMeetings);
    setCourses(allCourses);
  };

  const resetNewMeetingData = () => {
    setNewMeetingData({
      title: '',
      description: '',
      courseId: '',
      scheduledAt: '',
      duration: 60,
      meetingLink: '',
      maxParticipants: 50,
      isRecording: false
    });
  };

  const handleCreateMeeting = () => {
    if (!newMeetingData.title || !newMeetingData.courseId || !newMeetingData.scheduledAt) {
      toast({
        title: "Missing Information",
        description: "Please provide title, course, and schedule for the meeting.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newMeeting = createLiveMeeting({
        title: newMeetingData.title,
        description: newMeetingData.description,
        courseId: newMeetingData.courseId,
        scheduledAt: newMeetingData.scheduledAt,
        duration: newMeetingData.duration,
        meetingLink: newMeetingData.meetingLink,
        maxParticipants: newMeetingData.maxParticipants,
        isRecording: newMeetingData.isRecording,
        createdAt: new Date().toISOString()
      });

      setMeetings(prevMeetings => [newMeeting, ...prevMeetings]);
      setIsCreateDialogOpen(false);
      resetNewMeetingData();
      
      toast({
        title: "Meeting Scheduled",
        description: `${newMeeting.title} has been scheduled successfully.`
      });
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
      courseId: meeting.courseId,
      scheduledAt: meeting.scheduledAt,
      duration: meeting.duration,
      meetingLink: meeting.meetingLink,
      maxParticipants: meeting.maxParticipants,
      isRecording: meeting.isRecording
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMeeting = () => {
    if (!editingMeeting) return;

    try {
      const updatedMeeting = updateLiveMeeting(editingMeeting.id, {
        title: newMeetingData.title,
        description: newMeetingData.description,
        courseId: newMeetingData.courseId,
        scheduledAt: newMeetingData.scheduledAt,
        duration: newMeetingData.duration,
        meetingLink: newMeetingData.meetingLink,
        maxParticipants: newMeetingData.maxParticipants,
        isRecording: newMeetingData.isRecording
      });

      if (updatedMeeting) {
        setMeetings(prevMeetings => 
          prevMeetings.map(meeting => 
            meeting.id === editingMeeting.id ? updatedMeeting : meeting
          )
        );
      }

      setIsEditDialogOpen(false);
      setEditingMeeting(null);
      resetNewMeetingData();
      
      toast({
        title: "Meeting Updated",
        description: `${newMeetingData.title} has been updated successfully.`
      });
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMeeting = (id: string) => {
    try {
      deleteLiveMeeting(id);
      setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== id));
      
      toast({
        title: "Meeting Deleted",
        description: "Meeting has been deleted successfully."
      });
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
    const { name, value, type, checked } = e.target;
    setNewMeetingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
          const course = courses.find(c => c.id === meeting.courseId);
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
                    {new Date(meeting.scheduledAt).toLocaleDateString()}
                  </p>
                  <p>
                    <Clock className="mr-2 inline-block h-4 w-4" />
                    {new Date(meeting.scheduledAt).toLocaleTimeString()} ({meeting.duration} minutes)
                  </p>
                  <p>
                    <Users className="mr-2 inline-block h-4 w-4" />
                    {meeting.maxParticipants} Participants
                  </p>
                  <p>
                    <Video className="mr-2 inline-block h-4 w-4" />
                    Recording: {meeting.isRecording ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <ExternalLink className="mr-2 inline-block h-4 w-4" />
                    <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
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
              <Label htmlFor="courseId" className="text-right">
                Course
              </Label>
              <Select
                value={newMeetingData.courseId}
                onValueChange={(value) => handleSelectChange('courseId', value)}
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
              <Label htmlFor="scheduledAt" className="text-right">
                Schedule
              </Label>
              <Input
                type="datetime-local"
                id="scheduledAt"
                name="scheduledAt"
                value={newMeetingData.scheduledAt}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (minutes)
              </Label>
              <Input
                type="number"
                id="duration"
                name="duration"
                value={newMeetingData.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meetingLink" className="text-right">
                Meeting Link
              </Label>
              <Input
                type="url"
                id="meetingLink"
                name="meetingLink"
                value={newMeetingData.meetingLink}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxParticipants" className="text-right">
                Max Participants
              </Label>
              <Input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={newMeetingData.maxParticipants}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isRecording" className="text-right">
                Recording
              </Label>
              <Input
                type="checkbox"
                id="isRecording"
                name="isRecording"
                checked={newMeetingData.isRecording}
                onChange={handleInputChange}
                className="col-span-3"
              />
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
              <Label htmlFor="edit-courseId" className="text-right">
                Course
              </Label>
              <Select
                value={newMeetingData.courseId}
                onValueChange={(value) => handleSelectChange('courseId', value)}
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
              <Label htmlFor="edit-scheduledAt" className="text-right">
                Schedule
              </Label>
              <Input
                type="datetime-local"
                id="edit-scheduledAt"
                name="scheduledAt"
                value={newMeetingData.scheduledAt}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                Duration (minutes)
              </Label>
              <Input
                type="number"
                id="edit-duration"
                name="duration"
                value={newMeetingData.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-meetingLink" className="text-right">
                Meeting Link
              </Label>
              <Input
                type="url"
                id="edit-meetingLink"
                name="meetingLink"
                value={newMeetingData.meetingLink}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-maxParticipants" className="text-right">
                Max Participants
              </Label>
              <Input
                type="number"
                id="edit-maxParticipants"
                name="maxParticipants"
                value={newMeetingData.maxParticipants}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isRecording" className="text-right">
                Recording
              </Label>
              <Input
                type="checkbox"
                id="edit-isRecording"
                name="isRecording"
                checked={newMeetingData.isRecording}
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
