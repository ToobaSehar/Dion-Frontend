import { cn } from '@/lib/utils';
import { bhGap, type BookingHubGapSize } from '@/components/booking-hub-space/bookingHubSpacing';

/**
 * Booking Hub responsive grid — Figma **Foundations → Grid layouts** (`6377:75139`).
 *
 * **Viewport grids (meta layout)** — column counts by breakpoint:
 * - **Mobile (375 reference):** 4 columns, **16px** gutter, **16px** outer margin, **343px** content width.
 * - **Tablet (768):** 8 columns, **24px** gutter, **32px** margin, **704px** content.
 * - **Desktop (1280):** 12 columns, **24px** gutter, **80px** margin, **1128px** content (12×72px + 11×24px gutters).
 *
 * **Container subdivisions** (equal auto columns inside the content track): 12, 6, 5, 3, 2.
 *
 * Tailwind mapping: **`md:` = 768px**, **`xl:` = 1280px** (default theme), gutters **`gap-4`** then **`gap-6`**.
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=6377-75139
 */

/** Authoritative numbers from the guidelines frame (design reference). */
export const BOOKING_HUB_GRID_SPEC = {
  mobile: {
    viewportPx: 375,
    columns: 4,
    columnPx: 74,
    gutterPx: 16,
    marginPx: 16,
    contentWidthPx: 343,
  },
  tablet: {
    viewportPx: 768,
    columns: 8,
    columnPx: 67,
    gutterPx: 24,
    marginPx: 32,
    contentWidthPx: 704,
  },
  desktop: {
    viewportPx: 1280,
    columns: 12,
    columnPx: 72,
    gutterPx: 24,
    marginPx: 80,
    contentWidthPx: 1128,
  },
} as const;

/** Desktop content track — `1128px` = `70.5rem` at 16px root. */
export const BH_GRID_CONTENT_MAX_REM = '70.5rem';

/**
 * Page shell: centred **1280** max width + horizontal margins **16 / 32 / 80** (Figma grid margins).
 * Prefer this when aligning full-page layout to the grid frame; does not replace existing `BH_CONTAINER_CLASSES`.
 */
export const BH_GRID_SHELL_CLASSES =
  'mx-auto w-full max-w-bh-4xl px-4 md:px-8 xl:px-20' as const;

/** Optional inner cap matching desktop **1128px** content width (`70.5rem`). */
export const BH_GRID_CONTENT_TRACK_CLASSES = 'mx-auto w-full max-w-[70.5rem]' as const;

/** Figma gutter: **16px** mobile, **24px** tablet and up → `gap-4` / `gap-6`. */
export const BH_GRID_GUTTER_GAP_CLASSES = 'gap-4 md:gap-6' as const;

/** Foundation grid: **4 / 8 / 12** columns at **default / md / xl**. */
export const BH_GRID_FOUNDATION_COL_CLASSES =
  'grid-cols-4 md:grid-cols-8 xl:grid-cols-12' as const;

const EQUAL_COL_CLASSES: Record<BookingHubGridEqualColumns, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  5: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6',
  12: BH_GRID_FOUNDATION_COL_CLASSES,
};

export const BOOKING_HUB_GRID_EQUAL_COLUMNS = [2, 3, 5, 6, 12] as const;

export type BookingHubGridEqualColumns = (typeof BOOKING_HUB_GRID_EQUAL_COLUMNS)[number];

export type BookingHubGridLayout =
  | 'foundation'
  | { equal: BookingHubGridEqualColumns };

function isEqualLayout(layout: BookingHubGridLayout): layout is { equal: BookingHubGridEqualColumns } {
  return typeof layout === 'object' && layout !== null && 'equal' in layout;
}

/** Column template classes only (no `grid` / gap). */
export function bhGridCols(layout: BookingHubGridLayout): string {
  if (layout === 'foundation') {
    return BH_GRID_FOUNDATION_COL_CLASSES;
  }
  if (isEqualLayout(layout)) {
    return EQUAL_COL_CLASSES[layout.equal];
  }
  return BH_GRID_FOUNDATION_COL_CLASSES;
}

/** Default grid gutter from Figma; or any spacing token / legacy step via `bhGap`. */
export function bhGridGap(mode: 'gutter' | BookingHubGapSize = 'gutter'): string {
  if (mode === 'gutter') {
    return BH_GRID_GUTTER_GAP_CLASSES;
  }
  return bhGap(mode);
}

/**
 * Full **`grid`** row: columns per layout + gap.
 * @param layout — `'foundation'` (4/8/12) or `{ equal: 2 | 3 | 5 | 6 | 12 }` for container subdivisions.
 */
export function bhGridClasses(
  layout: BookingHubGridLayout,
  gap: 'gutter' | BookingHubGapSize = 'gutter',
): string {
  return cn('grid', bhGridCols(layout), bhGridGap(gap));
}

export function bhGridMerge(...parts: Array<string | undefined | false>): string {
  return cn(...parts);
}
