'use client';

import { useState, type ReactNode } from 'react';

import { PORTAL_DASHBOARD_SECTION_HEADING_CLASS } from '@/components/client-portal-figma/portalDashboardSectionHeading';
import { cn } from '@/lib/utils';

const INK = '#0B1D37';
const MUTED = '#4B4E53';
const SUB = '#717680';

const PERIODS = ['Last 7 days', 'Last 28 days', 'Last Quarter', 'Last 6 months', 'Last 12 months'] as const;

const cardShell =
  'rounded-xl border border-solid border-[#e9eaeb] bg-white p-5 shadow-[0_1px_2px_rgba(11,29,55,0.06)] sm:p-6';

function MetricCard({
  value,
  valueClassName,
  label,
  subline,
  trend,
  className,
  hideTrendSeparator,
}: {
  value: ReactNode;
  valueClassName?: string;
  label: string;
  subline?: string;
  trend?: string;
  className?: string;
  /** When set, trend row has no top border (used for specific dashboard tiles). */
  hideTrendSeparator?: boolean;
}) {
  return (
    <div className={cn(cardShell, 'flex min-h-0 flex-col items-start text-left', className)}>
      <p
        className={cn(
          'font-avenir-regular text-[28px] font-semibold leading-8 tracking-tight sm:text-[32px] sm:leading-9',
          valueClassName,
        )}
        style={valueClassName ? undefined : { color: INK }}
      >
        {value}
      </p>
      <p className="font-avenir-regular mt-2 text-sm font-medium leading-5" style={{ color: MUTED }}>
        {label}
      </p>
      {subline ? (
        <p className="font-avenir-regular mt-1 text-xs font-normal leading-[18px]" style={{ color: SUB }}>
          {subline}
        </p>
      ) : null}
      {trend ? (
        <div
          className={cn(
            'font-avenir-regular mt-3 w-full text-xs font-normal leading-[18px]',
            hideTrendSeparator ? undefined : 'border-t border-[#e9eaeb] pt-3',
          )}
          style={{ color: SUB }}
        >
          <span aria-hidden>↑</span> {trend}
        </div>
      ) : null}
    </div>
  );
}

export type AdminPortalDashboardBusinessMetricsSectionProps = {
  className?: string;
};

/**
 * Admin dashboard **Business overview** + **Live operations** metric blocks (static reference data).
 */
export function AdminPortalDashboardBusinessMetricsSection({ className }: AdminPortalDashboardBusinessMetricsSectionProps) {
  const [activePeriod, setActivePeriod] = useState<(typeof PERIODS)[number]>('Last 12 months');

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col gap-10', className)}>
      <section aria-labelledby="admin-business-overview-heading">
        <h2 id="admin-business-overview-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Business overview
        </h2>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Time range">
          {PERIODS.map((label) => {
            const active = activePeriod === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActivePeriod(label)}
                className={cn(
                  'font-avenir-regular rounded-full border px-3 py-1.5 text-xs font-semibold leading-[18px] outline-none transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2',
                  active
                    ? 'border-transparent bg-[#00BAB5] text-white shadow-none'
                    : 'border-[#e9eaeb] bg-white text-[#0B1D37] hover:bg-[#F6F6F4]',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard value="180" label="Properties Listed" subline="Total to date" />
          <MetricCard value="24" label="Partners Signed Up" subline="Total to date" />
          <MetricCard value="31" label="Clients Signed Up" trend="15%" />
          <MetricCard value="47" label="Booking Requests" trend="6%" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <MetricCard
            value="£284,000"
            label="Pipeline Value"
            subline="Total value of all active requests"
            trend="9%"
            hideTrendSeparator
          />
          <MetricCard
            value="£156,400"
            label="Confirmed Booking Value"
            subline="Total value of confirmed bookings"
            trend="11%"
            hideTrendSeparator
          />
          <MetricCard
            value="£23,460"
            valueClassName="text-[#00BAB5]"
            label="Commission Earned"
            subline="15% of net accommodation value"
            trend="14%"
            hideTrendSeparator
          />
        </div>
      </section>

      <section aria-labelledby="admin-live-operations-heading">
        <h2 id="admin-live-operations-heading" className={PORTAL_DASHBOARD_SECTION_HEADING_CLASS}>
          Live operations
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MetricCard value="8" label="Active Requests" />
          <MetricCard value="42" label="Active Bookings" />
        </div>
      </section>
    </div>
  );
}
