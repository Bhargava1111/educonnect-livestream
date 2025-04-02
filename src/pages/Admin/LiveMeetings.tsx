
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  getAllLiveMeetings, getAllCourses, createLiveMeeting, updateLiveMeeting, 
  deleteLiveMeeting, LiveMeeting, Course
} from "@/lib/courseManagement";
import { Calendar, Clock, Edit, Plus, Trash, Video } from 'lucide-react';

const AdminLiveMeetings = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<LiveMeeting | null>(null);
  
  const [formData, setFormData] = useState<Omit<LiveMeeting, 'id'>>({
    courseId: '',
    title: '',
    description: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    link: '',
    status: 'upcoming'
  });
  
  useEffect(() => {
    loadMeetings();
    loadCourses();
  }, []);
  
  const loadMeetings = () => {
    const allMeetings = getAllLiveMeetings();
    setMeetings(allMeetings);
  };
  
  const loadCourses = () => {
    const allCourses = getAllCourses();
    setCourses(allCourses);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddMeeting = () => {
    try {
      createLiveMeeting(formData);
      
      toast({
        title: "Meeting Created",
        description: "The live meeting has been scheduled successfully."
      });
      
      // Reset form and close modal
      resetForm();
      setIsAddModalOpen(false);
      
      // Reload meetings
      loadMeetings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditMeeting = () => {
    if (!selectedMeeting) return;
    
    try {
      updateLiveMeeting(selectedMeeting.id, formData);
      
      toast({
        title: "Meeting Updated",
        description: "The live meeting has been updated successfully."
      });
      
      // Reset and close modal
      resetForm();
      setSelectedMeeting(null);
      setIsEditModalOpen(false);
      
      // Reload meetings
      loadMeetings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      try {
        deleteLiveMeeting(meetingId);
        
        toast({
          title: "Meeting Deleted",
          description: "The live meeting has been deleted successfully."
        });
        
        // Reload meetings
        loadMeetings();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete meeting. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openEditModal = (meeting: LiveMeeting) => {
    setSelectedMeeting(meeting);
    setFormData({
      courseId: meeting.courseId,
      title: meeting.title,
      description: meeting.description,
      instructor: meeting.instructor,
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration,
      link: meeting.link,
      status: meeting.status
    });
    setIsEditModalOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      instructor: '',
      date: '',
      time: '',
      duration: '',
      link: '',
      status: 'upcoming'
    });
  };
  
  const getCourseNameById = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Live Meetings</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Meeting
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No live meetings scheduled. Add a new meeting to get started.</TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>{getCourseNameById(meeting.courseId)}</TableCell>
                    <TableCell>
                      {meeting.date} at {meeting.time}
                    </TableCell>
                    <TableCell>{meeting.instructor}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        meeting.status === 'upcoming' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditModal(meeting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Meeting Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Schedule New Live Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course</Label>
                  <Select 
                    value={formData.courseId}
                    onValueChange={(value) => handleSelectChange('courseId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    rows={2} 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input 
                    id="instructor" 
                    name="instructor" 
                    value={formData.instructor} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="flex">
                      <span className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="date" 
                        name="date" 
                        type="date"
                        className="rounded-l-none"
                        value={formData.date} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="flex">
                      <span className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="time" 
                        name="time" 
                        type="time"
                        className="rounded-l-none"
                        value={formData.time} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input 
                      id="duration" 
                      name="duration" 
                      placeholder="e.g. 1 hour" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'upcoming' | 'completed') => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">Meeting Link</Label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                      <Video className="h-4 w-4 text-gray-500" />
                    </span>
                    <Input 
                      id="link" 
                      name="link" 
                      className="rounded-l-none"
                      placeholder="https://meet.google.com/..." 
                      value={formData.link} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="p-6 flex justify-between">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMeeting}>Schedule Meeting</Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Edit Meeting Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Edit Live Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-courseId">Course</Label>
                  <Select 
                    value={formData.courseId}
                    onValueChange={(value) => handleSelectChange('courseId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Meeting Title</Label>
                  <Input 
                    id="edit-title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    rows={2} 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <Input 
                    id="edit-instructor" 
                    name="instructor" 
                    value={formData.instructor} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <div className="flex">
                      <span className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="edit-date" 
                        name="date" 
                        type="date"
                        className="rounded-l-none"
                        value={formData.date} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Time</Label>
                    <div className="flex">
                      <span className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="edit-time" 
                        name="time" 
                        type="time"
                        className="rounded-l-none"
                        value={formData.time} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Duration</Label>
                    <Input 
                      id="edit-duration" 
                      name="duration" 
                      placeholder="e.g. 1 hour" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'upcoming' | 'completed') => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-link">Meeting Link</Label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                      <Video className="h-4 w-4 text-gray-500" />
                    </span>
                    <Input 
                      id="edit-link" 
                      name="link" 
                      className="rounded-l-none"
                      placeholder="https://meet.google.com/..." 
                      value={formData.link} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="p-6 flex justify-between">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEditMeeting}>Update Meeting</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminLiveMeetings;
