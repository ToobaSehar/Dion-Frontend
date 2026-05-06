'use client';

import { useMemo, useState } from 'react';

import { AdminPortalAlertRow, type AdminPortalAlertPriority } from '@/components/client-portal-figma/AdminPortalAlertRow';
import {
  AdminPortalAlertsStatusBar,
  type AdminPortalAlertsFilterTab,
} from '@/components/client-portal-figma/AdminPortalAlertsStatusBar';
import { cn } from '@/lib/utils';

export type { AdminPortalAlertsFilterTab } from '@/components/client-portal-figma/AdminPortalAlertsStatusBar';

export type AdminPortalAlertItem = {
  id: string;
  priority: AdminPortalAlertPriority;
  /** Which filter tabs include this row (`all` is implicit). */
  tabs: Exclude<AdminPortalAlertsFilterTab, 'all'>[];
  title: string;
  subtitle: string;
  timeLabel: string;
  primaryActionLabel: string;
};

const DEFAULT_ALERTS: AdminPortalAlertItem[] = [
  {
    id: 'check-in',
    priority: 'critical',
    tabs: ['bookings'],
    title: 'Check-in instructions missing',
    subtitle: 'BK-2024-0887 · Canal View Suites',
    timeLabel: '6 hours ago',
    primaryActionLabel: 'Chase Partner',
  },
  {
    id: 'payment-failed',
    priority: 'critical',
    tabs: ['payments'],
    title: 'Payment failed',
    subtitle: 'BK-2024-0886 · Victoria Apartments',
    timeLabel: '1 day ago',
    primaryActionLabel: 'Investigate',
  },
  {
    id: 'bank-unreconciled',
    priority: 'warning',
    tabs: ['payments'],
    title: 'Bank transfer unreconciled',
    subtitle: 'BK-2024-0884 · Broadgate House',
    timeLabel: '1 day ago',
    primaryActionLabel: 'Confirm receipt',
  },
  {
    id: 'partner-cancel',
    priority: 'critical',
    tabs: ['bookings'],
    title: 'Partner cancellation',
    subtitle: 'BK-2024-0883 · Kings Cross Lofts',
    timeLabel: '1 day ago',
    primaryActionLabel: 'View booking',
  },
  {
    id: 'payment-overdue',
    priority: 'warning',
    tabs: ['payments'],
    title: 'Payment overdue',
    subtitle: 'BK-2024-0882 · Station House',
    timeLabel: '2 days ago',
    primaryActionLabel: 'View invoice',
  },
  {
    id: 'payout-failed',
    priority: 'critical',
    tabs: ['payouts'],
    title: 'Payout failed',
    subtitle: 'BK-2024-0881 · Meridian Quarters',
    timeLabel: '2 days ago',
    primaryActionLabel: 'View payout',
  },
  {
    id: 'check-in-2',
    priority: 'critical',
    tabs: ['bookings'],
    title: 'Check-in instructions missing',
    subtitle: 'BK-2024-0879 · Riverside Studios',
    timeLabel: '3 days ago',
    primaryActionLabel: 'Chase Partner',
  },
  {
    id: 'payment-failed-2',
    priority: 'critical',
    tabs: ['payments'],
    title: 'Payment failed',
    subtitle: 'BK-2024-0878 · Old Street Lofts',
    timeLabel: '4 days ago',
    primaryActionLabel: 'Investigate',
  },
  {
    id: 'payout-failed-2',
    priority: 'critical',
    tabs: ['payouts'],
    title: 'Payout failed',
    subtitle: 'BK-2024-0875 · Docklands View',
    timeLabel: '5 days ago',
    primaryActionLabel: 'View payout',
  },
];

function filterAlerts(rows: AdminPortalAlertItem[], tab: AdminPortalAlertsFilterTab): AdminPortalAlertItem[] {
  if (tab === 'all') return rows;
  if (tab === 'critical') return rows.filter((r) => r.priority === 'critical');
  return rows.filter((r) => r.tabs.includes(tab));
}

export type AdminPortalAlertsViewProps = {
  className?: string;
  /** Optional override for static / future API-backed lists. */
  alerts?: AdminPortalAlertItem[];
};

/**
 * Admin **Alerts** surface — tabbed filter row + card list using `AdminPortalAlertRow` and shared priority colours.
 */
export function AdminPortalAlertsView({ className, alerts = DEFAULT_ALERTS }: AdminPortalAlertsViewProps) {
  const [activeTab, setActiveTab] = useState<AdminPortalAlertsFilterTab>('all');

  const visible = useMemo(() => filterAlerts(alerts, activeTab), [alerts, activeTab]);

  return (
    <div className={cn('flex w-full min-w-0 max-w-full flex-col px-6 pb-16 sm:px-8 lg:px-10', className)}>
      <h1 className="font-avenir-regular text-2xl font-semibold leading-8 text-[#0B1D37] sm:text-[28px] sm:leading-9">
        Alerts
      </h1>

      <AdminPortalAlertsStatusBar value={activeTab} onChange={setActiveTab} className="mt-6" />

      <div className="mt-8">
        <div
          className="overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]"
          role="region"
          aria-label="Active alerts"
        >
          <div className="border-b border-[#e9eaeb] px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
            <h2 className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37] sm:text-lg">
              Active ({visible.length})
            </h2>
          </div>
          <ul className="divide-y divide-[#e9eaeb]" role="list">
            {visible.length === 0 ? (
              <li className="font-avenir-regular px-5 py-10 text-center text-sm text-[#717680] sm:px-8 lg:px-10">
                No alerts in this category.
              </li>
            ) : (
              visible.map((row) => (
                <AdminPortalAlertRow
                  key={row.id}
                  priority={row.priority}
                  title={row.title}
                  subtitle={row.subtitle}
                  timeLabel={row.timeLabel}
                  primaryActionLabel={row.primaryActionLabel}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
