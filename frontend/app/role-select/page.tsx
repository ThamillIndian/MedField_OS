'use client';

import Link from 'next/link';

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            MedField OS
          </h1>
          <p className="text-lg text-gray-600">
            AI Clinical Copilot for Rural Healthcare
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Field Worker Card */}
          <Link href="/worker/dashboard">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Field Worker</h2>
                <p className="text-gray-600 text-sm">
                  Capture patient cases, conduct AI-guided interviews, and monitor health
                </p>
              </div>
            </div>
          </Link>

          {/* Doctor Card */}
          <Link href="/doctor/dashboard">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Doctor</h2>
                <p className="text-gray-600 text-sm">
                  Review referrals, validate AI triage, and provide clinical guidance
                </p>
              </div>
            </div>
          </Link>

          {/* Patient Card */}
          <Link href="/patient/home">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Patient</h2>
                <p className="text-gray-600 text-sm">
                  View reports, follow-ups, and receive care instructions
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            <strong>Medical Disclaimer:</strong> MedField OS provides decision support for frontline health workers. 
            It does not replace a licensed doctor. Urgent symptoms must be referred to qualified medical professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
