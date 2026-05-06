/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'min-h-bh-input',
    'h-bh-input',
    'min-h-bh-button',
    'h-bh-button',
  ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderColor: {
        input: '#e5e7eb',
      },
      colors: {
        background: '#ffffff',
        foreground: '#0b1d37',
        ring: '#64748b',
        muted: {
          foreground: '#71717a',
        },
        // Booking Hub color palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Custom Booking Hub colors
        'booking-bg': '#F6F6F4',
        'booking-teal': '#00BAB5',
        'booking-gray': '#4B4E53',
        'booking-dark': '#0B1D37',
        /* Entry portal (/) — HSL tokens aligned with design spec */
        'entry-bg': 'hsl(40 7% 96%)',
        'entry-navy': 'hsl(214 68% 13%)',
        'entry-teal': 'hsl(178 100% 36.5%)',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /** Legacy class names — same stack as Figma (Inter) for backwards-compatible markup */
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        avenir: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'avenir-bold': ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'avenir-regular': ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        /** Figma Foundations → Spacing (legacy numeric + `6377:74654` extended steps) */
        '120': '30rem',
        '140': '35rem',
        '160': '40rem',
        '180': '45rem',
        '192': '48rem',
        '256': '64rem',
        '320': '80rem',
        '360': '90rem',
        '400': '100rem',
        '480': '120rem',
      },
      maxWidth: {
        /** Figma **Widths** (`6377:74654`) — `max-w-bh-*` via `bhMaxWidthContent` */
        'bh-xs': '20rem',
        'bh-sm': '24rem',
        'bh-md': '30rem',
        'bh-lg': '35rem',
        'bh-xl': '40rem',
        'bh-2xl': '48rem',
        'bh-3xl': '64rem',
        'bh-4xl': '80rem',
        'bh-5xl': '90rem',
        'bh-6xl': '100rem',
        'bh-7xl': '120rem',
        'bh-paragraph': '45rem',
      },
      minHeight: {
        /** Figma input row (40px) — `BookingHubInputField`, selects, `.bh-input` */
        'bh-input': 'var(--bh-input-height)',
        /** Figma Button CTA (48px) — hub buttons, `.bh-cta` */
        'bh-button': 'var(--bh-button-height)',
      },
      height: {
        'bh-input': 'var(--bh-input-height)',
        'bh-button': 'var(--bh-button-height)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        /** Figma **Radius** (`6377:75052`) — `bhRounded('md')` → `rounded-bh-md` */
        'bh-none': '0',
        'bh-xxs': '0.125rem',
        'bh-xs': '0.25rem',
        'bh-sm': '0.375rem',
        'bh-md': '0.5rem',
        'bh-lg': '0.625rem',
        'bh-xl': '0.75rem',
        'bh-2xl': '1rem',
        'bh-3xl': '1.25rem',
        'bh-4xl': '1.5rem',
        'bh-full': '9999px',
      },
      boxShadow: {
        'apple': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
