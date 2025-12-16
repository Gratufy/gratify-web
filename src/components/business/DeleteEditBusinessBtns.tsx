'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { useDeleteBusiness } from '@/hooks/useBusinesses';

import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';
import { BusinessStatus } from '@/types';

type Props = {
  id: string;
  className?: string;
  isAdmin: boolean;
  isOwner: boolean;
  businessStatus: BusinessStatus;
};

function DeleteEditBusinessBtns({
  id,
  className,
  isAdmin,
  isOwner,
  businessStatus,
}: Props) {
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
            disabled={
              deleteBusinessMutation.isPending || businessStatus === 'pending'
            }
            onClick={() => {
              // router.push(`/dashboard/business/${id}/edit`);
              router.push(linkEdit);
            }}
            className="btn-aprove"
          >
            <EditPen className="size-6 lg:size-5" />
            <span>Внести зміни</span>
          </button>

          <button
            disabled={deleteBusinessMutation.isPending}
            className="btn-reject  text-text-warning    border-icons-color-error items-center border  "
            onClick={() => setDialogOpen(true)}
          >
            <IconRecycle className=" size-6 lg:size-5" />
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
