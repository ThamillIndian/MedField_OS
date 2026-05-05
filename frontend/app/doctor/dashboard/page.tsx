'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ReferralPreview {
  id: string;
  patientName: string;
  age: number;
  village: string;
  riskLevel: 'green' | 'amber' | 'red';
  chiefComplaint: string;
  referredBy: string;
  priority: 'routine' | 'urgent' | 'emergency';
  timestamp: string;
  status: 'pending' | 'reviewing' | 'completed';
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingReferrals, setPendingReferrals] = useState<ReferralPreview[]>([]);

  useEffect(() => {
    // Mock data for demo
    const mockReferrals: ReferralPreview[] = [
      {
        id: 'ref001',
        patientName: 'Ramesh Kumar',
        age: 35,
        village: 'Dharampur',
        riskLevel: 'red',
        chiefComplaint: 'High fever, low oxygen saturation',
        referredBy: 'Worker: Priya Sharma',
        priority: 'emergency',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: 'ref002',
        patientName: 'Meena Devi',
        age: 28,
        village: 'Nahan',
        riskLevel: 'amber',
        chiefComplaint: 'Persistent fever for 3 days',
        referredBy: 'Worker: Amit Singh',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: 'ref003',
        patientName: 'Suresh Patel',
        age: 42,
        village: 'Rajgarh',
        riskLevel: 'amber',
        chiefComplaint: 'Body pain and weakness',
        referredBy: 'Worker: Ravi Kumar',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'reviewing',
      },
    ];

    setPendingReferrals(mockReferrals);
    setLoading(false);
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const hours = Math.floor((Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      emergency: 'bg-red-600 text-white',
      urgent: 'bg-amber-600 text-white',
      routine: 'bg-blue-600 text-white',
    };
    return colors[priority as keyof typeof colors] || colors.routine;
  };

  const stats = {
    pendingReferrals: pendingReferrals.filter(r => r.status === 'pending').length,
    underReview: pendingReferrals.filter(r => r.status === 'reviewing').length,
    completedToday: 5,
    emergencyCases: pendingReferrals.filter(r => r.priority === 'emergency').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, Dr. {user?.name || 'Doctor'}
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => router.push('/doctor/referrals')}
            >
              View All Referrals
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Referrals</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingReferrals}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.underReview}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedToday}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emergency Cases</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.emergencyCases}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Referrals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Referrals</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/doctor/referrals')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingReferrals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No pending referrals at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/doctor/case/${referral.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {referral.patientName}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {referral.age}Y, {referral.village}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {referral.chiefComplaint}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.referredBy} • {formatTimeAgo(referral.timestamp)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge riskLevel={referral.riskLevel}>
                          {referral.riskLevel.toUpperCase()}
                        </Badge>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(referral.priority)}`}>
                          {referral.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/doctor/case/${referral.id}`);
                        }}
                      >
                        Review Case →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
