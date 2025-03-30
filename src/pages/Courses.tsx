
import React, { useState } from 'react';
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
  Terminal 
} from 'lucide-react';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 1,
      title: "Python Full Stack Development",
      description: "Master Python from basics to building full-stack web applications with Django and React.",
      duration: "16 weeks",
      level: "Beginner to Advanced",
      category: "full-stack",
      price: 1299,
      icon: <Terminal />,
      popular: true
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      description: "Learn to analyze and visualize complex data for business insights using Python and ML libraries.",
      duration: "14 weeks",
      level: "Intermediate",
      category: "data",
      price: 1199,
      icon: <Database />
    },
    {
      id: 3,
      title: "MERN Stack Development",
      description: "Build modern web applications using MongoDB, Express, React and Node.js.",
      duration: "14 weeks",
      level: "Intermediate",
      category: "full-stack",
      price: 1199,
      icon: <Code />,
      popular: true
    },
    {
      id: 4,
      title: "Java Backend Development",
      description: "Master Java and Spring Boot for building robust enterprise backend systems.",
      duration: "14 weeks",
      level: "Intermediate to Advanced",
      category: "backend",
      price: 1249,
      icon: <Server />,
      popular: true
    },
    {
      id: 5,
      title: "Front-End Development",
      description: "Create beautiful, responsive user interfaces with modern frameworks like React.",
      duration: "10 weeks",
      level: "Beginner",
      category: "frontend",
      price: 899,
      icon: <Globe />
    },
    {
      id: 6,
      title: "DevOps & Cloud Computing",
      description: "Learn to implement CI/CD pipelines and manage cloud infrastructure for scalable applications.",
      duration: "12 weeks",
      level: "Intermediate",
      category: "devops",
      price: 1299,
      icon: <Network />
    },
    {
      id: 7,
      title: "MEAN Stack Development",
      description: "Develop full-stack applications using MongoDB, Express, Angular and Node.js.",
      duration: "14 weeks",
      level: "Intermediate",
      category: "full-stack",
      price: 1199,
      icon: <FileCode />,
      popular: true
    },
    {
      id: 8,
      title: "Cybersecurity & Ethical Hacking",
      description: "Master the techniques to identify vulnerabilities and protect systems from security threats.",
      duration: "12 weeks",
      level: "Intermediate to Advanced",
      category: "security",
      price: 1399,
      icon: <Shield />,
      popular: true
    },
    {
      id: 9,
      title: "Mobile App Development",
      description: "Build native and cross-platform mobile applications for iOS and Android.",
      duration: "12 weeks",
      level: "Intermediate",
      category: "mobile",
      price: 1149,
      icon: <Laptop />
    }
  ];

  const filteredCourses = courses.filter(course => 
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
            <TabsTrigger value="security">Cybersecurity</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="devops">DevOps</TabsTrigger>
          </TabsList>
          
          {["all", "full-stack", "backend", "frontend", "data", "security", "mobile", "devops"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter(course => category === "all" || course.category === category)
                  .map(course => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gradient-to-r from-eduBlue-600 to-eduBlue-400 flex items-center justify-center relative">
                        <div className="text-white h-16 w-16">
                          {course.icon}
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
                            <div className="font-medium text-eduBlue-600">${course.price}</div>
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
