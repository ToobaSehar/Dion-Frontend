import { cn } from '@/lib/utils';

/**
 * Booking Hub spacing foundations — Figma **Spacing** (`6377:74654`).
 * Primitives: **spacing-none** … **spacing-11xl** (Size column = **16px base** / rem in file).
 * Also: **Widths**, **Containers** (responsive horizontal padding + desktop max width), **Paragraph max-width**.
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=6377-74654
 */

/** Figma primitive token names (without `spacing-` prefix) */
export const BOOKING_HUB_SPACING_PRIMITIVES = [
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
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl',
  '11xl',
] as const;

export type BookingHubSpacingToken = (typeof BOOKING_HUB_SPACING_PRIMITIVES)[number];

/** Legacy multiplier scale (still valid for gaps/margins beyond primitives — matches prior `6377:74878` table). */
export const BOOKING_HUB_SPACE_STEPS = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '8',
  '10',
  '12',
  '16',
  '20',
  '24',
  '32',
  '40',
  '48',
  '56',
  '64',
  '80',
  '96',
  '120',
  '140',
  '160',
  '180',
  '192',
  '256',
  '320',
  '360',
  '400',
  '480',
] as const;

export type BookingHubSpaceStep = (typeof BOOKING_HUB_SPACE_STEPS)[number];

/** Union accepted by `bhGap`, `bhPadding`, `BookingHubSpace`, etc. */
export type BookingHubGapSize = BookingHubSpacingToken | BookingHubSpaceStep;

export const BH_SPACING_REM: Record<BookingHubSpacingToken, string> = {
  none: '0rem',
  xxs: '0.125rem',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  '5xl': '2.5rem',
  '6xl': '3rem',
  '7xl': '4rem',
  '8xl': '5rem',
  '9xl': '6rem',
  '10xl': '8rem',
  '11xl': '10rem',
};

export const BH_SPACING_PX: Record<BookingHubSpacingToken, number> = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 64,
  '8xl': 80,
  '9xl': 96,
  '10xl': 128,
  '11xl': 160,
};

/** Maps semantic token → Tailwind `spacing` key (same pixel/rem as Figma). */
const SEMANTIC_TO_TW: Record<BookingHubSpacingToken, string> = {
  none: '0',
  xxs: '0.5',
  xs: '1',
  sm: '1.5',
  md: '2',
  lg: '3',
  xl: '4',
  '2xl': '5',
  '3xl': '6',
  '4xl': '8',
  '5xl': '10',
  '6xl': '12',
  '7xl': '16',
  '8xl': '20',
  '9xl': '24',
  '10xl': '32',
  '11xl': '40',
};

const LEGACY_TW: Record<BookingHubSpaceStep, string> = {
  '0': '0',
  '0.5': '0.5',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '8': '8',
  '10': '10',
  '12': '12',
  '16': '16',
  '20': '20',
  '24': '24',
  '32': '32',
  '40': '40',
  '48': '48',
  '56': '56',
  '64': '64',
  '80': '80',
  '96': '96',
  '120': '120',
  '140': '140',
  '160': '160',
  '180': '180',
  '192': '192',
  '256': '256',
  '320': '320',
  '360': '360',
  '400': '400',
  '480': '480',
};

export const BH_SPACE_REM: Record<BookingHubSpaceStep, string> = {
  '0': '0rem',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
  '80': '20rem',
  '96': '24rem',
  '120': '30rem',
  '140': '35rem',
  '160': '40rem',
  '180': '45rem',
  '192': '48rem',
  '256': '64rem',
  '320': '80rem',
  '360': '90rem',
  '400': '100rem',
  '480': '120rem',
};

export const BH_SPACE_PX: Record<BookingHubSpaceStep, number> = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
  '32': 128,
  '40': 160,
  '48': 192,
  '56': 224,
  '64': 256,
  '80': 320,
  '96': 384,
  '120': 480,
  '140': 560,
  '160': 640,
  '180': 720,
  '192': 768,
  '256': 1024,
  '320': 1280,
  '360': 1440,
  '400': 1600,
  '480': 1920,
};

/** Figma **Widths** table (`6377:74654` second grid) — use with `bhMaxWidth` / layout. */
export const BOOKING_HUB_WIDTH_TOKENS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'] as const;

export type BookingHubWidthToken = (typeof BOOKING_HUB_WIDTH_TOKENS)[number];

export const BH_WIDTH_REM: Record<BookingHubWidthToken, string> = {
  xs: '20rem',
  sm: '24rem',
  md: '30rem',
  lg: '35rem',
  xl: '40rem',
  '2xl': '48rem',
  '3xl': '64rem',
  '4xl': '80rem',
  '5xl': '90rem',
  '6xl': '100rem',
  '7xl': '120rem',
};

export const BH_WIDTH_PX: Record<BookingHubWidthToken, number> = {
  xs: 320,
  sm: 384,
  md: 480,
  lg: 560,
  xl: 640,
  '2xl': 768,
  '3xl': 1024,
  '4xl': 1280,
  '5xl': 1440,
  '6xl': 1600,
  '7xl': 1920,
};

/** Figma: **paragraph-max-width** — `45rem` / 720px */
export const BH_PARAGRAPH_MAX_WIDTH_REM = '45rem';

/** Figma containers: horizontal padding **16px** mobile, **32px** desktop; max width **1280px** (`80rem`). */
export const BH_CONTAINER_CLASSES =
  'mx-auto w-full max-w-bh-4xl px-4 md:px-8' as const;

function twSpacingKey(size: BookingHubGapSize): string {
  if (size in SEMANTIC_TO_TW) {
    return SEMANTIC_TO_TW[size as BookingHubSpacingToken];
  }
  return LEGACY_TW[size as BookingHubSpaceStep];
}

function tw(prefix: string, size: BookingHubGapSize): string {
  return `${prefix}-${twSpacingKey(size)}`;
}

/** Rem string for a primitive or legacy step (for inline styles). */
export function bhSpacingRem(size: BookingHubGapSize): string {
  if (size in BH_SPACING_REM) {
    return BH_SPACING_REM[size as BookingHubSpacingToken];
  }
  return BH_SPACE_REM[size as BookingHubSpaceStep];
}

/** `gap-*` — Figma spacing primitives or legacy numeric scale */
export function bhGap(size: BookingHubGapSize): string {
  return tw('gap', size);
}

export function bhGapX(size: BookingHubGapSize): string {
  return tw('gap-x', size);
}

export function bhGapY(size: BookingHubGapSize): string {
  return tw('gap-y', size);
}

export function bhPadding(size: BookingHubGapSize): string {
  return tw('p', size);
}

export function bhPaddingX(size: BookingHubGapSize): string {
  return tw('px', size);
}

export function bhPaddingY(size: BookingHubGapSize): string {
  return tw('py', size);
}

export function bhMargin(size: BookingHubGapSize): string {
  return tw('m', size);
}

export function bhMarginX(size: BookingHubGapSize): string {
  return tw('mx', size);
}

export function bhMarginY(size: BookingHubGapSize): string {
  return tw('my', size);
}

export function bhMarginTop(size: BookingHubGapSize): string {
  return tw('mt', size);
}
export function bhMarginBottom(size: BookingHubGapSize): string {
  return tw('mb', size);
}
export function bhMarginStart(size: BookingHubGapSize): string {
  return tw('ms', size);
}
export function bhMarginEnd(size: BookingHubGapSize): string {
  return tw('me', size);
}

export function bhWidth(size: BookingHubGapSize): string {
  return tw('w', size);
}

export function bhMinWidth(size: BookingHubGapSize): string {
  return tw('min-w', size);
}

export function bhMaxWidth(size: BookingHubGapSize): string {
  return tw('max-w', size);
}

export function bhHeight(size: BookingHubGapSize): string {
  return tw('h', size);
}

export function bhMinHeight(size: BookingHubGapSize): string {
  return tw('min-h', size);
}

export function bhMaxHeight(size: BookingHubGapSize): string {
  return tw('max-h', size);
}

export function bhSpaceX(size: BookingHubGapSize): string {
  return tw('space-x', size);
}

export function bhSpaceY(size: BookingHubGapSize): string {
  return tw('space-y', size);
}

export function bhInset(size: BookingHubGapSize): string {
  return tw('inset', size);
}

export function bhTop(size: BookingHubGapSize): string {
  return tw('top', size);
}
export function bhBottom(size: BookingHubGapSize): string {
  return tw('bottom', size);
}
export function bhLeft(size: BookingHubGapSize): string {
  return tw('left', size);
}
export function bhRight(size: BookingHubGapSize): string {
  return tw('right', size);
}

export function bhScrollMargin(size: BookingHubGapSize): string {
  return tw('scroll-m', size);
}

export function bhScrollPadding(size: BookingHubGapSize): string {
  return tw('scroll-p', size);
}

/** `max-w-bh-*` from Figma **Widths** */
export function bhMaxWidthContent(token: BookingHubWidthToken): string {
  return `max-w-bh-${token}`;
}

/** Readable body column — Figma **paragraph-max-width** */
export function bhParagraphMaxWidth(): string {
  return 'max-w-bh-paragraph';
}

export function bhSpacing(...parts: Array<string | undefined | false>): string {
  return cn(...parts);
}
