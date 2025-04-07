
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllPlacements, Placement } from '@/lib/courseManagement';

const Placements = () => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  
  useEffect(() => {
    const allPlacements = getAllPlacements();
    setPlacements(allPlacements);
  }, []);
  
  const placementStats = [
    { label: 'Placement Rate', value: '92%' },
    { label: 'Average Package', value: '₹7.5 LPA' },
    { label: 'Highest Package', value: '₹24 LPA' },
    { label: 'Companies', value: '150+' }
  ];

  const companyLogos = [
    'Microsoft', 'Amazon', 'Google', 'IBM', 'TCS', 
    'Infosys', 'Wipro', 'Accenture', 'Deloitte', 'Adobe',
    'Oracle', 'Samsung', 'Capgemini', 'HCL', 'Tech Mahindra'
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Our Placement Success</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We take pride in our students' achievements. Our industry connections and career preparation ensure our students get placed in top companies.
        </p>
      </div>

      {/* Placement Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {placementStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold text-eduBlue-600">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Stories */}
      <h2 className="text-2xl font-bold mb-6 text-center">Student Success Stories</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {placements.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No placement stories available at the moment. Check back later.</p>
          </div>
        ) : (
          placements.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback>{story.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{story.studentName}</h3>
                  <p className="text-sm text-gray-500">{story.position} at {story.company}</p>
                  <p className="text-sm font-medium text-eduBlue-600">{story.salary}</p>
                </div>
                <p className="text-gray-700 text-center italic">"{story.testimonial}"</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recruiting Companies */}
      <h2 className="text-2xl font-bold mb-6 text-center">Our Recruiting Partners</h2>
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
          {companyLogos.map((company, index) => (
            <div key={index} className="flex items-center justify-center h-16 bg-white rounded shadow-sm">
              <span className="font-medium text-gray-600">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Placements;
