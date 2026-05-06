'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, ShieldCheck } from 'lucide-react';

import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { BookingHubToggleSwitch } from '@/components/booking-hub-toggle';
import {
  PartnerPropertyStatusBar,
  type PartnerPropertyFilter,
} from '@/components/client-portal-figma/PartnerPropertyStatusBar';
import { cn } from '@/lib/utils';

/** Public assets — filenames include spaces (URL-encoded paths). */
const IMG_BELMONT = '/Belmont%20Reunion%2003.webp';
const IMG_CARDIFF = '/Cardiff.webp';
const IMG_HOUSE = '/House%20driveway.webp';

/** Listing / VAT pills — brand ink on surface for active + VAT; muted surface for inactive + no VAT. */
const PILL_ACTIVE = 'bg-[#0B1D37] text-white';
const PILL_INACTIVE = 'bg-[#F6F6F4] text-[#4B4E53]';
const PILL_VAT = 'bg-[#E6F7F6] text-[#007A76]';
const PILL_NO_VAT = 'bg-[#F6F6F4] text-[#4B4E53]';

/** Row model for partner property cards (static shell). */
export type PartnerPropertyListRow = {
  id: string;
  imageSrc: string;
  name: string;
  /** Listing is live (Active pill + filter). */
  listingActive: boolean;
  vatRegistered: boolean;
  address: string;
  beds: number;
  propertyType: string;
  pricePerNightLabel: string;
  reference?: string;
  approved: boolean;
  /** Initial toggle position (local UI only until API wiring). */
  toggleOn: boolean;
};

const DEFAULT_PROPERTIES: PartnerPropertyListRow[] = [
  {
    id: '1',
    imageSrc: IMG_BELMONT,
    name: 'City Centre Apartment',
    listingActive: true,
    vatRegistered: true,
    address: '14 Deansgate, Manchester M3 1RG',
    beds: 2,
    propertyType: 'Apartment',
    pricePerNightLabel: '£85/night',
    reference: 'GB123456789',
    approved: true,
    toggleOn: true,
  },
  {
    id: '2',
    imageSrc: IMG_CARDIFF,
    name: 'Northern Quarter Studio',
    listingActive: true,
    vatRegistered: false,
    address: '28 Hilton St, Manchester M1 1JQ',
    beds: 1,
    propertyType: 'Studio',
    pricePerNightLabel: '£65/night',
    approved: false,
    toggleOn: true,
  },
  {
    id: '3',
    imageSrc: IMG_HOUSE,
    name: 'Castlefield Townhouse',
    listingActive: false,
    vatRegistered: true,
    address: '5 Liverpool Road, Manchester M3 4NQ',
    beds: 3,
    propertyType: 'Townhouse',
    pricePerNightLabel: '£120/night',
    reference: 'GB987654321',
    approved: true,
    toggleOn: false,
  },
];

function specsLine(row: PartnerPropertyListRow): string {
  const parts = [
    `${row.beds} bed${row.beds === 1 ? '' : 's'}`,
    row.propertyType,
    row.pricePerNightLabel,
    row.reference,
  ].filter(Boolean);
  return parts.join(' · ');
}

function rowMatchesFilter(row: PartnerPropertyListRow, filter: PartnerPropertyFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'active') return row.listingActive;
  return !row.listingActive;
}

export type { PartnerPropertyFilter } from '@/components/client-portal-figma/PartnerPropertyStatusBar';

export type PartnerMyPropertiesViewProps = {
  className?: string;
  items?: PartnerPropertyListRow[];
  onAddProperty?: () => void;
  /** Opens manual listing form in edit shell with seeded dummy values (partner portal). */
  onEditProperty?: () => void;
};

/**
 * Partner portal **My Properties** — list shell aligned with Figma (static rows + local toggle state until API wiring).
 */
export function PartnerMyPropertiesView({
  className,
  items = DEFAULT_PROPERTIES,
  onAddProperty,
  onEditProperty,
}: PartnerMyPropertiesViewProps) {
  const [filter, setFilter] = useState<PartnerPropertyFilter>('all');
  const [toggleById, setToggleById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((r) => [r.id, r.toggleOn])),
  );

  const visibleRows = useMemo(() => items.filter((r) => rowMatchesFilter(r, filter)), [filter, items]);

  const handleToggle = useCallback((id: string) => {
    setToggleById((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <header className="min-w-0 space-y-1">
          <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
            My Properties
          </h1>
          <p className="font-avenir-regular max-w-2xl text-base font-normal leading-6 text-[#717680]">
            Manage your property listings and availability.
          </p>
        </header>
        <BookingHubPrimaryButton
          type="button"
          responsive
          responsiveCompact
          className="shrink-0 self-start"
          iconLeading={<Plus className="size-5" strokeWidth={2} aria-hidden />}
          onClick={onAddProperty}
        >
          Add Property
        </BookingHubPrimaryButton>
      </div>

      <PartnerPropertyStatusBar value={filter} onChange={setFilter} />

      <ul className="flex flex-col gap-3" role="list" aria-label="Your properties">
        {visibleRows.map((row) => {
          const titleId = `partner-property-title-${row.id}`;
          const toggleOn = toggleById[row.id] ?? row.toggleOn;
          return (
            <li key={row.id}>
              <article
                className={cn(
                  'flex flex-col gap-4 rounded-[12px] border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] transition-shadow sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5',
                  'hover:shadow-[0px_4px_12px_rgba(10,13,18,0.06)]',
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-[#F6F6F4] sm:size-[112px]">
                    <Image
                      src={row.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 112px"
                    />
                    {row.approved ? (
                      <span className="absolute left-1/2 top-2 z-[1] inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#00BAB5] px-2.5 py-1 font-avenir-regular text-[10px] font-bold leading-none text-white shadow-sm">
                        <ShieldCheck
                          className="size-[14px] shrink-0 text-white"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        Approved
                      </span>
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p id={titleId} className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">
                        {row.name}
                      </p>
                      <span
                        className={cn(
                          'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-[18px]',
                          row.listingActive ? PILL_ACTIVE : PILL_INACTIVE,
                        )}
                      >
                        {row.listingActive ? 'Active' : 'Inactive'}
                      </span>
                      <span
                        className={cn(
                          'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-[18px]',
                          row.vatRegistered ? PILL_VAT : PILL_NO_VAT,
                        )}
                      >
                        {row.vatRegistered ? 'VAT' : 'No VAT'}
                      </span>
                    </div>
                    <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{row.address}</p>
                    <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{specsLine(row)}</p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-row items-center justify-end gap-3 sm:gap-4">
                  <BookingHubToggleSwitch
                    size="md"
                    checked={toggleOn}
                    onCheckedChange={() => handleToggle(row.id)}
                    aria-labelledby={titleId}
                  />
                  <BookingHubSecondaryButton
                    type="button"
                    responsive
                    responsiveCompact
                    contentSized
                    className="!px-2.5 md:!px-3 lg:!px-3 xl:!px-3"
                    onClick={() => onEditProperty?.()}
                  >
                    Edit
                  </BookingHubSecondaryButton>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {visibleRows.length === 0 ? (
        <p className="font-avenir-regular text-center text-sm text-[#717680]">No properties in this category.</p>
      ) : null}
    </div>
  );
}
