
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerStudent, isStudentLoggedIn, requestOTP } from "@/lib/studentAuth";
import OTPVerifierWrapper from '@/components/OTPVerifierWrapper';

const phoneRegex = /^[0-9]{10}$/;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(phoneRegex, {
    message: "Please enter a valid 10-digit phone number.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isStudentLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Store form values for later registration
      setFormValues(values);
      setPhoneNumber(values.phone);
      
      // Request OTP for phone verification
      const otpResult = requestOTP(values.phone);
      
      if (otpResult.success) {
        setShowOTPVerification(true);
        toast({
          title: "OTP Sent",
          description: `A verification code has been sent to ${values.phone}`,
        });
      } else {
        toast({
          title: "OTP Request Failed",
          description: otpResult.error || "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOTPVerificationComplete = () => {
    // Complete registration after OTP verification
    if (formValues) {
      const result = registerStudent({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        phone: formValues.phone,
      });
      
      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully. You are now logged in.",
        });
        
        // Navigate to home page after successful registration
        navigate('/');
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    }
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
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center text-white/80">
              Enter your details to create your account
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                        </FormControl>
                        <FormDescription>
                          Your 10-digit mobile number for verification
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center bg-gray-50 rounded-b-lg">
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
