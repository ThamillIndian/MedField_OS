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
  status: 'completed' | 'pending' | 'scheduled';
  riskLevel?: 'green' | 'amber' | 'red';
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

interface UpcomingAppointment {
  id: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  location: string;
}

export default function PatientHomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [activePrescriptions, setActivePrescriptions] = useState<Prescription[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);

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
      },
      {
        id: 'visit002',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Follow-up',
        diagnosis: 'Hypertension - Routine Check',
        doctor: 'Dr. Priya Singh',
        status: 'completed',
        riskLevel: 'green',
      },
    ];

    const mockPrescriptions: Prescription[] = [
      {
        id: 'rx001',
        medication: 'Paracetamol 500mg',
        dosage: '500mg',
        frequency: 'Three times daily',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rx002',
        medication: 'Amoxicillin 500mg',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const mockAppointments: UpcomingAppointment[] = [
      {
        id: 'apt001',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        type: 'Follow-up',
        doctor: 'Dr. Rajesh Sharma',
        location: 'Community Health Center, Dharampur',
      },
    ];

    setRecentVisits(mockVisits);
    setActivePrescriptions(mockPrescriptions);
    setUpcomingAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateWithTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'short',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Patient'}</h1>
              <p className="text-blue-100 mt-2">Your Health Dashboard</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
              <p className="text-sm text-blue-100">Patient ID</p>
              <p className="text-lg font-semibold">{user?.uid?.slice(0, 8).toUpperCase() || 'P-12345'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Visits</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{recentVisits.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Prescriptions</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{activePrescriptions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Upcoming</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{upcomingAppointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <Card className="border-l-4 border-l-purple-600">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/patient/appointments')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-900">{apt.type}</p>
                          <p className="text-sm text-gray-600 mt-1">with {apt.doctor}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDateWithTime(apt.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{apt.time}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">📍 {apt.location}</p>
                        </div>
                        <Badge className="bg-purple-600 text-white">Confirmed</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent Visits */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Visits</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/patient/medical-history')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVisits.map((visit) => (
                    <div 
                      key={visit.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/patient/visit/${visit.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{visit.diagnosis}</h3>
                            {visit.riskLevel && (
                              <Badge riskLevel={visit.riskLevel} className="text-xs">
                                {visit.riskLevel.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">by {visit.doctor}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(visit.date)} • {visit.type}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {visit.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Active Medications */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Active Medications</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/patient/prescriptions')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activePrescriptions.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">
                    No active prescriptions
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activePrescriptions.map((rx) => (
                      <div key={rx.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="font-semibold text-gray-900 text-sm">{rx.medication}</p>
                        <p className="text-xs text-gray-600 mt-1">{rx.frequency}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Until {formatDate(rx.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full justify-start"
                    onClick={() => router.push('/patient/medical-history')}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Medical History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/patient/prescriptions')}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    My Prescriptions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/patient/appointments')}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Appointments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Health Tip */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">💚 Health Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Remember to take your medications on time and maintain a healthy lifestyle. 
                  Stay hydrated and get adequate rest.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
