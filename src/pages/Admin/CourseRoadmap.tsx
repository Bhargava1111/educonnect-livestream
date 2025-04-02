
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  getCourseById, updateCourseRoadmap, RoadmapPhase
} from "@/lib/courseManagement";
import { ChevronLeft, Plus, Save, Trash, X } from 'lucide-react';

const AdminCourseRoadmap = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courseName, setCourseName] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  
  useEffect(() => {
    if (!courseId) return;
    
    const course = getCourseById(courseId);
    if (course) {
      setCourseName(course.title);
      setRoadmap(course.roadmap || []);
    } else {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive"
      });
      navigate('/admin/courses');
    }
  }, [courseId, navigate, toast]);
  
  const handleAddPhase = () => {
    const newPhase: RoadmapPhase = {
      phase: roadmap.length + 1,
      title: "",
      duration: "",
      topics: [""],
      projects: [""]
    };
    
    setRoadmap([...roadmap, newPhase]);
  };
  
  const handleRemovePhase = (index: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap.splice(index, 1);
    
    // Update phase numbers
    const reorderedRoadmap = updatedRoadmap.map((phase, idx) => ({
      ...phase,
      phase: idx + 1
    }));
    
    setRoadmap(reorderedRoadmap);
  };
  
  const handlePhaseChange = (index: number, field: keyof RoadmapPhase, value: any) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[index] = {
      ...updatedRoadmap[index],
      [field]: value
    };
    
    setRoadmap(updatedRoadmap);
  };
  
  const handleTopicChange = (phaseIndex: number, topicIndex: number, value: string) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].topics[topicIndex] = value;
    setRoadmap(updatedRoadmap);
  };
  
  const handleAddTopic = (phaseIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].topics.push("");
    setRoadmap(updatedRoadmap);
  };
  
  const handleRemoveTopic = (phaseIndex: number, topicIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].topics.splice(topicIndex, 1);
    setRoadmap(updatedRoadmap);
  };
  
  const handleProjectChange = (phaseIndex: number, projectIndex: number, value: string) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].projects[projectIndex] = value;
    setRoadmap(updatedRoadmap);
  };
  
  const handleAddProject = (phaseIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].projects.push("");
    setRoadmap(updatedRoadmap);
  };
  
  const handleRemoveProject = (phaseIndex: number, projectIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].projects.splice(projectIndex, 1);
    setRoadmap(updatedRoadmap);
  };
  
  const handleSave = () => {
    if (!courseId) return;
    
    try {
      updateCourseRoadmap(courseId, roadmap);
      
      toast({
        title: "Roadmap Updated",
        description: `Roadmap for ${courseName} has been updated successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course roadmap. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin/courses" className="text-eduBlue-600 hover:text-eduBlue-700 flex items-center mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{courseName} - Roadmap</h1>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {roadmap.map((phase, phaseIndex) => (
          <Card key={phaseIndex} className="relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-eduBlue-100 text-eduBlue-700 h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                    {phase.phase}
                  </span>
                  <Input
                    className="font-semibold text-lg w-64"
                    value={phase.title}
                    onChange={(e) => handlePhaseChange(phaseIndex, 'title', e.target.value)}
                    placeholder="Phase Title"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePhase(phaseIndex)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <Label>Duration</Label>
                <Input
                  className="w-32 mt-1"
                  value={phase.duration}
                  onChange={(e) => handlePhaseChange(phaseIndex, 'duration', e.target.value)}
                  placeholder="e.g. 2 weeks"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Topics</Label>
                  <div className="space-y-2">
                    {phase.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center gap-2">
                        <Input
                          value={topic}
                          onChange={(e) => handleTopicChange(phaseIndex, topicIndex, e.target.value)}
                          placeholder={`Topic ${topicIndex + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTopic(phaseIndex, topicIndex)}
                          disabled={phase.topics.length <= 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTopic(phaseIndex)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Topic
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Projects</Label>
                  <div className="space-y-2">
                    {phase.projects.map((project, projectIndex) => (
                      <div key={projectIndex} className="flex items-center gap-2">
                        <Input
                          value={project}
                          onChange={(e) => handleProjectChange(phaseIndex, projectIndex, e.target.value)}
                          placeholder={`Project ${projectIndex + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProject(phaseIndex, projectIndex)}
                          disabled={phase.projects.length <= 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddProject(phaseIndex)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Project
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-center">
          <Button onClick={handleAddPhase} variant="outline" className="w-40">
            <Plus className="mr-2 h-4 w-4" />
            Add Phase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseRoadmap;
