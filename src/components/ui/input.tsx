import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      style={{ fontFamily: 'var(--font-family)' }}
      type={type}
      data-slot="input"
      className={cn(
        'border-elements-grey-400 placeholder:placeholder-sm placeholder:text-text-500-grey file:text-foreground selection:bg-primary selection:text-primary-foreground bg-button-white shadow-xs xl:placeholder-base lg:placeholder-sm placeholder-sm flex h-9 w-full min-w-0 cursor-text border-[0.5px] px-3 py-1 outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-elements-grey-400 focus-visible:ring-icons-grey-300/50 focus-visible:ring-[2px]',
        'hover:ring-icons-grey-300/50 hover:ring-[2px]',
        'aria-invalid:ring-text-warning/20 dark:aria-invalid:ring-text-warning/40 aria-invalid:border-text-warning',
        className
      )}
      {...props}
    />
  );
}

export { Input };
