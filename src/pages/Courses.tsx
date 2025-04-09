
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Database, 
  FileCode, 
  Globe, 
  Laptop, 
  Network, 
  Search, 
  Server, 
  Shield, 
  Terminal,
  Hash,
  FileJson, 
  BookOpen
} from 'lucide-react';
import { getAllCourses, Course } from "@/lib/courseManagement";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    // Load courses from the admin system
    const courses = getAllCourses();
    // Only show active courses on the public page
    const activeCourses = courses.filter(course => 
      course.status === 'Active' || course.status === undefined
    );
    setAllCourses(activeCourses);
  }, []);

  const getIconForCategory = (category?: string) => {
    switch (category) {
      case 'full-stack':
        return <Code />;
      case 'backend':
        return <Server />;
      case 'frontend':
        return <Globe />;
      case 'data':
        return <Database />;
      case 'devops':
        return <Network />;
      case 'security':
        return <Shield />;
      case 'mobile':
        return <Laptop />;
      case 'programming':
        return <Hash />;
      default:
        return <BookOpen />;
    }
  };

  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Career Aspire Technology Training Courses</h1>
          <p className="text-gray-600 mb-8 text-lg max-w-3xl mx-auto">Develop in-demand skills with our expert-led live courses. Launch your tech career with hands-on training and placement assistance.</p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Course Categories */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="full-stack">Full Stack</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="data">Data Science</TabsTrigger>
            <TabsTrigger value="programming">Programming</TabsTrigger>
            <TabsTrigger value="security">Cybersecurity</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="devops">DevOps</TabsTrigger>
          </TabsList>
          
          {["all", "full-stack", "backend", "frontend", "data", "programming", "security", "mobile", "devops"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter(course => category === "all" || course.category === category)
                  .map(course => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gradient-to-r from-eduBlue-600 to-eduBlue-400 flex items-center justify-center relative">
                        <div className="text-white h-16 w-16">
                          {getIconForCategory(course.category)}
                        </div>
                        {course.popular && (
                          <Badge className="absolute top-2 right-2 bg-amber-500">Popular</Badge>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>
                          <div className="flex justify-between text-sm">
                            <div>
                              <span>{course.duration}</span>
                              <span className="mx-2">•</span>
                              <span>{course.level}</span>
                            </div>
                            <div className="font-medium text-eduBlue-600">{course.price === 0 ? 'Free' : `₹${course.price}`}</div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{course.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link to={`/courses/${course.id}/roadmap`}>
                          <Button variant="outline">View Roadmap</Button>
                        </Link>
                        <Link to={`/courses/${course.id}`}>
                          <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">Enroll Now</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
              {filteredCourses.filter(course => category === "all" || course.category === category).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No courses found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Institution Info */}
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Career Aspire Technology</h3>
            <p className="text-gray-600 mb-6">
              We are a premier training institution focused on bridging the gap between academic learning and industry requirements. With expert instructors, hands-on projects, and placement assistance, we ensure our students are job-ready.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-eduBlue-600">95%</div>
                <p className="text-sm text-gray-500">Placement Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eduBlue-600">500+</div>
                <p className="text-sm text-gray-500">Hiring Partners</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eduBlue-600">10,000+</div>
                <p className="text-sm text-gray-500">Successful Alumni</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eduBlue-600">4.8/5</div>
                <p className="text-sm text-gray-500">Student Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Request */}
        <div className="bg-eduBlue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Let us know what technology or skill you're interested in learning, and we'll help you find the right course or create a customized training plan.
          </p>
          <Link to="/contact">
            <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">Request a Course</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Courses;
