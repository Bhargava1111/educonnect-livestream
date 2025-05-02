
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronDown, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getStudentData } from '@/lib/studentAuth';
import { createEnrollmentForm } from '@/lib/enrollmentFormService';
import { EnrollmentForm as EnrollmentFormType, Address, EducationDetail } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form schema with validation
const formSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(['male', 'female', 'other']),
  
  // Identification Details
  aadharNumber: z.string().regex(/^\d{12}$/, { message: "Aadhar number must be 12 digits" }),
  certificateId: z.string().optional(),
  
  // Address Information
  permanentAddress: z.object({
    line1: z.string().min(5, { message: "Address line 1 is required" }),
    line2: z.string().optional(),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    postalCode: z.string().regex(/^\d{6}$/, { message: "Postal code must be 6 digits" }),
    country: z.string().min(2, { message: "Country is required" }),
  }),
  currentAddress: z.object({
    line1: z.string().min(5, { message: "Address line 1 is required" }),
    line2: z.string().optional(),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    postalCode: z.string().regex(/^\d{6}$/, { message: "Postal code must be 6 digits" }),
    country: z.string().min(2, { message: "Country is required" }),
  }),
  isSameAddress: z.boolean(),
  
  // Parent/Guardian Details
  fatherName: z.string().min(2, { message: "Father's name is required" }),
  motherName: z.string().min(2, { message: "Mother's name is required" }),
  guardianPhone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  guardianEmail: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal('')),
  
  // Educational Details
  tenthGrade: z.object({
    institutionName: z.string().min(2, { message: "Institution name is required" }),
    boardUniversity: z.string().min(2, { message: "Board/University is required" }),
    yearOfPassing: z.string().regex(/^\d{4}$/, { message: "Year must be in 4-digit format (e.g., 2020)" }),
    totalMarks: z.string().min(1, { message: "Total marks is required" }),
    obtainedMarks: z.string().min(1, { message: "Obtained marks is required" }),
  }),
  twelfthGrade: z.object({
    institutionName: z.string().min(2, { message: "Institution name is required" }),
    boardUniversity: z.string().min(2, { message: "Board/University is required" }),
    yearOfPassing: z.string().regex(/^\d{4}$/, { message: "Year must be in 4-digit format (e.g., 2020)" }),
    totalMarks: z.string().min(1, { message: "Total marks is required" }),
    obtainedMarks: z.string().min(1, { message: "Obtained marks is required" }),
  }),
  degree: z.object({
    institutionName: z.string(),
    boardUniversity: z.string(),
    yearOfPassing: z.string(),
    totalMarks: z.string(),
    obtainedMarks: z.string(),
  }).optional(),
  postGraduation: z.object({
    institutionName: z.string(),
    boardUniversity: z.string(),
    yearOfPassing: z.string(),
    totalMarks: z.string(),
    obtainedMarks: z.string(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EnrollmentFormProps {
  formType: 'course' | 'job';
  relatedId: string;
  onSuccess?: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ 
  formType, 
  relatedId, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState('+91');
  const studentData = getStudentData();
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});
  const [uploads, setUploads] = useState<{[key: string]: string}>({});
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: studentData?.firstName || '',
      lastName: studentData?.lastName || '',
      email: studentData?.email || '',
      phone: studentData?.phone?.replace(/^\+\d+\s*/, '') || '', // Remove country code
      gender: 'male',
      isSameAddress: false,
      permanentAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
      currentAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
      tenthGrade: {
        institutionName: '',
        boardUniversity: '',
        yearOfPassing: '',
        totalMarks: '',
        obtainedMarks: '',
      },
      twelfthGrade: {
        institutionName: '',
        boardUniversity: '',
        yearOfPassing: '',
        totalMarks: '',
        obtainedMarks: '',
      },
    }
  });
  
  const watchIsSameAddress = form.watch('isSameAddress');
  const watchPermanentAddress = form.watch('permanentAddress');
  
  // Update current address when "same as permanent address" is checked
  useEffect(() => {
    if (watchIsSameAddress) {
      form.setValue('currentAddress', watchPermanentAddress);
    }
  }, [watchIsSameAddress, watchPermanentAddress, form]);
  
  // Handle file upload simulation
  const handleFileUpload = (fieldName: string) => {
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    
    // Simulate file upload delay
    setTimeout(() => {
      const fakeUrl = `https://storage.example.com/documents/${Date.now()}_${fieldName}.pdf`;
      setUploads(prev => ({ ...prev, [fieldName]: fakeUrl }));
      setUploading(prev => ({ ...prev, [fieldName]: false }));
      
      toast({
        title: "File uploaded successfully",
        description: "Your document has been uploaded.",
      });
    }, 1500);
  };
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      if (!studentData?.id) {
        toast({
          title: "Authentication required",
          description: "Please login to submit this form.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      // Convert form data to enrollment form format
      const enrollmentFormData: Omit<EnrollmentFormType, 'id' | 'submittedAt' | 'status'> = {
        studentId: studentData.id,
        formType,
        relatedId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: `${countryCode} ${values.phone}`,
        dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
        gender: values.gender,
        aadharNumber: values.aadharNumber,
        certificateId: values.certificateId,
        permanentAddress: values.permanentAddress,
        currentAddress: values.currentAddress,
        isSameAddress: values.isSameAddress,
        fatherName: values.fatherName,
        motherName: values.motherName,
        guardianPhone: values.guardianPhone,
        guardianEmail: values.guardianEmail || '',
        tenthGrade: {
          ...values.tenthGrade,
          documentUrl: uploads.tenthGradeDoc || '',
        },
        twelfthGrade: {
          ...values.twelfthGrade,
          documentUrl: uploads.twelfthGradeDoc || '',
        },
        degree: values.degree ? {
          ...values.degree,
          documentUrl: uploads.degreeDoc || '',
        } : undefined,
        postGraduation: values.postGraduation ? {
          ...values.postGraduation,
          documentUrl: uploads.postGradDoc || '',
        } : undefined,
        certificateUrl: uploads.certificate || '',
        photographUrl: uploads.photograph || '',
      };
      
      // Create the enrollment form
      const result = createEnrollmentForm(enrollmentFormData);
      
      toast({
        title: "Form submitted successfully",
        description: `Your ${formType === 'course' ? 'enrollment' : 'application'} form has been submitted successfully.`,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Form submission failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Render upload button
  const renderUploadButton = (fieldName: string, label: string) => (
    <div className="mt-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={uploading[fieldName]}
        onClick={() => handleFileUpload(fieldName)}
      >
        {uploading[fieldName] ? (
          <span className="flex items-center">
            Uploading... <ChevronDown className="ml-2 h-4 w-4 animate-bounce" />
          </span>
        ) : uploads[fieldName] ? (
          <span className="flex items-center">
            Uploaded <Check className="ml-2 h-4 w-4 text-green-500" />
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="mr-2 h-4 w-4" /> {label}
          </span>
        )}
      </Button>
      {uploads[fieldName] && (
        <p className="text-xs text-green-600 mt-1">
          File uploaded successfully
        </p>
      )}
    </div>
  );
  
  // Render educational details section
  const renderEducationSection = (
    name: 'tenthGrade' | 'twelfthGrade' | 'degree' | 'postGraduation',
    title: string,
    documentField: string,
    required: boolean = true
  ) => (
    <div className="space-y-4 border rounded-md p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${name}.institutionName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Name {required && '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Institution Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${name}.boardUniversity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board/University {required && '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Board/University" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${name}.yearOfPassing`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Passing {required && '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="YYYY" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${name}.totalMarks`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Marks/CGPA {required && '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Total Marks" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${name}.obtainedMarks`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marks Obtained {required && '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Marks Obtained" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="md:col-span-2">
          <FormLabel>Upload Document {required && '*'}</FormLabel>
          {renderUploadButton(documentField, "Upload Document")}
        </div>
      </div>
    </div>
  );
  
  // Render address fields
  const renderAddressFields = (addressType: 'permanentAddress' | 'currentAddress', title: string) => (
    <div className="space-y-4 border rounded-md p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${addressType}.line1`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1 *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address Line 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${addressType}.line2`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address Line 2 (Optional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${addressType}.city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="City" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${addressType}.state`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="State" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${addressType}.postalCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Postal Code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`${addressType}.country`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
  
  return (
    <Card className="border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {formType === 'course' ? 'Course Enrollment' : 'Job Application'} Form
        </CardTitle>
        <CardDescription>
          Please fill in all required fields marked with an asterisk (*)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="family">Family Details</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First Name" />
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
                          <Input {...field} placeholder="Last Name" />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <div className="flex">
                      <div className="w-20 flex-shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-10"
                        >
                          {countryCode}
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormControl>
                            <Input {...field} className="flex-1 ml-2" placeholder="Phone Number" />
                          </FormControl>
                        )}
                      />
                    </div>
                    <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                  </FormItem>
                  
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
                                  "w-full text-left font-normal",
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
                                date > new Date() || date < new Date("1950-01-01")
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
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
                              <SelectValue placeholder="Select gender" />
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
                </div>
                
                <Separator className="my-4" />
                
                <h2 className="text-lg font-semibold">Identification Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12-digit Aadhar Number" />
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
                          <Input {...field} placeholder="Certificate ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Profile Photo</FormLabel>
                  {renderUploadButton('photograph', 'Upload Passport Size Photograph')}
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Certificate (if any)</FormLabel>
                  {renderUploadButton('certificate', 'Upload Certificate')}
                </div>
              </TabsContent>
              
              {/* Address Tab */}
              <TabsContent value="address" className="space-y-6">
                {renderAddressFields('permanentAddress', 'Permanent Address')}
                
                <div className="flex items-center space-x-2">
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
                          <FormLabel>
                            Current address same as permanent address
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {!watchIsSameAddress && renderAddressFields('currentAddress', 'Current Address')}
              </TabsContent>
              
              {/* Family Details Tab */}
              <TabsContent value="family" className="space-y-6">
                <h2 className="text-lg font-semibold">Parent/Guardian Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Father's Name" />
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
                        <FormLabel>Mother's Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Mother's Name" />
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
                        <FormLabel>Parent/Guardian Phone *</FormLabel>
                        <div className="flex">
                          <div className="w-20 flex-shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-10"
                            >
                              {countryCode}
                            </Button>
                          </div>
                          <FormControl>
                            <Input {...field} className="flex-1 ml-2" placeholder="Guardian Phone" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="guardianEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Guardian Email (Optional)" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                {renderEducationSection('tenthGrade', '10th Grade / Equivalent', 'tenthGradeDoc')}
                {renderEducationSection('twelfthGrade', '12th Grade / Equivalent', 'twelfthGradeDoc')}
                {renderEducationSection('degree', 'Degree (if applicable)', 'degreeDoc', false)}
                {renderEducationSection('postGraduation', 'Post-Graduation (if applicable)', 'postGradDoc', false)}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-eduBlue-600 hover:bg-eduBlue-700">
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-gray-500">
          Your information is kept confidential and will be used only for enrollment purposes.
        </p>
      </CardFooter>
    </Card>
  );
};

export default EnrollmentForm;
