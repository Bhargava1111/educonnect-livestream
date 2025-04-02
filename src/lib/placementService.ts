
import { Placement, PLACEMENTS_KEY } from './types';

// Initialize placements if not present
const initializePlacementsIfNeeded = (): Placement[] => {
  const existingPlacements = localStorage.getItem(PLACEMENTS_KEY);
  
  if (existingPlacements) {
    return JSON.parse(existingPlacements);
  } else {
    const defaultPlacements: Placement[] = [
      {
        id: 'placement_1',
        studentName: 'Ravi Kumar',
        company: 'Infosys',
        position: 'Test Engineer',
        year: 2023,
        salary: '6 LPA',
        testimonial: 'The QA testing course at Career Aspire Technology helped me secure my dream job at Infosys.',
        courseCompleted: 'Software Testing & QA'
      },
      {
        id: 'placement_2',
        studentName: 'Priya Sharma',
        company: 'TCS',
        position: 'QA Automation Specialist',
        year: 2023,
        salary: '7.5 LPA',
        testimonial: 'The hands-on training and mock interviews prepared me well for the industry demands.',
        courseCompleted: 'Software Testing & QA'
      }
    ];
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(defaultPlacements));
    return defaultPlacements;
  }
};

// Placements CRUD operations
export const getAllPlacements = (): Placement[] => {
  return initializePlacementsIfNeeded();
};

export const getPlacementById = (id: string): Placement | undefined => {
  const placements = getAllPlacements();
  return placements.find(placement => placement.id === id);
};

export const createPlacement = (placement: Omit<Placement, 'id'>): Placement => {
  const placements = getAllPlacements();
  const newPlacement = {
    ...placement,
    id: `placement_${Date.now()}`,
  };
  
  placements.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  return newPlacement;
};

export const updatePlacement = (id: string, updatedPlacement: Partial<Placement>): Placement | undefined => {
  const placements = getAllPlacements();
  const index = placements.findIndex(placement => placement.id === id);
  
  if (index !== -1) {
    placements[index] = { ...placements[index], ...updatedPlacement };
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
