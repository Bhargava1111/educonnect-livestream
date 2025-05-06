
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCurrentStudent } from '@/lib/auth/utils';
import { enrollStudentInCourse } from '@/lib/auth/studentService';
import { applyForJob } from '@/lib/jobService';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@supabase/supabase-js';

interface EnrollmentFormProps {
  formType: 'course' | 'job';
  relatedId: string;
  onSuccess?: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ formType, relatedId, onSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [student, setStudent] = useState<User | null>(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    experience: '',
    message: '',
    paymentMethod: 'online'
  });

  useEffect(() => {
    const loadStudentData = async () => {
      const userData = await getCurrentStudent();
      setStudent(userData);
      
      // Populate form with user data if available
      if (userData) {
        setFormData(prev => ({
          ...prev,
          name: userData.user_metadata?.name || '',
          email: userData.email || '',
          phone: userData.user_metadata?.phone || '',
          address: userData.user_metadata?.address || ''
        }));
      }
    };
    
    loadStudentData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Simple validation
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!student) {
        toast({
          title: "Authentication Required",
          description: "Please login to complete this action.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      let success = false;
      
      if (formType === 'course') {
        const result = await enrollStudentInCourse(relatedId, student.id);
        success = result.success;
        if (success) {
          toast({
            title: "Enrollment Successful",
            description: "You have been enrolled in the course.",
          });
          
          if (formData.paymentMethod === 'online') {
            navigate(`/payment/${relatedId}`);
          } else {
            if (onSuccess) onSuccess();
          }
        }
      } else if (formType === 'job') {
        const result = await applyForJob(relatedId, student.id);
        success = result.success;
        
        if (success) {
          toast({
            title: "Application Submitted",
            description: "Your job application has been submitted successfully.",
          });
          
          if (result.url) {
            window.open(result.url, '_blank');
          }
          
          if (onSuccess) onSuccess();
        }
      }
      
      if (!success) {
        toast({
          title: "Action Failed",
          description: formType === 'course' 
            ? "Failed to complete enrollment. You may already be enrolled in this course." 
            : "Failed to submit application.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An Error Occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name"
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email"
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Enter your email" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone"
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Enter your phone number" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address"
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Enter your address" 
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {formType === 'course' ? 'Education & Qualification' : 'Experience & Skills'}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Highest Qualification</Label>
                <Input 
                  id="qualification"
                  name="qualification" 
                  value={formData.qualification} 
                  onChange={handleInputChange} 
                  placeholder="Enter your qualification" 
                />
              </div>
              
              {formType === 'job' && (
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input 
                    id="experience"
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleInputChange} 
                    placeholder="Years of relevant experience" 
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea 
                  id="message"
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Any additional information you want to share" 
                  rows={4}
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              {formType === 'course' ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        )}
        
        {step === 3 && formType === 'course' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Select Payment Method</Label>
                <Select 
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="offline">Offline Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-lg border p-4 bg-gray-50">
                {formData.paymentMethod === 'online' ? (
                  <div className="text-sm">
                    <p>You will be redirected to our payment gateway after submission.</p>
                    <p className="font-medium mt-2">Please keep the following documents ready:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Credit/Debit Card</li>
                      <li>UPI ID (if applicable)</li>
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p>You can make payment at our center during office hours.</p>
                    <p className="font-medium mt-2">Accepted payment methods:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Cash</li>
                      <li>Cheque</li>
                      <li>Demand Draft</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit">
                Complete Enrollment
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default EnrollmentForm;
