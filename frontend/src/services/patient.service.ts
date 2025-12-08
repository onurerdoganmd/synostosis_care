/**
 * Patient Service
 * API calls for patient management
 */

import apiClient from './api';
import type {
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  PatientsListResponse,
  PatientResponse,
  PatientStatsResponse,
} from '../types/patient.types';

export interface ListPatientsParams {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'dateOfBirth' | 'mrn';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * Get list of patients
 */
export const listPatients = async (params?: ListPatientsParams): Promise<PatientsListResponse> => {
  const response = await apiClient.get<PatientsListResponse>('/patients', { params });
  return response.data;
};

/**
 * Get single patient by ID
 */
export const getPatientById = async (id: number): Promise<PatientResponse> => {
  const response = await apiClient.get<PatientResponse>(`/patients/${id}`);
  return response.data;
};

/**
 * Create new patient
 */
export const createPatient = async (data: CreatePatientInput): Promise<PatientResponse> => {
  const response = await apiClient.post<PatientResponse>('/patients', data);
  return response.data;
};

/**
 * Update existing patient
 */
export const updatePatient = async (
  id: number,
  data: UpdatePatientInput
): Promise<PatientResponse> => {
  const response = await apiClient.put<PatientResponse>(`/patients/${id}`, data);
  return response.data;
};

/**
 * Delete patient (soft delete)
 */
export const deletePatient = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/patients/${id}`);
  return response.data;
};

/**
 * Get patient statistics
 */
export const getPatientStats = async (): Promise<PatientStatsResponse> => {
  const response = await apiClient.get<PatientStatsResponse>('/patients/stats');
  return response.data;
};

/**
 * Search patients
 */
export const searchPatients = async (query: string): Promise<PatientsListResponse> => {
  const response = await apiClient.get<PatientsListResponse>('/patients', {
    params: { search: query },
  });
  return response.data;
};
