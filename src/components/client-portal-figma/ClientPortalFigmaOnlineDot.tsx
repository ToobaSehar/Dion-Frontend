'use client';

import { cn } from '@/lib/utils';

/** Figma `Avatar online indicator` — success green + white ring. */
export function ClientPortalFigmaOnlineDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute bottom-[-1px] right-[-1px] size-2 rounded border-[1.5px] border-solid border-white bg-[#17b26a]',
        className,
      )}
      aria-hidden
    />
  );
}
