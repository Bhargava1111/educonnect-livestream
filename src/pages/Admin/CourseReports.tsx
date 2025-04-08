
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  getCourseById,
  getEnrollmentsByCourseId,
  getCourseStatistics,
  exportEnrollmentsAsCSV
} from "@/lib/courseManagement";
import { ChevronLeft, Download, Mail, FileCheck, Users, DollarSign, BarChart3 } from 'lucide-react';

const CourseReports = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  
  useEffect(() => {
    if (!courseId) return;
    
    // Load course
    const loadedCourse = getCourseById(courseId);
    if (loadedCourse) {
      setCourse(loadedCourse);
      
      // Load statistics
      const courseStats = getCourseStatistics(courseId);
      setStats(courseStats);
      
      // Load enrollments
      const courseEnrollments = getEnrollmentsByCourseId(courseId);
      setEnrollments(courseEnrollments);
    } else {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive"
      });
      navigate('/admin/courses');
    }
  }, [courseId]);
  
  const handleExportCSV = () => {
    if (!courseId) return;
    
    try {
      const csvContent = exportEnrollmentsAsCSV();
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${course?.title.replace(/\s+/g, '_').toLowerCase()}_enrollments.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Enrollment data has been exported to CSV."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was a problem exporting the data.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendReport = () => {
    toast({
      title: "Report Sent",
      description: "Course report has been emailed to info@careeraspiretechnology.com"
    });
  };
  
  if (!course || !stats) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-40">
          <p>Loading course reports...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin/courses" className="text-blue-600 hover:text-blue-700 flex items-center mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{course.title} - Reports</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={handleSendReport}>
              <Mail className="mr-2 h-4 w-4" />
              Email Report
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-10 w-10 text-green-500 bg-green-100 p-2 rounded-full" />
              <div>
                <p className="text-sm text-gray-500">Avg. Progress</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgProgress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-10 w-10 text-purple-500 bg-purple-100 p-2 rounded-full" />
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completedStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-10 w-10 text-yellow-500 bg-yellow-100 p-2 rounded-full" />
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="enrollments">
        <TabsList className="mb-4">
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="assessments">Assessment Results</TabsTrigger>
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollments</CardTitle>
              <CardDescription>
                View all students enrolled in this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        No students enrolled in this course yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">{enrollment.studentId}</TableCell>
                        <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{enrollment.progress}%</span>
                        </TableCell>
                        <TableCell>
                          {enrollment.completed ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              In Progress
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>
                View student performance in course assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-gray-500">
                Assessment result data will appear here once students complete assessments.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>
                Track student advancement through course curriculum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-gray-500">
                Detailed student progress tracking will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseReports;
