'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { ClientPortalMyBookingsStatusTabBar, type MyBookingStatusFilter } from './ClientPortalMyBookingsStatusTabBar';
import { cn } from '@/lib/utils';

const BRAND = {
  ink: '#0B1D37',
  surface: '#F6F6F4',
  muted: '#4B4E53',
} as const;

/** Row status (includes `checked-in`, which has no matching filter tab — shown under All). */
export type ClientPortalMyBookingRowStatus =
  | 'checked-in'
  | 'confirmed'
  | 'awaiting-payment'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type ClientPortalMyBookingRow = {
  id: string;
  propertyName: string;
  bookingRef?: string;
  location: string;
  dateRange: string;
  priceFormatted: string;
  status: ClientPortalMyBookingRowStatus;
};

const MOCK_BOOKINGS: ClientPortalMyBookingRow[] = [
  {
    id: '1',
    propertyName: 'Victoria Apartments',
    location: 'Manchester',
    dateRange: '15 Jan – 15 Apr 2026',
    priceFormatted: '£9,600',
    status: 'checked-in',
  },
  {
    id: '2',
    propertyName: 'Station House',
    location: 'Birmingham',
    dateRange: '1 Feb – 16 Mar 2026',
    priceFormatted: '£3,600',
    status: 'checked-in',
  },
  {
    id: '3',
    propertyName: 'Canal View Suites',
    bookingRef: 'BH-2026-0041',
    location: 'Leeds',
    dateRange: '12 Mar – 12 May 2026',
    priceFormatted: '£9,600',
    status: 'confirmed',
  },
  {
    id: '4',
    propertyName: 'Harbour Studios',
    bookingRef: 'BH-2026-0039',
    location: 'Bristol',
    dateRange: '26 Mar – 26 Jun 2026',
    priceFormatted: '£7,200',
    status: 'confirmed',
  },
  {
    id: '5',
    propertyName: 'Queens Terrace',
    bookingRef: 'BH-2025-QT841',
    location: 'Coventry',
    dateRange: '1 Oct – 31 Dec 2025',
    priceFormatted: '£8,100',
    status: 'completed',
  },
];

function statusBadgeClass(status: ClientPortalMyBookingRowStatus): string {
  switch (status) {
    case 'checked-in':
      return 'bg-[#0B1D37] text-white';
    case 'confirmed':
      return 'bg-[#00BAB5] text-white';
    case 'completed':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
    case 'awaiting-payment':
      return 'bg-[#FDB022] text-white';
    case 'in-progress':
      return 'border-2 border-[#00BAB5] bg-white text-[#00BAB5]';
    case 'cancelled':
      return 'bg-[#f6f6f4] text-[#F04438]';
  }
}

function statusLabel(status: ClientPortalMyBookingRowStatus): string {
  switch (status) {
    case 'checked-in':
      return 'Checked In';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    case 'awaiting-payment':
      return 'Awaiting Payment';
    case 'in-progress':
      return 'In Progress';
    case 'cancelled':
      return 'Cancelled';
  }
}

export type ClientPortalMyBookingsViewProps = {
  className?: string;
  /** Booking badge targets (`/client/bookings/{id}` when opened from My Bookings). */
  bookingDetailHrefForRow?: (row: ClientPortalMyBookingRow) => string;
};

/**
 * **My Bookings** — client Figma shell list + filters (static data until API wiring).
 */
export function ClientPortalMyBookingsView({
  className,
  bookingDetailHrefForRow = (row) => `/client/bookings/${row.id}`,
}: ClientPortalMyBookingsViewProps) {
  const [filter, setFilter] = useState<MyBookingStatusFilter>('all');

  const visibleRows = useMemo(() => {
    if (filter === 'all') return MOCK_BOOKINGS;
    return MOCK_BOOKINGS.filter((r) => r.status === filter);
  }, [filter]);

  return (
    <div className={cn('flex w-full flex-col gap-8 bg-[#F6F6F4] px-6 pb-20 pt-2 sm:px-8 sm:pb-24', className)}>
      <div className="flex flex-col gap-2">
        <h1
          className="font-avenir-regular text-2xl font-semibold leading-8 sm:text-[30px] sm:leading-[38px]"
          style={{ color: BRAND.ink }}
        >
          My Bookings
        </h1>
        <p className="font-avenir-regular text-sm font-normal leading-5" style={{ color: BRAND.muted }}>
          View and manage your confirmed accommodation.
        </p>
      </div>

      <ClientPortalMyBookingsStatusTabBar filter={filter} onFilterChange={setFilter} />

      <ul className="flex flex-col gap-3 sm:gap-4" role="list" aria-label="Bookings">
        {visibleRows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-4 rounded-xl border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: BRAND.surface, color: BRAND.muted }}
              >
                <Calendar className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-avenir-regular text-base font-semibold leading-6" style={{ color: BRAND.ink }}>
                  {row.propertyName}
                </p>
                {row.bookingRef ? (
                  <p className="font-avenir-regular mt-0.5 text-sm font-normal leading-5" style={{ color: BRAND.muted }}>
                    {row.bookingRef}
                  </p>
                ) : null}
                <p className="font-avenir-regular mt-1 text-sm font-normal leading-5" style={{ color: BRAND.muted }}>
                  {row.location} · {row.dateRange} · {row.priceFormatted}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end sm:pl-4">
              {row.status === 'checked-in' ? (
                <Link
                  href={bookingDetailHrefForRow(row)}
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                    'cursor-pointer transition-colors duration-150 hover:bg-[#00BAB5] hover:text-white',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  {statusLabel(row.status)}
                </Link>
              ) : row.status === 'confirmed' ? (
                <Link
                  href={bookingDetailHrefForRow(row)}
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                    'cursor-pointer transition-opacity duration-150 hover:opacity-90',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  {statusLabel(row.status)}
                </Link>
              ) : row.status === 'completed' ? (
                <Link
                  href={bookingDetailHrefForRow(row)}
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                    'cursor-pointer transition-opacity duration-150 hover:opacity-90',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  {statusLabel(row.status)}
                </Link>
              ) : (
                <span
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                  )}
                >
                  {statusLabel(row.status)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {visibleRows.length === 0 ? (
        <p className="font-avenir-regular text-center text-sm" style={{ color: BRAND.muted }}>
          No bookings in this category.
        </p>
      ) : null}
    </div>
  );
}
