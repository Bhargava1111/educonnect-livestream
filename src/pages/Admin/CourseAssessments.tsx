
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
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
  getCourseById, 
  Assessment, 
  Question,
  getAllAssessments,
  getAssessmentsByCourseId,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  createQuestion
} from "@/lib/courseManagement";
import { ArrowLeft, Plus, Trash, Edit, Clock, Award } from 'lucide-react';

const CourseAssessments = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz',
    timeLimit: 30,
    passingScore: 70
  });
  const [questionData, setQuestionData] = useState<{
    text: string;
    options: string[];
    correctAnswerIndex: number;
    points: number;
    type: 'multiple-choice' | 'coding' | 'essay';
    codingTemplate?: string;
  }>({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    points: 10,
    type: 'multiple-choice',
    codingTemplate: ''
  });
  
  useEffect(() => {
    if (!courseId) return;
    
    // Load course
    const loadedCourse = getCourseById(courseId);
    if (loadedCourse) {
      setCourse(loadedCourse);
    } else {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive"
      });
      navigate('/admin/courses');
      return;
    }
    
    // Load assessments
    loadAssessments();
  }, [courseId]);
  
  const loadAssessments = () => {
    if (!courseId) return;
    
    try {
      const courseAssessments = getAssessmentsByCourseId(courseId);
      setAssessments(courseAssessments);
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
  
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestionData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData(prev => ({ ...prev, options: newOptions }));
  };
  
  const handleAddAssessment = () => {
    if (!courseId) return;
    
    try {
      const newAssessment = createAssessment({
        courseId,
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
      
      setAssessments(prev => [...prev, newAssessment]);
      setIsAddDialogOpen(false);
      setFormData({
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
    if (!currentAssessment) return;
    
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
      title: assessment.title,
      description: assessment.description,
      type: assessment.type || 'quiz',
      timeLimit: assessment.timeLimit || 30,
      passingScore: assessment.passingScore || 70
    });
    setIsEditDialogOpen(true);
  };
  
  const openAddQuestionDialog = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setQuestionData({
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      points: 10,
      type: 'multiple-choice',
      codingTemplate: ''
    });
    setIsQuestionDialogOpen(true);
  };
  
  const handleAddQuestion = () => {
    if (!currentAssessment) return;
    
    try {
      const newQuestion = createQuestion(
        questionData.text,
        questionData.options,
        questionData.correctAnswerIndex,
        questionData.points,
        questionData.type
      );
      
      if (questionData.type === 'coding' && questionData.codingTemplate) {
        (newQuestion as any).codingTemplate = questionData.codingTemplate;
      }
      
      const updatedQuestions = [...currentAssessment.questions, newQuestion];
      
      const updated = updateAssessment(currentAssessment.id, {
        questions: updatedQuestions
      });
      
      if (updated) {
        toast({
          title: "Question Added",
          description: "The question has been added to the assessment successfully."
        });
        
        loadAssessments();
        setIsQuestionDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin/courses" className="text-blue-600 hover:text-blue-700 flex items-center mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{course?.title} - Assessments</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Assessment
          </Button>
        </div>
      </div>
      
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h3 className="text-lg font-medium mb-2">No Assessments Yet</h3>
            <p className="text-gray-500 mb-4 text-center">
              This course doesn't have any assessments yet. Add your first assessment to help evaluate student progress.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessments.map(assessment => (
            <Card key={assessment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {assessment.type === 'quiz' && 'Multiple Choice Quiz'}
                      {assessment.type === 'coding-challenge' && 'Coding Challenge'}
                      {assessment.type === 'project' && 'Project Assessment'}
                      {assessment.type === 'exam' && 'Comprehensive Exam'}
                    </CardDescription>
                  </div>
                  <div className="flex">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(assessment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteAssessment(assessment.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                <div className="flex items-center text-sm mb-2">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{assessment.timeLimit || 30} minutes</span>
                </div>
                <div className="flex items-center text-sm mb-3">
                  <Award className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Passing score: {assessment.passingScore || 70}%</span>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Questions: {assessment.questions.length}</h4>
                  <div className="h-[2px] bg-gray-100 w-full mb-3"></div>
                  
                  {assessment.questions.length > 0 ? (
                    <ul className="text-sm">
                      {assessment.questions.slice(0, 3).map((q, index) => (
                        <li key={q.id} className="mb-1 truncate">
                          {index + 1}. {q.text}
                        </li>
                      ))}
                      {assessment.questions.length > 3 && (
                        <li className="text-gray-500 text-xs">
                          + {assessment.questions.length - 3} more questions
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No questions added yet.</p>
                  )}
                </div>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Button variant="outline" className="w-full" onClick={() => openAddQuestionDialog(assessment)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
      
      {/* Add Question Dialog */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>
              Add a new question to {currentAssessment?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questionType" className="text-right">
                Question Type
              </Label>
              <Select
                value={questionData.type}
                onValueChange={(value: any) => setQuestionData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="coding">Coding Question</SelectItem>
                  <SelectItem value="essay">Essay Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="text" className="text-right pt-2">
                Question
              </Label>
              <Textarea
                id="text"
                name="text"
                value={questionData.text}
                onChange={handleQuestionChange}
                className="col-span-3"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                name="points"
                type="number"
                value={questionData.points}
                onChange={(e) => setQuestionData(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                className="col-span-3"
              />
            </div>
            
            {questionData.type === 'multiple-choice' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Options
                </Label>
                <div className="col-span-3 space-y-2">
                  {questionData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        checked={questionData.correctAnswerIndex === index}
                        onChange={() => setQuestionData(prev => ({ ...prev, correctAnswerIndex: index }))}
                      />
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  {questionData.options.length < 6 && (
                    <Button 
                      variant="outline" 
                      type="button"
                      size="sm"
                      onClick={() => setQuestionData(prev => ({ ...prev, options: [...prev.options, ''] }))}
                    >
                      Add Option
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {questionData.type === 'coding' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="codingTemplate" className="text-right pt-2">
                  Code Template
                </Label>
                <Textarea
                  id="codingTemplate"
                  name="codingTemplate"
                  value={questionData.codingTemplate || ''}
                  onChange={handleQuestionChange}
                  className="col-span-3 font-mono text-sm"
                  rows={6}
                  placeholder="// Add starting code template here\nfunction solution() {\n  // Student will implement this\n}"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseAssessments;
