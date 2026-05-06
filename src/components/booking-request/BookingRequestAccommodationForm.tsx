'use client';

import type { ChangeEvent, FocusEvent, Ref } from 'react';
import type { Control, FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';

import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubTextAreaField } from '@/components/BookingHubTextAreaField';
import {
  BH_INPUT_FIELD_CONTROL_SLOT,
  BH_INPUT_FIELD_FILLED_TEXT,
  BH_INPUT_FIELD_HINT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_PLACEHOLDER_TEXT,
} from '@/components/bookingHubInputFieldTypography';
import { BookingHubLinkGrayButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import SingleDatePicker from '@/components/SingleDatePicker';
import { BookingHubSelectField } from '@/components/booking-hub-select';
import type { BookingRequestFormValues } from '@/components/booking-request/bookingRequestSchema';
import { PAYMENT_FREQUENCY_OPTIONS } from '@/components/booking-request/bookingRequestConstants';
import {
  formatDateForDisplay,
  type BookingDateRange,
} from '@/components/booking-request/bookingRequestDateUtils';
import { cn } from '@/lib/utils';

export type BookingRequestAccommodationFormProps = {
  register: UseFormRegister<BookingRequestFormValues>;
  control: Control<BookingRequestFormValues>;
  errors: FieldErrors<BookingRequestFormValues>;
  clearErrors: UseFormClearErrors<BookingRequestFormValues>;
  setValue: UseFormSetValue<BookingRequestFormValues>;
  cityRef: Ref<HTMLInputElement>;
  cityName: string;
  cityOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  cityOnBlur: (e: FocusEvent<HTMLInputElement>) => void;
  bookings: BookingDateRange[];
  fieldErrors: Record<string, string>;
  openCalendarFor: { bookingId: string; field: 'start' | 'end' } | null;
  setOpenCalendarFor: (v: { bookingId: string; field: 'start' | 'end' } | null) => void;
  addBooking: () => void;
  removeBooking: (id: string) => void;
  handleDateSelect: (bookingId: string, field: 'startDate' | 'endDate', date: string) => void;
  nights: number;
  guestsNum: number;
  budgetNum: number;
  estimatedTotal: number;
  watchedCity?: string;
};

/**
 * Step 1 — location, date ranges, guests, budget, payment frequency, special requirements, summary.
 * Shared by `BookingRequestFlow` (public page) and any embedded shell (e.g. client portal).
 */
export function BookingRequestAccommodationForm({
  register,
  control,
  errors,
  clearErrors,
  setValue,
  cityRef,
  cityName,
  cityOnChange,
  cityOnBlur,
  bookings,
  fieldErrors,
  openCalendarFor,
  setOpenCalendarFor,
  addBooking,
  removeBooking,
  handleDateSelect,
  nights,
  guestsNum,
  budgetNum,
  estimatedTotal,
  watchedCity,
}: BookingRequestAccommodationFormProps) {
  return (
    <>
      <section className="space-y-4">
        <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">Location &amp; Dates</h2>
        <div className="w-full">
          <BookingHubInputField
            id="bh-br-city"
            ref={cityRef}
            name={cityName}
            onBlur={cityOnBlur}
            type="text"
            label="City or location"
            placeholder="Start typing a city, town, or postcode..."
            autoComplete="street-address"
            error={errors.city?.message}
            size="md"
            onChange={(e) => {
              cityOnChange(e);
              setValue('projectPostcode', e.target.value, {
                shouldDirty: true,
                shouldValidate: false,
              });
              clearErrors('city');
              clearErrors('projectPostcode');
            }}
          />
          <p className={cn(BH_INPUT_FIELD_HINT, 'mt-1')}>We&apos;ll search for properties near this location</p>
        </div>

        {bookings.map((booking) => (
          <div key={booking.id} className="space-y-3">
            <div className="flex w-full justify-end">
              {bookings.length > 1 && (
                <div className="w-full max-w-xs">
                  <BookingHubLinkGrayButton
                    type="button"
                    fullWidth
                    responsive
                    onClick={() => removeBooking(booking.id)}
                    className="!text-red-600 hover:!bg-red-50 hover:!text-red-700"
                  >
                    Remove
                  </BookingHubLinkGrayButton>
                </div>
              )}
            </div>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <BookingHubInputField
                  id={`bh-br-checkin-${booking.id}`}
                  label="Check-in"
                  size="md"
                  error={fieldErrors[`startDate-${booking.id}`]}
                  control={
                    <button
                      id={`bh-br-checkin-${booking.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarFor({ bookingId: booking.id, field: 'start' });
                      }}
                      className={cn(
                        'flex min-h-0 min-w-0 w-full flex-1 items-center justify-between gap-2 bg-transparent p-0 text-left',
                        BH_INPUT_FIELD_CONTROL_SLOT,
                        'outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
                      )}
                    >
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate',
                          booking.startDate ? BH_INPUT_FIELD_FILLED_TEXT : BH_INPUT_FIELD_PLACEHOLDER_TEXT,
                        )}
                      >
                        {booking.startDate ? formatDateForDisplay(booking.startDate) : 'Select date'}
                      </span>
                      <CalendarIcon className={cn('h-5 w-5 shrink-0', BH_INPUT_FIELD_ICON_COLOR)} aria-hidden />
                    </button>
                  }
                />
                {openCalendarFor?.bookingId === booking.id && openCalendarFor.field === 'start' && (
                  <SingleDatePicker
                    isOpen
                    onClose={() => setOpenCalendarFor(null)}
                    onSelect={(date) => handleDateSelect(booking.id, 'startDate', date)}
                    initialDate={booking.startDate}
                  />
                )}
              </div>
              <div className="relative">
                <BookingHubInputField
                  id={`bh-br-checkout-${booking.id}`}
                  label="Check-out"
                  size="md"
                  error={fieldErrors[`endDate-${booking.id}`]}
                  control={
                    <button
                      id={`bh-br-checkout-${booking.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCalendarFor({ bookingId: booking.id, field: 'end' });
                      }}
                      className={cn(
                        'flex min-h-0 min-w-0 w-full flex-1 items-center justify-between gap-2 bg-transparent p-0 text-left',
                        BH_INPUT_FIELD_CONTROL_SLOT,
                        'outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
                      )}
                    >
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate',
                          booking.endDate ? BH_INPUT_FIELD_FILLED_TEXT : BH_INPUT_FIELD_PLACEHOLDER_TEXT,
                        )}
                      >
                        {booking.endDate ? formatDateForDisplay(booking.endDate) : 'Select date'}
                      </span>
                      <CalendarIcon className={cn('h-5 w-5 shrink-0', BH_INPUT_FIELD_ICON_COLOR)} aria-hidden />
                    </button>
                  }
                />
                {openCalendarFor?.bookingId === booking.id && openCalendarFor.field === 'end' && (
                  <SingleDatePicker
                    isOpen
                    onClose={() => setOpenCalendarFor(null)}
                    onSelect={(date) => handleDateSelect(booking.id, 'endDate', date)}
                    initialDate={booking.endDate}
                    minDate={booking.startDate || undefined}
                    alignRight
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex w-full justify-start">
          <BookingHubSecondaryButton type="button" responsive onClick={addBooking}>
            + Add Booking
          </BookingHubSecondaryButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">Guests &amp; Budget</h2>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <BookingHubInputField
              id="bh-br-team-size"
              type="text"
              inputMode="numeric"
              label="Number of guests"
              placeholder="e.g. 2"
              error={errors.teamSize?.message}
              size="md"
              {...register('teamSize', {
                onChange: () => clearErrors('teamSize'),
              })}
            />
          </div>
          <div>
            <BookingHubInputField
              id="bh-br-budget"
              type="text"
              inputMode="decimal"
              label="Budget per night (£)"
              placeholder="e.g. 75"
              size="md"
              {...register('budgetPerPerson')}
            />
          </div>
        </div>
        <div className="w-full">
          <Controller
            name="paymentFrequency"
            control={control}
            render={({ field }) => (
              <BookingHubSelectField
                ref={field.ref}
                id="bh-br-payment-frequency"
                name={field.name}
                label="Payment frequency"
                size="md"
                options={PAYMENT_FREQUENCY_OPTIONS}
                value={field.value ?? ''}
                onValueChange={(v) => {
                  field.onChange(v);
                  clearErrors('paymentFrequency');
                }}
                onBlur={field.onBlur}
                placeholder="Select payment frequency"
                error={errors.paymentFrequency?.message}
                aria-invalid={errors.paymentFrequency ? true : undefined}
              />
            )}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">Additional Details</h2>
        <div className="w-full">
          <BookingHubTextAreaField
            id="bh-br-special"
            rows={4}
            label="Special requirements"
            placeholder="e.g. Within 30 mins drive, parking for 2 cars, pet-friendly..."
            size="md"
            fieldType="default"
            {...register('specialRequirements')}
          />
        </div>
      </section>

      <div className="bh-summary-strip">
        <p className="bh-body text-booking-dark">
          <span className="font-bold">{nights}</span> Nights <span className="mx-1.5 text-booking-gray">•</span>{' '}
          <span className="font-bold">{guestsNum}</span> Guests <span className="mx-1.5 text-booking-gray">•</span>{' '}
          <span className="font-bold">£{budgetNum}</span> per night
          {watchedCity?.trim() ? (
            <>
              {' '}
              in <span className="font-bold">{watchedCity.trim()}</span>
            </>
          ) : null}
        </p>
        <p className="bh-small mt-1 text-booking-gray">
          Estimated request budget:{' '}
          <span className="font-bold text-booking-dark">£{estimatedTotal.toLocaleString()}</span>
        </p>
      </div>
    </>
  );
}
