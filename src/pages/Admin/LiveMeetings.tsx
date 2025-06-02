import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAllCourses } from '@/lib/courseManagement';
import {
  createLiveMeeting,
  getAllLiveMeetings,
  updateLiveMeeting,
  deleteLiveMeeting,
  LiveMeeting
} from '@/lib/services/liveMeetingService';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from 'date-fns';

const AdminLiveMeetings = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  // Updated form state to match database schema
  const [newMeeting, setNewMeeting] = useState({
    course_id: '',
    title: '',
    description: '',
    instructor_name: '',
    scheduled_date: '',
    duration: '',
    meeting_link: '',
    platform: 'Manual',
    status: 'scheduled',
    // Legacy fields for backward compatibility
    courseId: '',
    hostName: '',
    meetingLink: '',
    instructor: '',
    date: '',
    time: '',
    link: ''
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetingsData = await getAllLiveMeetings();
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    const fetchCourses = async () => {
      const coursesData = getAllCourses();
      setCourses(coursesData);
    };

    fetchMeetings();
    fetchCourses();
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setIsEditMode(false);
    setSelectedMeetingId(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setSelectedMeetingId(null);
  };

  const handleAddMeeting = async () => {
    if (
      !newMeeting.course_id ||
      !newMeeting.title ||
      !newMeeting.description ||
      !newMeeting.instructor_name ||
      !newMeeting.scheduled_date ||
      !newMeeting.duration ||
      !newMeeting.meeting_link
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const meetingData = {
      course_id: newMeeting.course_id,
      title: newMeeting.title,
      description: newMeeting.description,
      instructor_name: newMeeting.instructor_name,
      scheduled_date: newMeeting.scheduled_date,
      duration: newMeeting.duration,
      meeting_link: newMeeting.meeting_link,
      platform: newMeeting.platform,
      status: newMeeting.status
    };

    const result = await createLiveMeeting(meetingData);
    
    if (result.success && result.data) {
      const updatedMeetings = await getAllLiveMeetings();
      setMeetings(updatedMeetings);
      toast({
        title: "Success",
        description: "Meeting added successfully.",
      });
      handleCloseDialog();
      resetForm();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create meeting.",
        variant: "destructive",
      });
    }
  };

  const handleEditMeeting = async () => {
    if (!selectedMeetingId) return;

    const updateData = {
      course_id: newMeeting.course_id,
      title: newMeeting.title,
      description: newMeeting.description,
      instructor_name: newMeeting.instructor_name,
      scheduled_date: newMeeting.scheduled_date,
      duration: newMeeting.duration,
      meeting_link: newMeeting.meeting_link,
      platform: newMeeting.platform,
      status: newMeeting.status
    };

    const result = await updateLiveMeeting(selectedMeetingId, updateData);
    
    if (result.success) {
      const updatedMeetings = await getAllLiveMeetings();
      setMeetings(updatedMeetings);
      toast({
        title: "Success",
        description: "Meeting updated successfully.",
      });
      handleCloseDialog();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update meeting.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    const result = await deleteLiveMeeting(id);
    
    if (result.success) {
      const updatedMeetings = await getAllLiveMeetings();
      setMeetings(updatedMeetings);
      toast({
        title: "Success",
        description: "Meeting deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete meeting.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewMeeting(prev => {
      const updated = { ...prev, [name]: value };
      
      // Handle field mappings for backward compatibility
      if (name === 'course_id') {
        updated.courseId = value;
      } else if (name === 'instructor_name') {
        updated.instructor = value;
        updated.hostName = value;
      } else if (name === 'meeting_link') {
        updated.link = value;
        updated.meetingLink = value;
      } else if (name === 'date' || name === 'time') {
        const date = name === 'date' ? value : prev.date;
        const time = name === 'time' ? value : prev.time;
        if (date && time) {
          updated.scheduled_date = `${date}T${time}`;
        }
      }
      
      return updated;
    });
  };

  const handleEdit = (id: string) => {
    const meetingToEdit = meetings.find(meeting => meeting.id === id);
    if (meetingToEdit) {
      setSelectedMeetingId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
      
      const scheduledDate = new Date(meetingToEdit.scheduled_date);
      const dateString = scheduledDate.toISOString().split('T')[0];
      const timeString = scheduledDate.toTimeString().slice(0, 5);
      
      setNewMeeting({
        course_id: meetingToEdit.course_id,
        title: meetingToEdit.title,
        description: meetingToEdit.description,
        instructor_name: meetingToEdit.instructor_name,
        scheduled_date: meetingToEdit.scheduled_date,
        duration: meetingToEdit.duration,
        meeting_link: meetingToEdit.meeting_link,
        platform: meetingToEdit.platform,
        status: meetingToEdit.status,
        // Legacy fields
        courseId: meetingToEdit.course_id,
        hostName: meetingToEdit.instructor_name,
        meetingLink: meetingToEdit.meeting_link,
        instructor: meetingToEdit.instructor_name,
        date: dateString,
        time: timeString,
        link: meetingToEdit.meeting_link
      });
    }
  };

  const resetForm = () => {
    setNewMeeting({
      course_id: '',
      title: '',
      description: '',
      instructor_name: '',
      scheduled_date: '',
      duration: '',
      meeting_link: '',
      platform: 'Manual',
      status: 'scheduled',
      courseId: '',
      hostName: '',
      meetingLink: '',
      instructor: '',
      date: '',
      time: '',
      link: ''
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Live Meetings</CardTitle>
            <CardDescription>Manage scheduled live meetings</CardDescription>
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Meeting
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ScrollArea>
                  {meetings.map((meeting) => {
                    const scheduledDate = new Date(meeting.scheduled_date);
                    return (
                      <TableRow key={meeting.id}>
                        <TableCell>{courses.find(course => course.id === meeting.course_id)?.title || 'Unknown'}</TableCell>
                        <TableCell>{meeting.title}</TableCell>
                        <TableCell>{meeting.description}</TableCell>
                        <TableCell>{meeting.instructor_name}</TableCell>
                        <TableCell>{scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                        <TableCell>{meeting.duration}</TableCell>
                        <TableCell>{meeting.meeting_link}</TableCell>
                        <TableCell>{meeting.status}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(meeting.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMeeting(meeting.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </ScrollArea>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <UIDialogTitle>{isEditMode ? "Edit Meeting" : "Add Meeting"}</UIDialogTitle>
            <UIDialogDescription>
              {isEditMode ? "Edit the meeting details below." : "Create a new live meeting."}
            </UIDialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course_id">Course</Label>
                <select
                  id="course_id"
                  className="border rounded-md px-4 py-2 w-full"
                  value={newMeeting.course_id}
                  onChange={handleInputChange}
                  name="course_id"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={newMeeting.title}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={newMeeting.description}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="instructor_name">Instructor</Label>
                <Input
                  type="text"
                  id="instructor_name"
                  name="instructor_name"
                  value={newMeeting.instructor_name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduled_date">Date</Label>
                <Input
                  type="date"
                  id="scheduled_date"
                  name="scheduled_date"
                  value={newMeeting.scheduled_date}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  type="text"
                  id="duration"
                  name="duration"
                  value={newMeeting.duration}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meeting_link">Link</Label>
                <Input
                  type="text"
                  id="meeting_link"
                  name="meeting_link"
                  value={newMeeting.meeting_link}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  name="platform"
                  value={newMeeting.platform}
                  onChange={handleInputChange}
                  className="border rounded-md px-4 py-2 w-full"
                >
                  <option value="Manual">Manual</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={newMeeting.status}
                onChange={handleInputChange}
                className="border rounded-md px-4 py-2 w-full"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={isEditMode ? handleEditMeeting : handleAddMeeting} className="ml-2">
              {isEditMode ? "Update Meeting" : "Add Meeting"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLiveMeetings;
