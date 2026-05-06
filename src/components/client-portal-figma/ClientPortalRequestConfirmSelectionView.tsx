'use client';

import { ArrowLeft, Bed, MapPin } from 'lucide-react';

import {
  ClientPortalBookingTermsCheckoutSection,
  DEFAULT_CLIENT_PORTAL_BOOKING_TERMS_CHECKOUT,
  type ClientPortalBookingTermsCheckoutContent,
} from '@/components/client-portal-figma/ClientPortalBookingTermsCheckoutSection';
import { cn } from '@/lib/utils';

const CARD =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-8';

const ICON_STROKE = 2;

export type ClientPortalRequestConfirmSelectionContent = {
  propertyName: string;
  propertyImageSeed: string;
  locationLine: string;
  bedsLabel: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  durationLabel: string;
  baseCostDescription: string;
  baseCostAmount: string;
  vatLineLabel: string;
  vatAmount: string;
  vatNote: string;
  totalLabel: string;
  totalAmountDisplay: string;
  paymentFrequencyNote: string;
} & ClientPortalBookingTermsCheckoutContent;

export const DEFAULT_CLIENT_PORTAL_REQUEST_CONFIRM_SELECTION: ClientPortalRequestConfirmSelectionContent = {
  propertyName: 'Harbour View Apartments',
  propertyImageSeed: 'bh-confirm-harbour-view',
  locationLine: 'Bristol Harbourside',
  bedsLabel: '3 beds',
  checkIn: '1 April 2026',
  checkOut: '30 June 2026',
  guests: '6',
  durationLabel: '90 nights',
  baseCostDescription: '£82/night exc VAT x 90 nights',
  baseCostAmount: '£7,380',
  vatLineLabel: 'VAT (20%)',
  vatAmount: '£1,476',
  vatNote: '20% VAT applies',
  totalLabel: 'Total amount',
  totalAmountDisplay: '£8,856 exc VAT',
  paymentFrequencyNote: 'Payment frequency: Every 28 days',
  ...DEFAULT_CLIENT_PORTAL_BOOKING_TERMS_CHECKOUT,
};

export type ClientPortalRequestConfirmSelectionViewProps = {
  className?: string;
  onBack: () => void;
  /** When payment is wired, handle checkout; optional so the shell stays inert until then. */
  onProceedToPayment?: () => void;
  content?: ClientPortalRequestConfirmSelectionContent;
};

function termsCheckoutContentFromConfirm(
  c: ClientPortalRequestConfirmSelectionContent,
): ClientPortalBookingTermsCheckoutContent {
  return {
    cancellationHeading: c.cancellationHeading,
    cancellationBullet1: c.cancellationBullet1,
    cancellationBullet2: c.cancellationBullet2,
    billingReferenceCardHeading: c.billingReferenceCardHeading,
    billingReferenceFieldLabel: c.billingReferenceFieldLabel,
    billingReferencePlaceholder: c.billingReferencePlaceholder,
    billingReferenceHelperText: c.billingReferenceHelperText,
    bookingAgentDisclaimer: c.bookingAgentDisclaimer,
    proceedButtonLabel: c.proceedButtonLabel,
  };
}

/**
 * **Confirm selection** — property summary + cost breakdown before payment (client portal; static shell).
 */
export function ClientPortalRequestConfirmSelectionView({
  className,
  onBack,
  onProceedToPayment,
  content = DEFAULT_CLIENT_PORTAL_REQUEST_CONFIRM_SELECTION,
}: ClientPortalRequestConfirmSelectionViewProps) {
  const c = content;
  const imageSrc = `https://picsum.photos/seed/${encodeURIComponent(c.propertyImageSeed)}/400/400`;

  return (
    <div className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-20 pt-0 sm:px-8 sm:pb-24">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
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
              Confirm Selection
            </h1>
            <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
              Review your selection before proceeding to payment
            </p>
          </div>
        </div>

        <section className={CARD} aria-labelledby="client-confirm-property-summary-heading">
          <h2 id="client-confirm-property-summary-heading" className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]">
            Property Summary
          </h2>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-[#F6F6F4] sm:size-28">
              <img
                src={imageSrc}
                alt=""
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-lg sm:leading-7">
                {c.propertyName}
              </h3>
              <p className="font-avenir-regular mt-2 flex items-center gap-1.5 text-sm font-normal leading-5 text-[#717680]">
                <MapPin className="size-4 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
                {c.locationLine}
              </p>
              <span className="font-avenir-regular mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F6F6F4] px-2.5 py-1 text-xs font-semibold leading-[18px] text-[#4B4E53]">
                <Bed className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                {c.bedsLabel}
              </span>
            </div>
          </div>

          <div className="my-6 border-t border-solid border-[#e9eaeb]" role="presentation" />

          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
            <div>
              <dt className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Check-in</dt>
              <dd className="font-avenir-regular mt-0.5 text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                {c.checkIn}
              </dd>
            </div>
            <div>
              <dt className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Check-out</dt>
              <dd className="font-avenir-regular mt-0.5 text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                {c.checkOut}
              </dd>
            </div>
            <div>
              <dt className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Guests</dt>
              <dd className="font-avenir-regular mt-0.5 text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                {c.guests}
              </dd>
            </div>
            <div>
              <dt className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Duration</dt>
              <dd className="font-avenir-regular mt-0.5 text-sm font-semibold leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                {c.durationLabel}
              </dd>
            </div>
          </dl>
        </section>

        <section className={CARD} aria-labelledby="client-confirm-cost-heading">
          <h2 id="client-confirm-cost-heading" className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]">
            Cost Breakdown
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{c.baseCostDescription}</p>
              <p className="font-avenir-regular shrink-0 text-sm font-normal leading-5 text-[#717680]">{c.baseCostAmount}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-4">
                <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{c.vatLineLabel}</p>
                <p className="font-avenir-regular shrink-0 text-sm font-normal leading-5 text-[#717680]">{c.vatAmount}</p>
              </div>
              <p className="font-avenir-regular text-xs font-normal leading-4 text-[#717680]">{c.vatNote}</p>
            </div>
          </div>

          <div className="my-6 border-t border-solid border-[#e9eaeb]" role="presentation" />

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">{c.totalLabel}</span>
              <span className="font-avenir-regular shrink-0 text-lg font-semibold leading-7 text-[#00BAB5] sm:text-xl sm:leading-8">
                {c.totalAmountDisplay}
              </span>
            </div>
            <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">{c.paymentFrequencyNote}</p>
          </div>
        </section>

        <ClientPortalBookingTermsCheckoutSection
          idPrefix="client-confirm"
          content={termsCheckoutContentFromConfirm(c)}
          onProceed={onProceedToPayment}
        />
      </div>
    </div>
  );
}
