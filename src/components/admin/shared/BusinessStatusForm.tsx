import { useState } from 'react';

import { BusinessStatus } from '@/types';

import { BUSINESS_STATUS, BUSINESS_STATUS_OWNER } from '@/const/business';
import { BUSINESS_STATUS_LABELS } from '@/const/business';

import { useAdminChangeBusinessStatus } from '@/hooks/admin/useAdminChangeStatus';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

interface BusinessStatusFormProps {
  businessId: string;
  currentStatus: string;
  owner?: boolean;
}

export function BusinessStatusForm({
  businessId,
  currentStatus,
  owner = false,
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
  const optionsStatus = owner ? BUSINESS_STATUS_OWNER : BUSINESS_STATUS;
  return (
    <>
      <CustomSelect
        value={status}
        onChange={(newValue) => {
          setNewStatus(newValue);
          setDialogOpen(true);
        }}
        // options={BUSINESS_STATUS}
        options={optionsStatus}
        getOptionValue={(s) => s}
        // getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
        getOptionLabel={(s) => BUSINESS_STATUS_LABELS[s]}
        placeholder="Оберіть статус"
        className="border-none px-1" //rounded-sm w-40
        statusForm={true}
        owner={owner}
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
