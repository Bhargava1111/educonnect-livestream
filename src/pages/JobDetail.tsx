
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '@/lib/jobService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import EnrollmentFormDialog from '@/components/enrollment/EnrollmentFormDialog';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch job data
  const job = jobId ? getJobById(jobId) : null;
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/jobs');
  };
  
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate if job is active based on last date
  const isJobActive = job?.lastDate ? new Date(job.lastDate) > new Date() : true;
  
  // Render loading state or error if job not found
  if (!job) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">
              {jobId ? "Job not found" : "Loading job..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleApply = () => {
    if (job.externalLink) {
      window.open(job.externalLink, '_blank');
    } else {
      setIsDialogOpen(true);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              {job.jobType && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {job.jobType}
                </Badge>
              )}
              {job.experienceLevel && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {job.experienceLevel} Level
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={
                  isJobActive 
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {isJobActive ? "Active" : "Expired"}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {job.salary && (
              <div className="text-lg font-semibold text-green-600">
                ₹{job.salary}
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last Date: {formatDate(job.lastDate)}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
          
          {/* Requirements */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          
          {/* Apply Now Button */}
          <div className="flex flex-wrap gap-3 pt-4">
            {isJobActive && (
              <Button onClick={handleApply}>
                Apply Now
              </Button>
            )}
            
            {job.externalLink && (
              <Button variant="outline" onClick={() => window.open(job.externalLink, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" /> Visit Job Page
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <EnrollmentFormDialog
        formType="job"
        relatedId={job.id}
        title={`Application for ${job.title}`}
        description="Complete the application form below to apply for this position."
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default JobDetail;
