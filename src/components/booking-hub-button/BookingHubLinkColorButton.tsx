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
 * **Link color** — Figma `Buttons/Button` hierarchy **Link color** (xl + icon `False`):
 * Default `3287:428595`, Hover `3287:428763`, Focused `3287:428707`, Disabled `3287:428651`.
 * **No fill** on default/hover/focus/loading. Default: label **Brand/700** `#008884`, icons **Brand/500** `#00CBC5`.
 * Hover: **Brand/800** `#005A57` + **underline**, icons **Brand/600** `#00BAB5`. Focus: ring (`BH_BTN_FOCUS_RING_TERTIARY`) + **4px** radius on focus slot, default label/icon colors, no underline.
 *
 * @see `src/design-system/booking-hub-figma/specs/booking-hub-link-gray-link-color-buttons-figma-mcp-pull.md`
 */
export const BookingHubLinkColorButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubLinkColorButton(
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
          'box-border group relative select-none items-center justify-center overflow-clip rounded-[8px] border border-transparent bg-transparent font-avenir-regular outline-none transition-[box-shadow,color,text-decoration-color]',
          fullWidth ? 'flex w-full' : 'inline-flex',
          pad,
          frame,
          minH,
          grayDisabled && 'cursor-not-allowed text-[#a4a7ae] [&_svg]:text-[#a4a7ae]',
          !grayDisabled &&
            cn(
              busy ? 'cursor-wait' : 'cursor-pointer',
              'focus-visible:rounded-[4px]',
              BH_BTN_FOCUS_RING_TERTIARY,
            ),
          !grayDisabled &&
            !busy &&
            cn(
              'text-[#008884] [&_svg]:text-[#00cbc5]',
              'hover:bg-transparent hover:text-[#005a57] hover:underline hover:decoration-solid hover:[&_svg]:text-booking-teal',
              'focus-visible:text-[#008884] focus-visible:no-underline focus-visible:[&_svg]:text-[#00cbc5]',
            ),
          !grayDisabled && busy && 'bg-transparent text-[#008884] [&_svg]:text-[#008884]',
          className,
        )}
        onClick={onClick}
      >
        <span className={innerRow}>
          {busy ? (
            <>
              <BookingHubButtonSpinner className="text-[#008884]" />
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

BookingHubLinkColorButton.displayName = 'BookingHubLinkColorButton';
