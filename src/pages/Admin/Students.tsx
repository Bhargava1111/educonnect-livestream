
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Activity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { getAllStudents, getStudentsByEnrolledCourse } from '@/lib/auth/studentService';
import { getAllCourses } from '@/lib/courseService';
import { useNavigate } from 'react-router-dom';

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStudents = async () => {
      const allStudents = await getAllStudents();
      setStudents(allStudents);
    };
    
    const loadCourses = () => {
      const allCourses = getAllCourses();
      setCourses(allCourses);
    };
    
    fetchStudents();
    loadCourses();
  }, []);
  
  // Filter students based on search term and selected course
  const filteredStudents = students.filter(student => {
    const studentName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For course filtering, we would need to load enrolled courses for each student
    // This is a simplified version
    const matchesCourse = selectedCourse === 'all'; 
    
    return matchesSearch && matchesCourse;
  });
  
  const handleExportCSV = () => {
    // Convert data to CSV
    const headers = ['ID', 'Name', 'Email', 'Enrolled Courses'];
    const csvData = filteredStudents.map(student => [
      student.id,
      `${student.first_name || ''} ${student.last_name || ''}`.trim(),
      student.email || '',
      '' // Enrollments would need to be fetched separately
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewStudentActivity = (studentId: string) => {
    navigate(`/admin/students/${studentId}/activity`);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage all enrolled students</CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by name, email, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border rounded-md px-3 py-2"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{`${student.first_name || ''} ${student.last_name || ''}`.trim()}</TableCell>
                      <TableCell>{student.email || ''}</TableCell>
                      <TableCell>{student.phone || ''}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewStudentActivity(student.id)}
                          >
                            <Activity className="mr-1 h-4 w-4" />
                            Activity
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No students found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudents;
