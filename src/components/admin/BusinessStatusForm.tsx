import { useState } from 'react';
import { BUSINESS_STATUS } from '@/const/business';
import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { useUpdateBusiness } from '@/hooks/useBusinesses';
import { BusinessStatus } from '@/types';

interface BusinessStatusFormProps {
  businessId: string;
  currentStatus: string;
}

export function BusinessStatusForm({
  businessId,
  currentStatus,
}: BusinessStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const mutation = useUpdateBusiness();

  const handleChange = async (newStatus: string) => {
    const confirmed = confirm(
      `Ви впевнені, що хочете змінити статус ${status} на ${newStatus}?`
    );
    if (!confirmed) {
      setStatus(currentStatus);
      return;
    }
    const statusValue = newStatus as BusinessStatus;
    setStatus(newStatus); // locally update status for UI
    try {
      await mutation.mutateAsync({
        id: businessId,
        values: { status: statusValue },
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      setStatus(currentStatus); // rollback on error
    }
  };

  return (
    <CustomSelect
      value={status}
      onChange={handleChange}
      options={BUSINESS_STATUS}
      getOptionValue={(s) => s}
      getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
      placeholder="Оберіть статус"
      className="w-36"
      statusForm={true}
    />
  );
}
