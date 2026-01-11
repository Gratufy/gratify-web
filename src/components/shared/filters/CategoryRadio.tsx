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
        'chip',
        checked && 'chip-checked',

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
        aria-checked={checked}
      />
      {children}
    </label>
  );
}

export default CategoryRadio;
