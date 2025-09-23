// NEW;
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { createClient } from '@/utils/supabase/client';

const LogoutBtn = () => {
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
      router.push('/'); // or wherever you want to redirect
    } catch (err) {
      console.error('Unexpected logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      //onClick={handleLogout}
      onClick={handleLogout}
      disabled={loading}
      className="focus:bg-elements-grey-200 hover:bg-elements-grey-200 placeholder-base flex w-full cursor-pointer items-center rounded-sm border-none bg-white px-2 py-1.5 disabled:opacity-50"
    >
      {loading ? 'Виходимо...' : 'Вихід'}
    </button>
    /* I change it later for TOAST */
    /* {error && <p style={{ color: 'red' }}>{error}</p>} */
  );
};

export default LogoutBtn;
