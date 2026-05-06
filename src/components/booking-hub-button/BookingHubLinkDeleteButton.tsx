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
 * **Link delete** — Figma `Buttons/Button destructive`, Hierarchy **Link**, Icon only **False** (canonical file `dRB94UmUgc4cgLjWc3NvPo`; parity with `O5tre8Es58GIWIkr7LZhZk` node **`3287:428607`** when accessible):
 * Default `3287:428607`, Hover `3287:428775`, Focused `3287:428719`, Disabled `3287:428663`, Loading xl `10251:215489`.
 * **No fill** default/hover/focus/loading. Label **Error/600** `#d92d20`, icons **Error/500** `#f04438`; hover **Error/700** `#b42318` label/icons (no underline in Figma MCP output for Hover);
 * focus **transparent** + **Error/500** ring (`BH_BTN_FOCUS_RING_TERTIARY_DESTRUCTIVE`) + **4px** radius slot; disabled **Gray/400** `#a4a7ae`.
 */
export const BookingHubLinkDeleteButton = forwardRef<HTMLButtonElement, BookingHubButtonBaseProps>(
  function BookingHubLinkDeleteButton(
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
              BH_BTN_FOCUS_RING_TERTIARY_DESTRUCTIVE,
            ),
          !grayDisabled &&
            !busy &&
            cn(
              'text-[#d92d20] [&_svg]:text-[#f04438]',
              'hover:bg-transparent hover:text-[#b42318] hover:[&_svg]:text-[#b42318]',
              'focus-visible:text-[#d92d20] focus-visible:no-underline focus-visible:[&_svg]:text-[#f04438]',
            ),
          !grayDisabled && busy && 'bg-transparent text-[#d92d20] [&_svg]:text-[#d92d20]',
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

BookingHubLinkDeleteButton.displayName = 'BookingHubLinkDeleteButton';
