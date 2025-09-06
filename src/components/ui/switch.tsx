'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

import { cn } from '@/lib/utils';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'data-[state=checked]:bg-icons-main-600 data-[state=unchecked]:bg-icons-main-600 focus-visible:border-icons-main-600 focus-visible:icons-main-600 dark:data-[state=unchecked]:bg-icons-main-600 shadow-xs w-13 border-icons-main-600 peer inline-flex h-7 shrink-0 cursor-pointer items-center rounded-lg border outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background pointer-events-none flex size-6 items-center justify-center ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[3px] data-[state=checked]:rounded-r-lg data-[state=unchecked]:rounded-l-lg dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-white'
        )}
      >
        <CheckIcon className="size-3" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
