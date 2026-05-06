'use client';

import type { KeyboardEvent } from 'react';

import { PoundSterling } from 'lucide-react';

import { partnerPayoutBreakdownHasDetail } from '@/components/client-portal-figma/partnerPayoutBreakdownData';
import { cn } from '@/lib/utils';

const statCardShell =
  'flex items-center gap-4 rounded-xl border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-5';

const tableShell =
  'overflow-hidden rounded-xl border border-[#e9eaeb] bg-white shadow-[0px_1px_1px_rgba(10,13,18,0.05)]';

const thClass =
  'font-avenir-regular border-b border-[#e9eaeb] bg-white px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#4B4E53] sm:px-5';

const tdClass = 'font-avenir-regular border-b border-[#e9eaeb] px-4 py-4 align-middle text-sm text-[#0B1D37] sm:px-5';

export type PartnerPayoutRowStatus = 'scheduled' | 'held' | 'released' | 'failed' | 'blocked';

export type PartnerPayoutTableRow = {
  id: string;
  bookingRef: string;
  propertyName: string;
  checkInLabel: string;
  amountLabel: string;
  status: PartnerPayoutRowStatus;
  statusLabel: string;
  releaseDateLabel: string;
};

export type PartnerPayoutSummaryStat = {
  id: string;
  label: string;
  value: string;
  iconVariant: 'mint' | 'neutral' | 'amber';
};

/** Amber + red shades align with client portal pills (`ClientPortalMyRequestsView`, `ClientPortalMyBookingsView`). */
export function partnerPayoutStatusPillClass(status: PartnerPayoutRowStatus): string {
  switch (status) {
    case 'scheduled':
      return 'bg-[#0B1D37] text-white';
    case 'held':
      return 'bg-[#E8A23E] text-white';
    case 'released':
      return 'bg-booking-teal text-white';
    case 'failed':
      return 'bg-[#F04438] text-white';
    case 'blocked':
      return 'bg-[#FDB022] text-white';
  }
}

export const partnerPortalPayoutsDefaultSummaryStats: PartnerPayoutSummaryStat[] = [
  { id: 'scheduled', label: 'Scheduled', value: '£805', iconVariant: 'mint' },
  { id: 'released', label: 'Released (All Time)', value: '£3,850', iconVariant: 'neutral' },
  { id: 'held', label: 'Held', value: '£1,450', iconVariant: 'amber' },
];

export const partnerPortalPayoutsDefaultTableRows: PartnerPayoutTableRow[] = [
  {
    id: '1',
    bookingRef: 'BH-2024-0847',
    propertyName: 'City Centre Apartment',
    checkInLabel: '15 Mar 2024',
    amountLabel: '£805',
    status: 'scheduled',
    statusLabel: 'Scheduled',
    releaseDateLabel: '16 Mar 2024',
  },
  {
    id: '2',
    bookingRef: 'BH-2024-0912',
    propertyName: 'Northern Quarter Studio',
    checkInLabel: '23 Mar 2024',
    amountLabel: '£1,450',
    status: 'held',
    statusLabel: 'Held – releases after check-in',
    releaseDateLabel: '24 Mar 2024',
  },
  {
    id: '3',
    bookingRef: 'BH-2024-0756',
    propertyName: 'City Centre Apartment',
    checkInLabel: '5 Jan 2024',
    amountLabel: '£3,850',
    status: 'released',
    statusLabel: 'Released',
    releaseDateLabel: '6 Jan 2024',
  },
  {
    id: '4',
    bookingRef: 'BH-2024-0698',
    propertyName: 'Northern Quarter Studio',
    checkInLabel: '1 Feb 2024',
    amountLabel: '£2,200',
    status: 'failed',
    statusLabel: 'Failed – contact Booking Hub',
    releaseDateLabel: '2 Feb 2024',
  },
  {
    id: '5',
    bookingRef: 'BH-2024-0601',
    propertyName: 'City Centre Apartment',
    checkInLabel: '10 Apr 2024',
    amountLabel: '£980',
    status: 'blocked',
    statusLabel: 'Blocked – complete Stripe onboarding',
    releaseDateLabel: '—',
  },
];

function summaryIconWrap(variant: PartnerPayoutSummaryStat['iconVariant']): string {
  switch (variant) {
    case 'mint':
      return 'flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#00BAB5]/12 text-[#00BAB5]';
    case 'amber':
      return 'flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#E8A23E]/14 text-[#C27803]';
    case 'neutral':
    default:
      return 'flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#4B4E53]';
  }
}

export type PartnerPortalPayoutsViewProps = {
  className?: string;
  summaryStats?: PartnerPayoutSummaryStat[];
  rows?: PartnerPayoutTableRow[];
  /** Rows with a static breakdown (`partnerPayoutBreakdownData`) navigate to `/payouts/[id]` when set. */
  onPayoutBreakdownNavigate?: (payoutRowId: string) => void;
};

/**
 * Partner portal **Payouts** — summary stat cards + payouts table (static shell until API wiring).
 * Reuses brand tokens from the client Figma shell (`#0B1D37`, `#00BAB5`, `#E8A23E`, `#FDB022`, `#F04438`, `#4B4E53`).
 */
export function PartnerPortalPayoutsView({
  className,
  summaryStats = partnerPortalPayoutsDefaultSummaryStats,
  rows = partnerPortalPayoutsDefaultTableRows,
  onPayoutBreakdownNavigate,
}: PartnerPortalPayoutsViewProps) {
  return (
    <div className={cn('flex w-full flex-col gap-8 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <header className="space-y-1">
        <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
          Payouts
        </h1>
        <p className="font-avenir-regular max-w-2xl text-base font-normal leading-6 text-[#4B4E53]">
          Track all payouts across your bookings.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {summaryStats.map((stat) => (
          <div key={stat.id} className={statCardShell}>
            <div className={summaryIconWrap(stat.iconVariant)} aria-hidden>
              <PoundSterling className="size-5 shrink-0" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#4B4E53]">{stat.label}</p>
              <p className="font-avenir-regular text-xl font-semibold leading-7 text-[#0B1D37] sm:text-2xl sm:leading-8">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={cn(tableShell, 'overflow-x-auto')}>
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr>
              <th className={thClass}>Booking ref</th>
              <th className={thClass}>Property</th>
              <th className={thClass}>Check-in</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Release date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              const rowTd = (extra?: string) => cn(tdClass, isLast && '!border-b-0', extra);
              const breakdownNavigate =
                partnerPayoutBreakdownHasDetail(row.id) && typeof onPayoutBreakdownNavigate === 'function'
                  ? onPayoutBreakdownNavigate
                  : undefined;
              const onBreakdownRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
                if (!breakdownNavigate) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  breakdownNavigate(row.id);
                }
              };
              return (
                <tr
                  key={row.id}
                  className={cn('bg-white', breakdownNavigate && 'cursor-pointer hover:bg-[#F9FAFB]')}
                  onClick={() => breakdownNavigate?.(row.id)}
                  onKeyDown={onBreakdownRowKeyDown}
                  tabIndex={breakdownNavigate ? 0 : undefined}
                  aria-label={
                    breakdownNavigate ? `View payout breakdown for ${row.bookingRef}` : undefined
                  }
                  role={breakdownNavigate ? 'button' : undefined}
                >
                  <td className={rowTd('font-semibold text-[#0B1D37]')}>{row.bookingRef}</td>
                  <td className={rowTd('font-semibold leading-5')}>{row.propertyName}</td>
                  <td className={rowTd('text-[#4B4E53]')}>{row.checkInLabel}</td>
                  <td className={rowTd('font-semibold')}>{row.amountLabel}</td>
                  <td className={rowTd()}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex max-w-[220px] rounded-full px-2.5 py-1 text-xs font-semibold leading-snug sm:max-w-[280px]',
                        partnerPayoutStatusPillClass(row.status),
                        'whitespace-normal text-left',
                      )}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                  <td className={rowTd('text-[#4B4E53]')}>{row.releaseDateLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
