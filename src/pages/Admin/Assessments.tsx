
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Assessment,
  AssessmentQuestion,
  Course,
} from '@/lib/types';
import {
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from '@/lib/assessmentService';
import { getAllCourses } from '@/lib/courseService';
import { Plus, FileEdit, Trash2, Search } from 'lucide-react';

const AdminAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [newAssessmentData, setNewAssessmentData] = useState({
    title: '',
    description: '',
    courseId: '',
    questions: [] as AssessmentQuestion[],
    timeLimit: 60,
    passingScore: 70,
    type: 'quiz' as 'quiz' | 'coding-challenge' | 'project' | 'exam'
  });

  useEffect(() => {
    loadAssessmentsAndCourses();
  }, []);

  useEffect(() => {
    filterAssessments();
  }, [searchTerm, selectedCourse, assessments]);

  const loadAssessmentsAndCourses = () => {
    const allAssessments = getAllAssessments();
    const allCourses = getAllCourses();
    setAssessments(allAssessments);
    setCourses(allCourses);
  };

  const filterAssessments = () => {
    let filtered = assessments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        assessment =>
          assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(assessment => assessment.courseId === selectedCourse);
    }

    setFilteredAssessments(filtered);
  };

  const handleCreateAssessment = () => {
    if (!newAssessmentData.title || !newAssessmentData.courseId) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and select a course.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create assessment with required fields
      const newAssessment = createAssessment({
        title: newAssessmentData.title,
        description: newAssessmentData.description,
        courseId: newAssessmentData.courseId,
        questions: [],
        passingScore: newAssessmentData.passingScore,
        type: newAssessmentData.type,
        duration: newAssessmentData.timeLimit,
        timeLimit: newAssessmentData.timeLimit
      });

      setAssessments([...assessments, newAssessment]);
      setIsCreateDialogOpen(false);
      resetNewAssessmentData();
      
      toast({
        title: "Assessment Created",
        description: `${newAssessment.title} has been created successfully.`
      });
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessmentId(assessment.id);
    setNewAssessmentData({
      title: assessment.title,
      description: assessment.description,
      courseId: assessment.courseId,
      questions: assessment.questions || [],
      timeLimit: assessment.timeLimit || 60,
      passingScore: assessment.passingScore,
      type: assessment.type || 'quiz'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAssessment = () => {
    if (!editingAssessmentId || !newAssessmentData.title || !newAssessmentData.courseId) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information.",
        variant: "destructive"
      });
      return;
    }

    try {
      updateAssessment(editingAssessmentId, {
        title: newAssessmentData.title,
        description: newAssessmentData.description,
        courseId: newAssessmentData.courseId,
        timeLimit: newAssessmentData.timeLimit,
        passingScore: newAssessmentData.passingScore,
        type: newAssessmentData.type,
        duration: newAssessmentData.timeLimit
      });

      const updatedAssessments = assessments.map(assessment =>
        assessment.id === editingAssessmentId
          ? {
              ...assessment,
              title: newAssessmentData.title,
              description: newAssessmentData.description,
              courseId: newAssessmentData.courseId,
              timeLimit: newAssessmentData.timeLimit,
              passingScore: newAssessmentData.passingScore,
              type: newAssessmentData.type
            }
          : assessment
      );

      setAssessments(updatedAssessments);
      setIsEditDialogOpen(false);
      resetNewAssessmentData();
      
      toast({
        title: "Assessment Updated",
        description: `${newAssessmentData.title} has been updated successfully.`
      });
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast({
        title: "Error",
        description: "Failed to update assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAssessment = (id: string) => {
    try {
      deleteAssessment(id);
      const updatedAssessments = assessments.filter(assessment => assessment.id !== id);
      setAssessments(updatedAssessments);
      
      toast({
        title: "Assessment Deleted",
        description: "Assessment has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to delete assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetNewAssessmentData = () => {
    setNewAssessmentData({
      title: '',
      description: '',
      courseId: '',
      questions: [],
      timeLimit: 60,
      passingScore: 70,
      type: 'quiz'
    });
    setEditingAssessmentId(null);
  };

  const handleViewDetails = (assessmentId: string) => {
    navigate(`/admin/assessments/${assessmentId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Assessments</h1>
          <p className="text-gray-500">Manage assessments for all courses</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search assessments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={selectedCourse}
          onValueChange={setSelectedCourse}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map(assessment => {
          const course = courses.find(c => c.id === assessment.courseId);
          
          return (
            <Card key={assessment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                <CardDescription>
                  {course ? `Course: ${course.title}` : 'No course assigned'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{assessment.description}</p>
                <div className="mt-2 space-y-1">
                  <div className="text-xs flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{assessment.type}</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{assessment.timeLimit || assessment.duration} minutes</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-medium">{assessment.passingScore}%</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{assessment.questions?.length || 0}</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(assessment.id)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditAssessment(assessment)}>
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteAssessment(assessment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredAssessments.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No assessments found. Create a new assessment to get started.
          </div>
        )}
      </div>

      {/* Create Assessment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Add a new assessment to your courses.
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
                value={newAssessmentData.title}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseId" className="text-right">
                Course
              </Label>
              <Select 
                value={newAssessmentData.courseId}
                onValueChange={(value) => setNewAssessmentData({...newAssessmentData, courseId: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newAssessmentData.description}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newAssessmentData.type}
                onValueChange={(value: 'quiz' | 'coding-challenge' | 'project' | 'exam') => 
                  setNewAssessmentData({...newAssessmentData, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Time Limit
              </Label>
              <Input
                id="timeLimit"
                type="number"
                value={newAssessmentData.timeLimit}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, timeLimit: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score
              </Label>
              <Input
                id="passingScore"
                type="number"
                value={newAssessmentData.passingScore}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, passingScore: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetNewAssessmentData();
              setIsCreateDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateAssessment}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assessment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Assessment</DialogTitle>
            <DialogDescription>
              Make changes to your assessment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={newAssessmentData.title}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-courseId" className="text-right">
                Course
              </Label>
              <Select 
                value={newAssessmentData.courseId}
                onValueChange={(value) => setNewAssessmentData({...newAssessmentData, courseId: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={newAssessmentData.description}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select
                value={newAssessmentData.type}
                onValueChange={(value: 'quiz' | 'coding-challenge' | 'project' | 'exam') => 
                  setNewAssessmentData({...newAssessmentData, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-timeLimit" className="text-right">
                Time Limit
              </Label>
              <Input
                id="edit-timeLimit"
                type="number"
                value={newAssessmentData.timeLimit}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, timeLimit: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-passingScore" className="text-right">
                Passing Score
              </Label>
              <Input
                id="edit-passingScore"
                type="number"
                value={newAssessmentData.passingScore}
                onChange={(e) => setNewAssessmentData({...newAssessmentData, passingScore: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetNewAssessmentData();
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateAssessment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAssessments;
