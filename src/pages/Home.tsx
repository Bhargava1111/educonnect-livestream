
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Code, GraduationCap, Laptop, Users, Video, CreditCard, BookOpen, Award, Sparkles, Brain, Lightbulb } from 'lucide-react';
import TrainingRoadmap from '@/components/TrainingRoadmap';

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
      level: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=300"
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      description: "Learn to analyze and visualize complex data for business insights.",
      duration: "10 weeks",
      level: "Advanced",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=300"
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Create native mobile applications for iOS and Android platforms.",
      duration: "8 weeks",
      level: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=300"
    }
  ];

  // Payment methods information
  const paymentMethods = [
    {
      icon: <CreditCard className="h-10 w-10 text-eduBlue-600" />,
      title: "Secure Payment Options",
      description: "Multiple payment methods including Credit/Debit Cards, Net Banking, and UPI."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-eduBlue-600" />,
      title: "EMI Available",
      description: "Flexible EMI options available for all courses. Learn now, pay later."
    },
    {
      icon: <Award className="h-10 w-10 text-eduBlue-600" />,
      title: "Scholarships",
      description: "Merit-based scholarships for deserving candidates."
    }
  ];

  return (
    <div>
      {/* Hero Section with Radiant Gradient */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-eduBlue-600 to-indigo-700 text-white">
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
                <Button size="lg" className="bg-white text-eduBlue-600 hover:bg-gray-100 shadow-lg">
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

      {/* Learning People Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Learn From The Best Minds in Tech</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our educators are industry professionals with years of experience at top tech companies. Get real-world insights 
                and practical knowledge that goes beyond theoretical concepts.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Live interactive sessions with industry experts",
                  "Small batch sizes for personalized attention",
                  "Real-world projects to build your portfolio",
                  "Mentorship from professional developers"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/courses">
                <Button className="bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all shadow-md">
                  Join Our Learning Community
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=500&h=350" 
                  alt="Students learning" 
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-auto w-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&h=250" 
                  alt="Teacher explaining code" 
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-auto w-full object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=250" 
                  alt="Group study session" 
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-auto w-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=500&h=350" 
                  alt="Student coding" 
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-eduBlue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Career Aspire Technology</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We provide a comprehensive learning experience designed to help you succeed in the tech industry
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg card-hover border border-purple-100">
                <div className="mb-4 bg-gradient-to-br from-eduBlue-100 to-purple-100 w-14 h-14 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training & Placement Roadmap */}
      <TrainingRoadmap />

      {/* Payment Methods Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-eduBlue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Flexible Payment Options</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We offer various payment methods to make quality education accessible to everyone.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center border border-purple-100 card-hover">
                <div className="flex justify-center mb-4 bg-gradient-to-br from-eduBlue-100 to-purple-100 w-20 h-20 rounded-full mx-auto flex items-center justify-center">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all shadow-md">
                Contact Us for Payment Queries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <Link to="/courses" className="text-eduBlue-600 hover:text-eduBlue-700 font-medium">
              View all courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <Card key={course.id} className="card-hover overflow-hidden border border-purple-100 shadow-lg">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
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
                    <Button className="w-full bg-gradient-to-r from-eduBlue-600 to-purple-600 hover:from-eduBlue-700 hover:to-purple-700 transition-all">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-eduBlue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-eduBlue-200 to-purple-200 rounded-full flex items-center justify-center text-eduBlue-700 font-bold">JS</div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Smith</h4>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The full-stack course completely changed my career trajectory. The live sessions and hands-on projects gave me real-world experience that I could showcase to employers."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-eduBlue-200 to-purple-200 rounded-full flex items-center justify-center text-eduBlue-700 font-bold">MJ</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Maria Johnson</h4>
                  <p className="text-sm text-gray-500">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The instructors are knowledgeable and passionate. I appreciated how they incorporated real industry challenges into our lessons and were always available for questions."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-eduBlue-200 to-purple-200 rounded-full flex items-center justify-center text-eduBlue-700 font-bold">RP</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Raj Patel</h4>
                  <p className="text-sm text-gray-500">Mobile Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "From someone with zero coding experience to developing my own apps, Career Aspire provided the structure and support I needed to make a successful career transition."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-eduBlue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Advance Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our expert-led training programs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-eduBlue-600 hover:bg-gray-100 shadow-lg">
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
