'use client';

import { cn } from '@/lib/utils';

export type AdminPortalClientsSectorTab =
  | 'all'
  | 'contractors'
  | 'insurance-loss-adjusters'
  | 'councils-housing-providers'
  | 'other';

export const ADMIN_PORTAL_CLIENTS_SECTOR_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalClientsSectorTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'contractors', label: 'Contractors' },
  { id: 'insurance-loss-adjusters', label: 'Insurance / Loss Adjusters' },
  { id: 'councils-housing-providers', label: 'Councils / Housing Providers' },
  { id: 'other', label: 'Other' },
];

export type AdminPortalClientsSectorPillsProps = {
  value: AdminPortalClientsSectorTab;
  onChange: (next: AdminPortalClientsSectorTab) => void;
  className?: string;
};

export function AdminPortalClientsSectorPills({ value, onChange, className }: AdminPortalClientsSectorPillsProps) {
  return (
    <div className={cn('flex flex-nowrap items-center justify-start gap-2', className)} role="tablist" aria-label="Filter clients by sector">
      {ADMIN_PORTAL_CLIENTS_SECTOR_TAB_ITEMS.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'font-avenir-regular max-w-full rounded-full px-3 py-2 text-left text-xs font-semibold leading-snug transition-colors sm:px-4 sm:text-sm sm:leading-5',
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
