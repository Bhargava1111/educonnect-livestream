
import { Check } from 'lucide-react';
import React from 'react';

interface CourseFeatureListProps {
  features: string[];
}

const CourseFeaturesList: React.FC<CourseFeatureListProps> = ({ features }) => {
  // If no features are provided, return null
  if (!features || features.length === 0) {
    return null;
  }
  
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default CourseFeaturesList;
