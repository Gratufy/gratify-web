'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
//import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from '@tanstack/react-query';

export default function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const clear = useUserStore((s) => s.clear);
  const setError = useUserStore((s) => s.setError);

  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const confirmed = window.confirm('Confirm account deletion?');
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error: ${text}`);
      }
      // const supabase = createClient();
      // await supabase.auth.signOut();
      clear();
      queryClient.clear();
      alert('Your account has been successfully deleted.');
      router.push('/'); // or wherever you want to redirect
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err instanceof Error) {
        setError(err.message);
        alert(err.message);
      } else {
        setError('Unknown error');
        alert('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="focus:bg-elements-grey-200 hover:bg-elements-grey-200 placeholder-base flex w-full cursor-pointer items-center rounded-sm border-none bg-white px-2 py-1.5 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete Account'}
    </button>
  );
}
