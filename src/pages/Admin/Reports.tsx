
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BookOpen, Award, TrendingUp, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getAllCourses, getAllStudents, getAllAssessments } from '@/lib/courseManagement';
import { getAllLiveMeetings } from '@/lib/services/liveMeetingService';
import { LiveMeeting as ServiceLiveMeeting } from '@/lib/services/liveMeetingService';
import { Course, Student, Assessment } from '@/lib/types';

const AdminReports = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [meetings, setMeetings] = useState<ServiceLiveMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const coursesData = getAllCourses();
        const studentsData = await getAllStudents();
        const assessmentsData = getAllAssessments();
        const meetingsData = await getAllLiveMeetings();
        
        setCourses(coursesData);
        setStudents(studentsData);
        setAssessments(assessmentsData);
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalCourses = courses.length;
  const totalStudents = students.length;
  const totalAssessments = assessments.length;
  const totalMeetings = meetings.length;

  const activeCourses = courses.filter(course => course.status === 'Active').length;
  const inactiveCourses = totalCourses - activeCourses;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const courseStatusData = [
    { name: 'Active', value: activeCourses },
    { name: 'Inactive', value: inactiveCourses },
  ];

  const studentActivityData = [
    { name: 'Active', value: 80 },
    { name: 'Inactive', value: 20 },
  ];

  const meetingScheduledData = [
    { name: 'Scheduled', value: 15 },
    { name: 'Completed', value: 5 },
  ];

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Reports</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Courses</CardTitle>
                <CardDescription>Number of courses available</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <BookOpen className="h-6 w-6 text-gray-500" />
                <span className="text-2xl font-bold">{totalCourses}</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>Number of enrolled students</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Users className="h-6 w-6 text-gray-500" />
                <span className="text-2xl font-bold">{totalStudents}</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Assessments</CardTitle>
                <CardDescription>Number of assessments available</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Award className="h-6 w-6 text-gray-500" />
                <span className="text-2xl font-bold">{totalAssessments}</span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Meetings</CardTitle>
                <CardDescription>Number of live meetings scheduled</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Calendar className="h-6 w-6 text-gray-500" />
                <span className="text-2xl font-bold">{totalMeetings}</span>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Status</CardTitle>
                <CardDescription>Distribution of active and inactive courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={courseStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {courseStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Activity</CardTitle>
                <CardDescription>Engagement levels of students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={studentActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
              <CardDescription>Detailed statistics about courses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={courses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#8884d8" />
                  <Bar dataKey="price" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement</CardTitle>
              <CardDescription>Track student activity and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={students}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activity" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Overall performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={assessments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passingScore" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
