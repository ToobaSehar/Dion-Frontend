'use client';

import { Calendar, CreditCard } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';

import { cn } from '@/lib/utils';

/** Static copy for the shell; replace with API data when wiring payments. */
export const CLIENT_PORTAL_PAYMENT_SCHEDULE_TOTAL_LABEL = 'Total Due This Period';
export const CLIENT_PORTAL_PAYMENT_SCHEDULE_TOTAL_AMOUNT = '£12,339.2';

export type ClientPortalPaymentScheduleDueItem = {
  id: string;
  propertyName: string;
  reference: string;
  location: string;
  dueDateLabel: string;
  amountLabel: string;
  statusLabel: string;
  /** `due-soon` — amber badge + Pay Now; `scheduled` — dark badge, no CTA. */
  listVariant: 'due-soon' | 'scheduled';
};

const DEFAULT_PAYMENT_SCHEDULE_ITEMS: ClientPortalPaymentScheduleDueItem[] = [
  {
    id: '1',
    propertyName: 'City Quarter Leeds',
    reference: 'BH-9D3E5C7A',
    location: 'Leeds',
    dueDateLabel: '1 Apr 2026',
    amountLabel: '£3,200',
    statusLabel: 'Due Soon',
    listVariant: 'due-soon',
  },
  {
    id: '2',
    propertyName: 'Bristol Group Booking',
    reference: 'BG-2026-0001',
    location: 'Bristol',
    dueDateLabel: '1 Apr 2026',
    amountLabel: '£4,939.2',
    statusLabel: 'Due Soon',
    listVariant: 'due-soon',
  },
  {
    id: '3',
    propertyName: 'Victoria Apartments',
    reference: 'BH-7B2E9D1F',
    location: 'Manchester',
    dueDateLabel: '15 Apr 2026',
    amountLabel: '£2,400',
    statusLabel: 'Scheduled',
    listVariant: 'scheduled',
  },
  {
    id: '4',
    propertyName: 'Station House',
    reference: 'BH-1C4F6A8B',
    location: 'Birmingham',
    dueDateLabel: '22 Apr 2026',
    amountLabel: '£1,800',
    statusLabel: 'Scheduled',
    listVariant: 'scheduled',
  },
];

export type ClientPortalPaymentSchedulePanelProps = {
  className?: string;
  /** Optional override for list rows (e.g. from API). */
  dueItems?: ClientPortalPaymentScheduleDueItem[];
  /** Opens **Make Payment** summary from a due-soon row (static shell). */
  onPayNow?: () => void;
};

function DueSoonBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#e8a23e] px-2.5 py-0.5 font-avenir-regular text-xs font-semibold leading-[18px] text-white">
      {label}
    </span>
  );
}

function ScheduledBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#1a1c1e] px-2.5 py-0.5 font-avenir-regular text-xs font-semibold leading-[18px] text-white">
      {label}
    </span>
  );
}

function PaymentScheduleRow({
  item,
  onPayNow,
}: {
  item: ClientPortalPaymentScheduleDueItem;
  onPayNow?: () => void;
}) {
  const isDueSoon = item.listVariant === 'due-soon';

  return (
    <li className="flex flex-col gap-4 border-b border-[#e9eaeb] py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">{item.propertyName}</p>
        <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{item.reference}</p>
        <p className="font-avenir-regular text-sm font-normal leading-5 text-[#535862]">{item.location}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-avenir-regular text-sm font-normal leading-5 text-[#535862]">{item.dueDateLabel}</span>
          {isDueSoon ? <DueSoonBadge label={item.statusLabel} /> : <ScheduledBadge label={item.statusLabel} />}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
        <p className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37] sm:text-right">{item.amountLabel}</p>
        {isDueSoon ? (
          <BookingHubPrimaryButton
            type="button"
            responsive
            responsiveCompact
            iconLeading={<CreditCard className="size-5" strokeWidth={2} aria-hidden />}
            onClick={() => onPayNow?.()}
          >
            Pay Now
          </BookingHubPrimaryButton>
        ) : null}
      </div>
    </li>
  );
}

/**
 * Client portal **Payment Schedule** tab body (summary + list). Tab label lives on the dashboard shell.
 */
export function ClientPortalPaymentSchedulePanel({
  className,
  dueItems = DEFAULT_PAYMENT_SCHEDULE_ITEMS,
  onPayNow,
}: ClientPortalPaymentSchedulePanelProps) {
  return (
    <div className={cn('flex w-full flex-col gap-8', className)}>
      <section
        className="flex w-full flex-wrap items-center justify-between gap-4 rounded-xl border border-solid border-[#e9eaeb] bg-[#f6f6f4] px-5 py-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:px-6 sm:py-6"
        aria-labelledby="payment-schedule-total-heading"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p id="payment-schedule-total-heading" className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">
            {CLIENT_PORTAL_PAYMENT_SCHEDULE_TOTAL_LABEL}
          </p>
          <p className="font-avenir-regular text-3xl font-semibold leading-[38px] tracking-[-0.02em] text-[#00BAB5] sm:text-4xl sm:leading-[44px]">
            {CLIENT_PORTAL_PAYMENT_SCHEDULE_TOTAL_AMOUNT}
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-center text-[#00BAB5]" aria-hidden>
          <Calendar className="size-8 sm:size-10" strokeWidth={1.25} />
        </div>
      </section>

      <section
        className="flex w-full flex-col rounded-xl border border-[#e9eaeb] bg-white px-5 py-1 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:px-6"
        aria-labelledby="payment-schedule-due-heading"
      >
        <h2 id="payment-schedule-due-heading" className="font-avenir-regular py-5 text-lg font-semibold leading-7 text-[#0b1d37]">
          Due Soon
        </h2>
        <ul className="flex flex-col" role="list">
          {dueItems.map((item) => (
            <PaymentScheduleRow key={item.id} item={item} onPayNow={onPayNow} />
          ))}
        </ul>
      </section>
    </div>
  );
}
