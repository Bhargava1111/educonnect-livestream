import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Play, FileText, Link, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Course, RoadmapPhase, Video, Material } from '@/lib/types';
import { getCourseById, updateCourse } from '@/lib/courseService';

const AdminCourseRoadmap = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase | null>(null);
  const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<RoadmapPhase | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [newPhase, setNewPhase] = useState<Partial<RoadmapPhase>>({
    title: '',
    description: '',
    duration: '',
    topics: [],
    projects: [],
    videos: [],
    materials: [],
    isActive: true
  });

  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: '',
    url: '',
    duration: '',
    description: ''
  });

  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    title: '',
    type: 'pdf',
    url: '',
    description: ''
  });

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
        if (!courseData.roadmap) {
          setCourse(prev => prev ? { ...prev, roadmap: [] } : null);
        }
      }
    }
  }, [courseId]);

  const resetNewPhase = () => {
    setNewPhase({
      title: '',
      description: '',
      duration: '',
      topics: [],
      projects: [],
      videos: [],
      materials: [],
      isActive: true
    });
  };

  const resetNewVideo = () => {
    setNewVideo({
      title: '',
      url: '',
      duration: '',
      description: ''
    });
  };

  const resetNewMaterial = () => {
    setNewMaterial({
      title: '',
      type: 'pdf',
      url: '',
      description: ''
    });
  };

  const handleSavePhase = () => {
    if (!course || !newPhase.title || !newPhase.description) {
      toast({
        title: "Missing Information",
        description: "Please provide title and description for the phase.",
        variant: "destructive"
      });
      return;
    }

    const phaseToSave: RoadmapPhase = {
      id: editingPhase?.id || `phase_${Date.now()}`,
      title: newPhase.title,
      description: newPhase.description,
      duration: newPhase.duration || '',
      modules: [], // Add modules as required by type
      isActive: newPhase.isActive ?? true,
      phase: editingPhase?.phase || (course.roadmap?.length || 0) + 1,
      topics: newPhase.topics || [],
      projects: newPhase.projects || [],
      videos: newPhase.videos || [],
      materials: newPhase.materials || []
    };

    let updatedRoadmap: RoadmapPhase[];
    
    if (editingPhase) {
      updatedRoadmap = course.roadmap?.map(phase => 
        phase.id === editingPhase.id ? phaseToSave : phase
      ) || [phaseToSave];
    } else {
      updatedRoadmap = [...(course.roadmap || []), phaseToSave];
    }

    const updatedCourse = { ...course, roadmap: updatedRoadmap };
    updateCourse(course.id, updatedCourse);
    setCourse(updatedCourse);
    
    setIsPhaseDialogOpen(false);
    setEditingPhase(null);
    resetNewPhase();
    
    toast({
      title: editingPhase ? "Phase Updated" : "Phase Added",
      description: `${phaseToSave.title} has been ${editingPhase ? 'updated' : 'added'} successfully.`
    });
  };

  const handleEditPhase = (phase: RoadmapPhase) => {
    setEditingPhase(phase);
    setNewPhase({
      title: phase.title,
      description: phase.description,
      duration: phase.duration,
      topics: phase.topics || [],
      projects: phase.projects || [],
      videos: phase.videos || [],
      materials: phase.materials || [],
      isActive: phase.isActive
    });
    setIsPhaseDialogOpen(true);
  };

  const handleDeletePhase = (phaseId: string) => {
    if (!course) return;
    
    const updatedRoadmap = course.roadmap?.filter(phase => phase.id !== phaseId) || [];
    const updatedCourse = { ...course, roadmap: updatedRoadmap };
    
    updateCourse(course.id, updatedCourse);
    setCourse(updatedCourse);
    
    toast({
      title: "Phase Deleted",
      description: "Phase has been deleted successfully."
    });
  };

  const handleSaveVideo = () => {
    if (!selectedPhase || !newVideo.title || !newVideo.url) {
      toast({
        title: "Missing Information",
        description: "Please provide title and URL for the video.",
        variant: "destructive"
      });
      return;
    }

    const videoToSave: Video = {
      id: editingVideo?.id || `video_${Date.now()}`,
      title: newVideo.title,
      url: newVideo.url,
      duration: newVideo.duration || '',
      description: newVideo.description
    };

    const updatedVideos = editingVideo
      ? selectedPhase.videos?.map(video => video.id === editingVideo.id ? videoToSave : video) || [videoToSave]
      : [...(selectedPhase.videos || []), videoToSave];

    const updatedPhase = { ...selectedPhase, videos: updatedVideos };
    updatePhaseInCourse(updatedPhase);
    
    setIsVideoDialogOpen(false);
    setEditingVideo(null);
    resetNewVideo();
    
    toast({
      title: editingVideo ? "Video Updated" : "Video Added",
      description: `${videoToSave.title} has been ${editingVideo ? 'updated' : 'added'} successfully.`
    });
  };

  const handleSaveMaterial = () => {
    if (!selectedPhase || !newMaterial.title || !newMaterial.url) {
      toast({
        title: "Missing Information",
        description: "Please provide title and URL for the material.",
        variant: "destructive"
      });
      return;
    }

    const materialToSave: Material = {
      id: editingMaterial?.id || `material_${Date.now()}`,
      title: newMaterial.title,
      type: newMaterial.type as 'pdf' | 'doc' | 'link' | 'image',
      url: newMaterial.url,
      description: newMaterial.description
    };

    const updatedMaterials = editingMaterial
      ? selectedPhase.materials?.map(material => material.id === editingMaterial.id ? materialToSave : material) || [materialToSave]
      : [...(selectedPhase.materials || []), materialToSave];

    const updatedPhase = { ...selectedPhase, materials: updatedMaterials };
    updatePhaseInCourse(updatedPhase);
    
    setIsMaterialDialogOpen(false);
    setEditingMaterial(null);
    resetNewMaterial();
    
    toast({
      title: editingMaterial ? "Material Updated" : "Material Added", 
      description: `${materialToSave.title} has been ${editingMaterial ? 'updated' : 'added'} successfully.`
    });
  };

  const updatePhaseInCourse = (updatedPhase: RoadmapPhase) => {
    if (!course) return;
    
    const updatedRoadmap = course.roadmap?.map(phase => 
      phase.id === updatedPhase.id ? updatedPhase : phase
    ) || [updatedPhase];
    
    const updatedCourse = { ...course, roadmap: updatedRoadmap };
    updateCourse(course.id, updatedCourse);
    setCourse(updatedCourse);
    setSelectedPhase(updatedPhase);
  };

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <p className="text-gray-600">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{course.title} - Roadmap</h1>
        <p className="text-gray-500">Manage the learning roadmap for this course</p>
      </div>

      <div className="flex gap-6">
        {/* Phases List */}
        <div className="w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Learning Phases</h2>
            <Button onClick={() => setIsPhaseDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Phase
            </Button>
          </div>
          
          <div className="space-y-3">
            {course.roadmap?.map((phase, index) => (
              <Card key={phase.id} className={`cursor-pointer transition-all ${selectedPhase?.id === phase.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2" onClick={() => setSelectedPhase(phase)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm">Phase {index + 1}: {phase.title}</CardTitle>
                      <CardDescription className="text-xs">{phase.duration}</CardDescription>
                    </div>
                    <Badge variant={phase.isActive ? "default" : "secondary"}>
                      {phase.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      handleEditPhase(phase);
                    }}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhase(phase.id);
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )) || (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No phases added yet</p>
                  <Button className="mt-2" onClick={() => setIsPhaseDialogOpen(true)}>
                    Add First Phase
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Phase Details */}
        <div className="flex-1">
          {selectedPhase ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPhase.title}</CardTitle>
                <CardDescription>{selectedPhase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="topics">Topics</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Duration</h4>
                      <p className="text-sm text-gray-600">{selectedPhase.duration}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Projects</h4>
                      {selectedPhase.projects && selectedPhase.projects.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {selectedPhase.projects.map((project, index) => (
                            <li key={index}>{project}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No projects defined</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="topics" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Topics Covered</h4>
                    </div>
                    {selectedPhase.topics && selectedPhase.topics.length > 0 ? (
                      <div className="grid gap-2">
                        {selectedPhase.topics.map((topic, index) => (
                          <Badge key={index} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No topics defined</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="videos" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Learning Videos</h4>
                      <Button size="sm" onClick={() => setIsVideoDialogOpen(true)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Video
                      </Button>
                    </div>
                    
                    {selectedPhase.videos && selectedPhase.videos.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPhase.videos.map((video, index) => (
                          <Card key={video.id}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-3">
                                <Play className="h-4 w-4 text-blue-500" />
                                <div>
                                  <p className="font-medium text-sm">{video.title}</p>
                                  <p className="text-xs text-gray-500">Duration: {video.duration}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => {
                                  setEditingVideo(video);
                                  setNewVideo({
                                    title: video.title,
                                    url: video.url,
                                    duration: video.duration,
                                    description: video.description
                                  });
                                  setIsVideoDialogOpen(true);
                                }}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const updatedVideos = selectedPhase.videos?.filter(v => v.id !== video.id) || [];
                                  updatePhaseInCourse({ ...selectedPhase, videos: updatedVideos });
                                }}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No videos added yet</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="materials" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Learning Materials</h4>
                      <Button size="sm" onClick={() => setIsMaterialDialogOpen(true)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Material
                      </Button>
                    </div>
                    
                    {selectedPhase.materials && selectedPhase.materials.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPhase.materials.map((material, index) => (
                          <Card key={material.id}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-3">
                                {material.type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
                                {material.type === 'doc' && <FileText className="h-4 w-4 text-blue-500" />}
                                {material.type === 'link' && <Link className="h-4 w-4 text-green-500" />}
                                {material.type === 'image' && <Download className="h-4 w-4 text-purple-500" />}
                                <div>
                                  <p className="font-medium text-sm">{material.title}</p>
                                  <p className="text-xs text-gray-500 capitalize">{material.type}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => {
                                  setEditingMaterial(material);
                                  setNewMaterial({
                                    title: material.title,
                                    type: material.type,
                                    url: material.url,
                                    description: material.description
                                  });
                                  setIsMaterialDialogOpen(true);
                                }}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const updatedMaterials = selectedPhase.materials?.filter(m => m.id !== material.id) || [];
                                  updatePhaseInCourse({ ...selectedPhase, materials: updatedMaterials });
                                }}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No materials added yet</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Phase</h3>
                <p className="text-gray-500">Choose a phase from the left to view and edit its details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Phase Dialog */}
      <Dialog open={isPhaseDialogOpen} onOpenChange={setIsPhaseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPhase ? 'Edit Phase' : 'Add New Phase'}</DialogTitle>
            <DialogDescription>
              {editingPhase ? 'Update the phase details below.' : 'Create a new learning phase for this course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phase-title" className="text-right">Title</Label>
              <Input
                id="phase-title"
                value={newPhase.title || ''}
                onChange={(e) => setNewPhase({ ...newPhase, title: e.target.value })}
                className="col-span-3"
                placeholder="Phase title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phase-description" className="text-right">Description</Label>
              <Textarea
                id="phase-description"
                value={newPhase.description || ''}
                onChange={(e) => setNewPhase({ ...newPhase, description: e.target.value })}
                className="col-span-3"
                placeholder="Phase description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phase-duration" className="text-right">Duration</Label>
              <Input
                id="phase-duration"
                value={newPhase.duration || ''}
                onChange={(e) => setNewPhase({ ...newPhase, duration: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 2 weeks"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsPhaseDialogOpen(false);
              setEditingPhase(null);
              resetNewPhase();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSavePhase}>
              {editingPhase ? 'Update Phase' : 'Add Phase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              {editingVideo ? 'Update the video details below.' : 'Add a new video to this phase.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-title" className="text-right">Title</Label>
              <Input
                id="video-title"
                value={newVideo.title || ''}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="col-span-3"
                placeholder="Video title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-url" className="text-right">URL</Label>
              <Input
                id="video-url"
                value={newVideo.url || ''}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                className="col-span-3"
                placeholder="Video URL"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-duration" className="text-right">Duration</Label>
              <Input
                id="video-duration"
                value={newVideo.duration || ''}
                onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 15 minutes"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-description" className="text-right">Description</Label>
              <Textarea
                id="video-description"
                value={newVideo.description || ''}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                className="col-span-3"
                placeholder="Video description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsVideoDialogOpen(false);
              setEditingVideo(null);
              resetNewVideo();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveVideo}>
              {editingVideo ? 'Update Video' : 'Add Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Dialog */}
      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMaterial ? 'Edit Material' : 'Add New Material'}</DialogTitle>
            <DialogDescription>
              {editingMaterial ? 'Update the material details below.' : 'Add a new material to this phase.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-title" className="text-right">Title</Label>
              <Input
                id="material-title"
                value={newMaterial.title || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                className="col-span-3"
                placeholder="Material title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-type" className="text-right">Type</Label>
              <Select
                value={newMaterial.type || 'pdf'}
                onValueChange={(value: 'pdf' | 'doc' | 'link' | 'image') => 
                  setNewMaterial({ ...newMaterial, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Document</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-url" className="text-right">URL</Label>
              <Input
                id="material-url"
                value={newMaterial.url || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                className="col-span-3"
                placeholder="Material URL"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material-description" className="text-right">Description</Label>
              <Textarea
                id="material-description"
                value={newMaterial.description || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                className="col-span-3"
                placeholder="Material description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsMaterialDialogOpen(false);
              setEditingMaterial(null);
              resetNewMaterial();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveMaterial}>
              {editingMaterial ? 'Update Material' : 'Add Material'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseRoadmap;
