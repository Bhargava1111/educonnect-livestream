
import { Placement, PLACEMENTS_KEY } from './types';

const initializePlacementsIfNeeded = (): Placement[] => {
  const existingPlacements = localStorage.getItem(PLACEMENTS_KEY);
  
  if (existingPlacements) {
    return JSON.parse(existingPlacements);
  } else {
    const defaultPlacements: Placement[] = [
      {
        id: 'placement_1',
        studentId: 'student_1',
        studentName: 'John Doe',
        company: 'TechCorp',
        position: 'Software Engineer',
        salary: '₹8 LPA',
        course: 'Full Stack Development',
        placementDate: new Date().toISOString(),
        image: '/placeholder.svg',
        description: 'Successfully placed as Software Engineer',
        testimonial: 'Great learning experience!',
        year: '2024',
        packageAmount: '₹8 LPA',
        courseCompleted: 'Full Stack Development',
        imageUrl: '/placeholder.svg'
      },
      {
        id: 'placement_2',
        studentId: 'student_2',
        studentName: 'Jane Smith',
        company: 'DataTech',
        position: 'Data Analyst',
        salary: '₹6 LPA',
        course: 'Data Science',
        placementDate: new Date().toISOString(),
        image: '/placeholder.svg',
        description: 'Successfully placed as Data Analyst',
        testimonial: 'Excellent course content!',
        year: '2024',
        packageAmount: '₹6 LPA',
        courseCompleted: 'Data Science',
        imageUrl: '/placeholder.svg'
      }
    ];
    
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(defaultPlacements));
    return defaultPlacements;
  }
};

export const getAllPlacements = (): Placement[] => {
  return initializePlacementsIfNeeded();
};

export const getPlacementById = (id: string): Placement | undefined => {
  const placements = getAllPlacements();
  return placements.find(placement => placement.id === id);
};

export const createPlacement = (placement: Omit<Placement, 'id'>): Placement => {
  const placements = getAllPlacements();
  const newPlacement: Placement = {
    ...placement,
    id: `placement_${Date.now()}`,
    image: placement.imageUrl || placement.image || '/placeholder.svg',
    course: placement.courseCompleted || placement.course || '',
    salary: placement.packageAmount || placement.salary || '',
  };
  
  placements.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  return newPlacement;
};

export const updatePlacement = (id: string, updatedPlacement: Partial<Placement>): Placement | undefined => {
  const placements = getAllPlacements();
  const index = placements.findIndex(placement => placement.id === id);
  
  if (index !== -1) {
    placements[index] = { 
      ...placements[index], 
      ...updatedPlacement,
      image: updatedPlacement.imageUrl || updatedPlacement.image || placements[index].image,
      course: updatedPlacement.courseCompleted || updatedPlacement.course || placements[index].course,
      salary: updatedPlacement.packageAmount || updatedPlacement.salary || placements[index].salary,
    };
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
    return placements[index];
  }
  
  return undefined;
};

export const deletePlacement = (id: string): boolean => {
  const placements = getAllPlacements();
  const filteredPlacements = placements.filter(placement => placement.id !== id);
  
  if (filteredPlacements.length < placements.length) {
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(filteredPlacements));
    return true;
  }
  
  return false;
};
