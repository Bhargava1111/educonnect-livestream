
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Database, Globe, Laptop, Search, Server } from 'lucide-react';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 1,
      title: "Full-Stack Web Development",
      description: "Master front-end and back-end technologies for complete web applications.",
      duration: "12 weeks",
      level: "Intermediate",
      category: "web",
      price: 999,
      icon: <Code />
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      description: "Learn to analyze and visualize complex data for business insights.",
      duration: "10 weeks",
      level: "Advanced",
      category: "data",
      price: 1199,
      icon: <Database />
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Create native mobile applications for iOS and Android platforms.",
      duration: "8 weeks",
      level: "Intermediate",
      category: "mobile",
      price: 899,
      icon: <Laptop />
    },
    {
      id: 4,
      title: "Cloud Architecture",
      description: "Design and implement scalable, highly available cloud solutions.",
      duration: "6 weeks",
      level: "Advanced",
      category: "cloud",
      price: 1299,
      icon: <Server />
    },
    {
      id: 5,
      title: "Front-End Development",
      description: "Create beautiful, responsive user interfaces with modern frameworks.",
      duration: "8 weeks",
      level: "Beginner",
      category: "web",
      price: 799,
      icon: <Globe />
    },
    {
      id: 6,
      title: "Back-End Development",
      description: "Build robust APIs and server-side applications for web services.",
      duration: "9 weeks",
      level: "Intermediate",
      category: "web",
      price: 899,
      icon: <Server />
    },
  ];

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Software Training Courses</h1>
        <p className="text-gray-600 mb-8 text-lg">Develop in-demand skills with our expert-led live courses.</p>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
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
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="web">Web Development</TabsTrigger>
            <TabsTrigger value="data">Data Science</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Development</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Computing</TabsTrigger>
          </TabsList>
          
          {["all", "web", "data", "mobile", "cloud"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter(course => category === "all" || course.category === category)
                  .map(course => (
                    <Card key={course.id} className="card-hover overflow-hidden">
                      <div className="h-40 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 h-16 w-16">
                          {course.icon}
                        </div>
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
                            <div className="font-medium text-eduBlue-600">${course.price}</div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{course.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/courses/${course.id}`} className="w-full">
                          <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">View Details</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Course Request */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Let us know what technology or skill you're interested in learning, and we'll help you find the right course.
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
