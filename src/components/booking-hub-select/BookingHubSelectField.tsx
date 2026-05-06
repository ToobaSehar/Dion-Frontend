'use client';

import { forwardRef, type ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { AlertCircle, Check, ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BH_INPUT_FIELD_ERROR_MESSAGE,
  BH_INPUT_FIELD_HINT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_LABEL_ROW,
  BH_INPUT_FIELD_REQUIRED_DEFAULT,
  BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE,
  BH_INPUT_FIELD_SELECT_TRIGGER_TEXT,
  BH_INPUT_FIELD_STACK_GAP,
} from '@/components/bookingHubInputFieldTypography';
import {
  BH_SELECT_CHECK_ICON,
  BH_SELECT_MENU_BORDER,
  BH_SELECT_MENU_SHADOW,
} from './bookingHubSelectFieldTokens';
import { BH_RESPONSIVE_CONTROL_MIN_H } from '@/components/bookingHubControlHeight';
import { bhButtonResponsivePadding } from '@/components/booking-hub-button/bookingHubButtonSizes';

/** Same as `BookingHubInputField` shell `shellShadowXs`. */
const BH_INPUT_SHELL_SHADOW_XS = 'shadow-[0px_1px_2px_rgba(16,24,40,0.05)]';

/**
 * Figma **Select** (`3281:377673`): label + optional `*` + help, trigger (default / focus / open / disabled),
 * hint line, menu with item rows (primary `#0B1D37` + supporting `#535862`; hover bg `#F6F6F4`, selected brand teal `#00BAB5`).
 *
 * Typography uses Inter (same stack as `BookingHubInputField`).
 *
 * @see https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=3281-377673
 */
export type BookingHubSelectOption = {
  value: string;
  label: string;
  supportingText?: string;
};

export type BookingHubSelectFieldSize = 'sm' | 'md';

export type BookingHubSelectFieldProps = {
  id: string;
  label: ReactNode;
  options: BookingHubSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  hintText?: string;
  error?: string;
  size?: BookingHubSelectFieldSize;
  /** Renders help-circle affordance (Figma); optional `onHelpClick` for behaviour. */
  showHelpIcon?: boolean;
  onHelpClick?: () => void;
  className?: string;
  'aria-invalid'?: boolean;
  name?: string;
};

function chevronClass(size: BookingHubSelectFieldSize): string {
  return cn('shrink-0', BH_INPUT_FIELD_ICON_COLOR, size === 'sm' ? 'size-4' : 'size-5');
}

/** Figma md: Text md; sm: Text sm in trigger + list rows. */
function triggerValueTypography(size: BookingHubSelectFieldSize): string {
  return size === 'sm'
    ? 'font-avenir-regular text-sm font-normal leading-5 tracking-normal'
    : 'font-avenir-regular text-sm font-normal leading-5 tracking-normal lg:text-base lg:leading-6';
}

function triggerLabelTypography(size: BookingHubSelectFieldSize): string {
  return size === 'sm'
    ? 'font-avenir-regular text-sm font-medium leading-5 tracking-normal text-[#0b1d37]'
    : 'font-avenir-regular text-sm font-medium leading-5 tracking-normal text-[#0b1d37] lg:text-base lg:leading-6';
}

function triggerSupportingTypography(size: BookingHubSelectFieldSize): string {
  return size === 'sm'
    ? 'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#535862]'
    : 'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#535862] lg:text-base lg:leading-6';
}

export const BookingHubSelectField = forwardRef<HTMLButtonElement, BookingHubSelectFieldProps>(
  function BookingHubSelectField(
    {
      id,
      label,
      options,
      value,
      onValueChange,
      placeholder = 'Select…',
      onBlur,
      disabled,
      required,
      hintText,
      error,
      size = 'md',
      showHelpIcon,
      onHelpClick,
      className,
      'aria-invalid': ariaInvalid,
      name,
    },
    ref,
  ) {
  const hasError = Boolean(error);
  const selected = options.find((o) => o.value === value);

  /** Trigger shell parity with `BookingHubInputField` (`shellClass`): stretch row + Radix `data-placeholder` on trigger. */
  const triggerShell = cn(
    'box-border flex w-full min-w-0 flex-row items-stretch justify-between gap-1 overflow-hidden rounded-[8px] text-left outline-none transition-[border-color,box-shadow,background-color] lg:gap-1.5',
    BH_RESPONSIVE_CONTROL_MIN_H,
    bhButtonResponsivePadding(),
    BH_INPUT_FIELD_SELECT_TRIGGER_TEXT,
    disabled &&
      cn('cursor-not-allowed border border-solid border-gray-300 bg-[#fafafa]', BH_INPUT_SHELL_SHADOW_XS),
    !disabled &&
      hasError &&
      cn('border border-solid border-[#fda29b] bg-white', BH_INPUT_SHELL_SHADOW_XS),
    !disabled &&
      !hasError &&
      cn('border border-solid border-[#d5d7da] bg-white', BH_INPUT_SHELL_SHADOW_XS),
    !disabled &&
      cn(
        'focus-visible:border focus-visible:border-solid focus-visible:border-[#00cbc5] focus-visible:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
        'data-[state=open]:border data-[state=open]:border-solid data-[state=open]:border-[#00cbc5] data-[state=open]:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
      ),
    hasError &&
      !disabled &&
      'focus-visible:border-[#fda29b] data-[state=open]:border-[#fda29b]',
  );

  const labelTypo = triggerLabelTypography(size);
  const supportingTypo = triggerSupportingTypography(size);
  const triggerSlotTypo = triggerValueTypography(size);

  return (
    <div className={cn('flex w-full max-w-full flex-col', BH_INPUT_FIELD_STACK_GAP, className)}>
      <div className="flex w-full items-start justify-between gap-2">
        <label htmlFor={id} className={BH_INPUT_FIELD_LABEL_ROW}>
          {typeof label === 'string' ? <span>{label}</span> : label}
          {required ? (
            <span className={hasError ? BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE : BH_INPUT_FIELD_REQUIRED_DEFAULT}>*</span>
          ) : null}
        </label>
        {showHelpIcon ? (
          <button
            type="button"
            tabIndex={-1}
            className="inline-flex shrink-0 text-[#a4a7ae] outline-none hover:text-[#717680] focus-visible:ring-2 focus-visible:ring-booking-teal focus-visible:ring-offset-2"
            aria-label={typeof label === 'string' ? `${label} help` : 'Help'}
            onClick={(e) => {
              e.preventDefault();
              onHelpClick?.();
            }}
          >
            <HelpCircle className="size-4 shrink-0" aria-hidden strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div className={cn('relative flex w-full flex-col', BH_INPUT_FIELD_STACK_GAP)}>
        <SelectPrimitive.Root value={value || undefined} onValueChange={onValueChange} disabled={disabled} name={name}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={id}
            aria-invalid={ariaInvalid}
            onBlur={onBlur}
            className={triggerShell}
          >
            <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch overflow-hidden">
              <SelectPrimitive.Value placeholder={placeholder} asChild>
                <span
                  className={cn(
                    'flex min-h-0 min-w-0 flex-1 items-center gap-2 overflow-hidden text-left',
                    triggerSlotTypo,
                  )}
                >
                  {selected ? (
                    <>
                      <span className={cn('truncate disabled:text-[#717680]', labelTypo)}>{selected.label}</span>
                      {selected.supportingText ? (
                        <span className={cn('truncate disabled:text-[#717680]', supportingTypo)}>
                          {selected.supportingText}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </span>
              </SelectPrimitive.Value>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-stretch">
              {hasError ? (
                <AlertCircle
                  className="size-4 shrink-0 self-center text-[#f04438]"
                  aria-hidden
                  strokeWidth={2}
                />
              ) : null}
              <SelectPrimitive.Icon asChild>
                <span className="flex size-5 shrink-0 items-center justify-center self-stretch overflow-hidden">
                  <ChevronDown className={chevronClass(size)} aria-hidden strokeWidth={2} />
                </span>
              </SelectPrimitive.Icon>
            </div>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className={cn(
                'z-50 max-h-[320px] overflow-hidden rounded-lg bg-white py-1',
                BH_SELECT_MENU_BORDER,
                BH_SELECT_MENU_SHADOW,
                'min-w-[var(--radix-select-trigger-width)]',
                size === 'sm' ? 'text-sm leading-5' : 'text-base leading-6',
                'font-avenir-regular tracking-normal',
              )}
            >
              <SelectPrimitive.Viewport className="max-h-[320px] overflow-y-auto px-1.5 py-0">
                {options.map((opt) => (
                  <SelectPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      'group relative my-px flex w-full cursor-default select-none rounded-md outline-none',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                      'data-[highlighted]:bg-[#F6F6F4]',
                      'data-[state=checked]:bg-[#00BAB5]',
                      'data-[highlighted]:data-[state=checked]:bg-[#00BAB5]',
                    )}
                  >
                    <div className="flex w-full flex-1 items-center gap-2 overflow-hidden py-2.5 pl-2 pr-2.5">
                      <SelectPrimitive.ItemText asChild>
                        <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden whitespace-nowrap text-left">
                          <span
                            className={cn(
                              'font-medium text-[#0b1d37]',
                              'group-data-[highlighted]:text-[#00BAB5]',
                              'group-data-[state=checked]:text-white',
                            )}
                          >
                            {opt.label}
                          </span>
                          {opt.supportingText ? (
                            <span
                              className={cn(
                                'font-normal text-[#535862]',
                                'group-data-[highlighted]:text-[#00BAB5]',
                                'group-data-[state=checked]:text-white/90',
                              )}
                            >
                              {opt.supportingText}
                            </span>
                          ) : null}
                        </span>
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="flex shrink-0">
                        <Check
                          className={cn(
                            size === 'sm' ? 'size-4' : 'size-5',
                            BH_SELECT_CHECK_ICON,
                            'group-data-[state=checked]:text-white',
                          )}
                          strokeWidth={2}
                          aria-hidden
                        />
                      </SelectPrimitive.ItemIndicator>
                    </div>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {hasError ? <p className={BH_INPUT_FIELD_ERROR_MESSAGE}>{error}</p> : null}
        {!hasError && hintText ? <p className={BH_INPUT_FIELD_HINT}>{hintText}</p> : null}
      </div>
    </div>
  );
  },
);

BookingHubSelectField.displayName = 'BookingHubSelectField';
