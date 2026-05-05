'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface CaseData {
  referralId: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    village: string;
    district: string;
    knownConditions: string[];
  };
  visit: {
    type: string;
    timestamp: string;
    referredBy: string;
  };
  vitals: {
    temperature: string;
    bpSystolic: string;
    bpDiastolic: string;
    pulse: string;
    spo2: string;
    bloodSugar?: string;
    weight?: string;
  };
  triage: {
    riskLevel: 'green' | 'amber' | 'red';
    riskScore: number;
    possibleConditions: string[];
    reasons: string[];
    nextSteps: string[];
    llmExplanation: string;
  };
  voiceTranscript?: string;
  aiQuestions?: Record<string, string>;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'reviewing' | 'completed';
}

export default function CaseDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'history' | 'notes'>('overview');

  useEffect(() => {
    // Mock data for demo
    const mockCaseData: CaseData = {
      referralId: caseId,
      patient: {
        name: 'Ramesh Kumar',
        age: 35,
        gender: 'Male',
        phone: '9876543210',
        village: 'Dharampur',
        district: 'Solan',
        knownConditions: ['Hypertension'],
      },
      visit: {
        type: 'Emergency',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        referredBy: 'Priya Sharma (Field Worker)',
      },
      vitals: {
        temperature: '103.5',
        bpSystolic: '145',
        bpDiastolic: '92',
        pulse: '112',
        spo2: '90',
        bloodSugar: '125',
        weight: '72',
      },
      triage: {
        riskLevel: 'red',
        riskScore: 90,
        possibleConditions: ['Respiratory distress', 'Severe infection'],
        reasons: [
          'Low oxygen saturation (SpO2 < 92%)',
          'Very high fever (≥103°F)',
          'Elevated heart rate',
        ],
        nextSteps: [
          'URGENT: Immediate doctor referral required',
          'Oxygen support may be needed',
          'Monitor for seizures',
        ],
        llmExplanation: 'Critical vital signs detected requiring immediate medical attention. The patient shows signs that need urgent evaluation by a doctor to prevent complications.',
      },
      voiceTranscript: 'Patient is complaining of high fever for the last 3 days. Body temperature feels very hot. Also experiencing headache and body pain. No cough or cold symptoms initially, but now feeling breathless.',
      aiQuestions: {
        'fever_duration': '3-5 days',
        'fever_pattern': 'Continuous',
        'chills': 'yes',
        'breathing_difficulty': 'yes',
        'appetite': 'Very poor',
      },
      priority: 'emergency',
      status: 'pending',
    };

    setCaseData(mockCaseData);
    setLoading(false);
  }, [caseId]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = (newStatus: 'reviewing' | 'completed') => {
    if (caseData) {
      setCaseData({ ...caseData, status: newStatus });
      alert(`✓ Case status updated to: ${newStatus}`);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{caseData.patient.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {caseData.patient.age}Y • {caseData.patient.gender} • {caseData.patient.village}, {caseData.patient.district}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Case ID: {caseData.referralId} • {formatDate(caseData.visit.timestamp)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge riskLevel={caseData.triage.riskLevel} className="text-lg px-4 py-2">
                {caseData.triage.riskLevel.toUpperCase()} RISK
              </Badge>
              <Button 
                variant="secondary"
                onClick={() => router.push('/doctor/referrals')}
              >
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 border-b mb-6">
                  {(['overview', 'vitals', 'history', 'notes'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Triage Assessment */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Triage Assessment</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-gray-700">{caseData.triage.llmExplanation}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Possible Conditions:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {caseData.triage.possibleConditions.map((condition, idx) => (
                              <li key={idx} className="text-gray-700">{condition}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Reasons for Risk Level:</h4>
                          <ul className="space-y-2">
                            {caseData.triage.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
                                  caseData.triage.riskLevel === 'red' ? 'bg-red-600' :
                                  caseData.triage.riskLevel === 'amber' ? 'bg-amber-600' :
                                  'bg-green-600'
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="text-gray-700">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Voice Transcript */}
                    {caseData.voiceTranscript && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Complaint (Voice Transcript)</h3>
                        <div className="bg-gray-50 border rounded-lg p-4">
                          <p className="text-gray-700">{caseData.voiceTranscript}</p>
                        </div>
                      </div>
                    )}

                    {/* AI Questions */}
                    {caseData.aiQuestions && Object.keys(caseData.aiQuestions).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow-up Questions</h3>
                        <div className="space-y-2">
                          {Object.entries(caseData.aiQuestions).map(([question, answer]) => (
                            <div key={question} className="bg-gray-50 border rounded-lg p-3">
                              <p className="text-sm font-medium text-gray-700">
                                {question.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </p>
                              <p className="text-gray-900 mt-1">{answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Vitals Tab */}
                {activeTab === 'vitals' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-2xl font-bold text-gray-900">{caseData.vitals.temperature}°F</p>
                        <p className="text-xs text-gray-500 mt-1">Normal: 97-99.5°F</p>
                      </div>
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {caseData.vitals.bpSystolic}/{caseData.vitals.bpDiastolic}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Normal: 90-140/60-90 mmHg</p>
                      </div>
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="text-sm text-gray-600">Pulse</p>
                        <p className="text-2xl font-bold text-gray-900">{caseData.vitals.pulse} bpm</p>
                        <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
                      </div>
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="text-sm text-gray-600">SpO2</p>
                        <p className="text-2xl font-bold text-gray-900">{caseData.vitals.spo2}%</p>
                        <p className="text-xs text-gray-500 mt-1">Normal: Above 95%</p>
                      </div>
                      {caseData.vitals.bloodSugar && (
                        <div className="bg-gray-50 border rounded-lg p-4">
                          <p className="text-sm text-gray-600">Blood Sugar</p>
                          <p className="text-2xl font-bold text-gray-900">{caseData.vitals.bloodSugar} mg/dL</p>
                          <p className="text-xs text-gray-500 mt-1">Fasting: 70-100 mg/dL</p>
                        </div>
                      )}
                      {caseData.vitals.weight && (
                        <div className="bg-gray-50 border rounded-lg p-4">
                          <p className="text-sm text-gray-600">Weight</p>
                          <p className="text-2xl font-bold text-gray-900">{caseData.vitals.weight} kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div>
                    <p className="text-gray-600">Patient history and previous visits will appear here.</p>
                    <p className="text-sm text-gray-500 mt-2">(Coming soon - Backend integration needed)</p>
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div>
                    <p className="text-gray-600">Clinical notes will appear here.</p>
                    <p className="text-sm text-gray-500 mt-2">(Coming soon)</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => router.push(`/doctor/clinical-notes/${caseId}`)}
              >
                Add Clinical Notes
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => router.push(`/doctor/prescription/${caseId}`)}
              >
                Write Prescription
              </Button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="text-gray-900 font-medium">{caseData.patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="text-gray-900 font-medium">
                      {caseData.patient.village}, {caseData.patient.district}
                    </p>
                  </div>
                  {caseData.patient.knownConditions.length > 0 && (
                    <div>
                      <p className="text-gray-600 mb-1">Known Conditions</p>
                      {caseData.patient.knownConditions.map((condition, idx) => (
                        <Badge key={idx} className="mr-1 mb-1">{condition}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Visit Info */}
            <Card>
              <CardHeader>
                <CardTitle>Visit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Visit Type</p>
                    <p className="text-gray-900 font-medium">{caseData.visit.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Referred By</p>
                    <p className="text-gray-900 font-medium">{caseData.visit.referredBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Timestamp</p>
                    <p className="text-gray-900 font-medium">{formatDate(caseData.visit.timestamp)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Case Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Current Status:</p>
                  <Badge className="text-sm px-3 py-1">
                    {caseData.status.toUpperCase()}
                  </Badge>
                  
                  {caseData.status !== 'completed' && (
                    <div className="space-y-2 pt-3">
                      {caseData.status === 'pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => handleUpdateStatus('reviewing')}
                        >
                          Mark as Reviewing
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleUpdateStatus('completed')}
                      >
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {caseData.triage.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
