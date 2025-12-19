// NEW;
'use client';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useUserStore } from '@/stores/useUserStore';
import { createClient } from '@/utils/supabase/client';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';
import IconOut from '@/assets/icons/menu/icon-out.svg';

type LogoutBtnProps = {
  customClassName?: string;
};

const LogoutBtn = ({ customClassName }: LogoutBtnProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
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
    <>
      <button
        //onClick={handleLogout}
        onClick={() => setDialogOpen(true)}
        disabled={loading}
        className={
          customClassName
            ? customClassName
            : 'focus:bg-elements-grey-200 hover:bg-elements-grey-200 xl:placeholder-base flex w-full cursor-pointer items-center gap-2 rounded-sm border-none bg-white px-3 py-1.5 text-sm disabled:opacity-50 lg:px-2 xl:gap-3'
        }
      >
        <IconOut className="size-4 xl:size-5" />
        {loading ? 'Виходимо...' : 'Вихід'}
      </button>
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Ви впевнені, що хочете вийти з акаунту? "
        // description="Цю дію не можна буде скасувати."
        actionContent="Так, вийти"
        cancelText="Скасувати"
        classNameTitle="xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => {
          handleLogout();
        }}

        //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
      />
    </>

    /* I change it later for TOAST */
    /* {error && <p style={{ color: 'red' }}>{error}</p>} */
  );
};

export default LogoutBtn;
