'use client';

import { PanelLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ClientPortalMainTopBarProps = {
  className?: string;
  /** Shown in the avatar chip (e.g. user initials). */
  userInitials?: string;
  /** Called when the PanelLeft toggle button is clicked. */
  onToggleSidebar?: () => void;
};

/**
 * Main-column top chrome — sidebar control + account chip (Booking Hub client shell).
 */
export function ClientPortalMainTopBar({ className, userInitials = 'JD', onToggleSidebar }: ClientPortalMainTopBarProps) {
  return (
    <div
      className={cn(
        'flex h-14 min-h-14 w-full shrink-0 items-center justify-between gap-4 bg-white px-6 sm:px-8',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-md text-[#535862] outline-none transition-colors',
          'hover:bg-[#fafafa] hover:text-[#0b1d37]',
          'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
        )}
      >
        <PanelLeft className="size-5 shrink-0" strokeWidth={1} aria-hidden />
      </button>
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(0,0,0,0.08)] bg-[#00BAB5]"
        aria-hidden
      >
        <span className="font-avenir-regular text-sm font-semibold leading-none text-white">{userInitials}</span>
      </div>
    </div>
  );
}
