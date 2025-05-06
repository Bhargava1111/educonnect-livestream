import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  createQuestion,
  getCourseById,
  Assessment
} from "@/lib/courseManagement";
import { Plus, Edit, Trash, Clock, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminAssessments = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    type: 'quiz',
    timeLimit: 30,
    passingScore: 70
  });
  const [newAssessmentData, setNewAssessmentData] = useState({
    courseId: '',
    title: '',
    description: '',
    type: 'quiz',
    timeLimit: 30,
    passingScore: 70
  });
  
  useEffect(() => {
    loadAssessments();
  }, []);
  
  const loadAssessments = () => {
    try {
      const allAssessments = getAllAssessments();
      setAssessments(allAssessments);
    } catch (error) {
      toast({
        title: "Error Loading Assessments",
        description: "There was a problem loading the assessments.",
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
  
  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };
  
  const handleAddAssessment = () => {
    if (!formData.courseId || !formData.title) {
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
      
      const newAssessment = createAssessment({
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        questions: [],
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        type: formData.type as any
      });
      
      toast({
        title: "Assessment Created",
        description: "The assessment has been created successfully."
      });
      
      loadAssessments();
      setIsAddDialogOpen(false);
      setFormData({
        courseId: '',
        title: '',
        description: '',
        type: 'quiz',
        timeLimit: 30,
        passingScore: 70
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditAssessment = () => {
    if (!currentAssessment || !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updated = updateAssessment(currentAssessment.id, {
        title: formData.title,
        description: formData.description,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        type: formData.type as any
      });
      
      if (updated) {
        toast({
          title: "Assessment Updated",
          description: "The assessment has been updated successfully."
        });
        
        loadAssessments();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assessment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteAssessment = (id: string) => {
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      try {
        const result = deleteAssessment(id);
        
        if (result) {
          toast({
            title: "Assessment Deleted",
            description: "The assessment has been deleted successfully."
          });
          
          loadAssessments();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete assessment. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openEditDialog = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setFormData({
      courseId: assessment.courseId,
      title: assessment.title,
      description: assessment.description,
      type: assessment.type || 'quiz',
      timeLimit: assessment.timeLimit || 30,
      passingScore: assessment.passingScore || 70
    });
    setIsEditDialogOpen(true);
  };
  
  const handleCreateAssessment = () => {
    if (!newAssessmentData.courseId || !newAssessmentData.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newAssessment = createAssessment({
        courseId: newAssessmentData.courseId,
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

  const resetNewAssessmentData = () => {
    setNewAssessmentData({
      courseId: '',
      title: '',
      description: '',
      type: 'quiz',
      timeLimit: 30,
      passingScore: 70
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Assessments</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assessment
        </Button>
      </div>
      
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-2">No Assessments Found</h2>
            <p className="text-gray-500 mb-4 text-center">
              There are no assessments in the system yet. Click the button below to create your first assessment.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Passing Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map(assessment => {
                  const course = getCourseById(assessment.courseId);
                  return (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>{course?.title || 'Unknown Course'}</TableCell>
                      <TableCell>
                        {assessment.type === 'quiz' && 'Multiple Choice Quiz'}
                        {assessment.type === 'coding-challenge' && 'Coding Challenge'}
                        {assessment.type === 'project' && 'Project Assessment'}
                        {assessment.type === 'exam' && 'Comprehensive Exam'}
                      </TableCell>
                      <TableCell>{assessment.questions.length}</TableCell>
                      <TableCell>{assessment.timeLimit || 30} minutes</TableCell>
                      <TableCell>{assessment.passingScore || 70}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(assessment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteAssessment(assessment.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Add Assessment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Assessment</DialogTitle>
            <DialogDescription>
              Create an assessment to evaluate student progress and understanding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseId" className="text-right">
                Course
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
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Multiple Choice Quiz</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                  <SelectItem value="project">Project Assessment</SelectItem>
                  <SelectItem value="exam">Comprehensive Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Time Limit (min)
              </Label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleNumberChange('timeLimit', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score (%)
              </Label>
              <Input
                id="passingScore"
                name="passingScore"
                type="number"
                value={formData.passingScore}
                onChange={(e) => handleNumberChange('passingScore', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAssessment}>Create Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Assessment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Assessment</DialogTitle>
            <DialogDescription>
              Update the assessment details.
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
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Multiple Choice Quiz</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                  <SelectItem value="project">Project Assessment</SelectItem>
                  <SelectItem value="exam">Comprehensive Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeLimit" className="text-right">
                Time Limit (min)
              </Label>
              <Input
                id="timeLimit"
                name="timeLimit"
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleNumberChange('timeLimit', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score (%)
              </Label>
              <Input
                id="passingScore"
                name="passingScore"
                type="number"
                value={formData.passingScore}
                onChange={(e) => handleNumberChange('passingScore', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAssessment}>Update Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAssessments;
