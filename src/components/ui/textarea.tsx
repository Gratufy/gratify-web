import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      style={{ fontFamily: 'var(--font-family)' }}
      data-slot="textarea"
      className={cn(
        'border-elements-grey-400 placeholder:text-text-500-grey field-sizing-content shadow-xs placeholder:placeholder-sm xl:placeholder-base placeholder-sm flex min-h-16 w-full border-[0.5px] px-3 py-2 outline-none',
        'focus-visible:border-ring focus-visible:ring-icons-grey-300/50 transition-[color,box-shadow] focus-visible:ring-[2px]',
        'hover:ring-icons-grey-300/50 hover:ring-[2px]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
