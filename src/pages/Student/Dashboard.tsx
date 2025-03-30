
import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart, 
  Book, 
  Calendar, 
  ChevronRight, 
  Clock, 
  FileText, 
  GraduationCap, 
  Home as HomeIcon, 
  Layout, 
  LogOut, 
  MessageSquare, 
  Settings, 
  User, 
  Video
} from 'lucide-react';
import StudentCourses from './Courses';
import StudentAssessments from './Assessments';
import StudentProfile from './Profile';

const StudentDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();
  
  const studentName = "John Doe";
  const studentAvatar = "";

  const upcomingSessions = [
    { id: 1, title: "Python Fundamentals", date: "Today", time: "3:00 PM", instructorName: "Dr. Smith" },
    { id: 2, title: "Java Backend Development", date: "Tomorrow", time: "2:00 PM", instructorName: "Mrs. Johnson" },
    { id: 3, title: "MERN Stack Workshop", date: "Wed, 15 Jun", time: "4:30 PM", instructorName: "Mr. Davis" },
  ];

  const ongoingCourses = [
    { id: 1, name: "Python Full Stack Development", progress: 65, nextClass: "Tomorrow, 2:00 PM" },
    { id: 2, name: "Cybersecurity Fundamentals", progress: 42, nextClass: "Wed, 3:30 PM" },
  ];

  const recentAssessments = [
    { id: 1, title: "Python Data Structures Quiz", grade: "85/100", status: "Completed" },
    { id: 2, title: "Java OOP Assignment", grade: "Pending", status: "Submitted" },
  ];

  const handleLogout = () => {
    // Implement logout functionality
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-screen shadow-md fixed">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-eduBlue-700">Career Aspire</h2>
            <p className="text-sm text-gray-500">Student Portal</p>
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                {studentAvatar && <AvatarImage src={studentAvatar} />}
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{studentName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link to="/student">
                <Button 
                  variant={activePage === 'dashboard' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePage('dashboard')}
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/student/courses">
                <Button 
                  variant={activePage === 'courses' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePage('courses')}
                >
                  <Book className="mr-2 h-4 w-4" />
                  My Courses
                </Button>
              </Link>
              <Link to="/student/assessments">
                <Button 
                  variant={activePage === 'assessments' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePage('assessments')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Assessments
                </Button>
              </Link>
              <Link to="/student/schedule">
                <Button 
                  variant={activePage === 'schedule' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePage('schedule')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </Link>
              <Link to="/student/profile">
                <Button 
                  variant={activePage === 'profile' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePage('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 w-[calc(100%-16rem)] p-6">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Student Dashboard</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Support
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{upcomingSessions.length}</div>
                      <p className="text-xs text-muted-foreground">Next session today at 3:00 PM</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">53%</div>
                      <p className="text-xs text-green-500">On track for completion</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2</div>
                      <p className="text-xs text-amber-500">Due this week</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Course Progress */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Courses</CardTitle>
                        <CardDescription>Track your ongoing course progress</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {ongoingCourses.map(course => (
                            <div key={course.id} className="border rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-medium">{course.name}</h4>
                                <span className="text-sm text-gray-500">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div className="bg-eduBlue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" /> Next class: {course.nextClass}
                                </span>
                                <Link to={`/student/courses/${course.id}`}>
                                  <Button variant="ghost" size="sm" className="text-eduBlue-600 hover:text-eduBlue-700">
                                    Go to course <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Upcoming Sessions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Sessions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingSessions.map(session => (
                            <div key={session.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{session.title}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" /> {session.date}
                                  <Clock className="h-3 w-3 mx-1 ml-2" /> {session.time}
                                </div>
                                <p className="text-xs text-gray-500">Instructor: {session.instructorName}</p>
                              </div>
                              <Button size="sm" variant="outline" className="bg-eduBlue-600 text-white hover:bg-eduBlue-700">
                                <Video className="h-3 w-3 mr-1" /> Join
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Assessments */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Assessments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentAssessments.map(assessment => (
                            <div key={assessment.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{assessment.title}</p>
                                <p className="text-xs text-gray-500">Grade: {assessment.grade}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                assessment.status === 'Completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {assessment.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            } />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/assessments" element={<StudentAssessments />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
