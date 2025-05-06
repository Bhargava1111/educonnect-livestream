
import { useState, useEffect } from 'react';
import { getStudentData, getStudentEnrollments } from '@/lib/auth/studentService';
import { StudentData, Enrollment } from '@/lib/types';
import { awaitAuthResult } from '@/utils/authHelpers';

/**
 * Custom hook to fetch and manage student data
 * This solves the common issue of trying to directly use async values in components
 */
export function useStudentData(studentId?: string) {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const studentData = await getStudentData(studentId);
        setStudent(studentData);
        
        if (studentData?.id) {
          const enrollmentData = await getStudentEnrollments(studentData.id);
          
          // Map the data to match our Enrollment type
          const mappedEnrollments: Enrollment[] = enrollmentData.map(item => ({
            id: item.id,
            studentId: item.student_id || studentData.id, // Use student_id if available, otherwise use studentData.id
            courseId: item.course_id,
            enrollmentDate: item.enrollment_date,
            status: item.status,
            progress: item.progress,
            completed: item.completed || false,
            certificateIssued: item.certificate_issued || false,
            lastAccessedDate: item.last_accessed_date
          }));
          
          setEnrollments(mappedEnrollments);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [studentId]);
  
  return { student, enrollments, loading, error };
}

export default useStudentData;
