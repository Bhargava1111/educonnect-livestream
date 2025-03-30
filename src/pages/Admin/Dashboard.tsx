
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Calendar, ChevronDown, ChevronUp, Database, Graduation, Layers, Users, Video } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
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
            <Graduation className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4 mr-1" /> 4 new this month
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
            <div className="text-2xl font-bold">$48,294</div>
            <p className="text-xs text-red-500 flex items-center">
              <ChevronDown className="h-4 w-4 mr-1" /> 3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <div className="p-6">
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <Layers className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Students
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Graduation className="mr-2 h-4 w-4" />
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
            </nav>
          </div>
        </Card>
        
        {/* Main Content */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tabs for different views */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="recent">Recent Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              {/* Recent Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Student Registrations</CardTitle>
                  <CardDescription>
                    New students who registered in the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{`S${i+1}`}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Student {i+1}</p>
                            <p className="text-xs text-gray-500">student{i+1}@example.com</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{`${i+1} day${i !== 0 ? 's' : ''} ago`}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Popular Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Courses</CardTitle>
                  <CardDescription>
                    Most enrolled courses this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Full-Stack Web Development", "Data Science & Analytics", "Mobile App Development", "Cloud Architecture", "Front-End Development"].map((course, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-eduBlue-100 text-eduBlue-700 h-8 w-8 rounded-full flex items-center justify-center font-bold">
                            {i+1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{course}</p>
                            <p className="text-xs text-gray-500">{`${150 - (i * 20)} enrollments`}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Live Sessions</CardTitle>
                  <CardDescription>
                    Sessions scheduled for the next 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Introduction to React", "Advanced Python", "Database Design", "Cloud Computing Basics", "Mobile App UX Design"].map((session, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{session}</p>
                          <p className="text-sm text-gray-500">{`${new Date().toLocaleDateString()} at ${10 + i}:00 AM`}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline" className="bg-eduBlue-600 text-white hover:bg-eduBlue-700">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest activities across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Activity {i+1}</span>
                            <span className="text-gray-500"> - {i === 0 ? 'Just now' : `${i} hour${i !== 1 ? 's' : ''} ago`}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {['New student registration', 'Course completed', 'Assignment submitted', 'Payment received', 'Support ticket resolved'][i]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
