
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getStudentByEmail, updateStudentPassword } from '@/lib/studentAuth';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your registered email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if the email exists in our system
      const student = getStudentByEmail(email);
      
      if (student) {
        setIsRequestSent(true);
        toast({
          title: "Email Verified",
          description: "You can now reset your password.",
        });
      } else {
        toast({
          title: "Email Not Found",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast({
        title: "Password Required",
        description: "Please enter your new password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the student's password in our system
      const success = updateStudentPassword(email, newPassword);
      
      if (success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset. You can now login with your new password.",
        });
        setIsReset(true);
      } else {
        toast({
          title: "Reset Failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Reset Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container max-w-md">
        <Card className="border border-purple-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-eduBlue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center text-white/80">
              {isReset 
                ? "Your password has been reset successfully!"
                : isRequestSent 
                  ? "Enter your new password"
                  : "Enter your email to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isReset ? (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-center mb-4">
                  You can now log in with your new password.
                </p>
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all">
                    Go to Login
                  </Button>
                </Link>
              </div>
            ) : isRequestSent ? (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      placeholder="Enter new password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required 
                      className="border-purple-100 focus-visible:ring-eduBlue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      className="border-purple-100 focus-visible:ring-eduBlue-500"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRequestReset}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Your registered email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="border-purple-100 focus-visible:ring-eduBlue-500"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center bg-gray-50 rounded-b-lg">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-eduBlue-600 hover:text-eduBlue-700 font-medium">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
