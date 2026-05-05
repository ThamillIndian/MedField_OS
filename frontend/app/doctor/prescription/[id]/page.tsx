'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function PrescriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params?.id as string;
  
  const [isSaving, setIsSaving] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);

  const addMedication = () => {
    const newId = (medications.length + 1).toString();
    setMedications([
      ...medications,
      { id: newId, name: '', dosage: '', frequency: '', duration: '', instructions: '' },
    ]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSave = async () => {
    // Validate
    const hasEmptyFields = medications.some(med => !med.name || !med.dosage || !med.frequency || !med.duration);
    if (hasEmptyFields) {
      alert('Please fill in all required fields for each medication');
      return;
    }

    setIsSaving(true);
    
    try {
      // Store prescription in session storage (demo)
      sessionStorage.setItem(`prescription_${caseId}`, JSON.stringify(medications));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✓ Prescription saved successfully!');
      router.push(`/doctor/case/${caseId}`);
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Write Prescription</h1>
              <p className="text-sm text-gray-600 mt-1">Case ID: {caseId}</p>
              <p className="text-sm text-gray-600">Dr. {user?.name || 'Doctor'}</p>
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
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Medications</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addMedication}
              >
                + Add Medication
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {medications.map((med, index) => (
                <div key={med.id} className="border-2 border-gray-200 rounded-lg p-6 relative">
                  {/* Medication Number */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Medication {index + 1}
                    </h3>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(med.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medicine Name */}
                    <div className="md:col-span-2">
                      <Input
                        label="Medicine Name *"
                        value={med.name}
                        onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                        placeholder="e.g., Paracetamol, Amoxicillin"
                      />
                    </div>

                    {/* Dosage */}
                    <div>
                      <Input
                        label="Dosage *"
                        value={med.dosage}
                        onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                        placeholder="e.g., 500mg, 10ml"
                      />
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select frequency</option>
                        <option value="Once daily (OD)">Once daily (OD)</option>
                        <option value="Twice daily (BD)">Twice daily (BD)</option>
                        <option value="Three times daily (TDS)">Three times daily (TDS)</option>
                        <option value="Four times daily (QID)">Four times daily (QID)</option>
                        <option value="Every 4 hours">Every 4 hours</option>
                        <option value="Every 6 hours">Every 6 hours</option>
                        <option value="At bedtime (HS)">At bedtime (HS)</option>
                        <option value="As needed (PRN)">As needed (PRN)</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <select
                        value={med.duration}
                        onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select duration</option>
                        <option value="3 days">3 days</option>
                        <option value="5 days">5 days</option>
                        <option value="7 days">7 days</option>
                        <option value="10 days">10 days</option>
                        <option value="14 days">14 days</option>
                        <option value="1 month">1 month</option>
                        <option value="Until follow-up">Until follow-up</option>
                        <option value="Continuous">Continuous</option>
                      </select>
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                      </label>
                      <textarea
                        value={med.instructions}
                        onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[80px]"
                        placeholder="e.g., Take after meals, Avoid alcohol, Take with plenty of water..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 mt-6 border-t">
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
                  sessionStorage.setItem(`prescription_draft_${caseId}`, JSON.stringify(medications));
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
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Prescription'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Common Medications Quick Reference */}
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">💊 Common Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fever & Pain:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Paracetamol 500mg TDS</li>
                  <li>• Ibuprofen 400mg BD</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Antibiotics:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Amoxicillin 500mg TDS</li>
                  <li>• Azithromycin 500mg OD</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">GI Issues:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Omeprazole 20mg OD</li>
                  <li>• ORS Sachets PRN</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Respiratory:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Cetirizine 10mg HS</li>
                  <li>• Salbutamol inhaler PRN</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Reminders */}
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">⚠️ Prescription Safety</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Check for drug allergies before prescribing</li>
              <li>• Verify dosage for pediatric and geriatric patients</li>
              <li>• Consider drug interactions with existing medications</li>
              <li>• Provide clear instructions for patient compliance</li>
              <li>• Document rationale for antibiotic use</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
