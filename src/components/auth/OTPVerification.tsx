
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onBack
}) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "OTP Verified!",
          description: "Your email has been verified successfully.",
        });
        onVerified();
      } else {
        throw new Error(data.error || 'Invalid OTP');
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email, type: 'email' }
      });

      if (error) throw error;

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyOTP();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyPress={handleKeyPress}
            placeholder="123456"
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        <Button 
          onClick={verifyOTP} 
          disabled={isVerifying || otp.length !== 6}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="flex justify-between items-center text-sm">
          <Button 
            variant="ghost" 
            onClick={onBack}
            disabled={isVerifying}
          >
            ← Back
          </Button>
          <Button 
            variant="ghost" 
            onClick={resendOTP}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend OTP'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
