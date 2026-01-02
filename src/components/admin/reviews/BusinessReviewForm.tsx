import React, { useState } from 'react';

import { BusinessReviewStatus } from '@/types/enums';

import {
  BUSINESS_REVIEW_STATUS,
  BUSINESS_REVIEW_STATUS_LABELS,
} from '@/const/review';

import { useUpdateReviewStatus } from '@/hooks/useReviews';

import CustomSelect from '@/components//ui/custom-ui/CustomSelect';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';
import { Label } from '@/components/ui/label';

interface BusinessReviewFormProps {
  businessId: string;
  currentStatus: string;
  reviewId: string;
  className?: string;
}

function BusinessReviewForm({
  // businessId,
  currentStatus,
  reviewId,
  className = 'w-full',
}: BusinessReviewFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const updateReviewStatus = useUpdateReviewStatus();

  const handleStatusChange = async () => {
    setStatus(newStatus);

    try {
      await updateReviewStatus.mutateAsync({
        reviewId,
        status: newStatus as BusinessReviewStatus,
      });
      setNewStatus('');
      CustomToast({
        type: 'success',
        content: (
          <>
            <p className="font-semibold">Статус відгуку оновлено успішно</p>
          </>
        ),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      setStatus(currentStatus); // rollback on error
    }
  };
  return (
    <>
      <Label htmlFor="review-status-select" className="sr-only">
        змінити статус відгуку:
      </Label>
      <CustomSelect
        id="review-status-select"
        value={status}
        onChange={(newValue) => {
          setNewStatus(newValue);
          setDialogOpen(true);
        }}
        options={BUSINESS_REVIEW_STATUS}
        getOptionValue={(s) => s}
        getOptionLabel={(s) => BUSINESS_REVIEW_STATUS_LABELS[s]}
        placeholder="Оберіть статус"
        className={className}
        statusForm={true}
      />
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Ви впевнені, що хочете змінити статус відгуку "${BUSINESS_REVIEW_STATUS_LABELS[status]}" на "${BUSINESS_REVIEW_STATUS_LABELS[newStatus]}"?`}
        description="Зміна статусу відгуку вплине на його видимість на платформі."
        actionContent="Змінити"
        cancelText="Скасувати"
        classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => handleStatusChange()}
        //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
      />
    </>
  );
}

export default BusinessReviewForm;
