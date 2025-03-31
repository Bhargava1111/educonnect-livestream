
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Book, Calendar, Route, ArrowRight } from 'lucide-react';

const TrainingRoadmap = () => {
  const roadmapSteps = [
    {
      title: "Skill Development",
      description: "Comprehensive training on industry-relevant technologies with hands-on projects",
      icon: <Book className="h-6 w-6 text-eduBlue-600" />,
      details: [
        "Instructor-led live sessions",
        "Hands-on coding exercises",
        "Real-world projects",
        "Code reviews and mentorship"
      ]
    },
    {
      title: "Career Preparation",
      description: "Focused training on interview skills, resume building, and professional development",
      icon: <Calendar className="h-6 w-6 text-eduBlue-600" />,
      details: [
        "Resume and LinkedIn optimization",
        "Mock technical interviews",
        "Soft skills development",
        "Communication training"
      ]
    },
    {
      title: "Placement Process",
      description: "Direct interviews with our 500+ hiring partners across India and abroad",
      icon: <Route className="h-6 w-6 text-eduBlue-600" />,
      details: [
        "Interview scheduling with partner companies",
        "Placement preparation sessions",
        "Salary negotiation guidance",
        "Ongoing career support"
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Our Training & Placement Roadmap</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At Career Aspire Technology, we ensure a smooth journey from learning to earning with our proven training and placement methodology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roadmapSteps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20">
                <div className="absolute transform rotate-45 bg-eduBlue-100 text-eduBlue-600 font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Step {index + 1}
                </div>
              </div>
              <CardHeader>
                <div className="mb-4">{step.icon}</div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-8 max-w-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-eduBlue-600">95%</div>
              <p className="text-sm text-gray-500">Placement Rate</p>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-eduBlue-600">15+</div>
              <p className="text-sm text-gray-500">Years Experience</p>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-eduBlue-600">500+</div>
              <p className="text-sm text-gray-500">Hiring Partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingRoadmap;
