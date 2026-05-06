'use client';

import { cn } from '@/lib/utils';

export type AdminPortalPaymentsFilterTab =
  | 'all'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'overdue'
  | 'refunded';

/** Filter labels for admin Payments — same pill chrome as Bookings / Requests. */
export const ADMIN_PORTAL_PAYMENTS_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalPaymentsFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'paid', label: 'Paid' },
  { id: 'failed', label: 'Failed' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'refunded', label: 'Refunded' },
];

export type AdminPortalPaymentsStatusPillsProps = {
  value: AdminPortalPaymentsFilterTab;
  onChange: (next: AdminPortalPaymentsFilterTab) => void;
  className?: string;
};

export function AdminPortalPaymentsStatusPills({ value, onChange, className }: AdminPortalPaymentsStatusPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filter payments by status">
      {ADMIN_PORTAL_PAYMENTS_TAB_ITEMS.map((tab) => {
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
