'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { BookingHubButtonSpinner } from './BookingHubButtonSpinner';
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

/** Same outer `shadow-xs` as `BookingHubInputField` `shellShadowXs`. */
const BH_INPUT_SHELL_SHADOW_XS = 'shadow-[0px_1px_2px_rgba(16,24,40,0.05)]';

/**
 * **Secondary** — Figma `Buttons/Button` **Secondary** (Icon only False): Default + Hover + Focused + Disabled + Loading
 * (`booking-hub-secondary-button-default-figma-mcp-pull.md`,
 * `booking-hub-secondary-button-states-hover-focused-disabled-loading.md`).
 */
export const BookingHubSecondaryButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubSecondaryButton(
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
          'box-border group relative select-none items-center justify-center overflow-clip rounded-[8px] outline-none transition-[border-color,box-shadow,background-color]',
          fullWidth ? 'flex w-full' : 'inline-flex',
          pad,
          frame,
          minH,
          grayDisabled &&
            cn(
              'cursor-not-allowed border border-solid border-gray-300 bg-[#fafafa] text-[#a4a7ae]',
              BH_INPUT_SHELL_SHADOW_XS,
              '[&_svg]:text-[#d5d7da]',
            ),
          !grayDisabled &&
            busy &&
            cn(
              'cursor-wait border border-solid border-[#d5d7da] text-[#414651] [&_svg]:text-[#414651]',
              BH_INPUT_SHELL_SHADOW_XS,
            ),
          !grayDisabled &&
            !busy &&
            cn(
              'cursor-pointer border border-solid border-[#d5d7da] text-[#414651] [&_svg]:text-[#a4a7ae]',
              BH_INPUT_SHELL_SHADOW_XS,
              'transition-[color,box-shadow,background-color]',
            ),
          className,
        )}
        onClick={onClick}
      >
        {!grayDisabled && (
          <span
            aria-hidden
            className={cn(
              'absolute inset-0 rounded-[8px] transition-colors',
              busy ? 'bg-[#fafafa]' : 'bg-white group-hover:bg-[#d5d7da] group-focus-visible:bg-white',
            )}
          />
        )}

        <span className={innerRow}>
          {busy ? (
            <>
              <BookingHubButtonSpinner className="text-[#414651]" />
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

BookingHubSecondaryButton.displayName = 'BookingHubSecondaryButton';
