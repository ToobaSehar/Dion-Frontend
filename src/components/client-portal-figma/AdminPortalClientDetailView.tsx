'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight, ChevronsUpDown, Trash2 } from 'lucide-react';

import { getAdminClientDetailBookingRows } from '@/components/client-portal-figma/adminClientDetailBookings';
import { getAdminClientDetailRequestRows } from '@/components/client-portal-figma/adminClientDetailRequests';
import {
  partnerDetailBookingStatusBadgeClass,
  partnerDetailBookingStatusLabel,
} from '@/components/client-portal-figma/adminPartnerDetailBookings';
import {
  adminPortalBookingDetailHref,
  adminPortalRequestDetailHref,
} from '@/components/client-portal-figma/adminPortalFigmaMainView';
import type { AdminPortalClientTableRow } from '@/components/client-portal-figma/AdminPortalClientsView';
import {
  adminPortalRequestRowStatusBadgeClass,
  adminPortalRequestRowStatusLabel,
} from '@/components/client-portal-figma/AdminPortalRequestsView';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

export type AdminClientDetailTab = 'bookings' | 'requests' | 'notes';

export type AdminPortalClientDetailContent = {
  company: string;
  sectorLine: string;
  contactName: string;
  email: string;
  phone: string;
  billingAddress: string;
  defaultPoReference: string;
  vatNumber: string;
  invoiceEmail: string;
  statusLabel: string;
  statusClassName: string;
  totalBookings: string;
  totalRequests: string;
  totalBookingValue: string;
  memberSince: string;
};

const DETAIL_TAB_ITEMS = [
  { id: 'bookings' as const, label: 'Bookings' },
  { id: 'requests' as const, label: 'Requests' },
  { id: 'notes' as const, label: 'Notes' },
];

const CLIENT_DETAIL_PRESETS: Partial<
  Record<
    string,
    Pick<
      AdminPortalClientDetailContent,
      | 'billingAddress'
      | 'defaultPoReference'
      | 'vatNumber'
      | 'invoiceEmail'
      | 'totalBookings'
      | 'totalRequests'
      | 'totalBookingValue'
      | 'memberSince'
    >
  >
> = {
  '1': {
    billingAddress: '45 High Street, London, EC2A 4BQ',
    defaultPoReference: 'PO-2026-0041',
    vatNumber: 'GB123456789',
    invoiceEmail: 'invoices@acmecouncil.gov.uk',
    totalBookings: '2',
    totalRequests: '5',
    totalBookingValue: '£34,200',
    memberSince: '15 Jan 2024',
  },
};

function defaultClientDetailFields(row: AdminPortalClientTableRow): Pick<
  AdminPortalClientDetailContent,
  | 'billingAddress'
  | 'defaultPoReference'
  | 'vatNumber'
  | 'invoiceEmail'
  | 'totalBookings'
  | 'totalRequests'
  | 'totalBookingValue'
  | 'memberSince'
> {
  const n = Number.parseInt(row.bookings, 10);
  const safe = Number.isFinite(n) ? n : 0;
  const poNum = 40 + Number.parseInt(row.id, 10);
  return {
    billingAddress: `${10 + safe} Commerce Road, Manchester, M1 1AA`,
    defaultPoReference: `PO-2026-${String(poNum).padStart(4, '0')}`,
    vatNumber: 'GB987654321',
    invoiceEmail: `invoices@${row.email.split('@')[1] ?? 'example.com'}`,
    totalBookings: row.bookings,
    totalRequests: String(Math.min(safe + 3, 24)),
    totalBookingValue: `£${(safe * 4200 + 1200).toLocaleString('en-GB')}`,
    memberSince: `${1 + (safe % 27)} Mar 2023`,
  };
}

/** Builds client detail shell content from the clients directory mock row. */
export function resolveAdminClientDetail(row: AdminPortalClientTableRow): AdminPortalClientDetailContent {
  const preset = CLIENT_DETAIL_PRESETS[row.id];
  const fallback = defaultClientDetailFields(row);
  const extras = { ...fallback, ...preset };

  return {
    company: row.company,
    sectorLine: `${row.sector} · ${row.contact}`,
    contactName: row.contact,
    email: row.email,
    phone: row.phone,
    statusLabel: 'Active',
    statusClassName:
      'rounded-full bg-[#00BAB5] px-3 py-1.5 text-xs font-semibold leading-[18px] text-white',
    ...extras,
  };
}

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-6';

const labelClass =
  'font-avenir-regular mb-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]';

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className={labelClass}>{label}</p>
      <p className="font-avenir-regular text-sm leading-5 text-[#0B1D37]">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn(cardShell, 'flex flex-col items-center text-center')}>
      <p className="font-avenir-regular text-2xl font-semibold leading-8 tracking-tight text-[#0B1D37] sm:text-[26px] sm:leading-9">
        {value}
      </p>
      <p className="font-avenir-regular mt-2 text-xs font-medium leading-4 text-[#717680]">{label}</p>
    </div>
  );
}

const clientBookingsThClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const clientBookingsTdClass =
  'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

function ClientDetailBookingsTab({ clientId }: { clientId: string }) {
  const rows = useMemo(() => getAdminClientDetailBookingRows(clientId), [clientId]);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1040px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9eaeb] bg-white">
              <th className={clientBookingsThClass}>Reference</th>
              <th className={clientBookingsThClass}>Property</th>
              <th className={clientBookingsThClass}>Partner</th>
              <th className={clientBookingsThClass}>Check-in</th>
              <th className={clientBookingsThClass}>Total amount</th>
              <th className={clientBookingsThClass}>Status</th>
              <th className={cn(clientBookingsThClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                  No bookings on file for this client.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                  <td className={cn(clientBookingsTdClass, 'font-semibold')}>{row.reference}</td>
                  <td className={clientBookingsTdClass}>{row.property}</td>
                  <td className={clientBookingsTdClass}>{row.partner}</td>
                  <td className={clientBookingsTdClass}>{row.checkIn}</td>
                  <td className={cn(clientBookingsTdClass, 'tabular-nums')}>{row.totalAmount}</td>
                  <td className={clientBookingsTdClass}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        partnerDetailBookingStatusBadgeClass(row.status),
                      )}
                    >
                      {partnerDetailBookingStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className={cn(clientBookingsTdClass, 'pr-6 text-right')}>
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

const clientRequestsThClass =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const clientRequestsTdClass =
  'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

function ClientDetailRequestsTab({ clientId }: { clientId: string }) {
  const rows = useMemo(() => getAdminClientDetailRequestRows(clientId), [clientId]);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9eaeb] bg-white">
              <th className={clientRequestsThClass}>Reference</th>
              <th className={clientRequestsThClass}>Location</th>
              <th className={clientRequestsThClass}>Check-in</th>
              <th className={clientRequestsThClass}>Check-out</th>
              <th className={clientRequestsThClass}>Guests</th>
              <th className={clientRequestsThClass}>Status</th>
              <th className={cn(clientRequestsThClass, 'w-[1%] whitespace-nowrap pr-6')} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="font-avenir-regular px-5 py-12 text-center text-sm text-[#717680]">
                  No requests on file for this client.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#e9eaeb] last:border-b-0">
                  <td className={cn(clientRequestsTdClass, 'font-semibold')}>{row.reference}</td>
                  <td className={clientRequestsTdClass}>{row.location}</td>
                  <td className={clientRequestsTdClass}>{row.checkIn}</td>
                  <td className={clientRequestsTdClass}>{row.checkOut}</td>
                  <td className={cn(clientRequestsTdClass, 'tabular-nums')}>{row.guests}</td>
                  <td className={clientRequestsTdClass}>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        adminPortalRequestRowStatusBadgeClass(row.status),
                      )}
                    >
                      {adminPortalRequestRowStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className={cn(clientRequestsTdClass, 'pr-6 text-right')}>
                    <Link
                      href={adminPortalRequestDetailHref(row.requestRowId)}
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

function ClientDetailNotesTab() {
  const [internalNotes, setInternalNotes] = useState('');

  return (
    <div className="mt-6 rounded-xl border border-solid border-[#e9eaeb] bg-white p-6 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-8">
      <textarea
        value={internalNotes}
        onChange={(e) => setInternalNotes(e.target.value)}
        placeholder="Add internal notes about this client..."
        rows={8}
        className="font-avenir-regular min-h-[180px] w-full resize-y rounded-lg border border-solid border-[#e9eaeb] bg-white px-3 py-3 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
        aria-label="Internal notes about this client"
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

export type AdminPortalClientDetailViewProps = {
  clientId: string;
  detail: AdminPortalClientDetailContent;
  onBack: () => void;
  className?: string;
  initialTab?: AdminClientDetailTab;
};

export function AdminPortalClientDetailView({
  clientId,
  detail,
  onBack,
  className,
  initialTab = 'bookings',
}: AdminPortalClientDetailViewProps) {
  const [tab, setTab] = useState<AdminClientDetailTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [clientId, initialTab]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-0 sm:px-8 lg:px-10', className)}>
      <div className="mb-6 flex flex-col gap-6 sm:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="font-avenir-regular flex w-fit items-center gap-2 rounded-lg text-sm font-medium text-[#4B4E53] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#0B1D37]"
          aria-label="Back to clients"
        >
          <svg className="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Clients
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
              {detail.company}
            </h1>
            <p className="font-avenir-regular mt-2 text-sm leading-5 text-[#717680]">{detail.sectorLine}</p>
          </div>
          <span className={cn('inline-flex w-fit shrink-0', detail.statusClassName)}>{detail.statusLabel}</span>
        </div>
      </div>

      <div className={cardShell}>
        <h2 className="font-avenir-regular mb-6 text-base font-semibold leading-6 text-[#0B1D37]">Contact Details</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-6">
            <DetailField label="Contact Name" value={detail.contactName} />
            <DetailField label="Billing Address" value={detail.billingAddress} />
            <DetailField label="Default PO Reference" value={detail.defaultPoReference} />
          </div>
          <div className="flex flex-col gap-6">
            <DetailField label="Email" value={detail.email} />
            <DetailField label="VAT Number" value={detail.vatNumber} />
          </div>
          <div className="flex flex-col gap-6">
            <DetailField label="Phone" value={detail.phone} />
            <DetailField label="Invoice Email" value={detail.invoiceEmail} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Bookings" value={detail.totalBookings} />
        <MetricCard label="Total Requests" value={detail.totalRequests} />
        <MetricCard label="Total Booking Value" value={detail.totalBookingValue} />
        <MetricCard label="Member Since" value={detail.memberSince} />
      </div>

      <div className="mt-8 flex min-w-0 items-end justify-between gap-3 border-b border-[#e9eaeb]">
        <nav
          className="flex min-w-0 flex-1 gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Client sections"
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
                    ? 'border-[#00BAB5] text-[#0B1D37]'
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

      {tab === 'bookings' ? <ClientDetailBookingsTab clientId={clientId} /> : null}
      {tab === 'requests' ? <ClientDetailRequestsTab clientId={clientId} /> : null}
      {tab === 'notes' ? <ClientDetailNotesTab /> : null}

      <section
        className="mt-10 rounded-xl border border-solid border-[#FECDCA] bg-[#FEF3F2] p-6 sm:p-8"
        aria-labelledby="client-danger-zone-heading"
      >
        <h2
          id="client-danger-zone-heading"
          className="font-avenir-regular flex items-center gap-2 text-base font-semibold leading-6 text-[#0B1D37]"
        >
          <AlertTriangle className="size-5 shrink-0 text-[#D92D20]" strokeWidth={2} aria-hidden />
          Danger zone – Role Correction
        </h2>
        <p className="font-avenir-regular mt-3 max-w-3xl text-sm leading-6 text-[#4B4E53]">
          The only way to fix a wrong Client/Partner role at signup is to delete this user and all their data. This
          action is irreversible.
        </p>
        <button
          type="button"
          className="font-avenir-regular mt-6 inline-flex items-center gap-2 rounded-full border border-solid border-[#D92D20] bg-white px-4 py-2.5 text-sm font-semibold text-[#D92D20] transition-colors hover:bg-[#FEF3F2]"
        >
          <Trash2 className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          Delete user & all data
        </button>
      </section>
    </div>
  );
}
