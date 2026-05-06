'use client';

import type { ReactNode } from 'react';

import { Check, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Row fields consumed by the directory / shortlist property card (admin properties grid uses a superset). */
export type PortalPropertyDirectoryCardRow = {
  id: string;
  propertyName: string;
  partnerName: string;
  location: string;
  propertyType: string;
  beds: number;
  guests: number;
  vatRegistered: boolean;
  reviewApproved: boolean | null;
  opsStatus: 'active' | 'inactive';
  cardImageSeed: string;
};

export type PortalPropertyDirectoryCardSelection = {
  selected: boolean;
  onSelectedChange: (next: boolean) => void;
};

export type PortalPropertyDirectoryCardProps = {
  row: PortalPropertyDirectoryCardRow;
  className?: string;
  /** Render as `<li>` (admin card grid) or `<div>`. */
  as?: 'li' | 'div';
  /** Optional block after the standard meta block (e.g. shortlist pricing). */
  afterMeta?: ReactNode;
  /** Optional full-width footer (e.g. “View Property Details”). */
  footer?: ReactNode;
  /** Shortlist: partner-network badge (top-left), checkbox (top-right), teal border when selected. */
  selection?: PortalPropertyDirectoryCardSelection;
  /** When true with `selection`, hides the partner teal link row (shortlist layout). */
  suppressPartnerLink?: boolean;
  /** Hides the bedrooms / guests / VAT pill row (e.g. shortlist uses `afterMeta` for specs and VAT copy). */
  hideBedGuestStats?: boolean;
};

/**
 * Property card used in **Admin → Properties** card grid; same shell for **client shortlist** with optional selection.
 * Visual baseline copied from `AdminPortalPropertiesView` `AdminPortalPropertyCard`.
 */
export function PortalPropertyDirectoryCard({
  row,
  className,
  as = 'li',
  afterMeta,
  footer,
  selection,
  suppressPartnerLink,
  hideBedGuestStats,
}: PortalPropertyDirectoryCardProps) {
  const imageSrc = `https://picsum.photos/seed/${encodeURIComponent(row.cardImageSeed)}/800/520`;

  const defaultOverlayBadge =
    row.reviewApproved === true ? (
      <span className="font-avenir-regular inline-flex items-center gap-1 rounded-full bg-[#0B1D37] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white shadow-sm">
        <ShieldCheck className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
        Approved
      </span>
    ) : row.opsStatus === 'inactive' ? (
      <span className="font-avenir-regular inline-flex rounded-full bg-[#E9EAEB] px-2.5 py-1 text-xs font-semibold leading-[18px] text-[#4B4E53] shadow-sm">
        Inactive
      </span>
    ) : null;

  const partnerNetworkBadge = selection ? (
    <span className="font-avenir-regular inline-flex max-w-[min(100%,220px)] items-center rounded-full bg-[#0B1D37] px-2.5 py-1 text-center text-[10px] font-semibold leading-snug text-white shadow-sm sm:text-xs sm:leading-[18px]">
      Approved Partner Network
    </span>
  ) : null;

  const checkboxControl = selection ? (
    <button
      type="button"
      role="checkbox"
      aria-checked={selection.selected}
      onClick={() => selection.onSelectedChange(!selection.selected)}
      className={cn(
        'absolute right-2 top-2 z-[2] flex size-8 items-center justify-center rounded-md border-2 outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
        selection.selected ? 'border-[#00BAB5] bg-[#00BAB5] text-white' : 'border-[#d5d7da] bg-white text-transparent',
      )}
    >
      {selection.selected ? <Check className="size-4 text-white" strokeWidth={2.5} aria-hidden /> : null}
    </button>
  ) : null;

  const shellClass = cn(
    'flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]',
    selection && selection.selected ? 'border-2 border-solid border-[#00BAB5]' : 'border border-solid border-[#e9eaeb]',
    className,
  );

  const inner = (
    <>
      <div className="relative aspect-[16/9] w-full shrink-0 bg-[#F6F6F4]">
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {selection ? (
          <>
            {partnerNetworkBadge ? <div className="absolute left-2 top-2 z-[1] max-w-[calc(100%-3.5rem)]">{partnerNetworkBadge}</div> : null}
            {checkboxControl}
          </>
        ) : defaultOverlayBadge ? (
          <div className="absolute right-2 top-2 z-[1]">{defaultOverlayBadge}</div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-4 py-3">
        <h3 className="font-avenir-regular text-base font-semibold leading-[22px] text-[#0B1D37]">{row.propertyName}</h3>
        {!suppressPartnerLink && row.partnerName.trim() ? (
          <button
            type="button"
            className="font-avenir-regular w-fit text-left text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884] hover:underline"
          >
            {row.partnerName}
          </button>
        ) : null}
        {row.location ? <p className="font-avenir-regular text-sm leading-5 text-[#717680]">{row.location}</p> : null}
        {row.propertyType ? <p className="font-avenir-regular text-sm leading-5 text-[#717680]">{row.propertyType}</p> : null}
        {!hideBedGuestStats ? (
          <div className="mt-auto flex items-end justify-between gap-3 pt-1">
            <div className="flex gap-6">
              <div>
                <p className="font-avenir-regular text-lg font-semibold tabular-nums leading-7 text-[#0B1D37]">{row.beds}</p>
                <p className="font-avenir-regular text-xs font-medium leading-4 text-[#717680]">Bedrooms</p>
              </div>
              <div>
                <p className="font-avenir-regular text-lg font-semibold tabular-nums leading-7 text-[#0B1D37]">{row.guests}</p>
                <p className="font-avenir-regular text-xs font-medium leading-4 text-[#717680]">Guests</p>
              </div>
            </div>
            {row.vatRegistered ? (
              <span className="font-avenir-regular inline-flex shrink-0 rounded-full bg-[#00BAB5] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                VAT
              </span>
            ) : (
              <span className="inline-block size-6 shrink-0" aria-hidden />
            )}
          </div>
        ) : null}
      </div>
      {afterMeta ? <div className="border-t border-[#e9eaeb] px-4 pb-2.5 pt-2">{afterMeta}</div> : null}
      {footer ? (
        <div className="border-t border-[#e9eaeb] px-4 pb-3 pt-2.5">
          {footer}
        </div>
      ) : null}
    </>
  );

  if (as === 'div') {
    return (
      <div className={shellClass} data-portal-property-card>
        {inner}
      </div>
    );
  }

  return (
    <li className={shellClass} data-portal-property-card>
      {inner}
    </li>
  );
}
