'use client';

import { ClientPortalFigmaStatusTabBar } from './ClientPortalFigmaStatusTabBar';

export type MyBookingStatusFilter =
  | 'all'
  | 'confirmed'
  | 'awaiting-payment'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

const TAB_ITEMS: Array<{ id: MyBookingStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'awaiting-payment', label: 'Awaiting Payment' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export type ClientPortalMyBookingsStatusTabBarProps = {
  filter: MyBookingStatusFilter;
  onFilterChange: (id: MyBookingStatusFilter) => void;
  className?: string;
};

export function ClientPortalMyBookingsStatusTabBar({
  filter,
  onFilterChange,
  className,
}: ClientPortalMyBookingsStatusTabBarProps) {
  return (
    <ClientPortalFigmaStatusTabBar
      tabs={TAB_ITEMS}
      value={filter}
      onChange={onFilterChange}
      ariaLabel="Filter bookings by status"
      className={className}
    />
  );
}
