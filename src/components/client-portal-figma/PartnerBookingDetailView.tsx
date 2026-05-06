'use client';

import { useRouter } from 'next/navigation';

import {
  ArrowRight,
  Building2,
  Calendar,
  FileText,
  KeyRound,
  MapPin,
  Moon,
  Plus,
  PoundSterling,
  Users,
  XCircle,
} from 'lucide-react';

import {
  BookingHubPrimaryButton,
  BookingHubSecondaryButton,
  BookingHubSecondaryDeleteButton,
} from '@/components/booking-hub-button';
import {
  bookingStatusLabel,
  bookingStatusPillClass,
  partnerBookingPayoutBadgeClass,
  type PartnerBookingDetail,
} from '@/components/client-portal-figma/partnerBookingData';
import { PARTNER_PORTAL_PAYOUTS_HREF } from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { cn } from '@/lib/utils';

const CARD = cn(
  'rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_1px_rgba(10,13,18,0.05)]',
);

const SUMMARY_ICON_WRAP =
  'mb-3 flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#535862]';

const VAT_INVOICE_BODY =
  'Generate a VAT invoice for this booking covering the client, property, dates and VAT breakdown.';

function completedCheckInField(value: string | undefined): string {
  return value != null && value.trim() !== '' ? value : '—';
}

export type PartnerBookingDetailViewProps = {
  className?: string;
  detail: PartnerBookingDetail;
  onBack: () => void;
};

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string | number;
}) {
  return (
    <div className={cn(CARD, 'p-5')}>
      <div className={SUMMARY_ICON_WRAP} aria-hidden>
        <Icon className="size-5" strokeWidth={2} />
      </div>
      <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{label}</p>
      <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">{value}</p>
    </div>
  );
}

/**
 * Partner **Booking details** — layout aligned with Booking Hub guidelines + design comps.
 */
export function PartnerBookingDetailView({ className, detail, onBack }: PartnerBookingDetailViewProps) {
  const router = useRouter();

  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <button
        type="button"
        onClick={onBack}
        className="font-avenir-regular inline-flex w-fit items-center gap-1 text-sm font-medium text-[#717680] transition-colors hover:text-[#0B1D37]"
      >
        <span aria-hidden>←</span> Back to Bookings
      </button>

      <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-3 gap-y-2">
            <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
              {detail.bookingId}
            </h1>
            <span
              className={cn(
                'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                bookingStatusPillClass(detail.status),
              )}
            >
              {bookingStatusLabel(detail.status)}
            </span>
          </div>
          <p className="font-avenir-regular text-base font-normal leading-6 text-[#717680]">{detail.propertyName}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile icon={Calendar} label="Check-in" value={detail.checkInDisplay} />
        <SummaryTile icon={Calendar} label="Check-out" value={detail.checkOutDisplay} />
        <SummaryTile icon={Moon} label="Nights" value={detail.nights} />
        <SummaryTile icon={Users} label="Guests" value={detail.guests} />
      </div>

      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-booking-overview-heading">
        <h2 id="partner-booking-overview-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
          Booking Overview
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-[#e9eaeb] border-t border-[#e9eaeb]">
          <div className="flex gap-4 py-4 first:pt-4">
            <div className="mt-0.5 shrink-0 text-[#00BAB5]" aria-hidden>
              <Building2 className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Client Company</p>
              <p className="font-avenir-regular mt-0.5 text-base font-semibold leading-6 text-[#0B1D37]">
                {detail.clientCompany}
              </p>
            </div>
          </div>
          <div className="flex gap-4 py-4">
            <div className="mt-0.5 shrink-0 text-[#00BAB5]" aria-hidden>
              <MapPin className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Property Address</p>
              <p className="font-avenir-regular mt-0.5 text-base font-semibold leading-6 text-[#0B1D37]">
                {detail.propertyAddress}
              </p>
            </div>
          </div>
          <div className="flex gap-4 py-4">
            <div className="mt-0.5 shrink-0 text-[#00BAB5]" aria-hidden>
              <PoundSterling className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">
                Total Booking Value (Gross)
              </p>
              <p className="font-avenir-regular mt-0.5 text-base font-semibold leading-6 text-[#0B1D37]">
                {detail.totalBookingValueGross}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-booking-checkin-heading">
        <h2 id="partner-booking-checkin-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
          Check-in Instructions
        </h2>
        {detail.status === 'completed' ? (
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Access Method</p>
              <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">
                {completedCheckInField(detail.checkInAccessMethod)}
              </p>
            </div>
            <div>
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Key / Lockbox Code</p>
              <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">
                {completedCheckInField(detail.checkInKeyLockboxCode)}
              </p>
            </div>
            <div>
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Parking</p>
              <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">
                {completedCheckInField(detail.checkInParking)}
              </p>
            </div>
            <div>
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Arrival Notes</p>
              <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">
                {completedCheckInField(detail.checkInArrivalNotes)}
              </p>
            </div>
          </div>
        ) : (
          <p className="font-avenir-regular mt-4 text-sm font-normal leading-6 text-[#717680] sm:text-base sm:leading-7">
            {detail.checkInInstructions}
          </p>
        )}
      </section>

      {/* Payout */}
      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-booking-payout-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="partner-booking-payout-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
            Payout
          </h2>
          <span
            className={cn(
              'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
              partnerBookingPayoutBadgeClass(detail.payoutStatusBadge),
            )}
          >
            {detail.payoutStatusBadge}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Net Payout Amount</p>
            <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">
              {detail.netPayoutAmount}
            </p>
          </div>
          <div>
            <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">
              Scheduled Release Date
            </p>
            <p className="font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]">
              {detail.scheduledReleaseDateDisplay}
            </p>
          </div>
        </div>
        <p className="font-avenir-regular mt-5 text-sm font-normal leading-6 text-[#717680]">
          {detail.payoutScheduledLine}
        </p>
        <BookingHubSecondaryButton
          type="button"
          responsive
          responsiveCompact
          className="mt-5 shrink-0 self-start"
          iconTrailing={<ArrowRight className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
          onClick={() => router.push(PARTNER_PORTAL_PAYOUTS_HREF)}
        >
          View Payout Details
        </BookingHubSecondaryButton>
      </section>

      {/* Check-in instructions required (amber banner) */}
      {detail.showCheckInInstructionsActionBanner ? (
        <section
          className="rounded-[12px] border border-[#FEDF89] bg-[#FFFAEB] p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-5"
          aria-labelledby="partner-booking-checkin-banner-heading"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8A23E] text-white"
                aria-hidden
              >
                <KeyRound className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h2
                  id="partner-booking-checkin-banner-heading"
                  className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]"
                >
                  Check-in instructions required
                </h2>
                <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">
                  Add instructions before the 24-hour send window.
                </p>
              </div>
            </div>
            <BookingHubPrimaryButton
              type="button"
              responsive
              responsiveCompact
              className="shrink-0 sm:self-center"
              iconLeading={<Plus className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
            >
              Add Instructions
            </BookingHubPrimaryButton>
          </div>
        </section>
      ) : null}

      {/* VAT Invoice */}
      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-booking-vat-heading">
        <h2 id="partner-booking-vat-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
          VAT Invoice
        </h2>
        <p className="font-avenir-regular mt-3 text-sm font-normal leading-6 text-[#717680] sm:text-base sm:leading-7">
          {VAT_INVOICE_BODY}
        </p>
        <BookingHubPrimaryButton
          type="button"
          responsive
          responsiveCompact
          className="mt-5 shrink-0 self-start"
          iconLeading={<FileText className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
        >
          Generate VAT Invoice
        </BookingHubPrimaryButton>
      </section>

      {/* Booking Management */}
      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-booking-management-heading">
        <h2 id="partner-booking-management-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
          Booking Management
        </h2>
        <BookingHubSecondaryDeleteButton
          type="button"
          fullWidth
          responsive
          responsiveCompact
          className="mt-5 justify-center"
          iconLeading={<XCircle className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
        >
          Cancel Booking
        </BookingHubSecondaryDeleteButton>
      </section>
    </div>
  );
}
