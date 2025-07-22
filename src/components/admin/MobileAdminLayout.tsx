import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Layers, 
  Users, 
  GraduationCap, 
  Briefcase,
  User, 
  Video, 
  Database, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

interface MobileAdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onLogout: () => void;
}

const MobileAdminLayout: React.FC<MobileAdminLayoutProps> = ({ 
  children, 
  currentPage = "Dashboard", 
  onLogout 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { icon: Layers, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: GraduationCap, label: 'Courses', path: '/admin/courses' },
    { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
    { icon: User, label: 'Placements', path: '/admin/placements' },
    { icon: Briefcase, label: 'Careers', path: '/admin/careers' },
    { icon: Video, label: 'Live Sessions', path: '/admin/live-meetings' },
    { icon: Database, label: 'Assessments', path: '/admin/assessments' },
    { icon: Calendar, label: 'Schedule', path: '/admin/schedule' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-eduBlue-700">Career Aspire</h2>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.label;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start mobile-menu-item touch-target"
              onClick={() => navigateTo(item.path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 touch-target"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="touch-target">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-semibold">{currentPage}</h1>
          
          <Avatar className="h-8 w-8">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white h-screen shadow-md fixed border-r">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="mobile-container py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MobileAdminLayout;