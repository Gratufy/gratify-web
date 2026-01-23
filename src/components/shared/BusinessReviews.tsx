'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useUserStore } from '@/stores/useUserStore';
import {
  useBusinessReviews,
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from '@/hooks/useReviews';

import IconUser from '@/assets/icons/general/icon-user.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import { Plus } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import ReviewsSkeleton from '@/components/shared/skeletons/ReviewsSkeleton';

interface BusinessReviewsProps {
  businessId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
  setActionContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setOnConfirm: React.Dispatch<React.SetStateAction<() => void>>;
}

export default function BusinessReviews({
  businessId,

  setOpen,
  isLoggedIn,
  setAlertTitle,
  setActionContent,
  setOnConfirm,
}: BusinessReviewsProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.profile);
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useBusinessReviews(
    businessId,
    'public'
    // 'approved'
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
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
      setActionContent(
        <>
          <IconUser className="mr-2 inline size-4 xl:size-5" />
          Вхід
        </>
      );
      setOnConfirm(() => () => router.push('/login'));
      setOpen(true);
      return;
    }
    if (!newText.trim()) return;
    await createReviewMutation.mutateAsync({ businessId, text: newText });
    setNewText('');
    CustomToast({
      type: 'success',
      content: (
        <>
          <p className="font-semibold">Дякуємо за ваш відгук!</p>
          <p>Після проходження модерації він буде опублікований на сайті.</p>
        </>
      ),
    });
  };

  const handleEdit = async (reviewId: string) => {
    if (!editingText.trim()) return;
    await updateReview.mutateAsync({ reviewId, text: editingText });
    setEditingId(null);
    setEditingText('');
    CustomToast({
      type: 'success',
      content: (
        <>
          <p className="font-semibold">Дякуємо за ваш відгук!</p>
          <p>Після проходження модерації він буде опублікований на сайті.</p>
        </>
      ),
    });
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      CustomToast({
        type: 'success',
        content: (
          <>
            <p className="font-semibold">Відгук успішно видалено!</p>
          </>
        ),
      });
    } catch (error) {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">Помилка при видаленні категорії</p>
          </>
        ),
      });
      console.error('Error deleting category:', error);
    }
  };

  return (
    <>
      <h3 className="title-h3 mb-4 text-center lg:mb-5">
        Відгуки ({reviews?.length || 0})
      </h3>
      {isLoading && <ReviewsSkeleton count={3} />}
      {isError && (
        <p className="text-icons-color-error placeholder-sm xl:placeholder-base text-center">
          {error?.message}
        </p>
      )}
      {/* -------------------------------------------- */}

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
                            aria-label="Видалити відгук"
                            aria-haspopup="dialog"
                            className="btn-custom text-icons-color-error border-none p-1"
                            onClick={() => {
                              setDeleteReviewId(r.id);
                              setDialogOpen(true);
                            }}
                            disabled={deleteReviewMutation.isPending}
                          >
                            <IconRecycle
                              className="size-5 xl:size-6"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            aria-label="Редагувати відгук"
                            onClick={() => {
                              setEditingId(r.id);
                              setEditingText(r.text);
                            }}
                            className="btn-custom border-none p-1"
                          >
                            <EditPen
                              className="size-5 xl:size-6"
                              aria-hidden="true"
                            />
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
                      <Label
                        htmlFor={`edit-review-${r.id}`}
                        className="sr-only"
                      >
                        Редагувати ваш відгук про цей бізнес
                      </Label>
                      <p id={`review-edit-help-${r.id}`} className="sr-only">
                        Редагувати ваш відгук про цей бізнес
                      </p>
                      <textarea
                        aria-describedby={`review-edit-help-${r.id}`}
                        id={`edit-review-${r.id}`}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="bg-button-white border-elements-grey-950 xl:placeholder-base placeholder-sm focus:outline-elements-grey-950 mb-5 h-32 w-full border-[0.5px] p-1"
                      />
                      <div className="flex items-center justify-center gap-7">
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn-reject"
                        >
                          Скасувати
                        </button>
                        <button
                          disabled={updateReview.isPending}
                          className="btn-aprove"
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
          <Label htmlFor="create-review" className="title-h4 text-center">
            Додати відгук
          </Label>
        </div>

        <div className="lg:pr-15 flex-1">
          {/* <p className="placeholder-sm xl:placeholder-base mb-2 font-medium lg:mt-1 lg:hidden">
            Відгук
          </p> */}
          <p id="review-help" className="sr-only">
            Напишіть ваш відгук про цей бізнес
          </p>
          <textarea
            id="create-review"
            aria-describedby="review-help"
            placeholder="Поділіться враженням..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="bg-button-white placeholder-sm xl:placeholder-base border-elements-grey-950 placeholder:placeholder-sm xl:placeholder:placeholder-base placeholder:text-text-500-grey focus:outline-elements-grey-950 mb-6 h-14 w-full border-[0.5px] px-3 py-1 lg:h-20"
          />
          <button
            onClick={handleAdd}
            disabled={createReviewMutation.isPending || newText.trim() === ''}
            className="btn-aprove lg:w-30"
          >
            <Plus className="mr-[6px] size-3 font-medium" aria-hidden="true" />
            Додати
          </button>
        </div>
      </div>
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
