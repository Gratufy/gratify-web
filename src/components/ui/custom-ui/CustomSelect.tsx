'use client';
import React, { useId } from 'react';
import { getBusinessStatusBgColor } from '@/lib/helpers/getBusinessStatusColorBg';
import EyeIcon from '@/assets/icons/admin/icon-eye.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import { CheckIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CustomSelectProps<T> {
  value: string | undefined;
  onChange: (val: string) => void;

  options: T[];
  label?: string;
  error?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
  placeholder?: string;
  className?: string;
  statusForm?: boolean;
  id?: string;
  owner?: boolean;
  size?: 'sm' | 'default';
}
function CustomSelect<T>({
  value,
  onChange,
  options,
  label,
  getOptionLabel,
  getOptionValue,
  placeholder = 'Оберіть...',
  className,
  statusForm = false,
  id, //name aria
  owner = false,
  size = 'default',
}: CustomSelectProps<T>) {
  let triggerClass = '';
  if (statusForm) {
    triggerClass =
      //+ 'h-5!'
      getBusinessStatusBgColor(value as string) + ' ' || '';
  }
  const statusIcon = (value: string) =>
    value === 'approved' ? (
      <CheckIcon className="size-4" />
    ) : value === 'pending' ? (
      <IconModering className="size-4" />
    ) : value === 'rejected' ? (
      <CrossIcon className="size-4" />
    ) : (
      <EyeIcon className="size-4" />
    );
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <>
      {label && (
        <label
          htmlFor={selectId}
          className="xl:placeholder-base placeholder-sm mb-1 block font-medium"
        >
          {label}
        </label>
      )}
      {/* name={selectId} */}
      <Select value={value} onValueChange={(v) => onChange(v)} name={selectId}>
        <SelectTrigger
          size={size}
          aria-labelledby={selectId}
          id={selectId}
          className={`${className ?? 'xl:placeholder-base lg:placeholder-sm placeholder-sm w-[280px]'} ${triggerClass}`}
        >
          {/* {statusForm && statusIcon(value as string)} */}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="py-2">
          <SelectGroup>
            {options.map((option, index) => {
              const val = getOptionValue
                ? getOptionValue(option)
                : (option as unknown as string);
              const label = getOptionLabel
                ? getOptionLabel(option)
                : (option as unknown as string);
              return (
                <SelectItem
                  key={val ?? index}
                  value={val ?? ''}
                  className={`xl:placeholder-base placeholder-sm ${statusForm && getBusinessStatusBgColor(val as string)}`}
                >
                  {statusForm && !owner && statusIcon(val as string)}
                  {owner && (
                    <span className="placeholder-xs xl:placeholder-sm">
                      Статус
                    </span>
                  )}
                  {label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export default CustomSelect;
