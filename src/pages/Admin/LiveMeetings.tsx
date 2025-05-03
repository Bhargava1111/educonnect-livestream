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
  deleteLiveMeeting
} from '@/lib/liveMeetingService';
import { LiveMeeting } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription as UIDialogDescription,
  DialogHeader,
  DialogTitle as UIDialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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

  // Updated to match the LiveMeeting type
  const [newMeeting, setNewMeeting] = useState<Omit<LiveMeeting, "id">>({
    courseId: '',
    title: '',
    description: '',
    hostName: '', // Use hostName instead of instructor
    scheduledDate: '', // Combined date and time
    duration: '',
    meetingLink: '', // Use meetingLink instead of link
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    // Backward compatibility fields
    instructor: '',
    date: '',
    time: '',
    link: ''
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      const meetingsData = getAllLiveMeetings();
      setMeetings(meetingsData);
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

  const handleAddMeeting = () => {
    if (
      !newMeeting.courseId ||
      !newMeeting.title ||
      !newMeeting.description ||
      !newMeeting.hostName ||
      !newMeeting.scheduledDate ||
      !newMeeting.duration ||
      !newMeeting.meetingLink
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newMeetingData: Omit<LiveMeeting, "id"> = {
      courseId: newMeeting.courseId,
      title: newMeeting.title,
      description: newMeeting.description,
      hostName: newMeeting.hostName,
      scheduledDate: newMeeting.scheduledDate,
      duration: newMeeting.duration,
      meetingLink: newMeeting.meetingLink,
      status: newMeeting.status,
      createdAt: new Date().toISOString(),
      instructor: newMeeting.instructor,
      date: newMeeting.date,
      time: newMeeting.time,
      link: newMeeting.link
    };

    createLiveMeeting(newMeetingData);
    setMeetings([...meetings, { id: `meeting_${Date.now()}`, ...newMeetingData }]);
    toast({
      title: "Success",
      description: "Meeting added successfully.",
    });
    handleCloseDialog();

    // Update the form field handling to set both new and old properties for backward compatibility
    setNewMeeting({
      courseId: '',
      title: '',
      description: '',
      hostName: '', 
      scheduledDate: '',
      duration: '',
      meetingLink: '',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      // For backward compatibility
      instructor: '',
      date: '',
      time: '',
      link: ''
    });
  };

  const handleEditMeeting = () => {
    if (!selectedMeetingId) return;

    const updatedMeetingData: Omit<LiveMeeting, "id"> = {
      courseId: newMeeting.courseId,
      title: newMeeting.title,
      description: newMeeting.description,
      hostName: newMeeting.hostName,
      scheduledDate: newMeeting.scheduledDate,
      duration: newMeeting.duration,
      meetingLink: newMeeting.meetingLink,
      status: newMeeting.status,
      createdAt: new Date().toISOString(),
      instructor: newMeeting.instructor,
      date: newMeeting.date,
      time: newMeeting.time,
      link: newMeeting.link
    };

    updateLiveMeeting(selectedMeetingId, updatedMeetingData);
    const updatedMeetings = meetings.map(meeting =>
      meeting.id === selectedMeetingId ? { id: selectedMeetingId, ...updatedMeetingData } : meeting
    );
    setMeetings(updatedMeetings);
    toast({
      title: "Success",
      description: "Meeting updated successfully.",
    });
    handleCloseDialog();
  };

  const handleDeleteMeeting = (id: string) => {
    deleteLiveMeeting(id);
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    toast({
      title: "Success",
      description: "Meeting deleted successfully.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewMeeting(prev => {
      const updated = { ...prev, [name]: value };
      
      // Handle backward compatibility between old and new field names
      if (name === 'instructor') {
        updated.hostName = value;
      } else if (name === 'hostName') {
        updated.instructor = value;
      } else if (name === 'link') {
        updated.meetingLink = value;
      } else if (name === 'meetingLink') {
        updated.link = value;
      } else if (name === 'date' || name === 'time') {
        // If date or time changes, update the scheduledDate
        const date = name === 'date' ? value : prev.date;
        const time = name === 'time' ? value : prev.time;
        if (date && time) {
          updated.scheduledDate = `${date}T${time}`;
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
      setNewMeeting({
        courseId: meetingToEdit.courseId,
        title: meetingToEdit.title,
        description: meetingToEdit.description,
        hostName: meetingToEdit.hostName,
        scheduledDate: meetingToEdit.scheduledDate,
        duration: meetingToEdit.duration,
        meetingLink: meetingToEdit.meetingLink,
        status: meetingToEdit.status,
        createdAt: meetingToEdit.createdAt,
        instructor: meetingToEdit.instructor,
        date: meetingToEdit.date,
        time: meetingToEdit.time,
        link: meetingToEdit.link
      });
    }
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
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ScrollArea>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{courses.find(course => course.id === meeting.courseId)?.title || 'Unknown'}</TableCell>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>{meeting.description}</TableCell>
                      <TableCell>{meeting.hostName}</TableCell>
                      <TableCell>{meeting.date}</TableCell>
                      <TableCell>{meeting.time}</TableCell>
                      <TableCell>{meeting.duration}</TableCell>
                      <TableCell>{meeting.link}</TableCell>
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
                  ))}
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
                <Label htmlFor="courseId">Course</Label>
                <select
                  id="courseId"
                  className="border rounded-md px-4 py-2 w-full"
                  value={newMeeting.courseId}
                  onChange={handleInputChange}
                  name="courseId"
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
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={newMeeting.instructor}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newMeeting.date}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={newMeeting.time}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="link">Link</Label>
                <Input
                  type="text"
                  id="link"
                  name="link"
                  value={newMeeting.link}
                  onChange={handleInputChange}
                  className="w-full"
                />
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
                <option value="upcoming">Upcoming</option>
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
