'use client';

import { useCallback, useId, useMemo, useState } from 'react';

import { ArrowLeft, CalendarClock, CalendarPlus, Send, Users } from 'lucide-react';

import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button/BookingHubPrimaryButton';
import { cn } from '@/lib/utils';

const ICON_STROKE = 2;

const CARD =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-8';

const CHANGE_DATES_SUMMARY_STATIC = {
  sameNightsLabel: 'Same number of nights',
  sameNightsValue: '90 nights',
  noChargeLabel: 'No additional charge',
  noChargeValue: '£0',
} as const;

const UPDATE_GUESTS_SUMMARY_LEAD =
  'Guest count changes may affect property suitability. The partner will review and confirm.';

export type ClientPortalRequestAmendmentChangeKind = 'extend_stay' | 'change_dates' | 'update_guests';

export type ClientPortalRequestAmendmentSummaryContent = {
  originalStayLine: string;
  newStayLine: string;
  additionalCostLabel: string;
  additionalCostValue: string;
  footerNote: string;
  confirmButtonLabel: string;
};

export type ClientPortalRequestAmendmentContent = {
  propertyTitle: string;
  referenceCode: string;
  /** Optional override for the pricing summary + CTA labels (static shell). */
  summary?: Partial<ClientPortalRequestAmendmentSummaryContent>;
};

export const DEFAULT_CLIENT_PORTAL_REQUEST_AMENDMENT_SUMMARY: ClientPortalRequestAmendmentSummaryContent = {
  originalStayLine: '90 nights – £9,600',
  newStayLine: '134 nights – £14,400',
  additionalCostLabel: 'Additional cost',
  additionalCostValue: '£4,800 due now',
  footerNote:
    "This amendment request will be sent to the property partner for approval. You'll be notified of their response.",
  confirmButtonLabel: 'Confirm Amendment Request',
};

export const DEFAULT_CLIENT_PORTAL_REQUEST_AMENDMENT: ClientPortalRequestAmendmentContent = {
  propertyTitle: 'Station House',
  referenceCode: 'BH-1C4F6A8B',
};

export type ClientPortalRequestAmendmentViewProps = {
  className?: string;
  onBack: () => void;
  content?: ClientPortalRequestAmendmentContent;
};

type AmendmentOption = {
  id: ClientPortalRequestAmendmentChangeKind;
  title: string;
  description: string;
  icon: typeof CalendarPlus;
};

const OPTIONS: AmendmentOption[] = [
  {
    id: 'extend_stay',
    title: 'Extend Stay',
    description: 'Add more nights to your booking',
    icon: CalendarPlus,
  },
  {
    id: 'change_dates',
    title: 'Change Dates',
    description: 'Move your check-in or check-out dates',
    icon: CalendarClock,
  },
  {
    id: 'update_guests',
    title: 'Update Guest Count',
    description: 'Change the number of guests',
    icon: Users,
  },
];

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#00BAB5]',
        selected ? '' : 'bg-white',
      )}
      aria-hidden
    >
      {selected ? <span className="size-2.5 rounded-full bg-[#00BAB5]" /> : null}
    </span>
  );
}

/**
 * **Request amendment** — change intent + detail fields (client portal shell; static until API wiring).
 * Matches reference layout: radio-style cards, teal accents, hub inputs.
 */
export function ClientPortalRequestAmendmentView({
  className,
  onBack,
  content = DEFAULT_CLIENT_PORTAL_REQUEST_AMENDMENT,
}: ClientPortalRequestAmendmentViewProps) {
  const c = content;
  const groupId = useId();
  const [changeKind, setChangeKind] = useState<ClientPortalRequestAmendmentChangeKind>('extend_stay');
  const [newCheckoutIso, setNewCheckoutIso] = useState('2026-05-29');
  const [newCheckInIso, setNewCheckInIso] = useState('2026-02-01');
  const [newCheckOutDatesIso, setNewCheckOutDatesIso] = useState('2026-05-02');
  const [guestCount, setGuestCount] = useState('3');

  const subtitle = useMemo(() => `${c.propertyTitle} · ${c.referenceCode}`, [c.propertyTitle, c.referenceCode]);

  const summary = useMemo(
    () => ({ ...DEFAULT_CLIENT_PORTAL_REQUEST_AMENDMENT_SUMMARY, ...c.summary }),
    [c.summary],
  );

  const renderDetailFields = useCallback(() => {
    if (changeKind === 'extend_stay') {
      return (
        <BookingHubInputField
          id={`${groupId}-checkout`}
          name="newCheckout"
          type="date"
          label="New Check-out Date"
          value={newCheckoutIso}
          onChange={(e) => setNewCheckoutIso(e.target.value)}
          size="md"
        />
      );
    }
    if (changeKind === 'change_dates') {
      return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 lg:gap-6">
          <div className="min-w-0">
            <BookingHubInputField
              id={`${groupId}-checkin`}
              name="newCheckIn"
              type="date"
              label="New Check-in"
              value={newCheckInIso}
              onChange={(e) => setNewCheckInIso(e.target.value)}
              size="md"
            />
          </div>
          <div className="min-w-0">
            <BookingHubInputField
              id={`${groupId}-checkout-dates`}
              name="newCheckOutDates"
              type="date"
              label="New Check-out"
              value={newCheckOutDatesIso}
              onChange={(e) => setNewCheckOutDatesIso(e.target.value)}
              size="md"
            />
          </div>
        </div>
      );
    }
    return (
      <BookingHubInputField
        id={`${groupId}-guests`}
        name="guestCount"
        type="number"
        label="New Guest Count"
        min={1}
        value={guestCount}
        onChange={(e) => setGuestCount(e.target.value)}
        size="md"
      />
    );
  }, [
    changeKind,
    groupId,
    guestCount,
    newCheckInIso,
    newCheckOutDatesIso,
    newCheckoutIso,
  ]);

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
              Request Amendment
            </h1>
            <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
              {subtitle}
            </p>
          </div>
        </div>

        <section className={CARD} aria-labelledby={`${groupId}-change-heading`}>
          <h2
            id={`${groupId}-change-heading`}
            className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]"
          >
            What would you like to change?
          </h2>
          <div
            className="mt-5 flex flex-col gap-3"
            role="radiogroup"
            aria-label="Amendment type"
          >
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const selected = changeKind === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setChangeKind(opt.id)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left outline-none transition-[border-color,box-shadow,background-color]',
                    'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
                    selected
                      ? 'border-[#00BAB5] bg-[#00BAB5]/10 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]'
                      : 'border-[#e9eaeb] bg-white hover:border-[#d5d7da]',
                  )}
                >
                  <RadioIndicator selected={selected} />
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#00BAB5]/14 text-[#00BAB5]"
                    aria-hidden
                  >
                    <Icon className="size-6" strokeWidth={ICON_STROKE} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-avenir-regular block text-base font-semibold leading-6 text-[#0b1d37]">
                      {opt.title}
                    </span>
                    <span className="font-avenir-regular mt-1 block text-sm font-normal leading-5 text-[#717680]">
                      {opt.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={CARD} aria-labelledby={`${groupId}-details-heading`}>
          <h2
            id={`${groupId}-details-heading`}
            className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]"
          >
            Amendment Details
          </h2>
          <div className="mt-5">{renderDetailFields()}</div>
        </section>

        <section className={CARD} aria-labelledby={`${groupId}-summary-heading`}>
          <h2
            id={`${groupId}-summary-heading`}
            className="font-avenir-regular text-lg font-semibold leading-7 text-[#0b1d37]"
          >
            Amendment Summary
          </h2>
          {changeKind === 'change_dates' ? (
            <>
              <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">
                    {CHANGE_DATES_SUMMARY_STATIC.sameNightsLabel}
                  </span>
                  <span className="font-avenir-regular shrink-0 text-right text-sm font-semibold leading-5 text-[#0b1d37]">
                    {CHANGE_DATES_SUMMARY_STATIC.sameNightsValue}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-solid border-[#e9eaeb]" role="presentation" />

              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-avenir-regular text-base font-semibold leading-6 text-[#079455]">
                    {CHANGE_DATES_SUMMARY_STATIC.noChargeLabel}
                  </span>
                  <span className="font-avenir-regular shrink-0 text-base font-semibold leading-6 text-[#079455]">
                    {CHANGE_DATES_SUMMARY_STATIC.noChargeValue}
                  </span>
                </div>
                <p className="font-avenir-regular text-xs font-normal leading-[18px] text-[#717680] sm:text-sm sm:leading-5">
                  {summary.footerNote}
                </p>
              </div>
            </>
          ) : changeKind === 'update_guests' ? (
            <div className="mt-5 flex flex-col gap-4">
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                {UPDATE_GUESTS_SUMMARY_LEAD}
              </p>
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#717680] sm:text-base sm:leading-6">
                {summary.footerNote}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">Original stay</span>
                  <span className="font-avenir-regular shrink-0 text-right text-sm font-normal leading-5 text-[#717680]">
                    {summary.originalStayLine}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-avenir-regular text-sm font-normal leading-5 text-[#717680]">New stay</span>
                  <span className="font-avenir-regular shrink-0 text-right text-sm font-normal leading-5 text-[#717680]">
                    {summary.newStayLine}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-solid border-[#e9eaeb]" role="presentation" />

              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-avenir-regular text-base font-semibold leading-6 text-[#00BAB5]">
                    {summary.additionalCostLabel}
                  </span>
                  <span className="font-avenir-regular shrink-0 text-base font-semibold leading-6 text-[#00BAB5]">
                    {summary.additionalCostValue}
                  </span>
                </div>
                <p className="font-avenir-regular text-xs font-normal leading-[18px] text-[#717680] sm:text-sm sm:leading-5">
                  {summary.footerNote}
                </p>
              </div>
            </>
          )}
        </section>

        <div className="w-full">
          <BookingHubPrimaryButton
            type="button"
            responsive
            responsiveCompact
            fullWidth
            iconLeading={<Send className="size-5" strokeWidth={ICON_STROKE} aria-hidden />}
          >
            {summary.confirmButtonLabel}
          </BookingHubPrimaryButton>
        </div>
      </div>
    </div>
  );
}
