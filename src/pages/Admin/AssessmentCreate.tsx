import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Plus, Trash, Save, Check, X, Camera, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCourseById,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  createQuestion,
  Assessment,
  Question,
  Course
} from '@/lib/courseManagement';

const AssessmentCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseId, assessmentId } = useParams<{ courseId: string, assessmentId?: string }>();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assessment, setAssessment] = useState<Assessment>({
    id: '',
    courseId: courseId || '',
    title: '',
    description: '',
    questions: [],
    timeLimit: 60,
    passingScore: 70,
    type: 'quiz',
    dueDate: '',
    requiresCamera: true,
    requiresScreenshare: true
  });
  
  useEffect(() => {
    if (!courseId) {
      toast({
        title: "Error",
        description: "Course ID is required",
        variant: "destructive"
      });
      navigate('/admin/courses');
      return;
    }
    
    // Load course information
    const courseData = getCourseById(courseId);
    if (courseData) {
      setCourse(courseData);
    } else {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found",
        variant: "destructive"
      });
      navigate('/admin/courses');
      return;
    }
    
    // If editing an existing assessment
    if (assessmentId) {
      const existingAssessment = getAssessmentById(assessmentId);
      if (existingAssessment) {
        setAssessment({
          ...existingAssessment,
          requiresCamera: existingAssessment.requiresCamera || true,
          requiresScreenshare: existingAssessment.requiresScreenshare || true
        });
      } else {
        toast({
          title: "Assessment Not Found",
          description: "The requested assessment could not be found",
          variant: "destructive"
        });
        navigate(`/admin/courses/${courseId}/assessments`);
      }
    }
  }, [courseId, assessmentId, navigate, toast]);
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      points: 10,
      type: 'multiple-choice'
    };
    
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };
  
  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...assessment.questions];
    newQuestions.splice(index, 1);
    
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...assessment.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...assessment.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...assessment.questions];
    newQuestions[questionIndex].options.push('');
    
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...assessment.questions];
    
    // Ensure we keep at least 2 options
    if (newQuestions[questionIndex].options.length <= 2) return;
    
    // If removing the correct answer, reset to first option
    if (optionIndex === newQuestions[questionIndex].correctAnswerIndex) {
      newQuestions[questionIndex].correctAnswerIndex = 0;
    }
    // If removing an option before the correct answer, adjust the index
    else if (optionIndex < newQuestions[questionIndex].correctAnswerIndex) {
      newQuestions[questionIndex].correctAnswerIndex--;
    }
    
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleSetCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...assessment.questions];
    newQuestions[questionIndex].correctAnswerIndex = optionIndex;
    
    setAssessment(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };
  
  const handleSave = () => {
    // Validate the assessment
    if (!assessment.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Assessment title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (assessment.questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one question is required",
        variant: "destructive"
      });
      return;
    }
    
    // Check if any questions are incomplete
    const incompleteQuestion = assessment.questions.find(
      q => !q.text.trim() || q.options.some(o => !o.trim())
    );
    
    if (incompleteQuestion) {
      toast({
        title: "Validation Error",
        description: "All questions and options must be filled in",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (assessmentId) {
        // Update existing assessment
        updateAssessment(assessmentId, assessment);
        toast({
          title: "Success",
          description: "Assessment updated successfully"
        });
      } else {
        // Create new assessment
        createAssessment(assessment);
        toast({
          title: "Success",
          description: "Assessment created successfully"
        });
      }
      
      // Navigate back to course assessments
      navigate(`/admin/courses/${courseId}/assessments`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link 
            to={`/admin/courses/${courseId}/assessments`}
            className="flex items-center text-eduBlue-600 hover:text-eduBlue-700 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Assessments
          </Link>
          <h1 className="text-2xl font-bold">
            {assessmentId ? 'Edit Assessment' : 'Create New Assessment'}
          </h1>
          <p className="text-gray-500">
            {course && `For course: ${course.title}`}
          </p>
        </div>
        
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Assessment
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={assessment.title}
              onChange={(e) => setAssessment({...assessment, title: e.target.value})}
              placeholder="Enter assessment title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={assessment.description}
              onChange={(e) => setAssessment({...assessment, description: e.target.value})}
              placeholder="Enter assessment description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={assessment.timeLimit}
                onChange={(e) => setAssessment({...assessment, timeLimit: parseInt(e.target.value) || 60})}
              />
            </div>
            
            <div>
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="1"
                max="100"
                value={assessment.passingScore}
                onChange={(e) => setAssessment({...assessment, passingScore: parseInt(e.target.value) || 70})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Assessment Type</Label>
              <select
                id="type"
                value={assessment.type}
                onChange={(e) => setAssessment({...assessment, type: e.target.value as any})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="coding-challenge">Coding Challenge</option>
                <option value="project">Project</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={assessment.dueDate}
                onChange={(e) => setAssessment({...assessment, dueDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresCamera"
                checked={assessment.requiresCamera}
                onCheckedChange={(checked) => setAssessment({...assessment, requiresCamera: checked})}
              />
              <div>
                <Label htmlFor="requiresCamera" className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Require Camera Recording
                </Label>
                <p className="text-sm text-gray-500">
                  Students must enable their camera during the assessment
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresScreenshare"
                checked={assessment.requiresScreenshare}
                onCheckedChange={(checked) => setAssessment({...assessment, requiresScreenshare: checked})}
              />
              <div>
                <Label htmlFor="requiresScreenshare" className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  Require Screen Sharing
                </Label>
                <p className="text-sm text-gray-500">
                  Students must share their screen during the assessment
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Questions</h2>
        <Button onClick={handleAddQuestion} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
      
      <div className="space-y-6">
        {assessment.questions.map((question, questionIndex) => (
          <Card key={questionIndex}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                <Textarea
                  id={`question-${questionIndex}`}
                  value={question.text}
                  onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                  placeholder="Enter question text"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Options</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(questionIndex)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Button
                        variant={question.correctAnswerIndex === optionIndex ? "default" : "outline"}
                        size="sm"
                        className={question.correctAnswerIndex === optionIndex ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => handleSetCorrectAnswer(questionIndex, optionIndex)}
                        title="Set as correct answer"
                      >
                        {question.correctAnswerIndex === optionIndex ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </Button>
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                        disabled={question.options.length <= 2}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`points-${questionIndex}`}>Points</Label>
                  <Input
                    id={`points-${questionIndex}`}
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) => handleQuestionChange(questionIndex, 'points', parseInt(e.target.value) || 10)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`type-${questionIndex}`}>Question Type</Label>
                  <select
                    id={`type-${questionIndex}`}
                    value={question.type}
                    onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="essay">Essay</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>
              </div>
              
              {question.type === 'coding' && (
                <div>
                  <Label htmlFor={`codingTemplate-${questionIndex}`}>Coding Template (Optional)</Label>
                  <Textarea
                    id={`codingTemplate-${questionIndex}`}
                    value={question.codingTemplate || ''}
                    onChange={(e) => handleQuestionChange(questionIndex, 'codingTemplate', e.target.value)}
                    placeholder="Provide a code template for students to start with"
                    className="font-mono"
                    rows={5}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {assessment.questions.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No questions added yet. Click "Add Question" to get started.</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/admin/courses/${courseId}/assessments`)}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentCreate;
