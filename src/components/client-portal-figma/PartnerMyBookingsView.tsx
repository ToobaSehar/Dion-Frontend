'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Calendar, Users } from 'lucide-react';

import {
  PartnerBookingStatusBar,
  type PartnerMyBookingStatusFilter,
} from '@/components/client-portal-figma/PartnerBookingStatusBar';
import {
  bookingStatusPillClass,
  bookingStatusLabel,
  DEFAULT_PARTNER_BOOKINGS,
  type PartnerMyBookingRow,
} from '@/components/client-portal-figma/partnerBookingData';
import { cn } from '@/lib/utils';

function rowMatchesFilter(row: PartnerMyBookingRow, filter: PartnerMyBookingStatusFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'in-progress') {
    return row.status === 'in-progress' || row.status === 'checked-in';
  }
  return row.status === filter;
}

export type { PartnerMyBookingRow, PartnerMyBookingRowStatus } from '@/components/client-portal-figma/partnerBookingData';
export type { PartnerMyBookingStatusFilter } from '@/components/client-portal-figma/PartnerBookingStatusBar';

export type PartnerMyBookingsViewProps = {
  className?: string;
  items?: PartnerMyBookingRow[];
};

/**
 * Partner portal **My Bookings** — status bar + list; row navigates to `/partner/dashboard/bookings/[id]`.
 */
export function PartnerMyBookingsView({ className, items = DEFAULT_PARTNER_BOOKINGS }: PartnerMyBookingsViewProps) {
  const [filter, setFilter] = useState<PartnerMyBookingStatusFilter>('all');

  const visibleRows = useMemo(() => {
    return items.filter((r) => rowMatchesFilter(r, filter));
  }, [filter, items]);

  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <header className="space-y-1">
        <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
          My Bookings
        </h1>
        <p className="font-avenir-regular max-w-2xl text-base font-normal leading-6 text-[#717680]">
          View and manage your confirmed bookings.
        </p>
      </header>

      <PartnerBookingStatusBar value={filter} onChange={setFilter} />

      <ul className="flex flex-col gap-3" role="list" aria-label="Your bookings">
        {visibleRows.map((row) => (
          <li key={row.id}>
            <Link
              href={`/partner/dashboard/bookings/${row.id}`}
              className={cn(
                'flex flex-col gap-4 rounded-[12px] border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] transition-shadow sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-5',
                'hover:shadow-[0px_4px_12px_rgba(10,13,18,0.06)]',
                'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2',
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#535862]"
                  aria-hidden
                >
                  <Calendar className="size-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">{row.bookingId}</p>
                  <div
                    className="font-avenir-regular flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-normal leading-5 text-[#717680]"
                    role="group"
                    aria-label="Property, dates, and guests"
                  >
                    <span className="min-w-0 shrink">{row.propertyName}</span>
                    <span className="shrink-0 whitespace-nowrap">{row.dateRange}</span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                      <Users className="size-4 shrink-0 text-[#718096]" strokeWidth={2} aria-hidden />
                      {row.guests}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-row flex-nowrap items-center justify-end gap-4">
                <p className="font-avenir-regular text-lg font-semibold leading-7 text-[#0B1D37]">{row.priceFormatted}</p>
                <span
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    bookingStatusPillClass(row.status),
                  )}
                >
                  {bookingStatusLabel(row.status)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {visibleRows.length === 0 ? (
        <p className="font-avenir-regular text-center text-sm text-[#717680]">No bookings in this category.</p>
      ) : null}
    </div>
  );
}
