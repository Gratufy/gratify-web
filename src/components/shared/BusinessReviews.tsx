'use client';
import React, { useState } from 'react';

import { useUserStore } from '@/stores/useUserStore';
import {
  useBusinessReviews,
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from '@/hooks/useReviews';

//import { Spinner } from '../ui/spinner';
import { Plus } from 'lucide-react';

import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import { ScrollArea } from '@/components/ui/scroll-area';
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
  // const [showReviews, setShowReviews] = useState(false);

  const createReviewMutation = useCreateReview();
  const deleteReviewMutation = useDeleteReview(businessId);
  const updateReview = useUpdateReview(businessId);

  const handleAdd = async () => {
    if (!user) {
      alert('Please log in to add a review');
      return;
    }
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
      <h3 className="title-h3 mb-4 text-center lg:mb-5">
        Відгуки ({reviews?.length || 0})
      </h3>
      {/* -------------------------------------------- */}
      <ScrollArea className="h-[466px] w-full lg:h-[686px] xl:h-[518px]">
        <ul className="bg-background-white mx-auto flex flex-col gap-5 px-2 py-3">
          {reviews?.map((r) => (
            <li
              key={r.id}
              className="border-elements-grey-950 lg:w-170 mx-auto w-full border-[0.5px]"
            >
              {user &&
                (user.userId === r.userId || user.role === 'ADMIN') &&
                editingId !== r.id && (
                  <div className="flex justify-between gap-4 px-2 py-2">
                    {user.userId === r.userId && (
                      <>
                        <button
                          className="bg-background-white flex cursor-pointer items-center justify-center rounded-full border-none p-1 hover:bg-gray-50"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="size-5 xl:size-6" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(r.id);
                            setEditingText(r.text);
                          }}
                          className="bg-background-white flex cursor-pointer items-center justify-center rounded-full border-none p-1 hover:bg-gray-50"
                        >
                          <EditPen className="size-5 xl:size-6" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              {(!user ||
                (user.userId !== r.userId && user.role !== 'ADMIN')) && (
                <div className="h-6 w-full"></div>
              )}
              {/* <p className="text-sm text-gray-600">{r.userId}</p> */}
              <div className="w-full">
                {editingId === r.id && (
                  <div className="p-6">
                    <textarea
                      name="review"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="border-elements-grey-200 xl:placeholder-base placeholder-sm mb-5 h-32 w-full border-[0.5px] p-1"
                    />
                    <div className="flex items-center justify-center gap-7">
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-background-white xl:placeholder-base placeholder-sm border-background-main-300 shadow-menu flex cursor-pointer items-center justify-center border px-3 py-[6px]"
                      >
                        Скасувати
                      </button>
                      <button
                        className="bg-background-main-300 xl:placeholder-base placeholder-sm border-background-main-300 shadow-menu flex cursor-pointer items-center justify-center border px-3 py-[6px]"
                        onClick={() => handleEdit(r.id)}
                      >
                        Зберегти
                      </button>
                    </div>
                  </div>
                )}
                {editingId != r.id && (
                  <div className="px-6 pb-6">
                    <p className="placeholder-sm xl:placeholder-base mb-5">
                      {r.text}
                    </p>
                    <div className="flex w-full items-center justify-between">
                      <p className="placeholder-sm semibold xl:placeholder-base">
                        {r.user?.name ?? 'Турист'}
                      </p>
                      <p className="placeholder-sm xl:placeholder-base">
                        {r.createdAt?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {/* <div className="mb-5 w-full">
                {editingId === r.id ? (
                  <>
                    <textarea
                      name="review"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="border-elements-grey-200 placeholder-sm mb-5 h-32 w-full border-[0.5px] p-1"
                    />
                    <div className="flex items-center justify-center gap-7">
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-background-white placeholder-sm border-background-main-300 shadow-menu flex cursor-pointer items-center justify-center border px-3 py-[6px]"
                      >
                        Скасувати
                      </button>
                      <button
                        className="bg-background-main-300 placeholder-sm border-background-main-300 shadow-menu flex cursor-pointer items-center justify-center border px-3 py-[6px]"
                        onClick={() => handleEdit(r.id)}
                      >
                        Зберегти
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="placeholder-sm">{r.text}</p>
                )}
              </div>
              {editingId != r.id && (
                <div className="flex w-full items-center justify-between">
                  <p className="placeholder-sm semibold">ВВЕСТИ ІМЯ</p>
                  <p className="placeholder-sm">
                    {r.createdAt?.toLocaleDateString()}
                  </p>
                </div>
              )} */}
                {/* {user &&
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
                  </div>
                )} */}
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <div className="mt-2 flex flex-col pb-7 pt-5 lg:flex-row">
        <div className="title-h4 mb-6 lg:mb-0 lg:mr-6">
          {' '}
          <h4 className="title-h4 text-center">Додати відгук</h4>
        </div>

        <div className="lg:pr-15 flex-1">
          <p className="placeholder-sm xl:placeholder-base mb-2 font-medium lg:mt-1 lg:hidden">
            Відгук
          </p>

          <textarea
            name="add_review"
            placeholder="Поділіться враженням..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="bg-background-white placeholder-sm xl:placeholder-base border-elements-grey-950 placeholder:placeholder-sm xl:placeholder:placeholder-base placeholder:text-text-500-grey mb-6 h-14 w-full border-[0.5px] px-3 py-1 lg:h-20"
          />
          <button
            onClick={handleAdd}
            className="shadow-menu placeholder-sm xl:placeholder-base border-background-main-300 bg-background-main-300 lg:w-30 flex w-full cursor-pointer items-center justify-center border px-3 py-[6px]"
          >
            <Plus className="mr-[6px] size-3 font-medium" />
            Додати
          </button>
        </div>
      </div>
      {/* {reviews && reviews.length > 0 && (
        <button
          className="btn-secondary flex cursor-pointer items-center justify-center rounded-3xl border border-black px-4 py-2"
          onClick={() => setShowReviews(!showReviews)}
        >
          {showReviews ? 'Hide Reviews' : 'Show Reviews'}
        </button>
      )} */}
      {/* {showReviews && reviews && !reviews.length && <p>No reviews yet.</p>} */}
      {/* {showReviews &&
        reviews?.map((r) => (
          <div key={r.id} className="border-b py-2">
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
      )} */}
    </>
  );
}
