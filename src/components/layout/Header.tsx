
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-eduBlue-600">EduConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-eduBlue-600 font-medium">Home</Link>
          <Link to="/courses" className="text-gray-700 hover:text-eduBlue-600 font-medium">Courses</Link>
          <Link to="/careers" className="text-gray-700 hover:text-eduBlue-600 font-medium">Careers</Link>
          <Link to="/contact" className="text-gray-700 hover:text-eduBlue-600 font-medium">Contact</Link>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-eduBlue-600 hover:bg-eduBlue-700">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button onClick={toggleMobileMenu} className="md:hidden text-gray-700">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-eduBlue-600 font-medium py-2" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/courses" className="text-gray-700 hover:text-eduBlue-600 font-medium py-2" onClick={toggleMobileMenu}>Courses</Link>
            <Link to="/careers" className="text-gray-700 hover:text-eduBlue-600 font-medium py-2" onClick={toggleMobileMenu}>Careers</Link>
            <Link to="/contact" className="text-gray-700 hover:text-eduBlue-600 font-medium py-2" onClick={toggleMobileMenu}>Contact</Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={toggleMobileMenu}>
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link to="/register" onClick={toggleMobileMenu}>
                <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
