'use client';

import { cn } from '@/lib/utils';

export type ClientPortalFigmaStatusTabBarProps<T extends string> = {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  className?: string;
};

/**
 * Shared status filter tab row for client Figma shell views (My Bookings, My Requests, etc.).
 * Visual treatment matches design: `#F6F6F4` base, white pill + shadow for the active tab.
 */
export function ClientPortalFigmaStatusTabBar<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  className,
}: ClientPortalFigmaStatusTabBarProps<T>) {
  return (
    <div className={cn('bg-[#F6F6F4] rounded-xl p-2 sm:p-3', className)}>
      <div className="flex flex-wrap gap-2 pb-4" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => {
          const selected = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={cn(
                'font-avenir-regular rounded-lg px-4 py-2 text-sm font-semibold leading-5 transition-colors',
                selected
                  ? 'bg-white text-[#0B1D37] shadow-[0px_1px_3px_rgba(10,13,18,0.1)]'
                  : 'bg-transparent text-[#4B4E53] hover:text-[#0B1D37]',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
