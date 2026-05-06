/**
 * Figma **Select** frame `3281:377673` (Booking-Hub-Guidelines-and-UI--1-).
 * Trigger shadow-xs + menu elevation from open-state export (`3281:380050`).
 */

export const BH_SELECT_SHADOW_XS = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]';

export const BH_SELECT_MENU_SHADOW =
  'shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]';

/** Menu container border from Figma `border-[rgba(0,0,0,0.08)]`. */
export const BH_SELECT_MENU_BORDER = 'border border-solid border-[rgba(0,0,0,0.08)]';

/** Focused / open trigger — Brand/500 `#00CBC5` (Figma focused select). */
export const BH_SELECT_FOCUS_BORDER = '#00cbc5';

/** Tailwind classes for trigger focus + open (static string for JIT). */
export const BH_SELECT_TRIGGER_FOCUS_OPEN_BORDER =
  'focus-visible:border-[#00cbc5] data-[state=open]:border-[#00cbc5]';

/** Check icon in menu — Figma Brand/500 `#00CBC5` (focus ring color). */
export const BH_SELECT_CHECK_ICON = 'text-[#00cbc5]';
