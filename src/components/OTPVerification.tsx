
import React, { useState, useEffect } from "react";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

interface OTPVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onResendOTP: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  phoneNumber, 
  onVerificationComplete,
  onResendOTP
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(30);

  // Start the timer when component mounts
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, []);

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call for OTP verification
    // In a real app, this would verify with a backend
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP
      setIsVerifying(false);
      setIsVerified(true);
      
      toast({
        title: "Verification Successful",
        description: `Your ${phoneNumber.includes('@') ? 'email' : 'phone number'} has been verified.`,
      });
      
      // Notify parent component that verification is complete
      setTimeout(() => {
        onVerificationComplete();
      }, 1000);
    }, 1500);
  };

  const handleResendOTP = () => {
    // Reset timer and simulate resending OTP
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    onResendOTP();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium">Verification</h3>
        <p className="text-sm text-gray-500">
          {phoneNumber.includes('@')
            ? `Enter the 6-digit code sent to ${phoneNumber}`
            : `Enter the 6-digit code sent to ${phoneNumber}`
          }
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={setOtp}
            disabled={isVerifying || isVerified}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, i) => (
                  <InputOTPSlot key={i} {...slot} index={i} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Button 
            onClick={handleVerifyOTP} 
            disabled={otp.length !== 6 || isVerifying || isVerified}
            className="w-full bg-eduBlue-600 hover:bg-eduBlue-700"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
              </>
            ) : isVerified ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Verified
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={handleResendOTP} 
              disabled={timer > 0 || isVerified}
              size="sm"
              className="text-xs"
            >
              {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
