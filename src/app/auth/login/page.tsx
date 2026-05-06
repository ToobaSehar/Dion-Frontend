'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BH_INPUT_FIELD_ICON_COLOR } from '@/components/bookingHubInputFieldTypography';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BH_GRID_SHELL_CLASSES } from '@/components/booking-hub-grid';
import { BookingHubSignUpPageShell } from '@/components/auth/BookingHubSignUpPageShell';
import { AuthHubSegmentedTabs, BH_AUTH_HUB_PRIMARY_STACK_WIDTH } from '@/components/auth/AuthHubSegmentedTabs';
import { BH_HUB_AUTH_CARD_WHITE } from '@/components/auth/bookingHubAuthCardShell';
import { bhGap, bhMarginBottom, bhMarginTop, bhPadding, bhPaddingX, bhPaddingY, bhSpacing } from '@/components/booking-hub-space';
import { bhRounded } from '@/components/booking-hub-radius';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'contractor';
  // Map 'partner' to 'landlord' and 'client' to 'contractor'
  const userType = typeParam === 'partner' ? 'landlord' : typeParam === 'client' ? 'contractor' : typeParam;

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Handle email not confirmed error
        if (error.message.includes('email not confirmed') || error.message.includes('Email not confirmed')) {
          setError('Your email is not confirmed. Please contact support or try signing up again.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError(error.message);
        }
        return;
      }

      // Get the verified user object from the active session
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        try {
          // Check contractor and landlord tables in parallel
          const [contractorResult, landlordResult] = await Promise.all([
            supabase.from('contractor').select('role, email').eq('id', authUser.id).maybeSingle(),
            supabase.from('landlord').select('role, email').eq('id', authUser.id).maybeSingle()
          ]);
          const { data: contractorProfile, error: contractorError } = contractorResult;
          const { data: landlordProfile, error: landlordError } = landlordResult;

          if (contractorError) {
            console.error('Contractor query error details:', {
              message: contractorError.message,
              details: contractorError.details,
              hint: contractorError.hint,
              code: contractorError.code
            });
          }

          // Determine expected user type based on URL parameter
          const expectedUserType = userType; // 'contractor' or 'landlord'

          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jfgm6v6pkw.us-east-1.awsapprunner.com/api';
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token ?? '';

          // If user is trying to login as contractor
          if (expectedUserType === 'contractor') {
            if (!contractorProfile) {
              await supabase.auth.signOut();
              setError('This email does not have a client account. Please sign up as a client or try logging in as a partner.');
              return;
            }

            // Check if contractor is active via backend API
            let activeCheckData: { success: boolean; isActive?: boolean } | null = null;
            try {
              const activeCheckResponse = await fetch(`${backendUrl}/client-login-check`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
                body: JSON.stringify({ userId: authUser.id }),
              });

              if (activeCheckResponse.ok) {
                activeCheckData = await activeCheckResponse.json();
              } else {
                // Server-side error (5xx/4xx) — sign out and block
                await supabase.auth.signOut();
                setError('Unable to verify account status. Please try again.');
                return;
              }
            } catch (networkError) {
              // Network/CORS/timeout error — do NOT sign the user out; their
              // Supabase session is still valid. Let them retry rather than
              // destroying their session, which is especially important on
              // Safari where restoring a session after sign-out is less reliable.
              console.error('Network error during contractor active check:', networkError);
              setError('Could not reach the server. Please check your internet connection and try again.');
              setLoading(false);
              return;
            }

            if (activeCheckData && activeCheckData.success && activeCheckData.isActive === false) {
              await supabase.auth.signOut();
              setError('Your account is currently inactive. Ask the admin to activate your account.');
              return;
            }

            if (activeCheckData && !activeCheckData.success) {
              await supabase.auth.signOut();
              setError('Unable to verify account status. Please try again.');
              return;
            }

            router.push('/client');
            return;
          }

          // If user is trying to login as landlord
          if (expectedUserType === 'landlord') {
            if (!landlordProfile) {
              await supabase.auth.signOut();
              setError('This email does not have a partner account. Please sign up as a partner or try logging in as a client.');
              return;
            }

            // Check if landlord is active via backend API
            let activeCheckData: { success: boolean; isActive?: boolean } | null = null;
            try {
              const activeCheckResponse = await fetch(`${backendUrl}/partner-login-check`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
                body: JSON.stringify({ userId: authUser.id }),
              });

              if (activeCheckResponse.ok) {
                activeCheckData = await activeCheckResponse.json();
              } else {
                await supabase.auth.signOut();
                setError('Unable to verify account status. Please try again.');
                return;
              }
            } catch (networkError) {
              console.error('Network error during landlord active check:', networkError);
              setError('Could not reach the server. Please check your internet connection and try again.');
              setLoading(false);
              return;
            }

            if (activeCheckData && activeCheckData.success && activeCheckData.isActive === false) {
              await supabase.auth.signOut();
              setError('Your account is currently inactive. Ask the admin to activate your account.');
              return;
            }

            if (activeCheckData && !activeCheckData.success) {
              await supabase.auth.signOut();
              setError('Unable to verify account status. Please try again.');
              return;
            }

            router.push('/partner');
            return;
          }

          // Fallback: If no userType specified, check both tables and redirect appropriately
          if (contractorProfile && !contractorError) {
            router.push('/client');
            return;
          }

          if (landlordProfile && !landlordError) {
            router.push('/partner');
            return;
          }

          // If no profile found in either table, sign them out and show error
          await supabase.auth.signOut();
          setError('No account profile found. Please contact support or create a new account.');
        } catch (error) {
          console.error('Error checking user profile:', error);
          // Sign out on error
          await supabase.auth.signOut();
          setError('An error occurred while checking your account. Please try again.');
        }
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signUpPath = userType === 'landlord' ? '/auth/signup/partner' : '/auth/signup/client';
  const logInHref = userType === 'landlord' ? '/auth/login?type=partner' : '/auth/login?type=client';

  return (
    <main className={cn('font-avenir-regular text-[#0B1D37] antialiased')}>
      <BookingHubSignUpPageShell variant="hubCard">
        <>
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
              <h1 className={cn('bh-h1 font-bold tracking-tight', bhMarginBottom('md'))}>Sign in</h1>
              <p className="bh-lead">Welcome back to Booking Hub.</p>
            </div>
          </header>

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
            <AuthHubSegmentedTabs active="log-in" signUpHref={signUpPath} logInHref={logInHref} />

            <form
              className={cn(
                'flex w-full flex-col',
                bhGap('6'),
                'md:gap-8',
                BH_AUTH_HUB_PRIMARY_STACK_WIDTH,
              )}
              onSubmit={handleSubmit(onSubmit)}
            >
              {error ? (
                <div
                  className={cn(
                    'border border-red-200 bg-red-50',
                    bhRounded('xl'),
                    bhSpacing(bhPadding('3'), 'sm:p-4'),
                  )}
                >
                  <p className="bh-small text-center text-red-800 sm:text-sm">{error}</p>
                </div>
              ) : null}

              {successMessage ? (
                <div
                  className={cn(
                    'border border-green-200 bg-green-50 text-center',
                    bhRounded('lg'),
                    bhPadding('4'),
                  )}
                >
                  <p className="bh-small text-center text-green-800 sm:text-sm">{successMessage}</p>
                </div>
              ) : null}

              <div className={cn('flex w-full flex-col', bhGap('4'), 'md:gap-6')}>
                <BookingHubInputField
                  id="bh-login-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  label="Email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  size="md"
                  icon={<Mail className="size-5 shrink-0 text-[#A4A7AE]" aria-hidden strokeWidth={2} />}
                  {...register('email')}
                />
                <BookingHubInputField
                  id="bh-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  size="md"
                  suffix={
                    <button
                      type="button"
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center p-0 outline-none transition-colors',
                        bhRounded('md'),
                        BH_INPUT_FIELD_ICON_COLOR,
                        'hover:text-[#0b1d37] focus-visible:ring-2 focus-visible:ring-booking-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                      )}
                      onClick={() => setShowPassword((v) => !v)}
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
                      )}
                    </button>
                  }
                  {...register('password')}
                />
              </div>

              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/auth/forgot-password';
                  }}
                  className="bh-small font-semibold text-booking-teal hover:text-booking-dark hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <BookingHubPrimaryButton
                type="submit"
                fullWidth
                responsive
                disabled={loading}
                loading={loading}
                loadingText="Signing in…"
              >
                Sign in
              </BookingHubPrimaryButton>

              <p
                className={cn(
                  'flex flex-wrap items-center justify-center text-center font-avenir-regular text-sm font-normal leading-5 text-[#535862]',
                  bhGap('1'),
                  BH_AUTH_HUB_PRIMARY_STACK_WIDTH,
                )}
              >
                <span>Don&apos;t have an account?</span>
                <Link
                  href={signUpPath}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = signUpPath;
                  }}
                  className="font-semibold text-[#008884] hover:underline"
                >
                  Create one here
                </Link>
              </p>

              <p className={cn('text-center', BH_AUTH_HUB_PRIMARY_STACK_WIDTH)}>
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                  }}
                  className="bh-small font-semibold text-[#717680] hover:text-booking-dark hover:underline"
                >
                  ← Go back to home
                </Link>
              </p>
            </form>
          </div>
        </>
      </BookingHubSignUpPageShell>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'flex min-h-[100svh] items-center justify-center bg-booking-bg font-avenir-regular text-[#0B1D37] antialiased',
            BH_GRID_SHELL_CLASSES,
            bhSpacing(bhPaddingY('3xl'), 'sm:py-8'),
          )}
        >
          <div className="h-12 w-12 animate-spin rounded-bh-full border-b-2 border-booking-teal" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
