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

//import { ScrollArea } from '@/components/ui/scroll-area';
import ReviewsSkeleton from './skeletons/ReviewsSkeleton';

interface Props {
  businessId: string;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
}

export default function BusinessReviews({
  businessId,

  setOpen,
  isLoggedIn,
  setAlertTitle,
}: Props) {
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
    if (!isLoggedIn) {
      setAlertTitle('Для додавання відгука, авторизуйтесь будь ласка');
      setOpen(true);
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

  return (
    <>
      <h3 className="title-h3 mb-4 text-center lg:mb-5">
        Відгуки ({reviews?.length || 0})
      </h3>
      {isLoading && <ReviewsSkeleton count={3} />}
      {/* -------------------------------------------- */}
      {/* <ScrollArea className="h-[466px] w-full lg:h-[686px] xl:h-[518px]"> */}
      {/* Container with overflow-auto */}
      <div className="custom-scrollbar relative max-h-[466px] w-full overflow-y-auto lg:max-h-[686px] lg:pr-3 xl:max-h-[518px]">
        {reviews && reviews.length === 0 && (
          <p className="placeholder-sm xl:placeholder-base text-center">
            Ще немає відгуків. Будьте першим, хто залишить відгук!
          </p>
        )}
        {reviews && reviews.length > 0 && (
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 flex flex-col pb-7 pt-5 lg:flex-row">
        <div className="title-h4 mb-6 lg:mb-0 lg:mr-6">
          {' '}
          <h4 className="title-h4 text-center">Додати відгук</h4>
        </div>

        <div className="lg:pr-15 flex-1">
          {/* <p className="placeholder-sm xl:placeholder-base mb-2 font-medium lg:mt-1 lg:hidden">
            Відгук
          </p> */}

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
    </>
  );
}
