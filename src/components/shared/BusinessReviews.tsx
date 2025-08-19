"use client";
import React, { useState } from "react";

import { useUserStore } from "@/stores/useUserStore";
import {
  useBusinessReviews,
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from "@/hooks/useReviews";

interface Props {
  businessId: string;
}

export default function BusinessReviews({ businessId }: Props) {
  //   const queryClient = useQueryClient();
  const user = useUserStore((state) => state.profile);
  const { data: reviews, isLoading } = useBusinessReviews(businessId, "public");
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  const createReviewMutation = useCreateReview();
  const deleteReviewMutation = useDeleteReview(businessId);
  const updateReview = useUpdateReview(businessId);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await createReviewMutation.mutateAsync({ businessId, text: newText });
    setNewText("");
    alert("Review added successfully!");
  };

  const handleEdit = async (reviewId: string) => {
    if (!editingText.trim()) return;
    await updateReview.mutateAsync({ reviewId, text: editingText });
    setEditingId(null);
    setEditingText("");
    alert("Review updated successfully!");
  };

  const handleDelete = async (reviewId: string) => {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;
    await deleteReviewMutation.mutateAsync(reviewId);
    alert("Review deleted successfully!");
  };
  if (isLoading) return <p>Loading reviews...</p>;
  return (
    <div className="mt-6 w-full max-w-2xl">
      <p className="text-2xl font-semibold mb-2">
        Reviews ({reviews?.length || 0})
      </p>
      <button
        className="border rounded-3xl border-black btn-secondary cursor-pointer px-4 py-2 flex items-center justify-center"
        onClick={() => setShowReviews(!showReviews)}
      >
        {showReviews ? "Hide Reviews" : "Show Reviews"}
      </button>
      {showReviews && reviews && !reviews.length && <p>No reviews yet.</p>}
      {showReviews &&
        reviews?.map((r) => (
          <div key={r.id} className="border-b py-2">
            {/* <p className="text-sm text-gray-600">{r.userId}</p> */}
            <p className="text-sm text-gray-600">
              {r.createdAt?.toLocaleDateString()}
            </p>
            {editingId === r.id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full border rounded p-2"
                />
                <button
                  className="border rounded-3xl border-black btn-primary cursor-pointer px-4 py-2 flex items-center justify-center"
                  onClick={() => handleEdit(r.id)}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="border rounded-3xl border-gray-800 btn-secondary cursor-pointer px-4 py-2 flex items-center justify-center"
                >
                  Cancel
                </button>
              </>
            ) : (
              <p>{r.text}</p>
            )}

            {user &&
              (user.userId === r.userId || user.role === "ADMIN") &&
              editingId !== r.id && (
                <div className="mt-1 flex gap-2 justify-end">
                  {user.userId === r.userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(r.id);
                          setEditingText(r.text);
                        }}
                        className="border rounded-3xl border-green-700  cursor-pointer px-4 py-2 flex items-center justify-center"
                      >
                        Edit
                      </button>
                      <button
                        className="border rounded-3xl border-red-500 cursor-pointer px-4 py-2 flex items-center justify-center"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user.role === "ADMIN" && (
                    <>{/* we can add a select for status change */}</>
                  )}
                </div>
              )}
          </div>
        ))}

      {user && (
        <div className="mt-4">
          <textarea
            placeholder="Write your review..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full border rounded p-2 mb-2"
          />
          <button
            onClick={handleAdd}
            className="border rounded-3xl border-green-700  cursor-pointer px-4 py-2 flex items-center justify-center"
          >
            Add Review
          </button>
        </div>
      )}
    </div>
  );
}
