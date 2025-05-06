
import { useState, useEffect } from 'react';
import { getStudentData, getStudentEnrollments } from '@/lib/auth/studentService';
import { StudentData, Enrollment } from '@/lib/types';

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
          setEnrollments(enrollmentData);
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
