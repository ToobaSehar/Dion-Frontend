'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { BookingHubButtonSpinner } from './BookingHubButtonSpinner';
import { BH_BTN_FOCUS_RING_TERTIARY_DESTRUCTIVE } from './bookingHubButtonTokens';
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
 * **Tertiary destructive** — Figma `Buttons/Button destructive`, Hierarchy **Tertiary**, Icon only **False**:
 * Default `3287:428623`, Hover `3287:428791`, Focused `3287:428735`, Disabled `3287:428679`, Loading xl `10251:215353`.
 * Same frames / padding / responsive pipeline as `BookingHubTertiaryButton`; label **Error/600** `#d92d20`, icons **Error/500** `#f04438`;
 * hover **Error/50** `#fef3f2` + **Error/700** `#b42318`; focus **white** fill + **Error/500** ring (`BH_BTN_FOCUS_RING_TERTIARY_DESTRUCTIVE`);
 * loading **Error/50** surface + **Error/600** label/spinner.
 */
export const BookingHubTertiaryDeleteButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubTertiaryDeleteButton(
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
              BH_BTN_FOCUS_RING_TERTIARY_DESTRUCTIVE,
              'focus-visible:bg-white',
            ),
          !grayDisabled &&
            !busy &&
            cn(
              'bg-transparent text-[#d92d20] [&_svg]:text-[#f04438]',
              'hover:bg-[#fef3f2] hover:text-[#b42318] hover:[&_svg]:text-[#b42318]',
              'focus-visible:text-[#d92d20] focus-visible:[&_svg]:text-[#f04438]',
            ),
          !grayDisabled && busy && 'bg-[#fef3f2] text-[#d92d20] [&_svg]:text-[#d92d20]',
          className,
        )}
        onClick={onClick}
      >
        <span className={innerRow}>
          {busy ? (
            <>
              <BookingHubButtonSpinner className="text-[#d92d20]" />
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

BookingHubTertiaryDeleteButton.displayName = 'BookingHubTertiaryDeleteButton';
