/**
 * Input field typography aligned with Figma **Input field** frame
 * `1090:57817` in file `dRB94UmUgc4cgLjWc3NvPo`
 * (e.g. `1091:61583` md Placeholder, `3531:402962` sm Placeholder, `1091:61575` Filled,
 * `1091:61581` Focused shell only, `1091:61579` Disabled, `1094:7278` Destructive).
 *
 * Figma Foundations → Typography uses **Inter** (letter-spacing 0). The app uses
 * **Inter** everywhere (`font-avenir-regular` maps to the same stack); **sizes,
 * weights, and line heights** match the Figma Text styles below.
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=1090-57817
 */

/** Vertical gap between label block, field shell, and hint/error (Figma `gap-[6px]`). */
export const BH_INPUT_FIELD_STACK_GAP = 'gap-1.5';

/** Figma **Text sm/Medium** — label (Gray/700 `#414651`). */
export const BH_INPUT_FIELD_LABEL = [
  'font-avenir-regular text-sm font-medium leading-5 tracking-normal text-[#414651]',
  'whitespace-nowrap text-left',
].join(' ');

/** Label row: label + required asterisk with Figma `gap-[2px]`. */
export const BH_INPUT_FIELD_LABEL_ROW = [
  'flex items-start gap-0.5',
  BH_INPUT_FIELD_LABEL,
].join(' ');

/** Figma **Brand/600** — required `*` when not destructive (`#00BAB5`). */
export const BH_INPUT_FIELD_REQUIRED_DEFAULT = 'text-booking-teal';

/** Figma **Error/600** — required `*` when destructive (`#D92D20`). */
export const BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE = 'text-[#d92d20]';

/**
 * Figma **Text md/Regular** — value / placeholder; scales with hub buttons (sm/md → lg+).
 * Placeholder & empty: Gray/500 `#717680`. Filled value: Gray/900 `#0B1D37`.
 */
export const BH_INPUT_FIELD_VALUE = [
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal lg:text-base lg:leading-6',
  'text-[#0b1d37] placeholder:text-[#717680] placeholder-shown:text-[#717680]',
].join(' ');

/** Figma Gray/900 — **Filled** state value text (`1091:61575`). */
export const BH_INPUT_FIELD_FILLED_TEXT = 'text-[#0b1d37]';

/** Figma Gray/500 — **Placeholder** / empty control copy (`1091:61583`). */
export const BH_INPUT_FIELD_PLACEHOLDER_TEXT = 'text-[#717680]';

/** Figma Gray/400 — leading/trailing icons in the input shell. */
export const BH_INPUT_FIELD_ICON_COLOR = 'text-[#a4a7ae]';

/**
 * Figma **Text md/Regular** metrics only — for `control` slots (date button, select trigger)
 * where placeholder/filled colors are applied separately.
 */
export const BH_INPUT_FIELD_CONTROL_SLOT =
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal lg:text-base lg:leading-6 tracking-normal';

/**
 * Radix `Select.Trigger` — when empty it sets `data-placeholder=""` on the **button** (not a child).
 * Figma **Text md/Regular**: Gray/900 filled, Gray/500 placeholder (`1091:61583`).
 */
export const BH_INPUT_FIELD_SELECT_TRIGGER_TEXT = [
  BH_INPUT_FIELD_CONTROL_SLOT,
  'text-[#0b1d37] [&[data-placeholder]]:text-[#717680]',
].join(' ');

/** Figma **Text sm/Regular** — helper line (Gray/600 `#535862`). */
export const BH_INPUT_FIELD_HINT = [
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#535862]',
  'w-full text-left',
].join(' ');

/** Figma **Text sm/Regular** + **Error/600** — error message under field (`#D92D20`). */
export const BH_INPUT_FIELD_ERROR_MESSAGE = [
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#d92d20]',
  'w-full text-left',
].join(' ');

/** Leading prefix text inside shell (same scale as value). */
export const BH_INPUT_FIELD_PREFIX =
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#0b1d37] lg:text-base lg:leading-6';

/** Trailing suffix / meta inside shell (Gray/500). */
export const BH_INPUT_FIELD_SUFFIX =
  'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#717680] lg:text-base lg:leading-6';
