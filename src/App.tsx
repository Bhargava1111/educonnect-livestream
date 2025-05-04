
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/courses" element={<Layout><Courses /></Layout>} />
            <Route path="/courses/:courseId/roadmap" element={<Layout><CourseRoadmap /></Layout>} />
            <Route path="/courses/:courseId" element={<Layout><CourseCurriculum /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/careers" element={<Layout><Careers /></Layout>} />
            <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
            <Route path="/placements" element={<Layout><Placements /></Layout>} />
            <Route path="/live-meetings" element={<Layout><LiveMeetings /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
            <Route path="/admin-login" element={<Layout><AdminLogin /></Layout>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
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
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/course-enrollment/:courseId" element={<Layout><CourseEnrollmentPage /></Layout>} />
            <Route path="/payment/:courseId" element={<Layout><PaymentPage /></Layout>} />
            <Route path="/payment-success" element={<Layout><PaymentSuccessPage /></Layout>} />
            <Route path="/job/:jobId" element={<Layout><JobDetail /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
