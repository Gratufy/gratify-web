import { useState } from 'react';

import { BusinessStatus } from '@/types';

import {
  BUSINESS_STATUS,
  BUSINESS_STATUS_OWNER,
  OWNER_ALLOWED_TRANSITIONS,
} from '@/const/business';
import { BUSINESS_STATUS_LABELS } from '@/const/business';

import { useChangeBusinessStatus } from '@/hooks/OwnerAndAdmin/useChangeBusinessStatus';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

function getOwnerOptions(currentStatus: BusinessStatus) {
  const allowedNextStatuses = OWNER_ALLOWED_TRANSITIONS[currentStatus] || [];
  // Если нет разрешённых переходов — оставляем текущий, чтобы Select не был пустым
  const statuses =
    allowedNextStatuses.length > 0
      ? [currentStatus, ...allowedNextStatuses]
      : [currentStatus];
  return statuses;
}
interface BusinessStatusFormProps {
  businessId: string;
  currentStatus: BusinessStatus;
  owner?: boolean;
  className?: string;
  size?: 'sm' | 'default';
}

export function BusinessStatusForm({
  businessId,
  currentStatus,
  owner = false,
  className,
  size = 'default',
}: BusinessStatusFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<BusinessStatus>(currentStatus);
  const [newStatus, setNewStatus] = useState<BusinessStatus | ''>('');
  // const mutation = useUpdateBusiness();
  const mutation = useChangeBusinessStatus();
  console.log(
    'BusinessStatusForm rendered with currentStatus:',
    currentStatus,
    'and status state:',
    status
  );
  const handleChange = async () => {
    try {
      const res = await mutation.mutateAsync({
        id: businessId,
        status: newStatus as BusinessStatus,
      });
      if (res.success) {
        if (newStatus) {
          // "" будет false
          setStatus(newStatus);
          setNewStatus('');
        }
        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">Статус бізнесу оновлено успішно</p>
            </>
          ),
        });
      } else {
        CustomToast({
          type: 'error',
          content: (
            <>
              <p className="font-semibold">{res.error}</p>
            </>
          ),
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setStatus(currentStatus); // rollback on error
    }
  };
  //const optionsStatus = owner ? BUSINESS_STATUS_OWNER : BUSINESS_STATUS;
  const optionsStatus = owner ? getOwnerOptions(status) : BUSINESS_STATUS;
  return (
    <>
      <CustomSelect
        size={size}
        value={status}
        onChange={(newValue) => {
          setNewStatus(newValue as BusinessStatus);
          setDialogOpen(true);
        }}
        // options={BUSINESS_STATUS}
        options={optionsStatus}
        getOptionValue={(s) => s}
        // getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
        getOptionLabel={(s) => BUSINESS_STATUS_LABELS[s]}
        placeholder="Оберіть статус"
        className={`border-none px-1 ${className}`} //rounded-sm w-40
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
