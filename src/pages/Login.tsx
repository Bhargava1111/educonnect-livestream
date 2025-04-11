
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginStudent, isStudentLoggedIn, requestOTP } from '@/lib/studentAuth';
import OTPVerifierWrapper from '@/components/OTPVerifierWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isStudentLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Input Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the login function and get the result
      const result = loginStudent(email, password);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back! You have been logged in successfully.",
        });
        
        // Small delay to allow toast to be seen before redirect
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast({
        title: "Input Error",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Request OTP for phone verification
      const otpResult = requestOTP(phoneNumber);
      
      if (otpResult.success) {
        setShowOTPVerification(true);
        toast({
          title: "OTP Sent",
          description: `A verification code has been sent to ${phoneNumber}`,
        });
      } else {
        toast({
          title: "OTP Request Failed",
          description: otpResult.error || "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP request error:", error);
      toast({
        title: "OTP Request Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerificationComplete = () => {
    toast({
      title: "Login Successful",
      description: "You have been logged in successfully.",
    });
    
    // Small delay to allow toast to be seen before redirect
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleResendOTP = () => {
    if (phoneNumber) {
      requestOTP(phoneNumber);
      toast({
        title: "OTP Resent",
        description: `A new verification code has been sent to ${phoneNumber}`,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container max-w-md">
        <Card className="border border-purple-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-eduBlue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center text-white/80">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {showOTPVerification ? (
              <OTPVerifierWrapper
                phoneNumber={phoneNumber}
                onVerificationComplete={handleOTPVerificationComplete}
                onResendOTP={handleResendOTP}
              />
            ) : (
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                          className="border-purple-100 focus-visible:ring-eduBlue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link to="/forgot-password" className="text-sm text-eduBlue-600 hover:text-eduBlue-700">
                            Forgot your password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                          className="border-purple-100 focus-visible:ring-eduBlue-500"
                        />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all" 
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone">
                  <form onSubmit={handlePhoneLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="1234567890" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required 
                          className="border-purple-100 focus-visible:ring-eduBlue-500"
                        />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all" 
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-gray-50 rounded-b-lg">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-eduBlue-600 hover:text-eduBlue-700 font-medium">
                Register
              </Link>
            </div>
            <div className="text-center text-sm border-t pt-4 mt-2 w-full">
              <Link to="/admin-login" className="text-eduBlue-600 hover:text-eduBlue-700 font-medium">
                Administrator Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
