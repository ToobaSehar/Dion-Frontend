'use client';

import { cn } from '@/lib/utils';
import { bhSpacingRem, type BookingHubGapSize } from './bookingHubSpacing';

export type BookingHubSpaceAxis = 'horizontal' | 'vertical' | 'both';

export type BookingHubSpaceProps = {
  /**
   * Figma spacing primitive (`none` … `11xl`) or legacy numeric step (`0` … `480`).
   * @see `6377:74654` Foundations → Spacing
   */
  size: BookingHubGapSize;
  /**
   * **vertical** — fixed height, stretches width in a column flex.
   * **horizontal** — fixed width, stretches height in a row flex.
   * **both** — square block `size × size`.
   */
  axis?: BookingHubSpaceAxis;
  className?: string;
};

/**
 * Non-interactive spacer aligned to **Spacing** (`6377:74654`).
 * Prefer `bhGap` / `bhPadding*` when an extra DOM node is not needed.
 */
export function BookingHubSpace({ size, axis = 'vertical', className }: BookingHubSpaceProps) {
  if (size === '0' || size === 'none') {
    return null;
  }

  const rem = bhSpacingRem(size);

  if (axis === 'both') {
    return (
      <div
        aria-hidden
        className={cn('shrink-0', className)}
        style={{ width: rem, height: rem, minWidth: rem, minHeight: rem }}
      />
    );
  }

  if (axis === 'horizontal') {
    return (
      <div
        aria-hidden
        className={cn('shrink-0 self-stretch', className)}
        style={{ width: rem, minWidth: rem }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn('w-full min-h-0 shrink-0 self-stretch', className)}
      style={{ height: rem, minHeight: rem }}
    />
  );
}
