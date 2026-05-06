'use client';

import {
  Calculator,
  Calendar,
  Check,
  ChevronsUpDown,
  MapPin,
  PoundSterling,
  Send,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import type { PartnerAreaRequestRow } from '@/components/client-portal-figma/PartnerRequestsInMyAreaView';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BookingHubToggleSwitch } from '@/components/booking-hub-toggle';
import { cn } from '@/lib/utils';

const ICON_META_CLASS = 'size-4 shrink-0 text-[#718096]';

const SUBMIT_OFFER_PROPERTY_OPTIONS = [
  { id: 'city-centre-apartment', label: 'City Centre Apartment' },
  { id: 'northern-quarter-studio', label: 'Northern Quarter Studio' },
] as const;

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

const INPUT_FIELD_CLASS =
  'font-avenir-regular w-full rounded-[10px] border border-[#e9eaeb] bg-white px-3 py-2.5 text-[15px] text-[#0B1D37] placeholder:text-[#717680] shadow-[inset_0_1px_2px_rgba(10,13,18,0.04)] outline-none transition-colors focus-visible:border-[#0B1D37] focus-visible:ring-2 focus-visible:ring-[#0B1D37]/15';

function SubmitOfferPropertyVatDisclaimerNotice() {
  return (
    <div className="rounded-[14px] bg-[#F8F4EE] px-5 py-3 sm:px-7 sm:py-3.5" role="note">
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

  return (
    <div className="rounded-[14px] border border-[#e9eaeb] bg-white p-6 shadow-[0px_1px_3px_rgba(10,13,18,0.06)] sm:p-8">
      <h3 className="font-avenir-regular text-[17px] font-semibold leading-snug tracking-tight text-[#0B1D37] sm:text-lg">
        {title}
      </h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div className="space-y-2">
          <label htmlFor={nightlyId} className="font-avenir-regular block text-[13px] font-normal leading-snug text-[#717680]">
            Nightly rate exc. VAT (£)
          </label>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-avenir-regular text-[15px] text-[#717680]"
              aria-hidden
            >
              £
            </span>
            <input
              id={nightlyId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="e.g. 85"
              value={line.nightlyRate}
              onChange={(e) => onLineChange({ nightlyRate: e.target.value })}
              className={cn(INPUT_FIELD_CLASS, 'pl-8')}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor={guestsId} className="font-avenir-regular block text-[13px] font-normal leading-snug text-[#717680]">
            Number of guests for this property
          </label>
          <input
            id={guestsId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 2"
            value={line.guests}
            onChange={(e) => onLineChange({ guests: e.target.value })}
            className={INPUT_FIELD_CLASS}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-avenir-regular text-[13px] font-normal leading-snug text-[#717680]">VAT Registered</span>
          <button
            type="button"
            role="switch"
            aria-checked={line.vatRegistered}
            aria-label={`VAT registered: ${line.vatRegistered ? 'Yes' : 'No'}. Toggle`}
            onClick={() => onLineChange({ vatRegistered: !line.vatRegistered })}
            className={cn(
              'font-avenir-regular shrink-0 rounded-full px-[14px] py-1.5 text-xs font-semibold transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1D37]/25 focus-visible:ring-offset-2',
              line.vatRegistered ? 'bg-[#0B1D37] text-white' : 'bg-[#E9EAEB] text-[#535862]',
            )}
          >
            {line.vatRegistered ? 'Yes' : 'No'}
          </button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-avenir-regular text-[13px] font-normal leading-snug text-[#717680]">VAT Number</span>
          <span className="font-avenir-regular text-sm font-semibold tabular-nums text-[#0B1D37]">
            {line.vatRegistered ? 'GB123456789' : '—'}
          </span>
        </div>
      </div>

      <div className="mt-7 space-y-2">
        <label htmlFor={notesId} className="font-avenir-regular block text-[13px] font-normal leading-snug text-[#717680]">
          Notes (optional)
        </label>
        <textarea
          id={notesId}
          rows={4}
          placeholder="Any additional information for this property..."
          value={line.notes}
          onChange={(e) => onLineChange({ notes: e.target.value })}
          className={cn(INPUT_FIELD_CLASS, 'min-h-[120px] resize-y')}
        />
      </div>
    </div>
  );
}

function PropertyMultiSelectField({
  labelId,
  open,
  onOpenChange,
  selectedIds,
  onToggle,
}: {
  labelId: string;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  selectedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange]);

  const summary = useMemo(() => {
    if (selectedIds.size === 0) return null;
    const labels = SUBMIT_OFFER_PROPERTY_OPTIONS.filter((o) => selectedIds.has(o.id)).map((o) => o.label);
    return labels.join(', ');
  }, [selectedIds]);

  const listboxId = `${labelId}-listbox`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'font-avenir-regular flex h-12 w-full items-center justify-between gap-3 rounded-[10px] border border-[#e9eaeb] bg-white px-4 text-left text-[15px] outline-none',
          'shadow-[inset_0_1px_2px_rgba(10,13,18,0.04)] transition-colors',
          'hover:border-[#d5d7da] focus-visible:border-[#0B1D37] focus-visible:ring-2 focus-visible:ring-[#0B1D37]/15',
          summary ? 'text-[#0B1D37]' : 'text-[#717680]',
        )}
      >
        <span className="min-w-0 truncate">{summary ?? 'Choose one or more properties...'}</span>
        <ChevronsUpDown className="size-5 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          aria-multiselectable="true"
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-[10px] border border-[#e9eaeb] bg-white',
            'shadow-[0px_8px_24px_rgba(10,13,18,0.12)]',
          )}
        >
          {SUBMIT_OFFER_PROPERTY_OPTIONS.map((opt, index) => {
            const checked = selectedIds.has(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={checked}
                className={cn(
                  'font-avenir-regular flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-[#535862]',
                  'transition-colors hover:bg-[#F6F6F4] focus-visible:bg-[#F6F6F4] focus-visible:outline-none',
                  index > 0 ? 'border-t border-[#f0f1f3]' : '',
                )}
                onClick={() => onToggle(opt.id)}
              >
                <span
                  className={cn(
                    'flex size-[18px] shrink-0 items-center justify-center rounded-full border-2',
                    checked ? 'border-[#00BAB5] bg-[#00BAB5]' : 'border-[#9BB8B6] bg-white',
                  )}
                  aria-hidden
                >
                  {checked ? <Check className="size-3 text-white" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">{opt.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
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

            <div className="space-y-2">
              <label htmlFor={propertyFieldId} className="font-avenir-regular block text-sm font-medium text-[#717680]">
                Select Property / Properties
              </label>
              <PropertyMultiSelectField
                labelId={propertyFieldId}
                open={propertyPickerOpen}
                onOpenChange={setPropertyPickerOpen}
                selectedIds={selectedPropertyIds}
                onToggle={toggleProperty}
              />
            </div>

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
