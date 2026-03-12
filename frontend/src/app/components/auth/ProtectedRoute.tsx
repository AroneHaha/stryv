'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthToken } from '../../lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Owner' | 'Employee' | 'Member')[];
}

export default function ProtectedRoute({    
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (!token) {
        // No token, redirect to login
        router.push('/');
        return;
      }

      if (!loading) {
        if (!isAuthenticated) {
          router.push('/');
          return;
        }

        // Check role-based access
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
          // Redirect based on role
          if (user.role === 'Member') {
            router.push('/member');
          } else {
            router.push('/dashboard/dashboard');
          }
          return;
        }

        setChecking(false);
      }
    };

    checkAuth();
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}