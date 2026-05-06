'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { BookingHubButtonSpinner } from './BookingHubButtonSpinner';
import {
  BH_BTN_FOCUS_RING_DESTRUCTIVE,
  BH_BTN_SHADOW_XS,
  BH_BTN_SKEUO_INSET,
} from './bookingHubButtonTokens';
import {
  bhButtonLoadingMinHeight,
  bhButtonPadding,
  bhButtonResponsiveInnerRowSecondary,
  bhButtonResponsivePadding,
  bhSecondaryButtonInnerRowClass,
  bhSecondaryDefaultFrame,
  bhPrimaryResponsiveFrame,
} from './bookingHubButtonSizes';
import type { BookingHubButtonBaseProps } from './bookingHubButtonTypes';

/**
 * **Secondary destructive** — Figma `Buttons/Button destructive`, Hierarchy **Secondary**, Icon only **False**
 * (`booking-hub-secondary-delete-button-states.md`). Same frames / padding / typography pipeline as
 * `BookingHubSecondaryButton`; colours and focus ring match error tokens.
 */
export const BookingHubSecondaryDeleteButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubSecondaryDeleteButton(
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
      ? bhPrimaryResponsiveFrame(fullWidth, busy, responsiveCompact, contentSized)
      : bhSecondaryDefaultFrame(size, fullWidth, busy);
    const innerRow = responsive ? bhButtonResponsiveInnerRowSecondary(loading) : bhSecondaryButtonInnerRowClass(size, loading);

    return (
      <button
        ref={ref}
        {...rest}
        type={type}
        disabled={Boolean(disabled || loading)}
        aria-busy={busy || undefined}
        className={cn(
          'box-border group relative select-none items-center justify-center overflow-clip rounded-[8px] outline-none transition-[border-color,box-shadow,background-color,color]',
          fullWidth ? 'flex w-full' : 'inline-flex',
          pad,
          frame,
          minH,
          grayDisabled &&
            cn(
              'cursor-not-allowed border border-solid border-[#e9eaeb] bg-white text-[#a4a7ae]',
              BH_BTN_SHADOW_XS,
              '[&_svg]:text-[#d5d7da]',
            ),
          !grayDisabled &&
            busy &&
            cn('cursor-wait border border-solid border-[#fda29b] text-[#d92d20]', BH_BTN_SHADOW_XS),
          !grayDisabled &&
            !busy &&
            cn(
              'cursor-pointer border border-solid border-[#fda29b] text-[#d92d20] group-hover:text-[#b42318]',
              BH_BTN_SHADOW_XS,
              BH_BTN_FOCUS_RING_DESTRUCTIVE,
              '[&_svg]:text-[#d92d20] group-hover:[&_svg]:text-[#b42318]',
              'focus-visible:border-[#fda29b]',
            ),
          className,
        )}
        onClick={onClick}
      >
        {!grayDisabled && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors',
              busy ? 'bg-[#fef3f2]' : 'bg-white group-hover:bg-[#fef3f2] group-active:bg-[#fef3f2]',
            )}
          />
        )}

        <span className={innerRow}>
          {busy ? (
            <>
              <BookingHubButtonSpinner className="text-[#f04438]" />
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

        {!grayDisabled && (
          <span aria-hidden className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', BH_BTN_SKEUO_INSET)} />
        )}
      </button>
    );
  },
);

BookingHubSecondaryDeleteButton.displayName = 'BookingHubSecondaryDeleteButton';
