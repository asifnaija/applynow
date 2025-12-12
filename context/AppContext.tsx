import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Application, User, ApplicationStatus, AdmissionChance } from '../types';

interface AppContextType {
  currentUser: User | null;
  applications: Application[];
  login: (role: 'applicant' | 'admin') => void;
  logout: () => void;
  submitApplication: (app: Omit<Application, 'id' | 'status' | 'submittedAt'>) => string;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  updatePrediction: (id: string, prediction: any) => void;
  refreshApps: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Define mock apps but don't use them by default
const MOCK_APPS: Application[] = [
  {
    id: 'APP-1001',
    userId: 'user-1', // Assigned to the default applicant for demo purposes
    status: ApplicationStatus.Pending,
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    statusUpdatedAt: new Date(Date.now() - 86400000).toISOString(),
    personal: {
      firstName: "Alex",
      lastName: "Student",
      email: "alex.student@example.com",
      phone: "555-0100",
      dob: "2005-04-12",
      address: "123 Maple St, Springfield",
    },
    academic: {
      gpa: 3.8,
      testScore: 1450,
      testType: 'SAT',
      highSchool: "Springfield High",
      graduationYear: 2024,
      activities: "Debate Club President, Varsity Soccer",
      personalStatement: "I have always been driven by a curiosity to understand the world...",
    },
    guardian: {
      fullName: "Jordan Student",
      relationship: "Parent",
      phone: "555-0101",
      email: "jordan.parent@example.com",
    }
  },
  {
    id: 'APP-1002',
    userId: 'user-3', // Assigned to another user (visible in admin only)
    status: ApplicationStatus.Approved,
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    statusUpdatedAt: new Date(Date.now() - 100000).toISOString(),
    personal: {
      firstName: "Marcus",
      lastName: "Chen",
      email: "m.chen@example.com",
      phone: "555-0200",
      dob: "2004-11-20",
      address: "456 Oak Ln, Metropolis",
    },
    academic: {
      gpa: 4.0,
      testScore: 35,
      testType: 'ACT',
      highSchool: "Metropolis Academy",
      graduationYear: 2024,
      activities: "Robotics Team Lead, Math Olympiad",
      personalStatement: "Technology creates bridges between cultures...",
    },
    guardian: {
      fullName: "Sarah Chen",
      relationship: "Mother",
      phone: "555-0202",
      email: "s.chen@example.com",
    },
    aiPrediction: {
        probability: 95,
        category: AdmissionChance.High,
        reasoning: "Excellent academic record and leadership in extracurriculars."
    }
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load from local storage or initialize with empty array (no mock data)
  useEffect(() => {
    // Changed key to v3 to force a clean slate without mock data
    const storedApps = localStorage.getItem('applynow_apps_v3');
    if (storedApps) {
      setApplications(JSON.parse(storedApps));
    } else {
      // Initialize with empty array instead of mock data
      setApplications([]);
      localStorage.setItem('applynow_apps_v3', JSON.stringify([]));
    }
    
    // Auto-login check (simulated session)
    const storedUser = localStorage.getItem('applynow_user');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: 'applicant' | 'admin') => {
    const user: User = {
      id: role === 'admin' ? 'admin-1' : 'user-1',
      name: role === 'admin' ? 'Admissions Officer' : 'Alex Student',
      role,
    };
    setCurrentUser(user);
    localStorage.setItem('applynow_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('applynow_user');
  };

  const saveApps = (apps: Application[]) => {
    setApplications(apps);
    localStorage.setItem('applynow_apps_v3', JSON.stringify(apps));
  };

  const submitApplication = (appData: Omit<Application, 'id' | 'status' | 'submittedAt'>) => {
    const id = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: Application = {
      ...appData,
      id,
      status: ApplicationStatus.Pending,
      submittedAt: new Date().toISOString(),
      statusUpdatedAt: new Date().toISOString(),
    };
    saveApps([...applications, newApp]);
    return id;
  };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status, statusUpdatedAt: new Date().toISOString() } : app
    );
    saveApps(updated);
  };

  const updatePrediction = (id: string, prediction: any) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, aiPrediction: prediction } : app
    );
    saveApps(updated);
  };

  const refreshApps = () => {
     // Re-sync with local storage if needed
     const storedApps = localStorage.getItem('applynow_apps_v3');
     if (storedApps) setApplications(JSON.parse(storedApps));
  }

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      applications, 
      login, 
      logout, 
      submitApplication, 
      updateStatus,
      updatePrediction,
      refreshApps
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};