
import { Placement } from './types';

// Storage key
const PLACEMENTS_KEY = 'career_aspire_placements';

// Function to get all placements
export const getAllPlacements = (): Placement[] => {
  const placementsJson = localStorage.getItem(PLACEMENTS_KEY);
  if (!placementsJson) return [];
  
  try {
    return JSON.parse(placementsJson);
  } catch (error) {
    console.error("Error parsing placements:", error);
    return [];
  }
};

// Function to add a new placement
export const addPlacement = (placement: Omit<Placement, 'id'>): Placement => {
  const placements = getAllPlacements();
  const newPlacement: Placement = {
    ...placement,
    id: `placement_${Date.now()}`
  };
  
  placements.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  return newPlacement;
};

// Function to update a placement
export const updatePlacement = (id: string, updatedPlacement: Placement): Placement | undefined => {
  const placements = getAllPlacements();
  const index = placements.findIndex(p => p.id === id);
  
  if (index !== -1) {
    placements[index] = updatedPlacement;
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
    return updatedPlacement;
  }
  
  return undefined;
};

// Function to delete a placement
export const deletePlacement = (id: string): boolean => {
  const placements = getAllPlacements();
  const filteredPlacements = placements.filter(p => p.id !== id);
  
  if (filteredPlacements.length < placements.length) {
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(filteredPlacements));
    return true;
  }
  
  return false;
};

// Function to get placements by student ID
export const getPlacementsByStudentId = (studentId: string): Placement[] => {
  const placements = getAllPlacements();
  return placements.filter(p => p.studentId === studentId);
};
