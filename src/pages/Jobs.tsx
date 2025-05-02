
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar, ExternalLink, Filter } from 'lucide-react';
import { getActiveJobs, incrementJobApplyCount, Job } from "@/lib/jobService";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { isStudentLoggedIn } from '@/lib/studentAuth';

const Jobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isLoggedIn = isStudentLoggedIn();
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const activeJobs = getActiveJobs();
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load job listings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  useEffect(() => {
    // Apply filters and search
    let result = [...jobs];
    
    // Experience filter
    if (experienceFilter !== 'all') {
      result = result.filter(job => job.experienceLevel === experienceFilter);
    }
    
    // Job type filter
    if (jobTypeFilter !== 'all') {
      result = result.filter(job => job.jobType === jobTypeFilter);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredJobs(result);
  }, [jobs, experienceFilter, jobTypeFilter, searchQuery]);

  const handleApplyClick = (job: Job) => {
    // Track application click
    incrementJobApplyCount(job.id);
    
    // Redirect to external application link if available
    if (job.externalLink) {
      window.open(job.externalLink, '_blank');
    } else {
      // Show toast if no external link provided
      toast({
        title: "Application Info",
        description: "Please contact the company directly to apply for this position."
      });
    }
  };

  const resetFilters = () => {
    setExperienceFilter('all');
    setJobTypeFilter('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Job Openings</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exciting career opportunities with our industry partners. Our students get priority access to these positions.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-2/4" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Job Openings</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover exciting career opportunities with our industry partners. Our students get priority access to these positions.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Search</label>
            <Input 
              placeholder="Search by title, company, or location" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Experience</label>
            <Select
              value={experienceFilter}
              onValueChange={setExperienceFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry">Entry Level</SelectItem>
                <SelectItem value="Mid">Mid Level</SelectItem>
                <SelectItem value="Senior">Senior Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Job Type</label>
            <Select
              value={jobTypeFilter}
              onValueChange={setJobTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> Reset Filters
          </Button>
        </div>
      </div>

      {/* Job listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No job listings match your search criteria.</p>
            <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
          </div>
        ) : (
          filteredJobs.map((job) => (
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
                      <span>{job.jobType || 'Full-time'} • {job.experienceLevel || 'Not specified'}</span>
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
                <Button 
                  className="w-full bg-eduBlue-600 hover:bg-eduBlue-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                  {job.externalLink && <ExternalLink className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Login prompt for non-logged in users */}
      {!isLoggedIn && filteredJobs.length > 0 && (
        <div className="mt-10 bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Want priority access to job opportunities?</h3>
          <p className="text-blue-700 mb-4">Login or register as a student to get early access to job openings and personalized recommendations.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = '/login'}>Login</Button>
            <Button variant="outline" onClick={() => window.location.href = '/register'}>Register</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
