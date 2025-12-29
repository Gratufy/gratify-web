'use client';
import React, { useState } from 'react';

import { BusinessReviewStatus } from '@/types/enums';

import { useBusinessReviews, useDeleteReview } from '@/hooks/useReviews';

import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import BusinessReviewForm from '@/components/admin/reviews/BusinessReviewForm';
import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';

interface AdminReviewListProps {
  businessId: string;
  currentStatus: BusinessReviewStatus;
}
function AdminReviewList({ businessId, currentStatus }: AdminReviewListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    error,
  } = useBusinessReviews(businessId, 'admin', currentStatus);
  const deleteReviewMutation = useDeleteReview(businessId);

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await deleteReviewMutation.mutateAsync(reviewId);
      if (res.success) {
        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">Відгук успішно видалено.</p>
            </>
          ),
        });
      } // alert('Review deleted successfully!'}
    } catch (error) {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">Помилка при видаленні відгука</p>
          </>
        ),
      });
      console.error('Error deleting review:', error);
    }
  };
  return (
    <>
      {isReviewsLoading && <AdminSkeleton count={2} />}
      {error && (
        <div className="placeholder-sm xl:placeholder-base text-center">
          Ошибка: {error?.message}
        </div>
      )}
      {reviews && !reviews.length && (
        <p>Ще нема відгуків зі статусом ${currentStatus}</p>
      )}
      {reviews && reviews.length > 0 && (
        <ul className="bg-background-main-100 flex flex-col gap-4 px-4 py-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="shadow-menu bg-text-50-grey flex flex-col gap-4 px-2 py-2 lg:grid lg:grid-cols-[0.5fr_3fr_1fr_0.5fr] lg:items-center lg:justify-center lg:gap-4"
            >
              <div className="lg:border-r-elements-grey-200 flex h-full items-center lg:border-r lg:pr-2">
                <p className="placeholder-sm xl:placeholder-base text-gray-600">
                  {r.createdAt?.toLocaleDateString()}
                </p>
              </div>

              <div className="lg:border-r-elements-grey-200 flex h-full items-center lg:border-r lg:pr-2">
                <p className="placeholder-sm xl:placeholder-base">{r.text}</p>
              </div>

              <div className="lg:border-r-elements-grey-200 flex h-full items-center lg:border-r lg:pr-4">
                <BusinessReviewForm
                  businessId={businessId}
                  reviewId={r.id}
                  currentStatus={currentStatus}
                  className="w-45"
                />
                <button
                  className="text-icons-color-error placeholder-sm xl:placeholder-base focus:bg-elements-grey-200/50 hover:bg-elements-grey-200/50 mx-auto flex cursor-pointer items-center justify-center border-none bg-transparent px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:focus:bg-transparent lg:hidden lg:px-2"
                  // onClick={() => handleDelete(r.id)}
                  disabled={deleteReviewMutation.isPending}
                  onClick={() => {
                    setDeleteReviewId(r.id);
                    setDialogOpen(true);
                  }}
                >
                  <IconRecycle className="text-icons-color-error size-4 xl:size-5" />
                </button>
              </div>

              <div className="hidden h-full items-center justify-center lg:flex">
                <button
                  className="text-icons-color-error placeholder-sm xl:placeholder-base focus:bg-elements-grey-200/50 hover:bg-elements-grey-200/50 mx-auto flex cursor-pointer items-center justify-center border-none bg-transparent px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:focus:bg-transparent lg:px-2"
                  // onClick={() => handleDelete(r.id)}
                  disabled={deleteReviewMutation.isPending}
                  onClick={() => {
                    setDeleteReviewId(r.id);
                    setDialogOpen(true);
                  }}
                >
                  <IconRecycle className="text-icons-color-error size-4 xl:size-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteReviewId && (
        <CustomAlertDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Ви впевнені, що хочете видалити цей відгук?"
          description="Цю дію не можна буде скасувати."
          actionContent="Видалити"
          cancelText="Скасувати"
          classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
          classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
          onAction={() => handleDelete(deleteReviewId)}
        />
      )}
    </>
  );
}

export default AdminReviewList;
