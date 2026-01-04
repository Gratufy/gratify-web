'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores/useUserStore';

import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

export default function DeleteAccountButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const clear = useUserStore((s) => s.clear);
  const setError = useUserStore((s) => s.setError);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
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
    <>
      <button
        onClick={() => setDialogOpen(true)}
        disabled={loading}
        className="text-icons-color-error focus:bg-elements-grey-200 hover:bg-elements-grey-200 xl:placeholder-base flex w-full cursor-pointer items-center rounded-sm border-none bg-white px-3 py-1.5 text-sm disabled:opacity-50 lg:px-2"
      >
        <IconRecycle className="text-icons-color-error mr-2 size-4 xl:mr-3 xl:size-5" />
        <span>{loading ? 'Видаляємо...' : 'Видалити акаунт'}</span>
      </button>{' '}
      <CustomAlertDialog
        // forceMount
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        classNameContent="z-80"
        title="Ви впевнені, що хочете видалити акаунт? "
        description="Ця дія вплине на всі ваші дані"
        actionContent="Так, видалити"
        cancelText="Скасувати"
        classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => {
          handleDelete();
        }}
      />
    </>
  );
}
