
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext'; 
import CompleteEnrollmentForm from './CompleteEnrollmentForm';

interface EnrollmentFormDialogProps {
  formType: 'course' | 'job';
  relatedId: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  redirectPath?: string;
  fullWidth?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnrollmentFormDialog: React.FC<EnrollmentFormDialogProps> = ({
  formType,
  relatedId,
  title,
  description,
  isOpen,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Use the Auth context to check if user is logged in

  const handleLoginRedirect = () => {
    navigate('/login');
    onOpenChange(false);
  };
  
  const isLoggedIn = !!user;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        {!isLoggedIn ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>You need to login first before proceeding.</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLoginRedirect}
              >
                Login Now
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <CompleteEnrollmentForm
            formType={formType}
            relatedId={relatedId}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentFormDialog;
