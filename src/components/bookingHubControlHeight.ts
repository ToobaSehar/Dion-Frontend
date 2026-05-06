/**
 * Figma-aligned control heights (single-line “Hug” rows).
 * Legacy token: 40px (`--bh-input-height`). Hub buttons / CTAs: 48px (`--bh-button-height`).
 * CSS: `--bh-input-height`, `--bh-button-height` in `globals.css`; Tailwind `*-bh-input` / `*-bh-button`.
 */
export const BH_INPUT_MIN_H = 'min-h-bh-input';
export const BH_INPUT_H = 'h-bh-input';
export const BH_BUTTON_MIN_H = 'min-h-bh-button';
export const BH_BUTTON_H = 'h-bh-button';

/** @see `bookingHubButtonFrameTokens` — Figma `Buttons/Button` frame heights (single source). */
export { BH_RESPONSIVE_CONTROL_MIN_H } from '@/components/booking-hub-button/bookingHubButtonFrameTokens';
