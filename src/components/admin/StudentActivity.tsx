
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  getStudentById, 
  getStudentLoginHistory, 
  getStudentActivity, 
  getStudentTotalActiveTime, 
  formatActiveTime 
} from '@/lib/studentAuth';
import { Clock, CalendarClock, ListChecks } from 'lucide-react';

interface StudentActivityProps {
  studentId: string;
}

const StudentActivity: React.FC<StudentActivityProps> = ({ studentId }) => {
  const [student, setStudent] = useState<any>(null);
  const [activeTime, setActiveTime] = useState<string>("0h 0m");
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Load student data
    const studentData = getStudentById(studentId);
    setStudent(studentData);
    
    // Get login history
    const history = getStudentLoginHistory(studentId);
    setLoginHistory(history);
    
    // Get student activities
    const studentActivities = getStudentActivity(studentId);
    setActivities(studentActivities);
    
    // Get formatted active time
    const totalSeconds = getStudentTotalActiveTime(studentId);
    setActiveTime(formatActiveTime(totalSeconds));
    
  }, [studentId]);

  if (!student) {
    return <div>Loading student data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Student Activity
        </CardTitle>
        <CardDescription>
          Track student engagement and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Time</p>
                  <h2 className="text-2xl font-bold">{activeTime}</h2>
                </div>
                <Clock className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Login Sessions</p>
                  <h2 className="text-2xl font-bold">{loginHistory.length}</h2>
                </div>
                <CalendarClock className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Activities</p>
                  <h2 className="text-2xl font-bold">{activities.length}</h2>
                </div>
                <ListChecks className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logins">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="logins">Login History</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logins">
            <Card>
              <CardHeader>
                <CardTitle>Login Sessions</CardTitle>
                <CardDescription>
                  Recent login history for {student.firstName} {student.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 rounded-md">
                  {loginHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Device</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loginHistory.map((login, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {new Date(login.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell className="max-w-sm truncate">
                              {login.device || 'Unknown device'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No login history available
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Student activity tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 rounded-md">
                  {activities.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((activity, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {new Date(activity.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>{activity.action}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No activity data available
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentActivity;
