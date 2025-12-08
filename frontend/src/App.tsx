/**
 * Main App Component
 * React Router and React Query setup
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

// Simple Dashboard component
const Dashboard = () => (
  <div className="px-4 sm:px-0">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Craniosynostosis Patient Tracking System
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Patients</h2>
        <p className="text-3xl font-bold text-blue-600">-</p>
        <p className="text-sm text-gray-500 mt-2">Total patients</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Syndromic</h2>
        <p className="text-3xl font-bold text-yellow-600">-</p>
        <p className="text-sm text-gray-500 mt-2">Syndromic cases</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Active</h2>
        <p className="text-3xl font-bold text-green-600">-</p>
        <p className="text-sm text-gray-500 mt-2">Active patients</p>
      </div>
    </div>

    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
      <div className="space-y-2">
        <a
          href="/patients"
          className="block text-blue-600 hover:text-blue-800 hover:underline"
        >
          → View All Patients
        </a>
        <a
          href="/patients/new"
          className="block text-blue-600 hover:text-blue-800 hover:underline"
        >
          → Add New Patient
        </a>
      </div>
    </div>
  </div>
);

// Simple Login component
const Login = () => {
  const handleLogin = () => {
    // For Phase 3, we'll use the admin token from Phase 1
    // In production, this would be a proper login form
    localStorage.setItem(
      'accessToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTIxNDYyMSwiZXhwIjoxNzY1MjE1NTIxLCJpc3MiOiJzeW5vc3Rvc2lzLWNhcmUtYXBpIiwic3ViIjoiMSJ9.F_4SkTtmCsf2LuWaFISbAlLRyUj6KVfnmV1yV55Y7bU'
    );
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Craniosynostosis Care
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Patient Tracking System
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Login as Admin (Demo)
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Phase 3: Patient Management UI
        </p>
      </div>
    </div>
  );
};

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/new"
            element={
              <ProtectedRoute>
                <PatientForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <PatientDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id/edit"
            element={
              <ProtectedRoute>
                <PatientForm />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
