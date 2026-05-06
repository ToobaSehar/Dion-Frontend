'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { BH_GRID_SHELL_CLASSES } from '@/components/booking-hub-grid';
import { BH_HUB_AUTH_CARD_WHITE } from '@/components/auth/bookingHubAuthCardShell';
import { bhGap, bhMarginBottom, bhPadding, bhPaddingX, bhSpacing, bhSpaceY } from '@/components/booking-hub-space';
import { bhRounded } from '@/components/booking-hub-radius';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BookingHubPhoneField } from '@/components/BookingHubPhoneField';

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: 'You must accept the Terms & Conditions to continue.',
  }),
});

type FormValues = z.infer<typeof schema>;

function CompleteProfileForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'client';
  const nameParam = searchParams.get('name') || '';
  const emailParam = searchParams.get('email') || '';
  const returnTo = searchParams.get('return_to') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isPartner = role === 'partner';
  const termsHref = isPartner ? '/partner-terms' : '/terms';
  const termsLabel = isPartner ? 'partner terms and conditions' : 'client terms and conditions';

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: nameParam, termsAccepted: false },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) window.location.href = '/';
    });
  }, []);

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

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-start bg-booking-bg py-10 sm:py-14',
        BH_GRID_SHELL_CLASSES,
      )}
      style={{ fontFamily: 'Avenir, "Avenir LT Std", "Nunito Sans", system-ui, sans-serif' }}
    >
      <div className={bhMarginBottom('8')}>
        <Image src="/blue-teal.webp" alt="Booking Hub" width={200} height={56} className="h-auto w-auto max-w-[180px] object-contain" priority />
      </div>

      <div className={cn(BH_HUB_AUTH_CARD_WHITE, 'max-w-lg')}>
        <h1 className="bh-h1 mb-1 text-center">Complete Your Account</h1>
        <p className="bh-lead mb-6 text-center text-booking-gray">
          Just a few more details to set up your {isPartner ? 'partner' : 'client'} account.
        </p>

        {emailParam && (
          <div
            className={cn(
              'mb-5 flex items-center border border-gray-200 bg-gray-50',
              bhRounded('xl'),
              bhSpacing(bhPaddingX('xl'), 'py-2.5'),
              bhGap('2'),
            )}
          >
            <svg className="w-4 h-4 text-booking-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <p className="bh-small text-booking-gray">Signing in as <span className="font-semibold text-booking-dark">{emailParam}</span></p>
          </div>
        )}

        <form className={bhSpaceY('4')} onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className={cn('border border-red-200 bg-red-50', bhRounded('xl'), bhPadding('4'), 'py-3')}>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className={cn('border border-green-200 bg-green-50', bhRounded('xl'), bhPadding('4'), 'py-3')}>
              <p className="text-sm text-green-800">Account set up successfully! Redirecting you now…</p>
            </div>
          )}

          <div>
            <label className="bh-label block mb-1.5 text-booking-dark">Full Name</label>
            <input {...register('fullName')} type="text" autoComplete="name"
              className={`bh-input bg-white ${errors.fullName ? 'bh-input-error' : ''}`} />
            {errors.fullName && <p className="bh-small mt-1 text-red-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="bh-label block mb-1.5 text-booking-dark">Company Name</label>
            <input {...register('companyName')} type="text" autoComplete="organization"
              className={`bh-input bg-white ${errors.companyName ? 'bh-input-error' : ''}`} />
            {errors.companyName && <p className="bh-small mt-1 text-red-600">{errors.companyName.message}</p>}
          </div>

          <div>
            <BookingHubPhoneField
              id="bh-complete-profile-phone"
              label="Phone Number"
              autoComplete="tel"
              error={errors.phone?.message}
              defaultCountryIso="GB"
              size="md"
              {...register('phone')}
            />
          </div>

          <div className={cn('flex items-start', bhGap('3'))}>
            <input
              {...register('termsAccepted')}
              type="checkbox"
              id="termsAccepted"
              className={cn(
                'mt-0.5 h-4 w-4 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-booking-teal focus:ring-offset-2 focus:ring-offset-white',
                bhRounded('md'),
                errors.termsAccepted ? 'border-red-500' : 'border-gray-300 text-booking-teal',
              )}
            />
            <label htmlFor="termsAccepted" className={`bh-small leading-relaxed cursor-pointer select-none ${errors.termsAccepted ? 'text-red-700' : 'text-gray-700'}`}>
              I agree to the{' '}
              <Link href={termsHref} target="_blank" rel="noopener noreferrer" className="font-medium underline text-booking-teal hover:text-booking-dark" onClick={(e) => e.stopPropagation()}>
                {termsLabel}
              </Link>
            </label>
          </div>
          {errors.termsAccepted && <p className="bh-small text-red-600">{errors.termsAccepted.message}</p>}

          <BookingHubPrimaryButton
            type="submit"
            fullWidth
            responsive
            disabled={loading || success}
            loading={loading}
            loadingText="Setting up account…"
          >
            Complete Account Setup
          </BookingHubPrimaryButton>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileForm />
    </Suspense>
  );
}
