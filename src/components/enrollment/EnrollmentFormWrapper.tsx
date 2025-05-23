
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isStudentLoggedIn } from '@/lib/studentAuth';
import EnrollmentFormDialog from './EnrollmentFormDialog';

interface EnrollmentFormWrapperProps {
  formType: 'course' | 'job';
  relatedId: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  redirectPath?: string;
  fullWidth?: boolean;
}

const EnrollmentFormWrapper: React.FC<EnrollmentFormWrapperProps> = ({
  formType,
  relatedId,
  title,
  description,
  buttonText = formType === 'course' ? 'Enroll Now' : 'Apply Now',
  buttonVariant = 'default',
  redirectPath,
  fullWidth = false,
}) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  const handleClick = () => {
    // For job applications with external links, redirect directly
    if (formType === 'job' && redirectPath) {
      window.open(redirectPath, '_blank');
      return;
    }
    
    // Check if student is logged in
    if (!isStudentLoggedIn()) {
      setShowLoginAlert(true);
      return;
    }
    
    // Open enrollment form dialog
    setIsDialogOpen(true);
  };
  
  const handleLoginRedirect = () => {
    navigate('/login');
  };
  
  return (
    <>
      <Button 
        variant={buttonVariant} 
        onClick={handleClick}
        className={fullWidth ? 'w-full' : ''}
      >
        {buttonText}
      </Button>
      
      {/* Login alert */}
      {showLoginAlert && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>You need to login first before applying.</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLoginRedirect}
            >
              Login Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Enrollment Form Dialog */}
      <EnrollmentFormDialog
        formType={formType}
        relatedId={relatedId}
        title={title}
        description={description}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default EnrollmentFormWrapper;
