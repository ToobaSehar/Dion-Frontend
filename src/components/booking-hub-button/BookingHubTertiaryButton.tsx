'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { BookingHubButtonSpinner } from './BookingHubButtonSpinner';
import { BH_BTN_FOCUS_RING_TERTIARY } from './bookingHubButtonTokens';
import {
  bhButtonLoadingMinHeight,
  bhButtonMinHeightMatchInputField,
  bhButtonPadding,
  bhButtonResponsiveInnerRowSecondary,
  bhButtonResponsivePadding,
  bhPrimaryDefaultFrame,
  bhSecondaryButtonInnerRowClass,
  bhTertiaryResponsiveOuterFrame,
} from './bookingHubButtonSizes';
import type { BookingHubButtonBaseProps } from './bookingHubButtonTypes';

/**
 * **Tertiary** — Figma `Buttons/Button` tertiary column (`16638:46333`); instance e.g. xl + label + icons `16641:107347`.
 * Ghost: transparent fill, **Gray/600** `#535862` label (Text md/Semibold at xl), **Gray/400** icons, **8px** radius,
 * responsive padding ladder matches Primary/Secondary; hover **Gray/50** `#fafafa` + **Gray/700** `#414651`;
 * focus **ring only** (`BH_BTN_FOCUS_RING_TERTIARY`); loading uses neutral surface + same min-width ladder as primary when not `fullWidth`.
 *
 * @see `src/design-system/booking-hub-figma/specs/booking-hub-tertiary-button-figma-mcp-pull.md`
 */
export const BookingHubTertiaryButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubTertiaryButton(
    {
      size = 'md',
      responsive = false,
      responsiveCompact = false,
      contentSized = false,
      loading = false,
      loadingText = 'Submitting...',
      iconLeading,
      iconTrailing,
      fullWidth,
      className,
      children,
      disabled,
      type = 'button',
      onClick,
      ...rest
    },
    ref,
  ) {
    const grayDisabled = Boolean(disabled && !loading);
    const busy = Boolean(loading);
    const pad = responsive ? bhButtonResponsivePadding() : bhButtonPadding(size);
    const minH = bhButtonLoadingMinHeight(size, loading);
    const frame = responsive
      ? bhTertiaryResponsiveOuterFrame(fullWidth, busy, responsiveCompact, contentSized)
      : cn(
          fullWidth && cn(bhPrimaryDefaultFrame(size, true, false), 'w-full'),
          !fullWidth && busy && bhPrimaryDefaultFrame(size, false, true),
          !fullWidth && !busy && contentSized && cn(bhButtonMinHeightMatchInputField(size), 'min-w-0 w-fit shrink-0'),
          !fullWidth && !busy && !contentSized && bhButtonMinHeightMatchInputField(size),
        );
    const innerRow = responsive
      ? bhButtonResponsiveInnerRowSecondary(loading)
      : bhSecondaryButtonInnerRowClass(size, loading);

    return (
      <button
        ref={ref}
        {...rest}
        type={type}
        disabled={Boolean(disabled || loading)}
        aria-busy={busy || undefined}
        className={cn(
          'box-border group relative select-none items-center justify-center overflow-clip rounded-[8px] border border-transparent font-avenir-regular outline-none transition-[background-color,box-shadow,color,border-color]',
          fullWidth ? 'flex w-full' : 'inline-flex',
          pad,
          frame,
          minH,
          grayDisabled && 'cursor-not-allowed text-[#a4a7ae] [&_svg]:text-[#a4a7ae]',
          !grayDisabled &&
            cn(
              busy ? 'cursor-wait' : 'cursor-pointer',
              BH_BTN_FOCUS_RING_TERTIARY,
              'focus-visible:bg-white',
            ),
          !grayDisabled &&
            !busy &&
            'bg-transparent text-[#535862] [&_svg]:text-[#a4a7ae] hover:bg-[#fafafa] hover:text-[#414651] focus-visible:text-[#535862] hover:[&_svg]:text-[#414651] focus-visible:[&_svg]:text-[#a4a7ae]',
          !grayDisabled && busy && 'bg-[#fafafa] text-[#535862] [&_svg]:text-[#535862]',
          className,
        )}
        onClick={onClick}
      >
        <span className={innerRow}>
          {busy ? (
            <>
              <BookingHubButtonSpinner className="text-[#535862]" />
              <span className="px-0.5 whitespace-nowrap">{loadingText}</span>
            </>
          ) : (
            <>
              {iconLeading ? (
                <span className="inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">{iconLeading}</span>
              ) : null}
              {children ? <span className="px-0.5 whitespace-nowrap">{children}</span> : null}
              {iconTrailing ? (
                <span className="inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">{iconTrailing}</span>
              ) : null}
            </>
          )}
        </span>
      </button>
    );
  },
);

BookingHubTertiaryButton.displayName = 'BookingHubTertiaryButton';
