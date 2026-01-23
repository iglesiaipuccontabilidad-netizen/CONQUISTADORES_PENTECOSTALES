'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

interface UseProtectedRouteReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
}

export function useProtectedRoute(): UseProtectedRouteReturn {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push('/login?redirected=true');
      }
      setIsChecking(false);
    }
  }, [session, loading, router]);

  return {
    isLoading: isChecking || loading,
    isAuthenticated: !!session,
    user: session?.user,
  };
}
