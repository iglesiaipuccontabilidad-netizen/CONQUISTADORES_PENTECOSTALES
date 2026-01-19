'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="flex h-screen">
        {/* Skeleton Sidebar */}
        <div className="w-64 bg-slate-900 p-6">
          <Skeleton className="h-8 w-48 bg-slate-800 mb-8" />
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-slate-800" />
              ))}
          </div>
        </div>
        {/* Skeleton Content */}
        <div className="flex-1 p-8">
          <Skeleton className="h-10 w-64 bg-slate-200 mb-6" />
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-slate-200" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useProtectedRoute handle redirect
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
