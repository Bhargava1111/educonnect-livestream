import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EnrollmentForm as EnrollmentFormType, Address, EducationDetail } from '@/lib/types';
import { getCurrentStudent } from '@/lib/studentAuth';
import { submitEnrollmentForm } from '@/lib/enrollmentFormService';

interface EnrollmentFormProps {
  formType: 'course' | 'job';
  relatedId: string;
}

const EnrollmentForm = ({ formType, relatedId }: EnrollmentFormProps) => {
  const { toast } = useToast();
  const form = useForm();
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current student data if logged in
  const currentStudent = getCurrentStudent();

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // If same address checked, copy permanent address to current address
      if (isSameAddress) {
        data.currentAddress = data.permanentAddress;
      }
      
      // Format the data for submission
      const formData: Omit<EnrollmentFormType, 'id'> = {
        studentId: currentStudent?.id || 'guest',
        formType,
        relatedId,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        
        // Basic Information
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        
        // Identification Details
        aadharNumber: data.aadharNumber,
        certificateId: data.certificateId,
        
        // Address Information
        permanentAddress: {
          line1: data.permanentAddress.line1,
          line2: data.permanentAddress.line2,
          city: data.permanentAddress.city,
          state: data.permanentAddress.state,
          postalCode: data.permanentAddress.postalCode,
          country: data.permanentAddress.country,
        } as Address,
        
        currentAddress: {
          line1: data.currentAddress.line1,
          line2: data.currentAddress.line2,
          city: data.currentAddress.city,
          state: data.currentAddress.state,
          postalCode: data.currentAddress.postalCode,
          country: data.currentAddress.country,
        } as Address,
        
        isSameAddress,
        
        // Parent/Guardian Details
        fatherName: data.fatherName,
        motherName: data.motherName,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail,
        
        // Educational Details
        tenthGrade: {
          institutionName: data.tenthInstitution,
          boardUniversity: data.tenthBoard,
          yearOfPassing: data.tenthYear,
          totalMarks: data.tenthTotalMarks,
          obtainedMarks: data.tenthObtainedMarks,
          documentUrl: data.tenthDocumentUrl || '',
        } as EducationDetail,
        
        twelfthGrade: {
          institutionName: data.twelfthInstitution,
          boardUniversity: data.twelfthBoard,
          yearOfPassing: data.twelfthYear,
          totalMarks: data.twelfthTotalMarks,
          obtainedMarks: data.twelfthObtainedMarks,
          documentUrl: data.twelfthDocumentUrl || '',
        } as EducationDetail,
        
        // Optional education fields
        degree: data.degreeInstitution ? {
          institutionName: data.degreeInstitution,
          boardUniversity: data.degreeUniversity,
          yearOfPassing: data.degreeYear,
          totalMarks: data.degreeTotalMarks,
          obtainedMarks: data.degreeObtainedMarks,
          documentUrl: data.degreeDocumentUrl || '',
        } as EducationDetail : undefined,
        
        postGraduation: data.pgInstitution ? {
          institutionName: data.pgInstitution,
          boardUniversity: data.pgUniversity,
          yearOfPassing: data.pgYear,
          totalMarks: data.pgTotalMarks,
          obtainedMarks: data.pgObtainedMarks,
          documentUrl: data.pgDocumentUrl || '',
        } as EducationDetail : undefined,
        
        // Document Uploads
        certificateUrl: data.certificateUrl,
        photographUrl: data.photographUrl,
      };
      
      // Submit the enrollment form
      const result = await submitEnrollmentForm(formData);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error("Error submitting enrollment form:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {formType === 'course' ? 'Course Enrollment Form' : 'Job Application Form'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
                        {...field} 
                        defaultValue={currentStudent?.firstName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        {...field}
                        defaultValue={currentStudent?.lastName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@example.com" 
                        {...field}
                        defaultValue={currentStudent?.email || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Phone Number" 
                        {...field}
                        defaultValue={currentStudent?.phone || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="gender-male" />
                          <label htmlFor="gender-male">Male</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="gender-female" />
                          <label htmlFor="gender-female">Female</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="gender-other" />
                          <label htmlFor="gender-other">Other</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Identification Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="XXXX-XXXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="certificateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate ID (if applicable)</FormLabel>
                    <FormControl>
                      <Input placeholder="Certificate ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>
            
            {/* Permanent Address */}
            <div className="space-y-4">
              <h4 className="font-medium">Permanent Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="permanentAddress.line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permanentAddress.line2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment, suite, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permanentAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permanentAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permanentAddress.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permanentAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Same Address Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sameAddress" 
                checked={isSameAddress}
                onCheckedChange={(checked) => setIsSameAddress(!!checked)}
              />
              <label htmlFor="sameAddress" className="text-sm font-medium">
                Current Address is the same as Permanent Address
              </label>
            </div>
            
            {/* Current Address (if different) */}
            {!isSameAddress && (
              <div className="space-y-4">
                <h4 className="font-medium">Current Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentAddress.line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentAddress.line2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Parent/Guardian Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Parent/Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Father's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mother's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guardianPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian's Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Guardian's Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guardianEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian's Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Guardian's Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Educational Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Educational Details</h3>
            
            {/* 10th Grade */}
            <div className="space-y-4">
              <h4 className="font-medium">10th Grade</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tenthInstitution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Institution Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthBoard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <FormControl>
                        <Input placeholder="Board" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing</FormLabel>
                      <FormControl>
                        <Input placeholder="Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthTotalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="Total Marks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthObtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obtained Marks</FormLabel>
                      <FormControl>
                        <Input placeholder="Obtained Marks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* 12th Grade */}
            <div className="space-y-4">
              <h4 className="font-medium">12th Grade</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="twelfthInstitution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Institution Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthBoard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <FormControl>
                        <Input placeholder="Board" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing</FormLabel>
                      <FormControl>
                        <Input placeholder="Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthTotalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="Total Marks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthObtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obtained Marks</FormLabel>
                      <FormControl>
                        <Input placeholder="Obtained Marks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Degree (Optional) */}
            <div className="space-y-4">
              <h4 className="font-medium">Degree (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degreeInstitution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Institution Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degreeUniversity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input placeholder="University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degreeYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing</FormLabel>
                      <FormControl>
                        <Input placeholder="Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degreeTotalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="Total Marks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degreeObtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obtained Marks</FormLabel>
                      <FormControl>
                        <Input placeholder="Obtained Marks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="photographUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photograph</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} value={undefined} onChange={(e) => {
                        // In a real app, you would upload this file to a server
                        // and set the URL in the form data
                        field.onChange(e.target.value);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="certificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate (if applicable)</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} value={undefined} onChange={(e) => {
                        // In a real app, you would upload this file to a server
                        // and set the URL in the form data
                        field.onChange(e.target.value);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentForm;
