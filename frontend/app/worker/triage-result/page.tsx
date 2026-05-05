'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RiskLevel } from '@/types';

interface TriageResultData {
  riskLevel: RiskLevel;
  riskScore: number;
  possibleConditions: string[];
  reasons: string[];
  nextSteps: string[];
  llmExplanation: string;
}

export default function TriageResultPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [triageResult, setTriageResult] = useState<TriageResultData | null>(null);

  useEffect(() => {
    // Load patient and vitals data
    const patientData = sessionStorage.getItem('currentPatient');
    const vitalsData = sessionStorage.getItem('currentVitals');

    if (!patientData || !vitalsData) {
      // No data, redirect back
      router.push('/worker/new-visit');
      return;
    }

    // For demo: Generate mock triage result based on vitals
    const vitals = JSON.parse(vitalsData);
    const mockResult = generateMockTriage(vitals);
    
    setTriageResult(mockResult);
    setLoading(false);
  }, [router]);

  const generateMockTriage = (vitals: any): TriageResultData => {
    let riskLevel: RiskLevel = 'green';
    let riskScore = 30;
    const reasons: string[] = [];
    const possibleConditions: string[] = [];
    const nextSteps: string[] = [];

    // Analyze vitals and determine risk
    const temp = parseFloat(vitals.temperature) || 0;
    const spo2 = parseInt(vitals.spo2) || 100;
    const bpSys = parseInt(vitals.bpSystolic) || 120;
    const pulse = parseInt(vitals.pulse) || 72;

    // RED FLAGS
    if (spo2 < 92) {
      riskLevel = 'red';
      riskScore = 90;
      reasons.push('Low oxygen saturation (SpO2 < 92%)');
      possibleConditions.push('Respiratory distress');
      nextSteps.push('URGENT: Immediate doctor referral required');
      nextSteps.push('Oxygen support may be needed');
    } else if (temp >= 103) {
      riskLevel = 'red';
      riskScore = 85;
      reasons.push('Very high fever (≥103°F)');
      possibleConditions.push('Severe infection');
      nextSteps.push('URGENT: Immediate medical attention');
      nextSteps.push('Monitor for seizures');
    } else if (bpSys < 90 || bpSys > 180) {
      riskLevel = 'red';
      riskScore = 88;
      reasons.push('Critical blood pressure levels');
      possibleConditions.push('Cardiovascular emergency');
      nextSteps.push('URGENT: Immediate doctor referral');
    }
    // AMBER WARNINGS
    else if (temp > 100 && temp < 103) {
      riskLevel = 'amber';
      riskScore = 65;
      reasons.push('High fever detected (100-103°F)');
      possibleConditions.push('Possible viral or bacterial infection');
      nextSteps.push('Monitor temperature every 4 hours');
      nextSteps.push('Encourage fluid intake');
      nextSteps.push('Recheck in 12-24 hours');
      nextSteps.push('Refer if fever persists beyond 3 days');
    } else if (spo2 >= 92 && spo2 < 95) {
      riskLevel = 'amber';
      riskScore = 70;
      reasons.push('Slightly low oxygen saturation (92-95%)');
      possibleConditions.push('Mild respiratory compromise');
      nextSteps.push('Monitor breathing closely');
      nextSteps.push('Recheck SpO2 in 1 hour');
      nextSteps.push('Refer if SpO2 drops further');
    } else if (pulse > 100 || pulse < 60) {
      if (riskLevel !== 'amber') {
        riskLevel = 'amber';
        riskScore = 60;
      }
      reasons.push('Abnormal heart rate');
      possibleConditions.push('Possible cardiac stress or dehydration');
      nextSteps.push('Monitor pulse regularly');
      nextSteps.push('Check hydration status');
    }
    // GREEN (LOW RISK)
    else {
      riskLevel = 'green';
      riskScore = 25;
      reasons.push('All vital signs within normal range');
      possibleConditions.push('No immediate concerns detected');
      nextSteps.push('Continue routine monitoring');
      nextSteps.push('Maintain healthy lifestyle');
      nextSteps.push('Return if symptoms develop');
    }

    let llmExplanation = '';
    if (riskLevel === 'red') {
      llmExplanation = 'Critical vital signs detected requiring immediate medical attention. The patient shows signs that need urgent evaluation by a doctor to prevent complications.';
    } else if (riskLevel === 'amber') {
      llmExplanation = 'Some concerning vital signs detected that require close monitoring. While not immediately critical, these readings suggest the patient needs careful observation and may require medical review if symptoms persist or worsen.';
    } else {
      llmExplanation = 'Patient vital signs are within acceptable ranges. No immediate concerns detected, but routine monitoring should continue as planned.';
    }

    return {
      riskLevel,
      riskScore,
      possibleConditions,
      reasons,
      nextSteps,
      llmExplanation,
    };
  };

  const getRiskColor = (risk: RiskLevel) => {
    const colors = {
      green: 'bg-green-500',
      amber: 'bg-amber-500',
      red: 'bg-red-500',
    };
    return colors[risk];
  };

  const getRiskLabel = (risk: RiskLevel) => {
    const labels = {
      green: 'Low Risk',
      amber: 'Moderate Risk',
      red: 'Urgent Risk',
    };
    return labels[risk];
  };

  if (loading || !triageResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Triage Result</h1>
            <p className="text-sm text-gray-600">AI-Assisted Assessment Complete</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => router.push('/worker/dashboard')}
          >
            Close
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Risk Level Card */}
        <Card className={`border-4 ${triageResult.riskLevel === 'red' ? 'border-red-500' : triageResult.riskLevel === 'amber' ? 'border-amber-500' : 'border-green-500'}`}>
          <CardContent>
            <div className="text-center py-8">
              <div className={`w-24 h-24 ${getRiskColor(triageResult.riskLevel)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-4xl text-white font-bold">{triageResult.riskScore}</span>
              </div>
              <Badge 
                riskLevel={triageResult.riskLevel}
                className="text-lg px-6 py-2 mb-2"
              >
                {getRiskLabel(triageResult.riskLevel)}
              </Badge>
              <p className="text-gray-600 mt-4">Risk Score: {triageResult.riskScore}/100</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Explanation */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{triageResult.llmExplanation}</p>
          </CardContent>
        </Card>

        {/* Possible Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Possible Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {triageResult.possibleConditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{condition}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Why This Risk Level?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {triageResult.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${getRiskColor(triageResult.riskLevel)}`}>
                    {index + 1}
                  </span>
                  <span className="text-gray-700 flex-1">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {triageResult.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="primary" 
            className="flex-1"
            onClick={() => router.push('/worker/action-plan')}
          >
            {triageResult.riskLevel === 'red' || triageResult.riskLevel === 'amber' 
              ? 'Create Referral & Follow-up →' 
              : 'Schedule Follow-up →'}
          </Button>
          
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={() => alert('Report generation - Coming soon!')}
          >
            Generate Report
          </Button>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center pt-4">
          <Button 
            variant="outline"
            onClick={() => {
              // Clear session data
              sessionStorage.removeItem('currentPatient');
              sessionStorage.removeItem('currentVitals');
              router.push('/worker/dashboard');
            }}
          >
            Return to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
