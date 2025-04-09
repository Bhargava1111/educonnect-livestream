
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, AlertTriangle, Clock, Camera, Monitor } from "lucide-react";
import { getAssessmentById, getCourseById, Assessment, Course, Question } from "@/lib/courseManagement";

const TakeAssessment = () => {
  const { assessmentId, courseId } = useParams<{ assessmentId: string, courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparationDialogOpen, setIsPreparationDialogOpen] = useState(true);
  const [mediaReady, setMediaReady] = useState({
    camera: false,
    screen: false
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Load assessment and course data
  useEffect(() => {
    if (!assessmentId || !courseId) {
      toast({
        title: "Error",
        description: "Assessment or course information is missing",
        variant: "destructive"
      });
      navigate(`/student/courses`);
      return;
    }
    
    const assessmentData = getAssessmentById(assessmentId);
    const courseData = getCourseById(courseId);
    
    if (!assessmentData || !courseData) {
      toast({
        title: "Not Found",
        description: "The assessment or course could not be found",
        variant: "destructive"
      });
      navigate(`/student/courses`);
      return;
    }
    
    setAssessment(assessmentData);
    setCourse(courseData);
    
    // Initialize time limit
    if (assessmentData.timeLimit) {
      setTimeLeft(assessmentData.timeLimit * 60); // convert to seconds
    }
    
    // Initialize answers object
    const initialAnswers: { [key: string]: any } = {};
    assessmentData.questions.forEach(question => {
      if (question.type === 'multiple-choice') {
        initialAnswers[question.id] = null;
      } else if (question.type === 'essay' || question.type === 'coding') {
        initialAnswers[question.id] = question.codingTemplate || '';
      }
    });
    setAnswers(initialAnswers);
    
  }, [assessmentId, courseId, navigate, toast]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isPreparationDialogOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isPreparationDialogOpen]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Create media recorder for camera
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // In a real application, you would upload this recording to your server
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('Camera recording stopped, size: ', blob.size);
      };
      
      mediaRecorder.start();
      setMediaReady(prev => ({ ...prev, camera: true }));
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Failed",
        description: "Could not access your camera. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };
  
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: 'always' },
        audio: false
      });
      
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }
      
      // Create media recorder for screen
      const screenRecorder = new MediaRecorder(stream);
      screenRecorderRef.current = screenRecorder;
      
      const chunks: BlobPart[] = [];
      screenRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      screenRecorder.onstop = () => {
        // In a real application, you would upload this recording to your server
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('Screen recording stopped, size: ', blob.size);
      };
      
      screenRecorder.start();
      setMediaReady(prev => ({ ...prev, screen: true }));
      
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast({
        title: "Screen Sharing Failed",
        description: "Could not share your screen. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };
  
  const startAssessment = () => {
    setIsPreparationDialogOpen(false);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };
  
  const handleNextQuestion = () => {
    if (!assessment) return;
    
    // Validate current answer if needed
    
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScore = () => {
    if (!assessment) return 0;
    
    let totalPoints = 0;
    let earnedPoints = 0;
    
    assessment.questions.forEach(question => {
      const points = question.points || 10;
      totalPoints += points;
      
      if (question.type === 'multiple-choice') {
        if (answers[question.id] === question.correctAnswerIndex) {
          earnedPoints += points;
        }
      }
      // For essay and coding questions, in a real app you would need manual grading
    });
    
    return Math.round((earnedPoints / totalPoints) * 100);
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Stop recordings
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (screenRecorderRef.current && screenRecorderRef.current.state !== 'inactive') {
      screenRecorderRef.current.stop();
    }
    
    // Calculate score
    const score = calculateScore();
    const passed = score >= (assessment?.passingScore || 70);
    
    // In a real app, you would submit the answers and recordings to your server
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: passed ? "Assessment Passed!" : "Assessment Completed",
        description: `Your score: ${score}%. ${passed ? 'Congratulations!' : 'You can try again later.'}`,
        variant: passed ? "default" : "destructive"
      });
      
      navigate(`/student/courses`);
    }, 1500);
  };
  
  const currentQuestion = assessment?.questions[currentQuestionIndex];
  
  if (!assessment || !course) {
    return <div className="p-6">Loading assessment...</div>;
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Preparation Dialog */}
      <Dialog open={isPreparationDialogOpen} onOpenChange={(open) => {
        // Prevent closing by clicking outside
        if (!open && !mediaReady.camera && assessment.requiresCamera) return;
        if (!open && !mediaReady.screen && assessment.requiresScreenshare) return;
        setIsPreparationDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Assessment Preparation</DialogTitle>
            <DialogDescription>
              You are about to start the assessment: <span className="font-medium">{assessment.title}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Information</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1 list-disc pl-5">
                    <li>This assessment has a time limit of {assessment.timeLimit} minutes.</li>
                    <li>Once started, you cannot pause or restart the assessment.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>The passing score is {assessment.passingScore || 70}%.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {assessment.requiresCamera && (
              <div className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-eduBlue-600" />
                    <h4 className="font-medium">Camera Recording Required</h4>
                  </div>
                  {!mediaReady.camera ? (
                    <Button size="sm" onClick={startCamera}>Enable Camera</Button>
                  ) : (
                    <span className="text-green-500 text-sm">Camera Enabled</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  For assessment integrity, your camera will record you during the entire assessment.
                </p>
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {assessment.requiresScreenshare && (
              <div className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2 text-eduBlue-600" />
                    <h4 className="font-medium">Screen Sharing Required</h4>
                  </div>
                  {!mediaReady.screen ? (
                    <Button size="sm" onClick={startScreenShare}>Share Screen</Button>
                  ) : (
                    <span className="text-green-500 text-sm">Screen Shared</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Your screen will be recorded during the assessment to ensure integrity.
                </p>
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <video 
                    ref={screenRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => navigate(`/student/assessments/${courseId}`)}
            >
              Cancel
            </Button>
            <Button
              onClick={startAssessment}
              disabled={
                (assessment.requiresCamera && !mediaReady.camera) ||
                (assessment.requiresScreenshare && !mediaReady.screen)
              }
            >
              Start Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {!isPreparationDialogOpen && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">{assessment.title}</h1>
              <p className="text-gray-500">{course.title}</p>
            </div>
            
            <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-amber-500 mr-1" />
              <span className="font-medium text-amber-700">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <Progress 
              value={(currentQuestionIndex / assessment.questions.length) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
              <span>{Math.round((currentQuestionIndex / assessment.questions.length) * 100)}% complete</span>
            </div>
          </div>
          
          <Card className="mb-6">
            {currentQuestion && (
              <>
                <CardHeader>
                  <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>
                    {currentQuestion.points || 10} points • {
                      currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' :
                      currentQuestion.type === 'essay' ? 'Essay' : 'Coding'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-lg font-medium mb-4">{currentQuestion.text}</p>
                    
                    {currentQuestion.type === 'multiple-choice' && (
                      <RadioGroup
                        value={answers[currentQuestion.id]?.toString()}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                      >
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    )}
                    
                    {currentQuestion.type === 'essay' && (
                      <Textarea
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Type your answer here..."
                        rows={8}
                      />
                    )}
                    
                    {currentQuestion.type === 'coding' && (
                      <Textarea
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Write your code here..."
                        rows={12}
                        className="font-mono"
                      />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentQuestionIndex < assessment.questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>Next</Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </Card>
          
          <div className="grid grid-cols-12 gap-2">
            {assessment.questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : 
                  answers[assessment.questions[index].id] !== null && 
                  answers[assessment.questions[index].id] !== '' ? 
                    "outline" : "ghost"
                }
                className={`h-10 w-10 ${
                  index === currentQuestionIndex ? 'bg-eduBlue-600' : 
                  answers[assessment.questions[index].id] !== null && 
                  answers[assessment.questions[index].id] !== '' ? 
                    'border-green-500 text-green-700' : 'border-gray-200'
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TakeAssessment;
