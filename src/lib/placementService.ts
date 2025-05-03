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
        studentId: 'student_123',
        studentName: 'Rahul Sharma',
        company: 'Infosys',
        position: 'Junior Software Engineer',
        packageAmount: '4.5 LPA',
        placementDate: '2023-05-15',
        description: 'Hired through campus placement.',
        imageUrl: '/assets/images/companies/infosys.png',
        testimonial: 'Career Aspire helped me secure this amazing opportunity.',
        year: '2023',
        salary: '4.5 LPA',
        courseCompleted: 'Full Stack Development'
      },
      {
        id: 'placement_2',
        studentId: 'student_456',
        studentName: 'Priya Singh',
        company: 'TCS',
        position: 'Associate Software Engineer',
        packageAmount: '3.8 LPA',
        placementDate: '2023-06-22',
        description: 'Off-campus recruitment.',
        imageUrl: '/assets/images/companies/tcs.png',
        testimonial: 'The technical skills I learned at Career Aspire were invaluable.',
        year: '2023',
        salary: '3.8 LPA',
        courseCompleted: 'Python Data Science'
      },
      {
        id: 'placement_3',
        studentId: 'student_789',
        studentName: 'Karthik P',
        company: 'Cognizant',
        position: 'Test Engineer',
        packageAmount: '4.2 LPA',
        placementDate: '2023-04-10',
        description: 'Hired through job fair.',
        imageUrl: '/assets/images/companies/cognizant.png',
        testimonial: 'The mock interviews prepared me well for the actual interview process.',
        year: '2023',
        salary: '4.2 LPA',
        courseCompleted: 'Software Testing'
      }
    ];
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(defaultPlacements));
    return defaultPlacements;
  }
};

// Placement CRUD operations
export const getAllPlacements = (): Placement[] => {
  return initializePlacementsIfNeeded();
};

export const getPlacementById = (id: string): Placement | undefined => {
  const placements = getAllPlacements();
  return placements.find(placement => placement.id === id);
};

export const getPlacementsByStudentId = (studentId: string): Placement[] => {
  const placements = getAllPlacements();
  return placements.filter(placement => placement.studentId === studentId);
};

export const getRecentPlacements = (count = 5): Placement[] => {
  const placements = getAllPlacements();
  // Sort by date (most recent first) and take the requested count
  return [...placements]
    .sort((a, b) => new Date(b.placementDate).getTime() - new Date(a.placementDate).getTime())
    .slice(0, count);
};

// Add this function to match the import in Placements.tsx
export const addPlacement = (placementData: Omit<Placement, 'id'>): Placement => {
  return createPlacement(placementData);
};

export const createPlacement = (placementData: Omit<Placement, 'id'>): Placement => {
  const placements = getAllPlacements();
  
  const newPlacement: Placement = {
    ...placementData,
    id: `placement_${Date.now()}`,
    placementDate: placementData.placementDate || new Date().toISOString(),
  };
  
  placements.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  
  return newPlacement;
};

export const updatePlacement = (id: string, updatedData: Partial<Placement>): Placement | undefined => {
  const placements = getAllPlacements();
  const index = placements.findIndex(placement => placement.id === id);
  
  if (index !== -1) {
    placements[index] = { ...placements[index], ...updatedData };
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

// Function to calculate placement statistics
export const getPlacementStatistics = () => {
  const placements = getAllPlacements();
  
  // Total number of placements
  const totalPlacements = placements.length;
  
  // Calculate average package
  let totalPackage = 0;
  placements.forEach(placement => {
    const packageAmount = parseFloat(placement.packageAmount.replace(/[^0-9.]/g, ''));
    if (!isNaN(packageAmount)) {
      totalPackage += packageAmount;
    }
  });
  const averagePackage = totalPlacements > 0 ? totalPackage / totalPlacements : 0;
  
  // Count placements by company
  const companyPlacementCounts: Record<string, number> = {};
  placements.forEach(placement => {
    if (companyPlacementCounts[placement.company]) {
      companyPlacementCounts[placement.company]++;
    } else {
      companyPlacementCounts[placement.company] = 1;
    }
  });
  
  // Count placements by month/year
  const placementsByMonthYear: Record<string, number> = {};
  placements.forEach(placement => {
    const date = new Date(placement.placementDate);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (placementsByMonthYear[monthYear]) {
      placementsByMonthYear[monthYear]++;
    } else {
      placementsByMonthYear[monthYear] = 1;
    }
  });
  
  // Get highest and lowest packages
  const sortedPlacements = [...placements].sort((a, b) => {
    const packageA = parseFloat(a.packageAmount.replace(/[^0-9.]/g, ''));
    const packageB = parseFloat(b.packageAmount.replace(/[^0-9.]/g, ''));
    return packageB - packageA;
  });
  
  const highestPackage = sortedPlacements.length > 0 ? sortedPlacements[0].packageAmount : 'N/A';
  const lowestPackage = sortedPlacements.length > 0 ? sortedPlacements[sortedPlacements.length - 1].packageAmount : 'N/A';
  
  // List of companies
  const companies = [...new Set(placements.map(p => p.company))];
  
  // List of course categories completed by placed students
  const courseCategories = [...new Set(placements.map(p => p.courseCompleted).filter(Boolean))];
  
  return {
    totalPlacements,
    averagePackage: averagePackage.toFixed(2) + ' LPA',
    highestPackage,
    lowestPackage,
    companyPlacementCounts,
    placementsByMonthYear,
    companies,
    courseCategories
  };
};

// Export placements as CSV
export const exportPlacementsAsCSV = (): string => {
  const placements = getAllPlacements();
  
  // CSV header
  let csv = 'ID,Student Name,Company,Position,Package,Placement Date,Year,Salary,Course Completed\n';
  
  // Add rows
  placements.forEach(placement => {
    csv += `${placement.id},${placement.studentName || 'N/A'},${placement.company},${placement.position},${placement.packageAmount},${placement.placementDate},${placement.year || 'N/A'},${placement.salary || 'N/A'},${placement.courseCompleted || 'N/A'}\n`;
  });
  
  return csv;
};
