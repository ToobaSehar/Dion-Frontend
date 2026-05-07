'use client';

import { cn } from '@/lib/utils';

export type AdminPortalInvoicesFilterTab = 'all' | 'vat' | 'commission' | 'credit';

/** Filter tabs — align chrome with Bookings / Payments admin pills; labels match INV-BH / COMM-BH / CN-BH prefixes. */
export const ADMIN_PORTAL_INVOICES_TAB_ITEMS: ReadonlyArray<{ id: AdminPortalInvoicesFilterTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'vat', label: 'VAT (INV-BH)' },
  { id: 'commission', label: 'Commission (COMM-BH)' },
  { id: 'credit', label: 'Credit Notes (CN-BH)' },
];

export type AdminPortalInvoicesStatusPillsProps = {
  value: AdminPortalInvoicesFilterTab;
  onChange: (next: AdminPortalInvoicesFilterTab) => void;
  className?: string;
};

export function AdminPortalInvoicesStatusPills({ value, onChange, className }: AdminPortalInvoicesStatusPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filter invoices by type">
      {ADMIN_PORTAL_INVOICES_TAB_ITEMS.map((tab) => {
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
