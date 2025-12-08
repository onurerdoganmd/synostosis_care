/**
 * Patient Detail Page
 * View individual patient information
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPatientById } from '../services/patient.service';
import Button from '../components/common/Button';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(Number(id)),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading patient...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load patient details.</p>
        <Button className="mt-4" onClick={() => navigate('/patients')}>
          Back to Patients
        </Button>
      </div>
    );
  }

  const { patient, age } = data.data;

  const InfoRow: React.FC<{ label: string; value: string | number | boolean | undefined }> = ({
    label,
    value,
  }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {value !== undefined && value !== null && value !== '' ? String(value) : '-'}
      </dd>
    </div>
  );

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">MRN: {patient.mrn}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/patients')}>
            Back
          </Button>
          <Link to={`/patients/${patient.id}/edit`}>
            <Button>Edit Patient</Button>
          </Link>
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Basic Information */}
        <div className="px-6 py-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <dl className="divide-y divide-gray-200">
            <InfoRow label="Full Name" value={`${patient.firstName} ${patient.lastName}`} />
            <InfoRow label="Medical Record Number" value={patient.mrn} />
            <InfoRow label="Date of Birth" value={patient.dateOfBirth} />
            <InfoRow label="Age" value={`${age.years} years, ${age.months} months, ${age.days} days`} />
            <InfoRow label="Gender" value={patient.gender} />
          </dl>
        </div>

        {/* Contact Information */}
        <div className="px-6 py-5 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <dl className="divide-y divide-gray-200">
            <InfoRow label="Phone" value={patient.contactPhone} />
            <InfoRow label="Email" value={patient.contactEmail} />
            <InfoRow label="Address" value={patient.address} />
          </dl>
        </div>

        {/* Insurance Information */}
        <div className="px-6 py-5 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
          <dl className="divide-y divide-gray-200">
            <InfoRow label="Insurance Provider" value={patient.insuranceProvider} />
            <InfoRow label="Insurance ID" value={patient.insuranceId} />
          </dl>
        </div>

        {/* Medical Information */}
        <div className="px-6 py-5 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
          <dl className="divide-y divide-gray-200">
            <InfoRow label="Referring Physician" value={patient.referringPhysician} />
            <InfoRow
              label="Syndromic"
              value={patient.syndromic ? 'Yes' : 'No'}
            />
            {patient.syndromic && <InfoRow label="Syndrome Type" value={patient.syndromeType} />}
            <InfoRow label="Family History" value={patient.familyHistory} />
            <InfoRow label="Genetic Testing" value={patient.geneticTesting} />
            <InfoRow label="Notes" value={patient.notes} />
          </dl>
        </div>

        {/* Metadata */}
        <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Record Information</h2>
          <dl className="divide-y divide-gray-200">
            <InfoRow
              label="Created"
              value={new Date(patient.createdAt).toLocaleString()}
            />
            <InfoRow
              label="Last Updated"
              value={new Date(patient.updatedAt).toLocaleString()}
            />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
