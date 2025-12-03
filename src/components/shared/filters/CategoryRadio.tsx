import { cn } from '@/lib/utils';
import React from 'react';

type CategoryRadioProps = {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  groupName?: string;
};

function CategoryRadio({
  value,
  checked,
  onChange,
  children,
  className,
  groupName = 'category',
}: CategoryRadioProps) {
  return (
    <label
      className={cn(
        // 'flex cursor-pointer items-center transition',
        'chip',
        checked && 'chip-checked',
        // ? 'bg-elements-grey-200 border-elements-main-500 font-medium'
        // : 'bg-background-white border-elements-main-500',
        className
      )}
    >
      <input
        type="radio"
        name={groupName}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {children}
    </label>
  );
}

export default CategoryRadio;
