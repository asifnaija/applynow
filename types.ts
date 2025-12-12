
export enum ApplicationStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  UnderReview = 'Under Review',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum AdmissionChance {
  High = 'High',
  Moderate = 'Moderate',
  Low = 'Low',
  Uncalculated = 'Uncalculated',
}

export interface PredictionResult {
  probability: number; // 0-100
  category: AdmissionChance;
  reasoning: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
}

export interface AcademicInfo {
  gpa: number;
  testScore: number; // SAT/ACT normalized
  testType: 'SAT' | 'ACT' | 'Other';
  highSchool: string;
  graduationYear: number;
  activities: string; // Extracurriculars
  personalStatement: string;
}

export interface GuardianInfo {
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Application {
  id: string;
  userId: string; // Simulating auth
  status: ApplicationStatus;
  submittedAt?: string;
  statusUpdatedAt?: string; // Track when status was last changed
  personal: PersonalInfo;
  academic: AcademicInfo;
  guardian: GuardianInfo;
  aiPrediction?: PredictionResult;
}

export interface User {
  id: string;
  name: string;
  role: 'applicant' | 'admin';
}
