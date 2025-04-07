
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Jobs from "./pages/Jobs";
import Placements from "./pages/Placements";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminStudents from "./pages/Admin/Students";
import AdminCourses from "./pages/Admin/Courses";
import CourseDetails from "./pages/Admin/CourseDetails";
import AdminCourseRoadmap from "./pages/Admin/CourseRoadmap";
import AdminLiveMeetings from "./pages/Admin/LiveMeetings";
import AdminJobs from "./pages/Admin/Jobs";
import AdminPlacements from "./pages/Admin/Placements";
import AdminContact from "./pages/Admin/Contact";
import StudentDashboard from "./pages/Student/Dashboard";
import CourseRoadmap from "./pages/CourseRoadmap";
import CourseCurriculum from "./pages/CourseCurriculum";
import LiveMeetings from "./pages/LiveMeetings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/admin-login" element={<Layout><AdminLogin /></Layout>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:courseId" element={<CourseDetails />} />
          <Route path="/admin/courses/:courseId/roadmap" element={<AdminCourseRoadmap />} />
          <Route path="/admin/live-meetings" element={<AdminLiveMeetings />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/placements" element={<AdminPlacements />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
