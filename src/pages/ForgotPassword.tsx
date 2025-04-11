
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordResetOTP, resetStudentPassword } from '@/lib/studentAuth';
import OTPVerification from "@/components/OTPVerification";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
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
      const result = requestPasswordResetOTP(email);
      
      if (result.success) {
        setIsOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email. Please check and enter the code.",
        });
      } else {
        toast({
          title: "Request Failed",
          description: result.error || "Email not found. Please check your email address.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP request error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = () => {
    // Once OTP is verified, allow user to reset password
    setIsReset(true);
    toast({
      title: "Verification Successful",
      description: "Please enter your new password.",
    });
  };

  const handleResendOTP = () => {
    requestPasswordResetOTP(email);
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your email.",
    });
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
    
    setIsSubmitting(true);
    
    try {
      const result = resetStudentPassword(email, newPassword);
      
      if (result.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset. You can now login with your new password.",
        });
        setIsOtpSent(false);
        setIsReset(true);
      } else {
        toast({
          title: "Reset Failed",
          description: result.error || "An error occurred. Please try again.",
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
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="container max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {isReset 
                ? "Your password has been reset successfully!"
                : isOtpSent 
                  ? "Enter the verification code sent to your email"
                  : "Enter your email to receive a verification code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isReset ? (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-center mb-4">
                  You can now log in with your new password.
                </p>
                <Link to="/login">
                  <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">
                    Go to Login
                  </Button>
                </Link>
              </div>
            ) : isOtpSent ? (
              <div className="space-y-4">
                <OTPVerification 
                  phoneNumber={email} // We're using email instead of phone here
                  onVerificationComplete={handleVerificationComplete}
                  onResendOTP={handleResendOTP}
                />
                {isReset && (
                  <form onSubmit={handleResetPassword}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          placeholder="Your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <Button 
                        className="w-full bg-eduBlue-600 hover:bg-eduBlue-700" 
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Reset Password"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleSendOTP}>
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
                    />
                  </div>
                  <Button 
                    className="w-full bg-eduBlue-600 hover:bg-eduBlue-700" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Send Verification Code"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
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
