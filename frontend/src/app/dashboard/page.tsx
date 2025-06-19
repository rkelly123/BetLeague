'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // If no user, push to /login.
  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  // While redirecting, render nothing.
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, <b>{user}</b>!</p>

      <button
        onClick={() => {
          logout();          // clear token + context
          router.replace('/login');
        }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
