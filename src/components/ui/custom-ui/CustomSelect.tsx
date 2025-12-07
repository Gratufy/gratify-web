'use client';
import React, { useId } from 'react';
import {
  getBusinessStatusBgColor,
  getBusinessStatusCardBgColor,
} from '@/lib/helpers/getBusinessStatusColorBg';
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
    triggerClass = getBusinessStatusBgColor(value as string) || '';
    console.log('triggerClass', triggerClass);
  }

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
      <Select value={value} onValueChange={(v) => onChange(v)}>
        <SelectTrigger
          id={selectId}
          className={`${className ?? 'xl:placeholder-base lg:placeholder-sm placeholder-sm w-[280px]'} ${triggerClass}`}
        >
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
                  className="xl:placeholder-base placeholder-sm px-4"
                >
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
