'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { useDeleteBusiness } from '@/hooks/useBusinesses';

import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

type Props = {
  id: string;
  className?: string;
  isAdmin: boolean;
  isOwner: boolean;
};

function DeleteEditBusinessBtns({ id, className, isAdmin, isOwner }: Props) {
  const pathname = usePathname();

  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/admin');

  const linkEdit = isDashboardPage
    ? `/dashboard/business/${id}/edit`
    : isAdminPage
      ? `/admin/business/${id}/edit`
      : '/';
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const deleteBusinessMutation = useDeleteBusiness();
  const handleDelete = async (businessId: string) => {
    await deleteBusinessMutation.mutateAsync(businessId);
    CustomToast({
      type: 'success',
      content: (
        <>
          <p className="font-semibold">Бізнес видалено</p>
        </>
      ),
    });
  };
  return (
    <div
      className={`max-[1024px]:max-w-150 flex w-full items-center justify-between px-4 lg:px-0 ${className}`}
    >
      {(isAdmin || isOwner) && (
        <>
          <button
            disabled={deleteBusinessMutation.isPending}
            onClick={() => {
              // router.push(`/dashboard/business/${id}/edit`);
              router.push(linkEdit);
            }}
            className="disabled:bg-background-main-300/50 shadow-menu bg-background-main-300 title-h6 flex cursor-pointer items-center px-3 py-[6px] disabled:cursor-not-allowed xl:px-5 xl:py-2"
          >
            <EditPen className="mr-[6px] size-6 lg:size-5 xl:mr-3" />{' '}
            <span>Внести зміни</span>
          </button>

          <button
            disabled={deleteBusinessMutation.isPending}
            className="text-text-warning bg-background-white disabled:bg-icons-grey-100/50 shadow-menu border-icons-color-error title-h6 flex cursor-pointer items-center border px-3 py-[6px] disabled:cursor-not-allowed xl:px-5 xl:py-2"
            onClick={() => setDialogOpen(true)}
          >
            <IconRecycle className="mr-[6px] size-6 lg:size-5" />
            <span>Видалити</span>
          </button>
        </>
      )}
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Ви впевнені, що хочете видалити?"
        description="Цю дію не можна буде скасувати."
        actionContent="Так, видалити"
        cancelText="Скасувати"
        classNameTitle="xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => handleDelete(id)}
        //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
      />
    </div>
  );
}

export default DeleteEditBusinessBtns;
