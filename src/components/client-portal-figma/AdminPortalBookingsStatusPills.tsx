'use client';

import { cn } from '@/lib/utils';

export type AdminPortalBookingsFilterTab =
  | 'all'
  | 'awaiting-payment'
  | 'confirmed'
  | 'checked-in'
  | 'completed'
  | 'cancelled';

/** Filter labels for admin Bookings — same pill chrome as Requests (`AdminPortalRequestsStatusPills`). */
export const ADMIN_PORTAL_BOOKINGS_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalBookingsFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'awaiting-payment', label: 'Awaiting Payment' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'checked-in', label: 'Checked In' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export type AdminPortalBookingsStatusPillsProps = {
  value: AdminPortalBookingsFilterTab;
  onChange: (next: AdminPortalBookingsFilterTab) => void;
  className?: string;
};

export function AdminPortalBookingsStatusPills({ value, onChange, className }: AdminPortalBookingsStatusPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filter bookings by status">
      {ADMIN_PORTAL_BOOKINGS_TAB_ITEMS.map((tab) => {
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
