"use client";
import React, { useState } from "react";

import { useUserStore } from "@/stores/useUserStore";
import {
  useBusinessReviews,
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
  useUpdateReviewStatus,
} from "@/hooks/useReviews";

interface Props {
  businessId: string;
}

export default function BusinessStatusReviews({ businessId }: Props) {
  //   const queryClient = useQueryClient();
  const user = useUserStore((state) => state.profile);
  const { data: reviews, isLoading } = useBusinessReviews(businessId, "admin");

  const [newStatus, setNewStatus] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  const deleteReviewMutation = useDeleteReview(businessId);
  const updateStatusReview = useUpdateReviewStatus(businessId);

  // const handleEditStatus = async (reviewId: string) => {
  //   await updateStatusReview.mutateAsync({ reviewId, status: newStatus });
  // };

  const handleDelete = async (reviewId: string) => {
    await deleteReviewMutation.mutateAsync(reviewId);
  };
  if (isLoading) return <p>Loading reviews...</p>;
  return (
    <div className="mt-6 w-full max-w-2xl">
      <p className="text-2xl font-semibold mb-2">
        Reviews ({reviews?.length || 0})
      </p>
    </div>
  );
}
