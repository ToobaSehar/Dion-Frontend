'use client';

import { cn } from '@/lib/utils';

export type AdminPortalPropertyListingTab =
  | 'all'
  | 'available'
  | 'unavailable'
  | 'inactive'
  | 'approved';

export const ADMIN_PORTAL_PROPERTY_LISTING_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalPropertyListingTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'available', label: 'Available' },
  { id: 'unavailable', label: 'Unavailable' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'approved', label: 'Approved' },
];

export type AdminPortalPropertyListingStatusPillsProps = {
  value: AdminPortalPropertyListingTab;
  onChange: (next: AdminPortalPropertyListingTab) => void;
  className?: string;
};

export function AdminPortalPropertyListingStatusPills({
  value,
  onChange,
  className,
}: AdminPortalPropertyListingStatusPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filter properties by listing status">
      {ADMIN_PORTAL_PROPERTY_LISTING_TAB_ITEMS.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'font-avenir-regular rounded-full px-4 py-2 text-sm font-semibold leading-5 transition-colors',
              selected
                ? 'bg-[#0B1D37] text-white shadow-sm'
                : 'border border-solid border-[#e9eaeb] bg-white text-[#0B1D37] hover:bg-[#F6F6F4]',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
