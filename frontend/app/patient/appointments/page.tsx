'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: 'Follow-up' | 'Routine Check' | 'Specialist Consultation' | 'Lab Test';
  doctor: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  relatedVisitId?: string;
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    // Mock data for demo
    const mockAppointments: Appointment[] = [
      {
        id: 'apt001',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        type: 'Follow-up',
        doctor: 'Dr. Rajesh Sharma',
        location: 'Community Health Center, Dharampur',
        status: 'upcoming',
        notes: 'Bring previous prescription and lab reports',
        relatedVisitId: 'visit001',
      },
      {
        id: 'apt002',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2:30 PM',
        type: 'Lab Test',
        doctor: 'Lab Technician',
        location: 'District Hospital Lab, Solan',
        status: 'upcoming',
        notes: 'Fasting required - No food or water 12 hours before test',
      },
      {
        id: 'apt003',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        time: '11:00 AM',
        type: 'Routine Check',
        doctor: 'Dr. Priya Singh',
        location: 'Community Health Center, Dharampur',
        status: 'completed',
        relatedVisitId: 'visit002',
      },
      {
        id: 'apt004',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        time: '9:00 AM',
        type: 'Routine Check',
        doctor: 'Dr. Amit Kumar',
        location: 'Community Health Center, Dharampur',
        status: 'completed',
        relatedVisitId: 'visit003',
      },
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return `${Math.abs(days)} days ago`;
    return `in ${days} days`;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.upcoming;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'Follow-up': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      'Routine Check': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Specialist Consultation': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      'Lab Test': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    };
    return icons[type as keyof typeof icons] || icons['Routine Check'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-sm text-gray-600 mt-1">
                {upcomingAppointments.length} upcoming appointment(s)
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
        
        {/* Next Appointment Highlight */}
        {upcomingAppointments.length > 0 && (
          <Card className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300 border-2">
            <CardHeader>
              <CardTitle className="text-purple-900">📅 Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(upcomingAppointments[0].type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{upcomingAppointments[0].type}</h3>
                  <p className="text-gray-700 mb-1">with {upcomingAppointments[0].doctor}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(upcomingAppointments[0].date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{upcomingAppointments[0].time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">📍 {upcomingAppointments[0].location}</p>
                  {upcomingAppointments[0].notes && (
                    <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                      <p className="text-sm font-medium text-amber-900 mb-1">Important Notes:</p>
                      <p className="text-sm text-gray-700">{upcomingAppointments[0].notes}</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <Badge className="bg-purple-600 text-white text-sm px-3 py-1">
                      {getDaysUntil(upcomingAppointments[0].date)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
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

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">No appointments match your filter.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilterStatus('all')}
                >
                  Show All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {getTypeIcon(appointment.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.type}</h3>
                          <p className="text-sm text-gray-600">{appointment.doctor}</p>
                        </div>
                        <Badge className={getStatusBadge(appointment.status)}>
                          {appointment.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDateShort(appointment.date)} • {appointment.time}</span>
                        </div>
                        {appointment.status === 'upcoming' && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            {getDaysUntil(appointment.date)}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mb-3">📍 {appointment.location}</p>

                      {appointment.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-medium text-amber-900 mb-1">Notes:</p>
                          <p className="text-sm text-gray-700">{appointment.notes}</p>
                        </div>
                      )}

                      {appointment.relatedVisitId && appointment.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/patient/visit/${appointment.relatedVisitId}`)}
                        >
                          View Visit Details →
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Appointment Tips */}
        <Card className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Appointment Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Arrive 15 minutes early for your appointment</li>
              <li>• Bring your previous prescriptions and test reports</li>
              <li>• Write down questions you want to ask your doctor</li>
              <li>• Inform the clinic if you need to cancel or reschedule</li>
              <li>• Follow any special instructions (fasting, medications, etc.)</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
