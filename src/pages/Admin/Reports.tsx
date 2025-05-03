import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  getAllCourses,
  getAllAssessments,
  getAllLiveMeetings,
  Course,
  Assessment,
  LiveMeeting,
  Enrollment,
  Payment
} from '@/lib/courseManagement';
import { getAllEnrollments } from '@/lib/enrollmentService';
import { getAllPayments } from '@/lib/paymentService';

const AdminReportsPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  
  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [activeEnrollments, setActiveEnrollments] = useState(0);
  
  // Chart data
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [courseDistribution, setCourseDistribution] = useState<any[]>([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];
  
  useEffect(() => {
    // Load all data
    const loadedCourses = getAllCourses();
    const loadedEnrollments = getAllEnrollments();
    const loadedPayments = getAllPayments();
    const loadedAssessments = getAllAssessments();
    const loadedMeetings = getAllLiveMeetings();
    
    setCourses(loadedCourses);
    setEnrollments(loadedEnrollments);
    setPayments(loadedPayments);
    setAssessments(loadedAssessments);
    setMeetings(loadedMeetings);
    
    // Calculate stats
    const revenue = loadedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const uniqueStudents = [...new Set(loadedEnrollments.map(e => e.studentId))].length;
    const active = loadedEnrollments.filter(e => !e.completed).length;
    
    setTotalRevenue(revenue);
    setTotalStudents(uniqueStudents);
    setTotalCourses(loadedCourses.length);
    setActiveEnrollments(active);
    
    // Generate chart data
    generateEnrollmentData(loadedCourses, loadedEnrollments);
    generateRevenueData(loadedCourses, loadedPayments);
    generateCourseDistribution(loadedCourses, loadedEnrollments);
  }, []);
  
  const generateEnrollmentData = (courses: Course[], enrollments: Enrollment[]) => {
    const data = courses.map(course => {
      const count = enrollments.filter(e => e.courseId === course.id).length;
      return {
        name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
        enrollments: count
      };
    });
    
    setEnrollmentData(data);
  };
  
  const generateRevenueData = (courses: Course[], payments: Payment[]) => {
    const data = courses.map(course => {
      // Fix: Change "completed" to "success" in the comparison
      const revenue = payments
        .filter(p => p.courseId === course.id && p.status === 'success')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      return {
        name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
        revenue: revenue
      };
    });
    
    setRevenueData(data);
  };
  
  const generateCourseDistribution = (courses: Course[], enrollments: Enrollment[]) => {
    const data = courses.map(course => {
      const count = enrollments.filter(e => e.courseId === course.id).length;
      return {
        name: course.title,
        value: count
      };
    });
    
    setCourseDistribution(data);
  };
  
  // Function to generate a downloadable CSV report
  const downloadCSVReport = () => {
    // Combine course and enrollment data
    const reportData = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
      // Fix: Change "completed" to "success" in the comparison
      const courseRevenue = payments
        .filter(p => p.courseId === course.id && p.status === 'success')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      return {
        courseId: course.id,
        courseTitle: course.title,
        enrollments: courseEnrollments.length,
        completed: courseEnrollments.filter(e => e.completed).length,
        inProgress: courseEnrollments.filter(e => !e.completed).length,
        revenue: courseRevenue
      };
    });
    
    // Create CSV header
    let csv = 'Course ID,Course Title,Total Enrollments,Completed,In Progress,Revenue\n';
    
    // Add data rows
    reportData.forEach(row => {
      csv += `${row.courseId},"${row.courseTitle}",${row.enrollments},${row.completed},${row.inProgress},${row.revenue}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'course_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Fix the status comparison in formatPaymentStatus function
  const formatPaymentStatus = (status: string) => {
    if (status === "success") {
      return {
        label: "Completed",
        color: "bg-green-100 text-green-800"
      };
    }
    
    if (status === "pending") {
      return {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800"
      };
    }
    
    return {
      label: "Failed",
      color: "bg-red-100 text-red-800"
    };
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <Button onClick={downloadCSVReport}>
          Download CSV Report
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">From all course sales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Enrolled in courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">Available on platform</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEnrollments}</div>
            <p className="text-xs text-gray-500 mt-1">Courses in progress</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different reports */}
      <Tabs defaultValue="enrollments">
        <TabsList className="mb-4">
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="distribution">Course Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollments</CardTitle>
              <CardDescription>Number of students enrolled in each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={enrollmentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="enrollments" 
                      name="Enrollments" 
                      fill="#8884d8" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Course</CardTitle>
              <CardDescription>Total revenue generated from each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenue (₹)" 
                      fill="#82ca9d" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Course Distribution</CardTitle>
              <CardDescription>Percentage of enrollments across courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {courseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Payment Success Rate</h3>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{
                width: `${payments.length > 0
                  ? (payments.filter(payment => payment.status === 'success').length / payments.length) * 100
                  : 0}%`
              }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700 ml-2">
            {payments.length > 0
              ? Math.round((payments.filter(payment => payment.status === 'success').length / payments.length) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
