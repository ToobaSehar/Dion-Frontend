'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Key,
  MapPin,
  PenLine,
  Users,
  X,
} from 'lucide-react';

import {
  BookingHubPrimaryButton,
  BookingHubSecondaryDeleteButton,
} from '@/components/booking-hub-button';
import { BookingHubSecondaryButton } from '@/components/booking-hub-button/BookingHubSecondaryButton';
import {
  PortalClientInfoCard,
  PortalClientInfoRow,
} from '@/components/client-portal-figma/PortalClientDashboardInfoPrimitives';
import { cn } from '@/lib/utils';

const ICON_STROKE = 2;
const ICON_BOX = 'size-5 shrink-0';

const CARD_SHELL =
  'flex flex-col gap-0 rounded-xl border border-solid border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-6';

const TITLE_CLASS =
  'font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-lg sm:leading-7';

export type ClientPortalExtendRebookBookingDetailDetailPanelsMode = 'active-stay' | 'confirmed-pre-arrival';

export type ClientPortalExtendRebookBookingDetailContent = {
  propertyTitle: string;
  referenceCode: string;
  statusBadgeLabel: string;
  statusSupportingText: string;
  expiringSoonLabel: string;
  address: string;
  dates: string;
  guests: string;
  totalCost: string;
  totalPaidNote: string;
  checkInInstructions: string;
  paymentHistory: Array<{ amount: string; meta: string }>;
  bookingManagementHeading: string;
  cancelBookingActionLabel: string;
  vatInvoicesHeading: string;
  vatInvoices: Array<{
    invoiceNumber: string;
    periodLabel: string;
    amountDisplay: string;
    vatNote: string;
    statusLabel: string;
  }>;
  /** `confirmed-pre-arrival` — placeholder panels before check-in / payments (matches Confirmed booking shell). */
  detailPanelsMode?: ClientPortalExtendRebookBookingDetailDetailPanelsMode;
  /** When false, hides Booking Management / cancel action (e.g. completed stays). Default: shown. */
  showCancelBooking?: boolean;
  /** When false, hides the amber status pill. Default: shown. */
  showExpiringSoonBadge?: boolean;
  /** Grey “completed”-style status pill instead of navy/teal. */
  statusBadgeMuted?: boolean;
};

export const DEFAULT_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL: ClientPortalExtendRebookBookingDetailContent = {
  propertyTitle: 'Station House',
  referenceCode: 'BH-1C4F6A8B',
  statusBadgeLabel: 'Checked In',
  statusSupportingText: '12 days remaining',
  expiringSoonLabel: 'Expiring Soon',
  address: '8 New Street, Birmingham, B2 4PA',
  dates: '1 February 2026 – 16 March 2026',
  guests: '3',
  totalCost: '£3,600',
  totalPaidNote: 'Paid: £3,600',
  checkInInstructions:
    'Collect keys from reception desk in lobby. Open 24/7. Apartment 3B, 2nd floor.',
  paymentHistory: [
    { amount: '£2,345', meta: '01/02/2026 · Bank Transfer' },
    { amount: '£1,255', meta: '01/03/2026 · Bank Transfer' },
  ],
  bookingManagementHeading: 'Booking Management',
  cancelBookingActionLabel: 'Cancel Booking',
  vatInvoicesHeading: 'VAT Invoices',
  vatInvoices: [
    {
      invoiceNumber: 'INV-2026-00154',
      periodLabel: '1 Feb 2026 – 28 Feb 2026',
      amountDisplay: '£2,345.00',
      vatNote: '(No VAT)',
      statusLabel: 'Paid',
    },
    {
      invoiceNumber: 'INV-2026-00155',
      periodLabel: '1 Mar 2026 – 28 Mar 2026',
      amountDisplay: '£1,255.00',
      vatNote: '(No VAT)',
      statusLabel: 'Paid',
    },
  ],
  detailPanelsMode: 'active-stay',
};

const CONFIRMED_CHECKIN_PLACEHOLDER =
  'Check-in instructions will appear here 24 hours before your arrival.';
const CONFIRMED_PAYMENT_HISTORY_EMPTY = 'No payments recorded yet';
const CONFIRMED_VAT_PLACEHOLDER =
  'Invoices will appear here after each payment is processed by the property partner.';

/** Static shell for **Confirmed** bookings opened from My Bookings (`?booking=confirmed`). */
export const CONFIRMED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL: ClientPortalExtendRebookBookingDetailContent = {
  propertyTitle: 'Canal View Suites',
  referenceCode: 'BH-9D3E5C7A',
  statusBadgeLabel: 'Confirmed',
  statusSupportingText: '8 days remaining',
  expiringSoonLabel: 'Expiring Soon',
  address: '42 Waterfront Lane, Leeds, LS1 4DY',
  dates: '12 March 2026 – 12 May 2026',
  guests: '4',
  totalCost: '£9,600',
  totalPaidNote: 'Paid: £0',
  checkInInstructions: '',
  paymentHistory: [],
  bookingManagementHeading: 'Booking Management',
  cancelBookingActionLabel: 'Cancel Booking',
  vatInvoicesHeading: 'VAT Invoices',
  vatInvoices: [],
  detailPanelsMode: 'confirmed-pre-arrival',
};

/** Static shell for **Completed** bookings (`?booking=completed`) — same layout as active stay, without cancel. */
export const COMPLETED_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL: ClientPortalExtendRebookBookingDetailContent = {
  propertyTitle: 'Queens Terrace',
  referenceCode: 'BH-2025-QT841',
  statusBadgeLabel: 'Completed',
  statusSupportingText: 'Stay ended · 31 December 2025',
  expiringSoonLabel: 'Fully settled',
  address: '14 Queens Road, Coventry, CV1 3EQ',
  dates: '1 October 2025 – 31 December 2025',
  guests: '2',
  totalCost: '£8,100',
  totalPaidNote: 'Paid: £8,100',
  checkInInstructions:
    'Keys were collected from the secure lockbox at the main entrance using the code sent before arrival. Apartment 2A.',
  paymentHistory: [
    { amount: '£4,050', meta: '01/10/2025 · Bank Transfer' },
    { amount: '£4,050', meta: '01/12/2025 · Bank Transfer' },
  ],
  bookingManagementHeading: 'Booking Management',
  cancelBookingActionLabel: 'Cancel Booking',
  vatInvoicesHeading: 'VAT Invoices',
  vatInvoices: [
    {
      invoiceNumber: 'INV-2025-08812',
      periodLabel: '1 Oct 2025 – 31 Oct 2025',
      amountDisplay: '£4,050.00',
      vatNote: '(No VAT)',
      statusLabel: 'Paid',
    },
    {
      invoiceNumber: 'INV-2025-09204',
      periodLabel: '1 Nov 2025 – 31 Dec 2025',
      amountDisplay: '£4,050.00',
      vatNote: '(No VAT)',
      statusLabel: 'Paid',
    },
  ],
  detailPanelsMode: 'active-stay',
  showCancelBooking: false,
  showExpiringSoonBadge: false,
  statusBadgeMuted: true,
};

export type ClientPortalExtendRebookTermsViewProps = {
  className?: string;
  onBack: () => void;
  /** Reserved for checkout / extend flow wiring; optional. */
  onProceed?: () => void;
  content?: ClientPortalExtendRebookBookingDetailContent;
  /** When amendment flow exists, wire here; optional shell. */
  onRequestAmendment?: () => void;
  /** When cancellation flow exists, wire here; optional shell. */
  onCancelBooking?: () => void;
};

/**
 * **Extend or rebook** — active booking detail (Station House reference layout; static shell).
 */
export function ClientPortalExtendRebookTermsView({
  className,
  onBack,
  content = DEFAULT_CLIENT_PORTAL_EXTEND_REBOOK_BOOKING_DETAIL,
  onRequestAmendment,
  onCancelBooking,
}: ClientPortalExtendRebookTermsViewProps) {
  const c = content;
  const panelsMode = c.detailPanelsMode ?? 'active-stay';
  const isConfirmedPreArrival = panelsMode === 'confirmed-pre-arrival';
  const showCancelBooking = c.showCancelBooking !== false;
  const showExpiringSoonBadge = c.showExpiringSoonBadge !== false;

  const confirmedVatGreyPanelRef = useRef<HTMLDivElement>(null);
  const [confirmedVatGreyPanelHeightPx, setConfirmedVatGreyPanelHeightPx] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!isConfirmedPreArrival) {
      setConfirmedVatGreyPanelHeightPx(null);
      return;
    }

    const node = confirmedVatGreyPanelRef.current;
    if (!node) return;

    const measure = () => {
      const { height } = node.getBoundingClientRect();
      setConfirmedVatGreyPanelHeightPx(Math.round(height * 1000) / 1000);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [isConfirmedPreArrival]);

  return (
    <div className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}>
      <div className="flex w-full flex-col gap-6 px-4 pb-20 pt-0 sm:px-8 sm:pb-24 lg:gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className={cn(
                'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-transparent text-[#717680] outline-none',
                'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
              )}
            >
              <ArrowLeft className="size-5" strokeWidth={ICON_STROKE} aria-hidden />
            </button>
            <div className="min-w-0">
              <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0b1d37] sm:text-[30px] sm:leading-[38px]">
                {c.propertyTitle}
              </h1>
              <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                Ref: {c.referenceCode}
              </p>
            </div>
          </div>
          <BookingHubSecondaryButton
            type="button"
            responsive
            responsiveCompact
            fullWidth
            className="justify-center sm:inline-flex sm:w-auto shrink-0 self-start sm:self-center"
            iconLeading={<PenLine className="size-5" strokeWidth={ICON_STROKE} aria-hidden />}
            onClick={() => onRequestAmendment?.()}
          >
            Request Amendment
          </BookingHubSecondaryButton>
        </div>

        <section
          className="flex flex-wrap items-center gap-2 rounded-xl border border-solid border-[#e9eaeb] bg-white px-4 py-3.5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:gap-3 sm:px-5 sm:py-4"
          aria-label="Booking status"
        >
          <span
            className={cn(
              'font-avenir-regular inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold leading-[18px]',
              isConfirmedPreArrival
                ? 'bg-[#00BAB5] text-white'
                : c.statusBadgeMuted
                  ? 'bg-[#E9EAEB] text-[#4B4E53]'
                  : 'bg-[#0B1D37] text-white',
            )}
          >
            {c.statusBadgeLabel}
          </span>
          <p className="font-avenir-regular shrink-0 text-sm font-normal leading-5 text-[#4B4E53] sm:text-base sm:leading-6">
            {c.statusSupportingText}
          </p>
          {showExpiringSoonBadge ? (
            <span className="font-avenir-regular inline-flex shrink-0 items-center rounded-full bg-[#E8A23E] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
              {c.expiringSoonLabel}
            </span>
          ) : null}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
          <PortalClientInfoCard
            className="lg:row-span-3 lg:h-full lg:min-h-0"
            title="Booking Information"
            titleId="client-extend-booking-info-heading"
          >
            <PortalClientInfoRow
              icon={<MapPin className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
              label="Address"
              value={c.address}
            />
            <PortalClientInfoRow
              icon={<Calendar className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
              label="Dates"
              value={c.dates}
            />
            <PortalClientInfoRow
              icon={<Users className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
              label="Guests"
              value={c.guests}
            />
            <PortalClientInfoRow
              icon={<CreditCard className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
              label="Total Cost"
              value={c.totalCost}
              subtext={c.totalPaidNote}
            />
          </PortalClientInfoCard>

          <section className={CARD_SHELL} aria-labelledby="client-extend-checkin-heading">
            <div className="flex items-center gap-2">
              <Key className="size-5 shrink-0 text-[#00BAB5]" strokeWidth={ICON_STROKE} aria-hidden />
              <h2 id="client-extend-checkin-heading" className={TITLE_CLASS}>
                Check-in Instructions
              </h2>
            </div>
            {isConfirmedPreArrival ? (
              <div
                className="mt-4 flex flex-row items-center gap-3 rounded-lg border border-solid border-[#e9eaeb] bg-[#F6F6F4] p-4 sm:p-5"
                style={
                  confirmedVatGreyPanelHeightPx != null
                    ? { minHeight: confirmedVatGreyPanelHeightPx }
                    : undefined
                }
              >
                <Clock className="size-5 shrink-0 text-[#717680]" strokeWidth={ICON_STROKE} aria-hidden />
                <p className="font-avenir-regular min-w-0 flex-1 text-left text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                  {CONFIRMED_CHECKIN_PLACEHOLDER}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-solid border-[#e9eaeb] bg-[#F6F6F4] p-4 sm:p-5">
                <p className="font-avenir-regular text-sm font-normal leading-5 text-[#4B4E53] sm:text-base sm:leading-6">
                  {c.checkInInstructions}
                </p>
              </div>
            )}
          </section>

          <section className={CARD_SHELL} aria-labelledby="client-extend-payment-history-heading">
            <h2 id="client-extend-payment-history-heading" className={TITLE_CLASS}>
              Payment History
            </h2>
            {isConfirmedPreArrival ? (
              <p className="font-avenir-regular mt-4 text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                {CONFIRMED_PAYMENT_HISTORY_EMPTY}
              </p>
            ) : (
              <ul className="mt-4 flex flex-col divide-y divide-[#e9eaeb] border-t border-solid border-[#e9eaeb]" role="list">
                {c.paymentHistory.map((row, index) => (
                  <li key={`${row.amount}-${index}`} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                        {row.amount}
                      </p>
                      <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">{row.meta}</p>
                    </div>
                    <span className="font-avenir-regular inline-flex shrink-0 items-center rounded-full bg-[#0B1D37] px-3 py-1 text-xs font-semibold leading-[18px] text-white">
                      paid
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={CARD_SHELL} aria-labelledby="client-extend-vat-invoices-heading">
            <div className="flex items-center gap-2.5">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00BAB5]/14 text-[#00BAB5]"
                aria-hidden
              >
                <DollarSign className="size-[18px]" strokeWidth={ICON_STROKE} />
              </span>
              <h2 id="client-extend-vat-invoices-heading" className={TITLE_CLASS}>
                {c.vatInvoicesHeading}
              </h2>
            </div>
            {isConfirmedPreArrival ? (
              <div
                ref={confirmedVatGreyPanelRef}
                className="mt-4 rounded-lg border border-solid border-[#e9eaeb] bg-[#F6F6F4] p-4 sm:p-5"
              >
                <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                  {CONFIRMED_VAT_PLACEHOLDER}
                </p>
              </div>
            ) : (
              <ul className="mt-4 flex flex-col gap-3" role="list">
                {c.vatInvoices.map((inv) => (
                  <li
                    key={inv.invoiceNumber}
                    className="flex flex-col gap-4 rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5"
                  >
                    <div className="flex min-w-0 flex-1 gap-3">
                      <FileText className="mt-0.5 size-5 shrink-0 text-[#00BAB5]" strokeWidth={ICON_STROKE} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                          {inv.invoiceNumber}
                        </p>
                        <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">{inv.periodLabel}</p>
                        <div className="font-avenir-regular mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-5">
                          <span className="font-semibold text-[#0b1d37]">{inv.amountDisplay}</span>
                          <span className="font-normal text-[#717680]">{inv.vatNote}</span>
                          <span className="font-avenir-regular inline-flex items-center rounded-full bg-[#0B1D37] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                            {inv.statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[7.5rem]">
                      <BookingHubSecondaryButton
                        type="button"
                        responsive
                        responsiveCompact
                        className="w-full justify-center sm:w-full"
                        iconLeading={<Eye className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />}
                      >
                        View
                      </BookingHubSecondaryButton>
                      <BookingHubPrimaryButton
                        type="button"
                        responsive
                        responsiveCompact
                        className="w-full justify-center sm:w-full"
                        iconLeading={<Download className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />}
                      >
                        PDF
                      </BookingHubPrimaryButton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {showCancelBooking ? (
          <section className={CARD_SHELL} aria-labelledby="client-extend-booking-management-heading">
            <h2 id="client-extend-booking-management-heading" className={TITLE_CLASS}>
              {c.bookingManagementHeading}
            </h2>
            <div className="mt-4 rounded-xl border border-solid border-[#e9eaeb] bg-white px-4 py-4 sm:px-5 sm:py-5">
              <BookingHubSecondaryDeleteButton
                type="button"
                fullWidth
                responsive
                responsiveCompact
                iconLeading={<X className="size-5" strokeWidth={ICON_STROKE} aria-hidden />}
                className="justify-start"
                onClick={() => onCancelBooking?.()}
              >
                {c.cancelBookingActionLabel}
              </BookingHubSecondaryDeleteButton>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
