'use client';
import React, { useState } from 'react';

import { BusinessReviewStatus } from '@/types';

import { useBusinessReviews, useDeleteReview } from '@/hooks/useReviews';

import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import BusinessReviewForm from '@/components/admin/reviews/BusinessReviewForm';

interface AdminReviewListProps {
  businessId: string;
  currentStatus: BusinessReviewStatus;
}
function AdminReviewList({ businessId, currentStatus }: AdminReviewListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const { data: reviews, isLoading: isReviewsLoading } = useBusinessReviews(
    businessId,
    'admin',
    currentStatus
  );
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
      {isReviewsLoading && <p>Loading reviews...</p>}
      {reviews && !reviews.length && <p>No reviews yet.</p>}
      {reviews && reviews.length > 0 && (
        <ul className="flex flex-col gap-2">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="bg-text-50-grey grid grid-cols-[0.5fr_3fr_1fr_0.5fr] items-center justify-center gap-4 px-2 py-2"
            >
              <p className="flex-1/6 text-sm text-gray-600">
                {r.createdAt?.toLocaleDateString()}
              </p>
              <p className="flex-3/6">{r.text}</p>
              <BusinessReviewForm
                businessId={businessId}
                reviewId={r.id}
                currentStatus={currentStatus}
              />
              <button
                className="text-icons-color-error focus:bg-elements-grey-200 hover:bg-elements-grey-200 xl:placeholder-base mx-auto flex cursor-pointer items-center border-none bg-transparent px-3 py-1.5 text-sm disabled:opacity-50 lg:px-2"
                // onClick={() => handleDelete(r.id)}
                onClick={() => {
                  setDeleteReviewId(r.id);
                  setDialogOpen(true);
                }}
              >
                <IconRecycle className="text-icons-color-error mr-2 size-4 xl:mr-3 xl:size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {deleteReviewId && (
        <CustomAlertDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Ви впевнені, що хочете видалити цей відгук?"
          actionContent="Видалити"
          cancelText="Скасувати"
          classNameTitle="xl:placeholder-base! placeholder-sm! font-normal"
          classNameDescription="text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
          onAction={() => handleDelete(deleteReviewId)}
        />
      )}
    </>
  );
}

export default AdminReviewList;
