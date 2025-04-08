
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/courseManagement";
import { Edit, Trash, FileText, Settings, BookOpen, FileSpreadsheet } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Coming Soon':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">No courses found. Add a new course to get started.</TableCell>
          </TableRow>
        ) : (
          courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  <span className="text-xs text-gray-500">{course.level || 'Not specified'}</span>
                </div>
              </TableCell>
              <TableCell>{course.students || 0} enrolled</TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(course.status)}>
                  {course.status || 'Not Set'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                    title="Course Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.id}/roadmap`)}
                    title="Edit Roadmap"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.id}/assessments`)}
                    title="Manage Assessments"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.id}/reports`)}
                    title="Course Reports"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(course)}
                    title="Edit Course"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(course.id)}
                    title="Delete Course"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CourseTable;
