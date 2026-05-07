'use client';

import type { ReactNode } from 'react';
import { ChevronRight, Eye, FileText } from 'lucide-react';

import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { PORTAL_DASHBOARD_SECTION_HEADING_CLASS } from '@/components/client-portal-figma/portalDashboardSectionHeading';
import type {
  AdminPortalPaymentMethod,
  AdminPortalPaymentRowStatus,
  AdminPortalPaymentTableRow,
} from '@/components/client-portal-figma/AdminPortalPaymentsView';
import { cn } from '@/lib/utils';

export type AdminPaymentHistoryItem = {
  title: string;
  subtitle: string;
  amount: string;
  statusLabel: string;
  statusClass: string;
};

export type AdminPaymentDetailContent = {
  bookingRef: string;
  subtitle: string;
  headerStatusLabel: string;
  headerStatusClass: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  partnerName: string;
  partnerContactName: string;
  partnerEmail: string;
  property: string;
  paymentMethod: AdminPortalPaymentMethod;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalExcVat: string;
  paymentStatusLabel: string;
  paymentStatusClass: string;
  payoutStatusLabel: string;
  payoutStatusClass: string;
  checkInInstructionsNote: string;
  paymentHistory: AdminPaymentHistoryItem[];
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function parseUkDate(s: string): Date | null {
  const m = s.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const monShort = `${m[2][0]?.toUpperCase() ?? ''}${m[2].slice(1).toLowerCase()}`;
  const mon = MONTH_NAMES.indexOf(monShort as (typeof MONTH_NAMES)[number]);
  const year = Number(m[3]);
  if (mon < 0 || !Number.isFinite(day) || !Number.isFinite(year)) return null;
  return new Date(Date.UTC(year, mon, day));
}

function formatUkDate(d: Date): string {
  const day = d.getUTCDate();
  const mon = MONTH_NAMES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${mon} ${year}`;
}

function addDaysUtc(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86400000);
}

function demoEmailFromName(name: string): string {
  const parts = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}.${parts[parts.length - 1]}@example.com`;
  return `${parts[0] ?? 'guest'}@example.com`;
}

function demoPhoneFromReference(ref: string): string {
  let n = 0;
  for (let i = 0; i < ref.length; i++) n += ref.charCodeAt(i);
  const digits = String(100000 + (n % 899999)).padStart(6, '0');
  return `+44 7700 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

const PARTNER_POOL = [
  { name: 'Urban Stay Group', contact: 'Alex Morgan', email: 'ops@urbanstaygroup.co.uk' },
  { name: 'Haven Properties', contact: 'Sarah Blake', email: 's.blake@havenproperties.com' },
  { name: 'Metro Lettings', contact: 'Paul Anderson', email: 'paul@metrolettings.com' },
  { name: 'Aspire Apartments', contact: 'Bookings desk', email: 'bookings@aspireapartments.co.uk' },
] as const;

function partnerForProperty(property: string): (typeof PARTNER_POOL)[number] {
  let n = 0;
  for (let i = 0; i < property.length; i++) n += property.charCodeAt(i);
  return PARTNER_POOL[n % PARTNER_POOL.length]!;
}

function gridPaymentStatus(status: AdminPortalPaymentRowStatus): { label: string; className: string } {
  switch (status) {
    case 'paid':
      return { label: 'Paid', className: 'bg-[#00BAB5] text-white' };
    case 'pending':
      return { label: 'Pending', className: 'bg-[#E8A23E] text-white' };
    case 'overdue':
      return { label: 'Overdue', className: 'bg-[#F04438] text-white' };
    case 'failed':
      return { label: 'Failed', className: 'bg-[#F04438] text-white' };
    case 'refunded':
      return { label: 'Refunded', className: 'bg-[#E9EAEB] text-[#4B4E53]' };
  }
}

function headerForRowStatus(status: AdminPortalPaymentRowStatus): { label: string; className: string } {
  switch (status) {
    case 'paid':
      return { label: 'Paid', className: 'rounded-full bg-[#00BAB5] text-white' };
    case 'pending':
    case 'overdue':
      return { label: 'Awaiting Payment', className: 'rounded-full bg-[#FDB022] text-white' };
    case 'failed':
      return { label: 'Failed', className: 'rounded-full bg-[#F04438] text-white' };
    case 'refunded':
      return { label: 'Refunded', className: 'rounded-md bg-[#E9EAEB] text-[#4B4E53]' };
  }
}

function payoutForRowStatus(status: AdminPortalPaymentRowStatus): { label: string; className: string } {
  switch (status) {
    case 'paid':
      return { label: 'Released', className: 'bg-[#00BAB5] text-white' };
    case 'pending':
      return { label: 'Scheduled', className: 'bg-[#E9EAEB] text-[#4B4E53]' };
    case 'overdue':
    case 'failed':
      return { label: 'On Hold', className: 'bg-[#FFEFD6] text-[#B54708]' };
    case 'refunded':
      return { label: 'Reversed', className: 'bg-[#E9EAEB] text-[#4B4E53]' };
  }
}

function stayFromDueDate(due: string): { checkIn: string; checkOut: string; nights: number } {
  const d = parseUkDate(due);
  if (!d) return { checkIn: due, checkOut: due, nights: 28 };
  const checkIn = addDaysUtc(d, -28);
  const checkOut = addDaysUtc(d, 64);
  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
  return { checkIn: formatUkDate(checkIn), checkOut: formatUkDate(checkOut), nights };
}

function paymentHistoryForRow(row: AdminPortalPaymentTableRow): AdminPaymentHistoryItem[] {
  const methodLine = row.method === 'Card' ? 'Card' : 'Bank transfer';
  switch (row.status) {
    case 'paid':
      return [
        {
          title: 'Upfront payment',
          subtitle: `${methodLine} · ${row.dueDate}`,
          amount: row.totalAmount,
          statusLabel: 'Paid',
          statusClass: 'bg-[#00BAB5] text-white',
        },
      ];
    case 'pending':
      return [
        {
          title: 'Upfront payment',
          subtitle: `${methodLine} · Due ${row.dueDate}`,
          amount: row.totalAmount,
          statusLabel: 'Pending',
          statusClass: 'bg-[#E8A23E] text-white',
        },
      ];
    case 'overdue':
      return [
        {
          title: 'Upfront payment',
          subtitle: `${methodLine} · Due ${row.dueDate}`,
          amount: row.totalAmount,
          statusLabel: 'Overdue',
          statusClass: 'bg-[#F04438] text-white',
        },
      ];
    case 'failed':
      return [
        {
          title: 'Payment attempt',
          subtitle: `${methodLine} · ${row.dueDate}`,
          amount: row.totalAmount,
          statusLabel: 'Failed',
          statusClass: 'bg-[#F04438] text-white',
        },
      ];
    case 'refunded':
      return [
        {
          title: 'Refund',
          subtitle: `Processed · ${row.dueDate}`,
          amount: row.totalAmount,
          statusLabel: 'Refunded',
          statusClass: 'bg-[#E9EAEB] text-[#4B4E53]',
        },
      ];
  }
}

/** Build payment detail shell from the payments table row (static demo until API wiring). */
export function resolveAdminPaymentDetail(row: AdminPortalPaymentTableRow): AdminPaymentDetailContent {
  const partner = partnerForProperty(row.property);
  const stay = stayFromDueDate(row.dueDate);
  const header = headerForRowStatus(row.status);
  const pay = gridPaymentStatus(row.status);
  const payout = payoutForRowStatus(row.status);

  return {
    bookingRef: row.bookingRef,
    subtitle: `${row.company} · ${row.client} · ${row.property}`,
    headerStatusLabel: header.label,
    headerStatusClass: header.className,
    clientName: row.client,
    clientPhone: demoPhoneFromReference(row.bookingRef),
    clientEmail: demoEmailFromName(row.client),
    partnerName: partner.name,
    partnerContactName: partner.contact,
    partnerEmail: partner.email,
    property: row.property,
    paymentMethod: row.method,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    nights: stay.nights,
    guests: 2,
    totalExcVat: row.totalAmount,
    paymentStatusLabel: pay.label,
    paymentStatusClass: pay.className,
    payoutStatusLabel: payout.label,
    payoutStatusClass: payout.className,
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: paymentHistoryForRow(row),
  };
}

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-5';

const labelClass =
  'font-avenir-regular mb-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]';

function InfoCard({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(cardShell, className)}>
      <p className={labelClass}>{label}</p>
      <div className="font-avenir-regular text-sm leading-5 text-[#0B1D37]">{children}</div>
    </div>
  );
}

export type AdminPortalPaymentDetailViewProps = {
  detail: AdminPaymentDetailContent;
  onBack: () => void;
  className?: string;
};

export function AdminPortalPaymentDetailView({ detail, onBack, className }: AdminPortalPaymentDetailViewProps) {
  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:pb-20 lg:pb-24 sm:px-8 lg:px-10', className)}>
      <div className="mb-8 flex flex-col gap-6">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 rounded-lg text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#0B1D37]"
          aria-label="Back to payments"
        >
          <svg className="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
              {detail.bookingRef}
            </h1>
            <p className="font-avenir-regular mt-2 text-sm leading-5 text-[#717680]">{detail.subtitle}</p>
          </div>
          <span
            className={cn(
              'inline-flex w-fit shrink-0 px-3 py-1.5 text-xs font-semibold leading-[18px]',
              detail.headerStatusClass,
            )}
          >
            {detail.headerStatusLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="Client">
          <p className="font-semibold">{detail.clientName}</p>
          <p className="mt-2 text-[#4B4E53]">{detail.clientPhone}</p>
          <p className="mt-1 text-[#4B4E53]">{detail.clientEmail}</p>
        </InfoCard>
        <InfoCard label="Partner">
          <p className="font-semibold">{detail.partnerName}</p>
          <p className="mt-2 text-[#4B4E53]">{detail.partnerContactName}</p>
          <p className="mt-1 text-[#4B4E53]">{detail.partnerEmail}</p>
        </InfoCard>
        <InfoCard label="Property">
          <p>{detail.property}</p>
        </InfoCard>
        <InfoCard label="Check-in">
          <p>{detail.checkIn}</p>
        </InfoCard>
        <InfoCard label="Check-out">
          <p>{detail.checkOut}</p>
        </InfoCard>
        <InfoCard label="Nights">
          <p>{detail.nights} nights</p>
        </InfoCard>
        <InfoCard label="Guests">
          <p>{detail.guests} guests</p>
        </InfoCard>
        <InfoCard label="Payment method">
          <p className="font-semibold">{detail.paymentMethod}</p>
        </InfoCard>
        <InfoCard label="Total exc VAT">
          <p className="font-semibold">{detail.totalExcVat}</p>
        </InfoCard>
        <InfoCard label="Payment status">
          <span
            className={cn(
              'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
              detail.paymentStatusClass,
            )}
          >
            {detail.paymentStatusLabel}
          </span>
        </InfoCard>
        <InfoCard label="Payout status">
          <span
            className={cn(
              'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
              detail.payoutStatusClass,
            )}
          >
            {detail.payoutStatusLabel}
          </span>
        </InfoCard>
      </div>

      <section className="mt-10" aria-labelledby="admin-payment-checkin-heading">
        <h2 id="admin-payment-checkin-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Check-in instructions
        </h2>
        <div className={cn(cardShell)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-avenir-regular text-sm font-medium text-[#E8A23E]">{detail.checkInInstructionsNote}</p>
            <button
              type="button"
              className="font-avenir-regular inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884] sm:pt-0.5"
            >
              Chase Partner
              <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <BookingHubSecondaryButton type="button" size="sm" iconLeading={<Eye className="size-4" strokeWidth={2} aria-hidden />}>
          View Check-in Instructions
        </BookingHubSecondaryButton>
        <BookingHubSecondaryButton
          type="button"
          size="sm"
          iconLeading={<FileText className="size-4" strokeWidth={2} aria-hidden />}
        >
          View Amendment History
        </BookingHubSecondaryButton>
        <button
          type="button"
          className="font-avenir-regular rounded-lg px-3 py-2 text-sm font-semibold text-[#F04438] transition-colors hover:text-[#D92D20]"
        >
          Cancel Booking
        </button>
      </div>

      <section className="mt-12" aria-labelledby="admin-payment-documents-heading">
        <h2 id="admin-payment-documents-heading" className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">
          Documents
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-[#e9eaeb] overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
          <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">Booking Confirmation</p>
              <p className="font-avenir-regular mt-1 text-xs text-[#717680]">Generated 1 Apr 2024</p>
            </div>
            <button
              type="button"
              className="font-avenir-regular inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
            >
              Download
              <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">VAT Invoice — INV-BH-0041</p>
              <p className="font-avenir-regular mt-1 text-xs text-[#717680]">Generated by accommodation provider · 1 Apr 2024</p>
            </div>
            <span className="font-avenir-regular shrink-0 text-sm text-[#717680]">Not yet generated</span>
          </div>
          <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">Commission Invoice — COMM-BH-0041</p>
            </div>
            <span className="font-avenir-regular shrink-0 text-sm text-[#717680]">Pending payout release</span>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="admin-payment-notes-heading">
        <h2 id="admin-payment-notes-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Admin notes
        </h2>
        <div className={cn(cardShell, 'p-5 sm:p-6')}>
          <label htmlFor="admin-payment-internal-notes" className="sr-only">
            Internal notes for this payment
          </label>
          <textarea
            id="admin-payment-internal-notes"
            rows={5}
            placeholder="Add internal notes about this payment..."
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

      <section className="mt-12 pb-16" aria-labelledby="admin-payment-history-heading">
        <h2 id="admin-payment-history-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Payment history
        </h2>
        <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
          {detail.paymentHistory.length === 0 ? (
            <p className="font-avenir-regular px-5 py-8 text-center text-sm text-[#717680]">No payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-[#e9eaeb]">
              {detail.paymentHistory.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">{item.title}</p>
                    <p className="font-avenir-regular mt-1 text-xs leading-4 text-[#717680]">{item.subtitle}</p>
                  </div>
                  <div className="flex shrink-0 flex-row flex-wrap items-center gap-3 sm:justify-end">
                    <p className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">{item.amount}</p>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        item.statusClass,
                      )}
                    >
                      {item.statusLabel}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
