import type { BookingHubButtonSize } from './bookingHubButtonTypes';

/**
 * **Figma — `Buttons/Button` (Primary default)** frame and padding, px.
 *
 * Pulled with **Figma MCP** (`get_design_context`) and **plugin** bounds (`width` / `height` on each node).
 *
 * - **File:** `dRB94UmUgc4cgLjWc3NvPo`
 * - **sm** `16638:46334` → **154 × 36**
 * - **md** `16638:46335` → **158 × 40**
 * - **lg** `16638:46336` → **177 × 44**
 * - **xl** `16638:46341` → **181 × 48** (guidelines link: `node-id=16638-46341`)
 *
 * Primary and secondary share this default frame; override per screen with `className` (merged last via `cn`).
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=16638-46341
 */
export const BOOKING_HUB_BUTTON_DEFAULT_FRAME_PX = {
  sm: { minWidth: 154, minHeight: 36 },
  md: { minWidth: 158, minHeight: 40 },
  lg: { minWidth: 177, minHeight: 44 },
  xl: { minWidth: 181, minHeight: 48 },
} as const;

/** Auto-layout padding (horizontal / vertical), Figma MCP. */
export const BOOKING_HUB_BUTTON_PADDING_PX = {
  sm: { x: 12, y: 8 },
  md: { x: 14, y: 10 },
  lg: { x: 16, y: 10 },
  xl: { x: 18, y: 12 },
} as const;

/**
 * **Loading** min widths (Primary loading); keep in sync with Figma loading column if it changes.
 * Heights match `BOOKING_HUB_BUTTON_DEFAULT_FRAME_PX` per size.
 */
export const BOOKING_HUB_BUTTON_LOADING_MIN_WIDTH_PX = {
  sm: 139,
  md: 143,
  lg: 161,
  xl: 165,
} as const;

/**
 * Shared responsive min-height for hub single-line controls (inputs + hub buttons).
 * Values match `BOOKING_HUB_BUTTON_DEFAULT_FRAME_PX.*.minHeight` (Tailwind literals for JIT).
 */
export const BH_RESPONSIVE_CONTROL_MIN_H =
  'min-h-[36px] md:min-h-[40px] lg:min-h-[44px] xl:min-h-[48px]';

/**
 * Two-step responsive min-height — matches **sm** then **md** Figma frames only (`36px` → `40px` from `md` up).
 * Avoids **44px / 48px** on laptop/desktop (`lg`/`xl`) while keeping narrow-viewport density.
 */
export const BH_RESPONSIVE_CONTROL_MIN_H_COMPACT =
  'min-h-[36px] md:min-h-[40px]';

/** `min-h-[…]` per discrete `size` — literals must stay in sync with `BOOKING_HUB_BUTTON_DEFAULT_FRAME_PX`. */
export const BH_BUTTON_FRAME_MIN_HEIGHT_BY_SIZE: Record<BookingHubButtonSize, string> = {
  sm: 'min-h-[36px]',
  md: 'min-h-[40px]',
  lg: 'min-h-[44px]',
  xl: 'min-h-[48px]',
};

/** Default (non–full-width) min widths — literals in sync with `BOOKING_HUB_BUTTON_DEFAULT_FRAME_PX`. */
export const BH_BUTTON_FRAME_MIN_WIDTH_DEFAULT_BY_SIZE: Record<BookingHubButtonSize, string> = {
  sm: 'min-w-[154px]',
  md: 'min-w-[158px]',
  lg: 'min-w-[177px]',
  xl: 'min-w-[181px]',
};

/** Responsive default min-width (non–full-width, not loading). */
export const BH_BUTTON_FRAME_MIN_WIDTH_DEFAULT_RESPONSIVE =
  'min-w-[154px] md:min-w-[158px] lg:min-w-[177px] xl:min-w-[181px]';

/** Responsive loading min-width — in sync with `BOOKING_HUB_BUTTON_LOADING_MIN_WIDTH_PX`. */
export const BH_BUTTON_FRAME_MIN_WIDTH_LOADING_RESPONSIVE =
  'min-w-[139px] md:min-w-[143px] lg:min-w-[161px] xl:min-w-[165px]';

/** Discrete `size` loading min-width. */
export const BH_BUTTON_FRAME_MIN_WIDTH_LOADING_BY_SIZE: Record<BookingHubButtonSize, string> = {
  sm: 'min-w-[139px]',
  md: 'min-w-[143px]',
  lg: 'min-w-[161px]',
  xl: 'min-w-[165px]',
};

/** Padding: sm → md → lg → xl (matches `BOOKING_HUB_BUTTON_PADDING_PX`). */
export const BH_BUTTON_PADDING_RESPONSIVE =
  'px-3 py-2 md:px-[14px] md:py-[10px] lg:px-4 lg:py-[10px] xl:px-[18px] xl:py-3';

/** Discrete-size padding classes — in sync with `BOOKING_HUB_BUTTON_PADDING_PX`. */
export const BH_BUTTON_PADDING_BY_SIZE: Record<BookingHubButtonSize, string> = {
  sm: 'px-3 py-2',
  md: 'px-[14px] py-[10px]',
  lg: 'px-4 py-[10px]',
  xl: 'px-[18px] py-3',
};
