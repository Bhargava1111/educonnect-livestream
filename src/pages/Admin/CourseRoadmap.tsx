
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  getCourseById, updateCourseRoadmap, RoadmapPhase
} from "@/lib/courseManagement";
import { ChevronLeft, Plus, Save, Trash, X, Upload, Video, FileText } from 'lucide-react';

interface RoadmapMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'link';
  url: string;
  description?: string;
}

const AdminCourseRoadmap = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courseName, setCourseName] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number | null>(null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number | null>(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'document',
    url: '',
    description: ''
  });
  
  useEffect(() => {
    if (!courseId) return;
    
    const course = getCourseById(courseId);
    if (course) {
      setCourseName(course.title);
      
      // If roadmap phases don't have materials, initialize them
      const updatedRoadmap = (course.roadmap || []).map(phase => ({
        ...phase,
        materials: phase.materials || [],
        videos: phase.videos || []
      }));
      
      setRoadmap(updatedRoadmap);
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
    const newPhase: any = {
      phase: roadmap.length + 1,
      title: "",
      duration: "",
      topics: [""],
      projects: [""],
      materials: [],
      videos: []
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
  
  // New functions for video management
  const openAddVideoDialog = (phaseIndex: number, topicIndex: number) => {
    setCurrentPhaseIndex(phaseIndex);
    setCurrentTopicIndex(topicIndex);
    setNewVideo({
      title: '',
      url: '',
      description: ''
    });
    setIsAddVideoOpen(true);
  };
  
  const handleAddVideo = () => {
    if (currentPhaseIndex === null || !newVideo.title || !newVideo.url) return;
    
    const updatedRoadmap = [...roadmap];
    if (!updatedRoadmap[currentPhaseIndex].videos) {
      updatedRoadmap[currentPhaseIndex].videos = [];
    }
    
    // Add video with reference to topic if applicable
    updatedRoadmap[currentPhaseIndex].videos.push({
      id: `video_${Date.now()}`,
      title: newVideo.title,
      url: newVideo.url,
      description: newVideo.description,
      topicIndex: currentTopicIndex
    });
    
    setRoadmap(updatedRoadmap);
    setIsAddVideoOpen(false);
    
    toast({
      title: "Video Added",
      description: `"${newVideo.title}" has been added to ${updatedRoadmap[currentPhaseIndex].title}.`
    });
  };
  
  // New functions for material management
  const openAddMaterialDialog = (phaseIndex: number) => {
    setCurrentPhaseIndex(phaseIndex);
    setNewMaterial({
      title: '',
      type: 'document',
      url: '',
      description: ''
    });
    setIsAddMaterialOpen(true);
  };
  
  const handleAddMaterial = () => {
    if (currentPhaseIndex === null || !newMaterial.title || !newMaterial.url) return;
    
    const updatedRoadmap = [...roadmap];
    if (!updatedRoadmap[currentPhaseIndex].materials) {
      updatedRoadmap[currentPhaseIndex].materials = [];
    }
    
    updatedRoadmap[currentPhaseIndex].materials.push({
      id: `material_${Date.now()}`,
      title: newMaterial.title,
      type: newMaterial.type as 'document' | 'link',
      url: newMaterial.url,
      description: newMaterial.description
    });
    
    setRoadmap(updatedRoadmap);
    setIsAddMaterialOpen(false);
    
    toast({
      title: "Material Added",
      description: `"${newMaterial.title}" has been added to ${updatedRoadmap[currentPhaseIndex].title}.`
    });
  };
  
  const handleRemoveVideo = (phaseIndex: number, videoIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].videos.splice(videoIndex, 1);
    setRoadmap(updatedRoadmap);
  };
  
  const handleRemoveMaterial = (phaseIndex: number, materialIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].materials.splice(materialIndex, 1);
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
                          variant="outline"
                          size="sm"
                          onClick={() => openAddVideoDialog(phaseIndex, topicIndex)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Add Video
                        </Button>
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
                
                {/* Videos section */}
                {phase.videos && phase.videos.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Videos</Label>
                    <div className="space-y-2">
                      {phase.videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Video className="h-4 w-4 text-eduBlue-600" />
                          <div className="flex-1">
                            <p className="font-medium">{video.title}</p>
                            <p className="text-xs text-gray-500">
                              {video.topicIndex !== null ? 
                                `Topic: ${phase.topics[video.topicIndex]}` : 
                                'General video'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVideo(phaseIndex, videoIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Materials section */}
                {phase.materials && phase.materials.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Materials</Label>
                    <div className="space-y-2">
                      {phase.materials.map((material, materialIndex) => (
                        <div key={materialIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <FileText className="h-4 w-4 text-eduBlue-600" />
                          <div className="flex-1">
                            <p className="font-medium">{material.title}</p>
                            <p className="text-xs text-gray-500">{material.type}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMaterial(phaseIndex, materialIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openAddMaterialDialog(phaseIndex)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Add Material
                  </Button>
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
      
      {/* Add Video Dialog */}
      <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoTitle">Video Title</Label>
              <Input
                id="videoTitle"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                placeholder="Enter video title"
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={newVideo.url}
                onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
            <div>
              <Label htmlFor="videoDescription">Description (Optional)</Label>
              <Textarea
                id="videoDescription"
                value={newVideo.description}
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                placeholder="Enter a brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVideoOpen(false)}>Cancel</Button>
            <Button onClick={handleAddVideo}>Add Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Material Dialog */}
      <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Learning Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="materialTitle">Title</Label>
              <Input
                id="materialTitle"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                placeholder="Enter material title"
              />
            </div>
            <div>
              <Label htmlFor="materialType">Type</Label>
              <select
                id="materialType"
                value={newMaterial.type}
                onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="document">Document</option>
                <option value="link">External Link</option>
              </select>
            </div>
            <div>
              <Label htmlFor="materialUrl">URL</Label>
              <Input
                id="materialUrl"
                value={newMaterial.url}
                onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                placeholder="Enter URL to document or external resource"
              />
            </div>
            <div>
              <Label htmlFor="materialDescription">Description (Optional)</Label>
              <Textarea
                id="materialDescription"
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                placeholder="Enter a brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMaterialOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMaterial}>Add Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseRoadmap;
