
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { EditIcon, Save, Upload } from 'lucide-react';
import { getStudentData, updateStudentProfile } from '@/lib/studentAuth';
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: '',
    skills: [] as string[]
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const studentData = getStudentData();
    if (studentData) {
      setStudent(studentData);
      setFormData({
        name: studentData.name || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        address: studentData.address || '',
        profilePicture: studentData.profilePicture || '',
        skills: studentData.skills || []
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSaveProfile = () => {
    const success = updateStudentProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      profilePicture: formData.profilePicture,
      skills: formData.skills
    });

    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      // Update the local state with the new data
      setStudent({
        ...student,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profilePicture: formData.profilePicture,
        skills: formData.skills
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  if (!student) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  // Create a date object from the registration date
  const registrationDate = student.registrationDate 
    ? new Date(student.registrationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2 text-center">
              <div className="mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  {formData.profilePicture ? (
                    <AvatarImage src={formData.profilePicture} alt={formData.name} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {formData.name ? getInitials(formData.name) : 'ST'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <CardTitle>{formData.name || 'Complete Your Profile'}</CardTitle>
              <CardDescription>Student ID: {student.id}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center flex-wrap gap-2 mb-4">
                {formData.skills && formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-default">
                      {skill}
                      {isEditing && (
                        <span 
                          className="ml-1 cursor-pointer" 
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </span>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Add skills to showcase your expertise</p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Enrollment Date:</span>
                  <span>{registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Courses Enrolled:</span>
                  <span>{student.enrolledCourses?.length || 0}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>Cancel Editing</>
                ) : (
                  <><EditIcon className="mr-2 h-4 w-4" /> Edit Profile</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    className="mt-1" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    disabled={!isEditing} 
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    className="mt-1" 
                    value={formData.email} 
                    disabled 
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    className="mt-1" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleInputChange}
                    disabled={!isEditing} 
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Profile Picture URL</label>
                  <Input 
                    className="mt-1" 
                    name="profilePicture"
                    value={formData.profilePicture} 
                    onChange={handleInputChange}
                    disabled={!isEditing} 
                    placeholder="Enter image URL for your profile"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input 
                  className="mt-1" 
                  name="address"
                  value={formData.address} 
                  onChange={handleInputChange}
                  disabled={!isEditing} 
                  placeholder="Enter your full address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a skill" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills && formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-default">
                      {skill}
                      {isEditing && (
                        <span 
                          className="ml-1 cursor-pointer" 
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {isEditing && (
                <Button 
                  className="ml-auto" 
                  onClick={handleSaveProfile}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
