'use client';

import { useCallback, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Info, MapPin, PoundSterling, Users, X } from 'lucide-react';

import { BookingHubSecondaryDeleteButton } from '@/components/booking-hub-button';
import {
  PortalClientInfoCard,
  PortalClientInfoRow,
  PortalClientStatusBanner,
} from '@/components/client-portal-figma/PortalClientDashboardInfoPrimitives';
import {
  CLIENT_PORTAL_SHORTLIST_TOTAL_EXC_VAT_GBP_BY_ID,
  ClientPortalRequestDetailShortlistSection,
} from '@/components/client-portal-figma/ClientPortalRequestDetailShortlistSection';
import { ClientPortalShortlistConfirmBar } from '@/components/client-portal-figma/ClientPortalShortlistConfirmBar';
import { cn } from '@/lib/utils';

export type ClientPortalRequestDetailPhase =
  | 'shortlist-ready'
  | 'submitted-matching'
  | 'booking-confirmed'
  | 'request-cancelled';

export type ClientPortalRequestDetailContent = {
  locationTitle: string;
  locationDetail: string;
  dateRange: string;
  nightsLabel: string;
  guests: string;
  budgetLine: string;
  contactName: string;
  contactPhone: string;
  specialRequirements: string;
  submittedLabel: string;
  /** Shortlist / submitted matching / booking confirmed shell — default shortlist-ready. */
  phase?: ClientPortalRequestDetailPhase;
  contactNameRowLabel?: string;
  contactPhoneRowLabel?: string;
  specialRequirementsRowLabel?: string;
  submittedRowLabel?: string;
};

export const DEFAULT_CLIENT_PORTAL_REQUEST_DETAIL: ClientPortalRequestDetailContent = {
  locationTitle: 'Bristol',
  locationDetail: 'Bristol (BS1)',
  dateRange: '1 April 2026 – 30 June 2026',
  nightsLabel: '90 nights',
  guests: '6',
  budgetLine: '£90/night · Every 28 days',
  contactName: 'James Davies',
  contactPhone: '07712 345678',
  specialRequirements: 'Ground floor access required. Parking for 2 vehicles.',
  submittedLabel: '15 February 2026',
};

/** Glasgow submitted request — `/client/requests/2` reference shell (matching + Request Management). */
export const GLASGOW_SUBMITTED_CLIENT_PORTAL_REQUEST_DETAIL: ClientPortalRequestDetailContent = {
  phase: 'submitted-matching',
  locationTitle: 'Glasgow',
  locationDetail: 'Glasgow (G1)',
  dateRange: '15 April 2026 – 15 July 2026',
  nightsLabel: '91 nights',
  guests: '10',
  budgetLine: '£75/night · Every 28 days',
  contactName: 'James Davies',
  contactPhone: '07712 345678',
  specialRequirements: 'Close to city centre. Wi-Fi essential.',
  submittedLabel: '28 February 2026',
  contactNameRowLabel: 'Contact Name',
  contactPhoneRowLabel: 'Contact Phone',
  specialRequirementsRowLabel: 'Special Requirements',
  submittedRowLabel: 'Submitted',
};

/** Manchester confirmed request — `/client/requests/3` reference shell (no shortlist / no cancel). */
export const MANCHESTER_CONFIRMED_CLIENT_PORTAL_REQUEST_DETAIL: ClientPortalRequestDetailContent = {
  phase: 'booking-confirmed',
  locationTitle: 'Manchester',
  locationDetail: 'Manchester (M1)',
  dateRange: '15 January 2026 – 15 April 2026',
  nightsLabel: '90 nights',
  guests: '5',
  budgetLine: '£85/night · Every 28 days',
  contactName: 'James Davies',
  contactPhone: '07712 345678',
  specialRequirements: 'None specified',
  submittedLabel: '20 December 2025',
  contactNameRowLabel: 'Contact Name',
  contactPhoneRowLabel: 'Contact Phone',
  specialRequirementsRowLabel: 'Special Requirements',
  submittedRowLabel: 'Submitted',
};

/** Liverpool cancelled request — `/client/requests/4` reference shell. */
export const LIVERPOOL_CANCELLED_CLIENT_PORTAL_REQUEST_DETAIL: ClientPortalRequestDetailContent = {
  phase: 'request-cancelled',
  locationTitle: 'Liverpool',
  locationDetail: 'Liverpool (L1)',
  dateRange: '1 March 2026 – 1 April 2026',
  nightsLabel: '31 nights',
  guests: '2',
  budgetLine: '£70/night · Weekly',
  contactName: 'James Davies',
  contactPhone: '07712 345678',
  specialRequirements: 'None specified',
  submittedLabel: '1 February 2026',
  contactNameRowLabel: 'Contact Name',
  contactPhoneRowLabel: 'Contact Phone',
  specialRequirementsRowLabel: 'Special Requirements',
  submittedRowLabel: 'Submitted',
};

const SUPPORT_PHONE_DISPLAY = '0330 043 7522';
const SUPPORT_PHONE_TEL = '03300437522';

export type ClientPortalRequestDetailViewProps = {
  className?: string;
  onBack: () => void;
  detail?: ClientPortalRequestDetailContent;
};

const ICON_STROKE = 2;
const ICON_BOX = 'size-5 shrink-0';

const REQUEST_DETAIL_CARD_SHELL =
  'flex flex-col gap-0 rounded-xl border border-solid border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-6';

const REQUEST_DETAIL_SECTION_TITLE_CLASS =
  'font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-lg sm:leading-7';

/**
 * Client **Request detail** — request summary + contact card, shortlist banner; matches Figma client shell reference.
 */
export function ClientPortalRequestDetailView({
  className,
  onBack,
  detail: detailProp,
}: ClientPortalRequestDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routeRequestId =
    /^\/client\/requests\/([^/]+)(?:\/|$)/.exec(pathname ?? '')?.[1] ?? '1';

  const d = useMemo(() => {
    if (detailProp) return detailProp;
    if (routeRequestId === '2') return GLASGOW_SUBMITTED_CLIENT_PORTAL_REQUEST_DETAIL;
    if (routeRequestId === '3') return MANCHESTER_CONFIRMED_CLIENT_PORTAL_REQUEST_DETAIL;
    if (routeRequestId === '4') return LIVERPOOL_CANCELLED_CLIENT_PORTAL_REQUEST_DETAIL;
    return DEFAULT_CLIENT_PORTAL_REQUEST_DETAIL;
  }, [detailProp, routeRequestId]);

  const phase = d.phase ?? 'shortlist-ready';
  const isShortlistPhase = phase === 'shortlist-ready';
  const isSubmittedMatchingPhase = phase === 'submitted-matching';
  const isBookingConfirmedPhase = phase === 'booking-confirmed';
  const isRequestCancelledPhase = phase === 'request-cancelled';

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const toggleShortlist = useCallback((id: string, next: boolean) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (next) n.add(id);
      else n.delete(id);
      return n;
    });
  }, []);

  const hasShortlistSelection = selectedIds.size > 0;

  const shortlistTotalExcVatGbp = useMemo(() => {
    return Array.from(selectedIds).reduce((sum, id) => sum + (CLIENT_PORTAL_SHORTLIST_TOTAL_EXC_VAT_GBP_BY_ID[id] ?? 0), 0);
  }, [selectedIds]);

  const shortlistTotalFormatted = useMemo(
    () => `£${shortlistTotalExcVatGbp.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
    [shortlistTotalExcVatGbp],
  );

  const goToRequestAmendment = useCallback(() => {
    router.push(`/client/requests/${encodeURIComponent(routeRequestId)}/amendment`);
  }, [router, routeRequestId]);

  return (
    <div className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}>
      <div
        className={cn(
          'flex w-full flex-col gap-6 px-4 sm:px-8 lg:gap-8',
          isShortlistPhase && hasShortlistSelection ? 'pb-[104px] sm:pb-[112px]' : 'pb-20 sm:pb-24',
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            className={cn(
              'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-transparent text-[#717680] outline-none',
              'focus-visible:ring-2 focus-visible:ring-[#00cbc5] focus-visible:ring-offset-2',
            )}
          >
            <ArrowLeft className="size-5" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
          <div className="min-w-0">
            <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0b1d37] sm:text-[30px] sm:leading-[38px]">
              {d.locationTitle}
            </h1>
            <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">Request Detail</p>
          </div>
        </div>
        {isShortlistPhase ? (
          <p className="font-avenir-regular max-w-md shrink-0 text-sm font-normal leading-5 text-[#4B4E53] sm:text-right">
            Need help choosing? Call us —{' '}
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="font-semibold text-[#0b1d37] underline decoration-[#e9eaeb] underline-offset-2 hover:text-[#00BAB5]">
              {SUPPORT_PHONE_DISPLAY}
            </a>
          </p>
        ) : null}
      </div>

      {isShortlistPhase ? (
        <PortalClientStatusBanner
          badgeLabel="Shortlist Ready"
          message="Your shortlist is ready — view options"
          icon={<Info className={cn(ICON_BOX, 'shrink-0 text-[#0b1d37]')} strokeWidth={ICON_STROKE} aria-hidden />}
        />
      ) : isBookingConfirmedPhase ? (
        <div
          role="status"
          className="flex flex-col gap-0 rounded-xl border border-solid border-[#c6ebe9] bg-[#e8faf8] px-4 py-3.5 sm:px-5 sm:py-4"
        >
          <div className="flex items-start gap-2.5 sm:gap-3">
            <Info className={cn(ICON_BOX, 'mt-0.5 shrink-0 text-[#0b1d37]')} strokeWidth={ICON_STROKE} aria-hidden />
            <p className="font-avenir-regular text-sm font-normal leading-5 text-[#414651] sm:text-base sm:leading-6">
              Booking confirmed — view in My Bookings
            </p>
          </div>
          <span className="font-avenir-regular mt-3 inline-flex w-fit items-center rounded-full bg-[#00BAB5] px-2.5 py-1 text-xs font-semibold leading-[18px] text-white">
            Confirmed
          </span>
        </div>
      ) : isRequestCancelledPhase ? (
        <div
          role="status"
          className="flex items-start gap-4 rounded-xl border border-solid border-[#FECDCA] bg-[#FEF3F2] px-4 py-4 sm:gap-4 sm:px-5 sm:py-5"
        >
          <Info className={cn(ICON_BOX, 'mt-0.5 shrink-0 text-[#0b1d37]')} strokeWidth={ICON_STROKE} aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-[17px] sm:leading-7">
              This request has been cancelled
            </p>
            <span className="font-avenir-regular inline-flex w-fit items-center rounded-full bg-[#F6F6F4] px-3 py-1 text-xs font-semibold leading-[18px] text-[#F04438]">
              Cancelled
            </span>
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="flex items-start gap-4 rounded-xl border border-solid border-[#e2e8f0] bg-[#f8fafc] px-4 py-4 sm:gap-4 sm:px-5 sm:py-5"
        >
          <Info className={cn(ICON_BOX, 'mt-0.5 shrink-0 text-[#0b1d37]')} strokeWidth={ICON_STROKE} aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37] sm:text-[17px] sm:leading-7">
              Matching you with suitable properties
            </p>
            <span className="font-avenir-regular inline-flex w-fit items-center rounded-full bg-[#f59e0b] px-3 py-1 text-xs font-semibold leading-[18px] text-white">
              Submitted
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <PortalClientInfoCard title="Request Information" titleId="client-request-info-heading">
          <PortalClientInfoRow
            icon={<MapPin className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
            label="Location"
            value={d.locationDetail}
          />
          <PortalClientInfoRow
            icon={<Calendar className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
            label="Dates"
            value={d.dateRange}
            subtext={d.nightsLabel}
          />
          <PortalClientInfoRow
            icon={<Users className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
            label="Guests"
            value={d.guests}
          />
          <PortalClientInfoRow
            icon={<PoundSterling className={ICON_BOX} strokeWidth={ICON_STROKE} aria-hidden />}
            label="Budget & Payment"
            value={d.budgetLine}
          />
        </PortalClientInfoCard>

        <PortalClientInfoCard title="Contact & Requirements" titleId="client-request-contact-heading">
          <PortalClientInfoRow label={d.contactNameRowLabel ?? 'Contact name'} value={d.contactName} />
          <PortalClientInfoRow label={d.contactPhoneRowLabel ?? 'Contact phone'} value={d.contactPhone} />
          <PortalClientInfoRow
            label={d.specialRequirementsRowLabel ?? 'Special requirements'}
            value={d.specialRequirements}
          />
          <PortalClientInfoRow label={d.submittedRowLabel ?? 'Submitted'} value={d.submittedLabel} />
        </PortalClientInfoCard>
      </div>

        {isShortlistPhase ? (
          <ClientPortalRequestDetailShortlistSection
            className="mt-2"
            selectedIds={selectedIds}
            onToggle={toggleShortlist}
          />
        ) : isSubmittedMatchingPhase ? (
          <section className={REQUEST_DETAIL_CARD_SHELL} aria-labelledby="client-request-management-heading">
            <h2 id="client-request-management-heading" className={REQUEST_DETAIL_SECTION_TITLE_CLASS}>
              Request Management
            </h2>
            <div className="mt-4 rounded-xl border border-solid border-[#e9eaeb] bg-white px-4 py-4 sm:px-5 sm:py-5">
              <BookingHubSecondaryDeleteButton
                type="button"
                fullWidth
                responsive
                responsiveCompact
                iconLeading={<X className="size-5" strokeWidth={ICON_STROKE} aria-hidden />}
                className="justify-start"
              >
                Cancel Request
              </BookingHubSecondaryDeleteButton>
            </div>
          </section>
        ) : null}
      </div>

      {isShortlistPhase && hasShortlistSelection ? (
        <ClientPortalShortlistConfirmBar
          selectedCount={selectedIds.size}
          totalAmountFormatted={shortlistTotalFormatted}
          onConfirm={goToRequestAmendment}
        />
      ) : null}
    </div>
  );
}
