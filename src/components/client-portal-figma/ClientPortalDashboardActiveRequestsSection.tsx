'use client';

import { MapPin } from 'lucide-react';
import Link from 'next/link';

import { CLIENT_PORTAL_HUB_MY_REQUESTS_HREF } from '@/components/client-portal-figma/clientPortalFigmaMainView';
import { cn } from '@/lib/utils';

const columnCardClass =
  'flex flex-col gap-4 rounded-xl border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-6';

const rowCardClass =
  'rounded-xl border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] sm:p-5';

export type ClientPortalActiveRequestRow = {
  id: string;
  city: string;
  subtitle: string;
  status: string;
  statusVariant: 'shortlist-ready' | 'submitted';
};

const DEFAULT_ACTIVE_REQUESTS: ClientPortalActiveRequestRow[] = [
  {
    id: '1',
    city: 'Bristol',
    subtitle: '6 guests · 01/04/2026 - 30/06/2026',
    status: 'Shortlist Ready',
    statusVariant: 'shortlist-ready',
  },
  {
    id: '2',
    city: 'Glasgow',
    subtitle: '4 guests · 15/05/2026 - 20/08/2026',
    status: 'Submitted',
    statusVariant: 'submitted',
  },
];

export type ClientPortalDashboardActiveRequestsSectionProps = {
  className?: string;
  items?: ClientPortalActiveRequestRow[];
};

/**
 * **Active Requests** dashboard card — static shell; wire `items` from API when ready.
 */
export function ClientPortalDashboardActiveRequestsSection({
  className,
  items = DEFAULT_ACTIVE_REQUESTS,
}: ClientPortalDashboardActiveRequestsSectionProps) {
  return (
    <section
      className={cn(columnCardClass, className)}
      aria-labelledby="client-portal-active-requests-heading"
    >
      <div className="flex items-center gap-2">
        <MapPin className="size-5 shrink-0 text-[#535862]" strokeWidth={2} aria-hidden />
        <h2 id="client-portal-active-requests-heading" className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">
          Active Requests
        </h2>
      </div>

      <ul className="flex flex-col gap-3" role="list">
        {items.map((row) => (
          <li key={row.id} className={rowCardClass}>
            <div className="flex items-start gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F6F6F4] text-[#0b1d37]"
                aria-hidden
              >
                <MapPin className="size-5" strokeWidth={2} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-avenir-regular text-base font-semibold leading-6 text-[#0b1d37]">{row.city}</p>
                  <p className="font-avenir-regular mt-1 text-sm font-normal leading-5 text-[#717680]">{row.subtitle}</p>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 self-start rounded-full px-2.5 py-1 font-avenir-regular text-xs font-semibold leading-[18px] text-white sm:self-center',
                    row.statusVariant === 'shortlist-ready' ? 'bg-[#0b1d37]' : 'bg-[#e8a23e]',
                  )}
                >
                  {row.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center border-t border-[#e9eaeb] py-5">
        <Link
          href={CLIENT_PORTAL_HUB_MY_REQUESTS_HREF}
          className="font-avenir-regular text-sm font-semibold text-[#00BAB5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2"
        >
          View all requests
        </Link>
      </div>
    </section>
  );
}
