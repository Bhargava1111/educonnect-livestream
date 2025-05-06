import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { updateStudentProfile } from '@/lib/studentAuth';
import { useStudentData } from '@/hooks/useStudentData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const StudentProfile = () => {
  const { toast } = useToast();
  const { updateProfile } = useAuth();
  const { student, loading } = useStudentData();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [skills, setSkills] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [highestEducation, setHighestEducation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (student) {
      setFirstName(student.firstName || student.firstName || '');
      setLastName(student.lastName || student.lastName || '');
      setPhone(student.phone || '');
      setAddress(student.address || '');
      setSkills(student.skills?.join(', ') || '');
      setAadharNumber(student.aadharNumber || '');
      setHighestEducation(student.education?.highest || '');
    }
  }, [student]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const skillsArray = skills.split(',').map(s => s.trim());
    
    try {
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
        skills: skillsArray,
        aadhar_number: aadharNumber,
        education: {
          highest: highestEducation
        }
      };
      
      const result = await updateStudentProfile(profileData);
      
      if (result?.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={student?.email || ''}
                placeholder="Enter your email"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input
                type="text"
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter your skills (comma-separated)"
              />
            </div>
            <div>
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                type="text"
                id="aadharNumber"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                placeholder="Enter your Aadhar number"
              />
            </div>
            <div>
              <Label htmlFor="highestEducation">Highest Education</Label>
              <Input
                type="text"
                id="highestEducation"
                value={highestEducation}
                onChange={(e) => setHighestEducation(e.target.value)}
                placeholder="Enter your highest education"
              />
            </div>
            <Button disabled={isUpdating} type="submit">
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
