'use client';

import { MapPin } from 'lucide-react';

import type { PortalPropertyDirectoryCardRow } from '@/components/client-portal-figma/PortalPropertyDirectoryCard';
import { PortalPropertyDirectoryCard } from '@/components/client-portal-figma/PortalPropertyDirectoryCard';
import { cn } from '@/lib/utils';

/** Exc VAT totals for mock shortlist rows (sum for footer). */
export const CLIENT_PORTAL_SHORTLIST_TOTAL_EXC_VAT_GBP_BY_ID: Record<string, number> = {
  'sl-1': 7380,
  'sl-2': 6840,
  'sl-3': 8460,
};

const SHORTLIST_ROWS: PortalPropertyDirectoryCardRow[] = [
  {
    id: 'sl-1',
    propertyName: 'Harbour View Apartments',
    partnerName: '',
    location: '',
    propertyType: '',
    beds: 3,
    guests: 6,
    vatRegistered: false,
    reviewApproved: true,
    opsStatus: 'active',
    cardImageSeed: 'bh-shortlist-harbour-view',
  },
  {
    id: 'sl-2',
    propertyName: 'City Quay Residence',
    partnerName: '',
    location: '',
    propertyType: '',
    beds: 2,
    guests: 4,
    vatRegistered: false,
    reviewApproved: true,
    opsStatus: 'active',
    cardImageSeed: 'bh-shortlist-city-quay',
  },
  {
    id: 'sl-3',
    propertyName: 'Marina Walk Suites',
    partnerName: '',
    location: '',
    propertyType: '',
    beds: 4,
    guests: 8,
    vatRegistered: false,
    reviewApproved: true,
    opsStatus: 'active',
    cardImageSeed: 'bh-shortlist-marina-walk',
  },
];

function ShortlistCardMeta({
  locationLine,
  distanceLine,
  specsLine,
  amenitiesLine,
  nightlyLabel,
  vatLine,
  totalLabel,
}: {
  locationLine: string;
  distanceLine: string;
  specsLine: string;
  amenitiesLine: string;
  nightlyLabel: string;
  vatLine: string;
  totalLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-avenir-regular flex items-start gap-1.5 text-sm font-normal leading-5 text-[#717680]">
        <MapPin className="mt-0.5 size-4 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
        <span>{locationLine}</span>
      </p>
      <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{distanceLine}</p>
      <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{specsLine}</p>
      <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{amenitiesLine}</p>
      <p className="font-avenir-regular pt-1 text-xl font-semibold leading-7 text-[#00BAB5]">{nightlyLabel}</p>
      <p className="font-avenir-regular text-xs font-medium leading-4 text-[#717680]">{vatLine}</p>
      <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{totalLabel}</p>
    </div>
  );
}

const META_BY_ID: Record<
  string,
  {
    locationLine: string;
    distanceLine: string;
    specsLine: string;
    amenitiesLine: string;
    nightlyLabel: string;
    vatLine: string;
    totalLabel: string;
  }
> = {
  'sl-1': {
    locationLine: 'Bristol Harbourside',
    distanceLine: '0.8 miles from requested location',
    specsLine: '3 bedrooms · sleeps 6',
    amenitiesLine: 'High-Speed Wi-Fi · Workspace / Desk · Smart TV · Living / Dining Space',
    nightlyLabel: '£82 /night exc VAT',
    vatLine: '20% VAT applies',
    totalLabel: 'Total amount: £7,380 exc VAT',
  },
  'sl-2': {
    locationLine: 'Bristol City Centre',
    distanceLine: '1.2 miles from requested location',
    specsLine: '2 bedrooms · sleeps 4',
    amenitiesLine: 'Wi-Fi · Workspace / Desk · Smart TV · Secure entry',
    nightlyLabel: '£76 /night exc VAT',
    vatLine: '20% VAT applies',
    totalLabel: 'Total amount: £6,840 exc VAT',
  },
  'sl-3': {
    locationLine: 'Bristol Harbourside',
    distanceLine: '1.0 miles from requested location',
    specsLine: '4 bedrooms · sleeps 8',
    amenitiesLine: 'High-Speed Wi-Fi · Parking · Smart TV · Living / Dining Space',
    nightlyLabel: '£94 /night exc VAT',
    vatLine: 'No VAT',
    totalLabel: 'Total amount: £8,460 exc VAT',
  },
};

export type ClientPortalRequestDetailShortlistSectionProps = {
  className?: string;
  selectedIds: Set<string>;
  onToggle: (id: string, next: boolean) => void;
};

/**
 * **Your Shortlist** — below request detail summary; multi-select using `PortalPropertyDirectoryCard` with selection chrome.
 */
export function ClientPortalRequestDetailShortlistSection({
  className,
  selectedIds,
  onToggle,
}: ClientPortalRequestDetailShortlistSectionProps) {
  return (
    <section className={cn('flex w-full flex-col gap-5', className)} aria-labelledby="client-shortlist-heading">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 id="client-shortlist-heading" className="font-avenir-regular text-xl font-semibold leading-8 text-[#0b1d37] sm:text-2xl sm:leading-9">
          Your Shortlist
        </h2>
        <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
          We&apos;ve matched 3 properties for your request. Select one or more and confirm your choice.
        </p>
      </div>

      <ul
        className="grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Shortlisted properties"
      >
        {SHORTLIST_ROWS.map((row) => {
          const meta = META_BY_ID[row.id];
          return (
            <PortalPropertyDirectoryCard
              key={row.id}
              row={row}
              selection={{
                selected: selectedIds.has(row.id),
                onSelectedChange: (next) => onToggle(row.id, next),
              }}
              suppressPartnerLink
              hideBedGuestStats
              afterMeta={
                meta ? (
                  <ShortlistCardMeta
                    locationLine={meta.locationLine}
                    distanceLine={meta.distanceLine}
                    specsLine={meta.specsLine}
                    amenitiesLine={meta.amenitiesLine}
                    nightlyLabel={meta.nightlyLabel}
                    vatLine={meta.vatLine}
                    totalLabel={meta.totalLabel}
                  />
                ) : null
              }
              footer={
                <button
                  type="button"
                  className="font-avenir-regular w-full rounded-lg border border-solid border-[#0B1D37] bg-white py-2.5 text-center text-sm font-semibold leading-5 text-[#0B1D37] transition-colors hover:bg-[#F6F6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2"
                >
                  View Property Details
                </button>
              }
            />
          );
        })}
      </ul>
    </section>
  );
}
