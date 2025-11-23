'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import CheckIcon from '@/assets/icons/general/icon-check.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import { cn } from '@/lib/utils';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'data-[state=checked]:bg-icons-main-700 data-[state=unchecked]:bg-icons-main-600 focus-visible:border-icons-main-600 focus-visible:icons-main-600 dark:data-[state=unchecked]:bg-icons-main-600 shadow-xs w-13 border-icons-main-600 peer inline-flex h-7 shrink-0 cursor-pointer items-center rounded-lg border outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 xl:h-8',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background data-[state=checked]:bg-icons-main-100 dark:data-[state=checked]:bg-icons-main-100 pointer-events-none flex h-[23px] w-[25px] items-center justify-center ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-1px)] data-[state=unchecked]:translate-x-[3px] data-[state=checked]:rounded-r-md data-[state=unchecked]:rounded-l-md dark:data-[state=unchecked]:bg-white'
        )}
      >
        {props.checked ? (
          <CheckIcon className="size-3 xl:size-4" />
        ) : (
          <CrossIcon className="size-3 xl:size-4" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
