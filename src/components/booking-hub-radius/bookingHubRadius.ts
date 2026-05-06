import { cn } from '@/lib/utils';

/**
 * Booking Hub border-radius — Figma **Foundations → Radius** (`6377:75052`).
 * Tokens: **radius-none** … **radius-4xl**, **radius-full** (∞ → `9999px` in CSS).
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=6377-75052
 */

export const BOOKING_HUB_RADIUS_TOKENS = [
  'none',
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  'full',
] as const;

export type BookingHubRadiusToken = (typeof BOOKING_HUB_RADIUS_TOKENS)[number];

/** Tailwind `borderRadius` theme keys — use as `rounded-bh-{suffix}` */
const RADIUS_TW_SUFFIX: Record<BookingHubRadiusToken, string> = {
  none: 'bh-none',
  xxs: 'bh-xxs',
  xs: 'bh-xs',
  sm: 'bh-sm',
  md: 'bh-md',
  lg: 'bh-lg',
  xl: 'bh-xl',
  '2xl': 'bh-2xl',
  '3xl': 'bh-3xl',
  '4xl': 'bh-4xl',
  full: 'bh-full',
};

export const BH_RADIUS_REM: Record<BookingHubRadiusToken, string> = {
  none: '0',
  xxs: '0.125rem',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.25rem',
  '4xl': '1.5rem',
  full: '9999px',
};

export const BH_RADIUS_PX: Record<BookingHubRadiusToken, number> = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  full: 9999,
};

function r(token: BookingHubRadiusToken): string {
  return RADIUS_TW_SUFFIX[token];
}

/** `rounded-bh-*` */
export function bhRounded(token: BookingHubRadiusToken): string {
  return `rounded-${r(token)}`;
}

/**
 * Responsive radius for **large surfaces** (marketing cards, form shells, dialogs).
 * Base **`2xl`** → **`3xl`** from `md` → **`4xl`** from `xl` so corners stay visible on wide layouts.
 * @see home entry `page.tsx` — role selection cards
 */
export function bhRoundedSurfaceCard(): string {
  return cn(bhRounded('2xl'), 'md:rounded-bh-3xl xl:rounded-bh-4xl');
}

/**
 * Portal **toolbar** outline actions (e.g. admin request detail: View Shortlist, Unpublish, Cancel Request).
 * Matches `BookingHubSecondaryButton` / `BookingHubSecondaryDeleteButton` control corner (**`md`** / 8px).
 */
export function bhRoundedPortalToolbarOutlineButton(): string {
  return bhRounded('md');
}

export function bhRoundedT(token: BookingHubRadiusToken): string {
  return `rounded-t-${r(token)}`;
}

export function bhRoundedR(token: BookingHubRadiusToken): string {
  return `rounded-r-${r(token)}`;
}

export function bhRoundedB(token: BookingHubRadiusToken): string {
  return `rounded-b-${r(token)}`;
}

export function bhRoundedL(token: BookingHubRadiusToken): string {
  return `rounded-l-${r(token)}`;
}

export function bhRoundedTL(token: BookingHubRadiusToken): string {
  return `rounded-tl-${r(token)}`;
}

export function bhRoundedTR(token: BookingHubRadiusToken): string {
  return `rounded-tr-${r(token)}`;
}

export function bhRoundedBL(token: BookingHubRadiusToken): string {
  return `rounded-bl-${r(token)}`;
}

export function bhRoundedBR(token: BookingHubRadiusToken): string {
  return `rounded-br-${r(token)}`;
}

export function bhRoundedS(token: BookingHubRadiusToken): string {
  return `rounded-s-${r(token)}`;
}

export function bhRoundedE(token: BookingHubRadiusToken): string {
  return `rounded-e-${r(token)}`;
}

/** `border-bh-*` width uses spacing scale; radius for rings uses same token names via arbitrary: prefer `bhRounded` on wrapper. */
export function bhRadiusMerge(...parts: Array<string | undefined | false>): string {
  return cn(...parts);
}

/** CSS value for `border-radius` / `style` when Tailwind is not used */
export function bhRadiusCss(token: BookingHubRadiusToken): string {
  return BH_RADIUS_REM[token];
}
