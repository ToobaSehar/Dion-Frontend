'use client';

import { Calendar, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { cn } from '@/lib/utils';

/** Client dashboard pill palette (`ClientPortalMyRequestsView`, `ClientPortalDashboardActiveRequestsSection`, `ClientPortalPaymentSchedulePanel`). */
const PARTNER_AREA_PILL_NAVY = 'bg-[#0b1d37] text-white';
const PARTNER_AREA_PILL_AMBER = 'bg-[#E8A23E] text-white';
const PARTNER_AREA_PILL_RED = 'bg-[#F04438] text-white';

export type PartnerAreaRequestRow = {
  id: string;
  city: string;
  distanceMiles: number;
  dateRangeLabel: string;
  guests: number;
  nights: number;
  budgetPerNightLabel: string;
  daysLeft: number;
};

const DEFAULT_AREA_REQUESTS: PartnerAreaRequestRow[] = [
  {
    id: '1',
    city: 'Manchester',
    distanceMiles: 2.3,
    dateRangeLabel: '15 Mar - 10 May 2024',
    guests: 2,
    nights: 56,
    budgetPerNightLabel: '£85/night budget',
    daysLeft: 5,
  },
  {
    id: '2',
    city: 'Birmingham',
    distanceMiles: 5.1,
    dateRangeLabel: '1 Apr - 30 Jun 2024',
    guests: 4,
    nights: 91,
    budgetPerNightLabel: '£92/night budget',
    daysLeft: 3,
  },
  {
    id: '3',
    city: 'London',
    distanceMiles: 12.8,
    dateRangeLabel: '10 Apr - 10 Jul 2024',
    guests: 3,
    nights: 92,
    budgetPerNightLabel: '£120/night budget',
    daysLeft: 2,
  },
  {
    id: '4',
    city: 'Leeds',
    distanceMiles: 8.4,
    dateRangeLabel: '20 May - 20 Aug 2024',
    guests: 2,
    nights: 93,
    budgetPerNightLabel: '£78/night budget',
    daysLeft: 7,
  },
];

function daysLeftPillClass(daysLeft: number): string {
  if (daysLeft <= 2) return PARTNER_AREA_PILL_RED;
  if (daysLeft === 3) return PARTNER_AREA_PILL_AMBER;
  return PARTNER_AREA_PILL_NAVY;
}

function daysLeftLabel(daysLeft: number): string {
  return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
}

export function getPartnerAreaRequestById(
  id: string,
  items: PartnerAreaRequestRow[] = DEFAULT_AREA_REQUESTS,
): PartnerAreaRequestRow | undefined {
  return items.find((r) => r.id === id);
}

export type PartnerRequestsInMyAreaViewProps = {
  className?: string;
  items?: PartnerAreaRequestRow[];
};

/**
 * Partner portal **Requests In My Area** — list shell aligned with Figma; static rows until API wiring.
 * Urgency pills reuse client dashboard amber (`#E8A23E`) and red accent (`#F04438`).
 */
export function PartnerRequestsInMyAreaView({
  className,
  items = DEFAULT_AREA_REQUESTS,
}: PartnerRequestsInMyAreaViewProps) {
  const router = useRouter();

  return (
    <div className={cn('flex w-full flex-col gap-6 px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <header className="space-y-1">
        <h1 className="font-avenir-regular text-[28px] font-semibold leading-9 tracking-tight text-[#0B1D37] sm:text-[32px]">
          Requests In My Area
        </h1>
        <p className="font-avenir-regular max-w-2xl text-base font-normal leading-6 text-[#717680]">
          Booking requests matched to your properties. Submit an offer to compete.
        </p>
      </header>

      <ul className="flex flex-col gap-3" role="list" aria-label="Booking requests in your area">
        {items.map((row) => (
          <li key={row.id}>
            <article
              className={cn(
                'flex flex-col gap-4 rounded-[12px] border border-[#e9eaeb] bg-white p-4 shadow-[0_1px_0_rgba(10,13,18,0.04)] transition-shadow sm:flex-row sm:items-center sm:gap-5 sm:p-5',
                'hover:shadow-[0px_4px_12px_rgba(10,13,18,0.08)]',
              )}
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F6F4] text-[#535862]"
                aria-hidden
              >
                <MapPin className="size-5" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-avenir-regular text-[15px] font-semibold leading-snug text-[#0B1D37] sm:text-base">
                  <span>{row.city}</span>
                  <span className="font-normal text-[#717680]">
                    {' '}
                    · {row.distanceMiles.toFixed(1)} miles from your property
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-avenir-regular text-sm text-[#717680]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 shrink-0 text-[#718096]" strokeWidth={2} aria-hidden />
                    {row.dateRangeLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4 shrink-0 text-[#718096]" strokeWidth={2} aria-hidden />
                    {row.guests} guest{row.guests === 1 ? '' : 's'}
                  </span>
                  <span>{row.nights} nights</span>
                  <span className="text-[#535862]">{row.budgetPerNightLabel}</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-row flex-nowrap items-center justify-end gap-2 sm:gap-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-avenir-regular text-xs font-semibold leading-[18px]',
                    daysLeftPillClass(row.daysLeft),
                  )}
                >
                  <Clock className="size-3.5 shrink-0 opacity-95" strokeWidth={2} aria-hidden />
                  {daysLeftLabel(row.daysLeft)}
                </span>
                <BookingHubPrimaryButton
                  type="button"
                  responsive
                  responsiveCompact
                  onClick={() => router.push(`/partner/dashboard/submit-offer/${row.id}`)}
                  iconTrailing={<ChevronRight className="size-5" strokeWidth={2} aria-hidden />}
                >
                  Submit Offer
                </BookingHubPrimaryButton>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
