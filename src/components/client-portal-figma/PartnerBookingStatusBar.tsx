'use client';

import { ClientPortalFigmaStatusTabBar } from '@/components/client-portal-figma/ClientPortalFigmaStatusTabBar';

export type PartnerMyBookingStatusFilter = 'all' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export const PARTNER_BOOKING_STATUS_BAR_ITEMS: Array<{ id: PartnerMyBookingStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export type PartnerBookingStatusBarProps = {
  value: PartnerMyBookingStatusFilter;
  onChange: (next: PartnerMyBookingStatusFilter) => void;
  className?: string;
};

/**
 * Partner **My Bookings** status filter — same shell as My Offers (`ClientPortalFigmaStatusTabBar`).
 */
export function PartnerBookingStatusBar({ value, onChange, className }: PartnerBookingStatusBarProps) {
  return (
    <ClientPortalFigmaStatusTabBar
      tabs={PARTNER_BOOKING_STATUS_BAR_ITEMS}
      value={value}
      onChange={onChange}
      ariaLabel="Filter bookings by status"
      className={className}
    />
  );
}
