'use client';
import React, { useId } from 'react';

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
  id,
}: CustomSelectProps<T>) {
  let triggerClass = '';
  if (statusForm) {
    switch (value as string) {
      case 'pending':
        triggerClass = 'bg-yellow-200 text-yellow-900';
        break;
      case 'approved':
        triggerClass = 'bg-green-200 text-green-900';
        break;
      case 'hidden':
        triggerClass = 'bg-gray-200 text-gray-900';
        break;
      case 'rejected':
        triggerClass = 'bg-red-200 text-red-900';
        break;
      default:
        triggerClass = 'bg-white text-black';
    }
  }

  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <>
      {label && (
        <label
          htmlFor={selectId}
          className="xl:placeholder-base lg:placeholder-sm placeholder-xs mb-1 block font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <Select value={value} onValueChange={(v) => onChange(v)}>
        <SelectTrigger
          id={selectId}
          className={`${className ?? 'xl:placeholder-base lg:placeholder-sm placeholder-xs w-[280px]'} ${triggerClass}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => {
              const val = getOptionValue
                ? getOptionValue(option)
                : (option as unknown as string);
              const label = getOptionLabel
                ? getOptionLabel(option)
                : (option as unknown as string);
              return (
                <SelectItem key={val ?? index} value={val ?? ''}>
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
