'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { User } from '@supabase/supabase-js';

interface UseProtectedRouteReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export function useProtectedRoute(): UseProtectedRouteReturn {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login?redirected=true');
    }
  }, [session, loading, router]);

  return {
    isLoading: loading,
    isAuthenticated: !!session,
    user: session?.user || null,
  };
}
