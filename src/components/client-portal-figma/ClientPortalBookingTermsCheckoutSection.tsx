'use client';

import { useState } from 'react';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button/BookingHubPrimaryButton';
import { cn } from '@/lib/utils';

const CARD =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-8';

const ICON_STROKE = 2;

export type ClientPortalBookingTermsCheckoutContent = {
  cancellationHeading: string;
  cancellationBullet1: string;
  cancellationBullet2: string;
  billingReferenceCardHeading: string;
  billingReferenceFieldLabel: string;
  billingReferencePlaceholder: string;
  billingReferenceHelperText: string;
  bookingAgentDisclaimer: string;
  proceedButtonLabel: string;
};

export const DEFAULT_CLIENT_PORTAL_BOOKING_TERMS_CHECKOUT: ClientPortalBookingTermsCheckoutContent = {
  cancellationHeading: 'Cancellation Terms',
  cancellationBullet1: 'More than 14 days notice: full refund minus 5%',
  cancellationBullet2: 'Less than 14 days notice: no refund',
  billingReferenceCardHeading: 'Billing Reference',
  billingReferenceFieldLabel: 'PO / Reference Number',
  billingReferencePlaceholder: 'e.g. PO-2026-0041 or claim reference',
  billingReferenceHelperText:
    'Optional. If provided, this reference will appear on all invoices for this booking.',
  bookingAgentDisclaimer:
    'Booking Hub acts as a booking agent. Where applicable, VAT invoices for accommodation will be issued directly by the accommodation provider.',
  proceedButtonLabel: 'Confirm Selection & Proceed to Payment',
};

export type ClientPortalBookingTermsCheckoutSectionProps = {
  className?: string;
  /** Prefix for stable `id` / `aria-labelledby` hooks when multiple instances exist on one route. */
  idPrefix: string;
  content?: ClientPortalBookingTermsCheckoutContent;
  onProceed?: () => void;
};

/**
 * Shared **cancellation notice**, **billing reference**, **VAT disclaimer**, and **primary CTA**
 * used on confirm-selection and extend/rebook flows (client portal).
 */
export function ClientPortalBookingTermsCheckoutSection({
  className,
  idPrefix,
  content = DEFAULT_CLIENT_PORTAL_BOOKING_TERMS_CHECKOUT,
  onProceed,
}: ClientPortalBookingTermsCheckoutSectionProps) {
  const c = content;
  const [billingReference, setBillingReference] = useState('');
  const cancellationHeadingId = `${idPrefix}-cancellation-heading`;
  const billingHeadingId = `${idPrefix}-billing-heading`;

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      <section
        role="region"
        aria-labelledby={cancellationHeadingId}
        className="rounded-xl border border-solid border-[#FEDF89] bg-[#FFFAEB] p-5 sm:p-6"
      >
        <div className="flex gap-3 sm:gap-4">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-[#D97706]"
            strokeWidth={ICON_STROKE}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <h2
              id={cancellationHeadingId}
              className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-lg sm:leading-7"
            >
              {c.cancellationHeading}
            </h2>
            <ul className="font-avenir-regular mt-3 list-disc space-y-2 pl-5 text-sm font-normal leading-5 text-[#4B4E53] sm:text-base sm:leading-6">
              <li>{c.cancellationBullet1}</li>
              <li>{c.cancellationBullet2}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={CARD} aria-labelledby={billingHeadingId}>
        <h2
          id={billingHeadingId}
          className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]"
        >
          {c.billingReferenceCardHeading}
        </h2>
        <div className="mt-5">
          <BookingHubInputField
            id={`${idPrefix}-billing-reference`}
            name="billingReference"
            type="text"
            label={c.billingReferenceFieldLabel}
            placeholder={c.billingReferencePlaceholder}
            helperText={c.billingReferenceHelperText}
            value={billingReference}
            onChange={(e) => setBillingReference(e.target.value)}
            autoComplete="off"
            size="md"
          />
        </div>
      </section>

      <div className="flex w-full flex-col gap-6">
        <p className="font-avenir-regular mx-auto max-w-2xl text-center text-xs font-normal leading-[18px] text-[#717680] sm:text-sm sm:leading-5">
          {c.bookingAgentDisclaimer}
        </p>
        <div className="w-full">
          <BookingHubPrimaryButton
            type="button"
            responsive
            responsiveCompact
            fullWidth
            className="rounded-full"
            iconLeading={<CheckCircle2 className="size-5" strokeWidth={2} aria-hidden />}
            onClick={() => onProceed?.()}
          >
            {c.proceedButtonLabel}
          </BookingHubPrimaryButton>
        </div>
      </div>
    </div>
  );
}
