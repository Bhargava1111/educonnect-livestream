
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CalendarDays } from 'lucide-react';
import { getStudentActivity, getStudentLoginHistory, getStudentTotalActiveTime, formatActiveTime, getStudentLastActiveTime } from '@/lib/auth/activityService';

interface StudentActivityProps {
  studentId: string;
}

const StudentActivityComponent: React.FC<StudentActivityProps> = ({ studentId }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [activeTime, setActiveTime] = useState<string>("0m");
  const [lastActive, setLastActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  
  useEffect(() => {
    // Load student activity data
    const activityData = getStudentActivity(studentId);
    setActivities(activityData);
    
    // Load login history
    const loginData = getStudentLoginHistory(studentId);
    setLoginHistory(loginData);
    
    // Get active time
    const totalActiveSeconds = getStudentTotalActiveTime(studentId);
    setActiveTime(formatActiveTime(totalActiveSeconds));
    
    // Get last active time
    const lastActiveTime = getStudentLastActiveTime(studentId);
    setLastActive(lastActiveTime);
  }, [studentId]);
  
  // Filter activities
  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.action === filter);
  
  // Get unique activity types
  const activityTypes = Array.from(new Set(activities.map(a => a.action)));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Active Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{activeTime}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total time spent on the platform
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {lastActive ? (
                new Date(lastActive).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              ) : (
                "Never"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastActive ? (
                `At ${new Date(lastActive).toLocaleTimeString()}`
              ) : (
                "No activity recorded"
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Number of times logged in
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList className="mb-4">
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="login">Login History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Activity History</CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Recent student activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium capitalize">
                            {activity.action}
                          </TableCell>
                          <TableCell>
                            {activity.details ? (
                              <pre className="text-xs overflow-auto max-w-xs">
                                {JSON.stringify(activity.details, null, 2)}
                              </pre>
                            ) : (
                              <span className="text-gray-400">No details</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(activity.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No activity records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="login">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Login History</CardTitle>
              <CardDescription>Record of login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead className="text-right">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginHistory.length > 0 ? (
                      loginHistory.map((login, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                              {login.device}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(login.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No login records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentActivityComponent;
