'use client';

import { forwardRef, useCallback, useId, useMemo, useState, type ReactNode } from 'react';
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  BH_INPUT_FIELD_FILLED_TEXT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_PLACEHOLDER_TEXT,
  BH_INPUT_FIELD_SELECT_TRIGGER_TEXT,
  BH_INPUT_FIELD_STACK_GAP,
  BH_INPUT_FIELD_LABEL_ROW,
} from '@/components/bookingHubInputFieldTypography';
import { BH_RESPONSIVE_CONTROL_MIN_H } from '@/components/bookingHubControlHeight';
import { bhButtonResponsivePadding } from '@/components/booking-hub-button/bookingHubButtonSizes';
import type { BookingHubSelectFieldSize, BookingHubSelectOption } from './BookingHubSelectField';
import {
  BH_SELECT_MENU_BORDER,
  BH_SELECT_MENU_SHADOW,
} from './bookingHubSelectFieldTokens';

/** Same as `BookingHubInputField` / `BookingHubSelectField` shell shadow. */
const BH_INPUT_SHELL_SHADOW_XS = 'shadow-[0px_1px_2px_rgba(16,24,40,0.05)]';

function chevronClass(size: BookingHubSelectFieldSize): string {
  return cn('shrink-0', BH_INPUT_FIELD_ICON_COLOR, size === 'sm' ? 'size-4' : 'size-5');
}

function triggerValueTypography(size: BookingHubSelectFieldSize): string {
  return size === 'sm'
    ? 'font-avenir-regular text-sm font-normal leading-5 tracking-normal'
    : 'font-avenir-regular text-sm font-normal leading-5 tracking-normal lg:text-base lg:leading-6';
}

function triggerShellClass(disabled: boolean | undefined): string {
  return cn(
    'box-border flex w-full min-w-0 flex-row items-stretch justify-between gap-1 overflow-hidden rounded-[8px] text-left outline-none transition-[border-color,box-shadow,background-color] lg:gap-1.5',
    BH_RESPONSIVE_CONTROL_MIN_H,
    bhButtonResponsivePadding(),
    BH_INPUT_FIELD_SELECT_TRIGGER_TEXT,
    disabled &&
      cn('cursor-not-allowed border border-solid border-gray-300 bg-[#fafafa]', BH_INPUT_SHELL_SHADOW_XS),
    !disabled &&
      cn('border border-solid border-[#d5d7da] bg-white', BH_INPUT_SHELL_SHADOW_XS),
    !disabled &&
      cn(
        'focus-visible:border focus-visible:border-solid focus-visible:border-[#00cbc5] focus-visible:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
        'data-[state=open]:border data-[state=open]:border-solid data-[state=open]:border-[#00cbc5] data-[state=open]:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
      ),
  );
}

export type BookingHubMultiSelectFieldProps = {
  id: string;
  label: ReactNode;
  options: BookingHubSelectOption[];
  value: ReadonlySet<string>;
  onToggle: (optionValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: BookingHubSelectFieldSize;
  className?: string;
  /** Controlled open state (e.g. partner submit-offer shell). Omit for uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Multi-select using the same trigger + menu chrome as {@link BookingHubSelectField} / payment frequency
 * (Radix Popover + `--radix-popover-trigger-width` for menu width parity).
 */
export const BookingHubMultiSelectField = forwardRef<HTMLButtonElement, BookingHubMultiSelectFieldProps>(
  function BookingHubMultiSelectField(
    {
      id,
      label,
      options,
      value,
      onToggle,
      placeholder = 'Select…',
      disabled,
      size = 'md',
      className,
      open: controlledOpen,
      onOpenChange,
    },
    ref,
  ) {
    const listboxId = useId();
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const summary = useMemo(() => {
      const labels = options.filter((o) => value.has(o.value)).map((o) => o.label);
      return labels.length > 0 ? labels.join(', ') : null;
    }, [options, value]);

    const triggerSlotTypo = triggerValueTypography(size);
    const shell = triggerShellClass(disabled);

    return (
      <div className={cn('flex w-full max-w-full flex-col', BH_INPUT_FIELD_STACK_GAP, className)}>
        <div className="flex w-full items-start justify-between gap-2">
          <label htmlFor={id} className={BH_INPUT_FIELD_LABEL_ROW}>
            {typeof label === 'string' ? <span>{label}</span> : label}
          </label>
        </div>

        <div className={cn('relative flex w-full flex-col', BH_INPUT_FIELD_STACK_GAP)}>
          <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild disabled={disabled}>
              <button
                ref={ref}
                type="button"
                id={id}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
                className={shell}
              >
                <div className="flex min-h-0 min-w-0 flex-1 items-center self-stretch overflow-hidden">
                  <span
                    className={cn(
                      'flex min-h-0 min-w-0 flex-1 items-center gap-2 overflow-hidden text-left',
                      triggerSlotTypo,
                      summary ? BH_INPUT_FIELD_FILLED_TEXT : BH_INPUT_FIELD_PLACEHOLDER_TEXT,
                    )}
                  >
                    {summary ?? placeholder}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2 self-stretch">
                  <span className="flex size-5 shrink-0 items-center justify-center self-stretch overflow-hidden">
                    <ChevronDown className={chevronClass(size)} aria-hidden strokeWidth={2} />
                  </span>
                </div>
              </button>
            </PopoverTrigger>

            <PopoverPortal>
              <PopoverContent
                side="bottom"
                sideOffset={4}
                align="start"
                collisionPadding={8}
                className={cn(
                  'z-50 max-h-[320px] overflow-y-auto overflow-x-hidden rounded-lg bg-white py-1',
                  BH_SELECT_MENU_BORDER,
                  BH_SELECT_MENU_SHADOW,
                  'box-border min-w-[var(--radix-popover-trigger-width)] w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] p-0',
                  size === 'sm' ? 'text-sm leading-5' : 'text-base leading-6',
                  'font-avenir-regular tracking-normal',
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={id}
                  aria-multiselectable="true"
                  className="max-h-[320px] overflow-y-auto px-1.5 py-0"
                >
                  {options.map((opt, index) => {
                    const checked = value.has(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={checked}
                        className={cn(
                          'group relative my-px flex w-full min-w-0 max-w-full cursor-default select-none rounded-md outline-none',
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                          'hover:bg-[#F6F6F4] focus-visible:bg-[#F6F6F4]',
                          index > 0 ? '' : '',
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          onToggle(opt.value);
                        }}
                      >
                        <div className="flex w-full min-w-0 flex-1 items-center gap-2 overflow-hidden py-2.5 pl-2 pr-2.5">
                          <span
                            className={cn(
                              'flex size-[18px] shrink-0 items-center justify-center rounded-full border-2',
                              checked ? 'border-[#00BAB5] bg-[#00BAB5]' : 'border-[#9BB8B6] bg-white',
                            )}
                            aria-hidden
                          >
                            {checked ? <Check className="size-3 text-white" strokeWidth={3} /> : null}
                          </span>
                          <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left">
                            <span className="truncate font-medium text-[#0b1d37]">{opt.label}</span>
                            {opt.supportingText ? (
                              <span className="truncate font-normal text-[#535862]">{opt.supportingText}</span>
                            ) : null}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
      </div>
    );
  },
);

BookingHubMultiSelectField.displayName = 'BookingHubMultiSelectField';
