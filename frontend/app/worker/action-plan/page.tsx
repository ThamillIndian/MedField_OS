'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RiskLevel } from '@/types';

interface ActionPlanData {
  riskLevel: RiskLevel;
  referralNeeded: boolean;
  followUpNeeded: boolean;
  medications?: string[];
  instructions?: string[];
}

export default function ActionPlanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionPlan, setActionPlan] = useState<ActionPlanData | null>(null);
  
  // Referral form state
  const [referralType, setReferralType] = useState<'doctor' | 'specialist' | 'hospital'>('doctor');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [notes, setNotes] = useState('');
  
  // Follow-up form state
  const [followUpDays, setFollowUpDays] = useState('3');
  const [followUpReason, setFollowUpReason] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load patient and vitals data
    const patientData = sessionStorage.getItem('currentPatient');
    const vitalsData = sessionStorage.getItem('currentVitals');

    if (!patientData || !vitalsData) {
      router.push('/worker/new-visit');
      return;
    }

    // Determine action plan based on vitals
    const vitals = JSON.parse(vitalsData);
    const plan = generateActionPlan(vitals);
    setActionPlan(plan);
    
    // Set default priority based on risk
    if (plan.riskLevel === 'red') {
      setPriority('emergency');
    } else if (plan.riskLevel === 'amber') {
      setPriority('urgent');
    }
    
    setLoading(false);
  }, [router]);

  const generateActionPlan = (vitals: any): ActionPlanData => {
    const temp = parseFloat(vitals.temperature) || 0;
    const spo2 = parseInt(vitals.spo2) || 100;
    const bpSys = parseInt(vitals.bpSystolic) || 120;

    let riskLevel: RiskLevel = 'green';
    let referralNeeded = false;
    let followUpNeeded = true;
    const medications: string[] = [];
    const instructions: string[] = [];

    // Determine risk and actions
    if (spo2 < 92 || temp >= 103 || bpSys < 90 || bpSys > 180) {
      riskLevel = 'red';
      referralNeeded = true;
      instructions.push('URGENT: Immediate referral to doctor required');
      instructions.push('Monitor patient continuously');
      instructions.push('Arrange transport if needed');
    } else if (temp > 100 || spo2 < 95 || bpSys > 140) {
      riskLevel = 'amber';
      referralNeeded = true;
      followUpNeeded = true;
      
      if (temp > 100) {
        medications.push('Paracetamol 500mg (if needed for fever)');
        instructions.push('Give plenty of fluids');
        instructions.push('Monitor temperature every 4 hours');
      }
      
      instructions.push('Schedule doctor consultation within 24-48 hours');
      instructions.push('Return immediately if condition worsens');
    } else {
      riskLevel = 'green';
      followUpNeeded = true;
      instructions.push('No immediate medical attention needed');
      instructions.push('Continue monitoring symptoms');
      instructions.push('Maintain healthy habits');
      instructions.push('Return if new symptoms develop');
    }

    return {
      riskLevel,
      referralNeeded,
      followUpNeeded,
      medications,
      instructions,
    };
  };

  const handleCreateReferral = async () => {
    setIsSaving(true);
    
    try {
      const referralData = {
        type: referralType,
        priority,
        notes,
        createdAt: new Date().toISOString(),
      };
      
      // Store referral data
      sessionStorage.setItem('referralData', JSON.stringify(referralData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✓ Referral created successfully!\nThe doctor will be notified.');
      
      // Navigate back to dashboard
      router.push('/worker/dashboard');
    } catch (error) {
      console.error('Error creating referral:', error);
      alert('Failed to create referral. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScheduleFollowUp = async () => {
    setIsSaving(true);
    
    try {
      const followUpData = {
        days: followUpDays,
        reason: followUpReason,
        scheduledDate: new Date(Date.now() + parseInt(followUpDays) * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      // Store follow-up data
      sessionStorage.setItem('followUpData', JSON.stringify(followUpData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`✓ Follow-up scheduled for ${followUpDays} days from now!`);
      
      // Navigate back to dashboard
      router.push('/worker/dashboard');
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      alert('Failed to schedule follow-up. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteVisit = () => {
    // Clear session data
    sessionStorage.removeItem('currentPatient');
    sessionStorage.removeItem('currentVitals');
    sessionStorage.removeItem('voiceTranscript');
    sessionStorage.removeItem('aiQuestions');
    
    router.push('/worker/dashboard');
  };

  if (loading || !actionPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating action plan...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Action Plan</h1>
            <p className="text-sm text-gray-600">Referrals & Follow-ups</p>
          </div>
          <Badge riskLevel={actionPlan.riskLevel}>
            {actionPlan.riskLevel.toUpperCase()}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Recommended Actions */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionPlan.instructions?.map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
                    actionPlan.riskLevel === 'red' ? 'bg-red-600' :
                    actionPlan.riskLevel === 'amber' ? 'bg-amber-600' :
                    'bg-green-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 pt-0.5">{instruction}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medications (if any) */}
        {actionPlan.medications && actionPlan.medications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>💊 Recommended Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {actionPlan.medications.map((med, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{med}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Note: Only suggest medications within scope of practice.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Create Referral */}
        {actionPlan.referralNeeded && (
          <Card>
            <CardHeader>
              <CardTitle>🏥 Create Referral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Referral Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refer To
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['doctor', 'specialist', 'hospital'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setReferralType(type)}
                        className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                          referralType === type
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPriority('routine')}
                      className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                        priority === 'routine'
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      Routine
                    </button>
                    <button
                      onClick={() => setPriority('urgent')}
                      className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                        priority === 'urgent'
                          ? 'border-amber-600 bg-amber-50 text-amber-700'
                          : 'border-gray-300 hover:border-amber-400'
                      }`}
                    >
                      Urgent
                    </button>
                    <button
                      onClick={() => setPriority('emergency')}
                      className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                        priority === 'emergency'
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-red-400'
                      }`}
                    >
                      Emergency
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[100px]"
                    placeholder="Add any relevant notes for the doctor..."
                  />
                </div>

                <Button
                  variant="danger"
                  className="w-full"
                  onClick={handleCreateReferral}
                  disabled={isSaving}
                >
                  {isSaving ? 'Creating...' : 'Create Referral'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Follow-up */}
        {actionPlan.followUpNeeded && (
          <Card>
            <CardHeader>
              <CardTitle>📅 Schedule Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Follow-up Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up In
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['1', '3', '7', '14'].map((days) => (
                      <button
                        key={days}
                        onClick={() => setFollowUpDays(days)}
                        className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                          followUpDays === days
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {days} {days === '1' ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Follow-up Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Follow-up
                  </label>
                  <textarea
                    value={followUpReason}
                    onChange={(e) => setFollowUpReason(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[80px]"
                    placeholder="e.g., Re-check fever, monitor symptoms..."
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleScheduleFollowUp}
                  disabled={isSaving}
                >
                  {isSaving ? 'Scheduling...' : 'Schedule Follow-up'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Visit */}
        <Card className="bg-gray-50">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {actionPlan.referralNeeded || actionPlan.followUpNeeded
                ? 'Or complete visit without referral/follow-up'
                : 'Visit assessment complete!'}
            </p>
            <Button
              variant="outline"
              onClick={handleCompleteVisit}
            >
              Complete Visit & Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
