/**
 * Patient Controller
 * Handles HTTP requests for patient management
 * Phase 2 - Patient Backend API
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createPatientSchema,
  updatePatientSchema,
  listPatientsQuerySchema,
  patientIdSchema
} from '../validators/patient.validator';
import * as patientService from '../services/patient.service';

/**
 * GET /api/v1/patients
 * List all patients with optional pagination and search
 */
export function listPatients(req: AuthRequest, res: Response): void {
  try {
    // Validate query parameters
    const queryValidation = listPatientsQuerySchema.safeParse(req.query);

    if (!queryValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: queryValidation.error.errors
        }
      });
      return;
    }

    const { limit, offset, sortBy, sortOrder, search } = queryValidation.data;

    // If search query provided, use search
    if (search) {
      const patients = patientService.searchPatientsByQuery(search);
      res.json({
        success: true,
        data: {
          patients,
          total: patients.length,
          limit: patients.length,
          offset: 0
        }
      });
      return;
    }

    // Otherwise, list with pagination
    const result = patientService.listPatients({
      limit,
      offset,
      sortBy,
      sortOrder
    });

    res.json({
      success: true,
      data: {
        patients: result.data,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore
      }
    });
  } catch (error) {
    console.error('Error listing patients:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list patients'
      }
    });
  }
}

/**
 * POST /api/v1/patients
 * Create a new patient
 */
export function createPatient(req: AuthRequest, res: Response): void {
  try {
    // Validate request body
    const validation = createPatientSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid patient data',
          details: validation.error.errors
        }
      });
      return;
    }

    const patientData = validation.data;
    const createdById = req.user!.id;

    // Create patient
    const patient = patientService.createNewPatient(patientData, createdById);

    res.status(201).json({
      success: true,
      data: { patient },
      message: 'Patient created successfully'
    });
  } catch (error) {
    console.error('Error creating patient:', error);

    if (error instanceof Error) {
      if (error.message.includes('MRN already exists')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'MRN_EXISTS',
            message: 'A patient with this MRN already exists'
          }
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create patient'
      }
    });
  }
}

/**
 * GET /api/v1/patients/:id
 * Get a single patient by ID
 */
export function getPatientById(req: AuthRequest, res: Response): void {
  try {
    // Validate ID parameter
    const paramValidation = patientIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid patient ID'
        }
      });
      return;
    }

    const { id } = paramValidation.data;

    // Get patient
    const patient = patientService.getPatientById(id);

    if (!patient) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'Patient not found'
        }
      });
      return;
    }

    // Calculate age
    const age = patientService.calculateAge(patient.dateOfBirth);

    res.json({
      success: true,
      data: {
        patient,
        age
      }
    });
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get patient'
      }
    });
  }
}

/**
 * PUT /api/v1/patients/:id
 * Update a patient
 */
export function updatePatient(req: AuthRequest, res: Response): void {
  try {
    // Validate ID parameter
    const paramValidation = patientIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid patient ID'
        }
      });
      return;
    }

    // Validate request body
    const bodyValidation = updatePatientSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid patient data',
          details: bodyValidation.error.errors
        }
      });
      return;
    }

    const { id } = paramValidation.data;
    const updates = bodyValidation.data;

    // Update patient
    const patient = patientService.updateExistingPatient(id, updates);

    if (!patient) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'Patient not found'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: { patient },
      message: 'Patient updated successfully'
    });
  } catch (error) {
    console.error('Error updating patient:', error);

    if (error instanceof Error) {
      if (error.message.includes('MRN already exists')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'MRN_EXISTS',
            message: 'A patient with this MRN already exists'
          }
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update patient'
      }
    });
  }
}

/**
 * DELETE /api/v1/patients/:id
 * Soft delete a patient
 */
export function deletePatient(req: AuthRequest, res: Response): void {
  try {
    // Validate ID parameter
    const paramValidation = patientIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid patient ID'
        }
      });
      return;
    }

    const { id } = paramValidation.data;

    // Delete patient
    const deleted = patientService.deletePatient(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'Patient not found'
        }
      });
      return;
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete patient'
      }
    });
  }
}

/**
 * GET /api/v1/patients/stats
 * Get patient statistics
 */
export function getPatientStatistics(req: AuthRequest, res: Response): void {
  try {
    const stats = patientService.getPatientStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting patient statistics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get patient statistics'
      }
    });
  }
}
