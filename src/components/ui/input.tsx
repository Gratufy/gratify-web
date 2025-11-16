import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      style={{ fontFamily: 'var(--font-family)' }}
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:placeholder-sm placeholder:text-text-500-grey file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 shadow-xs xl:placeholder-base lg:placeholder-sm placeholder-sm flex h-9 w-full min-w-0 border-[0.5px] bg-transparent px-3 py-1 outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-elements-grey-400 focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
