
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { setPaymentLink, getPaymentLink } from '@/lib/paymentService';

interface PaymentLinkManagerProps {
  courseId: string;
  courseName: string;
}

const PaymentLinkManager: React.FC<PaymentLinkManagerProps> = ({ courseId, courseName }) => {
  const { toast } = useToast();
  const [paymentLink, setPaymentLinkState] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load existing payment link
    const existingLink = getPaymentLink(courseId);
    setPaymentLinkState(existingLink);
  }, [courseId]);

  const handleSaveLink = () => {
    if (paymentLink.trim()) {
      const success = setPaymentLink(courseId, paymentLink.trim());
      
      if (success) {
        toast({
          title: "Payment Link Saved",
          description: `Payment link for ${courseName} has been updated.`,
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to save payment link. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid payment link.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Payment Link for {courseName}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-link">Payment Link (Razorpay, PayU, etc.)</Label>
              <Input
                id="payment-link"
                placeholder="https://pay.example.com/course-payment-link"
                value={paymentLink}
                onChange={(e) => setPaymentLinkState(e.target.value)}
              />
              <p className="text-sm text-gray-500">Enter the full payment gateway link for this course</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveLink}>Save Link</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  const existingLink = getPaymentLink(courseId);
                  setPaymentLinkState(existingLink);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentLink ? (
              <>
                <p className="text-sm font-medium">Current Payment Link:</p>
                <div className="p-2 bg-gray-50 rounded border break-all">
                  {paymentLink}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No payment link has been set for this course yet.</p>
            )}
            <Button onClick={() => setIsEditing(true)}>
              {paymentLink ? 'Edit Link' : 'Add Payment Link'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentLinkManager;
