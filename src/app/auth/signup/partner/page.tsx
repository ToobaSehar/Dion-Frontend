'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPhoneField } from '@/components/BookingHubPhoneField';
import { SSOButtons, SSODivider } from '@/components/SSOButtons';
import { BookingHubLinkColorButton, BookingHubPrimaryButton } from '@/components/booking-hub-button';
import {
  accountPasswordMatchRefine,
  accountPasswordObjectSchema,
} from '@/components/client-signup/accountPasswordStepSchema';
import { AccountPasswordStep } from '@/components/client-signup/AccountPasswordStep';
import {
  AuthHubSegmentedTabs,
  BH_AUTH_HUB_PRIMARY_STACK_WIDTH,
} from '@/components/auth/AuthHubSegmentedTabs';
import {
  BH_HUB_AUTH_FIELD_GRID_CLASSES,
  BH_HUB_AUTH_CARD_WHITE,
} from '@/components/auth/bookingHubAuthCardShell';
import { BookingHubSignUpPageShell } from '@/components/auth/BookingHubSignUpPageShell';
import { bhGap, bhMarginBottom, bhMarginTop, bhPadding, bhPaddingX, bhSpacing, bhSpaceY } from '@/components/booking-hub-space';
import { bhRounded } from '@/components/booking-hub-radius';

const partnerPasswordAndTermsSchema = accountPasswordObjectSchema.omit({ termsAccepted: true }).extend({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the partner terms and conditions',
  }),
});

const partnerSignupFormSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    role: z.string(),
  })
  .merge(partnerPasswordAndTermsSchema)
  .refine(accountPasswordMatchRefine.fn, {
    message: accountPasswordMatchRefine.message,
    path: [accountPasswordMatchRefine.path[0]],
  });

type PartnerSignupFormValues = z.infer<typeof partnerSignupFormSchema>;

export default function PartnerSignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PartnerSignupFormValues>({
    resolver: zodResolver(partnerSignupFormSchema),
    defaultValues: { role: 'landlord', termsAccepted: false },
  });

  const passwordPreview = watch('password', '');

  const handleResendEmail = async () => {
    if (!submittedEmail || resendLoading) return;
    setResendLoading(true);
    setResendError(null);
    setResendSuccess(false);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jfgm6v6pkw.us-east-1.awsapprunner.com/api';
      const res = await fetch(`${backendUrl}/partner-signup/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail }),
      });
      const result = await res.json();
      if (!res.ok) setResendError(result.error || 'Failed to resend.');
      else setResendSuccess(true);
    } catch {
      setResendError('An error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (data: PartnerSignupFormValues) => {
    setLoading(true);
    setError(null);
    setResendError(null);
    setResendSuccess(false);
    const normalizedEmail = data.email.toLowerCase().trim();

    try {
      const { data: existingContractor } = await supabase
        .from('contractor')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();
      if (existingContractor) {
        setError('This email is already in use. Try a different email.');
        setLoading(false);
        return;
      }
      const { data: existingLandlord } = await supabase
        .from('landlord')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();
      if (existingLandlord) {
        setError('This email is already in use. Try a different email.');
        setLoading(false);
        return;
      }
    } catch {
      /* allow duplicate check to fail silently */
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jfgm6v6pkw.us-east-1.awsapprunner.com/api';
      const res = await fetch(`${backendUrl}/partner-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: normalizedEmail,
          phone: data.phone,
          companyName: data.companyName,
          password: data.password,
          confirmPassword: data.confirmPassword,
          termsAccepted: data.termsAccepted,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setSubmittedEmail(normalizedEmail);
        setSuccess(true);
      } else {
        const msg = result.error || 'Signup failed. Please try again.';
        setError(
          msg.toLowerCase().includes('email') || msg.toLowerCase().includes('duplicate')
            ? 'This email is already in use. Try a different email.'
            : msg,
        );
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
        <h1 className={cn('bh-h1 font-bold tracking-tight', bhMarginBottom('md'))}>Sign up as a partner</h1>
        <p className="bh-lead">Start your 30-day free trial.</p>
      </div>
    </header>
  );

  const formBody = (
    <form className={cn('flex w-full flex-col', bhGap('6'), 'md:gap-8')} onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" value="landlord" {...register('role')} />

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
            We&apos;ve sent a confirmation email to <strong>{submittedEmail}</strong>. Click the link to activate your
            account. It may take up to 5–10 minutes to arrive.
          </p>
          <div
            className={cn(
              'flex flex-wrap items-center justify-center',
              bhMarginTop('3'),
              bhGap('3'),
              BH_AUTH_HUB_PRIMARY_STACK_WIDTH,
            )}
          >
            <BookingHubLinkColorButton
              type="button"
              responsive
              onClick={handleResendEmail}
              loading={resendLoading}
              loadingText="Sending…"
              className="underline hover:text-booking-dark hover:[&_svg]:text-booking-dark sm:text-sm"
            >
              Resend confirmation email
            </BookingHubLinkColorButton>
          </div>
          {resendError && (
            <p className={cn('bh-small font-avenir-regular text-red-600', bhMarginTop('2'))}>{resendError}</p>
          )}
          {resendSuccess && (
            <p className={cn('bh-small font-avenir-regular text-green-600', bhMarginTop('2'))}>
              Confirmation email resent.
            </p>
          )}
        </div>
      )}

      <div className={bhSpaceY('4')}>
        <div className={BH_HUB_AUTH_FIELD_GRID_CLASSES}>
          <div>
            <BookingHubInputField
              id="bh-partner-signup-name"
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
              id="bh-partner-signup-company"
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
          <div>
            <BookingHubInputField
              id="bh-partner-signup-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              label="Email"
              placeholder="Enter your email"
              error={errors.email?.message}
              size="md"
              icon={<Mail className="size-5 shrink-0" aria-hidden strokeWidth={2} />}
              {...register('email')}
            />
          </div>
          <div>
            <BookingHubPhoneField
              id="bh-partner-signup-phone"
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

      <AccountPasswordStep<PartnerSignupFormValues>
        register={register}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        sso={{ role: 'partner' }}
        fieldIdPrefix="bh-partner-signup"
        includeSso={false}
        fieldLayout="responsive"
        passwordHintVariant="checklist"
        passwordStrengthPreview={passwordPreview}
        termsHref="/partner-terms"
        termsLinkText="partner terms and conditions"
      />

      <div className={cn('flex w-full flex-col', bhGap('4'), 'md:gap-8', BH_AUTH_HUB_PRIMARY_STACK_WIDTH)}>
        <BookingHubPrimaryButton
          type="submit"
          fullWidth
          responsive
          disabled={loading || success}
          loading={loading}
          loadingText="Creating account…"
        >
          Get started
        </BookingHubPrimaryButton>

        <SSODivider centerLabel="or" />
        <SSOButtons role="partner" verb="sign-up" />
      </div>

      <p
        className={cn(
          'text-center font-avenir-regular text-sm font-normal leading-5 text-[#535862] lg:text-base lg:leading-6',
          BH_AUTH_HUB_PRIMARY_STACK_WIDTH,
        )}
      >
        <span className="inline-flex flex-wrap items-baseline justify-center">
          <span>
            Already have an account?{' '}
          </span>
          <BookingHubLinkColorButton
            type="button"
            responsive
            contentSized
            className="!min-h-0 h-auto !py-0 !px-0 align-baseline shadow-none"
            onClick={() => {
              window.location.href = '/auth/login?type=partner';
            }}
          >
            Log in
          </BookingHubLinkColorButton>
        </span>
      </p>
    </form>
  );

  return (
    <main className="font-avenir-regular">
      <BookingHubSignUpPageShell variant="hubCard">
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
            <AuthHubSegmentedTabs
              active="sign-up"
              signUpHref="/auth/signup/partner"
              logInHref="/auth/login?type=partner"
            />
            {formBody}
          </div>
        </>
      </BookingHubSignUpPageShell>
    </main>
  );
}
