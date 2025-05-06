import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { logoutStudent } from '@/lib/studentAuth';
import { useStudentData } from '@/hooks/useStudentData';
import StudentCourses from './Courses';
import StudentAssessments from './Assessments';
import StudentProfile from './Profile';

const StudentDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { student, enrollments, loading } = useStudentData();
  
  const handleLogout = () => {
    logoutStudent();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };

  // If the student data is not loaded yet, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-eduBlue-600 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get student name and avatar
  const studentName = student?.name || "Student";
  const studentAvatar = student?.profilePicture || "";
  const enrolledCourseIds = enrollments.map(e => e.courseId) || [];
  const hasCompletedProfile = !!(student?.name && student?.phone && student?.address);

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
                {studentAvatar ? (
                  <AvatarImage src={studentAvatar} alt={studentName} />
                ) : (
                  <AvatarFallback>{studentName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                )}
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{studentName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
            
            {/* Navigation links */}
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

                {!hasCompletedProfile && (
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-amber-800">Complete Your Profile</h3>
                          <p className="text-sm text-amber-700">Please complete your profile to get the most out of our platform.</p>
                        </div>
                        <Link to="/student/profile">
                          <Button size="sm" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-100">
                            Update Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{enrolledCourseIds.length}</div>
                      {enrolledCourseIds.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No courses enrolled yet</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">View your course progress</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">No upcoming sessions scheduled</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">No pending assessments</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Course Enrollment Section */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Learning Journey</CardTitle>
                        <CardDescription>Start your learning journey with us</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {enrolledCourseIds.length === 0 ? (
                          <div className="text-center py-10">
                            <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
                            <p className="text-gray-500 mb-6">Browse our available courses and start your learning journey today.</p>
                            <Link to="/courses">
                              <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">
                                Explore Courses
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {enrolledCourseIds.map((courseId: string, index: number) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-medium">Course {courseId}</h4>
                                  <span className="text-sm text-gray-500">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                  <div className="bg-eduBlue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" /> Not started yet
                                  </span>
                                  <Link to={`/student/courses/${courseId}`}>
                                    <Button variant="ghost" size="sm" className="text-eduBlue-600 hover:text-eduBlue-700">
                                      Go to course <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Profile Completion */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Completion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Profile Status</span>
                              <span className="text-sm font-medium">
                                {hasCompletedProfile ? '100%' : '30%'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-eduBlue-600 h-2.5 rounded-full" 
                                style={{ width: hasCompletedProfile ? '100%' : '30%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm">
                            {hasCompletedProfile ? (
                              <p className="text-green-600">Your profile is complete!</p>
                            ) : (
                              <ul className="space-y-1 text-gray-500">
                                <li className="flex items-center">
                                  <span className={`h-2 w-2 rounded-full mr-2 ${studentData?.name ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                  Name {studentData?.name ? '✓' : ''}
                                </li>
                                <li className="flex items-center">
                                  <span className={`h-2 w-2 rounded-full mr-2 ${studentData?.phone ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                  Phone {studentData?.phone ? '✓' : ''}
                                </li>
                                <li className="flex items-center">
                                  <span className={`h-2 w-2 rounded-full mr-2 ${studentData?.address ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                  Address {studentData?.address ? '✓' : ''}
                                </li>
                              </ul>
                            )}
                          </div>
                          {!hasCompletedProfile && (
                            <Link to="/student/profile">
                              <Button size="sm" className="w-full">
                                Complete Profile
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Resources Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-3 text-gray-500" />
                              <p className="text-sm font-medium">Career Resources</p>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                              <Video className="h-5 w-5 mr-3 text-gray-500" />
                              <p className="text-sm font-medium">Video Tutorials</p>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                              <Book className="h-5 w-5 mr-3 text-gray-500" />
                              <p className="text-sm font-medium">Study Materials</p>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
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
