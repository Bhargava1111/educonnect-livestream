
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { getAllJobs, Job } from "@/lib/jobService";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    const allJobs = getAllJobs();
    setJobs(allJobs);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Job Openings</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover exciting career opportunities with our industry partners. Our students get priority access to these positions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No job listings available at the moment. Please check back later.</p>
          </div>
        ) : (
          jobs.map((job) => (
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
                    {job.requirements && job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="secondary">{req}</Badge>
                    ))}
                    {job.requirements && job.requirements.length > 3 && (
                      <Badge variant="outline">+{job.requirements.length - 3} more</Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{job.jobType} • {job.experienceLevel}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    {job.lastDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Apply by: {new Date(job.lastDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="font-medium text-eduBlue-600">{job.salary}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-eduBlue-600 hover:bg-eduBlue-700 text-white">Apply Now</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;
