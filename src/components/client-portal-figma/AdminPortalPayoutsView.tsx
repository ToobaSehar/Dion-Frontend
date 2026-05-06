'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, Pause, Play, RefreshCw } from 'lucide-react';

import {
  AdminPortalPayoutsStatusPills,
  type AdminPortalPayoutsFilterTab,
} from '@/components/client-portal-figma/AdminPortalPayoutsStatusPills';
import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

export type { AdminPortalPayoutsFilterTab } from '@/components/client-portal-figma/AdminPortalPayoutsStatusPills';

export type AdminPortalPayoutRowStatus =
  | 'held'
  | 'scheduled'
  | 'on-hold'
  | 'released'
  | 'failed'
  | 'blocked';

export type AdminPortalPayoutTableRow = {
  id: string;
  bookingRef: string;
  partner: string;
  property: string;
  checkIn: string;
  netPayout: string;
  status: AdminPortalPayoutRowStatus;
  scheduledLabel: string;
};

const MOCK_ROWS: AdminPortalPayoutTableRow[] = [
  {
    id: '1',
    bookingRef: 'BK-2024-0891',
    partner: 'Haven Properties',
    property: 'Station House',
    checkIn: '1 Feb 2024',
    netPayout: '£6,642',
    status: 'scheduled',
    scheduledLabel: '8 Apr 2024',
  },
  {
    id: '2',
    bookingRef: 'BK-2024-0888',
    partner: 'City Living Ltd',
    property: 'Victoria Apartments',
    checkIn: '15 Mar 2024',
    netPayout: '£8,112',
    status: 'held',
    scheduledLabel: '16 Mar 2024',
  },
  {
    id: '3',
    bookingRef: 'BK-2024-0882',
    partner: 'Metro Stays',
    property: 'Riverside Court',
    checkIn: '22 Mar 2024',
    netPayout: '£4,256',
    status: 'on-hold',
    scheduledLabel: '23 Mar 2024',
  },
  {
    id: '4',
    bookingRef: 'BK-2024-0876',
    partner: 'Haven Properties',
    property: 'Harbour Studios',
    checkIn: '10 Jan 2024',
    netPayout: '£3,780',
    status: 'released',
    scheduledLabel: '11 Jan 2024',
  },
  {
    id: '5',
    bookingRef: 'BK-2024-0869',
    partner: 'City Living Ltd',
    property: 'Canal View Suites',
    checkIn: '5 Dec 2023',
    netPayout: '£2,880',
    status: 'failed',
    scheduledLabel: '6 Dec 2023',
  },
  {
    id: '6',
    bookingRef: 'BK-2024-0854',
    partner: 'Northern Lets',
    property: 'Queens Terrace',
    checkIn: '28 Feb 2024',
    netPayout: '£7,290',
    status: 'blocked',
    scheduledLabel: '—',
  },
  {
    id: '7',
    bookingRef: 'BK-2024-0841',
    partner: 'Haven Properties',
    property: 'Metro Lofts',
    checkIn: '12 Apr 2024',
    netPayout: '£1,995',
    status: 'scheduled',
    scheduledLabel: '13 Apr 2024',
  },
];

function statusBadgeClass(status: AdminPortalPayoutRowStatus): string {
  switch (status) {
    case 'scheduled':
      return 'bg-[#0B1D37] text-white';
    case 'held':
      return 'bg-[#FFEFD6] text-[#B54708]';
    case 'on-hold':
      return 'bg-[#FFEDD4] text-[#C4320A]';
    case 'released':
      return 'bg-[#CCFBF1] text-[#0F766E]';
    case 'failed':
      return 'bg-[#FEE4E2] text-[#B42318]';
    case 'blocked':
      return 'bg-[#E9EAEB] text-[#4B4E53]';
  }
}

function statusLabel(status: AdminPortalPayoutRowStatus): string {
  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'held':
      return 'Held';
    case 'on-hold':
      return 'On Hold';
    case 'released':
      return 'Released';
    case 'failed':
      return 'Failed';
    case 'blocked':
      return 'Blocked';
  }
}

function rowSurfaceClass(status: AdminPortalPayoutRowStatus): string {
  if (status === 'failed') return 'bg-[#FEF2F2]';
  return 'bg-white';
}

function rowMatchesFilter(row: AdminPortalPayoutTableRow, tab: AdminPortalPayoutsFilterTab): boolean {
  if (tab === 'all') return true;
  return row.status === tab;
}

export type AdminPortalPayoutsViewProps = {
  className?: string;
  rows?: AdminPortalPayoutTableRow[];
};

const thClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tdClass = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

const payoutTableBtnClass = cn(
  'shrink-0 !min-w-0 w-fit min-h-[30px] !gap-1 !px-2 !py-1',
  '[&_span.relative.inline-flex]:text-xs [&_span.relative.inline-flex]:leading-[18px]',
  '[&_span.inline-flex.size-5]:!size-4 [&_span.inline-flex.size-5_svg]:!size-4',
);

function PayoutRowActionsBar({ status }: { status: AdminPortalPayoutRowStatus }) {
  const viewBtn = (
    <button
      type="button"
      className="font-avenir-regular inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
    >
      View
      <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );

  if (status === 'scheduled' || status === 'blocked') {
    return (
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <BookingHubSecondaryButton
          type="button"
          size="sm"
          className={payoutTableBtnClass}
          iconLeading={<Pause className="size-4" strokeWidth={2} aria-hidden />}
        >
          Hold
        </BookingHubSecondaryButton>
        {viewBtn}
      </div>
    );
  }

  if (status === 'held' || status === 'on-hold') {
    return (
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-nowrap items-center gap-2">
          <BookingHubPrimaryButton
            type="button"
            size="sm"
            className={payoutTableBtnClass}
            iconLeading={<Play className="size-4" strokeWidth={2} aria-hidden />}
          >
            Release
          </BookingHubPrimaryButton>
          <BookingHubSecondaryButton
            type="button"
            size="sm"
            className={payoutTableBtnClass}
            iconLeading={<Pause className="size-4" strokeWidth={2} aria-hidden />}
          >
            Hold
          </BookingHubSecondaryButton>
        </div>
        {viewBtn}
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <BookingHubPrimaryButton
          type="button"
          size="sm"
          className={payoutTableBtnClass}
          iconLeading={<RefreshCw className="size-4" strokeWidth={2} aria-hidden />}
        >
          Retry
        </BookingHubPrimaryButton>
        {viewBtn}
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 items-center justify-end">
      {viewBtn}
    </div>
  );
}

/**
 * Admin **Payouts** — filter pills + payouts table (static data until API wiring).
 * Row actions use `BookingHubPrimaryButton` / `BookingHubSecondaryButton` (`ClientPortalPaymentSchedulePanel`, `PartnerMyPropertiesView`).
 */
export function AdminPortalPayoutsView({ className, rows = MOCK_ROWS }: AdminPortalPayoutsViewProps) {
  const [filter, setFilter] = useState<AdminPortalPayoutsFilterTab>('all');

  const visible = useMemo(() => rows.filter((r) => rowMatchesFilter(r, filter)), [rows, filter]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Payouts
      </h1>

      <AdminPortalPayoutsStatusPills value={filter} onChange={setFilter} className="mt-6" />

      <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9eaeb] bg-white">
                <th className={thClass}>Booking ref</th>
                <th className={thClass}>Partner</th>
                <th className={thClass}>Property</th>
                <th className={thClass}>Check-in</th>
                <th className={thClass}>Net payout</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Scheduled</th>
                <th className={cn(thClass, 'min-w-[200px] pr-6')} colSpan={2}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                    No payouts match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr
                    key={row.id}
                    className={cn('border-b border-[#e9eaeb] last:border-b-0', rowSurfaceClass(row.status))}
                  >
                    <td className={cn(tdClass, 'font-medium')}>{row.bookingRef}</td>
                    <td className={tdClass}>{row.partner}</td>
                    <td className={tdClass}>{row.property}</td>
                    <td className={tdClass}>{row.checkIn}</td>
                    <td className={tdClass}>{row.netPayout}</td>
                    <td className={tdClass}>
                      <span
                        className={cn(
                          'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                          statusBadgeClass(row.status),
                        )}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    <td className={tdClass}>{row.scheduledLabel}</td>
                    <td className={cn(tdClass, 'min-w-0 pr-6')} colSpan={2}>
                      <PayoutRowActionsBar status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
