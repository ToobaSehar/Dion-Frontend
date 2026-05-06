'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { ClientPortalFigmaStatusTabBar } from './ClientPortalFigmaStatusTabBar';
import { cn } from '@/lib/utils';

const BRAND = {
  ink: '#0B1D37',
  teal: '#00BAB5',
  surface: '#F6F6F4',
  muted: '#4B4E53',
} as const;

export type MyRequestStatusFilter =
  | 'all'
  | 'submitted'
  | 'shortlist-ready'
  | 'confirmed'
  | 'closed'
  | 'cancelled';

type RequestRowStatus = Exclude<MyRequestStatusFilter, 'all'>;

export type ClientPortalMyRequestRow = {
  id: string;
  city: string;
  guests: number;
  dateLabel: string;
  submittedLabel: string;
  status: RequestRowStatus;
};

const TAB_ITEMS: Array<{ id: MyRequestStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'shortlist-ready', label: 'Shortlist Ready' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'closed', label: 'Closed' },
];

const MOCK_REQUESTS: ClientPortalMyRequestRow[] = [
  {
    id: '1',
    city: 'Bristol',
    guests: 6,
    dateLabel: '1 Apr – 30 Jun 2026',
    submittedLabel: 'Submitted 15 Feb',
    status: 'shortlist-ready',
  },
  {
    id: '2',
    city: 'Glasgow',
    guests: 10,
    dateLabel: '15 Apr – 15 Jul 2026',
    submittedLabel: 'Submitted 28 Feb 2026',
    status: 'submitted',
  },
  {
    id: '3',
    city: 'Manchester',
    guests: 5,
    dateLabel: '15 Jan – 15 Apr 2026',
    submittedLabel: 'Submitted 20 Dec 2025',
    status: 'confirmed',
  },
  {
    id: '4',
    city: 'Liverpool',
    guests: 2,
    dateLabel: '1 Mar – 1 Apr 2026',
    submittedLabel: 'Submitted 1 Feb 2026',
    status: 'cancelled',
  },
  {
    id: '5',
    city: 'Edinburgh',
    guests: 3,
    dateLabel: '1 Aug – 30 Nov 2026',
    submittedLabel: 'Submitted 12 Mar',
    status: 'closed',
  },
];

function statusBadgeClass(status: RequestRowStatus): string {
  switch (status) {
    case 'shortlist-ready':
      return 'bg-[#0B1D37] text-white';
    case 'submitted':
      return 'bg-[#E8A23E] text-white';
    case 'confirmed':
      return 'bg-[#00BAB5] text-white';
    case 'cancelled':
      return 'bg-[#F6F6F4] text-[#F04438]';
    case 'closed':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
  }
}

function statusLabel(status: RequestRowStatus): string {
  switch (status) {
    case 'shortlist-ready':
      return 'Shortlist Ready';
    case 'submitted':
      return 'Submitted';
    case 'confirmed':
      return 'Confirmed';
    case 'cancelled':
      return 'Cancelled';
    case 'closed':
      return 'Closed';
  }
}

export type ClientPortalMyRequestsViewProps = {
  className?: string;
  /** When set, primary “New Request” matches sidebar navigation to the new-request shell. */
  onNewRequest?: () => void;
  /**
   * Shortlist-ready badge destination — defaults to `/client/requests/{id}` (same route as dashboard **View options**).
   */
  resolveShortlistReadyHref?: (row: ClientPortalMyRequestRow) => string;
  /** Submitted badge → request detail (`/client/requests/{id}` by default). */
  resolveSubmittedHref?: (row: ClientPortalMyRequestRow) => string;
  /** Confirmed badge → request detail (`/client/requests/{id}` by default). */
  resolveConfirmedHref?: (row: ClientPortalMyRequestRow) => string;
  /** Cancelled badge → request detail (`/client/requests/{id}` by default). */
  resolveCancelledHref?: (row: ClientPortalMyRequestRow) => string;
};

/**
 * **My Requests** — client Figma shell list + filters (static data until API wiring).
 */
export function ClientPortalMyRequestsView({
  className,
  onNewRequest,
  resolveShortlistReadyHref = (row) => `/client/requests/${row.id}`,
  resolveSubmittedHref = (row) => `/client/requests/${row.id}`,
  resolveConfirmedHref = (row) => `/client/requests/${row.id}`,
  resolveCancelledHref = (row) => `/client/requests/${row.id}`,
}: ClientPortalMyRequestsViewProps) {
  const [filter, setFilter] = useState<MyRequestStatusFilter>('all');

  const visibleRows = useMemo(() => {
    if (filter === 'all') return MOCK_REQUESTS;
    return MOCK_REQUESTS.filter((r) => r.status === filter);
  }, [filter]);

  return (
    <div className={cn('flex w-full flex-col gap-8 bg-[#F6F6F4] px-6 pb-20 pt-2 sm:px-8 sm:pb-24', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1
            className="font-avenir-regular text-2xl font-semibold leading-8 sm:text-[30px] sm:leading-[38px]"
            style={{ color: BRAND.ink }}
          >
            My Requests
          </h1>
          <p className="font-avenir-regular text-sm font-normal leading-5" style={{ color: BRAND.muted }}>
            Track and manage your accommodation requests.
          </p>
        </div>
        <BookingHubPrimaryButton
          type="button"
          responsive
          responsiveCompact
          className="shrink-0 self-start"
          iconLeading={<Plus className="size-5" strokeWidth={2} aria-hidden />}
          onClick={onNewRequest}
        >
          New Request
        </BookingHubPrimaryButton>
      </div>

      <ClientPortalFigmaStatusTabBar
        tabs={TAB_ITEMS}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter requests by status"
      />

      <ul className="flex flex-col gap-3 sm:gap-4" role="list" aria-label="Booking requests">
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
                <FileText className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-avenir-regular text-base font-semibold leading-6" style={{ color: BRAND.ink }}>
                  {row.city}
                </p>
                <p className="font-avenir-regular mt-1 text-sm font-normal leading-5" style={{ color: BRAND.muted }}>
                  {row.guests} guests · {row.dateLabel}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:pl-4">
              <p className="font-avenir-regular text-right text-xs font-normal leading-[18px]" style={{ color: BRAND.muted }}>
                {row.submittedLabel}
              </p>
              {row.status === 'shortlist-ready' ? (
                <Link
                  href={resolveShortlistReadyHref(row)}
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                    'cursor-pointer transition-opacity duration-150 hover:opacity-90',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  {statusLabel(row.status)}
                </Link>
              ) : row.status === 'submitted' ? (
                <Link
                  href={resolveSubmittedHref(row)}
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                    'cursor-pointer transition-opacity duration-150 hover:opacity-90',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  {statusLabel(row.status)}
                </Link>
              ) : row.status === 'confirmed' ? (
                <Link
                  href={resolveConfirmedHref(row)}
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    statusBadgeClass(row.status),
                    'cursor-pointer transition-opacity duration-150 hover:opacity-90',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  {statusLabel(row.status)}
                </Link>
              ) : row.status === 'cancelled' ? (
                <Link
                  href={resolveCancelledHref(row)}
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
          No requests in this category.
        </p>
      ) : null}
    </div>
  );
}
