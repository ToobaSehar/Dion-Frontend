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
  bhButtonInnerRowClass,
  bhButtonLoadingMinHeight,
  bhButtonPadding,
  bhButtonResponsiveInnerRowPrimary,
  bhButtonResponsivePadding,
  bhPrimaryDefaultFrame,
  bhPrimaryResponsiveFrame,
} from './bookingHubButtonSizes';
import type { BookingHubButtonBaseProps } from './bookingHubButtonTypes';

/**
 * **Primary destructive** — Figma `Buttons/Button destructive`, Hierarchy **Primary**, Icon only **False**:
 * Default `3287:428583`, Hover `3287:428751`, Focused `3287:428695`, Disabled `3287:428639`, Loading xl `10251:215343`.
 * Same frames / padding / responsive pipeline as `BookingHubPrimaryButton`; fills **Error/600** `#d92d20` / **Error/700** `#b42318`;
 * focus **Error/500** ring (`BH_BTN_FOCUS_RING_DESTRUCTIVE`) + **Error/600** border; loading fill **Error/700**; disabled matches Primary gray chrome.
 */
export const BookingHubPrimaryDeleteButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubPrimaryDeleteButton(
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
    const primaryFrame = responsive
      ? bhPrimaryResponsiveFrame(fullWidth, busy, responsiveCompact, contentSized)
      : bhPrimaryDefaultFrame(size, fullWidth, busy);
    const innerRow = responsive ? bhButtonResponsiveInnerRowPrimary(loading) : bhButtonInnerRowClass(size, loading);

    return (
      <button
        ref={ref}
        {...rest}
        type={type}
        disabled={Boolean(disabled || loading)}
        aria-busy={busy || undefined}
        className={cn(
          'box-border group relative select-none items-center justify-center overflow-clip rounded-lg font-avenir-regular outline-none transition-shadow',
          fullWidth ? 'flex w-full' : 'inline-flex',
          pad,
          primaryFrame,
          minH,
          grayDisabled &&
            cn(
              'cursor-not-allowed border-2 border-solid border-[#e9eaeb] bg-[#f5f5f5] text-[#a4a7ae]',
              BH_BTN_SHADOW_XS,
              '[&_svg]:text-[#d5d7da]',
            ),
          !grayDisabled &&
            cn(
              busy ? 'cursor-wait' : 'cursor-pointer',
              'border-2 border-solid border-[rgba(255,255,255,0.12)] text-white',
              BH_BTN_SHADOW_XS,
              BH_BTN_FOCUS_RING_DESTRUCTIVE,
              'focus-visible:border focus-visible:border-solid focus-visible:border-[#d92d20]',
              '[&_svg]:text-white',
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
              busy ? 'bg-[#b42318]' : 'bg-[#d92d20] group-hover:bg-[#b42318] group-active:bg-[#b42318]',
            )}
          />
        )}

        <span className={innerRow}>
          {busy ? (
            <>
              <BookingHubButtonSpinner className="text-white" />
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

        {!grayDisabled && <span aria-hidden className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', BH_BTN_SKEUO_INSET)} />}
      </button>
    );
  },
);

BookingHubPrimaryDeleteButton.displayName = 'BookingHubPrimaryDeleteButton';
