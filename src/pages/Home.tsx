import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Code, GraduationCap, Laptop, Users, Video } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Video className="h-6 w-6 text-eduBlue-600" />,
      title: "Live Online Sessions",
      description: "Join interactive live sessions with industry experts."
    },
    {
      icon: <Code className="h-6 w-6 text-eduBlue-600" />,
      title: "Hands-On Coding",
      description: "Practice with our integrated online IDE for real coding experience."
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-eduBlue-600" />,
      title: "Certification",
      description: "Earn industry-recognized certifications upon course completion."
    },
    {
      icon: <Users className="h-6 w-6 text-eduBlue-600" />,
      title: "Community Support",
      description: "Connect with peers and mentors in our learning community."
    }
  ];

  const popularCourses = [
    {
      id: 1,
      title: "Full-Stack Web Development",
      description: "Master front-end and back-end technologies for complete web applications.",
      duration: "12 weeks",
      level: "Intermediate"
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      description: "Learn to analyze and visualize complex data for business insights.",
      duration: "10 weeks",
      level: "Advanced"
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Create native mobile applications for iOS and Android platforms.",
      duration: "8 weeks",
      level: "Intermediate"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Transform Your Tech Career with Expert Training
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl">
              Join our live online software training courses and gain in-demand skills from industry professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-eduBlue-600 hover:bg-gray-100">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduConnect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md card-hover">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <Link to="/courses" className="text-eduBlue-600 hover:text-eduBlue-700 font-medium">
              View all courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <Card key={course.id} className="card-hover overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Laptop className="h-16 w-16 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    <div className="flex space-x-4 text-sm">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{course.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-eduBlue-200 rounded-full flex items-center justify-center text-eduBlue-700 font-bold">JS</div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The full-stack course completely changed my career trajectory. The live sessions and hands-on projects gave me real-world experience that I could showcase to employers."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-eduBlue-200 rounded-full flex items-center justify-center text-eduBlue-700 font-bold">MJ</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Maria Johnson</h4>
                  <p className="text-sm text-gray-500">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The instructors are knowledgeable and passionate. I appreciated how they incorporated real industry challenges into our lessons and were always available for questions."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-eduBlue-200 rounded-full flex items-center justify-center text-eduBlue-700 font-bold">RP</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Raj Patel</h4>
                  <p className="text-sm text-gray-500">Mobile Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "From someone with zero coding experience to developing my own apps, EduConnect provided the structure and support I needed to make a successful career transition."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eduBlue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Advance Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our expert-led training programs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-eduBlue-600 hover:bg-gray-100">
                Browse Courses
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
