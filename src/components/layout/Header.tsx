
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, ChevronDown } from 'lucide-react';
import { isStudentLoggedIn, logoutStudent } from '@/lib/studentAuth';
import { getCurrentStudentSync } from '@/lib/auth/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = isStudentLoggedIn();
  const studentData = isLoggedIn ? getCurrentStudentSync() : null;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutStudent();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-eduBlue-600">
            Career Aspire
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-eduBlue-600 font-medium">
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-eduBlue-600 font-medium focus:outline-none flex items-center">
                Courses <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/courses">All Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/courses/1">Web Development</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/courses/2">Cybersecurity</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/courses/3">MERN Stack</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isLoggedIn && (
              <Link to="/live-meetings" className="text-gray-700 hover:text-eduBlue-600 font-medium">
                Live Sessions
              </Link>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-eduBlue-600 font-medium focus:outline-none flex items-center">
                Career <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/jobs">Jobs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/placements">Placements</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/careers">Careers</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/contact" className="text-gray-700 hover:text-eduBlue-600 font-medium">
              Contact
            </Link>
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {studentData?.user_metadata?.firstName ? studentData.user_metadata.firstName.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/student/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/student/courses">My Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/student/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">Register</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-eduBlue-600 font-medium"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                className="text-gray-700 hover:text-eduBlue-600 font-medium"
                onClick={toggleMobileMenu}
              >
                Courses
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/live-meetings" 
                  className="text-gray-700 hover:text-eduBlue-600 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Live Sessions
                </Link>
              )}
              <Link 
                to="/jobs" 
                className="text-gray-700 hover:text-eduBlue-600 font-medium"
                onClick={toggleMobileMenu}
              >
                Jobs
              </Link>
              <Link 
                to="/placements" 
                className="text-gray-700 hover:text-eduBlue-600 font-medium"
                onClick={toggleMobileMenu}
              >
                Placements
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-eduBlue-600 font-medium"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/student/dashboard" 
                    className="text-gray-700 hover:text-eduBlue-600 font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <button 
                    className="text-left text-gray-700 hover:text-eduBlue-600 font-medium"
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/login" onClick={toggleMobileMenu}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu}>
                    <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
