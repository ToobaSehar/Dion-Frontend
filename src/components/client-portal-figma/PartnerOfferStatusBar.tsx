'use client';

import { ClientPortalFigmaStatusTabBar } from './ClientPortalFigmaStatusTabBar';

export type PartnerOfferStatusFilter = 'all' | 'submitted' | 'accepted' | 'unsuccessful';

export const PARTNER_OFFER_STATUS_BAR_ITEMS: Array<{ id: PartnerOfferStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'unsuccessful', label: 'Unsuccessful' },
];

export type PartnerOfferStatusBarProps = {
  value: PartnerOfferStatusFilter;
  onChange: (next: PartnerOfferStatusFilter) => void;
  className?: string;
};

/**
 * Partner **My Offers** status filter — same shell as client My Bookings / My Requests (`#F6F6F4` base, white active pill).
 */
export function PartnerOfferStatusBar({ value, onChange, className }: PartnerOfferStatusBarProps) {
  return (
    <ClientPortalFigmaStatusTabBar
      tabs={PARTNER_OFFER_STATUS_BAR_ITEMS}
      value={value}
      onChange={onChange}
      ariaLabel="Filter offers by status"
      className={className}
    />
  );
}
