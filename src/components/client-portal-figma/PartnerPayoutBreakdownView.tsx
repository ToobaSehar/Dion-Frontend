'use client';

import { ArrowRight, Download, FileText } from 'lucide-react';

import {
  BookingHubPrimaryButton,
  BookingHubSecondaryButton,
} from '@/components/booking-hub-button';
import type { PartnerPayoutBreakdownDetail } from '@/components/client-portal-figma/partnerPayoutBreakdownData';
import { partnerPayoutStatusPillClass } from '@/components/client-portal-figma/PartnerPortalPayoutsView';
import { cn } from '@/lib/utils';

const CARD = cn(
  'rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_1px_rgba(10,13,18,0.05)]',
);

const CARD_SECTION_TITLE = 'font-avenir-regular text-lg font-semibold text-[#0B1D37]';
const CARD_FIELD_LABEL = 'font-avenir-regular text-sm font-normal leading-5 text-[#717680]';
const CARD_FIELD_VALUE = 'font-avenir-regular mt-1 text-base font-semibold leading-6 text-[#0B1D37]';

function MoneyRow({
  label,
  value,
  labelClassName,
  valueClassName,
  valueMuted,
}: {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
  /** Secondary line (e.g. “Not applicable”) — normal weight, muted. */
  valueMuted?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className={cn('font-avenir-regular text-sm font-normal leading-5 text-[#717680]', labelClassName)}>
        {label}
      </span>
      <span
        className={cn(
          'font-avenir-regular shrink-0 text-sm leading-5',
          valueMuted
            ? 'font-normal text-[#717680]'
            : 'font-semibold tabular-nums text-[#0B1D37]',
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

export type PartnerPayoutBreakdownViewProps = {
  className?: string;
  detail: PartnerPayoutBreakdownDetail;
  onBack: () => void;
};

/**
 * Partner **Payout breakdown** — line items + VAT / commission / Stripe / net payout (static shell until API wiring).
 */
export function PartnerPayoutBreakdownView({ className, detail, onBack }: PartnerPayoutBreakdownViewProps) {
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <button
        type="button"
        onClick={onBack}
        className="font-avenir-regular inline-flex w-fit items-center gap-1 text-sm font-medium text-[#717680] transition-colors hover:text-[#0B1D37]"
      >
        <span aria-hidden>←</span> Back to Payouts
      </button>

      <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-3 gap-y-2">
            <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
              {detail.bookingRef}
            </h1>
            <span
              className={cn(
                'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                partnerPayoutStatusPillClass(detail.status),
              )}
            >
              {detail.statusLabel}
            </span>
          </div>
          <p className="font-avenir-regular text-base font-normal leading-6 text-[#717680]">{detail.propertyName}</p>
        </div>
      </header>

      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-payout-breakdown-heading">
        <h2 id="partner-payout-breakdown-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
          Payout Breakdown
        </h2>

        <div className="mt-5 space-y-3">
          <MoneyRow label="Accommodation value (exc. VAT)" value={detail.accommodationExcVat} />
          <MoneyRow
            label="VAT on accommodation (20%)"
            value={detail.vatOnAccommodation}
            valueMuted={detail.vatOnAccommodationMuted}
          />
          <MoneyRow
            label="Total client pays"
            value={detail.totalClientPays}
            labelClassName="font-semibold text-[#0B1D37]"
            valueClassName="text-base font-semibold leading-6"
          />
        </div>

        <div className="my-5 border-t border-[#e9eaeb]" />

        <div className="space-y-3">
          <MoneyRow label="Booking Hub commission (15%)" value={detail.commission} />
          <MoneyRow label="VAT on commission (20%)" value={detail.vatOnCommission} />
          <MoneyRow label="Stripe processing fee" value={detail.stripeFee} />
        </div>

        <div className="my-5 border-t border-[#e9eaeb]" />

        <div className="flex justify-between gap-4">
          <span className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">Net payout to you</span>
          <span className="font-avenir-regular text-base font-semibold tabular-nums leading-6 text-booking-teal">
            {detail.netPayout}
          </span>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <BookingHubSecondaryButton
          type="button"
          fullWidth
          responsive
          responsiveCompact
          className="justify-center"
          iconLeading={<Download className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
          iconTrailing={<ArrowRight className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
        >
          Download Payout Summary & Commission Invoice
        </BookingHubSecondaryButton>
        {detail.showGenerateVatInvoiceButton ? (
          <BookingHubPrimaryButton
            type="button"
            fullWidth
            responsive
            responsiveCompact
            className="justify-center"
            iconLeading={<FileText className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
            iconTrailing={<ArrowRight className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
          >
            Generate VAT Invoice for Client
          </BookingHubPrimaryButton>
        ) : null}
      </div>

      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-payout-status-summary-heading">
        <h2 id="partner-payout-status-summary-heading" className={CARD_SECTION_TITLE}>
          Payout Status
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className={CARD_FIELD_LABEL}>Payout status</p>
            <p className={CARD_FIELD_VALUE}>{detail.payoutStatusSummaryValue}</p>
          </div>
          <div>
            <p className={CARD_FIELD_LABEL}>Release date</p>
            <p className={CARD_FIELD_VALUE}>{detail.payoutReleaseDateSummary}</p>
          </div>
        </div>
        {detail.payoutStatusFooterNote ? (
          <p className="font-avenir-regular mt-5 text-sm font-normal leading-6 text-[#717680]">
            {detail.payoutStatusFooterNote}
          </p>
        ) : null}
      </section>

      <section className={cn(CARD, 'p-5 sm:p-6')} aria-labelledby="partner-payout-booking-details-heading">
        <h2 id="partner-payout-booking-details-heading" className={CARD_SECTION_TITLE}>
          Booking Details
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className={CARD_FIELD_LABEL}>Check-in date</p>
            <p className={CARD_FIELD_VALUE}>{detail.bookingCheckInDisplay}</p>
          </div>
          <div>
            <p className={CARD_FIELD_LABEL}>Check-out date</p>
            <p className={CARD_FIELD_VALUE}>{detail.bookingCheckOutDisplay}</p>
          </div>
          <div>
            <p className={CARD_FIELD_LABEL}>Number of guests</p>
            <p className={CARD_FIELD_VALUE}>{detail.bookingGuestsDisplay}</p>
          </div>
          <div>
            <p className={CARD_FIELD_LABEL}>Total booking value</p>
            <p className={CARD_FIELD_VALUE}>{detail.bookingTotalValueDisplay}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
