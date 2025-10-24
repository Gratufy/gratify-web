'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import { useBusiness, useDeleteBusiness } from '@/hooks/useBusinesses';
import BackButton from '../ui/GoBackButton';
import Link from 'next/link';

type Props = {
  id: string;
  className?: string;
};

function DeleteEditBusinessBtns({ id, className }: Props) {
  const deleteBusinessMutation = useDeleteBusiness();
  const handleDelete = async (businessId: string) => {
    const confirmed = confirm('Are you sure you want to delete this business?');
    if (!confirmed) return;
    await deleteBusinessMutation.mutateAsync(businessId);
    alert('Business deleted successfully!');
  };
  return (
    <div
      className={`max-[1024px]:max-w-150 flex w-full items-center justify-between px-4 ${className}`}
    >
      <Link
        href={`/dashboard/business/${id}/edit`}
        className="shadow-menu bg-background-main-300 placeholder-sm flex cursor-pointer items-center px-3 py-[6px]"
      >
        <EditPen className="size-6 pr-[6px] xl:size-6" />{' '}
        <span>Внести зміни</span>
      </Link>
      <button
        className="text-text-warning bg-background-white shadow-menu border-icons-color-error placeholder-sm flex cursor-pointer items-center border px-3 py-[6px]"
        onClick={() => handleDelete(id)}
      >
        <Trash2 className="size-6 pr-[6px] xl:size-6" />
        <span>Видалити</span>
      </button>
    </div>
  );
}

export default DeleteEditBusinessBtns;
