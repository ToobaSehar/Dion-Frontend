'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: '28 days', label: '28 days' },
  { value: 'Upfront', label: 'Upfront' },
] as const;

export type PaymentFrequencySelectProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
};

export const PaymentFrequencySelect = forwardRef<HTMLButtonElement, PaymentFrequencySelectProps>(
  function PaymentFrequencySelect(
    { value, onChange, onBlur, disabled, id, 'aria-invalid': ariaInvalid },
    ref,
  ) {
    const isKnown = OPTIONS.some((o) => o.value === value);
    const rootValue = isKnown ? value : undefined;

    return (
      <SelectPrimitive.Root
        name="paymentFrequency"
        value={rootValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          id={id}
          aria-invalid={ariaInvalid}
          onBlur={onBlur}
          className={cn(
            'bh-input flex w-full min-h-0 items-center justify-between border border-gray-200 text-left font-normal',
            'h-11 py-2 pl-3 pr-3 text-sm md:h-12 md:text-base',
            'text-[#0B1D37] [&_[data-placeholder]]:text-booking-gray',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          )}
        >
          <SelectPrimitive.Value placeholder="Select payment frequency" />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              'bh-payment-select-content z-50 overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md',
              'min-w-[var(--radix-select-trigger-width)] text-[#0B1D37]',
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="max-h-96 overflow-y-auto p-0">
              {OPTIONS.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-normal outline-none',
                    'text-[#0B1D37] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    'data-[highlighted]:bg-[#00BAB5] data-[highlighted]:text-white',
                  )}
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

PaymentFrequencySelect.displayName = 'PaymentFrequencySelect';
