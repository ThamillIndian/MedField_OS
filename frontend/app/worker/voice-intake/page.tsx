'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function VoiceIntakePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voice Intake</h1>
            <p className="text-sm text-gray-600">Record patient complaint</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Voice Recording - Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Recording Feature</h3>
              <p className="text-gray-600 mb-6">
                This feature will allow you to record patient complaints using voice input.
                The audio will be transcribed and symptoms will be extracted automatically.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                For now, you can skip this step and continue to see the rest of the flow.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Go Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/worker/dashboard')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
