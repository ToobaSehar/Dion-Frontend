import { BH_BUTTON_MIN_H } from '@/components/bookingHubControlHeight';
import { cn } from '@/lib/utils';
import {
  BH_BUTTON_FRAME_MIN_HEIGHT_BY_SIZE,
  BH_BUTTON_FRAME_MIN_WIDTH_DEFAULT_BY_SIZE,
  BH_BUTTON_FRAME_MIN_WIDTH_DEFAULT_RESPONSIVE,
  BH_BUTTON_FRAME_MIN_WIDTH_LOADING_BY_SIZE,
  BH_BUTTON_FRAME_MIN_WIDTH_LOADING_RESPONSIVE,
  BH_BUTTON_PADDING_BY_SIZE,
  BH_BUTTON_PADDING_RESPONSIVE,
  BH_RESPONSIVE_CONTROL_MIN_H,
  BH_RESPONSIVE_CONTROL_MIN_H_COMPACT,
} from './bookingHubButtonFrameTokens';
import type { BookingHubButtonSize } from './bookingHubButtonTypes';

/** Border-box min-height: Figma Button CTA 48px (`--bh-button-height`). */
export function bhButtonMinHeightMatchInputField(_size: BookingHubButtonSize): string {
  return BH_BUTTON_MIN_H;
}

/**
 * **Primary + default** — min frame from Figma (`BOOKING_HUB_BUTTON_DEFAULT_FRAME_PX` + loading widths in `bookingHubButtonFrameTokens`).
 */
export function bhPrimaryDefaultFrame(
  size: BookingHubButtonSize,
  fullWidth?: boolean,
  loading?: boolean,
): string {
  const minH = BH_BUTTON_FRAME_MIN_HEIGHT_BY_SIZE[size];
  if (fullWidth) {
    return minH;
  }
  if (loading) {
    return cn(minH, BH_BUTTON_FRAME_MIN_WIDTH_LOADING_BY_SIZE[size]);
  }
  return cn(minH, BH_BUTTON_FRAME_MIN_WIDTH_DEFAULT_BY_SIZE[size]);
}

/**
 * **Secondary Default** — frame min width/height match Primary for each size (Figma MCP).
 * @see `src/design-system/booking-hub-figma/specs/booking-hub-secondary-button-default-figma-mcp-pull.md`
 */
export const bhSecondaryDefaultFrame = bhPrimaryDefaultFrame;

/** Horizontal + vertical padding per Figma sm / md / lg / xl (`BOOKING_HUB_BUTTON_PADDING_PX`). */
export function bhButtonPadding(size: BookingHubButtonSize): string {
  return BH_BUTTON_PADDING_BY_SIZE[size];
}

/** Gap between leading icon, label, trailing icon — 4px sm/md, 6px lg/xl. */
export function bhButtonGap(size: BookingHubButtonSize): string {
  return size === 'sm' || size === 'md' ? 'gap-1' : 'gap-1.5';
}

/**
 * Typography: Figma Text sm/md **Semibold** (14/20 for sm+md, 16/24 for lg+xl).
 * Uses Inter via `font-avenir-regular` (Tailwind maps to `--font-inter`).
 */
export function bhButtonTypography(size: BookingHubButtonSize): string {
  if (size === 'sm' || size === 'md') {
    return 'font-avenir-regular text-sm font-semibold leading-5 tracking-normal';
  }
  return 'font-avenir-regular text-base font-semibold leading-6 tracking-normal';
}

/**
 * Secondary label — same Inter Semibold scale as primary (`bhButtonTypography`).
 * @see `src/design-system/booking-hub-figma/specs/booking-hub-secondary-button-default-figma-mcp-pull.md`
 */
export function bhSecondaryButtonTypography(size: BookingHubButtonSize): string {
  return bhButtonTypography(size);
}

export function bhSecondaryButtonInnerRowClass(size: BookingHubButtonSize, loading: boolean): string {
  return cn(
    'relative z-[1] inline-flex items-center justify-center',
    bhButtonGap(size),
    bhSecondaryButtonTypography(size),
    bhButtonLoadingMinHeight(size, loading),
  );
}

/** Loading row stays within the same control height as inputs. */
export function bhButtonLoadingMinHeight(
  _size: BookingHubButtonSize,
  loading: boolean,
): string {
  if (!loading) return '';
  return '';
}

export function bhButtonInnerRowClass(size: BookingHubButtonSize, loading: boolean): string {
  return cn('relative z-[1] inline-flex items-center justify-center', bhButtonGap(size), bhButtonTypography(size), bhButtonLoadingMinHeight(size, loading));
}

// --- Responsive (CSS breakpoints only — matches `useBookingHubButtonSize` / Tailwind screens) ---

const bhResponsiveGap = cn('gap-1', 'lg:gap-1.5');

/** Padding: sm base → md → lg → xl (`BH_BUTTON_PADDING_RESPONSIVE`). */
export function bhButtonResponsivePadding(): string {
  return BH_BUTTON_PADDING_RESPONSIVE;
}

/** Primary / Secondary default & loading min frame (Figma widths per breakpoint). */
export function bhPrimaryResponsiveFrame(
  fullWidth?: boolean,
  loading?: boolean,
  compact?: boolean,
  contentSized?: boolean,
): string {
  const minH = compact ? BH_RESPONSIVE_CONTROL_MIN_H_COMPACT : BH_RESPONSIVE_CONTROL_MIN_H;
  if (fullWidth) {
    return minH;
  }
  if (loading) {
    return cn(minH, BH_BUTTON_FRAME_MIN_WIDTH_LOADING_RESPONSIVE);
  }
  if (contentSized) {
    return cn(minH, 'min-w-0 w-fit shrink-0');
  }
  return cn(minH, BH_BUTTON_FRAME_MIN_WIDTH_DEFAULT_RESPONSIVE);
}

/** Inner row: Inter, sm/md 14/20 → lg+ 16/24 (Figma Text sm/md vs md/base). */
export function bhButtonResponsiveInnerRowPrimary(loading: boolean): string {
  return cn(
    'relative z-[1] inline-flex items-center justify-center',
    bhResponsiveGap,
    'font-avenir-regular text-sm font-semibold leading-5 tracking-normal lg:text-base lg:leading-6',
    bhButtonLoadingMinHeight('md', loading),
  );
}

/** Inner row: Inter Semibold (secondary label), same responsive type as primary. */
export function bhButtonResponsiveInnerRowSecondary(loading: boolean): string {
  return cn(
    'relative z-[1] inline-flex items-center justify-center',
    bhResponsiveGap,
    'font-avenir-regular text-sm font-semibold leading-5 tracking-normal lg:text-base lg:leading-6',
    bhButtonLoadingMinHeight('md', loading),
  );
}

/**
 * Tertiary (ghost): responsive **min-height** steps match Primary/Secondary control heights (`36→40→44→48`),
 * or **compact** (`36→40` only) when `responsiveCompact` — same as `bhPrimaryResponsiveFrame` height ladder.
 * Width is handled separately (hug vs `fullWidth` vs loading min-width) in `BookingHubTertiaryButton`.
 *
 * @see Figma `Buttons/Button` tertiary column `16638:46333`; xl default instance `16641:107347`.
 */
export function bhTertiaryResponsiveFrame(compact?: boolean): string {
  return compact ? BH_RESPONSIVE_CONTROL_MIN_H_COMPACT : BH_RESPONSIVE_CONTROL_MIN_H;
}

/** Responsive tertiary frame: min-height ladder + optional `fullWidth` / loading / `contentSized` width rules (mirrors primary responsive frame semantics). */
export function bhTertiaryResponsiveOuterFrame(
  fullWidth?: boolean,
  loading?: boolean,
  compact?: boolean,
  contentSized?: boolean,
): string {
  const minH = bhTertiaryResponsiveFrame(compact);
  if (fullWidth) {
    return cn(minH, 'w-full min-w-0');
  }
  if (loading) {
    return bhPrimaryResponsiveFrame(false, true, compact, contentSized);
  }
  if (contentSized) {
    return cn(minH, 'min-w-0 w-fit shrink-0');
  }
  return minH;
}
