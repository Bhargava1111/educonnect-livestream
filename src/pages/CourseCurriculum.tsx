
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, BookOpen, Calendar, Clock, Code, Download, FileText, GraduationCap, Users } from 'lucide-react';

const CourseCurriculum = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  
  // Course data mapping
  const coursesData = {
    "1": {
      title: "Python Full Stack Development",
      description: "Master Python from basics to building full-stack web applications with Django and React.",
      duration: "16 weeks",
      level: "Beginner to Advanced",
      price: 1299,
      rating: 4.8,
      students: 12500,
      instructor: "Rajesh Kumar",
      curriculum: [
        {
          title: "Python Programming Fundamentals",
          weeks: "Week 1-4",
          topics: [
            "Python Syntax and Data Types", 
            "Control Flow, Functions and Modules",
            "Object-Oriented Programming in Python",
            "File I/O, Exception Handling",
            "Working with Libraries (NumPy, Pandas)",
            "Mini Project: Data Analysis Application"
          ]
        },
        {
          title: "Web Development with Django",
          weeks: "Week 5-8",
          topics: [
            "Django Framework Overview",
            "Models, Views and Templates",
            "Django ORM and Database Integrations",
            "Django REST Framework",
            "Authentication and Authorization",
            "Mini Project: RESTful API Development"
          ]
        },
        {
          title: "Frontend with React",
          weeks: "Week 9-12",
          topics: [
            "JavaScript ES6+ Fundamentals",
            "React Basics and Components",
            "State Management with Redux",
            "API Integration in React",
            "React Router and Navigation",
            "Mini Project: Interactive Dashboard"
          ]
        },
        {
          title: "Deployment and Best Practices",
          weeks: "Week 13-16",
          topics: [
            "Full Stack Application Architecture",
            "Database Optimization",
            "Testing and Debugging",
            "CI/CD Pipeline Setup",
            "Deployment on Cloud Services",
            "Capstone Project: Complete Full Stack Application"
          ]
        }
      ]
    },
    "3": {
      title: "MERN Stack Development",
      description: "Build modern web applications using MongoDB, Express, React and Node.js.",
      duration: "14 weeks",
      level: "Intermediate",
      price: 1199,
      rating: 4.7,
      students: 9800,
      instructor: "Priya Sharma",
      curriculum: [
        {
          title: "JavaScript and ES6+ Fundamentals",
          weeks: "Week 1-2",
          topics: [
            "JavaScript Core Concepts",
            "ES6+ Features (Arrow Functions, Destructuring, etc.)",
            "Asynchronous JavaScript (Promises, Async/Await)",
            "DOM Manipulation and Events",
            "Error Handling and Debugging",
            "Mini Project: Interactive Web Component"
          ]
        },
        {
          title: "Frontend Development with React",
          weeks: "Week 3-5",
          topics: [
            "React Fundamentals and JSX",
            "Components, Props and State",
            "React Hooks and Context API",
            "Redux for State Management",
            "Routing with React Router",
            "Mini Project: React Dashboard"
          ]
        },
        {
          title: "Backend Development with Node.js and Express",
          weeks: "Week 6-9",
          topics: [
            "Node.js Fundamentals",
            "Express.js Framework",
            "RESTful API Design",
            "Authentication and Authorization",
            "Middleware Implementation",
            "Mini Project: API Service"
          ]
        },
        {
          title: "MongoDB and Database Integration",
          weeks: "Week 10-12",
          topics: [
            "MongoDB Fundamentals",
            "Mongoose ODM",
            "CRUD Operations",
            "Data Modeling and Validation",
            "Indexes and Aggregation",
            "Mini Project: Database Integration"
          ]
        },
        {
          title: "Project Deployment and Best Practices",
          weeks: "Week 13-14",
          topics: [
            "Full Stack Application Architecture",
            "Testing and Debugging",
            "Performance Optimization",
            "Deployment on Platforms (Heroku, AWS)",
            "CI/CD Implementation",
            "Capstone Project: Complete MERN Stack Application"
          ]
        }
      ]
    },
    "10": {
      title: "C Programming Fundamentals",
      description: "Learn the foundation of programming with C language, covering memory management and low-level operations.",
      duration: "8 weeks",
      level: "Beginner",
      price: 899,
      rating: 4.5,
      students: 7200,
      instructor: "Venkat Rao",
      curriculum: [
        {
          title: "Introduction to C Programming",
          weeks: "Week 1-2",
          topics: [
            "History and Importance of C",
            "Setting Up Development Environment",
            "Basic Syntax and Structure",
            "Variables, Data Types, and Constants",
            "Operators and Expressions",
            "Mini Project: Simple Calculator"
          ]
        },
        {
          title: "Control Flow and Functions",
          weeks: "Week 3-4",
          topics: [
            "Conditional Statements (if, switch)",
            "Loops (for, while, do-while)",
            "Functions and Modular Programming",
            "Recursion and Function Types",
            "Variable Scope and Storage Classes",
            "Mini Project: Number Pattern Generator"
          ]
        },
        {
          title: "Arrays and Strings",
          weeks: "Week 5-6",
          topics: [
            "Single and Multi-dimensional Arrays",
            "Character Arrays and Strings",
            "String Handling Functions",
            "Command Line Arguments",
            "Searching and Sorting Algorithms",
            "Mini Project: Student Management System"
          ]
        },
        {
          title: "Memory Management and Advanced Concepts",
          weeks: "Week 7-8",
          topics: [
            "Pointers and Memory Addressing",
            "Dynamic Memory Allocation",
            "Structures and Unions",
            "File Handling and I/O",
            "Preprocessor Directives",
            "Final Project: Library Management System"
          ]
        }
      ]
    },
    "11": {
      title: "C++ Programming & OOP",
      description: "Master C++ and object-oriented programming concepts for software development.",
      duration: "10 weeks",
      level: "Beginner to Intermediate",
      price: 999,
      rating: 4.6,
      students: 8100,
      instructor: "Neha Gupta",
      curriculum: [
        {
          title: "C++ Basics and Differences from C",
          weeks: "Week 1-2",
          topics: [
            "Introduction to C++ and its History",
            "Setting Up C++ Environment",
            "Basic Syntax and Data Types",
            "Input/Output Streams",
            "References vs Pointers",
            "Mini Project: Enhanced Calculator"
          ]
        },
        {
          title: "Object-Oriented Programming Fundamentals",
          weeks: "Week 3-4",
          topics: [
            "Classes and Objects",
            "Constructors and Destructors",
            "Encapsulation and Access Specifiers",
            "Function Overloading",
            "Operator Overloading",
            "Mini Project: Bank Account System"
          ]
        },
        {
          title: "Inheritance and Polymorphism",
          weeks: "Week 5-6",
          topics: [
            "Inheritance Types and Implementation",
            "Virtual Functions",
            "Abstract Classes and Pure Virtual Functions",
            "Runtime Polymorphism",
            "Friend Functions and Classes",
            "Mini Project: Shape Hierarchy"
          ]
        },
        {
          title: "STL and Advanced C++ Features",
          weeks: "Week 7-8",
          topics: [
            "Standard Template Library Overview",
            "Containers (Vector, List, Map)",
            "Algorithms and Iterators",
            "Templates and Generic Programming",
            "Exception Handling",
            "Mini Project: Custom Data Structure Implementation"
          ]
        },
        {
          title: "Modern C++ Features and Project",
          weeks: "Week 9-10",
          topics: [
            "Modern C++ Features (C++11 and beyond)",
            "Smart Pointers and Memory Management",
            "Lambda Expressions",
            "Multi-threading Basics",
            "Best Practices and Design Patterns",
            "Final Project: Inventory Management System"
          ]
        }
      ]
    },
    "12": {
      title: "C# .NET Development",
      description: "Build powerful desktop and web applications using C# and the .NET framework.",
      duration: "12 weeks",
      level: "Intermediate",
      price: 1099,
      rating: 4.7,
      students: 6500,
      instructor: "Arun Patel",
      curriculum: [
        {
          title: "C# Fundamentals and .NET Framework",
          weeks: "Week 1-2",
          topics: [
            "Introduction to C# and .NET Framework",
            "Language Syntax and Data Types",
            "Control Statements and Collections",
            "Classes, Objects and Methods",
            "Properties and Encapsulation",
            "Mini Project: Console Application"
          ]
        },
        {
          title: "Object-Oriented Programming in C#",
          weeks: "Week 3-4",
          topics: [
            "Inheritance and Polymorphism",
            "Interfaces and Abstract Classes",
            "Generics and Collections",
            "Exception Handling",
            "Event Handling and Delegates",
            "Mini Project: Library System"
          ]
        },
        {
          title: "Windows Forms Applications",
          weeks: "Week 5-6",
          topics: [
            "Windows Forms Basics",
            "Controls and Their Properties",
            "Layout Management",
            "Data Binding",
            "Dialog Boxes and MDI",
            "Mini Project: Desktop Application"
          ]
        },
        {
          title: "ASP.NET Web Development",
          weeks: "Week 7-9",
          topics: [
            "Introduction to ASP.NET",
            "Web Forms vs MVC",
            "ASP.NET MVC Architecture",
            "Routing and Controllers",
            "Views and Razor Syntax",
            "Mini Project: Simple Web Application"
          ]
        },
        {
          title: "Database Integration and Advanced Topics",
          weeks: "Week 10-12",
          topics: [
            "ADO.NET and Entity Framework",
            "LINQ to SQL and LINQ to Entities",
            "Web API and RESTful Services",
            "Authentication and Authorization",
            "Deployment and Publishing",
            "Final Project: Full-fledged Web Application"
          ]
        }
      ]
    }
  };

  useEffect(() => {
    if (courseId && Object.keys(coursesData).includes(courseId)) {
      // @ts-ignore
      setCourse(coursesData[courseId]);
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Course not found or loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/courses" className="text-eduBlue-600 hover:text-eduBlue-700 flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        Back to Courses
      </Link>
      
      <div className="bg-eduBlue-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg mb-6">{course.description}</p>
        
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <span>{course.students.toLocaleString()}+ students</span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            <span>Instructor: {course.instructor}</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button className="bg-white text-eduBlue-600 hover:bg-gray-100">
            Enroll Now (₹{course.price})
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            Download Brochure
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="curriculum" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curriculum">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {course.curriculum.map((module: any, index: number) => (
                <AccordionItem key={index} value={`module-${index}`}>
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center">
                      <span className="bg-eduBlue-100 text-eduBlue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      {module.title}
                      <span className="ml-auto text-sm text-gray-500 mr-4">{module.weeks}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 ml-12 my-2">
                      {module.topics.map((topic: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                            {i + 1}
                          </div>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Course Overview</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.curriculum.flatMap((module: any) => 
                    module.topics.slice(0, 2).map((topic: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  This comprehensive course will take you from the fundamentals to advanced concepts
                  in {course.title}. Through hands-on projects and exercises, you'll gain practical
                  experience that will prepare you for real-world software development challenges.
                </p>
                <p className="text-gray-700 mt-4">
                  By the end of this course, you'll have built several projects for your portfolio
                  and will be ready to apply your skills in professional settings. Our career support
                  team will help you prepare for job interviews and connect you with our hiring partners.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Who This Course Is For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Individuals looking to start a career in software development</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Students with basic programming knowledge wanting to specialize</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Professionals looking to upskill or switch to a new technology stack</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="instructor">
          <Card>
            <CardHeader>
              <CardTitle>About the Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{course.instructor}</h3>
                  <p className="text-gray-500 mb-4">Senior Instructor at Career Aspire Technology</p>
                  <p className="text-gray-700">
                    {course.instructor} is an experienced software developer and educator with over 10 years
                    of industry experience. They have worked with major tech companies and have
                    trained thousands of students who now work in top organizations worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-eduBlue-600">{course.rating}</div>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={i < Math.floor(course.rating) ? "gold" : "none"} stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <div className="text-gray-500">Based on 350+ student reviews</div>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Amit Verma</CardTitle>
                    <CardDescription>3 months ago</CardDescription>
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="gold" stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>This course completely transformed my career. The instructor was knowledgeable and supportive, and the curriculum was comprehensive and up-to-date with industry standards. I secured a job within a month of completing the course!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Priya Singh</CardTitle>
                    <CardDescription>1 month ago</CardDescription>
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < 4 ? "gold" : "none"} stroke="gold" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>Excellent course content and practical approach to teaching. I appreciated the real-world projects and the emphasis on best practices. The career assistance after course completion was especially helpful.</p>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button variant="outline">View All Reviews</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-eduBlue-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Advance Your Career?</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join our {course.title} course and build the skills needed for today's demanding tech industry.
          Enrollment is open with limited seats available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">
            Enroll Now (₹{course.price})
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Brochure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCurriculum;
