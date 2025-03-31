
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  FileText, 
  GraduationCap, 
  Layers, 
  LogOut,
  Plus, 
  Settings, 
  User, 
  UserPlus, 
  Users, 
  Video 
} from 'lucide-react';
import { isAdminLoggedIn, logoutAdmin } from '@/lib/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Check if admin is logged in
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white h-screen shadow-md fixed border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-eduBlue-700">Career Aspire</h2>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Button variant="default" className="w-full justify-start">
              <Layers className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Students
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <GraduationCap className="mr-2 h-4 w-4" />
              Courses
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Video className="mr-2 h-4 w-4" />
              Live Sessions
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              Assessments
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,845</div>
              <p className="text-xs text-green-500 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" /> 12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-green-500 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" /> 2 new this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$187,294</div>
              <p className="text-xs text-green-500 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" /> 8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Students */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Student Registrations</CardTitle>
                  <CardDescription>
                    New students who registered in the last 7 days
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Emily Johnson", email: "emily.j@example.com", days: 1, course: "Python Full Stack" },
                    { name: "Michael Smith", email: "michael.smith@example.com", days: 2, course: "MERN Stack" },
                    { name: "Sarah Williams", email: "sarah.w@example.com", days: 3, course: "Java Backend" },
                    { name: "David Brown", email: "david.b@example.com", days: 5, course: "Cybersecurity" },
                    { name: "Lisa Davis", email: "lisa.d@example.com", days: 7, course: "MEAN Stack" }
                  ].map((student, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{student.course}</Badge>
                        <div className="text-sm text-gray-500">{`${student.days} day${student.days !== 1 ? 's' : ''} ago`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Popular Courses */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Popular Courses</CardTitle>
                  <CardDescription>
                    Most enrolled courses this month
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Manage Courses
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Python Full Stack Development", enrollments: 145, growth: 12 },
                    { name: "MERN Stack Development", enrollments: 132, growth: 18 },
                    { name: "Cybersecurity & Ethical Hacking", enrollments: 128, growth: 24 },
                    { name: "Java Backend Development", enrollments: 118, growth: 8 },
                    { name: "Data Science & Analytics", enrollments: 105, growth: 6 },
                  ].map((course, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-eduBlue-100 text-eduBlue-700 h-8 w-8 rounded-full flex items-center justify-center font-bold">
                          {i+1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.enrollments} enrollments</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-green-500 flex items-center mr-4">
                          <ChevronUp className="h-3 w-3 mr-1" /> {course.growth}%
                        </span>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Assessments */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>
                    Latest submissions and grades
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { student: "Emily Johnson", assessment: "Python Data Structures Quiz", grade: "85/100", status: "Graded" },
                    { student: "Michael Smith", assessment: "MERN Stack Project", grade: "Pending", status: "Submitted" },
                    { student: "Sarah Williams", assessment: "Java OOP Assignment", grade: "92/100", status: "Graded" },
                    { student: "David Brown", assessment: "Network Security Quiz", grade: "78/100", status: "Graded" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.assessment}</p>
                        <p className="text-xs text-gray-500">Student: {item.student}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={item.status === "Graded" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                        <span className="text-sm font-medium">{item.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>All Students</CardTitle>
                  <CardDescription>
                    Manage your student roster
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Name</th>
                          <th className="text-left font-medium p-2">Email</th>
                          <th className="text-left font-medium p-2">Course</th>
                          <th className="text-left font-medium p-2">Progress</th>
                          <th className="text-left font-medium p-2">Status</th>
                          <th className="text-right font-medium p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Emily Johnson", email: "emily.j@example.com", course: "Python Full Stack", progress: 65, status: "Active" },
                          { name: "Michael Smith", email: "michael.smith@example.com", course: "MERN Stack", progress: 42, status: "Active" },
                          { name: "Sarah Williams", email: "sarah.w@example.com", course: "Java Backend", progress: 28, status: "Active" },
                          { name: "David Brown", email: "david.b@example.com", course: "Cybersecurity", progress: 53, status: "Active" },
                          { name: "Lisa Davis", email: "lisa.d@example.com", course: "MEAN Stack", progress: 15, status: "Active" },
                          { name: "Robert Wilson", email: "robert.w@example.com", course: "Data Science", progress: 78, status: "Active" },
                          { name: "Jennifer Moore", email: "jennifer.m@example.com", course: "DevOps", progress: 36, status: "On Hold" },
                        ].map((student, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="p-2">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                {student.name}
                              </div>
                            </td>
                            <td className="p-2">{student.email}</td>
                            <td className="p-2">{student.course}</td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      student.progress > 75 ? "bg-green-500" : 
                                      student.progress > 50 ? "bg-eduBlue-500" : 
                                      student.progress > 30 ? "bg-amber-500" : "bg-red-500"
                                    }`} 
                                    style={{ width: `${student.progress}%` }}
                                  ></div>
                                </div>
                                <span>{student.progress}%</span>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                                {student.status}
                              </Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm">
                                <User className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>
                    View and manage all courses
                  </CardDescription>
                </div>
                <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Course</th>
                          <th className="text-left font-medium p-2">Students</th>
                          <th className="text-left font-medium p-2">Duration</th>
                          <th className="text-left font-medium p-2">Status</th>
                          <th className="text-right font-medium p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Python Full Stack Development", students: 145, duration: "16 weeks", status: "Active" },
                          { name: "MERN Stack Development", students: 132, duration: "14 weeks", status: "Active" },
                          { name: "Cybersecurity & Ethical Hacking", students: 128, duration: "12 weeks", status: "Active" },
                          { name: "Java Backend Development", students: 118, duration: "14 weeks", status: "Active" },
                          { name: "Data Science & Analytics", students: 105, duration: "14 weeks", status: "Active" },
                          { name: "MEAN Stack Development", students: 98, duration: "14 weeks", status: "Active" },
                          { name: "Front-End Development", students: 87, duration: "10 weeks", status: "Active" },
                          { name: "Mobile App Development", students: 75, duration: "12 weeks", status: "Active" },
                          { name: "DevOps & Cloud Computing", students: 62, duration: "12 weeks", status: "Coming Soon" },
                        ].map((course, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="p-2 font-medium">{course.name}</td>
                            <td className="p-2">{course.students} enrolled</td>
                            <td className="p-2">{course.duration}</td>
                            <td className="p-2">
                              <Badge variant={course.status === "Active" ? "default" : "secondary"}>
                                {course.status}
                              </Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm">
                                Manage
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Live Sessions</CardTitle>
                  <CardDescription>
                    Sessions scheduled for the next 7 days
                  </CardDescription>
                </div>
                <Button className="bg-eduBlue-600 hover:bg-eduBlue-700" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Python Fundamentals: Data Structures", course: "Python Full Stack", instructor: "Dr. Smith", date: new Date().toLocaleDateString(), time: "10:00 AM", students: 35 },
                    { title: "React Components & Props", course: "MERN Stack", instructor: "Mrs. Johnson", date: new Date().toLocaleDateString(), time: "1:00 PM", students: 28 },
                    { title: "Java OOP Concepts", course: "Java Backend", instructor: "Mr. Davis", date: new Date(Date.now() + 86400000).toLocaleDateString(), time: "11:00 AM", students: 30 },
                    { title: "Network Security Fundamentals", course: "Cybersecurity", instructor: "Ms. Wilson", date: new Date(Date.now() + 86400000).toLocaleDateString(), time: "2:00 PM", students: 22 },
                    { title: "MongoDB Schema Design", course: "MEAN Stack", instructor: "Mr. Adams", date: new Date(Date.now() + 2*86400000).toLocaleDateString(), time: "10:00 AM", students: 25 },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <div className="flex text-sm text-gray-500 space-x-4">
                          <span>Course: {session.course}</span>
                          <span>Instructor: {session.instructor}</span>
                        </div>
                        <p className="text-sm text-gray-500">{`${session.date} at ${session.time} • ${session.students} students enrolled`}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline" className="bg-eduBlue-600 text-white hover:bg-eduBlue-700">Start</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
