'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

  const cardLinkClass =
    'group flex flex-col items-center text-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer no-underline h-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F6F4]';

  return (
    <main
      className="min-h-svh w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 antialiased font-avenir bg-[#F6F6F4] text-[#0B1D37]"
    >
      <Link href="/" className="inline-flex mb-8 md:mb-10 lg:mb-12" aria-label="Booking Hub home">
        <Image
          src="/blue-teal.webp"
          alt="Booking Hub"
          width={320}
          height={96}
          priority
          className="bh-logo w-auto"
        />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl items-stretch">
        <Link
          href="/booking-request"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/booking-request';
          }}
          className={cardLinkClass}
          style={{ backgroundColor: '#0B1D37' }}
        >
          <p className="text-white bh-card-title mb-2 md:mb-3">I&apos;m a client</p>
          <p className="bh-card-subtext bh-card-subtext--pair">Company or organisation</p>
          <p className="bh-card-subtext bh-card-subtext--before-cta">
            Book accommodation and manage
            <br />
            bookings
          </p>
          <div
            className="bh-cta mt-auto"
            style={{ backgroundColor: '#00BAB5', color: '#FFFFFF' }}
          >
            Get Started
            <ArrowRight
              className="h-4 w-4 shrink-0 text-inherit transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </div>
        </Link>

        <Link
          href="/auth/signup/partner"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/auth/signup/partner';
          }}
          className={cardLinkClass}
          style={{ backgroundColor: '#0B1D37' }}
        >
          <p className="text-white bh-card-title mb-2 md:mb-3">I&apos;m a property partner</p>
          <p className="bh-card-subtext bh-card-subtext--pair">Management company or operator</p>
          <p className="bh-card-subtext bh-card-subtext--before-cta">
            List properties and manage bookings
          </p>
          <div
            className="bh-cta mt-auto"
            style={{ backgroundColor: '#00BAB5', color: '#FFFFFF' }}
          >
            Get Started
            <ArrowRight
              className="h-4 w-4 shrink-0 text-inherit transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </div>
        </Link>
      </div>
    </main>
  );
}
