
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Jobs from "./pages/Jobs";
import Placements from "./pages/Placements";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminStudents from "./pages/Admin/Students";
import AdminCourses from "./pages/Admin/Courses";
import AdminJobs from "./pages/Admin/Jobs";
import AdminPlacements from "./pages/Admin/Placements";
import AdminCareers from "./pages/Admin/Careers";
import CourseDetails from "./pages/Admin/CourseDetails";
import AdminCourseRoadmap from "./pages/Admin/CourseRoadmap";
import CourseAssessments from "./pages/Admin/CourseAssessments";
import CourseReports from "./pages/Admin/CourseReports";
import AdminLiveMeetings from "./pages/Admin/LiveMeetings";
import AdminContact from "./pages/Admin/Contact";
import AdminAssessments from "./pages/Admin/Assessments";
import AdminSchedule from "./pages/Admin/Schedule";
import AdminReports from "./pages/Admin/Reports";
import AdminSettings from "./pages/Admin/Settings";
import StudentDashboard from "./pages/Student/Dashboard";
import StudentCourses from "./pages/Student/Courses";
import StudentProfile from "./pages/Student/Profile";
import CourseRoadmap from "./pages/CourseRoadmap";
import CourseCurriculum from "./pages/CourseCurriculum";
import LiveMeetings from "./pages/LiveMeetings";
import NotFound from "./pages/NotFound";
import CourseEnrollmentPage from "./pages/CourseEnrollmentPage";
import JobDetail from "./pages/JobDetail";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import StudentActivityPage from "./pages/Admin/StudentActivity";
import { AuthProvider } from "./contexts/AuthContext";

// This is a test comment to verify that code changes are being applied

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:courseId/roadmap" element={<CourseRoadmap />} />
                <Route path="courses/:courseId" element={<CourseCurriculum />} />
                <Route path="contact" element={<Contact />} />
                <Route path="careers" element={<Careers />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="placements" element={<Placements />} />
                <Route path="live-meetings" element={<LiveMeetings />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="admin-login" element={<AdminLogin />} />
                <Route path="course-enrollment/:courseId" element={<CourseEnrollmentPage />} />
                <Route path="payment/:courseId" element={<PaymentPage />} />
                <Route path="payment-success" element={<PaymentSuccessPage />} />
                <Route path="job/:jobId" element={<JobDetail />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/placements" element={<AdminPlacements />} />
              <Route path="/admin/careers" element={<AdminCareers />} />
              <Route path="/admin/courses/:courseId" element={<CourseDetails />} />
              <Route path="/admin/courses/:courseId/roadmap" element={<AdminCourseRoadmap />} />
              <Route path="/admin/courses/:courseId/assessments" element={<CourseAssessments />} />
              <Route path="/admin/courses/:courseId/reports" element={<CourseReports />} />
              <Route path="/admin/live-meetings" element={<AdminLiveMeetings />} />
              <Route path="/admin/contact" element={<AdminContact />} />
              <Route path="/admin/assessments" element={<AdminAssessments />} />
              <Route path="/admin/schedule" element={<AdminSchedule />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/students/:id/activity" element={<StudentActivityPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/*" element={<StudentDashboard />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
