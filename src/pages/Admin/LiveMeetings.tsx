
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Edit, Plus, Trash, Video } from 'lucide-react';
import { 
  getAllLiveMeetings, 
  createLiveMeeting, 
  updateLiveMeeting, 
  deleteLiveMeeting,
  getLiveMeetingById,
  getUpcomingLiveMeetings,
  getCompletedLiveMeetings
} from '@/lib/liveMeetingService';
import { getAllCourses } from '@/lib/courseService';
import { LiveMeeting, Course } from '@/lib/types';

const AdminLiveMeetings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
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
    date: new Date().toLocaleDateString(),
    time: '',
    duration: '',
    link: '',
    status: 'upcoming'
  });
  
  useEffect(() => {
    loadMeetings();
    loadCourses();
  }, [activeTab]);
  
  const loadMeetings = () => {
    let meetingsData: LiveMeeting[] = [];
    
    if (activeTab === 'upcoming') {
      meetingsData = getUpcomingLiveMeetings();
    } else if (activeTab === 'completed') {
      meetingsData = getCompletedLiveMeetings();
    } else {
      meetingsData = getAllLiveMeetings();
    }
    
    setMeetings(meetingsData);
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
      const newMeeting = createLiveMeeting(formData);
      
      toast({
        title: "Session Scheduled",
        description: `${newMeeting.title} has been scheduled successfully.`
      });
      
      // Reset form and close modal
      setFormData({
        courseId: '',
        title: '',
        description: '',
        instructor: '',
        date: new Date().toLocaleDateString(),
        time: '',
        duration: '',
        link: '',
        status: 'upcoming'
      });
      setIsAddModalOpen(false);
      
      // Reload meetings
      loadMeetings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditMeeting = () => {
    if (!selectedMeeting) return;
    
    try {
      updateLiveMeeting(selectedMeeting.id, formData);
      
      toast({
        title: "Session Updated",
        description: `${formData.title} has been updated successfully.`
      });
      
      // Reset and close modal
      setSelectedMeeting(null);
      setIsEditModalOpen(false);
      
      // Reload meetings
      loadMeetings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update session. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      try {
        deleteLiveMeeting(meetingId);
        
        toast({
          title: "Session Deleted",
          description: "The session has been deleted successfully."
        });
        
        // Reload meetings
        loadMeetings();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete session. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openEditModal = (meetingId: string) => {
    const meeting = getLiveMeetingById(meetingId);
    if (meeting) {
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
    } else {
      toast({
        title: "Error",
        description: "Meeting not found.",
        variant: "destructive"
      });
    }
  };
  
  const startMeeting = (link: string) => {
    if (!link) {
      toast({
        title: "Meeting Link Error",
        description: "The meeting link is not available.",
        variant: "destructive"
      });
      return;
    }
    
    // Open meeting link in a new tab
    window.open(link, '_blank');
    
    toast({
      title: "Starting Meeting",
      description: "Redirecting to the meeting room."
    });
  };
  
  // Get course name by ID
  const getCourseNameById = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Live Sessions</h1>
          <p className="text-gray-500">Manage all scheduled and completed sessions</p>
        </div>
        <Button onClick={() => {
          setFormData({
            courseId: '',
            title: '',
            description: '',
            instructor: '',
            date: new Date().toLocaleDateString(),
            time: '',
            duration: '',
            link: '',
            status: 'upcoming'
          });
          setIsAddModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Session
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No {activeTab} sessions found.
                    {activeTab === 'upcoming' && (
                      <div className="mt-2">
                        <Button variant="link" onClick={() => setIsAddModalOpen(true)}>
                          Schedule a new session
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">
                      {meeting.title}
                    </TableCell>
                    <TableCell>{getCourseNameById(meeting.courseId)}</TableCell>
                    <TableCell>{meeting.instructor}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          {meeting.date}
                        </span>
                        <span className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {meeting.time} ({meeting.duration})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={meeting.status === 'upcoming' ? 'default' : 'secondary'}>
                        {meeting.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {meeting.status === 'upcoming' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startMeeting(meeting.link)}
                          >
                            <Video className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditModal(meeting.id)}
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
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule New Session</CardTitle>
              <CardDescription>Create a new live session for students</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseId">Select Course</Label>
                  <Select 
                    value={formData.courseId} 
                    onValueChange={(value) => handleSelectChange('courseId', value)}
                  >
                    <SelectTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    rows={3} 
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
                    <Input 
                      id="date" 
                      name="date" 
                      type="date"
                      value={formData.date} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      name="time" 
                      type="time"
                      value={formData.time} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input 
                      id="duration" 
                      name="duration" 
                      placeholder="e.g. 60 minutes" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link">Meeting Link</Label>
                    <Input 
                      id="link" 
                      name="link" 
                      placeholder="https://meet.google.com/..." 
                      value={formData.link} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMeeting}>Schedule Session</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Edit Meeting Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Session</CardTitle>
              <CardDescription>Update session details</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Session Title</Label>
                  <Input 
                    id="edit-title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-courseId">Course</Label>
                  <Select 
                    value={formData.courseId} 
                    onValueChange={(value) => handleSelectChange('courseId', value)}
                  >
                    <SelectTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    rows={3} 
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
                    <Input 
                      id="edit-date" 
                      name="date" 
                      type="date"
                      value={formData.date} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Time</Label>
                    <Input 
                      id="edit-time" 
                      name="time" 
                      type="time"
                      value={formData.time} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Duration</Label>
                    <Input 
                      id="edit-duration" 
                      name="duration" 
                      placeholder="e.g. 60 minutes" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-link">Meeting Link</Label>
                    <Input 
                      id="edit-link" 
                      name="link" 
                      placeholder="https://meet.google.com/..." 
                      value={formData.link} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
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
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEditMeeting}>Update Session</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminLiveMeetings;
