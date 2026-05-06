'use client';

import { cn } from '@/lib/utils';

export type AdminPortalPartnerTypeTab =
  | 'all'
  | 'management-company'
  | 'host-operator'
  | 'landlord-investor'
  | 'other';

export const ADMIN_PORTAL_PARTNER_TYPE_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalPartnerTypeTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'management-company', label: 'Management Company' },
  { id: 'host-operator', label: 'Host / Operator' },
  { id: 'landlord-investor', label: 'Landlord / Investor' },
  { id: 'other', label: 'Other' },
];

export type AdminPortalPartnerTypePillsProps = {
  value: AdminPortalPartnerTypeTab;
  onChange: (next: AdminPortalPartnerTypeTab) => void;
  className?: string;
  /** Default `end` (partners toolbar); use `start` under full-width search (e.g. admin Properties). */
  justify?: 'start' | 'end';
  /** Override when reused outside the Partners screen (e.g. property partner category). */
  ariaLabel?: string;
};

export function AdminPortalPartnerTypePills({
  value,
  onChange,
  className,
  justify = 'end',
  ariaLabel = 'Filter partners by type',
}: AdminPortalPartnerTypePillsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        justify === 'end' ? 'justify-end' : 'justify-start',
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {ADMIN_PORTAL_PARTNER_TYPE_TAB_ITEMS.map((tab) => {
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
