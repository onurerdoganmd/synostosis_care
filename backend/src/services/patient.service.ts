/**
 * Patient Service Layer
 * Business logic for patient management
 * Phase 2 - Patient Backend API
 */

import {
  Patient,
  getAllPatients,
  findPatientById,
  findPatientByMRN,
  createPatient,
  updatePatient,
  softDeletePatient,
  searchPatients,
  getPatientsWithPagination,
  PaginationOptions
} from '../data/patient.data';
import { CreatePatientInput, UpdatePatientInput } from '../validators/patient.validator';

/**
 * Get all patients with optional pagination
 */
export function listPatients(options?: PaginationOptions) {
  if (options && (options.limit !== undefined || options.offset !== undefined)) {
    return getPatientsWithPagination(options);
  }

  const patients = getAllPatients();
  return {
    data: patients,
    total: patients.length,
    limit: patients.length,
    offset: 0,
    hasMore: false
  };
}

/**
 * Get a single patient by ID
 */
export function getPatientById(id: number): Patient | null {
  const patient = findPatientById(id);
  if (!patient) {
    return null;
  }
  return patient;
}

/**
 * Create a new patient
 */
export function createNewPatient(
  patientData: CreatePatientInput,
  createdById: number
): Patient {
  // Check if MRN already exists
  const existingPatient = findPatientByMRN(patientData.mrn);
  if (existingPatient) {
    throw new Error('A patient with this MRN already exists');
  }

  // Create patient
  const patient = createPatient({
    ...patientData,
    syndromic: patientData.syndromic ?? false,
    createdById
  });

  return patient;
}

/**
 * Update an existing patient
 */
export function updateExistingPatient(
  id: number,
  updates: UpdatePatientInput
): Patient | null {
  // Check if patient exists
  const existingPatient = findPatientById(id);
  if (!existingPatient) {
    return null;
  }

  // If MRN is being updated, check if new MRN is unique
  if (updates.mrn && updates.mrn !== existingPatient.mrn) {
    const mrnExists = findPatientByMRN(updates.mrn);
    if (mrnExists) {
      throw new Error('A patient with this MRN already exists');
    }
  }

  // Update patient
  const updatedPatient = updatePatient(id, updates);
  return updatedPatient;
}

/**
 * Delete a patient (soft delete)
 */
export function deletePatient(id: number): boolean {
  return softDeletePatient(id);
}

/**
 * Search patients by name or MRN
 */
export function searchPatientsByQuery(query: string): Patient[] {
  if (!query || query.trim().length === 0) {
    return getAllPatients();
  }

  return searchPatients(query);
}

/**
 * Calculate patient age from date of birth
 */
export function calculateAge(dateOfBirth: string): {
  years: number;
  months: number;
  days: number;
} {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Get patient statistics
 */
export function getPatientStatistics() {
  const allPatients = getAllPatients();

  const stats = {
    total: allPatients.length,
    syndromic: allPatients.filter(p => p.syndromic).length,
    nonSyndromic: allPatients.filter(p => !p.syndromic).length,
    genderDistribution: {
      male: allPatients.filter(p => p.gender === 'male').length,
      female: allPatients.filter(p => p.gender === 'female').length,
      other: allPatients.filter(p => p.gender === 'other').length,
      unknown: allPatients.filter(p => !p.gender).length
    }
  };

  return stats;
}
