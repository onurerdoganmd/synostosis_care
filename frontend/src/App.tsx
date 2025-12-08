import { useState, useEffect } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => {
        setApiStatus('connected');
        setApiMessage(data.message);
      })
      .catch(() => {
        setApiStatus('error');
        setApiMessage('Backend is not running');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏥 Craniosynostosis Patient Tracking System
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive patient management from diagnosis to long-term follow-up
          </p>
        </div>

        {/* Status Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              ✅ Phase 0: Project Setup Complete
            </h2>

            {/* Backend Status */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Backend API Status:
              </h3>
              <div className="flex items-center space-x-3">
                {apiStatus === 'checking' && (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Checking connection...</span>
                  </>
                )}
                {apiStatus === 'connected' && (
                  <>
                    <span className="text-3xl">✅</span>
                    <span className="text-green-600 font-medium">{apiMessage}</span>
                  </>
                )}
                {apiStatus === 'error' && (
                  <>
                    <span className="text-3xl">❌</span>
                    <span className="text-red-600 font-medium">
                      {apiMessage} - Run: cd backend && npm run dev
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                What's Been Set Up:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Backend: Node.js + Express + TypeScript</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Frontend: React + TypeScript + Vite</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Styling: Tailwind CSS configured</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">Health check endpoint working</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">CORS configured for local development</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="border-t mt-6 pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                🎯 Next Phase:
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-medium mb-2">
                  Phase 1: Database & Authentication System
                </p>
                <p className="text-blue-700 text-sm">
                  Set up PostgreSQL database with complete schema and implement JWT-based authentication
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Technology Stack
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-medium text-blue-900">Backend</p>
                <p className="text-sm text-blue-700">Node.js + Express</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="font-medium text-purple-900">Frontend</p>
                <p className="text-sm text-purple-700">React + TypeScript</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="font-medium text-green-900">Database</p>
                <p className="text-sm text-green-700">PostgreSQL (Phase 1)</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="font-medium text-pink-900">Styling</p>
                <p className="text-sm text-pink-700">Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
