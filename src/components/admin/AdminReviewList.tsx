"use client";
import React from "react";
import BusinessReviewForm from "./BusinessReviewForm";
import { useBusinessReviews } from "@/hooks/useReviews";
import { BusinessReviewStatus } from "@/types";

interface AdminReviewListProps {
  businessId: string;
  currentStatus: BusinessReviewStatus;
}
function AdminReviewList({ businessId, currentStatus }: AdminReviewListProps) {
  const { data: reviews, isLoading } = useBusinessReviews(
    businessId,
    "admin",
    currentStatus
  );
  return (
    <div>
      <h2>Admin Review List</h2>
      <p>Here you can manage all business reviews.</p>
      {reviews && !reviews.length && <p>No reviews yet.</p>}
      {reviews?.map((r) => (
        <div
          key={r.id}
          className="border-b py-2 flex gap-8 items-center justify-center"
        >
          <p className="text-sm text-gray-600 flex-1/4">
            {r.createdAt?.toLocaleDateString()}
          </p>
          <p className="flex-1/4">{r.text}</p>
          <BusinessReviewForm
            businessId={businessId}
            reviewId={r.id}
            currentStatus={currentStatus}
          />
        </div>
      ))}
    </div>
  );
}

export default AdminReviewList;
