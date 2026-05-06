'use client';

import { cn } from '@/lib/utils';

export type ClientPortalScheduledPaymentRow = {
  id: string;
  propertyName: string;
  reference: string;
  location: string;
  dueDateLabel: string;
  statusLabel: string;
  amountLabel: string;
};

const DEFAULT_SCHEDULED_ROWS: ClientPortalScheduledPaymentRow[] = [
  {
    id: '1',
    propertyName: 'Victoria Apartments',
    reference: 'BH-7B2E9D1F',
    location: 'Manchester',
    dueDateLabel: '15 Apr 2026',
    statusLabel: 'Scheduled',
    amountLabel: '£2,400',
  },
  {
    id: '2',
    propertyName: 'Station House',
    reference: 'BH-1C4F6A8B',
    location: 'Birmingham',
    dueDateLabel: '22 Apr 2026',
    statusLabel: 'Scheduled',
    amountLabel: '£1,800',
  },
];

function ScheduledStatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#1a1c1e] px-2.5 py-0.5 font-avenir-regular text-xs font-semibold leading-[18px] text-white">
      {label}
    </span>
  );
}

function ScheduledPaymentRow({ item }: { item: ClientPortalScheduledPaymentRow }) {
  return (
    <li className="flex flex-col gap-4 border-b border-[#e9eaeb] py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">{item.propertyName}</p>
        <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{item.reference}</p>
        <p className="font-avenir-regular text-sm font-normal leading-5 text-[#535862]">{item.location}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-avenir-regular text-sm font-normal leading-5 text-[#535862]">{item.dueDateLabel}</span>
          <ScheduledStatusBadge label={item.statusLabel} />
        </div>
      </div>
      <p className="font-avenir-regular shrink-0 text-lg font-semibold leading-7 text-[#0b1d37] sm:text-right">{item.amountLabel}</p>
    </li>
  );
}

export type ClientPortalScheduledPaymentsListProps = {
  className?: string;
  /** Optional row data (e.g. from API). */
  items?: ClientPortalScheduledPaymentRow[];
};

/**
 * Standalone scheduled-payments card (e.g. other dashboard surfaces). Payment Schedule tab uses merged list in {@link ClientPortalPaymentSchedulePanel}.
 */
export function ClientPortalScheduledPaymentsList({ className, items = DEFAULT_SCHEDULED_ROWS }: ClientPortalScheduledPaymentsListProps) {
  return (
    <section className={cn('w-full', className)} aria-label="Scheduled payments">
      <div className="overflow-hidden rounded-xl border border-[#e9eaeb] bg-white shadow-[0px_1px_1px_rgba(10,13,18,0.05)]">
        <ul className="flex flex-col px-5 sm:px-6" role="list">
          {items.map((item) => (
            <ScheduledPaymentRow key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
