'use client';

import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  BookingHubToggleSwitch,
  type BookingHubToggleSize,
  type BookingHubToggleSwitchProps,
} from './BookingHubToggleSwitch';

export type BookingHubToggleWithLabelProps = Omit<
  BookingHubToggleSwitchProps,
  'aria-labelledby' | 'aria-describedby' | 'className'
> & {
  /** Primary line — Figma **Text md/sm · Medium** `#414651`. */
  label: ReactNode;
  /** Second line — Figma **Regular** `#535862`; omit for label-only row. */
  supportingText?: ReactNode;
  /** Applied to the outer flex row (toggle + copy). */
  className?: string;
  /** Optional classes on the switch control only. */
  switchClassName?: string;
};

const labelTypography: Record<BookingHubToggleSize, string> = {
  sm: 'text-sm font-medium leading-5 text-[#414651]',
  md: 'text-base font-medium leading-6 text-[#414651]',
};

const supportingTypography: Record<BookingHubToggleSize, string> = {
  sm: 'text-sm font-normal leading-5 text-[#535862]',
  md: 'text-base font-normal leading-6 text-[#535862]',
};

/**
 * Toggle **with** label (+ optional supporting copy) — Figma `Text=true`.
 * Gap: **8px** (`sm`) / **12px** (`md`) between track and text; label/helper gap **2px**.
 */
export function BookingHubToggleWithLabel({
  className,
  switchClassName,
  label,
  supportingText,
  size = 'sm',
  ...switchProps
}: BookingHubToggleWithLabelProps) {
  const uid = useId();
  const labelId = `bh-toggle-label-${uid}`;
  const supportingId = `bh-toggle-support-${uid}`;

  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-start',
        size === 'md' ? 'gap-3' : 'gap-2',
        className,
      )}
    >
      <BookingHubToggleSwitch
        {...switchProps}
        size={size}
        className={cn('mt-px shrink-0', switchClassName)}
        aria-labelledby={labelId}
        aria-describedby={supportingText ? supportingId : undefined}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p id={labelId} className={cn('font-avenir-regular', labelTypography[size])}>
          {label}
        </p>
        {supportingText ? (
          <p id={supportingId} className={cn('font-avenir-regular', supportingTypography[size])}>
            {supportingText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
