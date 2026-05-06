'use client';

import { Building2, Calendar, ChevronRight, CreditCard, KeyRound, MapPin } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { PartnerDashboardNewRequestsInAreaSection } from '@/components/client-portal-figma/PartnerDashboardNewRequestsInAreaSection';
import {
  PortalDashboardActiveBookingsCard,
  PortalDashboardUpcomingPayoutsCard,
  portalDashboardDummyActiveBookingsItems,
} from '@/components/client-portal-figma/PortalDashboardActiveBookingsCard';

export type PartnerPortalDashboardHomeViewProps = {
  firstName: string;
  onAddProperty: () => void;
  onViewRequest: () => void;
  onAddNow: () => void;
  onCompleteProfile: () => void;
};

const actionIconWrap = 'flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00BAB5]/12 text-[#00BAB5]';

export function PartnerPortalDashboardHomeView({
  firstName,
  onAddProperty,
  onViewRequest,
  onAddNow,
  onCompleteProfile,
}: PartnerPortalDashboardHomeViewProps) {
  const attentionCount = 3;

  return (
    <div className="flex w-full flex-col gap-10 px-6 pb-16 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
            Welcome back, {firstName}
          </h1>
          <p className="font-avenir-regular text-base font-normal leading-6 text-[#4B4E53]">
            You have {attentionCount} items requiring attention.
          </p>
        </div>
        <BookingHubPrimaryButton
          type="button"
          responsive
          responsiveCompact
          className="shrink-0 self-start"
          iconLeading={<Building2 className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />}
          onClick={onAddProperty}
        >
          Add Property
        </BookingHubPrimaryButton>
      </div>

      {/* Action required */}
      <section className="flex flex-col gap-4" aria-labelledby="partner-action-required-heading">
        <h2
          id="partner-action-required-heading"
          className="font-avenir-regular text-[11px] font-medium uppercase tracking-[0.08em] text-[#4B4E53]"
        >
          Action required
        </h2>
        <ul className="flex flex-col gap-3">
          <li>
            <button
              type="button"
              onClick={onViewRequest}
              className="flex w-full items-center gap-4 rounded-[12px] border border-[#e9eaeb] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(10,13,18,0.04)] transition-colors hover:border-[#d6d8db]"
            >
              <span className={actionIconWrap} aria-hidden>
                <MapPin className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 font-avenir-regular text-[15px] font-medium leading-snug text-[#0B1D37]">
                New request in your area – Manchester
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#00BAB5]">
                View Request
                <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={onAddNow}
              className="flex w-full items-center gap-4 rounded-[12px] border border-[#e9eaeb] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(10,13,18,0.04)] transition-colors hover:border-[#d6d8db]"
            >
              <span className={actionIconWrap} aria-hidden>
                <KeyRound className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 font-avenir-regular text-[15px] font-medium leading-snug text-[#0B1D37]">
                Property access details needed for BH-2024-0847
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#00BAB5]">
                Add Now
                <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={onCompleteProfile}
              className="flex w-full items-center gap-4 rounded-[12px] border border-[#e9eaeb] bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(10,13,18,0.04)] transition-colors hover:border-[#d6d8db]"
            >
              <span className={actionIconWrap} aria-hidden>
                <CreditCard className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 font-avenir-regular text-[15px] font-medium leading-snug text-[#0B1D37]">
                Payout account verification incomplete
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#00BAB5]">
                Complete
                <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
              </span>
            </button>
          </li>
        </ul>
      </section>

      {/* Grid — same column / row chrome as client portal dashboard */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
        <PortalDashboardActiveBookingsCard
          headingId="partner-active-bookings-heading"
          title="Active Bookings"
          headerIcon={Calendar}
          items={portalDashboardDummyActiveBookingsItems}
        />

        <PortalDashboardUpcomingPayoutsCard headingId="partner-upcoming-payouts-heading" />
      </div>

      <PartnerDashboardNewRequestsInAreaSection onViewRequest={onViewRequest} />
    </div>
  );
}
