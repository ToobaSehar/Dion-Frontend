'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPhoneField } from '@/components/BookingHubPhoneField';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BH_AUTH_HUB_PRIMARY_STACK_WIDTH } from '@/components/auth/AuthHubSegmentedTabs';
import {
  BH_HUB_AUTH_CARD_WHITE,
  BH_HUB_AUTH_FIELD_GRID_CLASSES,
} from '@/components/auth/bookingHubAuthCardShell';
import { BookingHubSignUpPageShell } from '@/components/auth/BookingHubSignUpPageShell';
import { bhGap, bhMarginBottom, bhMarginTop, bhPadding, bhPaddingX, bhSpacing, bhSpaceY } from '@/components/booking-hub-space';
import { bhRounded } from '@/components/booking-hub-radius';

type FormValues = {
  fullName: string;
  companyName: string;
  phone: string;
  termsAccepted: boolean;
};

function createCompleteProfileSchema(isPartner: boolean) {
  return z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    termsAccepted: z.boolean().refine((v) => v === true, {
      message: isPartner
        ? 'You must agree to the partner terms and conditions'
        : 'You must agree to the client terms and conditions',
    }),
  });
}

function CompleteProfileForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'client';
  const nameParam = searchParams.get('name') || '';
  const emailParam = searchParams.get('email') || '';
  const returnTo = searchParams.get('return_to') || '';
  /** Set when opening “Finish setting up” from sign-up Google/Microsoft (no auth session yet). */
  const signupSsoPending = searchParams.get('signup_sso') === '1';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isPartner = role === 'partner';
  const termsHref = isPartner ? '/partner-terms' : '/terms';
  const termsLinkText = isPartner ? 'partner terms and conditions' : 'Booking Hub client terms and conditions';
  const termsId = 'bh-complete-profile-termsAccepted';

  const schema = useMemo(() => createCompleteProfileSchema(isPartner), [isPartner]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: nameParam, companyName: '', phone: '', termsAccepted: false },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !signupSsoPending) window.location.href = '/';
    });
  }, [signupSsoPending]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError('Your session has expired. Please sign in again.'); setLoading(false); return; }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jfgm6v6pkw.us-east-1.awsapprunner.com/api';
      const endpoint = isPartner ? '/partner-signup' : '/client-signup';

      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          fullName: data.fullName,
          email: emailParam,
          phone: data.phone,
          companyName: data.companyName,
          fromSSO: true,
          termsAccepted: data.termsAccepted,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { window.location.href = returnTo || (isPartner ? '/partner/dashboard' : '/client'); }, 1500);
      } else {
        const result = await res.json().catch(() => ({}));
        setError(result.error || 'Could not complete your profile. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <header className="flex w-full flex-col items-center">
      <div className={cn('flex justify-center', bhMarginBottom('3xl'), 'md:mb-8')}>
        <Image
          src="/blue-teal-icon%20(1).webp"
          alt="Booking Hub"
          width={56}
          height={64}
          className="h-14 w-auto object-contain sm:h-16 md:h-[4.5rem]"
          priority
        />
      </div>
      <div
        className={cn(
          'mx-auto w-full max-w-bh-xl text-center',
          bhPaddingX('xl'),
          bhMarginTop('md'),
          'md:mt-3',
          bhGap('2'),
        )}
      >
        <h1 className={cn('bh-h1 font-bold tracking-tight', bhMarginBottom('md'))}>Finish setting up your account</h1>
        <p className="bh-lead">
          Add a few details to complete your {isPartner ? 'partner' : 'client'} registration.
        </p>
      </div>
    </header>
  );

  const formBody = (
    <form className={cn('flex w-full flex-col', bhGap('6'), 'md:gap-8')} onSubmit={handleSubmit(onSubmit)} noValidate>
      {emailParam ? (
        <p
          className={cn(
            'text-center font-avenir-regular text-sm font-normal leading-5 text-[#535862]',
            BH_AUTH_HUB_PRIMARY_STACK_WIDTH,
          )}
        >
          Signed in as <span className="font-semibold text-[#0b1d37]">{emailParam}</span>
        </p>
      ) : null}

      {error && (
        <div
          className={cn(
            'border border-red-200 bg-red-50',
            bhRounded('xl'),
            bhSpacing(bhPadding('3'), 'sm:p-4'),
          )}
        >
          <p className="bh-small text-center text-red-800 sm:text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div
          className={cn(
            'border border-green-200 bg-green-50 text-center',
            bhRounded('lg'),
            bhPadding('4'),
          )}
        >
          <p className="font-avenir-regular text-xs font-medium text-green-800 sm:text-base">
            Account set up successfully. Redirecting you now…
          </p>
        </div>
      )}

      <div className={bhSpaceY('4')}>
        <div className={BH_HUB_AUTH_FIELD_GRID_CLASSES}>
          <div>
            <BookingHubInputField
              id="bh-complete-profile-name"
              type="text"
              autoComplete="name"
              label="Full name"
              placeholder="Enter your name"
              error={errors.fullName?.message}
              size="md"
              {...register('fullName')}
            />
          </div>
          <div>
            <BookingHubInputField
              id="bh-complete-profile-company"
              type="text"
              autoComplete="organization"
              label="Company name"
              placeholder="e.g. Acme Ltd"
              error={errors.companyName?.message}
              size="md"
              {...register('companyName')}
            />
          </div>
        </div>
        <div className={BH_HUB_AUTH_FIELD_GRID_CLASSES}>
          <div className="sm:col-span-2">
            <BookingHubPhoneField
              id="bh-complete-profile-phone"
              autoComplete="tel"
              label="Phone number"
              placeholder="e.g. 07700 900000"
              error={errors.phone?.message}
              size="md"
              defaultCountryIso="GB"
              {...register('phone')}
            />
          </div>
        </div>
      </div>

      <div className={cn('flex items-start', bhGap('3'))}>
        <input
          {...register('termsAccepted')}
          type="checkbox"
          id={termsId}
          className={cn(
            'mt-0.5 h-4 w-4 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-booking-teal focus:ring-offset-2 focus:ring-offset-white',
            bhRounded('md'),
            errors.termsAccepted ? 'border-red-500 text-red-600' : 'border-gray-300 text-booking-teal',
          )}
        />
        <label
          htmlFor={termsId}
          className={cn(
            'bh-small cursor-pointer select-none leading-relaxed',
            errors.termsAccepted ? 'text-red-700' : 'text-gray-700',
          )}
        >
          I agree to the{' '}
          <Link
            href={termsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-booking-teal underline hover:text-booking-dark"
            onClick={(e) => e.stopPropagation()}
          >
            {termsLinkText}
          </Link>
          .
        </label>
      </div>
      {errors.termsAccepted ? (
        <p className="bh-small -mt-2 text-red-600">{errors.termsAccepted.message}</p>
      ) : null}

      <div className={cn('flex w-full flex-col', bhGap('4'), 'md:gap-8', BH_AUTH_HUB_PRIMARY_STACK_WIDTH)}>
        <BookingHubPrimaryButton
          type="submit"
          fullWidth
          responsive
          disabled={loading || success}
          loading={loading}
          loadingText="Saving…"
        >
          Continue
        </BookingHubPrimaryButton>
      </div>
    </form>
  );

  const inner = (
    <>
      {header}
      <div
        className={cn(
          BH_HUB_AUTH_CARD_WHITE,
          'flex flex-col',
          bhMarginTop('6'),
          'md:mt-8',
          bhGap('6'),
          'md:gap-8',
        )}
      >
        {formBody}
      </div>
    </>
  );

  return (
    <main className="font-avenir-regular">
      <BookingHubSignUpPageShell variant="hubCard">{inner}</BookingHubSignUpPageShell>
    </main>
  );
}

function CompleteProfileFallback() {
  return (
    <main className="font-avenir-regular">
      <BookingHubSignUpPageShell variant="hubCard">
        <div className="flex min-h-[40vh] items-center justify-center font-avenir-regular text-sm text-[#535862]">
          Loading…
        </div>
      </BookingHubSignUpPageShell>
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<CompleteProfileFallback />}>
      <CompleteProfileForm />
    </Suspense>
  );
}
