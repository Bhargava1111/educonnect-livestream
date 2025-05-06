import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from 'lucide-react';
import {
  Course,
  RoadmapPhase,
  Video,
  Material
} from '@/lib/types';
import {
  getCourseById,
  updateCourse
} from '@/lib/courseService';

const AdminCourseRoadmap = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [newPhase, setNewPhase] = useState({
    title: '',
    duration: '',
    topics: '',
    projects: ''
  });
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [videoData, setVideoData] = useState({
    title: '',
    url: '',
    description: '',
    topicIndex: '0'
  });
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [materialData, setMaterialData] = useState({
    title: '',
    type: 'document',
    url: '',
    description: ''
  });
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  useEffect(() => {
    if (!courseId) {
      toast({
        title: "Missing Course ID",
        description: "The course ID is missing.",
        variant: "destructive"
      });
      navigate('/admin/courses');
      return;
    }

    const loadCourse = () => {
      const courseData = getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
        setRoadmap(courseData.roadmap || []);
      } else {
        toast({
          title: "Course Not Found",
          description: "The requested course could not be found.",
          variant: "destructive"
        });
        navigate('/admin/courses');
      }
    };

    loadCourse();
  }, [courseId, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPhase(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPhase = () => {
    if (!newPhase.title || !newPhase.duration || !newPhase.topics || !newPhase.projects) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for the phase.",
        variant: "destructive"
      });
      return;
    }

    const phaseNumber = roadmap.length + 1;
    const newRoadmapPhase: RoadmapPhase = {
      phase: phaseNumber,
      title: newPhase.title,
      duration: newPhase.duration,
      topics: newPhase.topics.split(',').map(topic => topic.trim()),
      projects: newPhase.projects.split(',').map(project => project.trim())
    };

    setRoadmap([...roadmap, newRoadmapPhase]);
    setNewPhase({ title: '', duration: '', topics: '', projects: '' });
    setShowPhaseForm(false);

    toast({
      title: "Phase Added",
      description: "New phase has been added to the roadmap."
    });
  };

  const handleRemovePhase = (index: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap.splice(index, 1);
    setRoadmap(updatedRoadmap);

    toast({
      title: "Phase Removed",
      description: "Phase has been removed from the roadmap."
    });
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVideoData(prev => ({ ...prev, [name]: value }));
  };

  const handleMaterialInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaterialData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = (phaseIndex: number) => {
    if (!videoData.title || !videoData.url) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and URL for the video.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a video object
    const newVideo: Video = {
      id: `video_${Date.now()}`,
      title: videoData.title,
      url: videoData.url,
      description: videoData.description,
      topicIndex: parseInt(videoData.topicIndex || '0')
    };
    
    const updatedRoadmap = [...roadmap];
    if (!updatedRoadmap[phaseIndex].videos) {
      updatedRoadmap[phaseIndex].videos = [];
    }
    
    // Add the video object to the videos array, not as a string
    updatedRoadmap[phaseIndex].videos?.push(newVideo);
    setRoadmap(updatedRoadmap);
    
    // Reset video form
    setVideoData({
      title: '',
      url: '',
      description: '',
      topicIndex: '0'
    });
    
    setShowVideoForm(false);
    
    toast({
      title: "Video Added",
      description: "Video has been added to the roadmap."
    });
  };
  
  const handleAddMaterial = (phaseIndex: number) => {
    if (!materialData.title || !materialData.url) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and URL for the material.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a material object
    const newMaterial: Material = {
      id: `material_${Date.now()}`,
      title: materialData.title,
      type: materialData.type as 'document' | 'link',
      url: materialData.url,
      description: materialData.description
    };
    
    const updatedRoadmap = [...roadmap];
    if (!updatedRoadmap[phaseIndex].materials) {
      updatedRoadmap[phaseIndex].materials = [];
    }
    
    // Add the material object to the materials array, not as a string
    updatedRoadmap[phaseIndex].materials?.push(newMaterial);
    setRoadmap(updatedRoadmap);
    
    // Reset material form
    setMaterialData({
      title: '',
      type: 'document',
      url: '',
      description: ''
    });
    
    setShowMaterialForm(false);
    
    toast({
      title: "Material Added",
      description: "Learning material has been added to the roadmap."
    });
  };

  const handleRemoveVideo = (phaseIndex: number, videoIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].videos?.splice(videoIndex, 1);
    setRoadmap(updatedRoadmap);

    toast({
      title: "Video Removed",
      description: "Video has been removed from the roadmap."
    });
  };

  const handleRemoveMaterial = (phaseIndex: number, materialIndex: number) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[phaseIndex].materials?.splice(materialIndex, 1);
    setRoadmap(updatedRoadmap);

    toast({
      title: "Material Removed",
      description: "Learning material has been removed from the roadmap."
    });
  };

  const handleSaveRoadmap = async () => {
    if (!courseId) {
      toast({
        title: "Missing Course ID",
        description: "Course ID is missing.",
        variant: "destructive"
      });
      return;
    }

    if (!course) {
      toast({
        title: "Missing Course Data",
        description: "Course data is missing.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateCourse(courseId, { ...course, roadmap: roadmap });

      toast({
        title: "Roadmap Saved",
        description: "Roadmap has been saved successfully."
      });
    } catch (error) {
      console.error("Error saving roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to save roadmap. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderVideosList = (phase: RoadmapPhase, phaseIndex: number) => {
    if (!phase.videos || phase.videos.length === 0) return null;
    
    return (
      <div className="mt-2">
        <h5 className="font-medium text-sm mb-1">Videos:</h5>
        <ul className="space-y-2">
          {phase.videos.map((video, index) => {
            // Ensure video is treated as a Video object, not a string
            const videoItem = typeof video === 'string' 
              ? { id: `video_${index}`, title: 'Unknown Video', url: video } as Video
              : video;
              
            return (
              <li key={videoItem.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <div>
                  <p className="text-sm font-medium">{videoItem.title}</p>
                  <p className="text-xs text-gray-500">Topic Index: {videoItem.topicIndex}</p>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveVideo(phaseIndex, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  const renderMaterialsList = (phase: RoadmapPhase, phaseIndex: number) => {
    if (!phase.materials || phase.materials.length === 0) return null;
    
    return (
      <div className="mt-2">
        <h5 className="font-medium text-sm mb-1">Learning Materials:</h5>
        <ul className="space-y-2">
          {phase.materials.map((material, index) => {
            // Ensure material is treated as a Material object, not a string
            const materialItem = typeof material === 'string' 
              ? { id: `material_${index}`, title: 'Unknown Material', type: 'link', url: material } as Material
              : material;
              
            return (
              <li key={materialItem.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <div>
                  <p className="text-sm font-medium">{materialItem.title}</p>
                  <p className="text-xs text-gray-500">Type: {materialItem.type}</p>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveMaterial(phaseIndex, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  if (!course) {
    return <div className="p-6">Loading course...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin/courses" className="text-eduBlue-600 hover:text-eduBlue-700 flex items-center mb-4">
          &larr; Back to Course
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{course.title} - Roadmap</h1>
          <Button onClick={() => setShowPhaseForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Phase
          </Button>
        </div>
      </div>

      {showPhaseForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Phase</CardTitle>
            <CardDescription>
              Enter the details for the new phase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newPhase.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={newPhase.duration}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="topics">Topics (comma separated)</Label>
                <Textarea
                  id="topics"
                  name="topics"
                  value={newPhase.topics}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="projects">Projects (comma separated)</Label>
                <Textarea
                  id="projects"
                  name="projects"
                  value={newPhase.projects}
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={handleAddPhase}>Add Phase</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {roadmap.map((phase, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Phase {phase.phase}: {phase.title}</CardTitle>
              <CardDescription>
                Duration: {phase.duration}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h5 className="font-medium text-sm">Topics:</h5>
                  <ul className="list-disc list-inside">
                    {phase.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm">Projects:</h5>
                  <ul className="list-disc list-inside">
                    {phase.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>

                {renderVideosList(phase, index)}
                {renderMaterialsList(phase, index)}

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setShowVideoForm(true)}>
                    Add Video
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowMaterialForm(true)}>
                    Add Material
                  </Button>
                </div>

                {showVideoForm && (
                  <Card className="mt-4">
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="videoTitle">Video Title</Label>
                          <Input
                            id="videoTitle"
                            name="title"
                            value={videoData.title}
                            onChange={handleVideoInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="videoUrl">Video URL</Label>
                          <Input
                            id="videoUrl"
                            name="url"
                            value={videoData.url}
                            onChange={handleVideoInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="videoDescription">Video Description</Label>
                          <Textarea
                            id="videoDescription"
                            name="description"
                            value={videoData.description}
                            onChange={handleVideoInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="videoTopicIndex">Topic Index</Label>
                          <Input
                            id="videoTopicIndex"
                            name="topicIndex"
                            type="number"
                            value={videoData.topicIndex}
                            onChange={handleVideoInputChange}
                          />
                        </div>
                        <Button onClick={() => handleAddVideo(index)}>Add Video</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showMaterialForm && (
                  <Card className="mt-4">
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="materialTitle">Material Title</Label>
                          <Input
                            id="materialTitle"
                            name="title"
                            value={materialData.title}
                            onChange={handleMaterialInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="materialType">Material Type</Label>
                          <Select
                            value={materialData.type}
                            onValueChange={(value: string) => setMaterialData(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="link">Link</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="materialUrl">Material URL</Label>
                          <Input
                            id="materialUrl"
                            name="url"
                            value={materialData.url}
                            onChange={handleMaterialInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="materialDescription">Material Description</Label>
                          <Textarea
                            id="materialDescription"
                            name="description"
                            value={materialData.description}
                            onChange={handleMaterialInputChange}
                          />
                        </div>
                        <Button onClick={() => handleAddMaterial(index)}>Add Material</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
            <div className="flex justify-end p-4">
              <Button variant="destructive" size="sm" onClick={() => handleRemovePhase(index)}>
                Remove Phase
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveRoadmap}>
          Save Roadmap
        </Button>
      </div>
    </div>
  );
};

export default AdminCourseRoadmap;
