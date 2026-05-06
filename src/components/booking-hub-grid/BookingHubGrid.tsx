import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { BookingHubGapSize } from '@/components/booking-hub-space/bookingHubSpacing';
import { bhGridClasses, bhGridMerge, type BookingHubGridLayout } from './bookingHubGridTokens';

export type BookingHubGridProps = {
  /** `'foundation'` = responsive 4 / 8 / 12 columns; `{ equal: n }` = inner equal columns per Figma container presets. */
  layout?: BookingHubGridLayout;
  /** `'gutter'` uses **16px / 24px** gutters from the grid frame; otherwise any `bhGap` size. */
  gap?: 'gutter' | BookingHubGapSize;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

/**
 * CSS **grid** aligned to Figma **Grid layouts** (`6377:75139`): column counts + gutters.
 * Compose with **`BH_GRID_SHELL_CLASSES`** / **`BH_GRID_CONTENT_TRACK_CLASSES`** when you need the full page shell.
 */
export function BookingHubGrid({
  layout = 'foundation',
  gap = 'gutter',
  className,
  children,
  ...rest
}: BookingHubGridProps) {
  return (
    <div className={bhGridMerge(bhGridClasses(layout, gap), className)} {...rest}>
      {children}
    </div>
  );
}
