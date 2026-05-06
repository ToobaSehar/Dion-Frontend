'use client';

import { ClientPortalFigmaStatusTabBar } from '@/components/client-portal-figma/ClientPortalFigmaStatusTabBar';

export type AdminPortalAlertsFilterTab = 'all' | 'critical' | 'payments' | 'payouts' | 'bookings';

/** Tab ids + labels for admin Alerts — same control as client/partner status bars (`ClientPortalFigmaStatusTabBar`). */
export const ADMIN_PORTAL_ALERTS_STATUS_TABS: ReadonlyArray<{ id: AdminPortalAlertsFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'payments', label: 'Payments' },
  { id: 'payouts', label: 'Payouts' },
  { id: 'bookings', label: 'Bookings' },
];

export type AdminPortalAlertsStatusBarProps = {
  value: AdminPortalAlertsFilterTab;
  onChange: (next: AdminPortalAlertsFilterTab) => void;
  className?: string;
};

/**
 * Admin **Alerts** category filter — wraps `ClientPortalFigmaStatusTabBar` (partner My Bookings / My Properties pattern).
 */
export function AdminPortalAlertsStatusBar({ value, onChange, className }: AdminPortalAlertsStatusBarProps) {
  return (
    <ClientPortalFigmaStatusTabBar
      tabs={ADMIN_PORTAL_ALERTS_STATUS_TABS}
      value={value}
      onChange={onChange}
      ariaLabel="Filter alerts by category"
      className={className}
    />
  );
}
