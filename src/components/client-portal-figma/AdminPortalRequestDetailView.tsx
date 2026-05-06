'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Ban, Check, CheckCircle, ChevronRight, Eye, X } from 'lucide-react';

import { BookingHubPrimaryButton, BookingHubSecondaryButton, BookingHubSecondaryDeleteButton } from '@/components/booking-hub-button';
import { BH_GRID_GUTTER_GAP_CLASSES } from '@/components/booking-hub-grid';
import { bhRoundedPortalToolbarOutlineButton } from '@/components/booking-hub-radius';
import { InternalDistanceSpecCard } from '@/components/internal-spec';
import { LateOfferBadge } from '@/components/portal-offer-badges';
import { PORTAL_DASHBOARD_SECTION_HEADING_CLASS } from '@/components/client-portal-figma/portalDashboardSectionHeading';
import type { AdminPortalRequestTableRow } from '@/components/client-portal-figma/AdminPortalRequestsView';
import { cn } from '@/lib/utils';

export type AdminRequestOfferRowStatus = 'pending' | 'included' | 'rejected';

export type AdminRequestOfferTableRow = {
  id: string;
  partner: string;
  property: string;
  pricePerNight: string;
  vatMode: 'vat' | 'no-vat';
  estTotal: string;
  estCommission: string;
  available: boolean;
  notes: string;
  status: AdminRequestOfferRowStatus;
  /** When true, show the reusable **Late offer** pill beside the partner name (e.g. shortlisted requests). */
  lateOffer?: boolean;
};

export type AdminRequestDetailContent = {
  reference: string;
  subtitle: string;
  headerStatusLabel: string;
  headerStatusClass: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  budgetPerNight: string;
  specialRequirements: string;
  offers: AdminRequestOfferTableRow[];
};

const DETAIL_BY_REFERENCE: Record<string, AdminRequestDetailContent> = {
  'RQ-2024-0156': {
    reference: 'RQ-2024-0156',
    subtitle: 'Acme Council · James Davies · Bristol',
    headerStatusLabel: 'New',
    headerStatusClass: 'bg-[#E8A23E] text-white',
    checkIn: '15 Apr 2024',
    checkOut: '15 Jul 2024',
    nights: 91,
    guests: 2,
    budgetPerNight: '£85',
    specialRequirements: 'Ground floor access required. Parking for 2 vehicles.',
    offers: [
      {
        id: 'o1',
        partner: 'City Living Ltd',
        property: 'Victoria Apartments',
        pricePerNight: '£82',
        vatMode: 'vat',
        estTotal: '£8,856',
        estCommission: '£1,107',
        available: true,
        notes: 'Available from April 10…',
        status: 'pending',
      },
      {
        id: 'o2',
        partner: 'Haven Properties',
        property: 'Station House',
        pricePerNight: '£78',
        vatMode: 'vat',
        estTotal: '£8,442',
        estCommission: '£1,055',
        available: true,
        notes: 'Flexible check-in window…',
        status: 'pending',
      },
      {
        id: 'o3',
        partner: 'Metro Stays',
        property: 'Harbour Studios',
        pricePerNight: '£88',
        vatMode: 'no-vat',
        estTotal: '£9,504',
        estCommission: '£1,188',
        available: false,
        notes: 'Limited parking…',
        status: 'pending',
      },
      {
        id: 'o4',
        partner: 'City Living Ltd',
        property: 'Canal View Suites',
        pricePerNight: '£80',
        vatMode: 'vat',
        estTotal: '£8,640',
        estCommission: '£1,080',
        available: true,
        notes: 'Wheelchair accessible…',
        status: 'pending',
      },
      {
        id: 'o5',
        partner: 'Haven Properties',
        property: 'Riverside Court',
        pricePerNight: '£76',
        vatMode: 'vat',
        estTotal: '£8,208',
        estCommission: '£1,026',
        available: true,
        notes: 'Ground floor confirmed…',
        status: 'pending',
      },
      {
        id: 'o6',
        partner: 'Metro Lettings',
        property: 'Park Lane Residences',
        pricePerNight: '£90',
        vatMode: 'vat',
        estTotal: '£9,720',
        estCommission: '£1,215',
        available: true,
        notes: 'Two parking spaces…',
        status: 'pending',
      },
    ],
  },
  'BR-2024-0889': {
    reference: 'BR-2024-0889',
    subtitle: 'TechStart Inc · Emma Wilson · Leeds',
    headerStatusLabel: 'Shortlisted',
    headerStatusClass: 'bg-[#0B1D37] text-white',
    checkIn: '20 Mar 2026',
    checkOut: '27 Mar 2026',
    nights: 7,
    guests: 2,
    budgetPerNight: '£980',
    specialRequirements: 'No special requirements on file for this request.',
    offers: [
      {
        id: 's1',
        partner: 'City Living Ltd',
        property: 'Victoria Apartments',
        pricePerNight: '£82',
        vatMode: 'vat',
        estTotal: '£574',
        estCommission: '£72',
        available: true,
        notes: 'Available from March 18…',
        status: 'pending',
      },
      {
        id: 's2',
        partner: 'Haven Properties',
        property: 'Station House',
        pricePerNight: '£78',
        vatMode: 'vat',
        estTotal: '£546',
        estCommission: '£68',
        available: true,
        notes: 'Flexible check-in window…',
        status: 'pending',
      },
      {
        id: 's3',
        partner: 'Metro Stays',
        property: 'Harbour Studios',
        pricePerNight: '£88',
        vatMode: 'no-vat',
        estTotal: '£616',
        estCommission: '£77',
        available: false,
        notes: 'Limited parking…',
        status: 'pending',
      },
      {
        id: 's4',
        partner: 'Metro Lettings',
        property: 'Park Lane Residences',
        pricePerNight: '£90',
        vatMode: 'vat',
        estTotal: '£630',
        estCommission: '£79',
        available: true,
        notes: 'Two parking spaces…',
        status: 'pending',
        lateOffer: true,
      },
    ],
  },
};

export function getAdminRequestDetail(reference: string): AdminRequestDetailContent | null {
  return DETAIL_BY_REFERENCE[reference] ?? null;
}

function requestTableRowToHeaderMeta(
  status: AdminPortalRequestTableRow['status'],
): { label: string; className: string } {
  switch (status) {
    case 'new':
      return { label: 'New', className: 'bg-[#E8A23E] text-white' };
    case 'in-progress':
      return { label: 'In Progress', className: 'bg-[#0B1D37] text-white' };
    case 'shortlisted':
      return { label: 'Shortlisted', className: 'bg-[#0B1D37] text-white' };
    case 'confirmed':
      return { label: 'Confirmed', className: 'bg-[#00BAB5] text-white' };
    case 'cancelled':
      return { label: 'Cancelled', className: 'bg-[#f6f6f4] text-[#F04438]' };
    case 'expired':
      return { label: 'Expired', className: 'bg-[#E9EAEB] text-[#4B4E53]' };
  }
}

/** Resolves detail content for the reusable admin request detail view (static demo row or table-driven shell). */
export function getAdminRequestDetailForTableRow(row: AdminPortalRequestTableRow): AdminRequestDetailContent {
  const preset = DETAIL_BY_REFERENCE[row.reference];
  if (preset) return preset;
  const header = requestTableRowToHeaderMeta(row.status);
  return {
    reference: row.reference,
    subtitle: `${row.company} · ${row.client} · ${row.location}`,
    headerStatusLabel: header.label,
    headerStatusClass: header.className,
    checkIn: row.checkIn,
    checkOut: row.checkOut,
    nights: row.nights,
    guests: row.guests,
    budgetPerNight: row.budgetExcVat,
    specialRequirements: 'No special requirements on file for this request.',
    offers: [],
  };
}

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-5';

const labelClass =
  'font-avenir-regular mb-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]';

function SummaryCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cn(cardShell)}>
      <p className={labelClass}>{label}</p>
      <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{children}</p>
    </div>
  );
}

function offerStatusBadge(status: AdminRequestOfferRowStatus): { label: string; className: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', className: 'bg-[#FDB022] text-white' };
    case 'included':
      return { label: 'Included', className: 'bg-[#00BAB5] text-white' };
    case 'rejected':
      return { label: 'Rejected', className: 'bg-[#E9EAEB] text-[#4B4E53]' };
  }
}

/** Checkbox drives status: checked → included; unchecked after check → rejected; never checked → pending. */
function derivedOfferRowStatus(
  offerId: string,
  selectedIds: ReadonlySet<string>,
  rejectedIds: ReadonlySet<string>,
): AdminRequestOfferRowStatus {
  if (selectedIds.has(offerId)) return 'included';
  if (rejectedIds.has(offerId)) return 'rejected';
  return 'pending';
}

const thClassOffer =
  'font-avenir-regular px-3 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-4';
const tdClassOffer = 'font-avenir-regular px-3 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-4';

export type AdminPortalRequestDetailViewProps = {
  detail: AdminRequestDetailContent;
  onBack: () => void;
  className?: string;
};

type OfferShortlistSelection = {
  selectedIds: Set<string>;
  /** Offer was unchecked after having been included (distinguishes from initial pending). */
  rejectedIds: Set<string>;
};

/**
 * Admin **request detail** — summary, special requirements, partner-offers shortlist table, admin notes.
 * Reused from Requests → View (`getAdminRequestDetailForTableRow` + shell state in `AdminPortalFigmaScreen`).
 */
export function AdminPortalRequestDetailView({ detail, onBack, className }: AdminPortalRequestDetailViewProps) {
  const [offerSelection, setOfferSelection] = useState<OfferShortlistSelection>(() => ({
    selectedIds: new Set(),
    rejectedIds: new Set(),
  }));

  const toggleOffer = (id: string) => {
    setOfferSelection((prev) => {
      const selectedIds = new Set(prev.selectedIds);
      const rejectedIds = new Set(prev.rejectedIds);
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
        rejectedIds.add(id);
      } else {
        selectedIds.add(id);
        rejectedIds.delete(id);
      }
      return { selectedIds, rejectedIds };
    });
  };

  const selectedCount = offerSelection.selectedIds.size;

  return (
    <div
      className={cn(
        'flex w-full min-w-0 max-w-full flex-col px-6 pb-0 sm:px-8 lg:px-10',
        className,
      )}
    >
      <div className="mb-8 flex flex-col gap-6">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 rounded-lg text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#0B1D37]"
          aria-label="Back to requests"
        >
          <svg className="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
              {detail.reference}
            </h1>
            <p className="font-avenir-regular mt-2 text-sm leading-5 text-[#717680]">{detail.subtitle}</p>
          </div>
          <span
            className={cn(
              'inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold leading-[18px]',
              detail.headerStatusClass,
            )}
          >
            {detail.headerStatusLabel}
          </span>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Check-in">{detail.checkIn}</SummaryCard>
        <SummaryCard label="Check-out">{detail.checkOut}</SummaryCard>
        <SummaryCard label="Nights">{detail.nights} nights</SummaryCard>
        <SummaryCard label="Guests">{detail.guests}</SummaryCard>
        <SummaryCard label="Budget / night">{detail.budgetPerNight}</SummaryCard>
      </div>

      <section className="mt-10" aria-labelledby="admin-request-special-heading">
        <h2 id="admin-request-special-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Special requirements
        </h2>
        <div className={cn(cardShell)}>
          <p className="font-avenir-regular text-sm leading-5 text-[#0B1D37]">{detail.specialRequirements}</p>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="admin-request-matching-radius-heading">
        <h2 id="admin-request-matching-radius-heading" className="sr-only">
          Matching radius (internal)
        </h2>
        <InternalDistanceSpecCard />
      </section>

      <div className={cn('mt-8 flex flex-wrap items-center', BH_GRID_GUTTER_GAP_CLASSES)}>
        {detail.headerStatusLabel === 'Shortlisted' ? (
          <>
            <BookingHubSecondaryButton
              type="button"
              size="sm"
              className={bhRoundedPortalToolbarOutlineButton()}
              iconLeading={<Eye className="size-4" strokeWidth={2} aria-hidden />}
            >
              View Shortlist
            </BookingHubSecondaryButton>
            <BookingHubSecondaryButton
              type="button"
              size="sm"
              className={bhRoundedPortalToolbarOutlineButton()}
              iconLeading={<X className="size-4" strokeWidth={2} aria-hidden />}
            >
              Unpublish
            </BookingHubSecondaryButton>
            <BookingHubSecondaryDeleteButton
              type="button"
              size="sm"
              className={bhRoundedPortalToolbarOutlineButton()}
              iconLeading={<Ban className="size-4" strokeWidth={2} aria-hidden />}
            >
              Cancel Request
            </BookingHubSecondaryDeleteButton>
          </>
        ) : (
          <>
            <BookingHubPrimaryButton
              type="button"
              size="sm"
              iconLeading={<CheckCircle className="size-4" strokeWidth={2} aria-hidden />}
            >
              Publish Shortlist ({selectedCount})
            </BookingHubPrimaryButton>
            <BookingHubSecondaryDeleteButton
              type="button"
              size="sm"
              iconLeading={<Ban className="size-4" strokeWidth={2} aria-hidden />}
            >
              Cancel Request
            </BookingHubSecondaryDeleteButton>
          </>
        )}
      </div>

      <section className="mt-12 min-w-0" aria-labelledby="admin-request-offers-heading">
        <h2 id="admin-request-offers-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Partner offers ({detail.offers.length})
        </h2>
        <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
          <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="min-w-[1100px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e9eaeb] bg-white">
                  <th className={cn(thClassOffer, 'w-[52px]')} aria-label="Select for shortlist" />
                  <th className={thClassOffer}>Partner</th>
                  <th className={thClassOffer}>Property</th>
                  <th className={thClassOffer}>Price/night</th>
                  <th className={thClassOffer}>VAT</th>
                  <th className={thClassOffer}>Est. total</th>
                  <th className={thClassOffer}>Est. commission</th>
                  <th className={thClassOffer}>Available</th>
                  <th className={cn(thClassOffer, 'min-w-[140px]')}>Notes</th>
                  <th className={cn(thClassOffer, 'w-[1%] whitespace-nowrap')} aria-label="Property link" />
                  <th className={cn(thClassOffer, 'w-[1%] whitespace-nowrap pr-5')}>Status</th>
                </tr>
              </thead>
              <tbody>
                {detail.offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="font-avenir-regular px-4 py-12 text-center text-sm text-[#717680] sm:px-5"
                    >
                      No partner offers for this request yet.
                    </td>
                  </tr>
                ) : (
                  detail.offers.map((row) => {
                    const rowStatus = derivedOfferRowStatus(
                      row.id,
                      offerSelection.selectedIds,
                      offerSelection.rejectedIds,
                    );
                    const statusMeta = offerStatusBadge(rowStatus);
                    return (
                      <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                        <td className={cn(tdClassOffer, 'align-middle')}>
                          <input
                            type="checkbox"
                            checked={offerSelection.selectedIds.has(row.id)}
                            onChange={() => toggleOffer(row.id)}
                            className="size-4 rounded border-[#D0D5DD] text-[#0B1D37] accent-[#0B1D37]"
                            aria-label={`Select offer ${row.property}`}
                          />
                        </td>
                        <td className={cn(tdClassOffer, 'align-middle')}>
                          <div className="flex min-w-0 flex-nowrap items-center gap-2">
                            <span className="min-w-0 truncate font-medium text-[#0B1D37]" title={row.partner}>
                              {row.partner}
                            </span>
                            {row.lateOffer ? (
                              <span className="shrink-0">
                                <LateOfferBadge />
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className={tdClassOffer}>{row.property}</td>
                        <td className={tdClassOffer}>{row.pricePerNight}</td>
                        <td className={tdClassOffer}>
                          <span
                            className={cn(
                              'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold leading-[18px]',
                              row.vatMode === 'vat'
                                ? 'bg-[#E6F7F6] text-[#027A77]'
                                : 'bg-[#E9EAEB] text-[#4B4E53]',
                            )}
                          >
                            {row.vatMode === 'vat' ? 'VAT' : 'No VAT'}
                          </span>
                        </td>
                        <td className={tdClassOffer}>{row.estTotal}</td>
                        <td className={tdClassOffer}>{row.estCommission}</td>
                        <td className={tdClassOffer}>
                          <span
                            className="inline-flex items-center justify-center"
                            aria-label={row.available ? 'Available' : 'Not available'}
                          >
                            {row.available ? (
                              <Check className="size-5 text-[#12B76A]" strokeWidth={2.25} aria-hidden />
                            ) : (
                              <X className="size-5 text-[#717680]" strokeWidth={2} aria-hidden />
                            )}
                          </span>
                        </td>
                        <td className={cn(tdClassOffer, 'max-w-[200px] truncate text-[#4B4E53]')} title={row.notes}>
                          {row.notes}
                        </td>
                        <td className={cn(tdClassOffer, 'whitespace-nowrap')}>
                          <button
                            type="button"
                            className="font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                          >
                            View Property
                            <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                          </button>
                        </td>
                        <td className={cn(tdClassOffer, 'whitespace-nowrap pr-5')}>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                              statusMeta.className,
                            )}
                          >
                            {statusMeta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="admin-request-notes-heading">
        <h2 id="admin-request-notes-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Admin notes
        </h2>
        <div className={cn(cardShell, 'p-5 sm:p-6')}>
          <label htmlFor="admin-request-internal-notes" className="sr-only">
            Internal notes for this request
          </label>
          <textarea
            id="admin-request-internal-notes"
            rows={5}
            placeholder="Add internal notes about this request..."
            className="font-avenir-regular box-border min-h-[120px] w-full resize-y rounded-lg border border-solid border-[#e9eaeb] bg-white px-3 py-2.5 text-sm leading-5 text-[#0B1D37] shadow-[0_1px_2px_rgba(11,29,55,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-[#717680] focus:border-[#00BAB5]/40 focus:ring-2 focus:ring-[#00BAB5]/20"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-avenir-regular text-xs leading-4 text-[#717680]">Not visible to clients or partners</p>
            <BookingHubPrimaryButton type="button" size="sm" className="w-full shrink-0 sm:w-auto">
              Save Note
            </BookingHubPrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
