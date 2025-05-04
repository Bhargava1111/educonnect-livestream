
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Trash2 } from 'lucide-react';
import { Placement } from '@/lib/types';

interface PlacementTableProps {
  placements: Placement[];
  onEdit: (placement: Placement) => void;
  onDelete: (id: string) => void;
}

export const PlacementTable: React.FC<PlacementTableProps> = ({ 
  placements, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="hidden md:table-cell">Position</TableHead>
            <TableHead className="hidden md:table-cell">Package</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="hidden lg:table-cell">Course</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No placement records found
              </TableCell>
            </TableRow>
          ) : (
            placements.map((placement) => (
              <TableRow key={placement.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      {placement.imageUrl ? (
                        <AvatarImage src={placement.imageUrl} alt={placement.studentName} />
                      ) : (
                        <AvatarFallback>
                          {placement.studentName?.charAt(0) || 'S'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{placement.studentName}</span>
                  </div>
                </TableCell>
                <TableCell>{placement.company}</TableCell>
                <TableCell className="hidden md:table-cell">{placement.position}</TableCell>
                <TableCell className="hidden md:table-cell">{placement.packageAmount}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {new Date(placement.placementDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{placement.courseCompleted}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(placement)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => onDelete(placement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
