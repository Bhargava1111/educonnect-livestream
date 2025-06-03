
import { supabase } from '@/integrations/supabase/client';

export interface StudentAnalytics {
  totalStudents: number;
  activeStudents: number;
  newStudentsThisMonth: number;
  studentGrowthRate: number;
  averageCoursesPerStudent: number;
  studentsByMonth: Array<{ month: string; newStudents: number; totalStudents: number }>;
  topPerformingStudents: Array<{ id: string; name: string; coursesCompleted: number; totalProgress: number }>;
  studentActivityData: Array<{ date: string; activeUsers: number; logins: number }>;
}

export interface CourseAnalytics {
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  popularCourses: Array<{ id: string; title: string; enrollments: number; completionRate: number; revenue: number }>;
  coursePerformance: Array<{ courseId: string; title: string; avgProgress: number; enrollments: number }>;
  enrollmentTrends: Array<{ month: string; enrollments: number; completions: number }>;
}

export interface SystemAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeUsers: number;
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
  topMetrics: {
    mostPopularCourse: string;
    highestRevenueMonth: string;
    averageSessionDuration: number;
  };
}

export const getStudentAnalytics = async (): Promise<StudentAnalytics> => {
  try {
    // Get all students
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Get enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*');

    if (enrollmentsError) throw enrollmentsError;

    // Get student activities
    const { data: activities, error: activitiesError } = await supabase
      .from('student_activities')
      .select('*')
      .order('timestamp', { ascending: false });

    if (activitiesError) throw activitiesError;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalStudents = profiles?.length || 0;
    
    // Active students (logged in within last 30 days)
    const recentActivities = activities?.filter(a => new Date(a.timestamp) >= thirtyDaysAgo) || [];
    const activeStudentIds = new Set(recentActivities.map(a => a.student_id));
    const activeStudents = activeStudentIds.size;

    // New students this month
    const newStudentsThisMonth = profiles?.filter(p => {
      const createdDate = new Date(p.created_at);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length || 0;

    // Growth rate calculation
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const studentsLastMonth = profiles?.filter(p => new Date(p.created_at) <= lastMonth).length || 0;
    const studentGrowthRate = studentsLastMonth > 0 ? ((totalStudents - studentsLastMonth) / studentsLastMonth) * 100 : 0;

    // Average courses per student
    const totalEnrollments = enrollments?.length || 0;
    const averageCoursesPerStudent = totalStudents > 0 ? totalEnrollments / totalStudents : 0;

    // Students by month (last 12 months)
    const studentsByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const endDate = new Date(currentYear, currentMonth - i + 1, 0);
      
      const newStudents = profiles?.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= date && createdDate <= endDate;
      }).length || 0;

      const totalStudents = profiles?.filter(p => new Date(p.created_at) <= endDate).length || 0;

      studentsByMonth.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        newStudents,
        totalStudents
      });
    }

    // Top performing students
    const studentProgress = new Map();
    enrollments?.forEach(e => {
      if (!studentProgress.has(e.student_id)) {
        studentProgress.set(e.student_id, { coursesCompleted: 0, totalProgress: 0, courseCount: 0 });
      }
      const progress = studentProgress.get(e.student_id);
      progress.totalProgress += e.progress || 0;
      progress.courseCount += 1;
      if (e.completed) progress.coursesCompleted += 1;
    });

    const topPerformingStudents = Array.from(studentProgress.entries())
      .map(([studentId, data]) => {
        const student = profiles?.find(p => p.id === studentId);
        return {
          id: studentId,
          name: student ? `${student.first_name || ''} ${student.last_name || ''}`.trim() : 'Unknown',
          coursesCompleted: data.coursesCompleted,
          totalProgress: data.courseCount > 0 ? Math.round(data.totalProgress / data.courseCount) : 0
        };
      })
      .sort((a, b) => b.totalProgress - a.totalProgress)
      .slice(0, 10);

    // Student activity data (last 30 days)
    const studentActivityData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayActivities = activities?.filter(a => {
        const activityDate = new Date(a.timestamp);
        return activityDate >= dayStart && activityDate < dayEnd;
      }) || [];

      const activeUsers = new Set(dayActivities.map(a => a.student_id)).size;
      const logins = dayActivities.filter(a => a.activity_type === 'login').length;

      studentActivityData.push({
        date: dayStart.toISOString().split('T')[0],
        activeUsers,
        logins
      });
    }

    return {
      totalStudents,
      activeStudents,
      newStudentsThisMonth,
      studentGrowthRate,
      averageCoursesPerStudent,
      studentsByMonth,
      topPerformingStudents,
      studentActivityData
    };
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    throw error;
  }
};

export const getCourseAnalytics = async (): Promise<CourseAnalytics> => {
  try {
    // Get all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*');

    if (coursesError) throw coursesError;

    // Get enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*');

    if (enrollmentsError) throw enrollmentsError;

    // Get payment transactions
    const { data: payments, error: paymentsError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('status', 'completed');

    if (paymentsError) throw paymentsError;

    const totalCourses = courses?.length || 0;
    const activeCourses = courses?.filter(c => c.status === 'Active').length || 0;
    const totalEnrollments = enrollments?.length || 0;

    // Calculate completion rate
    const completedEnrollments = enrollments?.filter(e => e.completed).length || 0;
    const averageCompletionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

    // Popular courses
    const courseStats = new Map();
    enrollments?.forEach(e => {
      if (!courseStats.has(e.course_id)) {
        courseStats.set(e.course_id, { enrollments: 0, completions: 0, totalProgress: 0 });
      }
      const stats = courseStats.get(e.course_id);
      stats.enrollments += 1;
      stats.totalProgress += e.progress || 0;
      if (e.completed) stats.completions += 1;
    });

    // Add revenue data
    payments?.forEach(p => {
      if (courseStats.has(p.course_id)) {
        const stats = courseStats.get(p.course_id);
        stats.revenue = (stats.revenue || 0) + Number(p.amount);
      }
    });

    const popularCourses = Array.from(courseStats.entries())
      .map(([courseId, stats]) => {
        const course = courses?.find(c => c.id === courseId);
        return {
          id: courseId,
          title: course?.title || 'Unknown Course',
          enrollments: stats.enrollments,
          completionRate: stats.enrollments > 0 ? (stats.completions / stats.enrollments) * 100 : 0,
          revenue: stats.revenue || 0
        };
      })
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 10);

    // Course performance
    const coursePerformance = Array.from(courseStats.entries())
      .map(([courseId, stats]) => {
        const course = courses?.find(c => c.id === courseId);
        return {
          courseId,
          title: course?.title || 'Unknown Course',
          avgProgress: stats.enrollments > 0 ? Math.round(stats.totalProgress / stats.enrollments) : 0,
          enrollments: stats.enrollments
        };
      })
      .sort((a, b) => b.avgProgress - a.avgProgress);

    // Enrollment trends (last 12 months)
    const now = new Date();
    const enrollmentTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthEnrollments = enrollments?.filter(e => {
        const enrollmentDate = new Date(e.created_at);
        return enrollmentDate >= date && enrollmentDate <= endDate;
      }).length || 0;

      const monthCompletions = enrollments?.filter(e => {
        const completionDate = e.completed ? new Date(e.created_at) : null;
        return completionDate && completionDate >= date && completionDate <= endDate;
      }).length || 0;

      enrollmentTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        enrollments: monthEnrollments,
        completions: monthCompletions
      });
    }

    return {
      totalCourses,
      activeCourses,
      totalEnrollments,
      averageCompletionRate,
      popularCourses,
      coursePerformance,
      enrollmentTrends
    };
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    throw error;
  }
};

export const getSystemAnalytics = async (): Promise<SystemAnalytics> => {
  try {
    // Get payment data
    const { data: payments } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('status', 'completed');

    // Get student activities
    const { data: activities } = await supabase
      .from('student_activities')
      .select('*')
      .order('timestamp', { ascending: false });

    const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    // Monthly revenue
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyPayments = payments?.filter(p => {
      const paymentDate = new Date(p.created_at);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    }) || [];
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    // User metrics
    const { data: profiles } = await supabase.from('profiles').select('*');
    const totalUsers = profiles?.length || 0;

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentActivities = activities?.filter(a => new Date(a.timestamp) >= thirtyDaysAgo) || [];
    const activeUsers = new Set(recentActivities.map(a => a.student_id)).size;

    // System health (mock data - would come from monitoring in real system)
    const systemHealth = {
      uptime: 99.9,
      responseTime: 120,
      errorRate: 0.1
    };

    // Top metrics
    const revenueByMonth = new Map();
    payments?.forEach(p => {
      const date = new Date(p.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + Number(p.amount));
    });

    const highestRevenueMonth = Array.from(revenueByMonth.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Get most popular course
    const { data: enrollments } = await supabase.from('enrollments').select('course_id');
    const courseCounts = new Map();
    enrollments?.forEach(e => {
      courseCounts.set(e.course_id, (courseCounts.get(e.course_id) || 0) + 1);
    });
    
    const mostPopularCourseId = Array.from(courseCounts.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    const { data: mostPopularCourse } = mostPopularCourseId ? 
      await supabase.from('courses').select('title').eq('id', mostPopularCourseId).single() : 
      { data: null };

    // Average session duration (mock data)
    const averageSessionDuration = 25; // minutes

    const topMetrics = {
      mostPopularCourse: mostPopularCourse?.title || 'N/A',
      highestRevenueMonth: new Date(highestRevenueMonth || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      averageSessionDuration
    };

    return {
      totalRevenue,
      monthlyRevenue,
      totalUsers,
      activeUsers,
      systemHealth,
      topMetrics
    };
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    throw error;
  }
};
