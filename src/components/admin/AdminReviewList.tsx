'use client';
import React from 'react';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import BusinessReviewForm from './BusinessReviewForm';
import { useBusinessReviews, useDeleteReview } from '@/hooks/useReviews';
import { BusinessReviewStatus } from '@/types';

interface AdminReviewListProps {
  businessId: string;
  currentStatus: BusinessReviewStatus;
}
function AdminReviewList({ businessId, currentStatus }: AdminReviewListProps) {
  const { data: reviews, isLoading: isReviewsLoading } = useBusinessReviews(
    businessId,
    'admin',
    currentStatus
  );
  const deleteReviewMutation = useDeleteReview(businessId);

  const handleDelete = async (reviewId: string) => {
    const confirmed = confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;
    await deleteReviewMutation.mutateAsync(reviewId);
    alert('Review deleted successfully!');
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
                onClick={() => handleDelete(r.id)}
              >
                <IconRecycle className="text-icons-color-error mr-2 size-4 xl:mr-3 xl:size-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default AdminReviewList;
