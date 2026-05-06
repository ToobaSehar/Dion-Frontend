/**
 * Booking Hub modal — **stacked left-aligned** + **horizontal** (`_Modal header` / `_Modal actions`).
 *
 * **Stacked — desktop:** `4057:415360`, `4057:422202`, `4057:422286`.
 * **Stacked — mobile:** `4057:421981`, `4057:422230`, `4057:422258`.
 *
 * **Horizontal — desktop:** `4057:422034` (success), `4057:422355` (warning), `4057:422507` (destructive).
 * **Horizontal — mobile** (inner modal e.g. `4057:422100` under `4057:418819`): header column + actions column (primary, secondary, checkbox).
 *
 * Breakpoint: Tailwind **`md:` = 768px** (Figma tablet / desktop split in guidelines).
 */

export type BookingHubStackedModalVariant = 'success' | 'warning' | 'destructive';

export type BookingHubStackedModalLayout = 'stacked' | 'horizontal';

/** Panel — Figma `shadow-xl` stack on white card. */
export const BH_STACKED_MODAL_PANEL_SHADOW =
  'shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]' as const;

/** Decorative layer — desktop stacked/horizontal: `-120/-120`; mobile: `-128/-124`. */
export const BH_STACKED_MODAL_DECOR_DESKTOP = { leftPx: -120, topPx: -120 } as const;
export const BH_STACKED_MODAL_DECOR_MOBILE = { leftPx: -128, topPx: -124 } as const;

/** Horizontal desktop footer: inset aligns actions with title column past 48px icon + 16px gap (`24+48+16`). */
export const BH_HORIZONTAL_MODAL_FOOTER_INSET_LEFT = '88px' as const;

/** Featured icon 48×48 — fill + **8px** outer ring (Figma). */
export const BH_STACKED_MODAL_FEATURED_ICON: Record<
  BookingHubStackedModalVariant,
  { fill: string; ring: string; radialDecor: string }
> = {
  success: {
    fill: '#DCFAE6',
    ring: '#ECFDF3',
    radialDecor: 'rgba(7, 148, 85, 0.14)',
  },
  warning: {
    fill: '#FEF0C7',
    ring: '#FFFAEB',
    radialDecor: 'rgba(220, 104, 3, 0.16)',
  },
  destructive: {
    fill: '#FEE4E2',
    ring: '#FEF3F2',
    radialDecor: 'rgba(217, 45, 32, 0.14)',
  },
};
