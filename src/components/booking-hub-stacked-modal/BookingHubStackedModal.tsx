'use client';

import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { CheckCircle2, Save, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { bhRounded } from '@/components/booking-hub-radius/bookingHubRadius';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button/BookingHubPrimaryButton';
import { BookingHubPrimaryDeleteButton } from '@/components/booking-hub-button/BookingHubPrimaryDeleteButton';
import { BookingHubSecondaryButton } from '@/components/booking-hub-button/BookingHubSecondaryButton';
import {
  BH_STACKED_MODAL_FEATURED_ICON,
  BH_STACKED_MODAL_PANEL_SHADOW,
  type BookingHubStackedModalLayout,
  type BookingHubStackedModalVariant,
} from './bookingHubStackedModalTokens';

export type BookingHubStackedModalAction = {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export type BookingHubStackedModalDismissCheckbox = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Figma default: “Don’t show again”. */
  label?: string;
};

export type BookingHubStackedModalProps = {
  open: boolean;
  onClose: () => void;
  variant: BookingHubStackedModalVariant;
  /**
   * **stacked** — `_Modal header` left column + horizontal-fill or stacked actions (see stacked Figma).
   * **horizontal** — desktop `4057:422034` / `422355` / `422507`; mobile inner `4057:422100` pattern.
   */
  layout?: BookingHubStackedModalLayout;
  title: string;
  description: string;
  secondaryAction: BookingHubStackedModalAction;
  primaryAction: BookingHubStackedModalAction;
  /** Figma `_Modal actions` “Don’t show again” row — **horizontal** layout only. */
  dismissCheckbox?: BookingHubStackedModalDismissCheckbox;
  showDecorativePattern?: boolean;
  showCloseButton?: boolean;
  className?: string;
  headerExtra?: ReactNode;
};

function FeaturedGlyph({ variant }: { variant: BookingHubStackedModalVariant }) {
  const cls = 'size-6 shrink-0 text-[#079455]';
  if (variant === 'success') {
    return <CheckCircle2 className={cls} strokeWidth={2} aria-hidden />;
  }
  if (variant === 'warning') {
    return <Save className="size-6 shrink-0 text-[#DC6803]" strokeWidth={2} aria-hidden />;
  }
  return <Trash2 className="size-6 shrink-0 text-[#D92D20]" strokeWidth={2} aria-hidden />;
}

/**
 * Figma **stacked** + **horizontal** modal variants (`md:` = 768px).
 */
export function BookingHubStackedModal({
  open,
  onClose,
  variant,
  layout = 'stacked',
  title,
  description,
  secondaryAction,
  primaryAction,
  dismissCheckbox,
  showDecorativePattern = true,
  showCloseButton = true,
  className,
  headerExtra,
}: BookingHubStackedModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const checkboxId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const tone = BH_STACKED_MODAL_FEATURED_ICON[variant];
  const isHorizontal = layout === 'horizontal';
  const checkboxLabel = dismissCheckbox?.label ?? "Don't show again";

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onKeyDown]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-bh-modal-actions] button')?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const renderPrimary = (fullWidth: boolean, className?: string) =>
    variant === 'destructive' ? (
      <BookingHubPrimaryDeleteButton
        type="button"
        size="lg"
        fullWidth={fullWidth}
        className={className}
        loading={primaryAction.loading}
        disabled={primaryAction.disabled}
        onClick={primaryAction.onClick}
      >
        {primaryAction.label}
      </BookingHubPrimaryDeleteButton>
    ) : (
      <BookingHubPrimaryButton
        type="button"
        size="lg"
        fullWidth={fullWidth}
        className={className}
        loading={primaryAction.loading}
        disabled={primaryAction.disabled}
        onClick={primaryAction.onClick}
      >
        {primaryAction.label}
      </BookingHubPrimaryButton>
    );

  const renderSecondary = (fullWidth: boolean, className?: string) => (
    <BookingHubSecondaryButton
      type="button"
      size="lg"
      fullWidth={fullWidth}
      className={className}
      loading={secondaryAction.loading}
      disabled={secondaryAction.disabled}
      onClick={secondaryAction.onClick}
    >
      {secondaryAction.label}
    </BookingHubSecondaryButton>
  );

  const checkboxRow =
    dismissCheckbox && isHorizontal ? (
      <div className="flex shrink-0 items-start gap-2">
        <input
          id={checkboxId}
          type="checkbox"
          checked={dismissCheckbox.checked}
          onChange={(e) => dismissCheckbox.onCheckedChange(e.target.checked)}
          className={cn(
            'mt-0.5 size-4 shrink-0 cursor-pointer rounded border border-[#D5D7DA] bg-white text-booking-teal',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-booking-teal',
          )}
        />
        <label htmlFor={checkboxId} className="cursor-pointer select-none text-sm font-medium leading-5 text-[#414651]">
          {checkboxLabel}
        </label>
      </div>
    ) : null;

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          'relative flex w-full max-w-[400px] flex-col items-center overflow-clip bg-white',
          bhRounded('2xl'),
          BH_STACKED_MODAL_PANEL_SHADOW,
          className,
        )}
      >
        {showDecorativePattern ? (
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-128px] top-[-124px] size-[336px] md:left-[-120px] md:top-[-120px]"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${tone.radialDecor} 0%, transparent 52%)`,
            }}
          />
        ) : null}

        <div className="relative flex w-full shrink-0 flex-col items-center">
          <div
            className={cn(
              'flex w-full items-start px-4 pt-5',
              isHorizontal
                ? 'flex-col gap-3 md:flex-row md:gap-4 md:px-6 md:pt-6'
                : 'flex-col gap-3 md:gap-4 md:px-6 md:pt-6',
            )}
          >
            <div
              className="relative box-border size-12 shrink-0 rounded-[28px] border-[8px] border-solid"
              style={{ backgroundColor: tone.fill, borderColor: tone.ring }}
            >
              <div className="absolute left-2 top-2 flex size-6 items-center justify-center">
                <FeaturedGlyph variant={variant} />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 items-start not-italic">
              <p
                id={titleId}
                className="w-full font-avenir-regular text-base font-semibold leading-6 text-booking-dark"
              >
                {title}
              </p>
              <p id={descriptionId} className="w-full font-avenir-regular text-sm font-normal leading-5 text-[#535862]">
                {description}
              </p>
              {headerExtra}
            </div>
          </div>

          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'absolute flex size-11 items-center justify-center overflow-clip p-2 outline-none transition-colors hover:bg-gray-100',
                bhRounded('md'),
                isHorizontal ? 'right-3 top-3' : 'right-3 top-3 md:right-4 md:top-4',
              )}
              aria-label="Close"
            >
              <X className="size-6 text-[#A4A7AE]" strokeWidth={2} aria-hidden />
            </button>
          ) : null}
        </div>

        {isHorizontal ? (
          <>
            {/* Mobile horizontal — Figma inner `4057:422100`: primary, secondary, optional checkbox */}
            <div className="relative flex w-full flex-col items-start pt-6 md:hidden">
              <div className="flex w-full flex-col gap-3 px-4 pb-4" data-bh-modal-actions>
                {renderPrimary(true, 'w-full min-w-0')}
                {renderSecondary(true, 'w-full min-w-0')}
                {checkboxRow ? <div className="flex w-full items-start gap-3">{checkboxRow}</div> : null}
              </div>
            </div>
            {/* Desktop horizontal — Figma `4057:422034` / `422355` / `422507` */}
            <div className="relative hidden w-full flex-col items-start pt-8 md:flex">
              <div
                className={cn(
                  'flex w-full flex-row items-center gap-3 pb-6 pr-6 pt-0',
                  dismissCheckbox ? 'pl-[88px]' : 'justify-end px-6',
                )}
                data-bh-modal-actions
              >
                {checkboxRow}
                <div className="flex min-w-0 flex-1 justify-end gap-3">
                  {renderSecondary(false, 'shrink-0')}
                  {renderPrimary(false, 'shrink-0')}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex w-full flex-col items-start pt-6 md:pt-8">
            <div
              className="flex w-full flex-col-reverse gap-3 px-4 pb-4 md:flex-row md:px-6 md:pb-6"
              data-bh-modal-actions
            >
              {renderSecondary(true, 'w-full min-w-0 md:flex-1')}
              {renderPrimary(true, 'w-full min-w-0 md:flex-1')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
