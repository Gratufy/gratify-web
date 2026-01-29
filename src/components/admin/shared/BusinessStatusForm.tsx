'use client';
import { useState } from 'react';

import { BusinessStatus } from '@/types/enums';

import { BUSINESS_STATUS, OWNER_ALLOWED_TRANSITIONS } from '@/const/business';
import { BUSINESS_STATUS_LABELS } from '@/const/business';

import { useChangeBusinessStatus } from '@/hooks/OwnerAndAdmin/useChangeBusinessStatus';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';
import { Label } from '@/components/ui/label';

function getOwnerOptions(currentStatus: BusinessStatus) {
  const allowedNextStatuses = OWNER_ALLOWED_TRANSITIONS[currentStatus] || [];

  //when no allowed next statuses, show only current status
  const statuses =
    allowedNextStatuses.length > 0
      ? [currentStatus, ...allowedNextStatuses]
      : [currentStatus];
  return statuses;
}
interface BusinessStatusFormProps {
  businessName: string;
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
  businessName,
}: BusinessStatusFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newStatus, setNewStatus] = useState<BusinessStatus | ''>('');

  const mutation = useChangeBusinessStatus();

  const handleChange = async () => {
    if (!newStatus) return;
    try {
      const res = await mutation.mutateAsync({
        id: businessId,
        status: newStatus as BusinessStatus,
      });
      if (res.success) {
        if (newStatus) {
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
      //setStatus(currentStatus); // rollback on error
    }
  };

  const optionsStatus = owner
    ? getOwnerOptions(currentStatus)
    : BUSINESS_STATUS;
  return (
    <>
      <Label
        htmlFor={`business-status-select-${businessId}`}
        className="sr-only"
      >
        змінити статус бізнесу {businessName}:
      </Label>
      <CustomSelect
        id={`business-status-select-${businessId}`}
        size={size}
        value={currentStatus}
        onChange={(newValue) => {
          setNewStatus(newValue as BusinessStatus);
          setDialogOpen(true);
        }}
        options={optionsStatus}
        getOptionValue={(s) => s}
        getOptionLabel={(s) => BUSINESS_STATUS_LABELS[s]}
        placeholder="Оберіть статус"
        className={`hover:ring-icons-main-500/80 focus-visible:ring-icons-main-500/80 rounded-sm border-none px-1 outline-none ${className}`} //rounded-sm w-40
        statusForm={true}
        owner={owner}
      />
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Ви впевнені, що хочете змінити статус "${BUSINESS_STATUS_LABELS[currentStatus]}" на "${BUSINESS_STATUS_LABELS[newStatus]}"?`}
        description="Зміна статусу бізнесу вплине на його видимість на платформі."
        actionContent="Змінити"
        cancelText="Скасувати"
        classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => handleChange()}
      />
    </>
  );
}
