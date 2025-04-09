
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, UserCheck, UserX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Student {
  id: string;
  name: string;
}

interface Attendance {
  id: string;
  studentId: string;
  date: string;
  punchIn: string;
  punchOut: string | null;
  courseId: string;
  duration: number | null;
}

interface AttendanceTrackerProps {
  courseId: string;
}

// Mock data - in a real app this would come from a database
const mockStudents: Student[] = [
  { id: 'student1', name: 'Rahul Sharma' },
  { id: 'student2', name: 'Priya Patel' },
  { id: 'student3', name: 'Amit Singh' },
  { id: 'student4', name: 'Sneha Gupta' },
  { id: 'student5', name: 'Mohit Verma' },
];

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ courseId }) => {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  useEffect(() => {
    // In a real app, fetch attendance records from a database
    // For now, we'll just use mock data
    const mockAttendance: Attendance[] = [
      {
        id: 'att1',
        studentId: 'student1',
        date: selectedDate,
        punchIn: '09:30:00',
        punchOut: '13:45:00',
        courseId: courseId,
        duration: 255
      },
      {
        id: 'att2',
        studentId: 'student2',
        date: selectedDate,
        punchIn: '09:15:00',
        punchOut: '13:30:00',
        courseId: courseId,
        duration: 255
      },
      {
        id: 'att3',
        studentId: 'student3',
        date: selectedDate,
        punchIn: '09:45:00',
        punchOut: null,
        courseId: courseId,
        duration: null
      }
    ];
    
    setAttendanceRecords(mockAttendance);
  }, [courseId, selectedDate]);
  
  const handlePunchIn = (studentId: string) => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    // Check if student already has a punch-in for today
    const existingRecord = attendanceRecords.find(
      record => record.studentId === studentId && record.date === selectedDate
    );
    
    if (existingRecord) {
      toast({
        title: "Already Checked In",
        description: "This student has already checked in today.",
        variant: "default"
      });
      return;
    }
    
    // Create new attendance record
    const newRecord: Attendance = {
      id: `att_${Date.now()}`,
      studentId,
      date: selectedDate,
      punchIn: time,
      punchOut: null,
      courseId,
      duration: null
    };
    
    setAttendanceRecords([...attendanceRecords, newRecord]);
    
    toast({
      title: "Check-in Recorded",
      description: "Student has been checked in successfully.",
      variant: "default"
    });
  };
  
  const handlePunchOut = (studentId: string) => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    // Find the student's attendance record for today
    const updatedRecords = attendanceRecords.map(record => {
      if (record.studentId === studentId && record.date === selectedDate && !record.punchOut) {
        // Calculate duration in minutes
        const punchIn = new Date(`${selectedDate}T${record.punchIn}`);
        const punchOut = new Date(`${selectedDate}T${time}`);
        const durationMs = punchOut.getTime() - punchIn.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        
        return {
          ...record,
          punchOut: time,
          duration: durationMinutes
        };
      }
      return record;
    });
    
    setAttendanceRecords(updatedRecords);
    
    toast({
      title: "Check-out Recorded",
      description: "Student has been checked out successfully.",
      variant: "default"
    });
  };
  
  // Find which students have punched in/out today
  const getStudentStatus = (studentId: string) => {
    const record = attendanceRecords.find(
      record => record.studentId === studentId && record.date === selectedDate
    );
    
    if (!record) return 'absent';
    if (record.punchIn && !record.punchOut) return 'present';
    if (record.punchIn && record.punchOut) return 'completed';
    
    return 'absent';
  };
  
  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return '-';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Attendance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 p-2 border rounded-md"
              />
            </div>
          </div>
          
          <Tabs defaultValue="today">
            <TabsList className="mb-4">
              <TabsTrigger value="today">Today's Attendance</TabsTrigger>
              <TabsTrigger value="history">Attendance History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Student</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Check-in</th>
                      <th className="py-2 px-4 text-left">Check-out</th>
                      <th className="py-2 px-4 text-left">Duration</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.map(student => {
                      const status = getStudentStatus(student.id);
                      const record = attendanceRecords.find(
                        record => record.studentId === student.id && record.date === selectedDate
                      );
                      
                      return (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{student.name}</td>
                          <td className="py-2 px-4">
                            {status === 'absent' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Absent
                              </span>
                            )}
                            {status === 'present' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Present
                              </span>
                            )}
                            {status === 'completed' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Completed
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4">{record?.punchIn || '-'}</td>
                          <td className="py-2 px-4">{record?.punchOut || '-'}</td>
                          <td className="py-2 px-4">{record ? formatDuration(record.duration) : '-'}</td>
                          <td className="py-2 px-4">
                            {status === 'absent' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePunchIn(student.id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Check-in
                              </Button>
                            )}
                            {status === 'present' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePunchOut(student.id)}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Check-out
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="p-4 text-center text-gray-500">
                Attendance history view will display past attendance records and analytics.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
