'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
//import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { CustomToast } from './CustomToast';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';

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
      CustomToast({
        type: 'success',
        content: (
          <>
            <p className="font-semibold">Ваш аккаунт видалено</p>
          </>
        ),
      });

      router.push('/'); // or wherever you want to redirect
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err instanceof Error) {
        setError(err.message);

        CustomToast({
          type: 'error',
          content: (
            <>
              <p className="font-semibold">Щось трапилось</p>
              <p>{err.message}</p>
            </>
          ),
        });
      } else {
        setError('Unknown error');

        CustomToast({
          type: 'error',
          content: (
            <>
              <p className="font-semibold">Щось трапилось</p>
              <p>Спрбуйте пізніше.</p>
            </>
          ),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-icons-color-error focus:bg-elements-grey-200 hover:bg-elements-grey-200 xl:placeholder-base flex w-full cursor-pointer items-center rounded-sm border-none bg-white px-3 py-1.5 text-sm disabled:opacity-50 lg:px-2"
    >
      <IconRecycle className="text-icons-color-error mr-2 size-4 xl:mr-3 xl:size-5" />
      <span>{loading ? 'Видаляємо...' : 'Видалити акаунт'}</span>
    </button>
  );
}
