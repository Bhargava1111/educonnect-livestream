import { supabase } from '@/integrations/supabase/client';
import { StudentData, ProfileRow } from '../types';
import { getCurrentStudent } from './utils';

// Get student enrollments
export const getStudentEnrollments = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        student_id,
        course_id,
        enrollment_date,
        status,
        progress,
        completed,
        certificate_issued,
        last_accessed_date,
        courses:course_id (
          id,
          title,
          short_description,
          image_url,
          level,
          duration,
          category
        )
      `)
      .eq('student_id', studentId);
      
    if (error) {
      console.error("Error fetching enrollments:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }
};

// Get student data
export const getStudentData = async (studentId?: string): Promise<StudentData | null> => {
  try {
    const currentUser = await getCurrentStudent();
    const targetId = studentId || currentUser?.id;
    
    if (!targetId) {
      console.log("No student ID provided and no current user");
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetId)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    if (!profile) {
      console.log("No profile found for student:", targetId);
      return null;
    }

    const { data: education, error: educationError } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', targetId);

    if (educationError) {
      console.error("Error fetching education:", educationError);
    }

    // Group education by type
    const educationMap = education?.reduce((acc, edu) => {
      acc[edu.education_type] = {
        school: edu.school_university || '',
        percentage: edu.percentage || '',
        yearOfCompletion: edu.year_of_completion || ''
      };
      return acc;
    }, {} as any) || {};

    const studentData: StudentData = {
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      email: currentUser?.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      profilePicture: profile.profile_picture || '',
      registrationDate: profile.created_at,
      createdAt: profile.created_at,
      enrolledCourses: [],
      skills: profile.skills || [],
      education: {
        tenth: educationMap.tenth || { school: '', percentage: '', yearOfCompletion: '' },
        twelfth: educationMap.twelfth || { school: '', percentage: '', yearOfCompletion: '' },
        degree: educationMap.degree || { school: '', percentage: '', yearOfCompletion: '' }
      },
      aadharNumber: profile.aadhar_number || '',
      isActive: true,
      lastLoginDate: new Date().toISOString()
    };

    return studentData;
  } catch (error) {
    console.error("Error in getStudentData:", error);
    return null;
  }
};

// Get students by enrolled course
export const getStudentsByEnrolledCourse = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        profiles:student_id (
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('course_id', courseId);
      
    if (error) {
      console.error("Error fetching enrolled students:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return [];
  }
};

// Enroll a student in a course
export const enrollStudentInCourse = async (courseId: string, studentId: string) => {
  try {
    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();
      
    if (!checkError && existingEnrollment) {
      return { success: false, error: "Student is already enrolled in this course" };
    }
    
    // Create enrollment
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        student_id: studentId,
        course_id: courseId,
        status: 'active',
        progress: 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error enrolling student:", error);
      return { success: false, error: error.message };
    }
    
    // Track enrollment activity
    await supabase.from('student_activities').insert({
      student_id: studentId,
      activity_type: 'enrollment',
      context: { course_id: courseId }
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("Error enrolling student:", error);
    return { success: false, error: "An unexpected error occurred during enrollment" };
  }
};

// Get student by ID
export const getStudentById = async (id: string): Promise<any> => {
  return getStudentData(id);
};

// Get all students
export const getAllStudents = async (): Promise<any[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        phone,
        created_at
      `);
      
    if (error) {
      console.error("Error fetching students:", error);
      return [];
    }
    
    return profiles || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

// Register a new student
export const registerStudent = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  countryCode: string;
}): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: `${userData.countryCode} ${userData.phone}`,
          country: userData.countryCode.substring(1) // Country without + prefix
        }
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error during registration:", error);
    return { success: false, error: error.message || "An unexpected error occurred during registration" };
  }
};

// Update student profile
export const updateStudentProfile = async (profileData: Partial<ProfileRow>) => {
  try {
    // Get the current user
    const currentUser = await getCurrentStudent();
    if (!currentUser) {
      return { success: false, error: "User not authenticated" };
    }

    const userId = currentUser.id;
    
    // Check if there's an education property and handle it separately
    const { education, ...validProfileData } = profileData as any;
    
    // Update the profile using the valid profile data
    await supabase
      .from('profiles')
      .update(validProfileData)
      .eq('id', userId);
    
    // If education data was provided, update it separately
    if (education) {
      // This would need to be implemented based on how education data is stored
      console.log("Education data update would be handled here", education);
      // Here you might update education records in a separate table
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating student profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
};
