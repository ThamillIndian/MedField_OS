'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Prescription {
  id: string;
  visitId: string;
  visitDate: string;
  doctor: string;
  diagnosis: string;
  medications: Medication[];
  status: 'active' | 'completed' | 'discontinued';
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  startDate: string;
  endDate: string;
}

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    // Mock data for demo
    const mockPrescriptions: Prescription[] = [
      {
        id: 'rx001',
        visitId: 'visit001',
        visitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        doctor: 'Dr. Rajesh Sharma',
        diagnosis: 'Acute Febrile Illness',
        status: 'active',
        medications: [
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Three times daily (TDS)',
            duration: '7 days',
            instructions: 'Take after meals with plenty of water',
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Twice daily (BD)',
            duration: '5 days',
            instructions: 'Complete full course even if symptoms improve',
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: 'rx002',
        visitId: 'visit002',
        visitDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        doctor: 'Dr. Priya Singh',
        diagnosis: 'Hypertension - Ongoing Management',
        status: 'active',
        medications: [
          {
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily (OD)',
            duration: 'Continuous',
            instructions: 'Take in the morning',
            startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: 'rx003',
        visitId: 'visit003',
        visitDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        doctor: 'Dr. Amit Kumar',
        diagnosis: 'Vitamin D Deficiency',
        status: 'completed',
        medications: [
          {
            name: 'Vitamin D3',
            dosage: '60,000 IU',
            frequency: 'Once weekly',
            duration: '8 weeks',
            instructions: 'Take with milk or after meals',
            startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    ];

    setPrescriptions(mockPrescriptions);
    setLoading(false);
  }, []);

  const filteredPrescriptions = filterStatus === 'all'
    ? prescriptions
    : prescriptions.filter(p => p.status === filterStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredPrescriptions.length} prescription(s) {filterStatus !== 'all' ? `• ${filterStatus}` : ''}
              </p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => router.push('/patient/home')}
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">No prescriptions match your filter.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilterStatus('all')}
                >
                  Show All Prescriptions
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPrescriptions.map((prescription) => (
              <Card key={prescription.id} className="overflow-hidden">
                <div className={`h-2 ${
                  prescription.status === 'active' ? 'bg-green-500' :
                  prescription.status === 'completed' ? 'bg-gray-400' :
                  'bg-red-500'
                }`}></div>
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{prescription.diagnosis}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Prescribed by {prescription.doctor} on {formatDate(prescription.visitDate)}
                      </p>
                    </div>
                    <Badge className={getStatusBadge(prescription.status)}>
                      {prescription.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {prescription.medications.map((med, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{med.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {med.dosage} • {med.frequency}
                            </p>
                          </div>
                          {prescription.status === 'active' && getDaysRemaining(med.endDate) > 0 && (
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {getDaysRemaining(med.endDate)} days left
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Duration:</p>
                            <p className="text-gray-900 font-medium">{med.duration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Period:</p>
                            <p className="text-gray-900 font-medium">
                              {formatDate(med.startDate)} to {formatDate(med.endDate)}
                            </p>
                          </div>
                        </div>

                        {med.instructions && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-amber-900 mb-1">Instructions:</p>
                            <p className="text-sm text-gray-700">{med.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/patient/visit/${prescription.visitId}`)}
                    >
                      View Visit Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Medication Reminder Card */}
        {prescriptions.some(p => p.status === 'active') && (
          <Card className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">💊 Medication Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Take medications at the same time every day</li>
                <li>• Complete the full course of antibiotics even if you feel better</li>
                <li>• Store medicines in a cool, dry place away from sunlight</li>
                <li>• Check expiry dates before taking any medication</li>
                <li>• Keep a list of all your medications handy</li>
                <li>• Inform your doctor about any side effects immediately</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
