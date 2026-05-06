'use client';

import { forwardRef } from 'react';

import { BookingHubSelectField } from '@/components/booking-hub-select';
import { PAYMENT_FREQUENCY_OPTIONS } from '@/components/booking-request/bookingRequestConstants';

type PaymentFrequencySelectProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

/**
 * Backwards-compatible wrapper for booking request flow.
 * Keeps the previous API (`value`, `onChange`, `onBlur`) while delegating
 * rendering to the shared Booking Hub select component.
 */
export const PaymentFrequencySelect = forwardRef<HTMLButtonElement, PaymentFrequencySelectProps>(
  function PaymentFrequencySelect({ value, onChange, onBlur, disabled }, ref) {
    return (
      <BookingHubSelectField
        ref={ref}
        id="bh-br-payment-frequency-legacy"
        name="paymentFrequency"
        label="Payment frequency"
        size="md"
        options={PAYMENT_FREQUENCY_OPTIONS}
        value={value ?? ''}
        onValueChange={onChange}
        onBlur={onBlur}
        placeholder="Select payment frequency"
        disabled={disabled}
      />
    );
  },
);

