/**
 * Patient Routes
 * API endpoints for patient management
 * Phase 2 - Patient Backend API
 */

import { Router } from 'express';
import {
  listPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientStatistics
} from '../controllers/patient.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All patient routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/patients/stats
 * @desc    Get patient statistics
 * @access  Private
 */
router.get('/stats', getPatientStatistics);

/**
 * @route   GET /api/v1/patients
 * @desc    List all patients with optional pagination and search
 * @access  Private
 * @query   limit - Number of results (default: 10, max: 100)
 * @query   offset - Number of results to skip (default: 0)
 * @query   sortBy - Field to sort by (default: createdAt)
 * @query   sortOrder - Sort order: asc or desc (default: desc)
 * @query   search - Search by name or MRN
 */
router.get('/', listPatients);

/**
 * @route   POST /api/v1/patients
 * @desc    Create a new patient
 * @access  Private
 */
router.post('/', createPatient);

/**
 * @route   GET /api/v1/patients/:id
 * @desc    Get a single patient by ID
 * @access  Private
 */
router.get('/:id', getPatientById);

/**
 * @route   PUT /api/v1/patients/:id
 * @desc    Update a patient
 * @access  Private
 */
router.put('/:id', updatePatient);

/**
 * @route   DELETE /api/v1/patients/:id
 * @desc    Soft delete a patient
 * @access  Private
 */
router.delete('/:id', deletePatient);

export default router;
