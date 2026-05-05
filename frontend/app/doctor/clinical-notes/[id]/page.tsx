'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ClinicalNotesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params?.id as string;
  
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState({
    diagnosis: '',
    symptoms: '',
    examination: '',
    investigations: '',
    treatment: '',
    advice: '',
    followUp: '',
  });

  const handleChange = (field: keyof typeof notes, value: string) => {
    setNotes(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Store notes in session storage (demo)
      sessionStorage.setItem(`clinicalNotes_${caseId}`, JSON.stringify(notes));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✓ Clinical notes saved successfully!');
      router.push(`/doctor/case/${caseId}`);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save clinical notes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clinical Notes</h1>
              <p className="text-sm text-gray-600 mt-1">Case ID: {caseId}</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => router.push(`/doctor/case/${caseId}`)}
            >
              ← Back to Case
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-6">
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provisional Diagnosis *
                </label>
                <textarea
                  value={notes.diagnosis}
                  onChange={(e) => handleChange('diagnosis', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px]"
                  placeholder="Enter provisional or confirmed diagnosis..."
                  required
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presenting Symptoms
                </label>
                <textarea
                  value={notes.symptoms}
                  onChange={(e) => handleChange('symptoms', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px]"
                  placeholder="Describe patient's chief complaints and symptoms..."
                />
              </div>

              {/* Physical Examination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Examination Findings
                </label>
                <textarea
                  value={notes.examination}
                  onChange={(e) => handleChange('examination', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[120px]"
                  placeholder="Record physical examination findings (General appearance, CNS, CVS, RS, Abdomen, etc.)..."
                />
              </div>

              {/* Investigations Recommended */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investigations Recommended
                </label>
                <textarea
                  value={notes.investigations}
                  onChange={(e) => handleChange('investigations', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px]"
                  placeholder="List recommended lab tests, imaging, or other investigations..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: CBC, CRP, Chest X-ray, Blood culture, etc.
                </p>
              </div>

              {/* Treatment Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Plan *
                </label>
                <textarea
                  value={notes.treatment}
                  onChange={(e) => handleChange('treatment', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[120px]"
                  placeholder="Describe treatment plan (medications, procedures, referrals, etc.)..."
                  required
                />
              </div>

              {/* Patient Advice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Advice & Instructions
                </label>
                <textarea
                  value={notes.advice}
                  onChange={(e) => handleChange('advice', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px]"
                  placeholder="Provide advice for patient care at home, diet, activity restrictions, warning signs..."
                />
              </div>

              {/* Follow-up */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Instructions
                </label>
                <textarea
                  value={notes.followUp}
                  onChange={(e) => handleChange('followUp', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[80px]"
                  placeholder="When should patient return for follow-up? What to monitor..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/doctor/case/${caseId}`)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    sessionStorage.setItem(`clinicalNotes_draft_${caseId}`, JSON.stringify(notes));
                    alert('✓ Draft saved locally');
                  }}
                  disabled={isSaving}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  disabled={!notes.diagnosis || !notes.treatment || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">📝 Documentation Tips</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Be specific and objective in your findings</li>
              <li>• Use standard medical terminology</li>
              <li>• Include relevant positive and negative findings</li>
              <li>• Document patient education provided</li>
              <li>• Note any referrals or specialist consultations needed</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
