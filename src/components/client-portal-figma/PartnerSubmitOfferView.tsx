'use client';

import { Calculator, Calendar, MapPin, PoundSterling, Send, Users } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';

import type { PartnerAreaRequestRow } from '@/components/client-portal-figma/PartnerRequestsInMyAreaView';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BookingHubToggleSwitch } from '@/components/booking-hub-toggle';
import {
  BookingHubMultiSelectField,
  type BookingHubSelectOption,
} from '@/components/booking-hub-select';
import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubTextAreaField } from '@/components/BookingHubTextAreaField';
import { BH_INPUT_FIELD_PREFIX } from '@/components/bookingHubInputFieldTypography';
import { cn } from '@/lib/utils';

const ICON_META_CLASS = 'size-4 shrink-0 text-[#718096]';

const SUBMIT_OFFER_PROPERTY_OPTIONS = [
  { id: 'city-centre-apartment', label: 'City Centre Apartment' },
  { id: 'northern-quarter-studio', label: 'Northern Quarter Studio' },
] as const;

const SUBMIT_OFFER_PROPERTY_SELECT_OPTIONS: BookingHubSelectOption[] = SUBMIT_OFFER_PROPERTY_OPTIONS.map((o) => ({
  value: o.id,
  label: o.label,
}));

type PropertyOfferLineState = {
  nightlyRate: string;
  guests: string;
  vatRegistered: boolean;
  notes: string;
};

const DEFAULT_PROPERTY_OFFER_LINE: PropertyOfferLineState = {
  nightlyRate: '',
  guests: '',
  vatRegistered: true,
  notes: '',
};

function SubmitOfferPropertyVatDisclaimerNotice() {
  return (
    <div
      className="rounded-[12px] border border-[#FEDF89] bg-[#FFFAEB] px-5 py-3 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:px-7 sm:py-3.5"
      role="note"
    >
      <p className="font-avenir-regular max-w-none text-[11px] leading-snug text-[#717680] sm:text-[12px] sm:leading-[1.45]">
        VAT status is pre-populated from your property record. You are responsible for ensuring your VAT position is
        correct. Booking Hub applies the information you provide.
      </p>
    </div>
  );
}

function PropertyOfferDetailCard({
  title,
  line,
  onLineChange,
}: {
  title: string;
  line: PropertyOfferLineState;
  onLineChange: (patch: Partial<PropertyOfferLineState>) => void;
}) {
  const nightlyId = useId();
  const guestsId = useId();
  const notesId = useId();
  const vatRegisteredLabelId = useId();

  return (
    <div className="rounded-[14px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_3px_rgba(10,13,18,0.06)] sm:p-8">
      <h3 className="font-avenir-regular text-[17px] font-semibold leading-snug tracking-tight text-[#0B1D37] sm:text-lg">
        {title}
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <BookingHubInputField
          id={nightlyId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          label="Nightly rate exc. VAT (£)"
          placeholder="e.g. 85"
          value={line.nightlyRate}
          onChange={(e) => onLineChange({ nightlyRate: e.target.value })}
          size="md"
          prefix={<span className={BH_INPUT_FIELD_PREFIX}>£</span>}
        />
        <BookingHubInputField
          id={guestsId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          label="Number of guests for this property"
          placeholder="e.g. 2"
          value={line.guests}
          onChange={(e) => onLineChange({ guests: e.target.value })}
          size="md"
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span id={vatRegisteredLabelId} className="font-avenir-regular text-sm font-medium leading-5 text-[#414651]">
            VAT Registered
          </span>
          <BookingHubToggleSwitch
            responsive
            checked={line.vatRegistered}
            onCheckedChange={(next) => onLineChange({ vatRegistered: next })}
            aria-labelledby={vatRegisteredLabelId}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-avenir-regular text-sm font-medium leading-5 text-[#414651]">VAT Number</span>
          <span className="font-avenir-regular text-sm font-semibold tabular-nums text-[#0B1D37]">
            {line.vatRegistered ? 'GB123456789' : '—'}
          </span>
        </div>
      </div>

      <div className="mt-7">
        <BookingHubTextAreaField
          id={notesId}
          label="Notes (optional)"
          rows={4}
          placeholder="Any additional information for this property..."
          value={line.notes}
          onChange={(e) => onLineChange({ notes: e.target.value })}
          size="md"
          resizeHandle
        />
      </div>
    </div>
  );
}

export type PartnerSubmitOfferViewProps = {
  className?: string;
  row: PartnerAreaRequestRow;
  onBack: () => void;
};

/**
 * Partner portal **Submit Offer** — layout aligned with Figma; static controls until offer API wiring.
 */
export function PartnerSubmitOfferView({ className, row, onBack }: PartnerSubmitOfferViewProps) {
  const propertyFieldId = useId();
  const availabilityToggleLabelId = useId();
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(false);
  const [propertyPickerOpen, setPropertyPickerOpen] = useState(false);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<Set<string>>(() => new Set());
  const [propertyLinesById, setPropertyLinesById] = useState<Record<string, PropertyOfferLineState>>({});

  const selectedPropertyKey = useMemo(
    () => Array.from(selectedPropertyIds).sort().join('|'),
    [selectedPropertyIds],
  );

  useEffect(() => {
    const ids = selectedPropertyKey ? selectedPropertyKey.split('|') : [];
    setPropertyLinesById((prev) => {
      const next: Record<string, PropertyOfferLineState> = {};
      for (const id of ids) {
        next[id] = prev[id] ?? DEFAULT_PROPERTY_OFFER_LINE;
      }
      return next;
    });
  }, [selectedPropertyKey]);

  const selectedPropertiesOrdered = useMemo(
    () => SUBMIT_OFFER_PROPERTY_OPTIONS.filter((o) => selectedPropertyIds.has(o.id)),
    [selectedPropertyIds],
  );

  const toggleProperty = useCallback((id: string) => {
    setSelectedPropertyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const patchPropertyLine = useCallback((id: string, patch: Partial<PropertyOfferLineState>) => {
    setPropertyLinesById((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? DEFAULT_PROPERTY_OFFER_LINE), ...patch },
    }));
  }, []);

  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <header className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="font-avenir-regular inline-flex items-center gap-1 text-sm font-medium text-[#717680] transition-colors hover:text-[#0B1D37]"
        >
          <span aria-hidden>←</span> Back to Requests
        </button>
        <div className="space-y-3">
          <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
            Submit Offer
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-avenir-regular text-sm text-[#717680]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className={ICON_META_CLASS} strokeWidth={2} aria-hidden />
              {row.city}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className={ICON_META_CLASS} strokeWidth={2} aria-hidden />
              {row.guests} guest{row.guests === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className={ICON_META_CLASS} strokeWidth={2} aria-hidden />
              {row.nights} nights
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PoundSterling className={ICON_META_CLASS} strokeWidth={2} aria-hidden />
              {row.budgetPerNightLabel}
            </span>
          </div>
        </div>
      </header>

      {/* Two-column row: wider left stack; right = compact summary card (narrower + shorter than Offer Details). */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,_1.45fr)_minmax(0,_1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section
            className="flex flex-col gap-5 rounded-[12px] border border-[#e9eaeb] bg-white p-5 shadow-[0_1px_0_rgba(10,13,18,0.04)] sm:p-6"
            aria-labelledby="partner-submit-offer-details-heading"
          >
            <h2 id="partner-submit-offer-details-heading" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
              Offer Details
            </h2>

            <BookingHubMultiSelectField
              id={propertyFieldId}
              label="Select Property / Properties"
              options={SUBMIT_OFFER_PROPERTY_SELECT_OPTIONS}
              value={selectedPropertyIds}
              onToggle={toggleProperty}
              placeholder="Choose one or more properties..."
              open={propertyPickerOpen}
              onOpenChange={setPropertyPickerOpen}
              size="md"
            />

            {selectedPropertiesOrdered.length > 0 ? (
              <div className="flex flex-col gap-4">
                {selectedPropertiesOrdered.map((opt) => (
                  <PropertyOfferDetailCard
                    key={opt.id}
                    title={opt.label}
                    line={propertyLinesById[opt.id] ?? DEFAULT_PROPERTY_OFFER_LINE}
                    onLineChange={(patch) => patchPropertyLine(opt.id, patch)}
                  />
                ))}
              </div>
            ) : null}

            <SubmitOfferPropertyVatDisclaimerNotice />

            <div className="flex items-center justify-between gap-4 pt-1">
              <span
                id={availabilityToggleLabelId}
                className="font-avenir-regular text-sm font-medium text-[#0B1D37]"
              >
                Availability confirmed for requested dates
              </span>
              <BookingHubToggleSwitch
                responsive
                checked={availabilityConfirmed}
                onCheckedChange={setAvailabilityConfirmed}
                aria-labelledby={availabilityToggleLabelId}
              />
            </div>
          </section>

          <BookingHubPrimaryButton
            type="button"
            fullWidth
            responsive
            responsiveCompact
            disabled={selectedPropertyIds.size === 0}
            iconLeading={<Send className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
          >
            Submit Offer
          </BookingHubPrimaryButton>
        </div>

        <section
          className="flex w-full max-w-full flex-col gap-3 rounded-[12px] border border-[#e9eaeb] bg-white p-4 shadow-[0_1px_0_rgba(10,13,18,0.04)]"
          aria-labelledby="partner-submit-offer-summary-heading"
        >
          <h2
            id="partner-submit-offer-summary-heading"
            className="flex items-center gap-2 font-avenir-regular text-base font-semibold text-[#0B1D37]"
          >
            <Calculator className="size-[18px] shrink-0 text-[#00BAB5]" strokeWidth={2} aria-hidden />
            Calculated Summary
          </h2>
          <div className="flex flex-col items-center justify-center px-1 py-5 text-center sm:py-6">
            <p className="font-avenir-regular max-w-[19rem] text-xs leading-5 text-[#717680]">
              Select a property and enter your nightly rate to see the breakdown.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
