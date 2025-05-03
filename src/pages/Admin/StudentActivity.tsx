
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentById } from '@/lib/studentAuth';
import StudentActivityComponent from '@/components/admin/StudentActivity';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ArrowLeft, User } from 'lucide-react';

const StudentActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const studentData = getStudentById(id);
      setStudent(studentData);
    }
  }, [id]);

  if (!id) {
    return <div>Student ID is required</div>;
  }

  if (!student) {
    return <div>Loading student data...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/students">Students</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Activity</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            {student.firstName} {student.lastName}'s Activity
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/students')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/admin/students/${id}`)}
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="font-medium">{student.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <p className="font-medium">{student.country}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Joined</p>
              <p className="font-medium">{new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Courses Enrolled</p>
              <p className="font-medium">{student.enrolledCourses?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentActivityComponent studentId={id} />
    </div>
  );
};

export default StudentActivityPage;
