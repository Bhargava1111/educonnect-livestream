
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Jobs = () => {
  const jobListings = [
    {
      id: 'job1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Bangalore',
      salary: '₹6-10 LPA',
      skills: ['React', 'TypeScript', 'CSS'],
      experienceRequired: '2-4 years',
      postedDate: '2023-06-12',
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team.'
    },
    {
      id: 'job2',
      title: 'Backend Developer',
      company: 'DataSystems',
      location: 'Hyderabad',
      salary: '₹8-12 LPA',
      skills: ['Node.js', 'Express', 'MongoDB'],
      experienceRequired: '3-5 years',
      postedDate: '2023-06-10',
      description: 'Looking for experienced Backend Developer for our growing tech team.'
    },
    {
      id: 'job3',
      title: 'Full Stack Developer',
      company: 'InnovateX',
      location: 'Remote',
      salary: '₹12-18 LPA',
      skills: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
      experienceRequired: '4-6 years',
      postedDate: '2023-06-08',
      description: 'Join our team as a Full Stack Developer and work on cutting-edge technology products.'
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Job Openings</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover exciting career opportunities with our industry partners. Our students get priority access to these positions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobListings.map((job) => (
          <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="text-sm">{job.company} • {job.location}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 line-clamp-3">{job.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="font-medium">{job.salary}</div>
                  <div className="text-gray-500">{job.experienceRequired}</div>
                </div>
                <button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700 text-white py-2 rounded-md">Apply Now</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
