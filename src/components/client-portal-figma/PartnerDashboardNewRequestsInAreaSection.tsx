'use client';

import { ChevronRight, MapPin } from 'lucide-react';

import {
  portalDashboardBookingRowCardClass,
  portalDashboardColumnCardClass,
} from '@/components/client-portal-figma/PortalDashboardActiveBookingsCard';
import { cn } from '@/lib/utils';

export type PartnerDashboardNewRequestAreaItem = {
  id: string;
  city: string;
  guests: number;
  weeks: number;
};

export const partnerDashboardDefaultNewRequestsInAreaItems: PartnerDashboardNewRequestAreaItem[] = [
  { id: 'nr-1', city: 'Manchester', guests: 2, weeks: 8 },
  { id: 'nr-2', city: 'Leeds', guests: 4, weeks: 12 },
];

function guestsWeeksLabel(guests: number, weeks: number): string {
  const w = weeks === 1 ? '1 week' : `${weeks} weeks`;
  const g = guests === 1 ? '1 guest' : `${guests} guests`;
  return `${g} · ${w}`;
}

export type PartnerDashboardNewRequestsInAreaSectionProps = {
  className?: string;
  items?: PartnerDashboardNewRequestAreaItem[];
  onViewRequest: () => void;
};

/**
 * Partner dashboard — **New Requests In Your Area** list + footer (static shell until API wiring).
 * Matches portal dashboard card chrome (`portalDashboardColumnCardClass`) and brand teal `#00BAB5`.
 */
export function PartnerDashboardNewRequestsInAreaSection({
  className,
  items = partnerDashboardDefaultNewRequestsInAreaItems,
  onViewRequest,
}: PartnerDashboardNewRequestsInAreaSectionProps) {
  const headingId = 'partner-dashboard-new-requests-in-area-heading';

  return (
    <section className={cn(portalDashboardColumnCardClass, className)} aria-labelledby={headingId}>
      <div className="flex items-center gap-3">
        <MapPin className="size-5 shrink-0 text-[#00BAB5]" strokeWidth={1.75} aria-hidden />
        <h2
          id={headingId}
          className="font-avenir-regular text-lg font-semibold leading-7 text-[#0B1D37] sm:text-xl sm:leading-8"
        >
          New Requests In Your Area
        </h2>
      </div>

      <ul className="flex flex-col gap-3" role="list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={onViewRequest}
              className={cn(
                'flex w-full items-center gap-4 text-left transition-colors hover:border-[#d6d8db]',
                portalDashboardBookingRowCardClass,
              )}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#4B4E53]"
                aria-hidden
              >
                <MapPin className="size-5 shrink-0" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">{item.city}</p>
                <p className="font-avenir-regular mt-0.5 text-sm font-normal leading-5 text-[#717680]">
                  {guestsWeeksLabel(item.guests, item.weeks)}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 font-avenir-regular text-sm font-semibold text-[#00BAB5]">
                View Request
                <ChevronRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-center border-t border-[#e9eaeb] pt-5">
        <button
          type="button"
          onClick={onViewRequest}
          className="font-avenir-regular text-sm font-semibold text-[#00BAB5] transition-colors hover:underline"
        >
          View all requests
        </button>
      </div>
    </section>
  );
}
