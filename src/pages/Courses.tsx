
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getAllCourses, Course } from "@/lib/courseManagement";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    // Load all courses
    const allCourses = getAllCourses();
    setCourses(allCourses);
  }, []);

  // Filter courses based on search term, level and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = filterLevel ? course.level === filterLevel : true;
    const matchesCategory = filterCategory ? course.category === filterCategory : true;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Get unique levels and categories for filters
  const levels = Array.from(new Set(courses.map(course => course.level))).filter(Boolean);
  const categories = Array.from(new Set(courses.map(course => course.category))).filter(Boolean);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Explore Our Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input 
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
          <TabsTrigger value="free">Free Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No courses match your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterLevel("");
                    setFilterCategory("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredCourses.map(course => (
                <Card key={course.id} className="h-full flex flex-col">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{course.category || "General"}</Badge>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Instructor: {course.instructor || "TBD"}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm line-clamp-3 mb-4">
                      {course.description || "Learn cutting-edge skills with our expert instructors."}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p>{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Level</p>
                        <p>{course.level || "All Levels"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p>{course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p>{course.students || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/courses/${course.id}/roadmap`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .sort((a, b) => (b.students || 0) - (a.students || 0))
              .slice(0, 6)
              .map(course => (
                <Card key={course.id} className="h-full flex flex-col">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{course.category || "General"}</Badge>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Instructor: {course.instructor || "TBD"}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm line-clamp-3 mb-4">
                      {course.description || "Learn cutting-edge skills with our expert instructors."}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p>{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Level</p>
                        <p>{course.level || "All Levels"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p>{course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p>{course.students || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/courses/${course.id}/roadmap`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="free">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter(course => course.price === 0)
              .map(course => (
                <Card key={course.id} className="h-full flex flex-col">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{course.category || "General"}</Badge>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Instructor: {course.instructor || "TBD"}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm line-clamp-3 mb-4">
                      {course.description || "Learn cutting-edge skills with our expert instructors."}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p>{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Level</p>
                        <p>{course.level || "All Levels"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p>{course.students || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/courses/${course.id}/roadmap`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
