
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Edit, Plus, Share2, Trash, Video } from "lucide-react";
import {
  LiveMeeting,
  getCourseById,
  getAllLiveMeetings,
  createLiveMeeting,
  updateLiveMeeting,
  deleteLiveMeeting,
} from "@/lib/courseManagement";

const AdminSchedule = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<LiveMeeting | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    duration: '60 minutes',
    link: '',
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = () => {
    try {
      const allMeetings = getAllLiveMeetings();
      setMeetings(allMeetings);
    } catch (error) {
      toast({
        title: "Error Loading Meetings",
        description: "There was a problem loading the scheduled meetings.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMeeting = () => {
    if (!formData.courseId || !formData.title || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if course exists
      const course = getCourseById(formData.courseId);
      if (!course) {
        toast({
          title: "Course Not Found",
          description: "The selected course does not exist.",
          variant: "destructive"
        });
        return;
      }

      const newMeeting = createLiveMeeting({
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        instructor: formData.instructor,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        link: formData.link,
        status: 'upcoming'
      });

      toast({
        title: "Meeting Scheduled",
        description: "The live meeting has been scheduled successfully."
      });

      loadMeetings();
      setIsAddDialogOpen(false);
      setFormData({
        courseId: '',
        title: '',
        description: '',
        instructor: '',
        date: '',
        time: '',
        duration: '60 minutes',
        link: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditMeeting = () => {
    if (!currentMeeting || !formData.title || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const updated = updateLiveMeeting(currentMeeting.id, {
        title: formData.title,
        description: formData.description,
        instructor: formData.instructor,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        link: formData.link,
      });

      if (updated) {
        toast({
          title: "Meeting Updated",
          description: "The live meeting has been updated successfully."
        });

        loadMeetings();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm("Are you sure you want to delete this meeting? This action cannot be undone.")) {
      try {
        const result = deleteLiveMeeting(id);

        if (result) {
          toast({
            title: "Meeting Deleted",
            description: "The live meeting has been deleted successfully."
          });

          loadMeetings();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete meeting. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const openEditDialog = (meeting: LiveMeeting) => {
    setCurrentMeeting(meeting);
    setFormData({
      courseId: meeting.courseId,
      title: meeting.title,
      description: meeting.description,
      instructor: meeting.instructor,
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration,
      link: meeting.link,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Meetings</CardTitle>
          <CardDescription>
            Manage upcoming and past live meetings for courses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6">
              <h2 className="text-xl font-semibold mb-2">No Meetings Scheduled</h2>
              <p className="text-gray-500 mb-4 text-center">
                There are no meetings scheduled yet. Click the button below to schedule your first meeting.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map(meeting => {
                  const course = getCourseById(meeting.courseId);
                  return (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">{meeting.title}</TableCell>
                      <TableCell>{course?.title || 'Unknown Course'}</TableCell>
                      <TableCell>{meeting.instructor}</TableCell>
                      <TableCell>
                        {meeting.date} at {meeting.time}
                      </TableCell>
                      <TableCell>{meeting.duration}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          meeting.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {meeting.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(meeting)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteMeeting(meeting.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Meeting Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Live Meeting</DialogTitle>
            <DialogDescription>
              Create a new live meeting for students to attend.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseId" className="text-right">
                Course ID
              </Label>
              <Input
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                placeholder="Enter course ID"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
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
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange('duration', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="45 minutes">45 minutes</SelectItem>
                  <SelectItem value="60 minutes">60 minutes</SelectItem>
                  <SelectItem value="90 minutes">90 minutes</SelectItem>
                  <SelectItem value="120 minutes">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Meeting Link
              </Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://meet.google.com/xyz"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMeeting}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Live Meeting</DialogTitle>
            <DialogDescription>
              Update the details for this live meeting.
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
                value={formData.title}
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
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange('duration', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="45 minutes">45 minutes</SelectItem>
                  <SelectItem value="60 minutes">60 minutes</SelectItem>
                  <SelectItem value="90 minutes">90 minutes</SelectItem>
                  <SelectItem value="120 minutes">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Meeting Link
              </Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://meet.google.com/xyz"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMeeting}>Update Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSchedule;
