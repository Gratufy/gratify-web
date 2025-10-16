'use client';
import React, { useState } from 'react';
import { Spinner } from '../ui/spinner';
import { useUserStore } from '@/stores/useUserStore';
import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import {
  useBusinessReviews,
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from '@/hooks/useReviews';
import ReviewsSkeleton from './skeletons/ReviewsSkeleton';

interface Props {
  businessId: string;
}

export default function BusinessReviews({ businessId }: Props) {
  //   const queryClient = useQueryClient();
  const user = useUserStore((state) => state.profile);
  const { data: reviews, isLoading } = useBusinessReviews(businessId, 'public');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showReviews, setShowReviews] = useState(false);

  const createReviewMutation = useCreateReview();
  const deleteReviewMutation = useDeleteReview(businessId);
  const updateReview = useUpdateReview(businessId);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await createReviewMutation.mutateAsync({ businessId, text: newText });
    setNewText('');
    alert('Review added successfully!');
  };

  const handleEdit = async (reviewId: string) => {
    if (!editingText.trim()) return;
    await updateReview.mutateAsync({ reviewId, text: editingText });
    setEditingId(null);
    setEditingText('');
    alert('Review updated successfully!');
  };

  const handleDelete = async (reviewId: string) => {
    const confirmed = confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;
    await deleteReviewMutation.mutateAsync(reviewId);
    alert('Review deleted successfully!');
  };
  // if (isLoading) return <p>Loading reviews...</p>;
  return (
    <>
      {isLoading && <ReviewsSkeleton count={3} />}
      <h3 className="title-h3 mb-4">Відгуки ({reviews?.length || 0})</h3>
      {/* -------------------------------------------- */}
      <ul className="bg-background-white flex flex-col gap-5 px-2 py-3">
        {reviews?.map((r) => (
          <li
            key={r.id}
            className="border-elements-grey-950 border-[0.5px] px-6 pb-6"
          >
            <div className="flex justify-between gap-4 px-2 pt-2">
              <Trash2 className="size-5" />
              <EditPen className="size-5" />
            </div>

            {/* <p className="text-sm text-gray-600">{r.userId}</p> */}
            <div className="mb-5 w-full">
              {editingId === r.id ? (
                <>
                  <textarea
                    name="review"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded border p-2"
                  />
                  <button
                    className="btn-primary flex cursor-pointer items-center justify-center rounded-3xl border border-black px-4 py-2"
                    onClick={() => handleEdit(r.id)}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary flex cursor-pointer items-center justify-center rounded-3xl border border-gray-800 px-4 py-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <p className="placeholder-sm">{r.text}</p>
              )}
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="placeholder-sm semibold">ВВЕСТИ ІМЯ</p>
              <p className="placeholder-sm">
                {r.createdAt?.toLocaleDateString()}
              </p>
            </div>
            {user &&
              (user.userId === r.userId || user.role === 'ADMIN') &&
              editingId !== r.id && (
                <div className="mt-1 flex justify-end gap-2">
                  {user.userId === r.userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(r.id);
                          setEditingText(r.text);
                        }}
                        className="flex cursor-pointer items-center justify-center rounded-3xl border border-green-700 px-4 py-2"
                      >
                        Edit
                      </button>
                      <button
                        className="flex cursor-pointer items-center justify-center rounded-3xl border border-red-500 px-4 py-2"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user.role === 'ADMIN' && (
                    <>{/* we can add a select for status change */}</>
                  )}
                </div>
              )}
          </li>
        ))}
      </ul>

      {/* {reviews && reviews.length > 0 && (
        <button
          className="btn-secondary flex cursor-pointer items-center justify-center rounded-3xl border border-black px-4 py-2"
          onClick={() => setShowReviews(!showReviews)}
        >
          {showReviews ? 'Hide Reviews' : 'Show Reviews'}
        </button>
      )} */}
      {/* {showReviews && reviews && !reviews.length && <p>No reviews yet.</p>} */}
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
                  name="review"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full rounded border p-2"
                />
                <button
                  className="btn-primary flex cursor-pointer items-center justify-center rounded-3xl border border-black px-4 py-2"
                  onClick={() => handleEdit(r.id)}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="btn-secondary flex cursor-pointer items-center justify-center rounded-3xl border border-gray-800 px-4 py-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <p>{r.text}</p>
            )}

            {user &&
              (user.userId === r.userId || user.role === 'ADMIN') &&
              editingId !== r.id && (
                <div className="mt-1 flex justify-end gap-2">
                  {user.userId === r.userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(r.id);
                          setEditingText(r.text);
                        }}
                        className="flex cursor-pointer items-center justify-center rounded-3xl border border-green-700 px-4 py-2"
                      >
                        Edit
                      </button>
                      <button
                        className="flex cursor-pointer items-center justify-center rounded-3xl border border-red-500 px-4 py-2"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user.role === 'ADMIN' && (
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
            className="mb-2 w-full rounded border p-2"
          />
          <button
            onClick={handleAdd}
            className="flex cursor-pointer items-center justify-center rounded-3xl border border-green-700 px-4 py-2"
          >
            Add Review
          </button>
        </div>
      )}
    </>
  );
}
