'use client';

import { useId, useMemo, useState } from 'react';

import { ArrowLeft, ArrowRight, Building2, Check, CreditCard, ShieldAlert } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';

import { cn } from '@/lib/utils';

const ICON_STROKE = 2;

type PaymentMethodChoice = 'card' | 'bank_transfer';

function PaymentMethodRadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white',
        selected ? 'border-[#00BAB5]' : 'border-[#e9eaeb]',
      )}
      aria-hidden
    >
      {selected ? <span className="size-2.5 rounded-full bg-[#00BAB5]" /> : null}
    </span>
  );
}

const CARD =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-8';

const CANCELLATION_POLICY_BULLETS = [
  'More than 14 days before check-in: full refund minus 5% admin fee',
  'Less than 14 days before check-in: no refund',
  'Every 28 days bookings: 14-day notice required to cancel',
] as const;

export type ClientPortalMakePaymentLineItem = {
  description: string;
  amountDisplay: string;
};

export type ClientPortalMakePaymentContent = {
  /** Shown in subtitle after “Pay your next 28-day period for …”. */
  bookingGroupName: string;
  bookingReference: string;
  periodDisplay: string;
  lineItems: ClientPortalMakePaymentLineItem[];
  totalAmountDisplay: string;
  footerNote: string;
};

export const DEFAULT_CLIENT_PORTAL_MAKE_PAYMENT: ClientPortalMakePaymentContent = {
  bookingGroupName: 'Bristol Group Booking',
  bookingReference: 'BG-2026-0001',
  periodDisplay: '1 Apr 2026 – 29 Apr 2026 (28 days)',
  lineItems: [
    {
      description: 'Harbour View Apartments · 28 nights × £82 exc VAT',
      amountDisplay: '£2,755.20 inc VAT',
    },
    {
      description: 'Temple Quarter Studios · 28 nights × £78',
      amountDisplay: '£2,184.00',
    },
  ],
  totalAmountDisplay: '£4,939.20',
  footerNote: 'This payment covers your next 28-day period',
};

export type ClientPortalMakePaymentViewProps = {
  className?: string;
  onBackToSchedule: () => void;
  content?: ClientPortalMakePaymentContent;
};

function SummaryRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-avenir-regular shrink-0 text-sm font-normal leading-5 text-[#717680]">{label}</span>
      <span
        className={cn(
          'font-avenir-regular max-w-[65%] text-right text-sm font-normal leading-5 text-[#0b1d37] sm:max-w-none sm:text-base sm:leading-6',
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * **Make Payment** — payment summary shell (client portal; static until Stripe/API wiring).
 */
export function ClientPortalMakePaymentView({
  className,
  onBackToSchedule,
  content = DEFAULT_CLIENT_PORTAL_MAKE_PAYMENT,
}: ClientPortalMakePaymentViewProps) {
  const c = content;
  const paymentMethodGroupId = useId();
  const cancellationSectionId = useId();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodChoice>('card');
  const [cancellationAccepted, setCancellationAccepted] = useState(true);

  const subtitle = useMemo(
    () => `Pay your next 28-day period for ${c.bookingGroupName}`,
    [c.bookingGroupName],
  );

  return (
    <div className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-20 pt-0 sm:px-8 sm:pb-24">
        <button
          type="button"
          onClick={onBackToSchedule}
          className={cn(
            'font-avenir-regular inline-flex w-fit items-center gap-2 text-sm font-normal leading-5 text-[#717680] outline-none',
            'transition-colors hover:text-[#0b1d37]',
            'focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
          )}
        >
          <ArrowLeft className="size-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
          Back to Payment Schedule
        </button>

        <div>
          <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0b1d37] sm:text-[30px] sm:leading-[38px]">
            Make Payment
          </h1>
          <p className="font-avenir-regular mt-1 max-w-2xl text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
            {subtitle}
          </p>
        </div>

        <section className={CARD} aria-labelledby="client-make-payment-summary-heading">
          <h2
            id="client-make-payment-summary-heading"
            className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]"
          >
            Payment Summary
          </h2>

          <div className="font-avenir-regular mt-6 flex flex-col gap-4">
            <SummaryRow label="Booking reference" value={c.bookingReference} />
            <SummaryRow label="Period" value={c.periodDisplay} />
          </div>

          <div className="my-6 border-t border-solid border-[#e9eaeb]" role="presentation" />

          <ul className="flex flex-col gap-4" role="list">
            {c.lineItems.map((line, index) => (
              <li key={`${line.description}-${index}`} className="flex items-start justify-between gap-4">
                <p className="font-avenir-regular min-w-0 flex-1 text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                  {line.description}
                </p>
                <p className="font-avenir-regular shrink-0 text-right text-sm font-normal leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                  {line.amountDisplay}
                </p>
              </li>
            ))}
          </ul>

          <div className="my-6 border-t border-solid border-[#e9eaeb]" role="presentation" />

          <div className="flex items-baseline justify-between gap-4">
            <span className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">Total amount</span>
            <span className="font-avenir-regular shrink-0 text-lg font-semibold leading-7 text-[#00BAB5] sm:text-xl sm:leading-8">
              {c.totalAmountDisplay}
            </span>
          </div>

          <p className="font-avenir-regular mt-6 text-xs font-normal leading-[18px] text-[#717680] sm:text-sm sm:leading-5">
            {c.footerNote}
          </p>
        </section>

        <section className={CARD} aria-labelledby={`${paymentMethodGroupId}-method-heading`}>
          <h2
            id={`${paymentMethodGroupId}-method-heading`}
            className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]"
          >
            Payment Method
          </h2>

          <div
            className="mt-5 flex flex-col gap-3"
            role="radiogroup"
            aria-labelledby={`${paymentMethodGroupId}-method-heading`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={paymentMethod === 'card'}
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border-2 bg-white p-4 text-left outline-none transition-[border-color]',
                'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                paymentMethod === 'card' ? 'border-[#00BAB5]' : 'border-[#e9eaeb] hover:border-[#d5d7da]',
              )}
            >
              <PaymentMethodRadioIndicator selected={paymentMethod === 'card'} />
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#00BAB5]/14 text-[#00BAB5]"
                aria-hidden
              >
                <CreditCard className="size-6" strokeWidth={ICON_STROKE} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-avenir-regular block text-base font-semibold leading-6 text-[#0b1d37]">
                  Card Payment
                </span>
                <span className="font-avenir-regular mt-1 block text-sm font-normal leading-5 text-[#717680]">
                  Pay immediately by debit or credit card
                </span>
              </span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={paymentMethod === 'bank_transfer'}
              onClick={() => setPaymentMethod('bank_transfer')}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border-2 bg-white p-4 text-left outline-none transition-[border-color]',
                'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                paymentMethod === 'bank_transfer' ? 'border-[#00BAB5]' : 'border-[#e9eaeb] hover:border-[#d5d7da]',
              )}
            >
              <PaymentMethodRadioIndicator selected={paymentMethod === 'bank_transfer'} />
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#00BAB5]/14 text-[#00BAB5]"
                aria-hidden
              >
                <Building2 className="size-6" strokeWidth={ICON_STROKE} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-avenir-regular block text-base font-semibold leading-6 text-[#0b1d37]">
                  Bank Transfer
                </span>
                <span className="font-avenir-regular mt-1 block text-sm font-normal leading-5 text-[#717680]">
                  We&apos;ll send bank transfer details immediately on confirmation
                </span>
              </span>
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <div
              className="font-avenir-regular mt-6 rounded-xl border border-dotted border-[#e9eaeb] bg-[#F6F6F4] px-4 py-6 text-center text-sm font-normal leading-5 text-[#717680] sm:py-7"
              aria-label="Payment details placeholder"
            >
              Stripe payment form loads here
            </div>
          ) : null}
        </section>

        <section
          className="rounded-xl border border-solid border-[#e9eaeb] bg-[#F6F6F4] p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-6"
          aria-labelledby={`${cancellationSectionId}-cancellation-heading`}
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-6 shrink-0 text-[#00BAB5]" strokeWidth={ICON_STROKE} aria-hidden />
            <div className="min-w-0 flex-1">
              <h2
                id={`${cancellationSectionId}-cancellation-heading`}
                className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-lg sm:leading-7"
              >
                Cancellation Policy
              </h2>
              <ul className="font-avenir-regular mt-4 list-none space-y-2.5 text-sm font-normal leading-5 text-[#535862] sm:text-base sm:leading-6">
                {CANCELLATION_POLICY_BULLETS.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#00BAB5]" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-solid border-[#e9eaeb] bg-white p-4 sm:p-5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={cancellationAccepted}
                  onClick={() => setCancellationAccepted((v) => !v)}
                  className={cn(
                    'flex w-full items-start gap-3 text-left outline-none',
                    'focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                      cancellationAccepted
                        ? 'border-[#00BAB5] bg-[#00BAB5]'
                        : 'border-[#00BAB5] bg-white',
                    )}
                    aria-hidden
                  >
                    {cancellationAccepted ? (
                      <Check className="size-3 text-white" strokeWidth={2.5} aria-hidden />
                    ) : null}
                  </span>
                  <span className="font-avenir-regular text-sm font-normal leading-5 text-[#0b1d37] sm:text-base sm:leading-6">
                    I have read and accept the cancellation policy
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center gap-6">
          <div
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            role="group"
            aria-label="Stripe — payments processed securely"
          >
            <img
              src="/stripe-logo.webp"
              alt=""
              width={120}
              height={48}
              className="h-9 w-auto max-w-[min(100%,220px)] shrink-0 object-contain object-center sm:h-10"
              decoding="async"
            />
            <span className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">
              Payments processed securely
            </span>
          </div>

          <BookingHubPrimaryButton
            type="button"
            responsive
            responsiveCompact
            fullWidth
            disabled={!cancellationAccepted}
            className={cn(
              !cancellationAccepted &&
                'border-[#e9eaeb] bg-[#F6F6F4] text-[#4B4E53] [&_svg]:text-[#4B4E53] [&_span]:text-[#4B4E53]',
            )}
            iconTrailing={<ArrowRight className="size-5 shrink-0" aria-hidden strokeWidth={ICON_STROKE} />}
          >
            Pay {c.totalAmountDisplay} Now
          </BookingHubPrimaryButton>

          <p className="font-avenir-regular max-w-xl px-2 text-center text-xs font-normal leading-[18px] text-[#717680] sm:text-sm sm:leading-5">
            Booking Hub acts as a booking agent. Where applicable, VAT invoices for accommodation will be issued directly
            by the accommodation provider.
          </p>
        </div>
      </div>
    </div>
  );
}
