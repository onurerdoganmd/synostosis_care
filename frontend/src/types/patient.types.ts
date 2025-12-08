/**
 * Patient Type Definitions
 * Matches backend Patient model
 */

export interface Patient {
  id: number;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender?: 'male' | 'female' | 'other';
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  referringPhysician?: string;
  familyHistory?: string;
  syndromic: boolean;
  syndromeType?: string;
  geneticTesting?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  deletedAt?: string;
}

export interface PatientAge {
  years: number;
  months: number;
  days: number;
}

export interface PatientWithAge {
  patient: Patient;
  age: PatientAge;
}

export interface CreatePatientInput {
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  referringPhysician?: string;
  familyHistory?: string;
  syndromic?: boolean;
  syndromeType?: string;
  geneticTesting?: string;
  notes?: string;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}

export interface PatientsListResponse {
  success: boolean;
  data: {
    patients: Patient[];
    total: number;
    limit: number;
    offset: number;
    hasMore?: boolean;
  };
}

export interface PatientResponse {
  success: boolean;
  data: PatientWithAge;
  message?: string;
}

export interface PatientStatistics {
  total: number;
  syndromic: number;
  nonSyndromic: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    unknown: number;
  };
}

export interface PatientStatsResponse {
  success: boolean;
  data: PatientStatistics;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
