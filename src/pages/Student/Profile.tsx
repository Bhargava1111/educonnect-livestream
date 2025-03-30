
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { EditIcon, Save } from 'lucide-react';

const StudentProfile = () => {
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
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>Student ID: ST2023056</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">Java</Badge>
                <Badge variant="secondary">Web Development</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Enrollment Date:</span>
                  <span>May 10, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Courses Enrolled:</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Courses Completed:</span>
                  <span>0</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <EditIcon className="mr-2 h-4 w-4" /> Edit Profile
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
                  <label className="text-sm font-medium">First Name</label>
                  <Input className="mt-1" value="John" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input className="mt-1" value="Doe" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input className="mt-1" value="john.doe@example.com" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input className="mt-1" value="+1 (555) 123-4567" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input className="mt-1" value="1995-08-15" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <Input className="mt-1" value="Male" disabled />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input className="mt-1" value="123 Main Street, Apt 4B" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input className="mt-1" value="New York" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input className="mt-1" value="NY" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input className="mt-1" value="10001" disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input className="mt-1" value="United States" disabled />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Aadhaar Number</label>
                  <Input className="mt-1" value="XXXX-XXXX-1234" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Background */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Educational Background</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Highest Qualification</label>
                    <Input className="mt-1" value="Bachelor of Science in Computer Science" disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Institution</label>
                    <Input className="mt-1" value="University of Technology" disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year of Completion</label>
                    <Input className="mt-1" value="2022" disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">GPA/Percentage</label>
                    <Input className="mt-1" value="3.8/4.0" disabled />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" size="sm">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
