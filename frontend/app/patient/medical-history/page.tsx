'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Visit {
  id: string;
  date: string;
  type: string;
  diagnosis: string;
  doctor: string;
  status: 'completed' | 'pending';
  riskLevel?: 'green' | 'amber' | 'red';
  symptoms: string[];
  treatment?: string;
  notes?: string;
}

export default function MedicalHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'emergency' | 'routine' | 'follow-up'>('all');

  useEffect(() => {
    // Mock data for demo
    const mockVisits: Visit[] = [
      {
        id: 'visit001',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Emergency',
        diagnosis: 'Acute Febrile Illness',
        doctor: 'Dr. Rajesh Sharma',
        status: 'completed',
        riskLevel: 'amber',
        symptoms: ['High fever (103.5°F)', 'Body pain', 'Headache', 'Weakness'],
        treatment: 'Paracetamol 500mg TDS, Amoxicillin 500mg BD',
        notes: 'Patient advised rest and hydration. Follow-up in 5 days if symptoms persist.',
      },
      {
        id: 'visit002',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Follow-up',
        diagnosis: 'Hypertension - Routine Check',
        doctor: 'Dr. Priya Singh',
        status: 'completed',
        riskLevel: 'green',
        symptoms: ['Blood pressure slightly elevated'],
        treatment: 'Continue existing medication',
        notes: 'BP under control. Continue lifestyle modifications.',
      },
      {
        id: 'visit003',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Routine',
        diagnosis: 'Annual Health Checkup',
        doctor: 'Dr. Amit Kumar',
        status: 'completed',
        riskLevel: 'green',
        symptoms: ['No complaints'],
        treatment: 'Vitamin D3 supplements',
        notes: 'All parameters normal. Advised regular exercise and balanced diet.',
      },
    ];

    setVisits(mockVisits);
    setLoading(false);
  }, []);

  const filteredVisits = filterType === 'all' 
    ? visits 
    : visits.filter(v => v.type.toLowerCase() === filterType);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medical history...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredVisits.length} visit(s) on record
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
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Visit Type</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'emergency', 'routine', 'follow-up'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      filterType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline View */}
        {filteredVisits.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">No visits match your filter.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilterType('all')}
                >
                  Show All Visits
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredVisits.map((visit, index) => (
              <Card 
                key={visit.id} 
                className="relative hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/patient/visit/${visit.id}`)}
              >
                {/* Timeline Connector */}
                {index !== filteredVisits.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gray-300 -mb-6"></div>
                )}
                
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    {/* Timeline Dot */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                      visit.riskLevel === 'red' ? 'bg-red-100' :
                      visit.riskLevel === 'amber' ? 'bg-amber-100' :
                      'bg-green-100'
                    }`}>
                      <svg className={`w-8 h-8 ${
                        visit.riskLevel === 'red' ? 'text-red-600' :
                        visit.riskLevel === 'amber' ? 'text-amber-600' :
                        'text-green-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-semibold text-gray-900">{visit.diagnosis}</h3>
                            {visit.riskLevel && (
                              <Badge riskLevel={visit.riskLevel}>
                                {visit.riskLevel.toUpperCase()}
                              </Badge>
                            )}
                            <Badge className="bg-gray-200 text-gray-700">{visit.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Consulted with {visit.doctor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{formatDateShort(visit.date)}</p>
                          <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                            {visit.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Symptoms */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {visit.symptoms.map((symptom, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Treatment */}
                      {visit.treatment && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
                          <p className="text-sm text-gray-600">{visit.treatment}</p>
                        </div>
                      )}

                      {/* Notes */}
                      {visit.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-blue-900 mb-1">Doctor's Notes:</p>
                          <p className="text-sm text-gray-700">{visit.notes}</p>
                        </div>
                      )}

                      {/* View Details Button */}
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/patient/visit/${visit.id}`);
                          }}
                        >
                          View Full Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
