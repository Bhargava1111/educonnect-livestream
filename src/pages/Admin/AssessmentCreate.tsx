
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Assessment, 
  AssessmentQuestion,
  Question,
  Course,
} from '@/lib/types';
import { 
  createAssessment, 
  updateAssessment, 
  getAssessmentById, 
  getAllAssessments 
} from '@/lib/assessmentService';
import { getAllCourses } from '@/lib/courseService';
import { useParams } from 'react-router-dom';

const AdminAssessmentCreate = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assessment, setAssessment] = useState<Assessment>({
    id: '',
    courseId: '',
    title: '',
    description: '',
    questions: [],
    duration: 60,
    passingScore: 70,
    isPublished: false,
    requiresScreenshare: false,
    requiresCamera: false,
    timeLimit: 60,
    type: 'quiz',
    totalMarks: 100,
    passingMarks: 70,
    isActive: true,
    createdAt: new Date().toISOString()
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: '',
    text: '',
    question: '',
    type: 'multiple-choice',
    options: [],
    correctAnswer: '',
    marks: 10
  });
  
  useEffect(() => {
    // Load courses
    const loadCourses = () => {
      const allCourses = getAllCourses();
      setCourses(allCourses);
    };
    loadCourses();
    
    // Load assessment if editing
    if (assessmentId) {
      const existingAssessment = getAssessmentById(assessmentId);
      if (existingAssessment) {
        setAssessment(existingAssessment);
      } else {
        toast({
          title: "Assessment Not Found",
          description: "The requested assessment could not be found.",
          variant: "destructive"
        });
        navigate('/admin/assessments');
      }
    }
  }, [assessmentId, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssessment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setAssessment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setAssessment(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddQuestion = () => {
    const newQ: AssessmentQuestion = {
      id: `question_${Date.now()}`,
      text: newQuestion.question || newQuestion.text || '',
      question: newQuestion.question || newQuestion.text || '',
      type: newQuestion.type,
      options: newQuestion.options || [],
      correctAnswer: newQuestion.correctAnswer,
      marks: Number(newQuestion.marks)
    };
    
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions || [], newQ]
    }));
    
    setNewQuestion({
      id: '',
      text: '',
      question: '',
      type: 'multiple-choice',
      options: [],
      correctAnswer: '',
      marks: 10
    });
  };
  
  const handleRemoveQuestion = (id: string) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== id) || []
    }));
  };
  
  const handleSubmit = () => {
    const assessmentData = {
      ...assessment,
      totalMarks: assessment.totalMarks || 100,
      passingMarks: assessment.passingMarks || assessment.passingScore || 70,
      isActive: assessment.isActive !== undefined ? assessment.isActive : true,
      createdAt: assessment.createdAt || new Date().toISOString()
    };

    if (assessmentId) {
      // Update existing assessment
      updateAssessment(assessmentId, assessmentData);
      toast({
        title: "Assessment Updated",
        description: `${assessment.title} has been updated successfully.`
      });
    } else {
      // Create new assessment
      createAssessment(assessmentData);
      toast({
        title: "Assessment Created",
        description: `${assessment.title} has been created successfully.`
      });
    }
    
    navigate('/admin/assessments');
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{assessmentId ? 'Edit Assessment' : 'Create New Assessment'}</h1>
        <p className="text-gray-500">Manage assessment details and questions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
          <CardDescription>
            Enter the details for the assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={assessment.title} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="courseId">Course</Label>
              <Select 
                value={assessment.courseId} 
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
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={assessment.description} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select 
                value={assessment.type} 
                onValueChange={(value: 'quiz' | 'coding-challenge' | 'project' | 'exam') => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  value={String(assessment.duration)} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input 
                  id="passingScore" 
                  name="passingScore" 
                  type="number" 
                  value={String(assessment.passingScore)} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isPublished" 
                checked={assessment.isPublished} 
                onCheckedChange={(checked) => handleSwitchChange('isPublished', checked)} 
              />
              <Label htmlFor="isPublished">Published</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="requiresScreenshare" 
                checked={assessment.requiresScreenshare} 
                onCheckedChange={(checked) => handleSwitchChange('requiresScreenshare', checked)} 
              />
              <Label htmlFor="requiresScreenshare">Require Screen Share</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            Add and manage questions for the assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="newQuestion">Question</Label>
              <Textarea 
                id="newQuestion" 
                name="question" 
                value={newQuestion.question} 
                onChange={handleNewQuestionChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="newQuestionType">Type</Label>
              <Select 
                value={newQuestion.type} 
                onValueChange={(value: 'multiple-choice' | 'true-false' | 'fill-in-blanks' | 'descriptive' | 'coding') => 
                  setNewQuestion(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="fill-in-blanks">Fill in the Blanks</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="newQuestionMarks">Marks</Label>
              <Input 
                id="newQuestionMarks" 
                name="marks" 
                type="number" 
                value={String(newQuestion.marks)} 
                onChange={handleNewQuestionChange} 
              />
            </div>
            
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </div>
          
          <div className="mt-4">
            {assessment.questions?.map((question) => (
              <Card key={question.id} className="mb-4">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{question.question || question.text}</p>
                    <p className="text-sm text-gray-500">Type: {question.type}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleRemoveQuestion(question.id)}>
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>
          {assessmentId ? 'Update Assessment' : 'Create Assessment'}
        </Button>
      </div>
    </div>
  );
};

export default AdminAssessmentCreate;
