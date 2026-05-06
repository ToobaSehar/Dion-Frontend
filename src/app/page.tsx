'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BH_GRID_GUTTER_GAP_CLASSES, BH_GRID_SHELL_CLASSES } from '@/components/booking-hub-grid';
import { bhMarginBottom, bhPaddingX, bhPaddingY, bhSpacing } from '@/components/booking-hub-space';
import { bhRoundedSurfaceCard } from '@/components/booking-hub-radius';
import { cn } from '@/lib/utils';

export default function HomeEntryPage() {
  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      try {
        const hash = window.location.hash;
        const hasAuthToken =
          hash.includes('access_token') ||
          hash.includes('type=recovery') ||
          hash.includes('type=signup');

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const userRole = session.user.user_metadata?.role;

          if (userRole === 'admin') {
            const adminFrontendUrl =
              process.env.NEXT_PUBLIC_ADMIN_FRONTEND_URL ||
              (typeof window !== 'undefined' && window.location.hostname === 'localhost'
                ? 'http://localhost:3002'
                : 'https://admin.booking-hub.co.uk');

            window.location.href = `${adminFrontendUrl}/auth/login?message=Email confirmed successfully. Please sign in.`;
            return;
          }
        } else if (hasAuthToken) {
          setTimeout(async () => {
            const {
              data: { session: retrySession },
            } = await supabase.auth.getSession();
            if (retrySession?.user?.user_metadata?.role === 'admin') {
              const adminFrontendUrl =
                process.env.NEXT_PUBLIC_ADMIN_FRONTEND_URL ||
                (typeof window !== 'undefined' && window.location.hostname === 'localhost'
                  ? 'http://localhost:3002'
                  : 'https://admin.booking-hub.co.uk');
              window.location.href = `${adminFrontendUrl}/auth/login?message=Email confirmed successfully. Please sign in.`;
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminAndRedirect();
  }, []);

  const cardShellClass = cn(
    'group flex h-full flex-col overflow-hidden border border-solid border-[#e9eaeb] bg-white shadow-[0px_1px_2px_rgba(10,13,18,0.06)] transition-shadow duration-200 hover:shadow-[0px_4px_8px_-2px_rgba(10,13,18,0.10),0px_2px_4px_-2px_rgba(10,13,18,0.06)]',
    bhRoundedSurfaceCard(),
  );

  const cardLinkClass = cn(
    'flex min-h-0 flex-1 flex-col items-center text-center no-underline cursor-pointer text-[#0B1D37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2 focus-visible:ring-offset-booking-bg',
    bhPaddingX('3xl'),
    'pt-6 sm:px-8 sm:pt-8 md:px-10 md:pt-10 lg:px-12 lg:pt-12',
  );

  const cardCtaWrapClass = cn(
    'mt-auto flex w-full shrink-0 justify-center',
    bhPaddingX('3xl'),
    'pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-10 lg:px-12 lg:pb-12',
  );

  const getStartedArrow = (
    <ArrowRight
      className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden
    />
  );

  return (
    <main className="min-h-svh w-full bg-booking-bg font-avenir text-[#0B1D37] antialiased">
      <div
        className={cn(
          'flex min-h-svh w-full flex-col items-center justify-center',
          BH_GRID_SHELL_CLASSES,
          bhSpacing(bhPaddingY('4xl'), 'md:py-10', 'lg:py-16'),
        )}
      >
        <Link
          href="/"
          className={cn('inline-flex', bhMarginBottom('4xl'), 'md:mb-10 lg:mb-12')}
          aria-label="Booking Hub home"
        >
          <Image
            src="/blue-teal.webp"
            alt="Booking Hub"
            width={320}
            height={96}
            priority
            className="bh-logo w-auto"
          />
        </Link>

        <div
          className={cn(
            'grid w-full max-w-md grid-cols-1 items-stretch md:max-w-2xl md:grid-cols-2 lg:max-w-3xl xl:max-w-4xl',
            BH_GRID_GUTTER_GAP_CLASSES,
          )}
        >
          <div className={cardShellClass}>
            <Link
              href="/booking-request"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/booking-request';
              }}
              className={cardLinkClass}
            >
              <p className={cn('bh-card-title text-[#0B1D37]', bhMarginBottom('md'), 'md:mb-3')}>I&apos;m a client</p>
              <p className="bh-card-subtext bh-card-subtext--pair text-[#0B1D37]">Company or organisation</p>
              <p className="bh-card-subtext bh-card-subtext--before-cta text-[#0B1D37]">
                Book accommodation and manage
                <br />
                bookings
              </p>
            </Link>
            <div className={cardCtaWrapClass}>
              <BookingHubPrimaryButton
                type="button"
                fullWidth
                responsive
                iconTrailing={getStartedArrow}
                onClick={() => {
                  window.location.href = '/booking-request';
                }}
              >
                Get Started
              </BookingHubPrimaryButton>
            </div>
          </div>

          <div className={cardShellClass}>
            <Link
              href="/auth/signup/partner"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/auth/signup/partner';
              }}
              className={cardLinkClass}
            >
              <p className={cn('bh-card-title text-[#0B1D37]', bhMarginBottom('md'), 'md:mb-3')}>
                I&apos;m a property partner
              </p>
              <p className="bh-card-subtext bh-card-subtext--pair text-[#0B1D37]">Management company or operator</p>
              <p className="bh-card-subtext bh-card-subtext--before-cta text-[#0B1D37]">
                List properties and manage bookings
              </p>
            </Link>
            <div className={cardCtaWrapClass}>
              <BookingHubPrimaryButton
                type="button"
                fullWidth
                responsive
                iconTrailing={getStartedArrow}
                onClick={() => {
                  window.location.href = '/auth/signup/partner';
                }}
              >
                Get Started
              </BookingHubPrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
