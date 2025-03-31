
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";
import OTPVerifierWrapper from "@/components/OTPVerifierWrapper";

const Register = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 2 && !isPhoneVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your phone number before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
      // In a real app, you would handle registration and redirect the user
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSendOTP = () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would call an API to send OTP
    setShowOtpVerification(true);
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${phoneNumber}`,
    });
  };

  const handleVerificationComplete = () => {
    setIsPhoneVerified(true);
    setShowOtpVerification(false);
  };

  const handleResendOTP = () => {
    // In a real app, you would call an API to resend OTP
    toast({
      title: "OTP Resent",
      description: `A new verification code has been sent to ${phoneNumber}`,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register to access our courses and training programs
            </CardDescription>
            <div className="flex items-center justify-center space-x-2 mt-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 w-12 rounded-full ${
                    index + 1 === step ? 'bg-eduBlue-600' : 
                    index + 1 < step ? 'bg-eduBlue-300' : 'bg-gray-200'
                  }`} 
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleNext}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                  </div>
                  <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700" type="submit">
                    Next
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-grow">
                        <Input 
                          id="phone" 
                          placeholder="(123) 456-7890" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isPhoneVerified}
                          required 
                        />
                        {isPhoneVerified && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          </div>
                        )}
                      </div>
                      <Button 
                        type="button"
                        variant={isPhoneVerified ? "outline" : "default"}
                        className={isPhoneVerified ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-50" : "bg-eduBlue-600 hover:bg-eduBlue-700"}
                        onClick={isPhoneVerified ? () => {} : handleSendOTP}
                        disabled={isPhoneVerified || !phoneNumber || phoneNumber.length < 10}
                      >
                        {isPhoneVerified ? "Verified" : "Verify"}
                      </Button>
                    </div>
                  </div>
                  
                  {showOtpVerification && !isPhoneVerified && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                      <OTPVerifierWrapper 
                        phoneNumber={phoneNumber}
                        onVerificationComplete={handleVerificationComplete}
                        onResendOTP={handleResendOTP}
                      />
                    </div>
                  )}
                  
                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Postal/Zip Code</Label>
                      <Input id="zipCode" placeholder="12345" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number (Mandatory)</Label>
                    <Input id="aadhar" placeholder="1234 5678 9012" required />
                    <p className="text-xs text-gray-500">Required for official certification and verification</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" className="w-full" type="button" onClick={handlePrevious}>
                      Back
                    </Button>
                    <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700" type="submit">
                      Next
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleNext}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Educational Background</h3>
                  <div className="space-y-2">
                    <Label htmlFor="highestEducation">Highest Education Level</Label>
                    <select 
                      id="highestEducation" 
                      className="w-full p-2 rounded-md border border-gray-300"
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="high_school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="doctorate">Doctorate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input id="institution" placeholder="University/College Name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Input id="fieldOfStudy" placeholder="e.g., Computer Science" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input id="graduationYear" type="number" placeholder="YYYY" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Programming Experience</Label>
                    <Tabs defaultValue="beginner">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="beginner">Beginner</TabsTrigger>
                        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" className="w-full" type="button" onClick={handlePrevious}>
                      Back
                    </Button>
                    <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700" type="submit">
                      Complete Registration
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-eduBlue-600 hover:text-eduBlue-700 font-medium">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
