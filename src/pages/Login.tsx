
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginStudent, isStudentLoggedIn } from '@/lib/studentAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Country codes for the most common countries
const countryCodes = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "Singapore", code: "+65" },
  { name: "UAE", code: "+971" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Japan", code: "+81" },
];

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  
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
      // Format phone number with country code
      const formattedPhone = `${countryCode} ${phoneNumber}`;
      
      // Direct login with phone number
      const result = loginStudent(formattedPhone, "", true);
      
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
          description: result.error || "Phone number not registered. Please register first.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Phone login error:", error);
      toast({
        title: "Login Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Your Country</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select defaultValue={countryCode} onValueChange={(value) => {
                setCountryCode(value);
                setIsCountryDialogOpen(false);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    
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
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-20 border-purple-100 focus-visible:ring-eduBlue-500"
                            onClick={() => setIsCountryDialogOpen(true)}
                          >
                            {countryCode}
                          </Button>
                          <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="1234567890" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required 
                            className="flex-1 border-purple-100 focus-visible:ring-eduBlue-500"
                          />
                        </div>
                        <p className="text-sm text-gray-500">Enter your 10-digit phone number without country code</p>
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
              </Tabs>
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
    </>
  );
};

export default Login;
