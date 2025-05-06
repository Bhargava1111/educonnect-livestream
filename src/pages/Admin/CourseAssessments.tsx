// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Assessment,
  AssessmentQuestion,
  Course,
} from '@/lib/types';
import {
  getAssessmentsByCourseId,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentById
} from '@/lib/assessmentService';
import { getCourseById } from '@/lib/courseService';
import { Plus, Pencil, Trash } from 'lucide-react';

const AdminCourseAssessments = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [newAssessmentData, setNewAssessmentData] = useState({
    title: '',
    description: '',
    questions: [],
    timeLimit: 60,
    passingScore: 70,
    type: 'quiz'
  });

  useEffect(() => {
    if (!courseId) {
      toast({
        title: "Missing Course ID",
        description: "The course ID is missing.",
        variant: "destructive"
      });
      navigate('/admin/courses');
      return;
    }

    const loadCourseAndAssessments = () => {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        toast({
          title: "Course Not Found",
          description: "The requested course could not be found.",
          variant: "destructive"
        });
        navigate('/admin/courses');
        return;
      }

      const assessmentData = getAssessmentsByCourseId(courseId);
      setAssessments(assessmentData);
    };

    loadCourseAndAssessments();
  }, [courseId, navigate, toast]);

  const resetNewAssessmentData = () => {
    setNewAssessmentData({
      title: '',
      description: '',
      questions: [],
      timeLimit: 60,
      passingScore: 70,
      type: 'quiz'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssessmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAssessmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAssessment = () => {
    if (!newAssessmentData.title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for the assessment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newAssessment = createAssessment({
        courseId: courseId,
        title: newAssessmentData.title,
        description: newAssessmentData.description,
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

  const handleEditAssessment = (id: string) => {
    const assessmentToEdit = getAssessmentById(id);
    if (assessmentToEdit) {
      setEditingAssessmentId(id);
      setNewAssessmentData({
        title: assessmentToEdit.title,
        description: assessmentToEdit.description,
        questions: assessmentToEdit.questions || [],
        timeLimit: assessmentToEdit.timeLimit || 60,
        passingScore: assessmentToEdit.passingScore,
        type: assessmentToEdit.type || 'quiz',
        
      });
      setIsEditDialogOpen(true);
    } else {
      toast({
        title: "Assessment Not Found",
        description: "The assessment you are trying to edit could not be found.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAssessment = () => {
    if (!editingAssessmentId) return;

    try {
      updateAssessment(editingAssessmentId, {
        title: newAssessmentData.title,
        description: newAssessmentData.description,
        questions: newAssessmentData.questions,
        timeLimit: newAssessmentData.timeLimit,
        passingScore: newAssessmentData.passingScore,
        type: newAssessmentData.type,
        duration: newAssessmentData.timeLimit
      });

      const updatedAssessments = assessments.map(assessment =>
        assessment.id === editingAssessmentId
          ? { ...assessment, title: newAssessmentData.title, description: newAssessmentData.description, timeLimit: newAssessmentData.timeLimit, passingScore: newAssessmentData.passingScore, type: newAssessmentData.type }
          : assessment
      );
      setAssessments(updatedAssessments);
      setIsEditDialogOpen(false);
      setEditingAssessmentId(null);
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

  if (!course) {
    return <div className="p-6">Loading course...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin/courses" className="text-eduBlue-600 hover:text-eduBlue-700 flex items-center mb-4">
          &larr; Back to Course
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{course.title} - Assessments</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map(assessment => (
          <Card key={assessment.id}>
            <CardHeader>
              <CardTitle>{assessment.title}</CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Type: {assessment.type}</p>
              <p>Time Limit: {assessment.timeLimit} minutes</p>
              <p>Passing Score: {assessment.passingScore}%</p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-4">
              <Button size="sm" variant="outline" onClick={() => handleEditAssessment(assessment.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteAssessment(assessment.id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Assessment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Add a new assessment to the course.
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
                value={newAssessmentData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Time Limit (minutes)
              </Label>
              <Input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={newAssessmentData.timeLimit}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score (%)
              </Label>
              <Input
                type="number"
                id="passingScore"
                name="passingScore"
                value={newAssessmentData.passingScore}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>
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
              Edit the assessment details.
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
                value={newAssessmentData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Time Limit (minutes)
              </Label>
              <Input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={newAssessmentData.timeLimit}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score (%)
              </Label>
              <Input
                type="number"
                id="passingScore"
                name="passingScore"
                value={newAssessmentData.passingScore}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateAssessment}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseAssessments;
