'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { PoundSterling } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

/** Column shell — matches client dashboard home (`ClientPortalDashboardHomeView`). */
export const portalDashboardColumnCardClass =
  'flex flex-col gap-4 rounded-xl border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-6';

/** Inner booking row — white card on white column (Figma-style list item). */
export const portalDashboardBookingRowCardClass =
  'rounded-xl border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-5';

export type PortalDashboardActiveBookingsCardItem = {
  id: string;
  name: string;
  meta: string;
  status: string;
  statusVariant: 'checked-in' | 'confirmed' | 'muted';
};

/** Static shell data — matches dashboard reference; replace with API-driven `items` when wired. */
export const portalDashboardDummyActiveBookingsItems: PortalDashboardActiveBookingsCardItem[] = [
  {
    id: 'dummy-bh-0847',
    name: 'BH-2024-0847',
    meta: 'Manchester\n15 Mar 2024 – 10 May 2024',
    status: 'Checked In',
    statusVariant: 'checked-in',
  },
  {
    id: 'dummy-bh-0912',
    name: 'BH-2024-0912',
    meta: 'Birmingham\n23 Mar 2024 – 15 Jun 2024',
    status: 'Confirmed',
    statusVariant: 'confirmed',
  },
];

export type PortalDashboardActiveBookingsCardProps = {
  headingId: string;
  title: string;
  headerIcon: LucideIcon;
  items: PortalDashboardActiveBookingsCardItem[];
  footerLabel?: string;
  /** When set, footer is a Next.js link (e.g. client hub `?view=my-bookings`). */
  footerHref?: string;
  emptyContent?: ReactNode;
  loading?: boolean;
  loadingContent?: ReactNode;
  className?: string;
};

function statusPillClass(variant: PortalDashboardActiveBookingsCardItem['statusVariant']): string {
  if (variant === 'checked-in') return 'bg-[#0b1d37]';
  if (variant === 'confirmed') return 'bg-[#00BAB5]';
  return 'bg-[#4B4E53]';
}

const portalDashboardCardFooterLinkClass =
  'font-avenir-regular text-sm font-semibold text-[#00BAB5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2';

/**
 * Active Bookings column — extracted from `ClientPortalDashboardHomeView` for reuse on client + partner dashboards.
 */
export function PortalDashboardActiveBookingsCard({
  headingId,
  title,
  headerIcon: HeaderIcon,
  items,
  footerLabel = 'View all bookings',
  footerHref,
  emptyContent,
  loading,
  loadingContent,
  className,
}: PortalDashboardActiveBookingsCardProps) {
  return (
    <section
      className={cn(portalDashboardColumnCardClass, className)}
      aria-labelledby={headingId}
    >
      <div className="flex items-center gap-2">
        <HeaderIcon className="size-5 shrink-0 text-[#00BAB5]" strokeWidth={2} aria-hidden />
        <h2 id={headingId} className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] lg:text-lg">
          {title}
        </h2>
      </div>

      {loading ? (
        loadingContent ?? (
          <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Loading…</p>
        )
      ) : items.length === 0 ? (
        emptyContent ?? (
          <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">No bookings to show.</p>
        )
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {items.map((b) => (
            <li key={b.id} className={portalDashboardBookingRowCardClass}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">{b.name}</p>
                  <p className="font-avenir-regular mt-1 whitespace-pre-line text-sm font-normal leading-5 text-[#717680]">
                    {b.meta}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 self-start items-center rounded-full px-2.5 py-1 font-avenir-regular text-xs font-semibold leading-[18px] text-white',
                    statusPillClass(b.statusVariant),
                  )}
                >
                  {b.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {footerLabel ? (
        <div className="flex justify-center border-t border-[#e9eaeb] py-5">
          {footerHref ? (
            <Link href={footerHref} className={portalDashboardCardFooterLinkClass}>
              {footerLabel}
            </Link>
          ) : (
            <button type="button" className={portalDashboardCardFooterLinkClass}>
              {footerLabel}
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
}

/** Row in Upcoming Payouts — matches partner dashboard reference. */
export type PortalDashboardPayoutListItem = {
  id: string;
  amount: string;
  refId: string;
  status: 'Scheduled' | 'Held';
  dateShort: string;
};

/** Navy = same as booking “Checked In” / Scheduled; amber = `PartnerRequestsInMyAreaView` pill tone. */
function payoutStatusPillClass(status: PortalDashboardPayoutListItem['status']): string {
  if (status === 'Scheduled') return 'bg-[#0b1d37]';
  return 'bg-[#E8A23E]';
}

/** Static shell data — replace with API-driven `items` when wired. */
export const portalDashboardDummyPayoutListItems: PortalDashboardPayoutListItem[] = [
  {
    id: 'dummy-payout-0847',
    amount: '£805.00',
    refId: 'BH-2024-0847',
    status: 'Scheduled',
    dateShort: '15 Feb',
  },
  {
    id: 'dummy-payout-0912',
    amount: '£1,450.00',
    refId: 'BH-2024-0912',
    status: 'Held',
    dateShort: '22 Feb',
  },
];

export type PortalDashboardUpcomingPayoutsCardProps = {
  headingId: string;
  items?: PortalDashboardPayoutListItem[];
  footerLabel?: string;
  className?: string;
};

/**
 * Upcoming Payouts column — partner dashboard; reuses column + row shell tokens from this module.
 */
export function PortalDashboardUpcomingPayoutsCard({
  headingId,
  items = portalDashboardDummyPayoutListItems,
  footerLabel = 'View all payouts',
  className,
}: PortalDashboardUpcomingPayoutsCardProps) {
  return (
    <section className={cn(portalDashboardColumnCardClass, className)} aria-labelledby={headingId}>
      <div className="flex items-center gap-2">
        <PoundSterling className="size-5 shrink-0 text-[#00BAB5]" strokeWidth={2} aria-hidden />
        <h2 id={headingId} className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] lg:text-lg">
          Upcoming Payouts
        </h2>
      </div>

      <ul className="flex flex-col gap-3" role="list">
        {items.map((row) => (
          <li key={row.id} className={portalDashboardBookingRowCardClass}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">{row.amount}</p>
                <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">{row.refId}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-1 font-avenir-regular text-xs font-semibold leading-[18px] text-white',
                    payoutStatusPillClass(row.status),
                  )}
                >
                  {row.status}
                </span>
                <span className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{row.dateShort}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {footerLabel ? (
        <div className="flex justify-center border-t border-[#e9eaeb] py-5">
          <button type="button" className="font-avenir-regular text-sm font-semibold text-[#00BAB5] hover:underline">
            {footerLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}
