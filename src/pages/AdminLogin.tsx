
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

// Import the admin credentials and login function directly from auth.ts
import { ADMIN_EMAIL, ADMIN_PASSWORD, loginAdmin } from "@/lib/auth"; 

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    } else if (user) {
      // If logged in but not admin, redirect to home
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Use the loginAdmin function from auth.ts
      const success = await loginAdmin(email, password);
      
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // If we get here, login was successful
      toast({
        title: "Login Successful",
        description: "Welcome to the admin portal.",
      });
      navigate('/admin');
      
    } catch (error) {
      console.error("Admin login error:", error);
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
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container max-w-md">
        <Card className="border border-purple-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Administrator Login</CardTitle>
            <CardDescription className="text-center text-white/80">
              Enter your credentials to access the admin portal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-200 focus-visible:ring-gray-500" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-200 focus-visible:ring-gray-500" 
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login to Admin Portal"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center bg-gray-50 rounded-b-lg">
            <div className="text-center text-sm">
              <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
                Return to Main Site
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
