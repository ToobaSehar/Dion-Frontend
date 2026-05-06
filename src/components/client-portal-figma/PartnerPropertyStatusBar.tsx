'use client';

import { ClientPortalFigmaStatusTabBar } from '@/components/client-portal-figma/ClientPortalFigmaStatusTabBar';

export type PartnerPropertyFilter = 'all' | 'active' | 'inactive';

export const PARTNER_PROPERTY_STATUS_BAR_ITEMS: Array<{ id: PartnerPropertyFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];

export type PartnerPropertyStatusBarProps = {
  value: PartnerPropertyFilter;
  onChange: (next: PartnerPropertyFilter) => void;
  className?: string;
};

/**
 * Partner **My Properties** filter — same shell as My Offers / My Bookings (`ClientPortalFigmaStatusTabBar`).
 */
export function PartnerPropertyStatusBar({ value, onChange, className }: PartnerPropertyStatusBarProps) {
  return (
    <ClientPortalFigmaStatusTabBar
      tabs={PARTNER_PROPERTY_STATUS_BAR_ITEMS}
      value={value}
      onChange={onChange}
      ariaLabel="Filter properties by listing status"
      className={className}
    />
  );
}
