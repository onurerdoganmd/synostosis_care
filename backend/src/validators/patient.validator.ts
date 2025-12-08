/**
 * Patient Validation Schemas
 * Uses Zod for runtime validation
 * Phase 2 - Patient Backend API
 */

import { z } from 'zod';

/**
 * Create patient validation schema
 */
export const createPatientSchema = z.object({
  mrn: z.string()
    .min(1, 'MRN is required')
    .max(50, 'MRN must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'MRN must contain only uppercase letters, numbers, and hyphens'),

  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),

  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),

  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'Date of birth cannot be in the future'),

  gender: z.enum(['male', 'female', 'other']).optional(),

  contactPhone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),

  contactEmail: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .optional(),

  address: z.string().max(500, 'Address must be less than 500 characters').optional(),

  insuranceProvider: z.string()
    .max(100, 'Insurance provider must be less than 100 characters')
    .optional(),

  insuranceId: z.string()
    .max(50, 'Insurance ID must be less than 50 characters')
    .optional(),

  referringPhysician: z.string()
    .max(100, 'Referring physician must be less than 100 characters')
    .optional(),

  familyHistory: z.string().max(2000, 'Family history must be less than 2000 characters').optional(),

  syndromic: z.boolean().default(false),

  syndromeType: z.string()
    .max(100, 'Syndrome type must be less than 100 characters')
    .optional(),

  geneticTesting: z.string()
    .max(2000, 'Genetic testing info must be less than 2000 characters')
    .optional(),

  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional()
});

/**
 * Update patient validation schema
 * All fields optional except those that shouldn't be changed
 */
export const updatePatientSchema = z.object({
  mrn: z.string()
    .min(1, 'MRN is required')
    .max(50, 'MRN must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'MRN must contain only uppercase letters, numbers, and hyphens')
    .optional(),

  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .optional(),

  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .optional(),

  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'Date of birth cannot be in the future')
    .optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),

  contactPhone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),

  contactEmail: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .optional(),

  address: z.string().max(500, 'Address must be less than 500 characters').optional(),

  insuranceProvider: z.string()
    .max(100, 'Insurance provider must be less than 100 characters')
    .optional(),

  insuranceId: z.string()
    .max(50, 'Insurance ID must be less than 50 characters')
    .optional(),

  referringPhysician: z.string()
    .max(100, 'Referring physician must be less than 100 characters')
    .optional(),

  familyHistory: z.string().max(2000, 'Family history must be less than 2000 characters').optional(),

  syndromic: z.boolean().optional(),

  syndromeType: z.string()
    .max(100, 'Syndrome type must be less than 100 characters')
    .optional(),

  geneticTesting: z.string()
    .max(2000, 'Genetic testing info must be less than 2000 characters')
    .optional(),

  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional()
}).strict();

/**
 * Query parameters validation for listing patients
 */
export const listPatientsQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(0)).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'firstName', 'lastName', 'dateOfBirth', 'mrn']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().max(100).optional()
});

/**
 * ID parameter validation
 */
export const patientIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number)
});

// Export types
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;
