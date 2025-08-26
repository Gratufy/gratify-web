"use client";
import React from "react";
import BusinessReviewForm from "./BusinessReviewForm";
import { useBusinessReviews, useDeleteReview } from "@/hooks/useReviews";
import { BusinessReviewStatus } from "@/types";

interface AdminReviewListProps {
  businessId: string;
  currentStatus: BusinessReviewStatus;
}
function AdminReviewList({ businessId, currentStatus }: AdminReviewListProps) {
  const { data: reviews, isLoading: isReviewsLoading } = useBusinessReviews(
    businessId,
    "admin",
    currentStatus
  );
  const deleteReviewMutation = useDeleteReview(businessId);

  const handleDelete = async (reviewId: string) => {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;
    await deleteReviewMutation.mutateAsync(reviewId);
    alert("Review deleted successfully!");
  };
  return (
    <>
      {isReviewsLoading && <p>Loading reviews...</p>}
      {reviews && !reviews.length && <p>No reviews yet.</p>}
      {reviews && reviews.length > 0 && (
        <ul>
          {reviews.map((r) => (
            <li
              key={r.id}
              className="border-b py-2 flex gap-8 items-center justify-center"
            >
              <p className="text-sm text-gray-600 flex-1/6">
                {r.createdAt?.toLocaleDateString()}
              </p>
              <p className="flex-1/6">{r.text}</p>
              <BusinessReviewForm
                businessId={businessId}
                reviewId={r.id}
                currentStatus={currentStatus}
              />
              <button
                className="border rounded-3xl border-red-500 cursor-pointer px-4 py-2 flex items-center justify-center"
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default AdminReviewList;
