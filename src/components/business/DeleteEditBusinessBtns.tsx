'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import { useDeleteBusiness } from '@/hooks/useBusinesses';

type Props = {
  id: string;
  className?: string;
  isAdmin: boolean;
  isOwner: boolean;
};

function DeleteEditBusinessBtns({ id, className, isAdmin, isOwner }: Props) {
  const router = useRouter();
  const deleteBusinessMutation = useDeleteBusiness();
  const handleDelete = async (businessId: string) => {
    const confirmed = confirm('Are you sure you want to delete this business?');
    if (!confirmed) return;
    await deleteBusinessMutation.mutateAsync(businessId);
    alert('Business deleted successfully!');
  };
  return (
    <div
      className={`max-[1024px]:max-w-150 flex w-full items-center justify-between px-4 lg:px-0 ${className}`}
    >
      <button
        disabled={!isOwner}
        onClick={() => {
          router.push(`/dashboard/business/${id}/edit`);
        }}
        // href={`/dashboard/business/${id}/edit`}
        className="disabled:bg-background-main-300/50 shadow-menu bg-background-main-300 title-h6 flex cursor-pointer items-center px-3 py-[6px] disabled:cursor-not-allowed xl:px-5 xl:py-2"
      >
        <EditPen className="mr-[6px] size-6 lg:size-5 xl:mr-3" />{' '}
        <span>Внести зміни</span>
      </button>

      <button
        disabled={!(isAdmin || isOwner)}
        className="text-text-warning bg-background-white disabled:bg-icons-grey-100/50 shadow-menu border-icons-color-error title-h6 flex cursor-pointer items-center border px-3 py-[6px] disabled:cursor-not-allowed xl:px-5 xl:py-2"
        onClick={() => handleDelete(id)}
      >
        <Trash2 className="mr-[6px] size-6 lg:size-5" />
        <span>Видалити</span>
      </button>
    </div>
  );
}

export default DeleteEditBusinessBtns;
