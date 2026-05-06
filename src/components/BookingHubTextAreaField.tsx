'use client';

import { forwardRef } from 'react';
import { AlertCircle, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BH_INPUT_FIELD_PLACEHOLDER_TEXT } from '@/components/bookingHubInputFieldTypography';
import {
  BH_TEXTAREA_ERROR_MESSAGE,
  BH_TEXTAREA_HINT,
  BH_TEXTAREA_ICON_COLOR,
  BH_TEXTAREA_LABEL_ROW,
  BH_TEXTAREA_REQUIRED_DEFAULT,
  BH_TEXTAREA_REQUIRED_DESTRUCTIVE,
  BH_TEXTAREA_STACK_GAP,
  BH_TEXTAREA_VALUE,
} from '@/components/bookingHubTextAreaFieldTypography';
import { bhButtonResponsivePadding } from '@/components/booking-hub-button/bookingHubButtonSizes';

/**
 * Booking Hub text area aligned with Figma frame `1238:278` (default + tags shells, states).
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/…?node-id=1238-278
 */

export type BookingHubTextAreaFieldSize = 'sm' | 'md';
export type BookingHubTextAreaFieldVariant = 'default' | 'destructive';
/** `tags` uses Figma tags shell padding (`p-[12px]`); no tag chip behaviour (presentation only). */
export type BookingHubTextAreaFieldType = 'default' | 'tags';

export type BookingHubTextAreaFieldProps = {
  label?: React.ReactNode;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: BookingHubTextAreaFieldVariant;
  size?: BookingHubTextAreaFieldSize;
  fieldType?: BookingHubTextAreaFieldType;
  rows?: number;
  className?: string;
  fieldClassName?: string;
  textareaClassName?: string;
  /** Renders after the required asterisk in the label row (e.g. help icon). */
  labelAdornment?: React.ReactNode;
  /** Decorative grip in the bottom-right corner (Figma resize affordance). */
  resizeHandle?: boolean;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'style'>;

export const BookingHubTextAreaField = forwardRef<HTMLTextAreaElement, BookingHubTextAreaFieldProps>(
  function BookingHubTextAreaField(
    {
      label,
      placeholder,
      helperText,
      error,
      disabled,
      required,
      variant = 'default',
      size = 'md',
      fieldType = 'default',
      rows = 4,
      className,
      fieldClassName,
      textareaClassName,
      id,
      labelAdornment,
      resizeHandle = true,
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

    const shellPad =
      fieldType === 'tags' ? 'p-3' : size === 'md' ? bhButtonResponsivePadding() : 'px-3 py-2.5';

    /** Same as `BookingHubInputField` shell (`shellShadowXs` + border states). */
    const shellShadowXs = 'shadow-[0px_1px_2px_rgba(16,24,40,0.05)]';

    const shellClass = cn(
      'relative box-border w-full overflow-hidden rounded-[8px] transition-[border-color,box-shadow,background-color]',
      shellPad,
      disabled &&
        cn('cursor-not-allowed border border-solid border-gray-300 bg-[#fafafa]', shellShadowXs),
      !disabled &&
        destructive &&
        cn('border border-solid border-[#fda29b] bg-white', shellShadowXs),
      !disabled &&
        !destructive &&
        cn('border border-solid border-[#d5d7da] bg-white', shellShadowXs),
      !disabled &&
        'focus-within:border focus-within:border-solid focus-within:border-[#00cbc5] focus-within:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
    );

    const textareaClass = cn(
      'relative z-0 block min-h-[100px] w-full resize-none border-0 bg-transparent p-0',
      BH_TEXTAREA_VALUE,
      'outline-none ring-0 shadow-none',
      'focus:!border-0 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none',
      'focus-visible:!border-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none',
      disabled && BH_INPUT_FIELD_PLACEHOLDER_TEXT,
      textareaClassName,
    );

    const bottomMessage = hasError ? error : helperText;
    const showLabelRow = label != null && label !== '';

    return (
      <div className={cn('flex w-full flex-col', BH_TEXTAREA_STACK_GAP, className)}>
        {(showLabelRow || required || labelAdornment) &&
          (showLabelRow && id ? (
            <label htmlFor={id} className={BH_TEXTAREA_LABEL_ROW}>
              {showLabelRow ? <span>{label}</span> : null}
              {required ? (
                <span className={destructive ? BH_TEXTAREA_REQUIRED_DESTRUCTIVE : BH_TEXTAREA_REQUIRED_DEFAULT}>
                  *
                </span>
              ) : null}
              {labelAdornment ? (
                <span className={cn('flex items-center', BH_TEXTAREA_ICON_COLOR)}>{labelAdornment}</span>
              ) : null}
            </label>
          ) : (
            <div className={BH_TEXTAREA_LABEL_ROW}>
              {showLabelRow ? <span>{label}</span> : null}
              {required ? (
                <span className={destructive ? BH_TEXTAREA_REQUIRED_DESTRUCTIVE : BH_TEXTAREA_REQUIRED_DEFAULT}>
                  *
                </span>
              ) : null}
              {labelAdornment ? (
                <span className={cn('flex items-center', BH_TEXTAREA_ICON_COLOR)}>{labelAdornment}</span>
              ) : null}
            </div>
          ))}

        <div className={cn('relative flex flex-col', BH_TEXTAREA_STACK_GAP, fieldClassName)}>
          <div className={shellClass}>
            <textarea
              ref={ref}
              id={id}
              rows={rows}
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              aria-invalid={hasError || undefined}
              className={textareaClass}
              {...rest}
            />
            {resizeHandle && !disabled ? (
              <div
                className={cn('pointer-events-none absolute bottom-1 right-1 z-[1]', BH_TEXTAREA_ICON_COLOR)}
                aria-hidden
              >
                <GripHorizontal className="size-3 opacity-80" strokeWidth={1.5} />
              </div>
            ) : null}
            {hasError ? (
              <AlertCircle
                className="pointer-events-none absolute right-3 top-3 z-[1] size-4 shrink-0 text-[#f04438]"
                aria-hidden
                strokeWidth={2}
              />
            ) : null}
          </div>

          {bottomMessage ? (
            <p className={hasError ? BH_TEXTAREA_ERROR_MESSAGE : BH_TEXTAREA_HINT}>{bottomMessage}</p>
          ) : null}
        </div>
      </div>
    );
  },
);

BookingHubTextAreaField.displayName = 'BookingHubTextAreaField';
