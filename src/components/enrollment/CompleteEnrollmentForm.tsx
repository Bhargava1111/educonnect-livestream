
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getStudentData } from '@/lib/studentAuth';
import { submitEnrollmentForm } from '@/lib/enrollmentFormService';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with Zod
const enrollmentFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  aadharNumber: z.string()
    .min(12, { message: "Aadhar number must be 12 digits" })
    .max(12, { message: "Aadhar number must be 12 digits" })
    .optional()
    .or(z.literal('')),
  certificateId: z.string().optional(),
  permanentAddress: z.object({
    line1: z.string().min(1, { message: "Address line 1 is required" }),
    line2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }),
  currentAddress: z.object({
    line1: z.string().min(1, { message: "Address line 1 is required" }),
    line2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }),
  isSameAddress: z.boolean().default(false),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  tenthGrade: z.object({
    institutionName: z.string().min(1, { message: "Institution name is required" }),
    boardUniversity: z.string().min(1, { message: "Board/University is required" }),
    yearOfPassing: z.string().min(1, { message: "Year of passing is required" }),
    totalMarks: z.string().min(1, { message: "Total marks is required" }),
    obtainedMarks: z.string().min(1, { message: "Obtained marks is required" }),
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
});

type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

interface CompleteEnrollmentFormProps {
  formType: 'course' | 'job';
  relatedId: string;
  onSuccess?: () => void;
}

const CompleteEnrollmentForm: React.FC<CompleteEnrollmentFormProps> = ({ 
  formType, 
  relatedId,
  onSuccess 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const student = getStudentData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      firstName: student?.firstName || '',
      lastName: student?.lastName || '',
      email: student?.email || '',
      dateOfBirth: undefined,
      gender: undefined,
      phone: student?.phone || '',
      isSameAddress: false,
      permanentAddress: {
        line1: '',           // Required field
        line2: '',
        city: '',            // Required field
        state: '',           // Required field
        postalCode: '',      // Required field
        country: 'India',    // Required field with default value
      },
      currentAddress: {
        line1: '',           // Required field
        line2: '',
        city: '',            // Required field
        state: '',           // Required field
        postalCode: '',      // Required field
        country: 'India',    // Required field with default value
      },
      tenthGrade: {
        institutionName: '',  // Required field
        boardUniversity: '',  // Required field
        yearOfPassing: '',    // Required field
        totalMarks: '',       // Required field
        obtainedMarks: '',    // Required field
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

  // Watch for address fields to sync if same address is checked
  const isSameAddress = form.watch('isSameAddress');
  const permanentAddress = form.watch('permanentAddress');
  
  React.useEffect(() => {
    if (isSameAddress) {
      form.setValue('currentAddress', permanentAddress);
    }
  }, [isSameAddress, permanentAddress, form]);

  // Handle form submission
  async function onSubmit(data: EnrollmentFormValues) {
    if (!student?.id) {
      toast({
        title: "Error",
        description: "Student ID is missing. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        studentId: student.id,
        formType,
        relatedId,
        submittedAt: new Date().toISOString(),
        status: 'pending' as const, // Explicitly type this as a literal type
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd'),
        gender: data.gender,
        aadharNumber: data.aadharNumber || '',
        certificateId: data.certificateId || '',
        permanentAddress: {
          line1: data.permanentAddress.line1 || '',
          line2: data.permanentAddress.line2 || '',
          city: data.permanentAddress.city || '',
          state: data.permanentAddress.state || '',
          postalCode: data.permanentAddress.postalCode || '',
          country: data.permanentAddress.country || 'India',
        },
        currentAddress: {
          line1: data.currentAddress.line1 || '',
          line2: data.currentAddress.line2 || '',
          city: data.currentAddress.city || '',
          state: data.currentAddress.state || '',
          postalCode: data.currentAddress.postalCode || '',
          country: data.currentAddress.country || 'India',
        },
        isSameAddress: data.isSameAddress,
        fatherName: data.fatherName || '',
        motherName: data.motherName || '',
        guardianPhone: data.guardianPhone || '',
        guardianEmail: data.guardianEmail || '',
        tenthGrade: {
          institutionName: data.tenthGrade.institutionName || '',
          boardUniversity: data.tenthGrade.boardUniversity || '',
          yearOfPassing: data.tenthGrade.yearOfPassing || '',
          totalMarks: data.tenthGrade.totalMarks || '',
          obtainedMarks: data.tenthGrade.obtainedMarks || '',
          documentUrl: data.tenthGrade.documentUrl || '',
        },
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
      };

      // Submit enrollment form
      const result = await submitEnrollmentForm(formData);
      
      toast({
        title: "Success!",
        description: "Your enrollment form has been submitted.",
      });

      // If course enrollment, redirect to payment page
      if (formType === 'course') {
        navigate(`/payment/${relatedId}`);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your form.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Rest of the form rendering logic
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <p className="text-sm text-muted-foreground">
              Please provide your personal details for enrollment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
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
                    <Input placeholder="Doe" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      {...field}
                      disabled={!!student?.email} 
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
                      type="tel" 
                      placeholder="9876543210" 
                      {...field} 
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
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
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
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
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
            
            <FormField
              control={form.control}
              name="aadharNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formType === 'course' && (
              <FormField
                control={form.control}
                name="certificateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate ID (If any)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter certificate ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        
        {/* Permanent Address */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <p className="text-sm text-muted-foreground">
              Please provide your address details.
            </p>
          </div>
          
          <h4 className="text-md font-medium">Permanent Address</h4>
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
                    <Input placeholder="Postal code" {...field} />
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
          
          <FormField
            control={form.control}
            name="isSameAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    My current address is the same as permanent address
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          {/* Current Address */}
          {!isSameAddress && (
            <>
              <h4 className="text-md font-medium">Current Address</h4>
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
                        <Input placeholder="Postal code" {...field} />
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
            </>
          )}
        </div>
        
        {/* Guardian Information */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium">Guardian Information (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Please provide your guardian details.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Father's name" {...field} />
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
                    <Input placeholder="Mother's name" {...field} />
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
                    <Input placeholder="Guardian's phone number" {...field} />
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
                    <Input placeholder="Guardian's email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Educational Information */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium">Educational Information</h3>
            <p className="text-sm text-muted-foreground">
              Please provide your educational details.
            </p>
          </div>
          
          <h4 className="text-md font-medium">10th Grade</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tenthGrade.institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="School name" {...field} />
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
              name="tenthGrade.yearOfPassing"
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
              name="tenthGrade.totalMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Marks</FormLabel>
                  <FormControl>
                    <Input placeholder="Total marks" {...field} />
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
                  <FormLabel>Obtained Marks/Percentage</FormLabel>
                  <FormControl>
                    <Input placeholder="Obtained marks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <h4 className="text-md font-medium">12th Grade (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="twelfthGrade.institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School/College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="School/College name" {...field} />
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
                    <Input placeholder="Board" {...field} />
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
                    <Input placeholder="Year" {...field} />
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
                  <FormLabel>Total Marks</FormLabel>
                  <FormControl>
                    <Input placeholder="Total marks" {...field} />
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
                  <FormLabel>Obtained Marks/Percentage</FormLabel>
                  <FormControl>
                    <Input placeholder="Obtained marks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <h4 className="text-md font-medium">Degree/Graduation (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="degree.institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College/University Name</FormLabel>
                  <FormControl>
                    <Input placeholder="College/University name" {...field} />
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
                    <Input placeholder="University" {...field} />
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
                    <Input placeholder="Year" {...field} />
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
                    <Input placeholder="Total marks" {...field} />
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
                  <FormLabel>Obtained Marks/CGPA</FormLabel>
                  <FormControl>
                    <Input placeholder="Obtained marks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <h4 className="text-md font-medium">Post Graduation (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postGraduation.institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College/University Name</FormLabel>
                  <FormControl>
                    <Input placeholder="College/University name" {...field} />
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
                    <Input placeholder="University" {...field} />
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
                    <Input placeholder="Year" {...field} />
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
                    <Input placeholder="Total marks" {...field} />
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
                  <FormLabel>Obtained Marks/CGPA</FormLabel>
                  <FormControl>
                    <Input placeholder="Obtained marks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Enrollment Form"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CompleteEnrollmentForm;
