/**
 * Patient Data Storage
 * JSON-based storage for patient data (Phase 2)
 * Will be migrated to Prisma in future
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');

// Patient type definition (matching Prisma schema)
export interface Patient {
  id: number;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender?: string;
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
  deletedAt?: string; // Soft delete
}

// Initialize patients file if it doesn't exist
if (!fs.existsSync(PATIENTS_FILE)) {
  fs.writeFileSync(PATIENTS_FILE, JSON.stringify([]), 'utf-8');
}

/**
 * Read all patients from file (including soft-deleted)
 */
function getAllPatientsIncludingDeleted(): Patient[] {
  try {
    const data = fs.readFileSync(PATIENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading patients:', error);
    return [];
  }
}

/**
 * Read all active patients from file (excluding soft-deleted)
 */
export function getAllPatients(): Patient[] {
  const patients = getAllPatientsIncludingDeleted();
  return patients.filter(p => !p.deletedAt);
}

/**
 * Write all patients to file
 */
function savePatients(patients: Patient[]): void {
  try {
    fs.writeFileSync(PATIENTS_FILE, JSON.stringify(patients, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving patients:', error);
    throw new Error('Failed to save patients');
  }
}

/**
 * Find patient by ID (excluding soft-deleted)
 */
export function findPatientById(id: number): Patient | undefined {
  const patients = getAllPatients();
  return patients.find(p => p.id === id);
}

/**
 * Find patient by MRN (excluding soft-deleted)
 */
export function findPatientByMRN(mrn: string): Patient | undefined {
  const patients = getAllPatients();
  return patients.find(p => p.mrn === mrn);
}

/**
 * Create new patient
 */
export function createPatient(
  patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
): Patient {
  const allPatients = getAllPatientsIncludingDeleted();

  // Check if MRN already exists (including soft-deleted)
  if (allPatients.find(p => p.mrn === patientData.mrn && !p.deletedAt)) {
    throw new Error('MRN already exists');
  }

  // Generate new ID
  const newId = allPatients.length > 0 ? Math.max(...allPatients.map(p => p.id)) + 1 : 1;

  const newPatient: Patient = {
    ...patientData,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  allPatients.push(newPatient);
  savePatients(allPatients);

  return newPatient;
}

/**
 * Update patient
 */
export function updatePatient(id: number, updates: Partial<Patient>): Patient | null {
  const allPatients = getAllPatientsIncludingDeleted();
  const index = allPatients.findIndex(p => p.id === id && !p.deletedAt);

  if (index === -1) {
    return null;
  }

  // Prevent changing ID, createdAt, createdById
  const updatedPatient: Patient = {
    ...allPatients[index],
    ...updates,
    id: allPatients[index].id,
    createdAt: allPatients[index].createdAt,
    createdById: allPatients[index].createdById,
    updatedAt: new Date().toISOString()
  };

  allPatients[index] = updatedPatient;
  savePatients(allPatients);

  return updatedPatient;
}

/**
 * Soft delete patient
 */
export function softDeletePatient(id: number): boolean {
  const allPatients = getAllPatientsIncludingDeleted();
  const index = allPatients.findIndex(p => p.id === id && !p.deletedAt);

  if (index === -1) {
    return false;
  }

  allPatients[index].deletedAt = new Date().toISOString();
  allPatients[index].updatedAt = new Date().toISOString();
  savePatients(allPatients);

  return true;
}

/**
 * Search patients by name or MRN
 */
export function searchPatients(query: string): Patient[] {
  const patients = getAllPatients();
  const lowerQuery = query.toLowerCase();

  return patients.filter(p =>
    p.firstName.toLowerCase().includes(lowerQuery) ||
    p.lastName.toLowerCase().includes(lowerQuery) ||
    p.mrn.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get patients with pagination
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
  sortBy?: keyof Patient;
  sortOrder?: 'asc' | 'desc';
}

export function getPatientsWithPagination(options: PaginationOptions = {}) {
  const { limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  let patients = getAllPatients();

  // Sort
  patients.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === undefined || bVal === undefined) return 0;

    let comparison = 0;
    if (aVal < bVal) comparison = -1;
    if (aVal > bVal) comparison = 1;

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const total = patients.length;
  const paginatedPatients = patients.slice(offset, offset + limit);

  return {
    data: paginatedPatients,
    total,
    limit,
    offset,
    hasMore: offset + limit < total
  };
}

/**
 * Clear all patients (for testing only)
 */
export function clearAllPatients(): void {
  savePatients([]);
}
