/**
 * Patient Form Page
 * Create and edit patients
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createPatient, updatePatient, getPatientById } from '../services/patient.service';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import type { CreatePatientInput } from '../types/patient.types';

const patientSchema = z.object({
  mrn: z.string().min(1, 'MRN is required').regex(/^[A-Z0-9-]+$/, 'MRN must be uppercase letters, numbers, and hyphens'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Invalid email').or(z.literal('')).optional(),
  address: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceId: z.string().optional(),
  referringPhysician: z.string().optional(),
  familyHistory: z.string().optional(),
  syndromic: z.boolean().optional(),
  syndromeType: z.string().optional(),
  geneticTesting: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      syndromic: false,
    },
  });

  const syndromic = watch('syndromic');

  // Fetch patient data if editing
  const { data: patientData } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(Number(id)),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (patientData?.data.patient) {
      reset(patientData.data.patient);
    }
  }, [patientData, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePatientInput) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      navigate('/patients');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreatePatientInput) => updatePatient(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
      navigate(`/patients/${id}`);
    },
  });

  const onSubmit = (data: PatientFormData) => {
    const submitData = {
      ...data,
      gender: data.gender || undefined,
      contactEmail: data.contactEmail || undefined,
      contactPhone: data.contactPhone || undefined,
      address: data.address || undefined,
      insuranceProvider: data.insuranceProvider || undefined,
      insuranceId: data.insuranceId || undefined,
      referringPhysician: data.referringPhysician || undefined,
      familyHistory: data.familyHistory || undefined,
      syndromeType: data.syndromeType || undefined,
      geneticTesting: data.geneticTesting || undefined,
      notes: data.notes || undefined,
    };

    if (isEditMode) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Patient' : 'Add New Patient'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode ? 'Update patient information' : 'Enter patient details'}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {(error as any)?.response?.data?.error?.message || 'An error occurred'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          </div>

          <Input
            label="MRN"
            {...register('mrn')}
            error={errors.mrn?.message}
            required
            placeholder="e.g., MRN001"
          />

          <div />

          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
          />

          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            {...register('dateOfBirth')}
            error={errors.dateOfBirth?.message}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register('gender')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          </div>

          <Input
            label="Phone"
            {...register('contactPhone')}
            error={errors.contactPhone?.message}
            placeholder="555-1234"
          />

          <Input
            label="Email"
            type="email"
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
            placeholder="patient@example.com"
          />

          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                {...register('address')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Insurance */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
          </div>

          <Input
            label="Insurance Provider"
            {...register('insuranceProvider')}
            placeholder="Blue Cross"
          />

          <Input
            label="Insurance ID"
            {...register('insuranceId')}
            placeholder="BC12345"
          />

          {/* Medical Information */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
          </div>

          <Input
            label="Referring Physician"
            {...register('referringPhysician')}
            placeholder="Dr. Smith"
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              {...register('syndromic')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Syndromic Case
            </label>
          </div>

          {syndromic && (
            <Input
              label="Syndrome Type"
              {...register('syndromeType')}
              placeholder="e.g., Apert, Crouzon"
            />
          )}

          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family History
              </label>
              <textarea
                {...register('familyHistory')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genetic Testing
              </label>
              <textarea
                {...register('geneticTesting')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/patients')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Update Patient' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
