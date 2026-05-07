'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Calculator, Calendar, FileText, MapPin, Users } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import type {
  PartnerAcceptedOfferDetailContent,
  PartnerOfferDetailUnion,
  PartnerSinglePropertyOfferShared,
  PartnerSubmittedOfferDetailContent,
  PartnerUnsuccessfulOfferDetailContent,
} from '@/components/client-portal-figma/partnerOfferDetailData';
import { partnerBookingDetailHref } from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { cn } from '@/lib/utils';

const CARD =
  'rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0px_1px_1px_rgba(10,13,18,0.05)]';

/** Same chrome as `PartnerMyOffersView` list status pills (`offerStatusPillClass` + row wrapper). */
const OFFER_STATUS_PILL_SHELL =
  'font-avenir-regular inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold leading-[18px]';

export type PartnerOfferDetailViewProps = {
  className?: string;
  detail: PartnerOfferDetailUnion;
  onBack: () => void;
};

function SummaryRow({ label, value, valueClassName }: { label: string; value: ReactNode; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#e9eaeb] py-3 last:border-b-0">
      <span className="font-avenir-regular text-sm leading-5 text-[#717680]">{label}</span>
      <span className={cn('font-avenir-regular text-right text-sm font-medium leading-5 text-[#0B1D37]', valueClassName)}>
        {value}
      </span>
    </div>
  );
}

function PartnerOfferDetailPageHeader({ detail, onBack }: { detail: PartnerOfferDetailUnion; onBack: () => void }) {
  const referenceId = detail.kind === 'accepted' ? detail.referenceId : undefined;

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="font-avenir-regular inline-flex w-fit items-center gap-1 text-sm font-medium text-[#717680] transition-colors hover:text-[#0B1D37]"
      >
        <span aria-hidden>←</span> Back to My Offers
      </button>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 gap-y-2">
          <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
            Offer Details
          </h1>
          <span className={cn(OFFER_STATUS_PILL_SHELL, detail.statusBadgeClass)}>{detail.statusLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#717680]">
          <span className="font-avenir-regular inline-flex items-center gap-2">
            <MapPin className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            {detail.metaLocation}
          </span>
          <span className="font-avenir-regular inline-flex items-center gap-2">
            <Users className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            {detail.metaGuestsLabel}
          </span>
          <span className="font-avenir-regular inline-flex items-center gap-2">
            <Calendar className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            {detail.metaNightsLabel}
          </span>
          <span className="font-avenir-regular text-[#4B4E53]">{detail.metaBudgetLabel}</span>
          {referenceId ? (
            <span className="font-avenir-regular text-[#4B4E53]">{referenceId}</span>
          ) : null}
        </div>
      </header>
    </>
  );
}

function RequestSummaryCard({ r }: { r: PartnerSinglePropertyOfferShared['requestSummary'] }) {
  return (
    <section className={cn(CARD, 'p-5 sm:p-6')}>
      <h2 className="font-avenir-regular mb-4 text-base font-semibold leading-6 text-[#0B1D37]">Request Summary</h2>
      <div className="border-t border-[#e9eaeb] pt-1">
        <SummaryRow label="Location" value={r.location} />
        <SummaryRow label="Check-in" value={r.checkIn} />
        <SummaryRow label="Check-out" value={r.checkOut} />
        <SummaryRow label="Guests" value={r.guests} />
        <SummaryRow label="Submitted" value={r.submittedDate} />
        <div className="flex items-center justify-between gap-4 py-3">
          <span className="font-avenir-regular text-sm leading-5 text-[#717680]">Availability confirmed</span>
          <span
            className={cn(
              OFFER_STATUS_PILL_SHELL,
              r.availabilityConfirmed ? 'bg-[#00BAB5] text-white' : 'bg-[#F6F6F4] text-[#4B4E53]',
            )}
          >
            {r.availabilityConfirmed ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </section>
  );
}

function SinglePropertyOfferDetailBody({
  detail,
}: {
  detail: PartnerSubmittedOfferDetailContent | PartnerUnsuccessfulOfferDetailContent;
}) {
  const isUnsuccessful = detail.kind === 'unsuccessful';
  const p = detail.propertyOffered;
  const r = detail.requestSummary;
  const o = detail.offerSummary;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        <RequestSummaryCard r={r} />

        <section>
          <h2 className="font-avenir-regular mb-3 text-base font-semibold leading-6 text-[#0B1D37]">Property Offered</h2>
          <div className={cn(CARD, 'overflow-hidden')}>
            <div className="flex gap-4 border-b border-[#e9eaeb] p-5 sm:p-6">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#535862]"
                aria-hidden
              >
                <Building2 className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">{p.name}</p>
                    <p className="font-avenir-regular mt-1 text-sm leading-5 text-[#717680]">{p.address}</p>
                    <p className="font-avenir-regular mt-1 text-sm leading-5 text-[#717680]">{p.roomSummary}</p>
                  </div>
                  <span
                    className={cn(
                      OFFER_STATUS_PILL_SHELL,
                      p.vatMode === 'no-vat' ? 'bg-[#F6F6F4] text-[#4B4E53]' : 'bg-[#00BAB5] text-white',
                    )}
                  >
                    {p.vatMode === 'no-vat' ? 'No VAT' : 'VAT'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-0 px-5 py-4 sm:px-6">
              <SummaryRow label="Nightly rate" value={p.nightlyRate} />
              <SummaryRow label={`Subtotal (${p.nights} nights)`} value={p.subtotal} />
              <SummaryRow label="Property total" value={p.propertyTotal} valueClassName="font-semibold" />
            </div>
            {!isUnsuccessful ? (
              <div className="flex items-start gap-2 border-t border-[#e9eaeb] px-5 py-4 sm:px-6">
                <FileText className="mt-0.5 size-4 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
                <p className="font-avenir-regular text-sm leading-5 text-[#4B4E53]">{p.partnerNote}</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <aside className={cn(CARD, 'p-5 sm:p-6')}>
        <div className="mb-4 flex items-center gap-2">
          {isUnsuccessful ? (
            <FileText className="size-5 shrink-0 text-[#00BAB5]" strokeWidth={2} aria-hidden />
          ) : (
            <Calculator className="size-5 shrink-0 text-[#535862]" strokeWidth={2} aria-hidden />
          )}
          <h2 className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">Offer Summary</h2>
        </div>
        <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{o.propertyName}</p>
        <div className="mt-3 flex items-baseline justify-between gap-3 border-b border-[#e9eaeb] pb-3">
          <span className="font-avenir-regular text-sm text-[#717680]">
            {o.nights} nights × {o.nightlyRate}
          </span>
          <span className="font-avenir-regular tabular-nums text-sm font-medium text-[#0B1D37]">{o.lineTotal}</span>
        </div>
        <p className="font-avenir-regular mt-2 text-xs leading-4 text-[#717680]">{o.noVatNote}</p>
        <div className="mt-4 space-y-2 border-t border-[#e9eaeb] pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-avenir-regular text-[#717680]">Accommodation total</span>
            <span className="font-avenir-regular tabular-nums font-medium text-[#0B1D37]">{o.accommodationTotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-avenir-regular text-[#717680]">VAT total</span>
            <span className="font-avenir-regular tabular-nums font-medium text-[#0B1D37]">{o.vatTotal}</span>
          </div>
        </div>
        <div className="mt-5 rounded-[10px] border border-[#B8EEEB] bg-[#E6FAF9] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">Total Offer Value</span>
            <span className="font-avenir-regular tabular-nums text-lg font-semibold text-[#00BAB5]">{o.totalOfferValue}</span>
          </div>
        </div>
        <p className="font-avenir-regular mx-auto mt-4 max-w-[280px] text-center text-xs leading-5 text-[#717680]">
          {detail.commissionFooter}
        </p>
      </aside>
    </div>
  );
}

function AcceptedOfferDetailBody({ detail }: { detail: PartnerAcceptedOfferDetailContent }) {
  const router = useRouter();
  const r = detail.requestSummary;
  const n = detail.properties.length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        <RequestSummaryCard r={r} />

        <section>
          <h2 className="font-avenir-regular mb-3 text-base font-semibold leading-6 text-[#0B1D37]">
            Properties Offered ({n})
          </h2>
          <div className="flex flex-col gap-4">
            {detail.properties.map((p) => (
              <div key={p.id} className={cn(CARD, 'overflow-hidden')}>
                <div className="flex gap-4 border-b border-[#e9eaeb] p-5 sm:p-6">
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#535862]"
                    aria-hidden
                  >
                    <Building2 className="size-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">{p.name}</p>
                        <p className="font-avenir-regular mt-1 text-sm leading-5 text-[#717680]">{p.address}</p>
                        <p className="font-avenir-regular mt-1 text-sm leading-5 text-[#717680]">{p.roomSummary}</p>
                      </div>
                      <span className={cn(OFFER_STATUS_PILL_SHELL, 'bg-[#00BAB5] text-white')}>VAT Registered</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-0 px-5 py-4 sm:px-6">
                  <SummaryRow label="Nightly rate" value={p.nightlyRate} />
                  <SummaryRow label={`Subtotal (${p.nights} nights)`} value={p.subtotal} />
                  <SummaryRow label="VAT (20%)" value={p.vatAmount} />
                  <SummaryRow label="VAT Number" value={p.vatNumber} />
                  <SummaryRow label="Property total" value={p.propertyTotal} valueClassName="font-semibold" />
                </div>
                {p.partnerNote ? (
                  <div className="flex items-start gap-2 border-t border-[#e9eaeb] px-5 py-4 sm:px-6">
                    <FileText className="mt-0.5 size-4 shrink-0 text-[#717680]" strokeWidth={2} aria-hidden />
                    <p className="font-avenir-regular text-sm leading-5 text-[#4B4E53]">{p.partnerNote}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className={cn(CARD, 'flex flex-col p-5 sm:p-6')}>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="size-5 shrink-0 text-[#535862]" strokeWidth={2} aria-hidden />
          <h2 className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">Offer Summary</h2>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {detail.offerSummaryBlocks.map((block, i) => (
            <div
              key={`${block.propertyName}-${i}`}
              className={cn(i > 0 && 'border-t border-[#e9eaeb] pt-4')}
            >
              <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{block.propertyName}</p>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <span className="font-avenir-regular text-sm text-[#717680]">
                  {block.nights} nights × {block.nightlyRate}
                </span>
                <span className="font-avenir-regular tabular-nums text-sm font-medium text-[#0B1D37]">{block.netAmount}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <span className="font-avenir-regular text-sm text-[#717680]">VAT (20%)</span>
                <span className="font-avenir-regular tabular-nums text-sm font-medium text-[#0B1D37]">{block.vatAmount}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-3 border-b border-[#e9eaeb] pb-3">
                <span className="font-avenir-regular text-sm text-[#717680]">Property total</span>
                <span className="font-avenir-regular tabular-nums text-sm font-semibold text-[#0B1D37]">
                  {block.propertyTotal}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-[#e9eaeb] pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-avenir-regular text-[#717680]">Accommodation total</span>
            <span className="font-avenir-regular tabular-nums font-medium text-[#0B1D37]">{detail.accommodationTotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-avenir-regular text-[#717680]">VAT total</span>
            <span className="font-avenir-regular tabular-nums font-medium text-[#0B1D37]">{detail.vatTotal}</span>
          </div>
        </div>

        <div className="mt-5 rounded-[10px] border border-[#B8EEEB] bg-[#E6FAF9] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-avenir-regular text-sm font-semibold text-[#0B1D37]">Total Offer Value</span>
            <span className="font-avenir-regular tabular-nums text-lg font-semibold text-[#00BAB5]">
              {detail.totalOfferValue}
            </span>
          </div>
        </div>

        <p className="font-avenir-regular mx-auto mt-4 max-w-[280px] text-center text-xs leading-5 text-[#717680]">
          {detail.commissionFooter}
        </p>

        <BookingHubPrimaryButton
          type="button"
          fullWidth
          className="mt-6"
          onClick={() => router.push(partnerBookingDetailHref(detail.viewBookingRowId))}
        >
          View Booking
        </BookingHubPrimaryButton>
      </aside>
    </div>
  );
}

/**
 * Partner **Offer details** — submitted (calculator summary), unsuccessful (document summary), or accepted (multi-property).
 */
export function PartnerOfferDetailView({ className, detail, onBack }: PartnerOfferDetailViewProps) {
  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <PartnerOfferDetailPageHeader detail={detail} onBack={onBack} />
      {detail.kind === 'accepted' ? (
        <AcceptedOfferDetailBody detail={detail} />
      ) : (
        <SinglePropertyOfferDetailBody detail={detail} />
      )}
    </div>
  );
}
