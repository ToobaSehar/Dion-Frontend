'use client';

import { createElement, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { differenceInDays } from 'date-fns';
import { ArrowLeft, ArrowRight, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import SingleDatePicker from '@/components/SingleDatePicker';
import {
  BookingHubLinkGrayButton,
  BookingHubPrimaryButton,
  BookingHubSecondaryButton,
} from '@/components/booking-hub-button';
import { BookingHubInputField } from '@/components/BookingHubInputField';
import {
  BH_INPUT_FIELD_CONTROL_SLOT,
  BH_INPUT_FIELD_FILLED_TEXT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_PLACEHOLDER_TEXT,
} from '@/components/bookingHubInputFieldTypography';
import { BookingHubPasswordRequirementChecklist } from '@/components/client-signup/BookingHubPasswordRequirementChecklist';
import { BookingHubTextAreaField } from '@/components/BookingHubTextAreaField';
import {
  BookingHubStepProgressIndicator,
  type BookingHubStepProgressItem,
} from '@/components/BookingHubStepProgressIndicator';
import { PaymentFrequencySelect } from './PaymentFrequencySelect';
import type { BookingRequestFormValues } from '@/components/booking-request/bookingRequestSchema';
import { SSOButtons } from '@/components/SSOButtons';
import { BH_GRID_GUTTER_GAP_CLASSES, BH_GRID_SHELL_CLASSES } from '@/components/booking-hub-grid';
import {
  bhGap,
  bhMarginBottom,
  bhMarginTop,
  bhPadding,
  bhPaddingX,
  bhPaddingY,
  bhSpacing,
  bhSpaceY,
} from '@/components/booking-hub-space';
import { bhRounded, bhRoundedSurfaceCard } from '@/components/booking-hub-radius';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
}

const initialBooking: Booking = { id: '1', startDate: '', endDate: '' };

const BOOKING_REQUEST_PROGRESS_STEPS: BookingHubStepProgressItem[] = [
  { title: 'Accommodation details' },
  { title: 'Your details' },
  { title: 'Account' },
];

const defaultValues: BookingRequestFormValues = {
  city: '',
  projectPostcode: '',
  teamSize: '',
  budgetPerPerson: '',
  paymentFrequency: '',
  specialRequirements: '',
  name: '',
  companyName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseYmd(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function totalNightsAcrossBookings(bookings: Booking[]): number {
  let total = 0;
  for (const b of bookings) {
    if (!b.startDate || !b.endDate) continue;
    const diff = differenceInDays(parseYmd(b.endDate), parseYmd(b.startDate));
    if (diff > 0) total += diff;
  }
  return total;
}

function BookingRequestPasswordEyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export type BookingRequestFlowProps = {
  variant?: 'page' | 'clientPortalShell';
};

export default function BookingRequestFlow(props: BookingRequestFlowProps = {}) {
  const variant = props.variant ?? 'page';
  const isEmbedded = variant === 'clientPortalShell';
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bookings, setBookings] = useState<Booking[]>([initialBooking]);
  const [openCalendarFor, setOpenCalendarFor] = useState<{ bookingId: string; field: 'start' | 'end' } | null>(
    null,
  );
  const [showThankYou, setShowThankYou] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<BookingRequestFormValues>({
    defaultValues,
    mode: 'onSubmit',
  });

  const watchedCity = watch('city');
  const watchedTeamSize = watch('teamSize');
  const watchedBudget = watch('budgetPerPerson');
  const watchedPassword = watch('password');

  const nights = useMemo(() => totalNightsAcrossBookings(bookings), [bookings]);
  const guestsNum = parseInt(watchedTeamSize || '', 10) || 0;
  const budgetNum = parseFloat(watchedBudget || '') || 0;
  const estimatedTotal = nights * budgetNum;

  const addBooking = () => {
    setBookings((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, startDate: '', endDate: '' },
    ]);
  };

  const removeBooking = (id: string) => {
    if (bookings.length > 1) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const updateBooking = (id: string, field: 'startDate' | 'endDate', value: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, [field]: value } : booking)),
    );
  };

  const handleDateSelect = (bookingId: string, field: 'startDate' | 'endDate', date: string) => {
    updateBooking(bookingId, field, date);
    setOpenCalendarFor(null);
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const onFinalSubmit = handleSubmit(async (data) => {
    setEmailError(null);
    setShowThankYou(false);
    setResendError(null);
    setResendSuccess(false);

    setIsSubmitting(true);

    const normalizedEmail = data.email.toLowerCase().trim();

    const bookingDates = bookings
      .filter((b) => b.startDate && b.endDate)
      .map((b) => ({ startDate: b.startDate, endDate: b.endDate }));

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jfgm6v6pkw.us-east-1.awsapprunner.com/api';
      const response = await fetch(`${backendUrl}/booking-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.name,
          companyName: data.companyName,
          email: normalizedEmail,
          phone: data.phone,
          projectPostcode: data.projectPostcode,
          password: data.password,
          bookings: bookingDates,
          teamSize: data.teamSize ? parseInt(data.teamSize, 10) : null,
          budgetPerPerson: data.budgetPerPerson ?? '',
          city: data.city,
          termsAccepted: data.termsAccepted,
        }),
      });

      if (response.ok) {
        await response.json();
        setSubmittedEmail(normalizedEmail);
        setShowThankYou(true);
        reset(defaultValues);
        setBookings([initialBooking]);
        setStep(3);
        setIsSubmitting(false);
      } else {
        let message = 'Could not complete your request. Please try again.';
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData?.error && typeof errorData.error === 'string') {
            message = errorData.error;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        setEmailError(message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting booking request:', error);
      setEmailError('Could not complete your request. Please try again.');
      setIsSubmitting(false);
    }
  });

  const handleResendEmail = async () => {
    if (!submittedEmail || resendLoading) return;
    setResendLoading(true);
    setResendError(null);
    setResendSuccess(false);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jfgm6v6pkw.us-east-1.awsapprunner.com/api';
      const response = await fetch(`${backendUrl}/client-signup/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) {
        setResendError(result.error || 'Failed to resend. Please try again.');
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setResendError('The request timed out. Please check your connection and try again.');
      } else {
        setResendError('An error occurred. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setResendLoading(false);
    }
  };

  const handleProceed = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowModal(false);
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/auth/login?type=client');
  };

  const {
    onChange: cityOnChange,
    onBlur: cityOnBlur,
    name: cityName,
    ref: cityRef,
  } = register('city');

  const formSurfaceClass = cn(
    'w-full border border-solid border-[#e9eaeb] bg-white',
    'shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]',
    bhRoundedSurfaceCard(),
    bhSpacing(
      bhPadding('2xl'),
      'sm:p-6 md:p-8 lg:p-12 xl:p-14',
      'max-w-[42rem] lg:max-w-[56rem] xl:max-w-bh-3xl',
    ),
  );

  const brCtaTrackClass =
    'mx-auto w-full sm:max-w-[calc((100%-1rem)/2)] md:max-w-[calc((100%-1.5rem)/2)]';

  const brFieldGridClass = cn('grid grid-cols-1 sm:grid-cols-2', BH_GRID_GUTTER_GAP_CLASSES);

  const pageLayoutInnerClass = cn(
    'flex w-full flex-col items-center',
    'justify-center md:justify-start',
    BH_GRID_SHELL_CLASSES,
    bhSpacing(bhPaddingY('3xl'), 'sm:py-8', 'md:py-12', 'lg:py-16'),
  );

  const embedLayoutInnerClass = cn(
    'flex w-full flex-col items-center',
    bhSpacing(bhPaddingY('3xl'), 'sm:py-8'),
  );

  const layoutInnerClass = isEmbedded ? embedLayoutInnerClass : pageLayoutInnerClass;

  const rootClass = isEmbedded
    ? 'w-full font-avenir text-[#0B1D37] antialiased'
    : 'min-h-svh w-full bg-booking-bg font-avenir text-[#0B1D37] antialiased';

  return (
    <>
      {createElement(
        isEmbedded ? 'div' : 'main',
        {
          className: rootClass,
          style: { fontFamily: 'var(--font-avenir-regular)' },
        },
        <div className={layoutInnerClass}>
          <div className={cn('flex justify-center', bhMarginBottom('3xl'), 'md:mb-8')}>
        <Image
          src="/blue-teal.webp"
          alt="Booking Hub"
          width={280}
          height={80}
          className="bh-logo h-auto w-auto max-w-[220px] object-contain md:max-w-[260px]"
          priority
        />
      </div>

      <div className={cn(formSurfaceClass, showModal && 'pointer-events-none blur-sm')}>
        <div className="text-center">
          <h1
            className={cn('bh-h1 font-bold tracking-tight', bhMarginBottom('md'))}
            style={{
              color: '#0B1D37',
              fontFamily: 'Avenir, Avenir LT Std, Nunito Sans, system-ui, -apple-system, sans-serif',
            }}
          >
            New Booking Request
          </h1>
        </div>
        <div className={cn('mx-auto text-center', bhMarginTop('md'), 'md:mt-3', bhPaddingX('xl'), 'max-w-bh-xl')}>
          <p className="bh-lead" style={{ color: '#4B4E53' }}>
            Tell us what you need and we&apos;ll find the best options
          </p>
        </div>

        <div className={bhSpacing(bhMarginTop('6'), 'md:mt-8')}>
          <BookingHubStepProgressIndicator
            steps={BOOKING_REQUEST_PROGRESS_STEPS}
            currentStep={step}
            ariaLabel="New booking request steps"
            className="max-w-full"
          />
        </div>

        <div className={bhSpacing(bhMarginTop('6'), 'md:mt-8')}>
          <form
            className={bhSpacing(bhSpaceY('6'), 'md:space-y-8')}
            onSubmit={step === 3 ? onFinalSubmit : (e) => e.preventDefault()}
            noValidate
          >
            {step === 1 && (
              <>
                <section className={bhSpaceY('4')}>
                  <h2
                    className="bh-label uppercase tracking-wide font-semibold"
                    style={{ color: '#0B1D37' }}
                  >
                    Location &amp; Dates
                  </h2>
                  <div>
                    <BookingHubInputField
                      ref={cityRef}
                      id="bh-br-city"
                      name={cityName}
                      onBlur={cityOnBlur}
                      type="text"
                      label="Location"
                      placeholder="Start typing a city, town, or postcode..."
                      autoComplete="street-address"
                      error={errors.city?.message}
                      helperText="We'll search for properties near this location"
                      size="md"
                      onChange={(e) => {
                        cityOnChange(e);
                        setValue('projectPostcode', e.target.value, { shouldDirty: true, shouldValidate: false });
                        clearErrors('city');
                        clearErrors('projectPostcode');
                      }}
                    />
                  </div>

                  {bookings.map((booking) => (
                    <div key={booking.id} className={bhSpaceY('3')}>
                      <div className="flex justify-end">
                        {bookings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBooking(booking.id)}
                            className="bh-small font-medium text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className={brFieldGridClass}>
                        <div className="relative">
                          <BookingHubInputField
                            id={`bh-br-checkin-${booking.id}`}
                            label="Check-in"
                            size="md"
                            control={
                              <button
                                type="button"
                                id={`bh-br-checkin-${booking.id}`}
                                className={cn(
                                  BH_INPUT_FIELD_CONTROL_SLOT,
                                  'flex h-full min-h-0 w-full min-w-0 flex-1 items-center justify-between gap-2 bg-transparent p-0 text-left outline-none ring-0 focus-visible:outline-none',
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenCalendarFor({ bookingId: booking.id, field: 'start' });
                                }}
                              >
                                <span
                                  className={cn(
                                    'min-w-0 flex-1 truncate',
                                    booking.startDate ? BH_INPUT_FIELD_FILLED_TEXT : BH_INPUT_FIELD_PLACEHOLDER_TEXT,
                                  )}
                                >
                                  {booking.startDate
                                    ? formatDateForDisplay(booking.startDate)
                                    : 'Select date'}
                                </span>
                                <CalendarIcon
                                  className={cn('size-5 shrink-0', BH_INPUT_FIELD_ICON_COLOR)}
                                  aria-hidden
                                />
                              </button>
                            }
                          />
                          {openCalendarFor?.bookingId === booking.id &&
                            openCalendarFor.field === 'start' && (
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
                            control={
                              <button
                                type="button"
                                id={`bh-br-checkout-${booking.id}`}
                                className={cn(
                                  BH_INPUT_FIELD_CONTROL_SLOT,
                                  'flex h-full min-h-0 w-full min-w-0 flex-1 items-center justify-between gap-2 bg-transparent p-0 text-left outline-none ring-0 focus-visible:outline-none',
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenCalendarFor({ bookingId: booking.id, field: 'end' });
                                }}
                              >
                                <span
                                  className={cn(
                                    'min-w-0 flex-1 truncate',
                                    booking.endDate ? BH_INPUT_FIELD_FILLED_TEXT : BH_INPUT_FIELD_PLACEHOLDER_TEXT,
                                  )}
                                >
                                  {booking.endDate ? formatDateForDisplay(booking.endDate) : 'Select date'}
                                </span>
                                <CalendarIcon
                                  className={cn('size-5 shrink-0', BH_INPUT_FIELD_ICON_COLOR)}
                                  aria-hidden
                                />
                              </button>
                            }
                          />
                          {openCalendarFor?.bookingId === booking.id &&
                            openCalendarFor.field === 'end' && (
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

                  <BookingHubSecondaryButton
                    type="button"
                    responsive
                    contentSized
                    onClick={addBooking}
                  >
                    + Add Booking
                  </BookingHubSecondaryButton>
                </section>

                <section className={bhSpaceY('4')}>
                  <h2
                    className="bh-label uppercase tracking-wide font-semibold"
                    style={{ color: '#0B1D37' }}
                  >
                    Guests &amp; Budget
                  </h2>
                  <div className={brFieldGridClass}>
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
                  <div>
                    <Controller
                      name="paymentFrequency"
                      control={control}
                      render={({ field }) => (
                        <PaymentFrequencySelect
                          ref={field.ref}
                          value={field.value ?? ''}
                          onChange={(v: string) => {
                            field.onChange(v);
                            clearErrors('paymentFrequency');
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                </section>

                <section className={bhSpaceY('3')}>
                  <h2
                    className="bh-label uppercase tracking-wide font-semibold"
                    style={{ color: '#0B1D37' }}
                  >
                    Additional Details
                  </h2>
                  <div>
                    <BookingHubTextAreaField
                      id="bh-br-special-requirements"
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
                  <p className="bh-body" style={{ color: 'rgb(11, 29, 55)' }}>
                    <span className="font-bold">{nights}</span> Nights{' '}
                    <span className="mx-1.5" style={{ color: 'rgb(75, 78, 83)' }}>
                      •
                    </span>{' '}
                    <span className="font-bold">{guestsNum}</span> Guests{' '}
                    <span className="mx-1.5" style={{ color: 'rgb(75, 78, 83)' }}>
                      •
                    </span>{' '}
                    <span className="font-bold">£{budgetNum}</span> per night
                    {watchedCity?.trim() ? (
                      <>
                        {' '}
                        in <span className="font-bold">{watchedCity.trim()}</span>
                      </>
                    ) : null}
                  </p>
                  <p className="bh-small mt-1" style={{ color: 'rgb(75, 78, 83)' }}>
                    Estimated request budget:{' '}
                    <span className="font-bold" style={{ color: 'rgb(11, 29, 55)' }}>
                      £{estimatedTotal.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className={brCtaTrackClass}>
                  <BookingHubPrimaryButton
                    type="button"
                    fullWidth
                    responsive
                    onClick={handleStep1Next}
                    iconTrailing={<ArrowRight className="h-4 w-4" aria-hidden />}
                  >
                    Next
                  </BookingHubPrimaryButton>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <section className={bhSpaceY('4')}>
                  <h2 className="bh-card-title">Your details</h2>
                  <div className={brFieldGridClass}>
                    <div>
                      <BookingHubInputField
                        id="bh-br-name"
                        type="text"
                        label="Name"
                        required
                        placeholder="Full name"
                        error={errors.name?.message}
                        size="md"
                        {...register('name', { onChange: () => clearErrors('name') })}
                      />
                    </div>
                    <div>
                      <BookingHubInputField
                        id="bh-br-company-name"
                        type="text"
                        label="Company Name"
                        required
                        placeholder="Company name"
                        error={errors.companyName?.message}
                        size="md"
                        {...register('companyName', { onChange: () => clearErrors('companyName') })}
                      />
                    </div>
                  </div>
                  <div className={brFieldGridClass}>
                    <div>
                      <BookingHubInputField
                        id="bh-br-company-email"
                        type="email"
                        label="Company Email"
                        required
                        placeholder="email@company.com"
                        error={errors.email?.message}
                        size="md"
                        {...register('email', { onChange: () => clearErrors('email') })}
                      />
                    </div>
                    <div>
                      <BookingHubInputField
                        id="bh-br-phone"
                        type="tel"
                        label="Phone"
                        required
                        placeholder="Phone number"
                        error={errors.phone?.message}
                        size="md"
                        {...register('phone', { onChange: () => clearErrors('phone') })}
                      />
                    </div>
                  </div>
                </section>

                <div className={cn('mx-auto flex w-full flex-col', brCtaTrackClass, bhGap('4'))}>
                  <BookingHubPrimaryButton
                    type="button"
                    fullWidth
                    responsive
                    onClick={() => setStep(3)}
                    iconTrailing={<ArrowRight className="h-4 w-4" aria-hidden />}
                  >
                    Next
                  </BookingHubPrimaryButton>
                  <BookingHubLinkGrayButton
                    type="button"
                    fullWidth
                    responsive
                    iconLeading={<ArrowLeft className="h-4 w-4" aria-hidden />}
                    onClick={() => setStep(1)}
                  >
                    Back to accommodation details
                  </BookingHubLinkGrayButton>
                </div>
              </>
            )}

            {step === 3 && (
              <div className={cn('flex w-full flex-col', bhGap('5'), 'md:gap-6')}>
                <section className={cn(bhSpaceY('3'), 'text-center')}>
                  <h2
                    className="bh-card-title text-[#0B1D37]"
                    style={{ fontFamily: 'var(--font-avenir-regular)' }}
                  >
                    One last step
                  </h2>
                  <p className="bh-body text-[#535862]" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
                    Create a password to track your request and manage your bookings
                  </p>
                </section>

                <div className={bhSpaceY('3')}>
                  <SSOButtons role="client" returnTo={pathname ?? '/booking-request'} verb="continue" />
                </div>

                <div className={cn('relative flex items-center', bhGap('4'))}>
                  <div className="h-px flex-1 bg-[#e9eaeb]" />
                  <span className="bh-small shrink-0 text-[#535862]" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
                    or
                  </span>
                  <div className="h-px flex-1 bg-[#e9eaeb]" />
                </div>

                <section className={bhSpaceY('4')}>
                  <div className={brFieldGridClass}>
                    <div className={cn('flex min-w-0 flex-col items-stretch', bhGap('4'))}>
                      <BookingHubInputField
                        id="bh-br-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        label="Password"
                        placeholder="Enter password"
                        error={errors.password?.message}
                        size="md"
                        suffix={
                          <button
                            type="button"
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center p-0 outline-none transition-colors',
                              bhRounded('md'),
                              BH_INPUT_FIELD_ICON_COLOR,
                              'hover:text-[#0b1d37] focus-visible:ring-2 focus-visible:ring-booking-teal focus-visible:ring-offset-2 focus-visible:ring-offset-booking-bg',
                            )}
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <BookingRequestPasswordEyeIcon open={showPassword} />
                          </button>
                        }
                        {...register('password', { onChange: () => clearErrors('password') })}
                      />
                      <div className="flex w-full flex-col items-start pt-4">
                        <BookingHubPasswordRequirementChecklist passwordStrengthPreview={watchedPassword ?? ''} />
                      </div>
                    </div>
                    <div>
                      <BookingHubInputField
                        id="bh-br-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        label="Confirm password"
                        placeholder="Confirm password"
                        error={errors.confirmPassword?.message}
                        size="md"
                        suffix={
                          <button
                            type="button"
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center p-0 outline-none transition-colors',
                              bhRounded('md'),
                              BH_INPUT_FIELD_ICON_COLOR,
                              'hover:text-[#0b1d37] focus-visible:ring-2 focus-visible:ring-booking-teal focus-visible:ring-offset-2 focus-visible:ring-offset-booking-bg',
                            )}
                            onClick={() => setShowConfirmPassword((s) => !s)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            <BookingRequestPasswordEyeIcon open={showConfirmPassword} />
                          </button>
                        }
                        {...register('confirmPassword', {
                          onChange: () => clearErrors('confirmPassword'),
                        })}
                      />
                    </div>
                  </div>
                </section>

                {showThankYou && (
                  <div
                    className={cn(
                      'border border-green-200 bg-green-50 text-center',
                      bhRounded('lg'),
                      bhPadding('4'),
                    )}
                  >
                    <p
                      className="text-xs font-medium text-green-800 sm:text-base"
                      style={{ fontFamily: 'var(--font-avenir-regular)' }}
                    >
                      Thanks — your request has been received and your client account has been created. A
                      confirmation email has been sent and may take up to 5–10 minutes to arrive.
                    </p>
                  </div>
                )}

                <div className={cn('flex w-full flex-col', bhGap('3'), 'pt-1')}>
                  <div className={cn('flex w-full items-start', bhGap('3'))}>
                    <Controller
                      name="termsAccepted"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id="termsAccepted"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                            clearErrors('termsAccepted');
                          }}
                          className={cn(
                            'mt-0.5 h-4 w-4 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-booking-teal focus:ring-offset-2 focus:ring-offset-booking-bg',
                            bhRounded('md'),
                            errors.termsAccepted ? 'border-red-500 text-red-600' : 'border-gray-300 text-booking-teal',
                          )}
                        />
                      )}
                    />
                    <label
                      htmlFor="termsAccepted"
                      className={cn(
                        'bh-small cursor-pointer select-none leading-relaxed',
                        errors.termsAccepted ? 'text-red-700' : 'text-gray-700',
                      )}
                    >
                      I agree to the{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-booking-teal underline hover:text-booking-dark"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Booking Hub client terms and conditions
                      </Link>
                      .
                    </label>
                  </div>
                  {showThankYou ? (
                    <div className="flex w-full justify-end">
                      <button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={resendLoading}
                        className="whitespace-nowrap text-xs font-medium text-[#00BAB5] underline hover:text-[#0B1D37] disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                        style={{ fontFamily: 'var(--font-avenir-regular)' }}
                      >
                        {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                      </button>
                    </div>
                  ) : null}
                </div>
                {resendError ? (
                  <p className="bh-small text-red-600" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
                    {resendError}
                  </p>
                ) : null}
                {resendSuccess ? (
                  <p className="bh-small text-green-600" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
                    Confirmation email resent successfully.
                  </p>
                ) : null}
                {errors.termsAccepted ? (
                  <p className="bh-small -mt-2 text-red-600">{errors.termsAccepted.message}</p>
                ) : null}

                {emailError ? (
                  <div
                    className={cn(
                      'border border-red-200 bg-red-50',
                      bhRounded('xl'),
                      bhSpacing(bhPadding('3'), 'sm:p-4'),
                    )}
                  >
                    <div
                      className="text-center text-xs text-red-800 sm:text-sm"
                      style={{ fontFamily: 'var(--font-avenir-regular)' }}
                    >
                      {emailError}
                    </div>
                  </div>
                ) : null}

                <div className={cn('mx-auto flex w-full flex-col', brCtaTrackClass, bhGap('4'))}>
                  <BookingHubPrimaryButton
                    type="submit"
                    fullWidth
                    responsive
                    loading={isSubmitting}
                    loadingText="Creating account..."
                    iconTrailing={<ArrowRight className="h-4 w-4" aria-hidden />}
                  >
                    Create Account
                  </BookingHubPrimaryButton>
                  <BookingHubLinkGrayButton
                    type="button"
                    fullWidth
                    responsive
                    iconLeading={<ArrowLeft className="h-4 w-4" aria-hidden />}
                    onClick={() => setStep(2)}
                  >
                    Back to your details
                  </BookingHubLinkGrayButton>
                </div>

                <p
                  className="bh-body bh-muted text-center"
                  style={{ fontFamily: 'var(--font-avenir)', fontWeight: 500, letterSpacing: '0.02em' }}
                >
                  Already have an account?{' '}
                  <a
                    href="/auth/login?type=client"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/auth/login?type=client';
                    }}
                    className="font-medium text-[#00BAB5] underline hover:text-[#0B1D37]"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            )}
            </form>
          </div>
        </div>
      </div>,
      )}

      {showModal && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex animate-overlay-fade items-center justify-center bg-black/50 backdrop-blur-sm',
            bhSpacing(bhPadding('3'), 'sm:p-4'),
          )}
          onClick={handleProceed}
          onKeyDown={(e) => e.key === 'Escape' && handleProceed()}
          role="presentation"
        >
          <div
            className={cn(
              'relative w-full max-w-md animate-card-entrance-1 bg-white shadow-2xl sm:max-w-3xl',
              bhRoundedSurfaceCard(),
              bhSpacing(bhPadding('3xl'), 'sm:p-8'),
            )}
            style={{ animationDelay: '0.1s' }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-request-modal-title"
          >
            <button
              onClick={handleProceed}
              type="button"
              className={cn(
                'absolute right-4 top-4 p-1 transition-colors hover:bg-gray-100 sm:p-2',
                bhRounded('full'),
              )}
              aria-label="Close"
            >
              <svg className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={cn('flex items-center justify-center', bhMarginBottom('6'))}>
              <Image
                src="/blue-teal.webp"
                alt="Booking Hub Logo"
                width={200}
                height={50}
                className="h-8 w-auto object-contain sm:h-12"
                style={{ maxWidth: '100%' }}
              />
            </div>

            <h2 id="booking-request-modal-title" className="sr-only">
              Continue as new or existing user
            </h2>
            <div className={cn('grid grid-cols-1 sm:grid-cols-2', BH_GRID_GUTTER_GAP_CLASSES)}>
              <div className="flex flex-col justify-between">
                <p
                  className={cn('text-center text-base leading-relaxed text-[#0B1D37] sm:text-lg', bhMarginBottom('3'))}
                  style={{ fontFamily: 'var(--font-avenir)', fontWeight: 500 }}
                >
                  Already a user? Sign in to your account to <br />
                  request a booking
                </p>
                <button
                  onClick={handleSignIn}
                  type="button"
                  className={cn(
                    'w-full bg-[#00BAB5] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#009a96] focus:outline-none focus:ring-2 focus:ring-[#00BAB5] focus:ring-offset-2 focus:ring-offset-white sm:text-base',
                    bhRounded('lg'),
                  )}
                  style={{ fontFamily: 'var(--font-avenir-regular)' }}
                >
                  Sign in
                </button>
              </div>
              <div className="flex flex-col justify-between">
                <p
                  className={cn('text-center text-base leading-relaxed text-[#0B1D37] sm:text-lg', bhMarginBottom('4'))}
                  style={{ fontFamily: 'var(--font-avenir)', fontWeight: 500 }}
                >
                  Requesting a booking as a New User?
                </p>
                <button
                  onClick={handleProceed}
                  type="button"
                  className={cn(
                    'w-full border-2 border-[#0B1D37] bg-[#E9ECEF] px-6 py-3 text-sm font-semibold text-[#0B1D37] transition-colors hover:bg-[#dee2e6] focus:outline-none focus:ring-2 focus:ring-[#0B1D37] focus:ring-offset-2 focus:ring-offset-white sm:text-base',
                    bhRounded('lg'),
                  )}
                  style={{ fontFamily: 'var(--font-avenir-regular)' }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
