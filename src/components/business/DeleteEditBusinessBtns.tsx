'use client';
import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import { useDeleteBusiness } from '@/hooks/useBusinesses';

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
      className={`max-[1024px]:max-w-150 flex w-full items-center justify-between px-4 lg:px-0 ${className}`}
    >
      <Link
        href={`/dashboard/business/${id}/edit`}
        className="shadow-menu bg-background-main-300 title-h6 flex cursor-pointer items-center px-3 py-[6px] xl:px-5 xl:py-2"
      >
        <EditPen className="mr-[6px] size-6 lg:size-5 xl:mr-3" />{' '}
        <span>Внести зміни</span>
      </Link>
      <button
        className="text-text-warning bg-background-white shadow-menu border-icons-color-error title-h6 flex cursor-pointer items-center border px-3 py-[6px] xl:px-5 xl:py-2"
        onClick={() => handleDelete(id)}
      >
        <Trash2 className="mr-[6px] size-6 lg:size-5" />
        <span>Видалити</span>
      </button>
    </div>
  );
}

export default DeleteEditBusinessBtns;
