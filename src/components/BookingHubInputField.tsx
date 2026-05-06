'use client';

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BH_INPUT_FIELD_ERROR_MESSAGE,
  BH_INPUT_FIELD_HINT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_LABEL_ROW,
  BH_INPUT_FIELD_PLACEHOLDER_TEXT,
  BH_INPUT_FIELD_PREFIX,
  BH_INPUT_FIELD_REQUIRED_DEFAULT,
  BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE,
  BH_INPUT_FIELD_STACK_GAP,
  BH_INPUT_FIELD_VALUE,
} from '@/components/bookingHubInputFieldTypography';
import { BH_RESPONSIVE_CONTROL_MIN_H } from '@/components/bookingHubControlHeight';
import { bhButtonResponsivePadding } from '@/components/booking-hub-button/bookingHubButtonSizes';

/**
 * Booking Hub input field aligned with Figma file `dRB94UmUgc4cgLjWc3NvPo`:
 * - Frame `1090:57817` (Input field): https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/…?node-id=1090-57817
 * - Typography centralized in `bookingHubInputFieldTypography.ts` (Figma Text styles → Inter).
 */

export type BookingHubInputFieldSize = 'sm' | 'md';
export type BookingHubInputFieldVariant = 'default' | 'destructive';

export type BookingHubInputFieldProps = {
  /** When true, renders `<textarea>` instead of `<input>` (ref targets textarea). */
  multiline?: boolean;
  rows?: number;
  /** Passed to the native `<input>` (e.g. text, email, tel, password). Ignored when `multiline`. */
  type?: React.HTMLInputTypeAttribute;
  label?: React.ReactNode;
  placeholder?: string;
  helperText?: string;
  /** When set, shows destructive/error styling and message below the field. */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  /** Static leading content inside the field (e.g. `http://`). Rendered after `icon`. */
  prefix?: React.ReactNode;
  /** Static trailing content inside the field (e.g. currency code). Rendered before error/help icons. */
  suffix?: React.ReactNode;
  /** Leading visual (e.g. mail icon). Typically 20×20; use `text-[#A4A7AE]` on icons. */
  icon?: React.ReactNode;
  /**
   * Custom focusable control inside the shell (e.g. date `<button>`, Radix select trigger).
   * When set, no native `<input>` / `<textarea>` is rendered; focus chrome uses `focus-within` on the shell.
   */
  control?: React.ReactNode;
  /** Reserved for parity with Figma destructive column; combined with `error` for full error chrome. */
  variant?: BookingHubInputFieldVariant;
  size?: BookingHubInputFieldSize;
  className?: string;
  /** Wrapper around label+control+hint only */
  fieldClassName?: string;
  inputClassName?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'prefix' | 'suffix' | 'children'
>;

export const BookingHubInputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, BookingHubInputFieldProps>(
  function BookingHubInputField(
    {
      multiline = false,
      rows = 4,
      type = 'text',
      label,
      placeholder,
      helperText,
      error,
      disabled,
      required,
      prefix,
      suffix,
      icon,
      control,
      variant = 'default',
      size = 'md',
      className,
      fieldClassName,
      inputClassName,
      id,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref,
  ) {
    const hasError = Boolean(error);
    const destructive = variant === 'destructive' || hasError;
    const useControl = control != null;

    /** Same responsive padding as hub Primary/Secondary (`bhButtonResponsivePadding`). */
    const pad = bhButtonResponsivePadding();

    /** Single-line / control slot: same responsive min-heights as hub Primary/Secondary (`BH_RESPONSIVE_CONTROL_MIN_H`). */
    const shellMinH =
      multiline && !useControl ? null : BH_RESPONSIVE_CONTROL_MIN_H;

    /** Figma: Shadows/shadow-xs */
    const shellShadowXs = 'shadow-[0px_1px_2px_rgba(16,24,40,0.05)]';

    const shellClass = cn(
      'box-border flex w-full flex-row justify-start gap-1 rounded-[8px] transition-[border-color,box-shadow,background-color] lg:gap-1.5',
      /** `stretch` so every control (email, password, suffix) shares the same row height as responsive `min-h` (password/text intrinsic heights differ under forms UA). */
      multiline && !useControl ? 'items-start' : 'items-stretch',
      /* Figma “Clip content” on single-line / control shells only — not on multiline textarea */
      (useControl || !multiline) && 'overflow-hidden',
      pad,
      shellMinH,
      disabled &&
        cn(
          'cursor-not-allowed border border-solid border-gray-300 bg-[#fafafa]',
          shellShadowXs,
        ),
      !disabled &&
        destructive &&
        cn('border border-solid border-[#fda29b] bg-white', shellShadowXs),
      !disabled &&
        !destructive &&
        cn('border border-solid border-[#d5d7da] bg-white', shellShadowXs),
      !disabled &&
        'focus-within:border focus-within:border-solid focus-within:border-[#00cbc5] focus-within:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
    );

    // Kill @tailwindcss/forms base `[type=*]:focus` / `textarea:focus` ring (blue.600) — Figma focus is only on the outer shell.
    // `bh-hub-input-native` — globals.css WebKit autofill overrides (Chrome/Safari lavender tint).
    const inputTextClass = cn(
      'bh-hub-input-native min-w-0 flex-1 border-0 bg-transparent p-0',
      BH_INPUT_FIELD_VALUE,
      'outline-none ring-0 shadow-none',
      'focus:!border-0 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none',
      'focus-visible:!border-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none',
      multiline && 'min-h-[100px] w-full resize-none',
      disabled && BH_INPUT_FIELD_PLACEHOLDER_TEXT,
    );

    const bottomMessage = hasError ? error : helperText;

    const showLabelRow = label != null && label !== '';

    return (
      <div className={cn('flex w-full flex-col', BH_INPUT_FIELD_STACK_GAP, className)}>
        {(showLabelRow || required) &&
          (showLabelRow && id ? (
            <label htmlFor={id} className={BH_INPUT_FIELD_LABEL_ROW}>
              <span>{label}</span>
              {required ? (
                <span className={destructive ? BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE : BH_INPUT_FIELD_REQUIRED_DEFAULT}>
                  *
                </span>
              ) : null}
            </label>
          ) : (
            <div className={BH_INPUT_FIELD_LABEL_ROW}>
              {showLabelRow ? <span>{label}</span> : null}
              {required ? (
                <span className={destructive ? BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE : BH_INPUT_FIELD_REQUIRED_DEFAULT}>
                  *
                </span>
              ) : null}
            </div>
          ))}

        <div className={cn('relative flex flex-col', BH_INPUT_FIELD_STACK_GAP, fieldClassName)}>
          <div className={shellClass}>
            {icon ? (
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center self-stretch',
                  BH_INPUT_FIELD_ICON_COLOR,
                )}
              >
                {icon}
              </span>
            ) : null}
            {prefix ? (
              <span className={cn('flex shrink-0 items-center self-stretch', BH_INPUT_FIELD_PREFIX)}>{prefix}</span>
            ) : null}
            {useControl ? (
              <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch">{control}</div>
            ) : multiline ? (
              <textarea
                ref={ref as React.Ref<HTMLTextAreaElement>}
                id={id}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
                onBlur={onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                onFocus={onFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                aria-invalid={hasError || undefined}
                className={cn(inputTextClass, inputClassName)}
                {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              />
            ) : (
              <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch">
                <input
                  ref={ref as React.Ref<HTMLInputElement>}
                  id={id}
                  type={type}
                  disabled={disabled}
                  placeholder={placeholder}
                  value={value}
                  defaultValue={defaultValue}
                  onChange={onChange}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  aria-invalid={hasError || undefined}
                  className={cn(
                    inputTextClass,
                    'w-full min-w-0 appearance-none rounded-none',
                    inputClassName,
                  )}
                  {...rest}
                />
              </div>
            )}
            {suffix ? (
              <span className="flex size-5 shrink-0 items-center justify-center self-stretch overflow-hidden">
                {suffix}
              </span>
            ) : null}
            {hasError ? (
              <AlertCircle
                className="size-4 shrink-0 self-center text-[#f04438]"
                aria-hidden
                strokeWidth={2}
              />
            ) : null}
          </div>

          {bottomMessage ? (
            <p className={hasError ? BH_INPUT_FIELD_ERROR_MESSAGE : BH_INPUT_FIELD_HINT}>{bottomMessage}</p>
          ) : null}
        </div>
      </div>
    );
  },
);

BookingHubInputField.displayName = 'BookingHubInputField';
