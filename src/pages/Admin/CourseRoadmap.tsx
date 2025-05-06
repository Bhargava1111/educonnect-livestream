import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Video, FileText } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { getAllCourses, getCourseById, updateCourse } from '@/lib/courseService';
import { Course, CourseModule, RoadmapPhase, Video as VideoType, Material as MaterialType } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Video {
  id: string;
  title: string;
  url: string;
  description?: string;
  topicIndex?: number;
}

interface Material {
  id: string;
  title: string;
  type: 'document' | 'link';
  url: string;
  description?: string;
}

const AdminCourseRoadmap = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [updatedCourse, setUpdatedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false);
  const [newPhase, setNewPhase] = useState({ phase: 1, title: '', duration: '', topics: [''], projects: [''] });
  const [isEditPhaseDialogOpen, setIsEditPhaseDialogOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<RoadmapPhase | null>(null);
  const [editedPhase, setEditedPhase] = useState<RoadmapPhase | null>(null);
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '', description: '', topicIndex: 0 });
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'document', url: '', description: '' });
  
  useEffect(() => {
    const loadData = () => {
      try {
        const allCourses = getAllCourses();
        setCourses(allCourses);
        
        if (courseId) {
          const selectedCourse = getCourseById(courseId);
          if (selectedCourse) {
            setCourse(selectedCourse);
            // Initialize updatedCourse with a deep copy of selectedCourse
            setUpdatedCourse(JSON.parse(JSON.stringify(selectedCourse)));
          } else {
            toast({
              title: "Course Not Found",
              description: "The course ID is invalid.",
              variant: "destructive"
            });
            navigate('/admin/courses');
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [courseId, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: checked };
    });
  };
  
  const handleTopicChange = (index: number, value: string) => {
    setNewPhase(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics[index] = value;
      return { ...prev, topics: updatedTopics };
    });
  };
  
  const handleAddTopic = () => {
    setNewPhase(prev => ({ ...prev, topics: [...prev.topics, ''] }));
  };
  
  const handleRemoveTopic = (index: number) => {
    setNewPhase(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics.splice(index, 1);
      return { ...prev, topics: updatedTopics };
    });
  };
  
  const handleProjectChange = (index: number, value: string) => {
    setNewPhase(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = value;
      return { ...prev, projects: updatedProjects };
    });
  };
  
  const handleAddProject = () => {
    setNewPhase(prev => ({ ...prev, projects: [...prev.projects, ''] }));
  };
  
  const handleRemoveProject = (index: number) => {
    setNewPhase(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects.splice(index, 1);
      return { ...prev, projects: updatedProjects };
    });
  };
  
  const handleAddPhase = () => {
    if (!updatedCourse) return;
    
    if (!newPhase.title || !newPhase.duration) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields for the phase.",
        variant: "destructive"
      });
      return;
    }
    
    const phaseToAdd: RoadmapPhase = {
      phase: newPhase.phase,
      title: newPhase.title,
      duration: newPhase.duration,
      topics: newPhase.topics,
      projects: newPhase.projects,
      videos: [],
      materials: []
    };
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      const updatedRoadmap = [...(prev.roadmap || []), phaseToAdd];
      updatedRoadmap.sort((a, b) => a.phase - b.phase);
      return { ...prev, roadmap: updatedRoadmap };
    });
    
    setNewPhase({ phase: 1, title: '', duration: '', topics: [''], projects: [''] });
    setIsAddPhaseDialogOpen(false);
  };
  
  const handleEditPhase = (phase: RoadmapPhase) => {
    setCurrentPhase(phase);
    setEditedPhase({ ...phase });
    setIsEditPhaseDialogOpen(true);
  };
  
  const handleEditedPhaseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPhase(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };
  
  const handleUpdatePhase = () => {
    if (!updatedCourse || !currentPhase || !editedPhase) return;
    
    if (!editedPhase.title || !editedPhase.duration) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields for the phase.",
        variant: "destructive"
      });
      return;
    }
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      const updatedRoadmap = [...(prev.roadmap || [])];
      const phaseIndex = updatedRoadmap.findIndex(p => p.phase === currentPhase.phase);
      
      if (phaseIndex !== -1) {
        updatedRoadmap[phaseIndex] = { ...editedPhase };
      }
      
      return { ...prev, roadmap: updatedRoadmap };
    });
    
    setIsEditPhaseDialogOpen(false);
  };
  
  const handleRemovePhase = (phaseToRemove: RoadmapPhase) => {
    if (!updatedCourse) return;
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      const updatedRoadmap = (prev.roadmap || []).filter(phase => phase.phase !== phaseToRemove.phase);
      return { ...prev, roadmap: updatedRoadmap };
    });
  };

  // For adding videos:
  const handleAddVideo = () => {
    if (!currentPhase) return;
    
    if (!newVideo.title || !newVideo.url) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields for the video.",
        variant: "destructive"
      });
      return;
    }
    
    const video: VideoType = { // Use the Video type from our types.ts
      id: `video_${Date.now()}`,
      title: newVideo.title,
      url: newVideo.url,
      description: newVideo.description || "",
      topicIndex: newVideo.topicIndex || 0
    };
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      
      const updatedRoadmap = [...(prev.roadmap || [])];
      const phaseIndex = updatedRoadmap.findIndex(p => p.phase === currentPhase.phase);
      
      if (phaseIndex !== -1) {
        const videos = [...(updatedRoadmap[phaseIndex].videos || [])];
        videos.push(video);
        updatedRoadmap[phaseIndex] = {
          ...updatedRoadmap[phaseIndex],
          videos
        };
      }
      
      return {
        ...prev,
        roadmap: updatedRoadmap
      };
    });
    
    setNewVideo({ title: "", url: "", description: "", topicIndex: 0 });
    setIsAddVideoDialogOpen(false);
  };

  // For materials:
  const handleAddMaterial = () => {
    if (!currentPhase) return;
    
    if (!newMaterial.title || !newMaterial.url) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields for the material.",
        variant: "destructive"
      });
      return;
    }
    
    const material: MaterialType = { // Use the Material type from our types.ts
      id: `material_${Date.now()}`,
      title: newMaterial.title,
      type: newMaterial.type as "document" | "link", 
      url: newMaterial.url,
      description: newMaterial.description || ""
    };
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      
      const updatedRoadmap = [...(prev.roadmap || [])];
      const phaseIndex = updatedRoadmap.findIndex(p => p.phase === currentPhase.phase);
      
      if (phaseIndex !== -1) {
        const materials = [...(updatedRoadmap[phaseIndex].materials || [])];
        materials.push(material);
        updatedRoadmap[phaseIndex] = {
          ...updatedRoadmap[phaseIndex],
          materials
        };
      }
      
      return {
        ...prev,
        roadmap: updatedRoadmap
      };
    });
    
    setNewMaterial({ title: "", type: "document", url: "", description: "" });
    setIsAddMaterialDialogOpen(false);
  };
  
  const handleRemoveVideo = (phaseIndex: number, videoIndex: number) => {
    if (!updatedCourse) return;
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      
      const updatedRoadmap = [...(prev.roadmap || [])];
      
      if (phaseIndex !== -1 && updatedRoadmap[phaseIndex].videos) {
        const videos = [...updatedRoadmap[phaseIndex].videos!];
        videos.splice(videoIndex, 1);
        updatedRoadmap[phaseIndex] = {
          ...updatedRoadmap[phaseIndex],
          videos
        };
      }
      
      return {
        ...prev,
        roadmap: updatedRoadmap
      };
    });
  };
  
  const handleRemoveMaterial = (phaseIndex: number, materialIndex: number) => {
    if (!updatedCourse) return;
    
    setUpdatedCourse(prev => {
      if (!prev) return prev;
      
      const updatedRoadmap = [...(prev.roadmap || [])];
      
      if (phaseIndex !== -1 && updatedRoadmap[phaseIndex].materials) {
        const materials = [...updatedRoadmap[phaseIndex].materials!];
        materials.splice(materialIndex, 1);
        updatedRoadmap[phaseIndex] = {
          ...updatedRoadmap[phaseIndex],
          materials
        };
      }
      
      return {
        ...prev,
        roadmap: updatedRoadmap
      };
    });
  };
  
  const handleSaveChanges = () => {
    if (!updatedCourse) return;
    
    const success = updateCourse(courseId!, updatedCourse);
    
    if (success) {
      toast({
        title: "Course Updated",
        description: "The course roadmap has been updated successfully.",
      });
      setCourse(updatedCourse);
    } else {
      toast({
        title: "Error",
        description: "Failed to update the course. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return <div className="p-6">Loading course roadmap...</div>;
  }
  
  if (!course) {
    return <div className="p-6">Course not found.</div>;
  }
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Roadmap</CardTitle>
          <CardDescription>Manage the roadmap for {course.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={updatedCourse?.title || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                type="text"
                id="duration"
                name="duration"
                value={updatedCourse?.duration || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="isPublished">Published</Label>
              <Checkbox
                id="isPublished"
                name="isPublished"
                checked={updatedCourse?.isPublished || false}
                onCheckedChange={(checked) => handleCheckboxChange({ target: { name: 'isPublished', checked } } as any)}
              />
            </div>
          </div>
          
          <Accordion type="multiple">
            {(updatedCourse?.roadmap || []).map((phase, phaseIndex) => (
              <AccordionItem key={phase.phase} value={`phase-${phase.phase}`}>
                <AccordionTrigger>
                  Phase {phase.phase}: {phase.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Topics</Label>
                        {phase.topics.map((topic, tIndex) => (
                          <Input key={tIndex} type="text" value={topic} readOnly className="mb-2" />
                        ))}
                      </div>
                      <div>
                        <Label>Projects</Label>
                        {phase.projects.map((project, pIndex) => (
                          <Input key={pIndex} type="text" value={project} readOnly className="mb-2" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <Button variant="secondary" size="sm" onClick={() => {
                          setCurrentPhase(phase);
                          setIsAddVideoDialogOpen(true);
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Video
                        </Button>
                        <Button variant="secondary" size="sm" className="ml-2" onClick={() => {
                          setCurrentPhase(phase);
                          setIsAddMaterialDialogOpen(true);
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Material
                        </Button>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => handleEditPhase(phase)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Phase
                        </Button>
                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleRemovePhase(phase)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Phase
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Videos</h4>
                      {(phase.videos || []).map((video, vIndex) => (
                        <div key={video.id || `video-${vIndex}`} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{typeof video === 'string' ? video : video.title}</span>
                          </div>
                          <div>
                            {typeof video !== 'string' && video.topicIndex !== undefined && (
                              <span className="text-xs text-gray-500 mr-3">Topic: {video.topicIndex + 1}</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveVideo(phaseIndex, vIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Materials</h4>
                      {(phase.materials || []).map((material, mIndex) => (
                        <div key={material.id || `material-${mIndex}`} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-green-500 mr-2" />
                            <span>{typeof material === 'string' ? material : material.title}</span>
                          </div>
                          <div>
                            {typeof material !== 'string' && (
                              <span className="text-xs text-gray-500 mr-3">
                                Type: {typeof material === 'string' ? 'document' : material.type}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveMaterial(phaseIndex, mIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <Button onClick={() => setIsAddPhaseDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Phase
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isAddPhaseDialogOpen} onOpenChange={setIsAddPhaseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Phase</DialogTitle>
            <DialogDescription>Create a new phase for the course roadmap.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phase" className="text-right">Phase</Label>
              <Input
                type="number"
                id="phase"
                defaultValue={1}
                className="col-span-3"
                value={newPhase.phase}
                onChange={(e) => setNewPhase({ ...newPhase, phase: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                type="text"
                id="title"
                value={newPhase.title}
                onChange={(e) => setNewPhase({ ...newPhase, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration</Label>
              <Input
                type="text"
                id="duration"
                value={newPhase.duration}
                onChange={(e) => setNewPhase({ ...newPhase, duration: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div>
              <Label>Topics</Label>
              {newPhase.topics.map((topic, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    className="mr-2"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveTopic(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTopic}>
                Add Topic
              </Button>
            </div>
            <div>
              <Label>Projects</Label>
              {newPhase.projects.map((project, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    type="text"
                    value={project}
                    onChange={(e) => handleProjectChange(index, e.target.value)}
                    className="mr-2"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveProject(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddProject}>
                Add Project
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddPhaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddPhase}>
              Add Phase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditPhaseDialogOpen} onOpenChange={setIsEditPhaseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Phase</DialogTitle>
            <DialogDescription>Edit the details of the current phase.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <Input
                type="text"
                id="edit-title"
                name="title"
                value={editedPhase?.title || ''}
                onChange={handleEditedPhaseInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">Duration</Label>
              <Input
                type="text"
                id="edit-duration"
                name="duration"
                value={editedPhase?.duration || ''}
                onChange={handleEditedPhaseInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditPhaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdatePhase}>
              Update Phase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
            <DialogDescription>Add a video to the current phase.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-title" className="text-right">Title</Label>
              <Input
                type="text"
                id="video-title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-url" className="text-right">URL</Label>
              <Input
                type="text"
                id="video-url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-description" className="text-right">Description</Label>
              <Textarea
                id="video-description"
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-topicIndex" className="text-right">Topic Index</Label>
              <Input
                type="number"
                id="video-topicIndex"
                value={newVideo.topicIndex}
                onChange={(e) => setNewVideo({ ...newVideo, topicIndex: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddVideoDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddVideo}>
              Add Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddMaterialDialogOpen} onOpenChange={setIsAddMaterialDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>Add material to the current phase.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-title" className="text-right">Title</Label>
              <Input
                type="text"
                id="material-title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-type" className="text-right">Type</Label>
              <Select onValueChange={(value) => setNewMaterial({ ...newMaterial, type: value as "document" | "link" })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" defaultValue={newMaterial.type} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-url" className="text-right">URL</Label>
              <Input
                type="text"
                id="material-url"
                value={newMaterial.url}
                onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-description" className="text-right">Description</Label>
              <Textarea
                id="material-description"
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddMaterialDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddMaterial}>
              Add Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseRoadmap;
