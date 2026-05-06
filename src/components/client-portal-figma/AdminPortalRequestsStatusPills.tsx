'use client';

import { cn } from '@/lib/utils';

export type AdminPortalRequestsFilterTab =
  | 'all'
  | 'new'
  | 'in-progress'
  | 'shortlisted'
  | 'confirmed'
  | 'cancelled'
  | 'expired';

/** Filter labels for admin Requests — pill row (navy selected, bordered inactive). */
export const ADMIN_PORTAL_REQUESTS_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalRequestsFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'expired', label: 'Expired' },
];

export type AdminPortalRequestsStatusPillsProps = {
  value: AdminPortalRequestsFilterTab;
  onChange: (next: AdminPortalRequestsFilterTab) => void;
  className?: string;
};

/**
 * Admin **Requests** status filters — navy active pill + white bordered inactive pills (brand tokens).
 * Reusable for any admin table that uses the same filter pattern.
 */
export function AdminPortalRequestsStatusPills({ value, onChange, className }: AdminPortalRequestsStatusPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filter requests by status">
      {ADMIN_PORTAL_REQUESTS_TAB_ITEMS.map((tab) => {
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
