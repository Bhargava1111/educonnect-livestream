
import React from 'react';
import OTPVerification from './OTPVerification';

interface OTPVerifierWrapperProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onResendOTP: () => void;
}

const OTPVerifierWrapper: React.FC<OTPVerifierWrapperProps> = ({
  phoneNumber,
  onVerificationComplete,
  onResendOTP
}) => {
  // Log for debugging
  console.log(`OTPVerifierWrapper: Verifying phone number ${phoneNumber}`);
  
  return (
    <OTPVerification
      phoneNumber={phoneNumber}
      onVerificationComplete={onVerificationComplete}
      onResendOTP={onResendOTP}
    />
  );
};

export default OTPVerifierWrapper;
