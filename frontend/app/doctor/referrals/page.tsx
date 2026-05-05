'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Referral {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  village: string;
  district: string;
  riskLevel: 'green' | 'amber' | 'red';
  chiefComplaint: string;
  referredBy: string;
  priority: 'routine' | 'urgent' | 'emergency';
  timestamp: string;
  status: 'pending' | 'reviewing' | 'completed';
}

export default function ReferralsQueuePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewing' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'routine' | 'urgent' | 'emergency'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'green' | 'amber' | 'red'>('all');

  useEffect(() => {
    // Mock data for demo
    const mockReferrals: Referral[] = [
      {
        id: 'ref001',
        patientName: 'Ramesh Kumar',
        age: 35,
        gender: 'Male',
        village: 'Dharampur',
        district: 'Solan',
        riskLevel: 'red',
        chiefComplaint: 'High fever (103.5°F), low oxygen saturation (90%)',
        referredBy: 'Priya Sharma',
        priority: 'emergency',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: 'ref002',
        patientName: 'Meena Devi',
        age: 28,
        gender: 'Female',
        village: 'Nahan',
        district: 'Sirmaur',
        riskLevel: 'amber',
        chiefComplaint: 'Persistent fever for 3 days, body pain',
        referredBy: 'Amit Singh',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: 'ref003',
        patientName: 'Suresh Patel',
        age: 42,
        gender: 'Male',
        village: 'Rajgarh',
        district: 'Solan',
        riskLevel: 'amber',
        chiefComplaint: 'Body pain and weakness, mild fever',
        referredBy: 'Ravi Kumar',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'reviewing',
      },
      {
        id: 'ref004',
        patientName: 'Lakshmi Nair',
        age: 55,
        gender: 'Female',
        village: 'Paonta Sahib',
        district: 'Sirmaur',
        riskLevel: 'green',
        chiefComplaint: 'Routine check-up, mild cold symptoms',
        referredBy: 'Neha Verma',
        priority: 'routine',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: 'ref005',
        patientName: 'Arjun Singh',
        age: 8,
        gender: 'Male',
        village: 'Nalagarh',
        district: 'Solan',
        riskLevel: 'amber',
        chiefComplaint: 'Child with fever, not eating well',
        referredBy: 'Sunita Devi',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
      },
    ];

    setReferrals(mockReferrals);
    setFilteredReferrals(mockReferrals);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = referrals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ref => 
        ref.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ref => ref.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ref => ref.priority === priorityFilter);
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(ref => ref.riskLevel === riskFilter);
    }

    setFilteredReferrals(filtered);
  }, [searchQuery, statusFilter, priorityFilter, riskFilter, referrals]);

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

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referrals...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Referrals Queue</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredReferrals.length} referral(s) {statusFilter !== 'all' ? `• ${statusFilter}` : ''}
              </p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => router.push('/doctor/dashboard')}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Filters Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Search */}
            <div className="mb-4">
              <Input
                label="Search"
                placeholder="Search by patient name, village, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'pending', 'reviewing', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        statusFilter === status
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'emergency', 'urgent', 'routine'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        priorityFilter === priority
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'red', 'amber', 'green'] as const).map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setRiskFilter(risk)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        riskFilter === risk
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {risk.charAt(0).toUpperCase() + risk.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        {filteredReferrals.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">No referrals match your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setRiskFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReferrals.map((referral) => (
              <Card key={referral.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent
                  className="pt-6"
                  onClick={() => router.push(`/doctor/case/${referral.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {referral.patientName}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {referral.age}Y • {referral.gender}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        📍 {referral.village}, {referral.district}
                      </p>
                      <p className="text-gray-700 mb-3">
                        <span className="font-medium">Chief Complaint:</span> {referral.chiefComplaint}
                      </p>
                      <p className="text-xs text-gray-500">
                        Referred by: {referral.referredBy} • {formatTimeAgo(referral.timestamp)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge riskLevel={referral.riskLevel}>
                        {referral.riskLevel.toUpperCase()}
                      </Badge>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(referral.priority)}`}>
                        {referral.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(referral.status)}`}>
                        {referral.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/doctor/case/${referral.id}`);
                      }}
                    >
                      {referral.status === 'completed' ? 'View Case' : 'Review Case'} →
                    </Button>
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
