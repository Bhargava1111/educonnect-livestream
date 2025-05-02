
import { Placement, PLACEMENTS_KEY, EmailNotification, EMAIL_NOTIFICATIONS_KEY } from './types';

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
        courseCompleted: 'Software Testing & QA',
        imageUrl: '',
        placementDate: new Date('2023-06-15').toISOString()
      },
      {
        id: 'placement_2',
        studentName: 'Priya Sharma',
        company: 'TCS',
        position: 'QA Automation Specialist',
        year: 2023,
        salary: '7.5 LPA',
        testimonial: 'The hands-on training and mock interviews prepared me well for the industry demands.',
        courseCompleted: 'Software Testing & QA',
        imageUrl: '',
        placementDate: new Date('2023-07-22').toISOString()
      },
      {
        id: 'placement_3',
        studentName: 'Suresh Patel',
        company: 'Wipro',
        position: 'Software Test Engineer',
        year: 2023,
        salary: '6.8 LPA',
        testimonial: 'The mentors at Career Aspire were excellent and helped me prepare for industry challenges.',
        courseCompleted: 'Full Stack Development',
        imageUrl: '',
        placementDate: new Date('2023-08-05').toISOString()
      }
    ];
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(defaultPlacements));
    return defaultPlacements;
  }
};

// Notification functions
const createNotification = (notification: Omit<EmailNotification, 'id' | 'sentDate' | 'status'>): EmailNotification => {
  const notifications = getAllEmailNotifications();
  
  const newNotification: EmailNotification = {
    ...notification,
    id: `notification_${Date.now()}`,
    sentDate: new Date().toISOString(),
    status: 'sent'
  };
  
  notifications.push(newNotification);
  localStorage.setItem(EMAIL_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  console.log(`Notification created: ${newNotification.subject} to ${newNotification.to}`);
  
  return newNotification;
};

const getAllEmailNotifications = (): EmailNotification[] => {
  const notifications = localStorage.getItem(EMAIL_NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

// Placements CRUD operations
export const getAllPlacements = (): Placement[] => {
  return initializePlacementsIfNeeded();
};

export const getRecentPlacements = (limit: number = 6): Placement[] => {
  const placements = getAllPlacements();
  return placements
    .sort((a, b) => {
      const dateA = a.placementDate ? new Date(a.placementDate).getTime() : 0;
      const dateB = b.placementDate ? new Date(b.placementDate).getTime() : 0;
      return dateB - dateA;  // Sort in descending order (newest first)
    })
    .slice(0, limit);
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
    placementDate: placement.placementDate || new Date().toISOString(),
  };
  
  placements.push(newPlacement);
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  
  // Create notification for admin
  createNotification({
    to: "admin@careeraspiretechnology.com",
    subject: `New Placement Record Added: ${newPlacement.studentName} at ${newPlacement.company}`,
    body: `A new placement record has been added to the system.
    
Student: ${newPlacement.studentName}
Company: ${newPlacement.company}
Position: ${newPlacement.position}
Salary: ${newPlacement.salary}
Course Completed: ${newPlacement.courseCompleted}`,
    type: 'general'
  });
  
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

// Statistics functions
export const getPlacementStatistics = () => {
  const placements = getAllPlacements();
  
  // Count total placements
  const totalPlacements = placements.length;
  
  // Calculate average salary
  const salaries = placements
    .map(p => {
      // Extract numeric value from salary string (e.g. "6 LPA" => 6)
      const match = p.salary?.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    })
    .filter(salary => salary > 0);
    
  const averageSalary = salaries.length > 0 
    ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
    : 0;
    
  // Find highest salary
  const highestSalary = salaries.length > 0 
    ? Math.max(...salaries)
    : 0;
    
  // Count unique companies
  const uniqueCompanies = new Set(placements.map(p => p.company)).size;
  
  // Count placements by course
  const placementsByCourse = placements.reduce((acc: Record<string, number>, placement) => {
    const course = placement.courseCompleted || 'Unknown';
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalPlacements,
    averageSalary,
    highestSalary,
    uniqueCompanies,
    placementsByCourse,
  };
};

// Export placement data as CSV
export const exportPlacementsAsCSV = (): string => {
  const placements = getAllPlacements();
  
  // CSV header
  let csv = 'ID,Student Name,Company,Position,Year,Salary,Course Completed,Placement Date\n';
  
  // Add rows
  placements.forEach(placement => {
    const placementDate = placement.placementDate 
      ? new Date(placement.placementDate).toLocaleDateString() 
      : 'N/A';
      
    csv += `${placement.id},"${placement.studentName}","${placement.company}","${placement.position}",${placement.year},"${placement.salary || 'N/A'}","${placement.courseCompleted || 'N/A'}","${placementDate}"\n`;
  });
  
  return csv;
};
