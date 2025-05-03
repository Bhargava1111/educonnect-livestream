import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentStudent, updateStudentProfile } from '@/lib/studentAuth';
import { Student } from '@/lib/types';
import { toast } from "@/components/ui/use-toast"

const Profile = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const student = getCurrentStudent();
    setCurrentStudent(student);

    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        country: student.country || '',
        address: student.address || '',
        skills: student.skills?.join(', ') || '',
        aadharNumber: student.aadharNumber || '',
        tenthSchool: student.education?.tenth?.school || '',
        tenthPercentage: student.education?.tenth?.percentage || '',
        tenthYear: student.education?.tenth?.yearOfCompletion || '',
        twelfthSchool: student.education?.twelfth?.school || '',
        twelfthPercentage: student.education?.twelfth?.percentage || '',
        twelfthYear: student.education?.twelfth?.yearOfCompletion || '',
        degreeUniversity: student.education?.degree?.university || '',
        degreeCourse: student.education?.degree?.course || '',
        degreePercentage: student.education?.degree?.percentage || '',
        degreeYear: student.education?.degree?.yearOfCompletion || '',
        highestQualification: student.education?.highest || ''
      });
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const updateProfile = (formData: any) => {
    if (!currentStudent?.id) return;

    // Create a properly structured education object that matches the expected type
    const educationData = {
      tenth: {
        school: formData.tenthSchool || '',
        percentage: formData.tenthPercentage || '',
        yearOfCompletion: formData.tenthYear || ''
      },
      twelfth: {
        school: formData.twelfthSchool || '', 
        percentage: formData.twelfthPercentage || '',
        yearOfCompletion: formData.twelfthYear || ''
      },
      degree: {
        university: formData.degreeUniversity || '',
        course: formData.degreeCourse || '',
        percentage: formData.degreePercentage || '',
        yearOfCompletion: formData.degreeYear || ''
      },
      highest: formData.highestQualification || ''
    };

    // Call updateStudentProfile with studentId and the profile data
    const result = updateStudentProfile(currentStudent.id, {
      address: formData.address,
      skills: formData.skills?.split(',').map((skill: string) => skill.trim()) || [],
      education: educationData,
      aadharNumber: formData.aadharNumber
    });

    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
      navigate('/student/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update profile.",
      })
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateProfile(formData);
  };

  if (!currentStudent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input type="text" id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input type="text" id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} disabled />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input type="tel" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input type="text" id="country" name="country" value={formData.country || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" value={formData.address || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input type="text" id="skills" name="skills" value={formData.skills || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input type="text" id="aadharNumber" name="aadharNumber" value={formData.aadharNumber || ''} onChange={handleChange} />
            </div>

            <h3 className="text-lg font-semibold">Education Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tenthSchool">10th School</Label>
                <Input type="text" id="tenthSchool" name="tenthSchool" value={formData.tenthSchool || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="tenthPercentage">10th Percentage</Label>
                <Input type="text" id="tenthPercentage" name="tenthPercentage" value={formData.tenthPercentage || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="tenthYear">10th Year of Completion</Label>
                <Input type="text" id="tenthYear" name="tenthYear" value={formData.tenthYear || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twelfthSchool">12th School</Label>
                <Input type="text" id="twelfthSchool" name="twelfthSchool" value={formData.twelfthSchool || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="twelfthPercentage">12th Percentage</Label>
                <Input type="text" id="twelfthPercentage" name="twelfthPercentage" value={formData.twelfthPercentage || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="twelfthYear">12th Year of Completion</Label>
                <Input type="text" id="twelfthYear" name="twelfthYear" value={formData.twelfthYear || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degreeUniversity">Degree University</Label>
                <Input type="text" id="degreeUniversity" name="degreeUniversity" value={formData.degreeUniversity || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="degreeCourse">Degree Course</Label>
                <Input type="text" id="degreeCourse" name="degreeCourse" value={formData.degreeCourse || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="degreePercentage">Degree Percentage</Label>
                <Input type="text" id="degreePercentage" name="degreePercentage" value={formData.degreePercentage || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="degreeYear">Degree Year of Completion</Label>
                <Input type="text" id="degreeYear" name="degreeYear" value={formData.degreeYear || ''} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="highestQualification">Highest Qualification</Label>
              <Input type="text" id="highestQualification" name="highestQualification" value={formData.highestQualification || ''} onChange={handleChange} />
            </div>

            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
