
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Eye, ExternalLink } from 'lucide-react';
import { Job } from "@/lib/jobService";
import { format } from 'date-fns';

interface JobTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onView?: (job: Job) => void;
}

export const JobTable: React.FC<JobTableProps> = ({ jobs, onEdit, onDelete, onView }) => {
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Last Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">No jobs found. Add a new job to get started.</TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.experienceLevel || 'N/A'}</TableCell>
                <TableCell>
                  {job.category ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {job.category}
                    </Badge>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{job.salary || 'N/A'}</TableCell>
                <TableCell>{formatDate(job.lastDate)}</TableCell>
                <TableCell>
                  {job.lastDate && new Date(job.lastDate) > new Date() ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onView(job)}
                        title="View Job Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(job)}
                      title="Edit Job"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(job.id)}
                      title="Delete Job"
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    {job.externalLink && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(job.externalLink, '_blank')}
                        title="External Application Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
