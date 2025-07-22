import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlayCircle, ArrowRight } from 'lucide-react';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryCta: {
    text: string;
    link: string;
  };
  secondaryCta: {
    text: string;
    link: string;
  };
  backgroundImage: string;
  gradient: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "Transform Your Tech Career",
    subtitle: "With Expert-Led Training",
    description: "Join live online sessions and gain in-demand skills from industry professionals. Build real-world projects and accelerate your career growth.",
    primaryCta: {
      text: "Explore Courses",
      link: "/courses"
    },
    secondaryCta: {
      text: "Watch Demo",
      link: "/demo"
    },
    backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&h=1080",
    gradient: "from-purple-900/80 to-blue-900/80"
  },
  {
    id: 2,
    title: "Master Full-Stack Development",
    subtitle: "From Frontend to Backend",
    description: "Comprehensive training in modern web technologies. Learn React, Node.js, databases, and deployment strategies from industry experts.",
    primaryCta: {
      text: "Start Learning",
      link: "/courses/fullstack"
    },
    secondaryCta: {
      text: "View Curriculum",
      link: "/courses/fullstack/curriculum"
    },
    backgroundImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&h=1080",
    gradient: "from-blue-900/80 to-indigo-900/80"
  },
  {
    id: 3,
    title: "Data Science & Analytics",
    subtitle: "Unlock Business Insights",
    description: "Master Python, machine learning, and data visualization. Transform raw data into actionable business intelligence and advance your analytics career.",
    primaryCta: {
      text: "Join Program",
      link: "/courses/data-science"
    },
    secondaryCta: {
      text: "Free Preview",
      link: "/preview/data-science"
    },
    backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&h=1080",
    gradient: "from-green-900/80 to-teal-900/80"
  },
  {
    id: 4,
    title: "Mobile App Development",
    subtitle: "iOS & Android Mastery",
    description: "Create stunning mobile applications for both platforms. Learn React Native, Flutter, and native development with hands-on projects.",
    primaryCta: {
      text: "Build Apps",
      link: "/courses/mobile"
    },
    secondaryCta: {
      text: "Portfolio Examples",
      link: "/portfolio/mobile"
    },
    backgroundImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&h=1080",
    gradient: "from-orange-900/80 to-red-900/80"
  }
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const nextSlide = () => {
    setIsAutoScrolling(false);
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setTimeout(() => setIsAutoScrolling(true), 10000); // Resume auto-scroll after 10 seconds
  };

  const prevSlide = () => {
    setIsAutoScrolling(false);
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setTimeout(() => setIsAutoScrolling(true), 10000); // Resume auto-scroll after 10 seconds
  };

  const goToSlide = (index: number) => {
    setIsAutoScrolling(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoScrolling(true), 10000); // Resume auto-scroll after 10 seconds
  };

  const currentBanner = bannerSlides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentBanner.backgroundImage}
          alt={currentBanner.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient} transition-all duration-1000`} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl text-white">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              {currentBanner.title}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-blue-100">
              {currentBanner.subtitle}
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl leading-relaxed opacity-90">
              {currentBanner.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to={currentBanner.primaryCta.link}>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-lg px-8 py-4 group"
              >
                {currentBanner.primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={currentBanner.secondaryCta.link}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 group"
              >
                <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {currentBanner.secondaryCta.text}
              </Button>
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex space-x-3">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Auto-scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2 text-white/70 text-sm">
        <div className={`w-2 h-2 rounded-full ${isAutoScrolling ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
        <span>{isAutoScrolling ? 'Auto-scrolling' : 'Manual control'}</span>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / bannerSlides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
};

export default HeroBanner;