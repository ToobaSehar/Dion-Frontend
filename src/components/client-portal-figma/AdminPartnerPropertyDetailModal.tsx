'use client';

import type { ReactNode } from 'react';
import { useEffect, useId, useState } from 'react';
import { Check, ChevronRight, Paperclip, X } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import type { AdminPartnerPropertyDetailContent } from '@/components/client-portal-figma/adminPartnerDetailProperties';
import { cn } from '@/lib/utils';

export type AdminPartnerPropertyDetailModalProps = {
  open: boolean;
  onClose: () => void;
  detail: AdminPartnerPropertyDetailContent | null;
};

function picsumSrc(seed: string, w: number, h: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

const sectionEyebrow =
  'font-avenir-regular mb-4 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]';

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-5 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-6';

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="font-avenir-regular mb-1 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]">
        {label}
      </p>
      <div className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{children}</div>
    </div>
  );
}

function yesNoLabel(ok: boolean): string {
  return ok ? 'Yes' : 'No';
}

const tableTh =
  'font-avenir-regular px-4 py-3 text-left text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680] sm:px-5';
const tableTd = 'font-avenir-regular px-4 py-3.5 text-sm leading-5 text-[#0B1D37] sm:px-5';

function StatusToneBadge({ label, tone }: { label: string; tone: 'navy' | 'amber' }) {
  return (
    <span
      className={cn(
        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
        tone === 'navy' ? 'bg-[#0B1D37] text-white' : 'bg-[#E8A23E] text-white',
      )}
    >
      {label}
    </span>
  );
}

/**
 * Partner **View property** modal — photos, specs, pricing/VAT, partner network docs, bookings, offers, internal note (static demo).
 */
export function AdminPartnerPropertyDetailModal({ open, onClose, detail }: AdminPartnerPropertyDetailModalProps) {
  const titleId = useId();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [internalNote, setInternalNote] = useState('');

  const seeds = detail?.imageSeeds ?? [];
  const seedsKey = seeds.join('\u0001');

  useEffect(() => {
    if (open) setPhotoIndex(0);
  }, [open, seedsKey]);

  useEffect(() => {
    if (!open) setInternalNote('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || detail == null || seeds.length === 0) {
    return null;
  }

  const mainSeed = seeds[photoIndex] ?? seeds[0];
  const subtitle = `${detail.partnerName} · ${detail.address} · ${detail.propertyType}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="font-avenir-regular relative flex max-h-[min(92vh,920px)] w-full max-w-[min(100%,820px)] flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_48px_rgba(11,29,55,0.18)]"
      >
        <header className="relative shrink-0 border-b border-solid border-[#e9eaeb] px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-lg p-2 text-[#4B4E53] transition-colors hover:bg-[#F6F6F4] hover:text-[#0B1D37] sm:right-6 sm:top-6"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
          <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pr-12">
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="font-avenir-regular text-xl font-semibold leading-7 text-[#0B1D37] sm:text-2xl sm:leading-8"
              >
                {detail.propertyName}
              </h2>
              <p className="font-avenir-regular mt-2 text-sm leading-5 text-[#717680]">{subtitle}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {detail.reviewApproved ? (
                <span className="font-avenir-regular inline-flex items-center gap-1 rounded-full bg-[#0B1D37] px-3 py-1.5 text-xs font-semibold leading-[18px] text-white">
                  <Check className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                  Approved
                </span>
              ) : null}
              <span
                className={cn(
                  'font-avenir-regular inline-flex rounded-full px-3 py-1.5 text-xs font-semibold leading-[18px]',
                  detail.opsActive ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                )}
              >
                {detail.opsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8">
            <section aria-labelledby={`${titleId}-photos`}>
              <h3 id={`${titleId}-photos`} className={sectionEyebrow}>
                Photos
              </h3>
              <div className="flex gap-3 rounded-xl border border-solid border-[#e9eaeb] bg-white p-3 shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
                <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg bg-[#F6F6F4]">
                  <img
                    src={picsumSrc(mainSeed, 960, 640)}
                    alt=""
                    className="aspect-[4/3] size-full max-h-[320px] object-cover sm:max-h-[380px]"
                  />
                </div>
                <div
                  className="flex w-[72px] shrink-0 flex-col gap-2 overflow-y-auto overscroll-y-contain px-0.5 py-2 [-ms-overflow-style:auto] [scrollbar-width:thin]"
                  style={{ maxHeight: 'min(320px, 40vh)' }}
                  aria-label="Photo thumbnails"
                >
                  {seeds.map((thumbSeed, i) => {
                    const selected = i === photoIndex;
                    return (
                      <button
                        key={`${thumbSeed}-${i}`}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Photo ${i + 1}`}
                        aria-current={selected ? 'true' : undefined}
                        className={cn(
                          'relative shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-1 ring-offset-white transition-shadow',
                          selected ? 'ring-[#0B1D37]' : 'ring-transparent hover:ring-[#e9eaeb]',
                        )}
                      >
                        <img
                          src={picsumSrc(thumbSeed, 160, 160)}
                          alt=""
                          className="size-[68px] object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section aria-labelledby={`${titleId}-details`}>
              <h3 id={`${titleId}-details`} className={sectionEyebrow}>
                Property details
              </h3>
              <div className={cardShell}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailField label="Address">{detail.address}</DetailField>
                  <DetailField label="Property type">{detail.propertyType}</DetailField>
                  <DetailField label="Bedrooms">{detail.bedrooms}</DetailField>
                  <DetailField label="Max guests">{detail.maxGuests}</DetailField>
                  <DetailField label="Parking">{yesNoLabel(detail.parking)}</DetailField>
                  <DetailField label="Wi-Fi">{yesNoLabel(detail.wifi)}</DetailField>
                  <DetailField label="Pet friendly">{yesNoLabel(detail.petFriendly)}</DetailField>
                  <DetailField label="Availability">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        detail.listingAvailable ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                      )}
                    >
                      {detail.listingAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </DetailField>
                </div>
              </div>
            </section>

            <section aria-labelledby={`${titleId}-pricing`}>
              <h3 id={`${titleId}-pricing`} className={sectionEyebrow}>
                Pricing and VAT
              </h3>
              <div className={cardShell}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="min-w-0">
                    <p className="font-avenir-regular mb-1 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]">
                      Nightly rate
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">{detail.nightlyRateLabel}</span>
                      <button
                        type="button"
                        className="font-avenir-regular text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-avenir-regular mb-1 text-[11px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#717680]">
                      VAT status
                    </p>
                    <span
                      className={cn(
                        'font-avenir-regular inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]',
                        detail.vatRegistered ? 'bg-[#00BAB5] text-white' : 'bg-[#E9EAEB] text-[#4B4E53]',
                      )}
                    >
                      {detail.vatRegistered ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <DetailField label="VAT number">{detail.vatNumberDisplay}</DetailField>
                </div>
              </div>
            </section>

            <section aria-labelledby={`${titleId}-network`}>
              <div className={cn(cardShell)}>
                <h3
                  id={`${titleId}-network`}
                  className="font-avenir-regular mb-5 text-base font-semibold leading-6 text-[#0B1D37]"
                >
                  Approved Partner Network
                </h3>
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="font-avenir-regular text-sm text-[#717680]">Status:</span>
                  {detail.reviewApproved ? (
                    <span className="font-avenir-regular inline-flex items-center gap-1 rounded-full bg-[#0B1D37] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
                      <Check className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                      Approved
                    </span>
                  ) : (
                    <span className="font-avenir-regular inline-flex rounded-full bg-[#E9EAEB] px-2.5 py-1 text-xs font-semibold leading-[18px] text-[#4B4E53]">
                      Pending review
                    </span>
                  )}
                </div>
                <div className="divide-y divide-[#e9eaeb]">
                  {detail.partnerNetworkDocs.map((doc, docIdx) => (
                    <div
                      key={`${detail.propertyName}-doc-${docIdx}`}
                      className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="flex min-w-0 gap-3">
                        <Paperclip className="mt-0.5 size-5 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
                        <div className="min-w-0">
                          <p className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">{doc.title}</p>
                          <p className="font-avenir-regular mt-0.5 text-xs leading-4 text-[#717680]">{doc.uploadedLabel}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center justify-start gap-4 sm:justify-end">
                        {doc.verified ? (
                          <span className="font-avenir-regular text-sm font-semibold" style={{ color: 'rgb(22, 163, 74)' }}>Verified</span>
                        ) : (
                          <span className="font-avenir-regular text-sm font-semibold text-[#717680]">Pending</span>
                        )}
                        <button
                          type="button"
                          className="font-avenir-regular inline-flex items-center gap-0.5 text-sm font-semibold text-[#00BAB5] transition-colors hover:text-[#008884]"
                        >
                          Download
                          <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby={`${titleId}-bookings`}>
              <h3 id={`${titleId}-bookings`} className={sectionEyebrow}>
                Booking history
              </h3>
              <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
                <div className="overflow-x-auto">
                  <table className="min-w-[720px] w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#e9eaeb] bg-white">
                        <th className={tableTh}>Booking ref</th>
                        <th className={tableTh}>Client</th>
                        <th className={tableTh}>Check-in</th>
                        <th className={tableTh}>Check-out</th>
                        <th className={tableTh}>Total amount</th>
                        <th className={cn(tableTh, 'w-[1%] whitespace-nowrap')}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.bookingHistoryRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="font-avenir-regular px-5 py-10 text-center text-sm text-[#717680]">
                            No bookings on file for this property.
                          </td>
                        </tr>
                      ) : (
                        detail.bookingHistoryRows.map((r) => (
                          <tr key={r.bookingRef} className="border-b border-[#e9eaeb] last:border-b-0">
                            <td className={cn(tableTd, 'font-semibold')}>{r.bookingRef}</td>
                            <td className={tableTd}>{r.client}</td>
                            <td className={tableTd}>{r.checkIn}</td>
                            <td className={tableTd}>{r.checkOut}</td>
                            <td className={cn(tableTd, 'tabular-nums')}>{r.totalAmount}</td>
                            <td className={tableTd}>
                              <StatusToneBadge label={r.statusLabel} tone={r.statusTone} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section aria-labelledby={`${titleId}-offers`}>
              <h3 id={`${titleId}-offers`} className={sectionEyebrow}>
                Offers submitted
              </h3>
              <div className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]">
                <div className="overflow-x-auto">
                  <table className="min-w-[560px] w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#e9eaeb] bg-white">
                        <th className={tableTh}>Request ref</th>
                        <th className={tableTh}>Date submitted</th>
                        <th className={tableTh}>Price offered</th>
                        <th className={cn(tableTh, 'w-[1%] whitespace-nowrap')}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.offersSubmittedRows.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="font-avenir-regular px-5 py-10 text-center text-sm text-[#717680]">
                            No offers submitted for this property.
                          </td>
                        </tr>
                      ) : (
                        detail.offersSubmittedRows.map((r) => (
                          <tr key={r.requestRef} className="border-b border-[#e9eaeb] last:border-b-0">
                            <td className={cn(tableTd, 'font-semibold')}>{r.requestRef}</td>
                            <td className={tableTd}>{r.dateSubmitted}</td>
                            <td className={tableTd}>{r.priceOffered}</td>
                            <td className={tableTd}>
                              <StatusToneBadge label={r.statusLabel} tone="amber" />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section aria-labelledby={`${titleId}-note`} className="pb-2">
              <h3 id={`${titleId}-note`} className={sectionEyebrow}>
                Internal note
              </h3>
              <div className={cardShell}>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add an internal note..."
                  rows={5}
                  className="font-avenir-regular min-h-[120px] w-full resize-y rounded-lg border border-solid border-[#e9eaeb] bg-white px-3 py-3 text-sm leading-5 text-[#0B1D37] outline-none transition-shadow placeholder:text-[#717680] focus:border-[#00BAB5] focus:ring-2 focus:ring-[#00BAB5]/25"
                  aria-label="Internal note"
                />
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-avenir-regular text-xs leading-4 text-[#717680]">Not visible to clients or partners</p>
                  <BookingHubPrimaryButton type="button" size="sm" className="w-full shrink-0 sm:w-auto">
                    Save note
                  </BookingHubPrimaryButton>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
