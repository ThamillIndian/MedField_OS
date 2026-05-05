'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function VitalsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [vitals, setVitals] = useState({
    temperature: '',
    bpSystolic: '',
    bpDiastolic: '',
    pulse: '',
    spo2: '',
    bloodSugar: '',
    weight: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateVitals = () => {
    const newErrors: Record<string, string> = {};

    // Temperature validation (95-110°F)
    if (vitals.temperature) {
      const temp = parseFloat(vitals.temperature);
      if (temp < 95 || temp > 110) {
        newErrors.temperature = 'Temperature should be between 95-110°F';
      }
    }

    // BP Systolic (70-200)
    if (vitals.bpSystolic) {
      const sys = parseInt(vitals.bpSystolic);
      if (sys < 70 || sys > 200) {
        newErrors.bpSystolic = 'Systolic BP should be between 70-200 mmHg';
      }
    }

    // BP Diastolic (40-130)
    if (vitals.bpDiastolic) {
      const dia = parseInt(vitals.bpDiastolic);
      if (dia < 40 || dia > 130) {
        newErrors.bpDiastolic = 'Diastolic BP should be between 40-130 mmHg';
      }
    }

    // Pulse (40-200)
    if (vitals.pulse) {
      const pulse = parseInt(vitals.pulse);
      if (pulse < 40 || pulse > 200) {
        newErrors.pulse = 'Pulse should be between 40-200 bpm';
      }
    }

    // SpO2 (70-100)
    if (vitals.spo2) {
      const spo2 = parseInt(vitals.spo2);
      if (spo2 < 70 || spo2 > 100) {
        newErrors.spo2 = 'SpO2 should be between 70-100%';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getVitalStatus = (name: string, value: string) => {
    if (!value) return 'normal';
    
    const val = parseFloat(value);
    
    switch (name) {
      case 'temperature':
        if (val < 97 || val > 99.5) return 'abnormal';
        return 'normal';
      case 'bpSystolic':
        if (val < 90 || val > 140) return 'abnormal';
        return 'normal';
      case 'bpDiastolic':
        if (val < 60 || val > 90) return 'abnormal';
        return 'normal';
      case 'pulse':
        if (val < 60 || val > 100) return 'abnormal';
        return 'normal';
      case 'spo2':
        if (val < 95) return 'abnormal';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateVitals()) {
      return;
    }

    setLoading(true);

    try {
      // Store vitals in sessionStorage
      sessionStorage.setItem('currentVitals', JSON.stringify(vitals));
      
      // Navigate to voice intake
      router.push('/worker/voice-intake');
    } catch (error) {
      console.error('Error saving vitals:', error);
      alert('Failed to save vitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vitals Entry</h1>
            <p className="text-sm text-gray-600">Record patient vital signs</p>
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
            <CardTitle>Vital Signs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temperature */}
              <div>
                <Input
                  label="Temperature (°F)"
                  name="temperature"
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={handleChange}
                  error={errors.temperature}
                  placeholder="98.6"
                />
                {vitals.temperature && getVitalStatus('temperature', vitals.temperature) === 'abnormal' && (
                  <p className="mt-1 text-sm text-amber-600">⚠️ Abnormal temperature detected</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Normal: 97-99.5°F</p>
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Systolic"
                      name="bpSystolic"
                      type="number"
                      value={vitals.bpSystolic}
                      onChange={handleChange}
                      error={errors.bpSystolic}
                      placeholder="120"
                    />
                    {vitals.bpSystolic && getVitalStatus('bpSystolic', vitals.bpSystolic) === 'abnormal' && (
                      <p className="mt-1 text-sm text-amber-600">⚠️ Abnormal</p>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Diastolic"
                      name="bpDiastolic"
                      type="number"
                      value={vitals.bpDiastolic}
                      onChange={handleChange}
                      error={errors.bpDiastolic}
                      placeholder="80"
                    />
                    {vitals.bpDiastolic && getVitalStatus('bpDiastolic', vitals.bpDiastolic) === 'abnormal' && (
                      <p className="mt-1 text-sm text-amber-600">⚠️ Abnormal</p>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Normal: 90-140 / 60-90 mmHg</p>
              </div>

              {/* Pulse */}
              <div>
                <Input
                  label="Pulse (bpm)"
                  name="pulse"
                  type="number"
                  value={vitals.pulse}
                  onChange={handleChange}
                  error={errors.pulse}
                  placeholder="72"
                />
                {vitals.pulse && getVitalStatus('pulse', vitals.pulse) === 'abnormal' && (
                  <p className="mt-1 text-sm text-amber-600">⚠️ Abnormal pulse detected</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Normal: 60-100 bpm</p>
              </div>

              {/* SpO2 */}
              <div>
                <Input
                  label="SpO2 (%)"
                  name="spo2"
                  type="number"
                  value={vitals.spo2}
                  onChange={handleChange}
                  error={errors.spo2}
                  placeholder="98"
                />
                {vitals.spo2 && getVitalStatus('spo2', vitals.spo2) === 'abnormal' && (
                  <p className="mt-1 text-sm text-red-600">🚨 Low oxygen - urgent!</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Normal: Above 95%</p>
              </div>

              {/* Optional: Blood Sugar */}
              <div>
                <Input
                  label="Blood Sugar (mg/dL) - Optional"
                  name="bloodSugar"
                  type="number"
                  value={vitals.bloodSugar}
                  onChange={handleChange}
                  placeholder="100"
                />
                <p className="mt-1 text-xs text-gray-500">Fasting: 70-100 mg/dL, Random: Below 140 mg/dL</p>
              </div>

              {/* Optional: Weight */}
              <div>
                <Input
                  label="Weight (kg) - Optional"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={vitals.weight}
                  onChange={handleChange}
                  placeholder="60"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!validateVitals()) return;
                    sessionStorage.setItem('currentVitals', JSON.stringify(vitals));
                    router.push('/worker/triage-result');
                  }}
                  disabled={loading}
                >
                  Skip to Triage (Demo)
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Continue to Voice Intake'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
