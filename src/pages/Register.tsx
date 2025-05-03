import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerStudent, isStudentLoggedIn } from "@/lib/studentAuth";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const phoneRegex = /^[0-9]{10}$/;

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(1, {
    message: "Last name must be at least 1 character.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(phoneRegex, {
    message: "Please enter a valid 10-digit phone number.",
  }),
  countryCode: z.string().min(1, {
    message: "Country code is required.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

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

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    if (isStudentLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+91", // Default to India
      password: "",
      confirmPassword: "",
    },
  });

  const setCountryCode = (code: string) => {
    form.setValue('countryCode', code);
    setIsCountryDialogOpen(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Register the user with all required fields
      const result = registerStudent(
        values.firstName,
        values.lastName,
        `${values.countryCode} ${values.phone}`,
        values.email,
        values.password,
        values.countryCode.substring(1) // Country without + prefix
      );
      
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

  return (
    <>
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Your Country</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select onValueChange={setCountryCode} defaultValue="+91">
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
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center text-white/80">
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                        <div className="flex gap-2">
                          <div className="w-20">
                            <FormField
                              control={form.control}
                              name="countryCode"
                              render={({ field }) => (
                                <FormControl>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full border-purple-100 focus-visible:ring-eduBlue-500"
                                    onClick={() => setIsCountryDialogOpen(true)}
                                  >
                                    {field.value}
                                  </Button>
                                </FormControl>
                              )}
                            />
                          </div>
                          <FormControl className="flex-1">
                            <Input placeholder="1234567890" {...field} className="border-purple-100 focus-visible:ring-eduBlue-500" />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Your 10-digit mobile number without country code
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
    </>
  );
};

export default Register;
