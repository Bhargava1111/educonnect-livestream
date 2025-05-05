
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCurrentStudent } from '@/lib/studentAuth';
import { submitEnrollmentForm } from '@/lib/enrollmentFormService';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, User, Phone, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { EnrollmentForm, Address, EducationDetail } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CompleteEnrollmentFormProps {
  formType: 'course' | 'job';
  relatedId: string;
  onSuccess?: () => void;
}

// Define form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  aadharNumber: z.string().min(12, "Valid Aadhar number is required").max(12),
  certificateId: z.string().optional(),
  
  // Permanent Address
  permanentAddress: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  
  // Current Address
  currentAddress: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  isSameAddress: z.boolean().default(false),
  
  // Parent/Guardian Details
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  
  // Educational Details
  tenthGrade: z.object({
    institutionName: z.string().min(1, "Institution name is required"),
    boardUniversity: z.string().min(1, "Board/University is required"),
    yearOfPassing: z.string().min(1, "Year of passing is required"),
    totalMarks: z.string().min(1, "Total marks is required"),
    obtainedMarks: z.string().min(1, "Obtained marks is required"),
    documentUrl: z.string().optional(),
  }),
  
  twelfthGrade: z.object({
    institutionName: z.string().optional(),
    boardUniversity: z.string().optional(),
    yearOfPassing: z.string().optional(),
    totalMarks: z.string().optional(),
    obtainedMarks: z.string().optional(),
    documentUrl: z.string().optional(),
  }).optional(),
  
  degree: z.object({
    institutionName: z.string().optional(),
    boardUniversity: z.string().optional(),
    yearOfPassing: z.string().optional(),
    totalMarks: z.string().optional(),
    obtainedMarks: z.string().optional(),
    documentUrl: z.string().optional(),
  }).optional(),
  
  postGraduation: z.object({
    institutionName: z.string().optional(),
    boardUniversity: z.string().optional(),
    yearOfPassing: z.string().optional(),
    totalMarks: z.string().optional(),
    obtainedMarks: z.string().optional(),
    documentUrl: z.string().optional(),
  }).optional(),
  
  // Document Uploads
  certificateUrl: z.string().optional(),
  photographUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CompleteEnrollmentForm: React.FC<CompleteEnrollmentFormProps> = ({ 
  formType, 
  relatedId, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const student = getCurrentStudent();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with proper default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: student?.firstName || '',
      lastName: student?.lastName || '',
      email: student?.email || '',
      phone: student?.phone || '',
      isSameAddress: false,
      permanentAddress: {
        line1: '', // Required field
        line2: '',
        city: '', // Required field
        state: '', // Required field
        postalCode: '', // Required field
        country: 'India', // Required field with default value
      },
      currentAddress: {
        line1: '', // Required field
        line2: '',
        city: '', // Required field
        state: '', // Required field
        postalCode: '', // Required field
        country: 'India', // Required field with default value
      },
      tenthGrade: {
        institutionName: '', // Required field
        boardUniversity: '', // Required field
        yearOfPassing: '', // Required field
        totalMarks: '', // Required field
        obtainedMarks: '', // Required field
        documentUrl: '',
      },
      twelfthGrade: {
        institutionName: '',
        boardUniversity: '',
        yearOfPassing: '',
        totalMarks: '',
        obtainedMarks: '',
        documentUrl: '',
      },
      degree: {
        institutionName: '',
        boardUniversity: '',
        yearOfPassing: '',
        totalMarks: '',
        obtainedMarks: '',
        documentUrl: '',
      },
      postGraduation: {
        institutionName: '',
        boardUniversity: '',
        yearOfPassing: '',
        totalMarks: '',
        obtainedMarks: '',
        documentUrl: '',
      },
    },
  });
  
  const handleFileUpload = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      // For now, we'll just simulate a successful upload
      toast({
        title: "File upload simulated",
        description: "In a real app, this would upload the file to a server.",
      });
      
      // Here we would set the URL from the server response
      // form.setValue(fieldName as any, 'https://example.com/uploads/file.pdf');
    }
  };
  
  // Watch the isSameAddress field to auto-fill current address
  const isSameAddress = form.watch('isSameAddress');
  const permanentAddress = form.watch('permanentAddress');
  
  React.useEffect(() => {
    if (isSameAddress) {
      form.setValue('currentAddress', permanentAddress);
    }
  }, [isSameAddress, permanentAddress, form]);
  
  const onSubmit = async (data: FormValues) => {
    if (!student) {
      toast({
        title: "Authentication Required",
        description: "Please login to complete this action.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert the form data to the EnrollmentForm format
      const submissionData: Omit<EnrollmentForm, 'id'> = {
        studentId: student.id,
        formType: formType,
        relatedId: relatedId,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd'),
        gender: data.gender,
        aadharNumber: data.aadharNumber,
        certificateId: data.certificateId,
        permanentAddress: data.permanentAddress,
        currentAddress: data.currentAddress,
        isSameAddress: data.isSameAddress,
        fatherName: data.fatherName,
        motherName: data.motherName,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail,
        tenthGrade: data.tenthGrade,
        // For optional education details, ensure we create complete objects if they're provided
        twelfthGrade: data.twelfthGrade ? {
          institutionName: data.twelfthGrade.institutionName || '',
          boardUniversity: data.twelfthGrade.boardUniversity || '',
          yearOfPassing: data.twelfthGrade.yearOfPassing || '',
          totalMarks: data.twelfthGrade.totalMarks || '',
          obtainedMarks: data.twelfthGrade.obtainedMarks || '',
          documentUrl: data.twelfthGrade.documentUrl || '',
        } : undefined,
        degree: data.degree ? {
          institutionName: data.degree.institutionName || '',
          boardUniversity: data.degree.boardUniversity || '',
          yearOfPassing: data.degree.yearOfPassing || '',
          totalMarks: data.degree.totalMarks || '',
          obtainedMarks: data.degree.obtainedMarks || '',
          documentUrl: data.degree.documentUrl || '',
        } : undefined,
        postGraduation: data.postGraduation ? {
          institutionName: data.postGraduation.institutionName || '',
          boardUniversity: data.postGraduation.boardUniversity || '',
          yearOfPassing: data.postGraduation.yearOfPassing || '',
          totalMarks: data.postGraduation.totalMarks || '',
          obtainedMarks: data.postGraduation.obtainedMarks || '',
          documentUrl: data.postGraduation.documentUrl || '',
        } : undefined,
        certificateUrl: data.certificateUrl,
        photographUrl: data.photographUrl,
      };
      
      // Submit the form
      const result = await submitEnrollmentForm(submissionData);
      
      toast({
        title: formType === 'course' ? "Enrollment Submitted" : "Application Submitted",
        description: formType === 'course' 
          ? "Your course enrollment has been submitted successfully." 
          : "Your job application has been submitted successfully."
      });
      
      // Handle success action
      if (onSuccess) {
        onSuccess();
      } else if (formType === 'course') {
        navigate(`/payment/${relatedId}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const totalSteps = 5;
  
  const nextStep = () => {
    const currentFields = getFieldsForStep(step);
    
    // Validate only the fields in the current step
    form.trigger(currentFields as any);
    
    // Check if there are any errors in the current step fields
    const hasErrors = currentFields.some(field => {
      const fieldError = form.formState.errors[field as keyof FormValues];
      return fieldError !== undefined;
    });
    
    if (!hasErrors) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  // Helper to get fields for the current step
  function getFieldsForStep(step: number): string[] {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'aadharNumber', 'certificateId'];
      case 2:
        return ['permanentAddress', 'isSameAddress', 'currentAddress'];
      case 3:
        return ['fatherName', 'motherName', 'guardianPhone', 'guardianEmail'];
      case 4:
        return ['tenthGrade'];
      case 5:
        return ['twelfthGrade', 'degree', 'postGraduation', 'certificateUrl', 'photographUrl'];
      default:
        return [];
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {formType === 'course' ? 'Course Enrollment' : 'Job Application'}
        </h2>
        
        <div className="flex items-center space-x-2">
          {Array.from({length: totalSteps}).map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full ${
                i + 1 === step 
                  ? 'bg-primary' 
                  : i + 1 < step 
                    ? 'bg-primary/60' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
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
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
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
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
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
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                            +91
                          </span>
                          <Input 
                            className="rounded-l-none" 
                            placeholder="10-digit phone number" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your 12-digit Aadhar number" 
                          {...field} 
                          maxLength={12}
                        />
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
                        <Input placeholder="Enter certificate ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Address Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Permanent Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="permanentAddress.line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1 *</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address, P.O. box, company name" {...field} />
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
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} />
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
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
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
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
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
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
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
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-6 pb-2">
                <FormField
                  control={form.control}
                  name="isSameAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Current address is same as permanent address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {!isSameAddress && (
                <>
                  <h3 className="text-lg font-medium pt-4">Current Address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentAddress.line1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1 *</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address, P.O. box, company name" {...field} />
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
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} />
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
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
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
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state" {...field} />
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
                          <FormLabel>Postal Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter postal code" {...field} />
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
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Step 3: Parent/Guardian Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Parent/Guardian Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter father's name" {...field} />
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
                        <Input placeholder="Enter mother's name" {...field} />
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
                      <FormLabel>Parent/Guardian Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                            +91
                          </span>
                          <Input 
                            className="rounded-l-none" 
                            placeholder="10-digit phone number" 
                            {...field} 
                          />
                        </div>
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
                      <FormLabel>Parent/Guardian Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter guardian's email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Step 4: 10th Grade Educational Details */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">10th Grade/Equivalent Details *</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tenthGrade.institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthGrade.boardUniversity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter board name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthGrade.yearOfPassing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing *</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthGrade.totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks/Percentage *</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 100% or 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthGrade.obtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marks Obtained/Percentage *</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 85% or 425" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenthGrade.documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Marksheet</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            onChange={handleFileUpload('tenthGrade.documentUrl')}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1"
                          />
                          <div className="shrink-0">
                            <Button type="button" size="sm" variant="outline">
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload 10th marksheet (PDF, JPG, JPEG, PNG)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Step 5: Additional Educational Details */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">12th Grade/Equivalent Details (if applicable)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="twelfthGrade.institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school/college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthGrade.boardUniversity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter board name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthGrade.yearOfPassing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthGrade.totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks/Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 100% or 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthGrade.obtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marks Obtained/Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 85% or 425" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="twelfthGrade.documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Marksheet</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            onChange={handleFileUpload('twelfthGrade.documentUrl')}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1"
                          />
                          <div className="shrink-0">
                            <Button type="button" size="sm" variant="outline">
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload 12th marksheet (PDF, JPG, JPEG, PNG)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <h3 className="text-lg font-medium pt-6">Degree Details (if applicable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degree.institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter college/university name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree.boardUniversity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter university name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree.yearOfPassing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree.totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks/CGPA</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 100% or 10.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree.obtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marks/CGPA Obtained</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 85% or 8.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree.documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Degree Certificate</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            onChange={handleFileUpload('degree.documentUrl')}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1"
                          />
                          <div className="shrink-0">
                            <Button type="button" size="sm" variant="outline">
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload degree certificate (PDF, JPG, JPEG, PNG)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <h3 className="text-lg font-medium pt-6">Post-Graduation Details (if applicable)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postGraduation.institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter college/university name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postGraduation.boardUniversity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter university name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postGraduation.yearOfPassing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Passing</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postGraduation.totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks/CGPA</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 100% or 10.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postGraduation.obtainedMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marks/CGPA Obtained</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 85% or 8.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postGraduation.documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Degree Certificate</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            onChange={handleFileUpload('postGraduation.documentUrl')}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="flex-1"
                          />
                          <div className="shrink-0">
                            <Button type="button" size="sm" variant="outline">
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload post-graduation certificate (PDF, JPG, JPEG, PNG)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-medium">Additional Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="certificateUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Certificate (if applicable)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              onChange={handleFileUpload('certificateUrl')}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="flex-1"
                            />
                            <div className="shrink-0">
                              <Button type="button" size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload any additional certificate (PDF, JPG, JPEG, PNG)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="photographUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Passport Size Photograph</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              onChange={handleFileUpload('photographUrl')}
                              accept=".jpg,.jpeg,.png"
                              className="flex-1"
                            />
                            <div className="shrink-0">
                              <Button type="button" size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload recent passport size photograph (JPG, JPEG, PNG)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Form Navigation Controls */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : (formType === 'course' ? "Complete Enrollment" : "Submit Application")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompleteEnrollmentForm;
