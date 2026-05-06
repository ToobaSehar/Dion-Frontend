/**
 * Text area field layout + typography from Figma **Text area** frame `1238:278`
 * (file `dRB94UmUgc4cgLjWc3NvPo`).
 *
 * Reuses shared input **Text** styles where they match; textarea-specific pieces follow
 * Figma label row (centered, required `*` **Semibold**), shell padding `14×12` (default),
 * tags shell `12` all sides, shadow `0 1 2 / rgba(10,13,18,0.05)`, error copy **Error/500** `#F04438`.
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=1238-278
 */

import {
  BH_INPUT_FIELD_HINT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_PLACEHOLDER_TEXT,
  BH_INPUT_FIELD_STACK_GAP,
  BH_INPUT_FIELD_VALUE,
} from '@/components/bookingHubInputFieldTypography';

export { BH_INPUT_FIELD_STACK_GAP as BH_TEXTAREA_STACK_GAP };
export { BH_INPUT_FIELD_HINT as BH_TEXTAREA_HINT };
export { BH_INPUT_FIELD_ICON_COLOR as BH_TEXTAREA_ICON_COLOR };
export { BH_INPUT_FIELD_VALUE as BH_TEXTAREA_VALUE };

/** Figma label copy — Text sm/Medium, Gray/700. */
export const BH_TEXTAREA_LABEL = [
  'font-avenir-regular text-sm font-medium leading-5 tracking-normal text-[#414651]',
  'whitespace-nowrap text-left',
].join(' ');

/** Label row: `items-center`, `gap-[2px]` (Figma label wrapper). */
export const BH_TEXTAREA_LABEL_ROW = ['flex items-center gap-0.5', BH_TEXTAREA_LABEL].join(' ');

/** Figma required `*` — Text sm/Semibold (600), Brand/600. */
export const BH_TEXTAREA_REQUIRED_DEFAULT =
  'font-avenir-regular text-sm font-semibold leading-5 tracking-normal text-booking-teal';

/** Destructive required `*` — Text sm/Semibold, Error/600. */
export const BH_TEXTAREA_REQUIRED_DESTRUCTIVE =
  'font-avenir-regular text-sm font-semibold leading-5 tracking-normal text-[#d92d20]';

/** Figma destructive / invalid hint under field — Error/500 `#F04438` (Text sm/Regular). */
export const BH_TEXTAREA_ERROR_MESSAGE = [
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#f04438]',
  'w-full text-left',
].join(' ');

/** Figma `Shadows/shadow-xs` on textarea shell (offset 0,1 blur 2, `rgba(10,13,18,0.05)`). */
export const BH_TEXTAREA_SHELL_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]';
