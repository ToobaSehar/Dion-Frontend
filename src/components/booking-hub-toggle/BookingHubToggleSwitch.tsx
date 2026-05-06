'use client';

import { forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  BH_TOGGLE_FOCUS_RING,
  BH_TOGGLE_THUMB_DISABLED,
  BH_TOGGLE_THUMB_SHADOW,
  BH_TOGGLE_TRACK_NEUTRAL,
} from './bookingHubToggleTokens';

export type BookingHubToggleSize = 'sm' | 'md';

export type BookingHubToggleSwitchProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'type' | 'role' | 'aria-checked' | 'onClick'
> & {
  /** Controlled on/off state (`Pressed` in Figma). */
  checked: boolean;
  /** Called with the next value when the user activates the switch (not fired when `disabled`). */
  onCheckedChange?: (next: boolean) => void;
  /** `sm`: 36×20 track, 16px thumb · `md`: 44×24 track, 20px thumb */
  size?: BookingHubToggleSize;
  /**
   * **sm** track/thumb below Tailwind `sm`, **md** from `sm` and up — matches Figma density tiers on responsive layouts.
   * When set, `size` is ignored.
   */
  responsive?: boolean;
};

const trackClass: Record<BookingHubToggleSize, string> = {
  sm: 'h-5 w-9 min-h-5 min-w-9',
  md: 'h-6 w-11 min-h-6 min-w-11',
};

const thumbClass: Record<BookingHubToggleSize, string> = {
  sm: 'size-4 min-h-4 min-w-4',
  md: 'size-5 min-h-5 min-w-5',
};

/** Mobile-first: compact switch, larger touch target from `sm` breakpoint. */
const TRACK_RESPONSIVE = 'h-5 w-9 min-h-5 min-w-9 sm:h-6 sm:w-11 sm:min-h-6 sm:min-w-11';
const THUMB_RESPONSIVE = 'size-4 min-h-4 min-w-4 sm:size-5 sm:min-h-5 sm:min-w-5';

/**
 * Toggle **without** label — Figma `Text=false`, sizes **sm** / **md**, states default / hover / focus / disabled.
 */
export const BookingHubToggleSwitch = forwardRef<HTMLButtonElement, BookingHubToggleSwitchProps>(
  function BookingHubToggleSwitch(
    {
      className,
      checked,
      onCheckedChange,
      disabled,
      size = 'sm',
      responsive = false,
      id,
      ...rest
    },
    ref,
  ) {
    const handleClick = useCallback(() => {
      if (disabled) return;
      onCheckedChange?.(!checked);
    }, [checked, disabled, onCheckedChange]);

    const enabledOn = Boolean(!disabled && checked);
    const enabledOff = Boolean(!disabled && !checked);

    return (
      <button
        ref={ref}
        {...rest}
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'box-border inline-flex shrink-0 items-center rounded-xl p-0.5 transition-colors duration-200 ease-in-out',
          'outline-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          checked ? 'justify-end' : 'justify-start',
          responsive ? TRACK_RESPONSIVE : trackClass[size],
          enabledOff && BH_TOGGLE_TRACK_NEUTRAL,
          enabledOn && 'bg-booking-teal hover:bg-[#008884]',
          disabled && BH_TOGGLE_TRACK_NEUTRAL,
          !disabled && cn('focus-visible:outline-none', BH_TOGGLE_FOCUS_RING),
          disabled && 'focus-visible:shadow-none',
          className,
        )}
      >
        <span
          aria-hidden
          className={cn(
            'pointer-events-none shrink-0 rounded-full transition-[background-color] duration-200 ease-in-out',
            responsive ? THUMB_RESPONSIVE : thumbClass[size],
            BH_TOGGLE_THUMB_SHADOW,
            disabled ? BH_TOGGLE_THUMB_DISABLED : 'bg-white',
          )}
        />
      </button>
    );
  },
);
