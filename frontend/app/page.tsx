'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on user role
        switch (user.role) {
          case 'worker':
            router.push('/worker/dashboard');
            break;
          case 'doctor':
            router.push('/doctor/dashboard');
            break;
          case 'patient':
            router.push('/patient/home');
            break;
          default:
            router.push('/role-select');
        }
      } else {
        router.push('/role-select');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading MedField OS...</p>
      </div>
    </div>
  );
}
