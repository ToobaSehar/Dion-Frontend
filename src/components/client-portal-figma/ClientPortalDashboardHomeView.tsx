'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Plus,
  PoundSterling,
} from 'lucide-react';

import Link from 'next/link';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { ClientPortalDashboardActiveRequestsSection } from '@/components/client-portal-figma/ClientPortalDashboardActiveRequestsSection';
import {
  PortalDashboardActiveBookingsCard,
  portalDashboardColumnCardClass,
  portalDashboardDummyActiveBookingsItems,
} from '@/components/client-portal-figma/PortalDashboardActiveBookingsCard';
import { PORTAL_DASHBOARD_SECTION_HEADING_CLASS } from '@/components/client-portal-figma/portalDashboardSectionHeading';

import { cn } from '@/lib/utils';

const ACTION_ITEMS: Array<{
  id: string;
  icon: LucideIcon;
  iconLabel: string;
  title: ReactNode;
  actionLabel: string;
}> = [
  {
    id: '1',
    icon: ClipboardList,
    iconLabel: 'Task',
    title: (
      <>
        New response required for <span className="font-semibold text-[#0b1d37]">Bristol</span>
      </>
    ),
    actionLabel: 'View options',
  },
  {
    id: '2',
    icon: PoundSterling,
    iconLabel: 'Payment',
    title: (
      <>
        <span className="font-semibold text-[#0b1d37]">Victoria Apartments</span>{' '}
        <span className="font-semibold text-[#0b1d37]">£2,400</span>
      </>
    ),
    actionLabel: 'Pay now',
  },
  {
    id: '3',
    icon: Calendar,
    iconLabel: 'Calendar',
    title: (
      <>
        <span className="font-semibold text-[#0b1d37]">Station House</span> — booking ending soon
      </>
    ),
    actionLabel: 'Extend or rebook',
  },
];

const DUE_SOON_ITEMS = [
  { id: '1', amount: '£2,400', property: 'Victoria Apartments', cadence: 'Every 28 days', dateLabel: '15 Mar' },
  { id: '2', amount: '£1,800', property: 'Station House', cadence: 'Every 28 days', dateLabel: '22 Mar' },
  { id: '3', amount: '£3,100', property: 'Canal View Suites', cadence: 'Every 28 days', dateLabel: '28 Mar' },
];

function TealIconBubble({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F6F6F4] text-[#00BAB5]"
      role="img"
      aria-label={label}
    >
      <Icon className="size-5" strokeWidth={2} aria-hidden />
    </div>
  );
}

function ActionLinkChevron({ children }: { children: string }) {
  return (
    <span className="font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold text-[#00BAB5]">
      {children}
      <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
    </span>
  );
}

export type ClientPortalDashboardHomeViewProps = {
  className?: string;
  /** Next.js route for the “View options” action (shortlist request detail). */
  viewOptionsHref?: string;
  /** “Extend or rebook” action tile → terms / billing reference shell. */
  extendRebookHref?: string;
  /** “Pay now” action tile → client Payment Schedule shell. */
  onNavigateToPayments?: () => void;
};

/**
 * Client portal **Dashboard** home — welcome, action queue, bookings + due snapshot (static shell).
 */
export function ClientPortalDashboardHomeView({
  className,
  viewOptionsHref = '/client/requests/1',
  extendRebookHref = '/client/extend-rebook',
  onNavigateToPayments,
}: ClientPortalDashboardHomeViewProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-8 px-8 pb-16 sm:pb-20 lg:pb-24',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0b1d37] sm:text-[30px] sm:leading-[38px]">
            Welcome back, James
          </h1>
          <p className="font-avenir-regular text-sm font-normal leading-5 text-[#535862]">
            You have 3 items requiring attention.
          </p>
        </div>
        <BookingHubPrimaryButton
          type="button"
          responsive
          responsiveCompact
          className="shrink-0 self-start"
          iconLeading={<Plus className="size-5" strokeWidth={2} aria-hidden />}
        >
          New Request
        </BookingHubPrimaryButton>
      </div>

      <section className="flex flex-col gap-0" aria-labelledby="client-portal-action-required-heading">
        <h2 id="client-portal-action-required-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Action required
        </h2>
        <ul className="flex flex-col gap-3" role="list">
          {ACTION_ITEMS.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-4 rounded-xl border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <TealIconBubble Icon={row.icon} label={row.iconLabel} />
                <p className="font-avenir-regular min-w-0 flex-1 text-base font-normal leading-6 text-[#414651]">{row.title}</p>
              </div>
              {row.actionLabel === 'View options' && viewOptionsHref ? (
                <Link
                  href={viewOptionsHref}
                  aria-label={row.actionLabel}
                  className="font-avenir-regular self-start text-left sm:self-center sm:shrink-0 sm:text-right"
                >
                  <ActionLinkChevron>{row.actionLabel}</ActionLinkChevron>
                </Link>
              ) : row.actionLabel === 'Extend or rebook' && extendRebookHref ? (
                <Link
                  href={extendRebookHref}
                  aria-label={row.actionLabel}
                  className="font-avenir-regular self-start text-left sm:self-center sm:shrink-0 sm:text-right"
                >
                  <ActionLinkChevron>{row.actionLabel}</ActionLinkChevron>
                </Link>
              ) : (
                <button
                  type="button"
                  aria-label={row.actionLabel}
                  className="font-avenir-regular self-start text-left sm:self-center sm:shrink-0 sm:text-right"
                  onClick={row.actionLabel === 'Pay now' ? () => onNavigateToPayments?.() : undefined}
                >
                  <ActionLinkChevron>{row.actionLabel}</ActionLinkChevron>
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <PortalDashboardActiveBookingsCard
          headingId="client-portal-active-bookings-heading"
          title="Active Bookings"
          headerIcon={Calendar}
          items={portalDashboardDummyActiveBookingsItems}
        />

        <section className={portalDashboardColumnCardClass} aria-labelledby="client-portal-due-soon-widget-heading">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 shrink-0 text-[#00BAB5]" strokeWidth={2} aria-hidden />
            <h2 id="client-portal-due-soon-widget-heading" className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">
              Due Soon
            </h2>
          </div>
          <ul className="flex flex-col gap-3" role="list">
            {DUE_SOON_ITEMS.map((d) => (
              <li
                key={d.id}
                className="rounded-xl border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]">{d.amount}</p>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-[#00BAB5] px-2.5 py-0.5 font-avenir-regular text-xs font-semibold leading-[18px] text-white">
                    {d.cadence}
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <p className="font-avenir-regular min-w-0 text-sm font-normal leading-5 text-[#717680]">{d.property}</p>
                  <p className="font-avenir-regular shrink-0 text-sm font-normal leading-5 text-[#717680]">{d.dateLabel}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center border-t border-[#e9eaeb] py-5">
            <button type="button" className="font-avenir-regular text-sm font-semibold text-[#00BAB5] hover:underline">
              View all payments
            </button>
          </div>
        </section>
      </div>

      <ClientPortalDashboardActiveRequestsSection />
    </div>
  );
}
