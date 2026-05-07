'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';

import {
  PartnerOfferStatusBar,
  type PartnerOfferStatusFilter,
} from '@/components/client-portal-figma/PartnerOfferStatusBar';
import { partnerOfferDetailHref } from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { cn } from '@/lib/utils';

/** Align with `ClientPortalMyRequestsView` pills (submitted / confirmed / cancelled). */
const OFFER_PILL_SUBMITTED = 'bg-[#E8A23E] text-white';
const OFFER_PILL_ACCEPTED = 'bg-[#00BAB5] text-white';
/** Muted ink on brand surface — matches unsuccessful list pill spec. */
const OFFER_PILL_UNSUCCESSFUL = 'bg-[#F6F6F4] text-[#4B4E53]';

export type { PartnerOfferStatusFilter } from '@/components/client-portal-figma/PartnerOfferStatusBar';

type OfferRowStatus = Exclude<PartnerOfferStatusFilter, 'all'>;

export type PartnerOfferRow = {
  id: string;
  propertyName: string;
  /** Optional booking reference between title and meta (see design). */
  referenceId?: string;
  metaLine: string;
  submittedLabel: string;
  status: OfferRowStatus;
};

const DEFAULT_OFFERS: PartnerOfferRow[] = [
  {
    id: '1',
    propertyName: 'City Centre Apartment',
    metaLine: 'Manchester · 15 Mar - 10 May 2024 · £80/night',
    submittedLabel: 'Submitted 20 Feb',
    status: 'submitted',
  },
  {
    id: '2',
    propertyName: 'City Centre Apartment',
    referenceId: 'BH-2024-0834',
    metaLine: 'Birmingham · 1 May - 1 Aug 2024 · £130/night',
    submittedLabel: 'Submitted 15 Feb',
    status: 'accepted',
  },
  {
    id: '3',
    propertyName: 'Victoria House',
    referenceId: 'BH-2024-0601',
    metaLine: 'Birmingham · 10 Apr - 10 Jul 2024 · £72/night',
    submittedLabel: 'Submitted 5 Mar',
    status: 'submitted',
  },
  {
    id: '4',
    propertyName: 'Northern Quarter Studio',
    metaLine: 'Manchester · 20 Mar - 17 Apr 2024 · £70/night',
    submittedLabel: 'Submitted 10 Feb',
    status: 'unsuccessful',
  },
  {
    id: '5',
    propertyName: 'Northern Quarter Studio',
    metaLine: 'Leeds · 1 Apr - 24 Jun 2024 · £120/night',
    submittedLabel: 'Submitted 18 Feb',
    status: 'submitted',
  },
];

function offerStatusPillClass(status: OfferRowStatus): string {
  switch (status) {
    case 'submitted':
      return OFFER_PILL_SUBMITTED;
    case 'accepted':
      return OFFER_PILL_ACCEPTED;
    case 'unsuccessful':
      return OFFER_PILL_UNSUCCESSFUL;
  }
}

function offerStatusLabel(status: OfferRowStatus): string {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'accepted':
      return 'Accepted';
    case 'unsuccessful':
      return 'Unsuccessful';
  }
}

export type PartnerMyOffersViewProps = {
  className?: string;
  items?: PartnerOfferRow[];
};

/**
 * Partner portal **My Offers** — shared Figma status tab bar + list shell (static rows until API wiring).
 * Row status pills reuse client portal amber (`#E8A23E`), teal (`#00BAB5`), and muted (`#4B4E53` on `#F6F6F4`) for unsuccessful.
 */
export function PartnerMyOffersView({ className, items = DEFAULT_OFFERS }: PartnerMyOffersViewProps) {
  const [filter, setFilter] = useState<PartnerOfferStatusFilter>('all');

  const visibleRows = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((r) => r.status === filter);
  }, [filter, items]);

  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <header className="space-y-1">
        <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
          My Offers
        </h1>
        <p className="font-avenir-regular max-w-2xl text-base font-normal leading-6 text-[#717680]">
          Track all your submitted offers and their status.
        </p>
      </header>

      <PartnerOfferStatusBar value={filter} onChange={setFilter} />

      <ul className="flex flex-col gap-3" role="list" aria-label="Your offers">
        {visibleRows.map((row) => {
          const cardClass = cn(
            'flex flex-col gap-4 rounded-[12px] border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] transition-shadow sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5',
            'hover:shadow-[0px_4px_12px_rgba(10,13,18,0.06)]',
            (row.status === 'submitted' || row.status === 'accepted' || row.status === 'unsuccessful') &&
              'cursor-pointer',
          );

          const inner = (
            <article className={cardClass}>
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#535862]"
                  aria-hidden
                >
                  <FileText className="size-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">{row.propertyName}</p>
                  {row.referenceId ? (
                    <p className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">{row.referenceId}</p>
                  ) : null}
                  <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{row.metaLine}</p>
                </div>
              </div>

              <div className="flex shrink-0 flex-row flex-wrap items-center justify-end gap-3">
                <p className="font-avenir-regular text-right text-xs font-normal leading-[18px] text-[#717680]">
                  {row.submittedLabel}
                </p>
                <span
                  className={cn(
                    'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                    offerStatusPillClass(row.status),
                  )}
                >
                  {offerStatusLabel(row.status)}
                </span>
              </div>
            </article>
          );

          return (
            <li key={row.id}>
              {row.status === 'submitted' || row.status === 'accepted' || row.status === 'unsuccessful' ? (
                <Link
                  href={partnerOfferDetailHref(row.id)}
                  className="block rounded-[12px] outline-none ring-[#00BAB5] focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>

      {visibleRows.length === 0 ? (
        <p className="font-avenir-regular text-center text-sm text-[#717680]">No offers in this category.</p>
      ) : null}
    </div>
  );
}
