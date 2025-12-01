// OLD
'use client';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

const Logout = () => {
  const router = useRouter();
  const clear = useUserStore((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        console.error('Logout error:', error.message);
        //  toast / alert
        return;
      }

      clear();
      // delete react-query cache
      const queryClient = new QueryClient();
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      queryClient.removeQueries({ queryKey: queryKeys.favorites });
      router.push('/'); // or wherever you want to redirect
    } catch (err) {
      console.error('Unexpected logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        //onClick={handleLogout}
        onClick={handleLogout}
        disabled={loading}
        className="flex cursor-pointer items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow transition hover:shadow-md dark:border-gray-600 dark:bg-black dark:text-gray-200"
      >
        {loading ? 'Logging out...' : 'Log out'}
      </button>
      {/* I change it later for TOAST */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Logout;
