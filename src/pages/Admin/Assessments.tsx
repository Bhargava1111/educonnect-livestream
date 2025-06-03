import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash, Search, Download } from 'lucide-react';
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
  getAssessmentsByCourseId
} from '@/lib/assessmentService';
import { getAllCourses } from '@/lib/courseService';

const AdminAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [newAssessmentData, setNewAssessmentData] = useState({
    title: '',
    description: '',
    courseId: '',
    timeLimit: 60,
    passingScore: 70,
    type: 'quiz' as 'quiz' | 'coding-challenge' | 'project' | 'exam'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allAssessments = getAllAssessments();
    const allCourses = getAllCourses();
    
    setAssessments(allAssessments);
    setCourses(allCourses);
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || assessment.courseId === selectedCourse;
    const matchesType = selectedType === 'all' || assessment.type === selectedType;
    
    return matchesSearch && matchesCourse && matchesType;
  });

  const handleExportCSV = () => {
    const headers = [
      'Title',
      'Course',
      'Type',
      'Duration (min)',
      'Passing Score (%)',
      'Questions',
      'Status'
    ];
    
    const csvData = filteredAssessments.map(assessment => {
      const course = courses.find(c => c.id === assessment.courseId);
      return [
        assessment.title,
        course?.title || 'Unknown Course',
        assessment.type || 'quiz',
        assessment.timeLimit || assessment.duration,
        assessment.passingScore || assessment.passingMarks,
        assessment.questions?.length || 0,
        assessment.isActive ? 'Active' : 'Inactive'
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'assessments_export.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetNewAssessmentData = () => {
    setNewAssessmentData({
      title: '',
      description: '',
      courseId: '',
      timeLimit: 60,
      passingScore: 70,
      type: 'quiz'
    });
  };

  const handleCreateAssessment = () => {
    if (!newAssessmentData.title || !newAssessmentData.courseId) {
      toast({
        title: "Missing Information",
        description: "Please provide title and course for the assessment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newAssessment = createAssessment({
        title: newAssessmentData.title,
        description: newAssessmentData.description,
        courseId: newAssessmentData.courseId,
        questions: [],
        passingScore: newAssessmentData.passingScore,
        type: newAssessmentData.type,
        duration: newAssessmentData.timeLimit,
        timeLimit: newAssessmentData.timeLimit,
        totalMarks: 100,
        passingMarks: newAssessmentData.passingScore,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      setAssessments(prevAssessments => [newAssessment, ...prevAssessments]);
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
    setEditingAssessment(assessment);
    setNewAssessmentData({
      title: assessment.title,
      description: assessment.description,
      courseId: assessment.courseId,
      timeLimit: assessment.timeLimit || assessment.duration || 60,
      passingScore: assessment.passingScore || assessment.passingMarks || 70,
      type: assessment.type || 'quiz'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAssessment = () => {
    if (!editingAssessment) return;

    try {
      const updatedAssessment = updateAssessment(editingAssessment.id, {
        title: newAssessmentData.title,
        description: newAssessmentData.description,
        courseId: newAssessmentData.courseId,
        timeLimit: newAssessmentData.timeLimit,
        passingScore: newAssessmentData.passingScore,
        type: newAssessmentData.type,
        duration: newAssessmentData.timeLimit
      });

      if (updatedAssessment) {
        setAssessments(prevAssessments => 
          prevAssessments.map(assessment => 
            assessment.id === editingAssessment.id ? updatedAssessment : assessment
          )
        );
      }

      setIsEditDialogOpen(false);
      setEditingAssessment(null);
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
      setAssessments(prevAssessments => prevAssessments.filter(assessment => assessment.id !== id));
      
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssessmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'type') {
      setNewAssessmentData(prev => ({
        ...prev,
        [name]: value as 'quiz' | 'coding-challenge' | 'project' | 'exam'
      }));
    } else {
      setNewAssessmentData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Assessments</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Search assessments..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-64">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map(assessment => {
          const course = courses.find(c => c.id === assessment.courseId);
          return (
            <Card key={assessment.id}>
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>{course?.title || 'Unknown Course'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Type:</strong> {assessment.type || 'Quiz'}</p>
                  <p><strong>Duration:</strong> {assessment.timeLimit || assessment.duration} minutes</p>
                  <p><strong>Passing Score:</strong> {assessment.passingScore || assessment.passingMarks}%</p>
                  <p><strong>Questions:</strong> {assessment.questions?.length || 0}</p>
                  <p><strong>Status:</strong> {assessment.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-4">
                <Button size="sm" variant="outline" onClick={() => handleEditAssessment(assessment)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteAssessment(assessment.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Assessment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Add a new assessment to a course.
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
              <Label htmlFor="courseId" className="text-right">
                Course
              </Label>
              <Select
                value={newAssessmentData.courseId}
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
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newAssessmentData.type}
                onValueChange={(value: string) => handleSelectChange('type', value)}
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
            <Button type="button" variant="secondary" onClick={() => {
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
