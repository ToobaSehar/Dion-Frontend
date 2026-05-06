'use client';

import { ArrowRight } from 'lucide-react';

import { BookingHubPrimaryButton } from '@/components/booking-hub-button/BookingHubPrimaryButton';
import { cn } from '@/lib/utils';

export type ClientPortalShortlistConfirmBarProps = {
  className?: string;
  selectedCount: number;
  /** Pre-formatted total line segment, e.g. "£7,380" */
  totalAmountFormatted: string;
  onConfirm?: () => void;
};

function selectionSummaryLabel(count: number): string {
  if (count === 1) return '1 property selected';
  return `${count} properties selected`;
}

/**
 * Sticky summary + confirm CTA for client shortlist (navy bar, teal primary).
 * Spans the **full viewport** above the sidebar; high z-index so it stacks over the rail.
 */
export function ClientPortalShortlistConfirmBar({
  className,
  selectedCount,
  totalAmountFormatted,
  onConfirm,
}: ClientPortalShortlistConfirmBarProps) {
  return (
    <footer
      role="region"
      aria-label="Shortlist selection summary"
      className={cn(
        'fixed inset-x-0 bottom-0 z-[100] mb-0 flex flex-col gap-3 border-0 bg-[#0B1D37] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-4',
        className,
      )}
    >
      <p className="font-avenir-regular min-w-0 flex-1 text-sm font-normal leading-5 text-white sm:text-base sm:leading-6">
        <span className="font-medium">{selectionSummaryLabel(selectedCount)}</span>
        <span className="mx-1.5 text-white/70" aria-hidden>
          ·
        </span>
        <span>Total amount: {totalAmountFormatted} exc VAT</span>
      </p>
      <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end">
        <BookingHubPrimaryButton
          type="button"
          responsive
          responsiveCompact
          className="shrink-0"
          iconTrailing={<ArrowRight className="size-5" strokeWidth={2} aria-hidden />}
          onClick={() => onConfirm?.()}
        >
          Confirm Selection
        </BookingHubPrimaryButton>
      </div>
    </footer>
  );
}
