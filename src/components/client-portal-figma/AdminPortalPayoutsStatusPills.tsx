'use client';

import { cn } from '@/lib/utils';

export type AdminPortalPayoutsFilterTab =
  | 'all'
  | 'held'
  | 'scheduled'
  | 'on-hold'
  | 'released'
  | 'failed'
  | 'blocked';

export const ADMIN_PORTAL_PAYOUTS_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalPayoutsFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'held', label: 'Held' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'on-hold', label: 'On Hold' },
  { id: 'released', label: 'Released' },
  { id: 'failed', label: 'Failed' },
  { id: 'blocked', label: 'Blocked' },
];

export type AdminPortalPayoutsStatusPillsProps = {
  value: AdminPortalPayoutsFilterTab;
  onChange: (next: AdminPortalPayoutsFilterTab) => void;
  className?: string;
};

export function AdminPortalPayoutsStatusPills({ value, onChange, className }: AdminPortalPayoutsStatusPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filter payouts by status">
      {ADMIN_PORTAL_PAYOUTS_TAB_ITEMS.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'font-avenir-regular rounded-full px-4 py-2 text-sm font-semibold leading-5 transition-colors',
              selected
                ? 'bg-[#0B1D37] text-white shadow-sm'
                : 'border border-solid border-[#e9eaeb] bg-white text-[#0B1D37] hover:bg-[#F6F6F4]',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
