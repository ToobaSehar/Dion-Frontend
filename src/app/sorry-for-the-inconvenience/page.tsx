import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scheduled maintenance | Booking Hub',
  description:
    'Booking Hub is temporarily unavailable while we complete scheduled maintenance.',
  robots: { index: false, follow: false },
};

export default function SorryForTheInconveniencePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-6 py-10 sm:py-12 bg-booking-bg font-avenir">
      <div className="card w-full max-w-lg p-8 sm:p-10 lg:p-12 text-center">
        <img
          src="/blue-teal.webp"
          alt="Booking Hub Logo"
          className="h-12 sm:h-14 w-auto mx-auto mb-8 object-contain max-w-full"
        />
        <h1
          className="text-2xl sm:text-3xl font-bold text-booking-dark mb-4 sm:mb-5 leading-tight"
          style={{ fontFamily: 'var(--font-avenir)', fontWeight: 700 }}
        >
          Sorry for the inconvenience
        </h1>
        <p
          className="text-base sm:text-lg text-booking-gray mb-4 leading-relaxed"
          style={{ fontFamily: 'var(--font-avenir)', fontWeight: 400 }}
        >
          Booking Hub is currently undergoing scheduled maintenance while we complete an
          important system update.
        </p>
        <p
          className="text-sm sm:text-base text-booking-gray mb-8 leading-relaxed"
          style={{ fontFamily: 'var(--font-avenir)', fontWeight: 400 }}
        >
          The platform will be available again shortly. Thank you for your patience while we
          complete this work safely.
        </p>
        <p
          className="text-xs sm:text-sm font-medium text-booking-teal"
          style={{ fontFamily: 'var(--font-avenir)', fontWeight: 500 }}
        >
          Scheduled maintenance in progress
        </p>
      </div>
    </main>
  );
}
