import { useState } from 'react';
import { BUSINESS_STATUS } from '@/const/business';
import { BUSINESS_STATUS_LABELS } from '@/const/business';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';

import { BusinessStatus } from '@/types';
import { useAdminChangeBusinessStatus } from '@/hooks/admin/useAdminChangeStatus';
import { CustomToast } from '../ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '../ui/custom-ui/CustomAlertDialog';

interface BusinessStatusFormProps {
  businessId: string;
  currentStatus: string;
}

export function BusinessStatusForm({
  businessId,
  currentStatus,
}: BusinessStatusFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [newStatus, setNewStatus] = useState('');
  // const mutation = useUpdateBusiness();
  const mutation = useAdminChangeBusinessStatus();

  const handleChange = async () => {
    setStatus(newStatus); // locally update status for UI
    try {
      await mutation.mutateAsync({
        id: businessId,
        status: newStatus as BusinessStatus,
      });
      setNewStatus('');
      CustomToast({
        type: 'success',
        content: (
          <>
            <p className="font-semibold">Статус бізнесу оновлено успішно</p>
          </>
        ),
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      setStatus(currentStatus); // rollback on error
    }
  };

  return (
    <>
      <CustomSelect
        value={status}
        onChange={(newValue) => {
          setNewStatus(newValue);
          setDialogOpen(true);
        }}
        options={BUSINESS_STATUS}
        getOptionValue={(s) => s}
        // getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
        getOptionLabel={(s) => BUSINESS_STATUS_LABELS[s]}
        placeholder="Оберіть статус"
        className="w-36"
        statusForm={true}
      />
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Ви впевнені, що хочете змінити статус ${BUSINESS_STATUS_LABELS[status]} на ${BUSINESS_STATUS_LABELS[newStatus]}?`}
        actionContent="Змінити"
        cancelText="Скасувати"
        classNameTitle="xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => handleChange()}
        //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
      />
    </>
  );
}
