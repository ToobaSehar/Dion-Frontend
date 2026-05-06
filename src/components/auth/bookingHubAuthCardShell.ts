/**
 * Hub auth public card shell — shared layout tokens so signup shells stay aligned.
 * Uses `bg-booking-bg`, Figma grid gutters on field rows, and the same responsive radius
 * as {@link bhRoundedSurfaceCard} (`rounded-bh-2xl` → `md:rounded-bh-3xl` → `xl:rounded-bh-4xl`).
 *
 * Public `/booking-request` embed (`hubCard`) uses {@link BH_BOOKING_REQUEST_PAGE_CLASSES}.
 */

import { BH_GRID_GUTTER_GAP_CLASSES } from '@/components/booking-hub-grid';

/** Literal tailwind segment matching `bhRoundedSurfaceCard()` for use in string-only exports. */
export const BH_HUB_AUTH_SURFACE_RADIUS_CLASSES =
  'rounded-bh-2xl md:rounded-bh-3xl xl:rounded-bh-4xl' as const;

/** Outer canvas only — vertical rhythm + grid live on the inner shell (`BookingHubSignUpPageShell`). */
export const BH_HUB_AUTH_CARD_PAGE_CLASSES =
  'font-avenir-regular flex min-h-[100svh] w-full flex-col bg-booking-bg';

/** Public new booking request page (`/booking-request`) — brand canvas (grid + vertical padding on inner layout). */
export const BH_BOOKING_REQUEST_PAGE_CLASSES = BH_HUB_AUTH_CARD_PAGE_CLASSES;

export const BH_HUB_AUTH_CARD_OUTER_COLUMN =
  'mx-auto flex w-full min-w-0 max-w-[min(100%,42rem)] flex-col lg:max-w-3xl';

/** Two-column field row: Figma gutter `gap-4` / `md:gap-6`. */
export const BH_HUB_AUTH_FIELD_GRID_CLASSES =
  `grid w-full grid-cols-1 sm:grid-cols-2 ${BH_GRID_GUTTER_GAP_CLASSES}` as const;

/** Same template as {@link BH_HUB_AUTH_FIELD_GRID_CLASSES} — matches `BookingRequestFlow` `brFieldGridClass`. */
export const BH_HUB_AUTH_PASSWORD_GRID_CLASSES = BH_HUB_AUTH_FIELD_GRID_CLASSES;

/** Matches `BookingRequestFlow` `formSurfaceClass` padding ladder + card shadow (hub auth white block). */
export const BH_HUB_AUTH_CARD_WHITE = [
  'w-full border border-solid border-[#e9eaeb] bg-white',
  'shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]',
  BH_HUB_AUTH_SURFACE_RADIUS_CLASSES,
  'p-5 sm:p-6 md:p-8 lg:p-12 xl:p-14',
].join(' ');
