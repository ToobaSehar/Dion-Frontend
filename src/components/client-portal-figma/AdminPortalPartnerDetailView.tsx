'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, ChevronsUpDown, Mail, MapPin, Phone } from 'lucide-react';

import {
  getAdminPartnerDetailBookingRows,
  partnerDetailBookingStatusBadgeClass,
  partnerDetailBookingStatusLabel,
} from '@/components/client-portal-figma/adminPartnerDetailBookings';
import {
  getAdminPartnerDetailPayoutRows,
  partnerDetailPayoutStatusBadgeClass,
  partnerDetailPayoutStatusLabel,
} from '@/components/client-portal-figma/adminPartnerDetailPayouts';
import { adminPortalBookingDetailHref } from '@/components/client-portal-figma/adminPortalFigmaMainView';
import type { AdminPartnerPropertyDetailContent } from '@/components/client-portal-figma/adminPartnerDetailProperties';
import {
  getAdminPartnerDetailPropertyRows,
  partnerDetailPropertyGallerySeeds,
  resolvePartnerPropertyDetail,
} from '@/components/client-portal-figma/adminPartnerDetailProperties';
import { AdminPartnerPropertyDetailModal } from '@/components/client-portal-figma/AdminPartnerPropertyDetailModal';
import { AdminPartnerPropertyPhotoGalleryModal } from '@/components/client-portal-figma/AdminPartnerPropertyPhotoGalleryModal';
import type { AdminPortalPartnerTableRow } from '@/components/client-portal-figma/AdminPortalPartnersView';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

export type AdminPartnerDetailTab = 'overview' | 'properties' | 'bookings' | 'payouts' | 'notes';

export type AdminPortalPartnerDetailContent = {
  businessName: string;
  contact: string;
  type: string;
  email: string;
  phone: string;
  statusLabel: string;
  statusClassName: string;
  businessAddress: string;
  stripeStatusLabel: string;
  activeBookings: string;
  completedBookings: string;
  totalPaidOut: string;
  partnerSince: string;
};

const DETAIL_TAB_ITEMS = [
  { id: 'overview' as const, label: 'Overview' },
  { id: 'properties' as const, label: 'Properties' },
  { id: 'bookings' as const, label: 'Bookings' },
  { id: 'payouts' as const, label: 'Payouts' },
  { id: 'notes' as const, label: 'Notes' },
];

/** Hero partner row `id` → curated overview metrics (matches design snapshots where provided). */
const PARTNER_DETAIL_PRESETS: Partial<
  Record<
    string,
    Pick<
      AdminPortalPartnerDetailContent,
      | 'businessAddress'
      | 'stripeStatusLabel'
      | 'activeBookings'
      | 'completedBookings'
      | 'totalPaidOut'
      | 'partnerSince'
    >
  >
> = {
  '1': {
    businessAddress: '12 High Street, Bristol, BS1 4DJ',
    stripeStatusLabel: 'Stripe Ready',
    activeBookings: '4',
    completedBookings: '12',
    totalPaidOut: '£48,200',
    partnerSince: '1 Nov 2023',
  },
};

function defaultDetailFields(
  row: AdminPortalPartnerTableRow,
): Pick<
  AdminPortalPartnerDetailContent,
  'businessAddress' | 'stripeStatusLabel' | 'activeBookings' | 'completedBookings' | 'totalPaidOut' | 'partnerSince'
> {
  const n = Number.parseInt(row.properties, 10);
  const safe = Number.isFinite(n) ? n : 6;
  const paid = safe * 3200 + safe * 800;
  return {
    businessAddress: `${safe + 10} Victoria Street, Birmingham, B2 4QA`,
    stripeStatusLabel: 'Stripe Ready',
    activeBookings: String(Math.min(Math.max(safe - 4, 1), 12)),
    completedBookings: String(Math.min(safe + 10, 48)),
    totalPaidOut: `£${paid.toLocaleString('en-GB')}`,
    partnerSince: `${1 + (safe % 28)} Jan 2023`,
  };
}

/** Builds partner detail shell content from the partners directory mock row. */
export function resolveAdminPartnerDetail(row: AdminPortalPartnerTableRow): AdminPortalPartnerDetailContent {
  const preset = PARTNER_DETAIL_PRESETS[row.id];
  const fallback = defaultDetailFields(row);
  const extras = { ...fallback, ...preset };

  return {
    businessName: row.businessName,
    contact: row.contact,
    type: row.type,
    email: row.email,
    phone: row.phone,
    statusLabel: 'Active',
    statusClassName: 'rounded-full bg-[#00BAB5] px-3 py-1.5 text-xs font-semibold leading-[18px] text-white',
    ...extras,
  };
}

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-6';

const labelClass =
  'font-avenir-regular mb-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]';

function ContactBlock({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-[#717680]" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className={labelClass}>{label}</p>
        <div className="font-avenir-regular text-sm leading-5 text-[#0B1D37]">{children}</div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn(cardShell)}>
      <p className={labelClass}>{label}</p>
      <p className="font-avenir-regular text-2xl font-semibold leading-8 tracking-tight text-[#0B1D37] sm:text-[26px] sm:leading-9">
        {value}
      </p>
    </div>
  );
}

const partnerPropThClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const partnerPropTdClass =
  'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

function PartnerDetailPropertiesTab({
  partnerId,
  partnerName,
  onPropertyDetailModalOpenChange,
}: {
  partnerId: string;
  partnerName: string;
  onPropertyDetailModalOpenChange?: (open: boolean) => void;
}) {
  const rows = useMemo(() => getAdminPartnerDetailPropertyRows(partnerId, partnerName), [partnerId, partnerName]);
  const [gallery, setGallery] = useState<null | { propertyName: string; seeds: string[] }>(null);
  const [propertyDetail, setPropertyDetail] = useState<AdminPartnerPropertyDetailContent | null>(null);

  useEffect(() => {
    onPropertyDetailModalOpenChange?.(propertyDetail != null);
  }, [propertyDetail, onPropertyDetailModalOpenChange]);

  return (
    <>
    <AdminPartnerPropertyPhotoGalleryModal
      open={gallery != null}
      onClose={() => setGallery(null)}
      propertyName={gallery?.propertyName ?? ''}
      imageSeeds={gallery?.seeds ?? []}
    />
    <AdminPartnerPropertyDetailModal open={propertyDetail != null} onClose={() => setPropertyDetail(null)} detail={propertyDetail} />
    <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9eaeb] bg-white">
              <th className={cn(partnerPropThClass, 'w-[1%] whitespace-nowrap')}>Photo</th>
              <th className={partnerPropThClass}>Property name</th>
              <th className={partnerPropThClass}>Location</th>
              <th className={cn(partnerPropThClass, 'text-center')}>Beds</th>
              <th className={partnerPropThClass}>Rate/night</th>
              <th className={partnerPropThClass}>VAT</th>
              <th className={partnerPropThClass}>Approved</th>
              <th className={partnerPropThClass}>Available</th>
              <th className={partnerPropThClass}>Status</th>
              <th className={cn(partnerPropThClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                  No properties for this partner.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                  <td className={cn(partnerPropTdClass, 'align-middle')}>
                    <button
                      type="button"
                      onClick={() =>
                        setGallery({
                          propertyName: row.propertyName,
                          seeds: [...partnerDetailPropertyGallerySeeds(row)],
                        })
                      }
                      className="relative block size-14 shrink-0 overflow-hidden rounded-lg bg-[#F6F6F4] text-left outline-none ring-[#00BAB5] transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 sm:size-[72px]"
                      aria-label={`Open photo gallery for ${row.propertyName}`}
                    >
                      <img
                        src={`https://picsum.photos/seed/${encodeURIComponent(row.cardImageSeed)}/200/200`}
                        alt=""
                        className="size-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {row.extraPhotoCount != null && row.extraPhotoCount > 0 ? (
                        <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-semibold leading-none text-white">
                          +{row.extraPhotoCount}
                        </span>
                      ) : null}
                    </button>
                  </td>
                  <td className={cn(partnerPropTdClass, 'font-semibold align-middle')}>{row.propertyName}</td>
                  <td className={cn(partnerPropTdClass, 'align-middle text-[#717680]')}>{row.location}</td>
                  <td className={cn(partnerPropTdClass, 'align-middle text-center tabular-nums')}>{row.beds}</td>
                  <td className={cn(partnerPropTdClass, 'align-middle text-[#4B4E53]')}>{row.rateExcVatLabel}</td>
                  <td className={cn(partnerPropTdClass, 'align-middle')}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        row.vatRegistered ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                      )}
                    >
                      {row.vatRegistered ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className={cn(partnerPropTdClass, 'align-middle')}>
                    {row.reviewApproved ? (
                      <span className="font-avenir-regular inline-flex items-center gap-1 rounded-full bg-[#0B1D37] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                        <Check className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                        Approved
                      </span>
                    ) : (
                      <span className="text-[#717680]">—</span>
                    )}
                  </td>
                  <td className={cn(partnerPropTdClass, 'align-middle')}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        row.listingAvailable ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                      )}
                    >
                      {row.listingAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className={cn(partnerPropTdClass, 'align-middle')}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        row.opsStatus === 'active' ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                      )}
                    >
                      {row.opsStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={cn(partnerPropTdClass, 'pr-6 text-right align-middle')}>
                    <button
                      type="button"
                      onClick={() => setPropertyDetail(resolvePartnerPropertyDetail(row, partnerName))}
                      className="font-avenir-regular inline-flex items-center justify-end gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                    >
                      View
                      <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

const partnerBookingsThClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const partnerBookingsTdClass =
  'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

function PartnerDetailBookingsTab({ partnerId }: { partnerId: string }) {
  const rows = useMemo(() => getAdminPartnerDetailBookingRows(partnerId), [partnerId]);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1040px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9eaeb] bg-white">
              <th className={partnerBookingsThClass}>Reference</th>
              <th className={partnerBookingsThClass}>Client</th>
              <th className={partnerBookingsThClass}>Property</th>
              <th className={partnerBookingsThClass}>Check-in</th>
              <th className={partnerBookingsThClass}>Check-out</th>
              <th className={partnerBookingsThClass}>Total amount</th>
              <th className={partnerBookingsThClass}>Status</th>
              <th className={cn(partnerBookingsThClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                  No bookings on file for this partner.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                  <td className={cn(partnerBookingsTdClass, 'font-semibold')}>{row.reference}</td>
                  <td className={partnerBookingsTdClass}>{row.client}</td>
                  <td className={partnerBookingsTdClass}>{row.property}</td>
                  <td className={partnerBookingsTdClass}>{row.checkIn}</td>
                  <td className={partnerBookingsTdClass}>{row.checkOut}</td>
                  <td className={cn(partnerBookingsTdClass, 'tabular-nums')}>{row.totalAmount}</td>
                  <td className={partnerBookingsTdClass}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        partnerDetailBookingStatusBadgeClass(row.status),
                      )}
                    >
                      {partnerDetailBookingStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className={cn(partnerBookingsTdClass, 'pr-6 text-right')}>
                    <Link
                      href={adminPortalBookingDetailHref(row.bookingRowId)}
                      className="font-avenir-regular inline-flex items-center justify-end gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                    >
                      View
                      <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const partnerPayoutsThClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const partnerPayoutsTdClass =
  'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

function PartnerDetailPayoutsTab({ partnerId }: { partnerId: string }) {
  const rows = useMemo(() => getAdminPartnerDetailPayoutRows(partnerId), [partnerId]);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9eaeb] bg-white">
              <th className={partnerPayoutsThClass}>Booking ref</th>
              <th className={partnerPayoutsThClass}>Property</th>
              <th className={partnerPayoutsThClass}>Check-in</th>
              <th className={partnerPayoutsThClass}>Net payout</th>
              <th className={partnerPayoutsThClass}>Status</th>
              <th className={partnerPayoutsThClass}>Scheduled date</th>
              <th className={cn(partnerPayoutsThClass, 'w-[1%] whitespace-nowrap pr-6')}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                  No payouts on file for this partner.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                  <td className={cn(partnerPayoutsTdClass, 'font-semibold')}>{row.bookingRef}</td>
                  <td className={partnerPayoutsTdClass}>{row.property}</td>
                  <td className={partnerPayoutsTdClass}>{row.checkIn}</td>
                  <td className={cn(partnerPayoutsTdClass, 'tabular-nums')}>{row.netPayout}</td>
                  <td className={partnerPayoutsTdClass}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        partnerDetailPayoutStatusBadgeClass(row.status),
                      )}
                    >
                      {partnerDetailPayoutStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className={partnerPayoutsTdClass}>{row.scheduledDate}</td>
                  <td className={cn(partnerPayoutsTdClass, 'pr-6 align-middle')}>
                    {row.action === 'hold' ? (
                      <button
                        type="button"
                        className="font-avenir-regular inline-flex rounded-full border border-solid border-[#E9EAEB] bg-white px-3 py-1.5 text-xs font-semibold leading-[18px] text-[#4B4E53] transition-colors hover:bg-[#F6F6F4]"
                      >
                        Hold
                      </button>
                    ) : null}
                    {row.action === 'release' ? (
                      <button
                        type="button"
                        className="font-avenir-regular inline-flex rounded-full bg-[#00BAB5] px-3 py-1.5 text-xs font-semibold leading-[18px] text-white transition-colors hover:bg-[#009a96]"
                      >
                        Release
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PartnerDetailNotesTab() {
  const [internalNotes, setInternalNotes] = useState('');

  return (
    <div className="mt-6 rounded-xl border border-solid border-[#e9eaeb] bg-white p-6 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-8">
      <textarea
        value={internalNotes}
        onChange={(e) => setInternalNotes(e.target.value)}
        placeholder="Add internal notes about this partner..."
        rows={8}
        className="font-avenir-regular min-h-[180px] w-full resize-y rounded-lg border border-solid border-[#e9eaeb] bg-white px-3 py-3 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
        aria-label="Internal notes about this partner"
      />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-avenir-regular text-xs leading-4 text-[#717680]">Not visible to clients or partners</p>
        <BookingHubPrimaryButton type="button" size="sm" className="w-full shrink-0 sm:w-auto">
          Save Note
        </BookingHubPrimaryButton>
      </div>
    </div>
  );
}

export type AdminPortalPartnerDetailViewProps = {
  partnerId: string;
  detail: AdminPortalPartnerDetailContent;
  onBack: () => void;
  className?: string;
  /** Deep-link initial tab (e.g. **Partners → View** opens on Properties). */
  initialTab?: AdminPartnerDetailTab;
  /** When the partner **Properties** tab property-detail modal **opens** (`true`), parent may latch admin sidebar to **Properties** (stays after close). */
  onPropertyDetailModalOpenChange?: (open: boolean) => void;
};

export function AdminPortalPartnerDetailView({
  partnerId,
  detail,
  onBack,
  className,
  initialTab = 'overview',
  onPropertyDetailModalOpenChange,
}: AdminPortalPartnerDetailViewProps) {
  const [tab, setTab] = useState<AdminPartnerDetailTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [partnerId, initialTab]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-0 sm:px-8 lg:px-10', className)}>
      <div className="mb-6 flex flex-col gap-6 sm:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="font-avenir-regular flex w-fit items-center gap-2 rounded-lg text-sm font-medium text-[#4B4E53] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#0B1D37]"
          aria-label="Back to partners"
        >
          <svg className="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Partners
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
              {detail.businessName}
            </h1>
            <p className="font-avenir-regular mt-2 text-sm leading-5 text-[#717680]">
              {detail.type} · {detail.contact}
            </p>
          </div>
          <span className={cn('inline-flex w-fit shrink-0', detail.statusClassName)}>{detail.statusLabel}</span>
        </div>
      </div>

      <div className="flex min-w-0 items-end justify-between gap-3 border-b border-[#e9eaeb]">
        <nav
          className="flex min-w-0 flex-1 gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Partner sections"
        >
          {DETAIL_TAB_ITEMS.map(({ id, label }) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(id)}
                className={cn(
                  'font-avenir-regular shrink-0 border-b-2 pb-3 text-sm font-semibold leading-5 transition-colors',
                  selected
                    ? 'border-[#00BAB5] text-[#00BAB5]'
                    : 'border-transparent text-[#4B4E53] hover:text-[#0B1D37]',
                )}
              >
                {label}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          className="mb-1 shrink-0 rounded-lg p-2 text-[#717680] transition-colors hover:bg-[#F6F6F4] hover:text-[#0B1D37]"
          aria-label="Section options"
        >
          <ChevronsUpDown className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>

      {tab === 'overview' ? (
        <div className="mt-6 flex flex-col gap-6">
          <div className={cardShell}>
            <h2 className="font-avenir-regular mb-6 text-base font-semibold leading-6 text-[#0B1D37]">Contact Details</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
              <ContactBlock icon={<Mail className="size-5" strokeWidth={2} />} label="Email">
                {detail.email}
              </ContactBlock>
              <ContactBlock icon={<Phone className="size-5" strokeWidth={2} />} label="Phone">
                {detail.phone}
              </ContactBlock>
              <ContactBlock icon={<MapPin className="size-5" strokeWidth={2} />} label="Business address">
                {detail.businessAddress}
              </ContactBlock>
              <div className="min-w-0">
                <p className={labelClass}>Stripe status</p>
                <span className="font-avenir-regular inline-flex rounded-full bg-[#00BAB5] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                  {detail.stripeStatusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Active bookings" value={detail.activeBookings} />
            <MetricCard label="Completed bookings" value={detail.completedBookings} />
            <MetricCard label="Total paid out" value={detail.totalPaidOut} />
            <MetricCard label="Partner since" value={detail.partnerSince} />
          </div>
        </div>
      ) : null}

      {tab === 'properties' ? (
        <PartnerDetailPropertiesTab
          partnerId={partnerId}
          partnerName={detail.businessName}
          onPropertyDetailModalOpenChange={onPropertyDetailModalOpenChange}
        />
      ) : null}

      {tab === 'bookings' ? <PartnerDetailBookingsTab partnerId={partnerId} /> : null}

      {tab === 'payouts' ? <PartnerDetailPayoutsTab partnerId={partnerId} /> : null}

      {tab === 'notes' ? <PartnerDetailNotesTab /> : null}
    </div>
  );
}
