import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, Clock, Code, FileText, GraduationCap, Video } from 'lucide-react';

const CourseRoadmap = () => {
  const { courseId } = useParams<{courseId: string}>();

  // Mock data for different course roadmaps
  const coursesData: Record<string, any> = {
    "1": {
      name: "Python Full Stack Development",
      description: "Master Python from basics to building full-stack web applications",
      duration: "16 weeks",
      level: "Beginner to Advanced",
      roadmap: [
        {
          phase: 1,
          title: "Python Fundamentals",
          duration: "3 weeks",
          topics: ["Python Syntax", "Data Types", "Control Flow", "Functions", "Error Handling"],
          projects: ["Command Line Tools", "Basic Data Analysis"]
        },
        {
          phase: 2,
          title: "Python Advanced Concepts",
          duration: "3 weeks",
          topics: ["Object-Oriented Programming", "Modules & Packages", "File I/O", "Virtual Environments", "Testing"],
          projects: ["Library Management System", "Data Visualization Tool"]
        },
        {
          phase: 3,
          title: "Web Development with Django",
          duration: "4 weeks",
          topics: ["Django Basics", "Models & Databases", "Views & Templates", "Forms & Validation", "Authentication"],
          projects: ["Blog Application", "E-commerce Website"]
        },
        {
          phase: 4,
          title: "Frontend Integration",
          duration: "3 weeks",
          topics: ["HTML/CSS", "JavaScript", "React Basics", "API Integration", "State Management"],
          projects: ["Portfolio Website", "Dashboard UI"]
        },
        {
          phase: 5,
          title: "Deployment & DevOps",
          duration: "2 weeks",
          topics: ["Docker", "CI/CD", "Cloud Deployment", "Performance Optimization", "Security"],
          projects: ["Deployed Full-Stack Application"]
        },
        {
          phase: 6,
          title: "Capstone Project",
          duration: "1 week",
          topics: ["Project Planning", "Implementation", "Testing", "Deployment", "Presentation"],
          projects: ["Comprehensive Full-Stack Application"]
        }
      ]
    },
    "4": {
      name: "Java Backend Development",
      description: "Become proficient in Java and Spring for enterprise backend development",
      duration: "14 weeks",
      level: "Intermediate to Advanced",
      roadmap: [
        {
          phase: 1,
          title: "Core Java",
          duration: "3 weeks",
          topics: ["Java Basics", "OOP Concepts", "Collections", "Exception Handling", "Multithreading"],
          projects: ["Banking System Console App"]
        },
        {
          phase: 2,
          title: "Advanced Java",
          duration: "3 weeks",
          topics: ["JDBC", "Java 8+ Features", "Design Patterns", "Unit Testing", "Build Tools"],
          projects: ["Library Management System"]
        },
        {
          phase: 3,
          title: "Spring Framework",
          duration: "4 weeks",
          topics: ["Spring Core", "Spring Boot", "Spring Data JPA", "Spring Security", "Spring MVC"],
          projects: ["RESTful API Service"]
        },
        {
          phase: 4,
          title: "Microservices",
          duration: "2 weeks",
          topics: ["Microservice Architecture", "API Gateway", "Service Discovery", "Circuit Breaker", "Event Messaging"],
          projects: ["E-commerce Microservice"]
        },
        {
          phase: 5,
          title: "DevOps & Deployment",
          duration: "1 week",
          topics: ["Docker", "Kubernetes", "CI/CD", "Cloud Deployment", "Monitoring"],
          projects: ["Containerized Application Deployment"]
        },
        {
          phase: 6,
          title: "Capstone Project",
          duration: "1 week",
          topics: ["Project Planning", "Implementation", "Testing", "Deployment", "Presentation"],
          projects: ["Enterprise Backend System"]
        }
      ]
    },
    "3": {
      name: "MERN Stack Development",
      description: "Build dynamic web applications using MongoDB, Express, React, and Node.js",
      duration: "14 weeks",
      level: "Intermediate",
      roadmap: [
        {
          phase: 1,
          title: "JavaScript Foundations",
          duration: "2 weeks",
          topics: ["ES6+ Features", "Async Programming", "Error Handling", "Functional Programming", "TypeScript Basics"],
          projects: ["Interactive Web Components"]
        },
        {
          phase: 2,
          title: "Backend with Node.js & Express",
          duration: "3 weeks",
          topics: ["Node.js Fundamentals", "Express Framework", "RESTful APIs", "Authentication", "Error Handling"],
          projects: ["API Server"]
        },
        {
          phase: 3,
          title: "Database with MongoDB",
          duration: "2 weeks",
          topics: ["MongoDB Basics", "Schema Design", "CRUD Operations", "Aggregation", "Indexing"],
          projects: ["Data-driven Application"]
        },
        {
          phase: 4,
          title: "Frontend with React",
          duration: "4 weeks",
          topics: ["React Fundamentals", "Hooks", "State Management", "Routing", "Form Handling"],
          projects: ["Single Page Application"]
        },
        {
          phase: 5,
          title: "Full Stack Integration",
          duration: "2 weeks",
          topics: ["API Integration", "Authentication Flow", "Error Handling", "Optimization", "Testing"],
          projects: ["Social Media Platform"]
        },
        {
          phase: 6,
          title: "Deployment & Best Practices",
          duration: "1 week",
          topics: ["CI/CD", "Cloud Deployment", "Security", "Performance", "Monitoring"],
          projects: ["Deployed Full Stack Application"]
        }
      ]
    },
    "2": {
      name: "Cybersecurity & Ethical Hacking",
      description: "Learn to identify, exploit, and defend against security threats",
      duration: "12 weeks",
      level: "Intermediate to Advanced",
      roadmap: [
        {
          phase: 1,
          title: "Security Fundamentals",
          duration: "2 weeks",
          topics: ["Cybersecurity Principles", "Network Basics", "Security Policies", "Threat Landscape", "Security Tools"],
          projects: ["Security Assessment Report"]
        },
        {
          phase: 2,
          title: "Network Security",
          duration: "2 weeks",
          topics: ["Protocols", "Firewalls", "IDS/IPS", "VPNs", "Network Monitoring"],
          projects: ["Network Security Implementation"]
        },
        {
          phase: 3,
          title: "Vulnerability Assessment",
          duration: "2 weeks",
          topics: ["Scanning Tools", "OWASP Top 10", "Vulnerability Management", "Risk Assessment", "Reporting"],
          projects: ["Application Vulnerability Assessment"]
        },
        {
          phase: 4,
          title: "Ethical Hacking",
          duration: "3 weeks",
          topics: ["Reconnaissance", "Exploitation", "Post-exploitation", "Social Engineering", "Wireless Attacks"],
          projects: ["Capture The Flag Challenges"]
        },
        {
          phase: 5,
          title: "Incident Response",
          duration: "2 weeks",
          topics: ["Incident Management", "Digital Forensics", "Malware Analysis", "Log Analysis", "Recovery Strategies"],
          projects: ["Incident Response Plan"]
        },
        {
          phase: 6,
          title: "Security Hardening & Certification Prep",
          duration: "1 week",
          topics: ["System Hardening", "Security Best Practices", "Compliance", "Certification Review", "Career Paths"],
          projects: ["Security Implementation Project"]
        }
      ]
    }
  };
  
  // Add a default course in case courseId is not found
  const defaultCourse = {
    name: "Full-Stack Web Development",
    description: "Master front-end and back-end technologies for complete web applications",
    duration: "12 weeks",
    level: "Intermediate",
    roadmap: [
      {
        phase: 1,
        title: "Web Fundamentals",
        duration: "2 weeks",
        topics: ["HTML5", "CSS3", "JavaScript Basics", "Responsive Design", "Git Version Control"],
        projects: ["Portfolio Website", "Landing Page"]
      },
      {
        phase: 2,
        title: "Frontend Development",
        duration: "3 weeks",
        topics: ["JavaScript Advanced", "React", "State Management", "API Integration", "Component Design"],
        projects: ["Single Page Application", "Interactive Dashboard"]
      },
      {
        phase: 3,
        title: "Backend Development",
        duration: "3 weeks",
        topics: ["Node.js", "Express", "REST APIs", "Authentication", "Database Design"],
        projects: ["API Server", "Authentication System"]
      },
      {
        phase: 4,
        title: "Database Integration",
        duration: "2 weeks",
        topics: ["MongoDB", "SQL", "ORM/ODM", "Data Modeling", "Performance Optimization"],
        projects: ["Full-Stack CRUD App"]
      },
      {
        phase: 5,
        title: "Deployment & DevOps",
        duration: "1 week",
        topics: ["Cloud Deployment", "CI/CD", "Docker", "Monitoring", "Security Best Practices"],
        projects: ["Deployed Application"]
      },
      {
        phase: 6,
        title: "Capstone Project",
        duration: "1 week",
        topics: ["Project Planning", "Implementation", "Testing", "Deployment", "Presentation"],
        projects: ["Complete Web Application"]
      }
    ]
  };

  // Get the course based on courseId, use courseId directly or fallback to default
  const course = coursesData[courseId || ""] || defaultCourse;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/courses" className="text-eduBlue-600 hover:text-eduBlue-700 flex items-center mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Link>
        <h1 className="text-3xl font-bold">{course.name} - Roadmap</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-500" />
            <span>Duration: {course.duration}</span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-gray-500" />
            <span>Level: {course.level}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {course.roadmap.map((phase, index) => (
            <Card key={index} className={`mb-6 relative overflow-hidden ${index === 0 ? 'border-l-4 border-green-500' : ''}`}>
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium">
                  Current Phase
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-eduBlue-100 text-eduBlue-700 h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                    {phase.phase}
                  </span>
                  {phase.title}
                </CardTitle>
                <CardDescription>Duration: {phase.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <FileText className="mr-2 h-4 w-4 text-gray-500" />
                      Topics Covered
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.topics.map((topic, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <Code className="mr-2 h-4 w-4 text-gray-500" />
                      Projects
                    </h4>
                    <ul className="space-y-1">
                      {phase.projects.map((project, i) => (
                        <li key={i} className="flex items-start">
                          <Badge variant="outline" className="mr-2">Project {i+1}</Badge>
                          <span className="text-sm">{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Video className="mr-2 h-4 w-4 text-eduBlue-600" />
                    <span className="text-sm font-medium">15 Video Lessons</span>
                  </div>
                  
                  {index === 0 ? (
                    <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">
                      Continue Learning
                    </Button>
                  ) : (
                    <Button variant="outline" disabled={index > 1}>
                      {index === 1 ? 'Unlocks Soon' : 'Locked'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Live Instructor-Led Sessions</h4>
                  <p className="text-sm text-gray-500">Learn directly from industry experts</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Hands-on Projects</h4>
                  <p className="text-sm text-gray-500">Build real-world applications</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Personalized Mentorship</h4>
                  <p className="text-sm text-gray-500">One-on-one guidance for your growth</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Job Placement Support</h4>
                  <p className="text-sm text-gray-500">Resume building, interview prep, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Career Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {courseId === "1" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2">$105K+</Badge>
                      <span>Python Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$115K+</Badge>
                      <span>Full Stack Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$120K+</Badge>
                      <span>Data Scientist</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$110K+</Badge>
                      <span>DevOps Engineer</span>
                    </li>
                  </>
                )}
                {courseId === "4" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2">$110K+</Badge>
                      <span>Java Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$120K+</Badge>
                      <span>Backend Engineer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$130K+</Badge>
                      <span>Solutions Architect</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$115K+</Badge>
                      <span>Enterprise Application Developer</span>
                    </li>
                  </>
                )}
                {courseId === "3" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2">$105K+</Badge>
                      <span>MERN Stack Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$115K+</Badge>
                      <span>Frontend Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$110K+</Badge>
                      <span>JavaScript Engineer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$120K+</Badge>
                      <span>Full Stack Developer</span>
                    </li>
                  </>
                )}
                {courseId === "2" && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2">$115K+</Badge>
                      <span>Security Analyst</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$130K+</Badge>
                      <span>Ethical Hacker</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$125K+</Badge>
                      <span>Information Security Engineer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$140K+</Badge>
                      <span>Cybersecurity Consultant</span>
                    </li>
                  </>
                )}
                {!courseId || (courseId !== "1" && courseId !== "2" && courseId !== "3" && courseId !== "4") && (
                  <>
                    <li className="flex items-center">
                      <Badge className="mr-2">$105K+</Badge>
                      <span>Web Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$115K+</Badge>
                      <span>Full Stack Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$110K+</Badge>
                      <span>Frontend Developer</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2">$120K+</Badge>
                      <span>Backend Developer</span>
                    </li>
                  </>
                )}
              </ul>

              <Separator className="my-4" />
              
              <div>
                <h4 className="font-medium mb-2">Placement Assistance</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Career Aspire Technology provides comprehensive placement support including resume building, interview preparation, and direct connections with our hiring partners.
                </p>
                <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">
                  Request Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseRoadmap;
