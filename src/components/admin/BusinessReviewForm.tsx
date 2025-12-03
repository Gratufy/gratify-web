import React, { useState } from 'react';
import CustomSelect from '../ui/custom-ui/CustomSelect';
import { BUSINESS_REVIEW_STATUS } from '@/const/review';
import { BusinessReviewStatus } from '@/types';
import { useUpdateReviewStatus } from '@/hooks/useReviews';

interface BusinessReviewFormProps {
  businessId: string;
  currentStatus: string;
  reviewId: string;
}

function BusinessReviewForm({
  businessId,
  currentStatus,
  reviewId,
}: BusinessReviewFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const updateReviewStatus = useUpdateReviewStatus();

  const handleStatusChange = async (newStatus: string) => {
    const confirmed = confirm(
      `Ви впевнені, що хочете змінити статус ${status} на ${newStatus}?`
    );
    if (!confirmed) {
      setStatus(currentStatus);
      return;
    }
    const statusValue = newStatus as BusinessReviewStatus;
    setStatus(newStatus);
    try {
      await updateReviewStatus.mutateAsync({
        reviewId,
        status: statusValue,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      setStatus(currentStatus); // rollback on error
    }
  };
  return (
    <CustomSelect
      value={status}
      onChange={handleStatusChange}
      options={BUSINESS_REVIEW_STATUS}
      getOptionValue={(s) => s}
      getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
      placeholder="Оберіть статус"
      className="w-36"
      statusForm={true}
    />
  );
}

export default BusinessReviewForm;
