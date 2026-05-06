/**
 * Design tokens from Figma **Buttons/Button** (`16638:46333`) — Brand/Gray scales, shadow-xs, skeuomorphic inset, focus ring.
 * Brand/600 `#00BAB5` aligns with Tailwind `booking-teal`.
 */

/** `shadow-xs` — DROP_SHADOW rgba(10,13,18,0.05), 0 1 2 */
export const BH_BTN_SHADOW_XS = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]';

/** Skeuomorphic inset on filled/outline buttons (default / hover / focus, not disabled). */
export const BH_BTN_SKEUO_INSET =
  'shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]';

/**
 * Focus ring — matches Figma Primary **Focused**: DROP_SHADOW #00bab5 spread 4, #ffffff spread 2, then shadow-xs
 * (`booking-hub-primary-button-states-focused-disabled-loading.md`). Skeuomorphic inners stay on the inner span.
 */
export const BH_BTN_FOCUS_RING =
  'focus-visible:shadow-[0px_0px_0px_4px_#00bab5,0px_0px_0px_2px_#ffffff,0px_1px_2px_0px_rgba(10,13,18,0.05)]';

/**
 * Tertiary focused — ring only (no outer shadow-xs).
 * Figma `Buttons/Button` tertiary column (`16638:46333`), e.g. md Tertiary Focused.
 */
export const BH_BTN_FOCUS_RING_TERTIARY =
  'focus-visible:shadow-[0px_0px_0px_2px_#ffffff,0px_0px_0px_4px_#00bab5]';

/**
 * Secondary destructive (`Buttons/Button destructive`, Hierarchy=Secondary) — Focused ring uses **Error/500**
 * (`booking-hub-secondary-delete-button-states.md`).
 */
export const BH_BTN_FOCUS_RING_DESTRUCTIVE =
  'focus-visible:shadow-[0px_0px_0px_4px_#f04438,0px_0px_0px_2px_#ffffff,0px_1px_2px_0px_rgba(10,13,18,0.05)]';

/**
 * Tertiary destructive focused — ring only (no shadow-xs), **Error/500** spread **4**, white spread **2**
 * (`3287:428735` Buttons/Button destructive · Tertiary · Focused).
 */
export const BH_BTN_FOCUS_RING_TERTIARY_DESTRUCTIVE =
  'focus-visible:shadow-[0px_0px_0px_2px_#ffffff,0px_0px_0px_4px_#f04438]';
