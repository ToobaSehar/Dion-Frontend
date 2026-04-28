'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays } from 'date-fns';
import { ArrowLeft, ArrowRight, CalendarIcon } from 'lucide-react';
import type { FieldPath } from 'react-hook-form';
import type { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import SingleDatePicker from '@/components/SingleDatePicker';
import { PaymentFrequencySelect } from '@/components/booking-request/PaymentFrequencySelect';
import {
  bookingRequestFormSchema,
  bookingRequestStep1Schema,
  type BookingRequestFormValues,
} from '@/components/booking-request/bookingRequestSchema';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
}

const initialBooking: Booking = { id: '1', startDate: '', endDate: '' };

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

function bookingDateFieldErrors(bookings: Booking[]): Record<string, string> {
  const hasValidBooking = bookings.some((b) => b.startDate && b.endDate);
  const errors: Record<string, string> = {};
  if (!hasValidBooking) {
    bookings.forEach((booking) => {
      if (!booking.startDate) {
        errors[`startDate-${booking.id}`] = 'Please fill this field';
      }
      if (!booking.endDate) {
        errors[`endDate-${booking.id}`] = 'Please fill this field';
      }
    });
  }
  return errors;
}

function applyZodFlattenToForm<T extends BookingRequestFormValues>(
  setError: (name: FieldPath<T>, error: { message: string }) => void,
  zodError: z.ZodError,
) {
  const { fieldErrors } = zodError.flatten();
  (Object.entries(fieldErrors) as [keyof BookingRequestFormValues, string[] | undefined][]).forEach(
    ([key, msgs]) => {
      if (msgs?.[0]) {
        setError(key as FieldPath<T>, { message: msgs[0] });
      }
    },
  );
}

export default function BookingRequestFlow() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [bookings, setBookings] = useState<Booking[]>([initialBooking]);
  const [openCalendarFor, setOpenCalendarFor] = useState<{ bookingId: string; field: 'start' | 'end' } | null>(
    null,
  );
  const [showThankYou, setShowThankYou] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<BookingRequestFormValues>({
    resolver: zodResolver(bookingRequestFormSchema),
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

  const stepLabel = step === 1 ? 'Accommodation Details' : 'Your Details';

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
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`${field}-${bookingId}`];
      return next;
    });
  };

  const handleStep1Next = () => {
    clearErrors();
    setFieldErrors({});
    const values = watch();
    const s1 = bookingRequestStep1Schema.safeParse({
      city: values.city,
      projectPostcode: values.projectPostcode,
      teamSize: values.teamSize,
    });
    if (!s1.success) {
      applyZodFlattenToForm(setError, s1.error);
      return;
    }
    const dateErrs = bookingDateFieldErrors(bookings);
    if (Object.keys(dateErrs).length > 0) {
      setFieldErrors(dateErrs);
      return;
    }
    setStep(2);
  };

  const onFinalSubmit = handleSubmit(async (data) => {
    setEmailError(null);
    setShowThankYou(false);
    setFieldErrors({});
    setResendError(null);
    setResendSuccess(false);

    const dateErrs = bookingDateFieldErrors(bookings);
    if (Object.keys(dateErrs).length > 0) {
      setFieldErrors(dateErrs);
      return;
    }
    setIsSubmitting(true);

    const normalizedEmail = data.email.toLowerCase().trim();
    if (!normalizedEmail) {
      setEmailError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: existingContractor, error: contractorCheckError } = await supabase
        .from('contractor')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (contractorCheckError) {
        console.error('Error checking contractor table:', contractorCheckError);
        setEmailError('This email is already in use, Try a different email.');
        setIsSubmitting(false);
        return;
      }
      if (existingContractor) {
        setEmailError('This email is already in use, Try a different email.');
        setIsSubmitting(false);
        return;
      }

      const { data: existingLandlord, error: landlordCheckError } = await supabase
        .from('landlord')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (landlordCheckError) {
        console.error('Error checking landlord table:', landlordCheckError);
        setEmailError('This email is already in use, Try a different email.');
        setIsSubmitting(false);
        return;
      }
      if (existingLandlord) {
        setEmailError('This email is already in use, Try a different email.');
        setIsSubmitting(false);
        return;
      }
    } catch (emailCheckError) {
      console.error('Email validation check failed:', emailCheckError);
      setEmailError('This email is already in use, Try a different email.');
      setIsSubmitting(false);
      return;
    }

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
        setStep(1);
        setIsSubmitting(false);
      } else {
        let errorData: { error?: string };
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          setEmailError('This email is already in use, Try a different email.');
          setIsSubmitting(false);
          return;
        }
        const errorMessage = errorData.error || 'Failed to submit booking request';
        if (
          errorMessage.includes('This email is already in use') ||
          errorMessage.includes('duplicate') ||
          errorMessage.includes('email') ||
          errorMessage.includes('unique constraint') ||
          errorMessage.includes('already exists')
        ) {
          setEmailError('This email is already in use, Try a different email.');
        } else {
          setEmailError(errorMessage);
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting booking request:', error);
      setEmailError('This email is already in use, Try a different email.');
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

  return (
    <>
      <main className="bh-page" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
        <div className="mb-6 flex justify-center md:mb-8">
          <Image
            src="/blue-teal.webp"
            alt="Booking Hub"
            width={280}
            height={80}
            className="bh-logo h-auto w-auto max-w-[220px] object-contain md:max-w-[260px]"
            priority
          />
        </div>

        <div className={cn('bh-form-card', showModal && 'pointer-events-none blur-sm')}>
          <div className="text-center">
            <h1
              className="bh-h1 mb-2 font-bold tracking-tight"
              style={{
                color: '#0B1D37',
                fontFamily: 'Avenir, Avenir LT Std, Nunito Sans, system-ui, -apple-system, sans-serif',
              }}
            >
              New Booking Request
            </h1>
          </div>
          <div className="mx-auto mt-2 max-w-xl text-center md:mt-3">
            <p className="bh-lead" style={{ color: '#4B4E53' }}>
              Tell us what you need and we&apos;ll find the best options
            </p>
          </div>

          <div className="mt-6 md:mt-8">
            <p className="bh-body bh-text-primary text-center font-semibold">
              Step {step} of 2 — {stepLabel}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: step === 1 ? '50%' : '100%',
                  backgroundColor: '#00BAB5',
                }}
              />
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <form
              className="space-y-6 md:space-y-8"
              onSubmit={step === 1 ? (e) => e.preventDefault() : onFinalSubmit}
              noValidate
            >
            {step === 1 && (
              <>
                <section className="space-y-4">
                  <h2
                    className="bh-label uppercase tracking-wide font-semibold"
                    style={{ color: '#0B1D37' }}
                  >
                    Location &amp; Dates
                  </h2>
                  <div>
                    <input
                      ref={cityRef}
                      name={cityName}
                      onBlur={cityOnBlur}
                      type="text"
                      placeholder="Start typing a city, town, or postcode..."
                      autoComplete="street-address"
                      className={cn(
                        'bh-input placeholder:text-muted-foreground',
                        errors.city && 'bh-input-error',
                      )}
                      onChange={(e) => {
                        cityOnChange(e);
                        setValue('projectPostcode', e.target.value, { shouldDirty: true, shouldValidate: false });
                        clearErrors('city');
                        clearErrors('projectPostcode');
                      }}
                    />
                    {errors.city && (
                      <p className="bh-small mt-1 text-red-600">{errors.city.message}</p>
                    )}
                    <p className="bh-small bh-muted mt-1">We&apos;ll search for properties near this location</p>
                  </div>

                  {bookings.map((booking) => (
                    <div key={booking.id} className="space-y-3">
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
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <div className="relative">
                          <label
                            className="bh-label mb-1.5 block text-[0.8125rem] leading-normal md:text-sm md:leading-normal font-medium"
                            style={{ color: '#0B1D37' }}
                          >
                            Check-in
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenCalendarFor({ bookingId: booking.id, field: 'start' });
                            }}
                            className={cn(
                              'bh-input justify-between bg-background text-left',
                              fieldErrors[`startDate-${booking.id}`] && 'bh-input-error',
                            )}
                          >
                            <span className={booking.startDate ? 'bh-text-primary' : 'bh-muted'}>
                              {booking.startDate
                                ? formatDateForDisplay(booking.startDate)
                                : 'Select date'}
                            </span>
                            <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                          </button>
                          {fieldErrors[`startDate-${booking.id}`] && (
                            <p className="bh-small mt-1 text-red-600">
                              {fieldErrors[`startDate-${booking.id}`]}
                            </p>
                          )}
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
                          <label
                            className="bh-label mb-1.5 block text-[0.8125rem] leading-normal md:text-sm md:leading-normal font-medium"
                            style={{ color: '#0B1D37' }}
                          >
                            Check-out
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenCalendarFor({ bookingId: booking.id, field: 'end' });
                            }}
                            className={cn(
                              'bh-input justify-between bg-background text-left',
                              fieldErrors[`endDate-${booking.id}`] && 'bh-input-error',
                            )}
                          >
                            <span className={booking.endDate ? 'bh-text-primary' : 'bh-muted'}>
                              {booking.endDate ? formatDateForDisplay(booking.endDate) : 'Select date'}
                            </span>
                            <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                          </button>
                          {fieldErrors[`endDate-${booking.id}`] && (
                            <p className="bh-small mt-1 text-red-600">
                              {fieldErrors[`endDate-${booking.id}`]}
                            </p>
                          )}
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

                  <button type="button" onClick={addBooking} className="bh-cta-add">
                    + Add Booking
                  </button>
                </section>

                <section className="space-y-4">
                  <h2
                    className="bh-label uppercase tracking-wide font-semibold"
                    style={{ color: '#0B1D37' }}
                  >
                    Guests &amp; Budget
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <div>
                      <label
                        className="bh-label mb-1.5 block text-[0.8125rem] leading-normal md:text-sm md:leading-normal font-medium"
                        style={{ color: '#0B1D37' }}
                      >
                        Number of guests
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 2"
                        className={cn(
                          'bh-input placeholder:text-muted-foreground',
                          errors.teamSize && 'bh-input-error',
                        )}
                        {...register('teamSize', {
                          onChange: () => clearErrors('teamSize'),
                        })}
                      />
                      {errors.teamSize && (
                        <p className="bh-small mt-1 text-red-600">{errors.teamSize.message}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="bh-label mb-1.5 block text-[0.8125rem] leading-normal md:text-sm md:leading-normal font-medium"
                        style={{ color: '#0B1D37' }}
                      >
                        Budget per night (£)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="e.g. 75"
                        className="bh-input placeholder:text-muted-foreground"
                        {...register('budgetPerPerson')}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="bh-label mb-1.5 block text-[0.8125rem] leading-normal md:text-sm md:leading-normal font-medium"
                      style={{ color: '#0B1D37' }}
                    >
                      Payment frequency
                    </label>
                    <Controller
                      name="paymentFrequency"
                      control={control}
                      render={({ field }) => (
                        <PaymentFrequencySelect
                          ref={field.ref}
                          value={field.value ?? ''}
                          onChange={(v) => {
                            field.onChange(v);
                            clearErrors('paymentFrequency');
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-3">
                  <h2
                    className="bh-label uppercase tracking-wide font-semibold"
                    style={{ color: '#0B1D37' }}
                  >
                    Additional Details
                  </h2>
                  <div>
                    <label
                      className="bh-label mb-1.5 block text-[0.8125rem] leading-normal md:text-sm md:leading-normal font-medium"
                      style={{ color: '#0B1D37' }}
                    >
                      Special requirements
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Within 30 mins drive, parking for 2 cars, pet-friendly..."
                      className="bh-input placeholder:text-muted-foreground"
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

                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="bh-cta"
                  style={{ backgroundColor: 'rgb(0, 186, 181)', color: 'rgb(255, 255, 255)' }}
                >
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bh-small flex items-center gap-1 font-semibold text-[#00BAB5] hover:text-[#0B1D37]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to accommodation
                </button>

                <section className="space-y-4">
                  <h2 className="bh-card-title">Your details</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <div>
                      <label className="bh-label mb-1.5 block">Name *</label>
                      <input
                        type="text"
                        className={cn('bh-input', errors.name && 'bh-input-error')}
                        placeholder="Full name"
                        {...register('name', { onChange: () => clearErrors('name') })}
                      />
                      {errors.name && (
                        <p className="bh-small mt-1 text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="bh-label mb-1.5 block">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        className={cn('bh-input', errors.companyName && 'bh-input-error')}
                        placeholder="Company name"
                        {...register('companyName', { onChange: () => clearErrors('companyName') })}
                      />
                      {errors.companyName && (
                        <p className="bh-small mt-1 text-red-600">{errors.companyName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <div>
                      <label className="bh-label mb-1.5 block">
                        Company Email *
                      </label>
                      <input
                        type="email"
                        className={cn('bh-input', errors.email && 'bh-input-error')}
                        placeholder="email@company.com"
                        {...register('email', { onChange: () => clearErrors('email') })}
                      />
                      {errors.email && (
                        <p className="bh-small mt-1 text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="bh-label mb-1.5 block">Phone *</label>
                      <input
                        type="tel"
                        className={cn('bh-input', errors.phone && 'bh-input-error')}
                        placeholder="Phone number"
                        {...register('phone', { onChange: () => clearErrors('phone') })}
                      />
                      {errors.phone && (
                        <p className="bh-small mt-1 text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <div>
                      <label className="bh-label mb-1.5 block">Password *</label>
                      <div className="relative isolate">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={cn('bh-input pr-10', errors.password && 'bh-input-error')}
                          placeholder="Create a password"
                          {...register('password', { onChange: () => clearErrors('password') })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
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
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="bh-small mt-1 text-red-600">{errors.password.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="bh-label mb-1.5 block">
                        Confirm Password *
                      </label>
                      <div className="relative isolate">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={cn('bh-input pr-10', errors.confirmPassword && 'bh-input-error')}
                          placeholder="Confirm password"
                          {...register('confirmPassword', {
                            onChange: () => clearErrors('confirmPassword'),
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((s) => !s)}
                          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
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
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="bh-small mt-1 text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p
                    className="mb-2 text-[10px] font-medium text-gray-600 sm:text-xs"
                    style={{ fontFamily: 'var(--font-avenir-regular)' }}
                  >
                    Password must contain:
                  </p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-y-1.5">
                    {[
                      { ok: (watchedPassword || '').length >= 8, label: '8+ characters' },
                      { ok: /[A-Z]/.test(watchedPassword || ''), label: 'Uppercase letter' },
                      { ok: /[a-z]/.test(watchedPassword || ''), label: 'Lowercase letter' },
                      { ok: /[0-9]/.test(watchedPassword || ''), label: 'Number' },
                    ].map(({ ok, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors sm:h-4 sm:w-4',
                            ok ? 'bg-green-500' : 'bg-gray-300',
                          )}
                        >
                          {ok ? (
                            <svg
                              className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="h-1 w-1 rounded-full bg-white sm:h-1.5 sm:w-1.5" />
                          )}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] transition-colors sm:text-xs',
                            ok ? 'font-medium text-green-700' : 'text-gray-500',
                          )}
                          style={{ fontFamily: 'var(--font-avenir-regular)' }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                    <div className="col-span-2 flex items-center gap-1.5">
                      <span
                        className={cn(
                          'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors sm:h-4 sm:w-4',
                          /[^A-Za-z0-9]/.test(watchedPassword || '') ? 'bg-green-500' : 'bg-gray-300',
                        )}
                      >
                        {/[^A-Za-z0-9]/.test(watchedPassword || '') ? (
                          <svg
                            className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-white sm:h-1.5 sm:w-1.5" />
                        )}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] transition-colors sm:text-xs',
                          /[^A-Za-z0-9]/.test(watchedPassword || '')
                            ? 'font-medium text-green-700'
                            : 'text-gray-500',
                        )}
                        style={{ fontFamily: 'var(--font-avenir-regular)' }}
                      >
                        Special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>

                {showThankYou && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                    <p
                      className="text-xs font-medium text-green-800 sm:text-base"
                      style={{ fontFamily: 'var(--font-avenir-regular)' }}
                    >
                      Thanks — your request has been received and your client account has been created. A
                      confirmation email has been sent and may take up to 5–10 minutes to arrive.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2.5 sm:items-center sm:gap-3">
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
                            'mt-0.5 h-4 w-4 cursor-pointer rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BAB5] focus:ring-offset-2 sm:mt-0 sm:h-5 sm:w-5',
                            errors.termsAccepted ? 'border-red-500' : 'border-gray-300',
                          )}
                        />
                      )}
                    />
                    <label
                      htmlFor="termsAccepted"
                      className={cn(
                        'cursor-pointer select-none text-xs leading-relaxed sm:text-sm',
                        errors.termsAccepted ? 'text-red-700' : 'text-gray-700',
                      )}
                      style={{ fontFamily: 'var(--font-avenir-regular)' }}
                    >
                      I agree to{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'font-medium underline transition-colors hover:no-underline',
                          errors.termsAccepted
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-[#00BAB5] hover:text-[#0B1D37]',
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        client terms and conditions
                      </Link>
                    </label>
                  </div>
                  {showThankYou && (
                    <button
                      type="button"
                      onClick={handleResendEmail}
                      disabled={resendLoading}
                      className="whitespace-nowrap text-xs font-medium text-[#00BAB5] underline hover:text-[#0B1D37] disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                      style={{ fontFamily: 'var(--font-avenir-regular)' }}
                    >
                      {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                    </button>
                  )}
                </div>
                {resendError && (
                  <p className="bh-small text-red-600" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
                    {resendError}
                  </p>
                )}
                {resendSuccess && (
                  <p className="bh-small text-green-600" style={{ fontFamily: 'var(--font-avenir-regular)' }}>
                    Confirmation email resent successfully.
                  </p>
                )}
                {errors.termsAccepted && (
                  <p
                    className="bh-small flex items-start gap-1.5 text-red-600"
                    style={{ fontFamily: 'var(--font-avenir-regular)' }}
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errors.termsAccepted.message}</span>
                  </p>
                )}

                {emailError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
                    <div
                      className="text-center text-xs text-red-800 sm:text-sm"
                      style={{ fontFamily: 'var(--font-avenir-regular)' }}
                    >
                      {emailError}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bh-cta"
                  style={{ backgroundColor: '#00BAB5', color: '#FFFFFF' }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="-ml-1 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>

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
                    Sign in here
                  </a>
                </p>
              </>
            )}
            </form>
          </div>
        </div>
      </main>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex animate-overlay-fade items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={handleProceed}
          onKeyDown={(e) => e.key === 'Escape' && handleProceed()}
          role="presentation"
        >
          <div
            className="relative w-full max-w-md animate-card-entrance-1 rounded-2xl bg-white p-6 shadow-2xl sm:max-w-3xl sm:p-8"
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
              className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-gray-100 sm:p-2"
              aria-label="Close"
            >
              <svg className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6 flex items-center justify-center">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="flex flex-col justify-between">
                <p
                  className="mb-3 text-center text-base leading-relaxed text-[#0B1D37] sm:text-lg"
                  style={{ fontFamily: 'var(--font-avenir)', fontWeight: 500 }}
                >
                  Already a user? Sign in to your account to <br />
                  request a booking
                </p>
                <button
                  onClick={handleSignIn}
                  type="button"
                  className="w-full rounded-lg bg-[#00BAB5] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#009a96] focus:outline-none focus:ring-2 focus:ring-[#00BAB5] focus:ring-offset-2 sm:text-base"
                  style={{ fontFamily: 'var(--font-avenir-regular)' }}
                >
                  Sign in
                </button>
              </div>
              <div className="flex flex-col justify-between">
                <p
                  className="mb-4 text-center text-base leading-relaxed text-[#0B1D37] sm:text-lg"
                  style={{ fontFamily: 'var(--font-avenir)', fontWeight: 500 }}
                >
                  Requesting a booking as a New User?
                </p>
                <button
                  onClick={handleProceed}
                  type="button"
                  className="w-full rounded-lg border-2 border-[#0B1D37] bg-[#E9ECEF] px-6 py-3 text-sm font-semibold text-[#0B1D37] transition-colors hover:bg-[#dee2e6] focus:outline-none focus:ring-2 focus:ring-[#0B1D37] focus:ring-offset-2 sm:text-base"
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
