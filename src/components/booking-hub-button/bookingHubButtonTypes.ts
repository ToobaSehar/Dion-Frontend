import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Figma: **Buttons/Button** matrix — frame `16638:46333` in
 * `dRB94UmUgc4cgLjWc3NvPo` (Primary / Secondary / Tertiary × sm–xl × states).
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=16638-46333
 */
export type BookingHubButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Hub primary/secondary props. **`className`** is merged last — use it to override default Figma frame/padding
 * on a specific screen; defaults live in `bookingHubButtonFrameTokens`.
 */
export type BookingHubButtonBaseProps = {
  size?: BookingHubButtonSize;
  /**
   * Use CSS breakpoints (`md`/`lg`/`xl`) for padding, min frame, gap, and label typography instead of a fixed `size`.
   * Avoids layout shift from JS viewport detection (SSR + hydration). Ignores `size` for layout when `true`.
   */
  responsive?: boolean;
  /**
   * With **`responsive`**, cap **min-height** at the **md** frame (**40px**) from `md` and up — skips **lg/xl** 44/48px steps.
   * Partner flows use this so laptop/desktop CTAs stay aligned with discrete **`size="md"`** visual weight.
   */
  responsiveCompact?: boolean;
  /**
   * With **`responsive`**, skip Figma default **min-width** steps — width follows label + padding (`w-fit`).
   * Use for short labels (e.g. “Edit”) where a wide minimum frame looks wrong.
   */
  contentSized?: boolean;
  /** Shows spinner and optional loading copy; disables the control. */
  loading?: boolean;
  loadingText?: string;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  fullWidth?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode;
};
