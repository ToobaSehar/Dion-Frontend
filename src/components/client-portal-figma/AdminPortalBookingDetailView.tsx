'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, Check, ChevronRight, Eye, FileText, Play, ShieldCheck } from 'lucide-react';

import {
  BookingHubPrimaryButton,
  BookingHubSecondaryButton,
  BookingHubTertiaryButton,
} from '@/components/booking-hub-button';
import { bhRounded } from '@/components/booking-hub-radius';
import { bookingTableRowFromPaymentRow } from '@/components/client-portal-figma/adminPortalPaymentToBookingRow';
import { PORTAL_DASHBOARD_SECTION_HEADING_CLASS } from '@/components/client-portal-figma/portalDashboardSectionHeading';
import type { AdminPortalPaymentTableRow } from '@/components/client-portal-figma/AdminPortalPaymentsView';
import { cn } from '@/lib/utils';

export type AdminBookingPaymentHistoryItem = {
  title: string;
  subtitle: string;
  amount: string;
  statusLabel: string;
  statusClass: string;
};

export type AdminBookingDetailContent = {
  reference: string;
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
  paymentHistory: AdminBookingPaymentHistoryItem[];
};

const DETAIL_BY_REFERENCE: Record<string, AdminBookingDetailContent> = {
  'BK-2024-0891': {
    reference: 'BK-2024-0891',
    subtitle: 'Acme Council · James Davies · Victoria Apartments',
    headerStatusLabel: 'Checked In',
    headerStatusClass: 'rounded-full bg-[#0B1D37] text-white',
    clientName: 'James Davies',
    clientPhone: '+44 7700 900111',
    clientEmail: 'j.davies@acme.gov.uk',
    partnerName: 'City Living Ltd',
    partnerContactName: 'Mark Thompson',
    partnerEmail: 'mark@cityliving.co.uk',
    property: 'Victoria Apartments',
    checkIn: '1 Apr 2024',
    checkOut: '30 Jun 2024',
    nights: 91,
    guests: 2,
    totalExcVat: '£8,856',
    paymentStatusLabel: 'Paid',
    paymentStatusClass: 'bg-[#00BAB5] text-white',
    payoutStatusLabel: 'Released',
    payoutStatusClass: 'bg-[#00BAB5] text-white',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Upfront Payment',
        subtitle: 'Card Payment · 1 Apr 2024',
        amount: '£8,856',
        statusLabel: 'Paid',
        statusClass: 'bg-[#00BAB5] text-white',
      },
    ],
  },
  'BK-2024-0887': {
    reference: 'BK-2024-0887',
    subtitle: 'Northern Housing · Sarah Mitchell · London Bridge Apartments',
    headerStatusLabel: 'Confirmed',
    headerStatusClass: 'rounded-full bg-[#00BAB5] text-white',
    clientName: 'Sarah Mitchell',
    clientPhone: '+44 7700 900456',
    clientEmail: 's.mitchell@northernhousing.org.uk',
    partnerName: 'City Living Ltd',
    partnerContactName: 'Mark Thompson',
    partnerEmail: 'mark@cityliving.co.uk',
    property: 'London Bridge Apartments',
    checkIn: '10 Apr 2024',
    checkOut: '10 Jul 2024',
    nights: 92,
    guests: 2,
    totalExcVat: '£7,956',
    paymentStatusLabel: 'Paid',
    paymentStatusClass: 'bg-[#00BAB5] text-white',
    payoutStatusLabel: 'Scheduled',
    payoutStatusClass: 'bg-[#E9EAEB] text-[#4B4E53]',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Upfront Payment',
        subtitle: 'Card Payment · 10 Apr 2024',
        amount: '£7,956',
        statusLabel: 'Paid',
        statusClass: 'bg-[#00BAB5] text-white',
      },
    ],
  },
  'BK-2024-0865': {
    reference: 'BK-2024-0865',
    subtitle: 'Leeds City Partners · Emma Watson · Park Lane Residences',
    headerStatusLabel: 'Awaiting Payment',
    headerStatusClass: 'rounded-full bg-[#FDB022] text-white',
    clientName: 'Emma Watson',
    clientPhone: '+44 7700 900321',
    clientEmail: 'e.watson@leedscp.org',
    partnerName: 'Metro Lettings',
    partnerContactName: 'Paul Anderson',
    partnerEmail: 'paul@metrolettings.com',
    property: 'Park Lane Residences',
    checkIn: '15 Mar 2024',
    checkOut: '15 Apr 2024',
    nights: 31,
    guests: 2,
    totalExcVat: '£9,504',
    paymentStatusLabel: 'Pending',
    paymentStatusClass: 'bg-[#E8A23E] text-white',
    payoutStatusLabel: 'On Hold',
    payoutStatusClass: 'bg-[#FFEFD6] text-[#B54708]',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Period 1 — 15 Mar 2024 to 11 Apr 2024',
        subtitle: 'Card Payment · 15 Mar 2024',
        amount: '£9,504',
        statusLabel: 'Paid',
        statusClass: 'bg-[#00BAB5] text-white',
      },
      {
        title: 'Period 2 — 12 Apr 2024 to 15 Apr 2024',
        subtitle: 'Card Payment · Due 8 Apr 2024',
        amount: '£1,092',
        statusLabel: 'Scheduled',
        statusClass: 'bg-[#0B1D37] text-white',
      },
    ],
  },
  'BK-2024-0878': {
    reference: 'BK-2024-0878',
    subtitle: 'Midlands Corp · Tom Richards · Canal View Suites',
    headerStatusLabel: 'Awaiting Payment',
    headerStatusClass: 'rounded-full bg-[#FDB022] text-white',
    clientName: 'Tom Richards',
    clientPhone: '+44 7700 900789',
    clientEmail: 't.richards@midlands.com',
    partnerName: 'Urban Stay Group',
    partnerContactName: 'James Wilson',
    partnerEmail: 'james@urbanstay.com',
    property: 'Canal View Suites',
    checkIn: '20 Mar 2024',
    checkOut: '20 Jun 2024',
    nights: 92,
    guests: 2,
    totalExcVat: '£10,260',
    paymentStatusLabel: 'Overdue',
    paymentStatusClass: 'bg-[#F04438] text-white',
    payoutStatusLabel: 'On Hold',
    payoutStatusClass: 'bg-[#FFEFD6] text-[#B54708]',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Upfront Payment',
        subtitle: 'Bank Transfer · 20 Mar 2024',
        amount: '£10,260',
        statusLabel: 'Overdue',
        statusClass: 'bg-[#F04438] text-white',
      },
    ],
  },
  'BK-2024-0830': {
    reference: 'BK-2024-0830',
    subtitle: 'Midlands Corp · Tom Richards · Battersea Rise House',
    headerStatusLabel: 'Completed',
    headerStatusClass: 'rounded-md bg-[#E9EAEB] text-[#4B4E53]',
    clientName: 'Tom Richards',
    clientPhone: '+44 7700 900789',
    clientEmail: 't.richards@midlands.com',
    partnerName: 'City Living Ltd',
    partnerContactName: 'Mark Thompson',
    partnerEmail: 'mark@cityliving.co.uk',
    property: 'Battersea Rise House',
    checkIn: '1 Feb 2024',
    checkOut: '1 Mar 2024',
    nights: 29,
    guests: 2,
    totalExcVat: '£7,200',
    paymentStatusLabel: 'Paid',
    paymentStatusClass: 'bg-[#00BAB5] text-white',
    payoutStatusLabel: 'Released',
    payoutStatusClass: 'bg-[#00BAB5] text-white',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Upfront Payment',
        subtitle: 'Card Payment · 1 Feb 2024',
        amount: '£7,200',
        statusLabel: 'Paid',
        statusClass: 'bg-[#00BAB5] text-white',
      },
    ],
  },
  'BK-2024-0756': {
    reference: 'BK-2024-0756',
    subtitle: 'Capital Relocations · David Brown · Victoria Apartments',
    headerStatusLabel: 'Completed',
    headerStatusClass: 'rounded-md bg-[#E9EAEB] text-[#4B4E53]',
    clientName: 'David Brown',
    clientPhone: '+44 7700 901842',
    clientEmail: 'david.brown@example.com',
    partnerName: 'City Living Ltd',
    partnerContactName: 'Mark Thompson',
    partnerEmail: 'mark@cityliving.co.uk',
    property: 'Victoria Apartments',
    checkIn: '1 Jan 2024',
    checkOut: '28 Feb 2024',
    nights: 59,
    guests: 2,
    totalExcVat: '£11,340',
    paymentStatusLabel: 'Paid',
    paymentStatusClass: 'bg-[#00BAB5] text-white',
    payoutStatusLabel: 'Released',
    payoutStatusClass: 'bg-[#00BAB5] text-white',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Upfront Payment',
        subtitle: 'Card Payment · 1 Jan 2024',
        amount: '£11,340',
        statusLabel: 'Paid',
        statusClass: 'bg-[#00BAB5] text-white',
      },
    ],
  },
  'BK-2024-0842': {
    reference: 'BK-2024-0842',
    subtitle: 'Capital Relocations · David Brown · Riverside Quarter',
    headerStatusLabel: 'Checked In',
    headerStatusClass: 'rounded-full bg-[#0B1D37] text-white',
    clientName: 'David Brown',
    clientPhone: '+44 7700 901842',
    clientEmail: 'david.brown@example.com',
    partnerName: 'Aspire Apartments',
    partnerContactName: 'Sophie Turner',
    partnerEmail: 'sophie.turner@aspireapartments.co.uk',
    property: 'Riverside Quarter',
    checkIn: '1 Mar 2024',
    checkOut: '31 May 2024',
    nights: 91,
    guests: 2,
    totalExcVat: '£11,340',
    paymentStatusLabel: 'Paid',
    paymentStatusClass: 'bg-[#E6FAF9] text-[#00BAB5]',
    payoutStatusLabel: 'On Hold',
    payoutStatusClass: 'bg-[#FFEFD6] text-[#B54708]',
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: [
      {
        title: 'Upfront Payment',
        subtitle: 'Card Payment · 1 Mar 2024',
        amount: '£11,340',
        statusLabel: 'Paid',
        statusClass: 'bg-[#E6FAF9] text-[#00BAB5]',
      },
    ],
  },
};

/** Subset of `AdminPortalBookingTableRow` — used to synthesise detail when no curated preset exists. */
export type AdminBookingDetailRowSource = {
  reference: string;
  client: string;
  company: string;
  partner: string;
  property: string;
  checkIn: string;
  totalAmount: string;
  status: 'awaiting-payment' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
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

function demoPhoneFromReference(reference: string): string {
  let n = 0;
  for (let i = 0; i < reference.length; i++) n += reference.charCodeAt(i);
  const digits = String(100000 + (n % 899999)).padStart(6, '0');
  return `+44 7700 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

function demoPartnerEmail(partner: string): string {
  const slug = partner.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24);
  return `bookings@${slug || 'partner'}.co.uk`;
}

function headerFieldsForStatus(status: AdminBookingDetailRowSource['status']): { label: string; className: string } {
  switch (status) {
    case 'awaiting-payment':
      return { label: 'Awaiting Payment', className: 'rounded-full bg-[#FDB022] text-white' };
    case 'confirmed':
      return { label: 'Confirmed', className: 'rounded-full bg-[#00BAB5] text-white' };
    case 'checked-in':
      return { label: 'Checked In', className: 'rounded-full bg-[#0B1D37] text-white' };
    case 'completed':
      return { label: 'Completed', className: 'rounded-md bg-[#E9EAEB] text-[#4B4E53]' };
    case 'cancelled':
      return { label: 'Cancelled', className: 'rounded-full bg-[#f6f6f4] text-[#F04438]' };
  }
}

function paymentPayoutForStatus(status: AdminBookingDetailRowSource['status']): Pick<
  AdminBookingDetailContent,
  'paymentStatusLabel' | 'paymentStatusClass' | 'payoutStatusLabel' | 'payoutStatusClass'
> {
  switch (status) {
    case 'awaiting-payment':
      return {
        paymentStatusLabel: 'Pending',
        paymentStatusClass: 'bg-[#E8A23E] text-white',
        payoutStatusLabel: 'On Hold',
        payoutStatusClass: 'bg-[#FFEFD6] text-[#B54708]',
      };
    case 'confirmed':
      return {
        paymentStatusLabel: 'Paid',
        paymentStatusClass: 'bg-[#00BAB5] text-white',
        payoutStatusLabel: 'Scheduled',
        payoutStatusClass: 'bg-[#E9EAEB] text-[#4B4E53]',
      };
    case 'checked-in':
    case 'completed':
      return {
        paymentStatusLabel: 'Paid',
        paymentStatusClass: 'bg-[#00BAB5] text-white',
        payoutStatusLabel: 'Released',
        payoutStatusClass: 'bg-[#00BAB5] text-white',
      };
    case 'cancelled':
      return {
        paymentStatusLabel: 'Cancelled',
        paymentStatusClass: 'bg-[#E9EAEB] text-[#4B4E53]',
        payoutStatusLabel: 'Cancelled',
        payoutStatusClass: 'bg-[#E9EAEB] text-[#4B4E53]',
      };
  }
}

/** Demo 28-day + tail schedule for awaiting-payment rows (Phase 2-style schedule UI). */
function paymentHistoryAwaitingSchedule(row: AdminBookingDetailRowSource): AdminBookingPaymentHistoryItem[] {
  const period2DemoAmount = '£1,092';
  const start = parseUkDate(row.checkIn);
  if (!start) {
    return [
      {
        title: 'Period 1 — Payment schedule',
        subtitle: `Card Payment · ${row.checkIn}`,
        amount: row.totalAmount,
        statusLabel: 'Paid',
        statusClass: 'bg-[#00BAB5] text-white',
      },
      {
        title: 'Period 2 — Payment schedule',
        subtitle: 'Card Payment · Due',
        amount: period2DemoAmount,
        statusLabel: 'Scheduled',
        statusClass: 'bg-[#0B1D37] text-white',
      },
    ];
  }
  const period1End = addDaysUtc(start, 27);
  const period2Start = addDaysUtc(start, 28);
  const period2End = addDaysUtc(start, 31);
  const period2Due = addDaysUtc(period2Start, -4);
  return [
    {
      title: `Period 1 — ${formatUkDate(start)} to ${formatUkDate(period1End)}`,
      subtitle: `Card Payment · ${row.checkIn}`,
      amount: row.totalAmount,
      statusLabel: 'Paid',
      statusClass: 'bg-[#00BAB5] text-white',
    },
    {
      title: `Period 2 — ${formatUkDate(period2Start)} to ${formatUkDate(period2End)}`,
      subtitle: `Card Payment · Due ${formatUkDate(period2Due)}`,
      amount: period2DemoAmount,
      statusLabel: 'Scheduled',
      statusClass: 'bg-[#0B1D37] text-white',
    },
  ];
}

function paymentHistoryForRow(row: AdminBookingDetailRowSource): AdminBookingPaymentHistoryItem[] {
  switch (row.status) {
    case 'awaiting-payment':
      return paymentHistoryAwaitingSchedule(row);
    case 'cancelled':
      return [
        {
          title: 'Booking cancelled',
          subtitle: 'No payment captured',
          amount: '£0',
          statusLabel: 'Void',
          statusClass: 'bg-[#E9EAEB] text-[#4B4E53]',
        },
      ];
    default:
      return [
        {
          title: 'Upfront Payment',
          subtitle: `Card Payment · ${row.checkIn}`,
          amount: row.totalAmount,
          statusLabel: 'Paid',
          statusClass: 'bg-[#00BAB5] text-white',
        },
      ];
  }
}

function buildAdminBookingDetailFromRow(row: AdminBookingDetailRowSource): AdminBookingDetailContent {
  const STAY_NIGHTS = 28;
  const start = parseUkDate(row.checkIn);
  const checkOut = start ? formatUkDate(addDaysUtc(start, STAY_NIGHTS)) : '—';
  const header = headerFieldsForStatus(row.status);
  const pp = paymentPayoutForStatus(row.status);

  return {
    reference: row.reference,
    subtitle: `${row.company} · ${row.client} · ${row.property}`,
    headerStatusLabel: header.label,
    headerStatusClass: header.className,
    clientName: row.client,
    clientPhone: demoPhoneFromReference(row.reference),
    clientEmail: demoEmailFromName(row.client),
    partnerName: row.partner,
    partnerContactName: 'Bookings desk',
    partnerEmail: demoPartnerEmail(row.partner),
    property: row.property,
    checkIn: row.checkIn,
    checkOut,
    nights: STAY_NIGHTS,
    guests: 2,
    totalExcVat: row.totalAmount,
    ...pp,
    checkInInstructionsNote: 'No check-in instructions added',
    paymentHistory: paymentHistoryForRow(row),
  };
}

/** Prefer curated presets (`DETAIL_BY_REFERENCE`); otherwise build demo detail from the table row. */
export function resolveAdminBookingDetail(row: AdminBookingDetailRowSource): AdminBookingDetailContent {
  return DETAIL_BY_REFERENCE[row.reference] ?? buildAdminBookingDetailFromRow(row);
}

/** Booking detail from a payment row — always uses table-derived data (no preset override by ref). */
export function resolveAdminBookingDetailFromPayment(payment: AdminPortalPaymentTableRow): AdminBookingDetailContent {
  return buildAdminBookingDetailFromRow(bookingTableRowFromPaymentRow(payment));
}

export function adminBookingDetailForTableRow(_row: AdminBookingDetailRowSource): boolean {
  return true;
}

export function getAdminBookingDetail(reference: string): AdminBookingDetailContent | null {
  return DETAIL_BY_REFERENCE[reference] ?? null;
}

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-5';

const labelClass =
  'font-avenir-regular mb-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]';

/** Extension card stat row — tight label/value stack (no `mb-2` from `labelClass`). */
const extensionStatLabelClass =
  'font-avenir-regular mb-0.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-[#717680]';
const extensionStatValueClass = 'font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]';

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

export type AdminPortalBookingDetailViewProps = {
  detail: AdminBookingDetailContent;
  onBack: () => void;
  className?: string;
};

const AWAITING_PAYMENT_HEADER_LABEL = 'Awaiting Payment' as const;
const CONFIRMED_HEADER_LABEL = 'Confirmed' as const;
const CHECKED_IN_HEADER_LABEL = 'Checked In' as const;

export function AdminPortalBookingDetailView({ detail, onBack, className }: AdminPortalBookingDetailViewProps) {
  const showStripePaymentVerificationBanner =
    detail.headerStatusLabel === AWAITING_PAYMENT_HEADER_LABEL && detail.paymentStatusLabel !== 'Overdue';
  const showExtensionRequestPendingCard = detail.headerStatusLabel === CONFIRMED_HEADER_LABEL;
  const isPaymentHistoryInCard =
    detail.headerStatusLabel === CONFIRMED_HEADER_LABEL ||
    detail.headerStatusLabel === AWAITING_PAYMENT_HEADER_LABEL;
  const showCheckedInPayoutHoldCta =
    detail.headerStatusLabel === CHECKED_IN_HEADER_LABEL && detail.payoutStatusLabel === 'On Hold';

  const paymentHistoryList =
    detail.paymentHistory.length === 0 ? (
      <p
        className={cn(
          'font-avenir-regular text-center text-sm text-[#717680]',
          isPaymentHistoryInCard ? 'py-6' : 'px-5 py-8',
        )}
      >
        No payments recorded yet.
      </p>
    ) : (
      <ul className="divide-y divide-[#e9eaeb]">
        {detail.paymentHistory.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            className={cn(
              'flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
              isPaymentHistoryInCard ? 'px-0' : 'px-5',
            )}
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
    );

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-0 sm:px-8 lg:px-10', className)}>
      <div className="mb-8 flex flex-col gap-6">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 rounded-lg text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/80 hover:text-[#0B1D37]"
          aria-label="Back"
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

      <section className="mt-10" aria-labelledby="admin-booking-checkin-heading">
        {showCheckedInPayoutHoldCta ? (
          <div className={cn(cardShell)}>
            <h2 id="admin-booking-checkin-heading" className={cn(labelClass, 'mb-4')}>
              Check-in instructions
            </h2>
            <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-avenir-regular text-sm font-medium leading-5 text-[#E8A23E]">
                {detail.checkInInstructionsNote}
              </p>
              <button
                type="button"
                className="font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
              >
                Chase Partner
                <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="admin-booking-checkin-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
              Check-in instructions
            </h2>
            <div className={cn(cardShell)}>
              {showStripePaymentVerificationBanner ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-5 w-full rounded-xl border border-solid border-[#FEF3C7] bg-[#FFFBEB] p-4 sm:p-5"
                >
                  <div className="flex gap-3">
                    <AlertTriangle
                      className="mt-0.5 size-5 shrink-0 text-[#F79009]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">
                        Payment Pending – Verification Required
                      </p>
                      <p className="font-avenir-regular mt-2 text-sm leading-5 text-[#4B4E53]">
                        Stripe Payment Intent{' '}
                        <span className="break-all font-mono text-sm text-[#0B1D37]">pi_30xx8865xxxxxxxxA</span> is in a
                        pending state. Verify status with Stripe to auto-confirm.
                      </p>
                      <BookingHubPrimaryButton
                        type="button"
                        size="sm"
                        className="mt-4"
                        iconLeading={<ShieldCheck className="size-4" strokeWidth={2} aria-hidden />}
                      >
                        Verify Stripe Payment
                      </BookingHubPrimaryButton>
                    </div>
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                className="font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
              >
                Chase Partner
                <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </button>
              <p className="font-avenir-regular mt-3 text-sm font-medium text-[#E8A23E]">{detail.checkInInstructionsNote}</p>
            </div>
          </>
        )}
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
          {showCheckedInPayoutHoldCta ? 'Hide Amendment History' : 'View Amendment History'}
        </BookingHubSecondaryButton>
        {showCheckedInPayoutHoldCta ? (
          <BookingHubPrimaryButton
            type="button"
            size="sm"
            iconLeading={<Play className="size-4" strokeWidth={2} aria-hidden />}
            iconTrailing={<ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
          >
            Release Payout Hold
          </BookingHubPrimaryButton>
        ) : null}
        <button
          type="button"
          className="font-avenir-regular rounded-lg px-3 py-2 text-sm font-semibold text-[#F04438] transition-colors hover:text-[#D92D20]"
        >
          Cancel Booking
        </button>
      </div>

      {showExtensionRequestPendingCard ? (
        <section className="mt-12" aria-labelledby="admin-booking-extension-heading">
          <div className={cn(cardShell)}>
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center bg-[#00BAB5] text-white sm:size-10',
                  bhRounded('full'),
                )}
                aria-hidden
              >
                <Check className="size-4 sm:size-[18px]" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="admin-booking-extension-heading"
                  className="font-avenir-regular text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-[#0B1D37]"
                >
                  Extension request – pending approval
                </h2>
                <p className="font-avenir-regular mt-1.5 text-sm leading-[1.45] text-[#4B4E53]">
                  Client has requested +14 nights. Partner availability confirmed at the original rate. A new pricing
                  snapshot will be frozen on approval and Period 2 payment triggered.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-y-0">
                  <div>
                    <p className={extensionStatLabelClass}>New check-out</p>
                    <p className={extensionStatValueClass}>29 Jul 2024</p>
                  </div>
                  <div>
                    <p className={extensionStatLabelClass}>Additional value (exc VAT)</p>
                    <p className={extensionStatValueClass}>£952</p>
                  </div>
                  <div className="min-w-0 sm:col-span-1">
                    <p className={extensionStatLabelClass}>Pricing snapshot</p>
                    <p className={extensionStatValueClass}>Original rate locked (£68/night)</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <BookingHubPrimaryButton type="button" size="sm">
                    Approve extension
                  </BookingHubPrimaryButton>
                  <BookingHubTertiaryButton type="button" size="sm">
                    Reject
                  </BookingHubTertiaryButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="admin-booking-documents-heading">
        <h2 id="admin-booking-documents-heading" className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">
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

      <section className="mt-12" aria-labelledby="admin-booking-notes-heading">
        <h2 id="admin-booking-notes-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Admin notes
        </h2>
        <div className={cn(cardShell, 'p-5 sm:p-6')}>
          <label htmlFor="admin-booking-internal-notes" className="sr-only">
            Internal notes for this booking
          </label>
          <textarea
            id="admin-booking-internal-notes"
            rows={5}
            placeholder="Add internal notes about this booking..."
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

      <section className="mt-12" aria-labelledby="admin-booking-payment-history-heading">
        {isPaymentHistoryInCard ? (
          <div className={cn(cardShell)}>
            <h2 id="admin-booking-payment-history-heading" className={cn(labelClass, 'mb-4')}>
              Payment history
            </h2>
            {paymentHistoryList}
          </div>
        ) : (
          <>
            <h2 id="admin-booking-payment-history-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
              Payment history
            </h2>
            <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
              {paymentHistoryList}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
