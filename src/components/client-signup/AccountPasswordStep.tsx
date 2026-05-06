'use client';

import type { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BH_INPUT_FIELD_HINT, BH_INPUT_FIELD_ICON_COLOR } from '@/components/bookingHubInputFieldTypography';
import { BookingHubPasswordRequirementChecklist } from '@/components/client-signup/BookingHubPasswordRequirementChecklist';
import { SSOButtons, SSODivider } from '@/components/SSOButtons';
import {
  BH_HUB_AUTH_FIELD_GRID_CLASSES,
  BH_HUB_AUTH_PASSWORD_GRID_CLASSES,
} from '@/components/auth/bookingHubAuthCardShell';
import { bhGap, bhMarginTop, bhSpacing, bhSpaceY } from '@/components/booking-hub-space';
import { bhRounded } from '@/components/booking-hub-radius';

type AccountPasswordKeys = {
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

export type AccountPasswordStepProps<T extends FieldValues & AccountPasswordKeys> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>;
  sso: {
    role: 'client' | 'partner';
    returnTo?: string;
    onBeforeRedirect?: () => void;
  };
  /** SSO row label: matches marketing “Continue with …” vs legacy “Sign in with …”. */
  ssoVerb?: 'continue' | 'sign-in' | 'sign-up';
  /** Center label in the divider (default from `SSODivider`). */
  dividerLabel?: string;
  termsHref?: string;
  termsLinkText?: string;
  /** Prefix for `id` / `htmlFor` (password, confirm, terms). */
  fieldIdPrefix: string;
  /**
   * When false, omits SSO + divider (caller renders them above, e.g. client signup before contact fields).
   * @default true
   */
  includeSso?: boolean;
  /**
   * @default 'default' — `stacked`: single column (Figma `1277:989` narrow / small viewports).
   * `responsive`: stacked on narrow viewports; two columns from `sm` with Figma grid gutters (same as `BH_HUB_AUTH_FIELD_GRID_CLASSES`).
   */
  fieldLayout?: 'default' | 'stacked' | 'responsive';
  /**
   * @default 'default' — `checklist`: three rules in one row under confirm, Figma `5039:376910` check + text.
   * Requires `passwordStrengthPreview`. (Same password rules as schema; display-only grouping.)
   */
  passwordHintVariant?: 'default' | 'checklist';
  /** Live password value for checklist rows (pass `watch('password')` from the parent form). */
  passwordStrengthPreview?: string;
};

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
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

/**
 * Reusable “account / password” block: SSO, divider, password fields, terms checkbox.
 * Embed inside a parent `<form>`; submit CTA stays with the caller.
 */
export function AccountPasswordStep<T extends FieldValues & AccountPasswordKeys>({
  register,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  sso,
  ssoVerb = 'sign-in',
  dividerLabel,
  termsHref = '/terms',
  termsLinkText = 'Booking Hub client terms and conditions',
  fieldIdPrefix,
  includeSso = true,
  fieldLayout = 'default',
  passwordHintVariant = 'default',
  passwordStrengthPreview = '',
}: AccountPasswordStepProps<T>) {
  const termsId = `${fieldIdPrefix}-termsAccepted`;
  const passwordId = `${fieldIdPrefix}-password`;
  const confirmId = `${fieldIdPrefix}-confirmPassword`;

  return (
    <>
      {includeSso ? (
        <section className={bhSpaceY('3')}>
          <SSOButtons
            role={sso.role}
            returnTo={sso.returnTo}
            onBeforeRedirect={sso.onBeforeRedirect}
            verb={ssoVerb}
          />
          <SSODivider centerLabel={dividerLabel} />
        </section>
      ) : null}

      <section className={cn(bhSpaceY('4'), includeSso && bhSpacing(bhMarginTop('6'), 'md:mt-8'))}>
        {fieldLayout === 'responsive' ? (
          <>
            <div className={BH_HUB_AUTH_PASSWORD_GRID_CLASSES}>
              <div className={cn('flex min-w-0 flex-col', bhGap('4'))}>
                <BookingHubInputField
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  label="Password"
                  placeholder="Create a password"
                  error={errors.password?.message as string | undefined}
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
                      <EyeIcon open={showPassword} />
                    </button>
                  }
                  {...register('password' as Path<T>)}
                />
              </div>
              <div className={cn('flex w-full flex-col', bhGap('sm'))}>
                <BookingHubInputField
                  id={confirmId}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  label="Confirm password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword?.message as string | undefined}
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
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  }
                  {...register('confirmPassword' as Path<T>)}
                />
                {passwordHintVariant === 'default' ? (
                  <p className={BH_INPUT_FIELD_HINT}>
                    8+ characters, uppercase letter, number, special character.
                  </p>
                ) : null}
              </div>
            </div>
            {passwordHintVariant === 'checklist' ? (
              <div className="w-full pt-4">
                <BookingHubPasswordRequirementChecklist passwordStrengthPreview={passwordStrengthPreview} />
              </div>
            ) : null}
          </>
        ) : fieldLayout === 'stacked' ? (
          <>
            <div className={cn('flex w-full flex-col', bhGap('4'))}>
              <BookingHubInputField
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                label="Password"
                placeholder="Create a password"
                error={errors.password?.message as string | undefined}
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
                    <EyeIcon open={showPassword} />
                  </button>
                }
                {...register('password' as Path<T>)}
              />
              <div className={cn('flex w-full flex-col', bhGap('sm'))}>
                <BookingHubInputField
                  id={confirmId}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  label="Confirm password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword?.message as string | undefined}
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
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  }
                  {...register('confirmPassword' as Path<T>)}
                />
                {passwordHintVariant === 'default' ? (
                  <p className={BH_INPUT_FIELD_HINT}>
                    8+ characters, uppercase letter, number, special character.
                  </p>
                ) : null}
              </div>
            </div>
            {passwordHintVariant === 'checklist' ? (
              <div className="w-full pt-3">
                <BookingHubPasswordRequirementChecklist passwordStrengthPreview={passwordStrengthPreview} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className={BH_HUB_AUTH_FIELD_GRID_CLASSES}>
              <div className={cn('flex min-w-0 flex-col', bhGap('4'))}>
                <BookingHubInputField
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  label="Password"
                  placeholder="Enter password"
                  error={errors.password?.message as string | undefined}
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
                      <EyeIcon open={showPassword} />
                    </button>
                  }
                  {...register('password' as Path<T>)}
                />
              </div>
              <div className={cn('flex w-full flex-col', bhGap('sm'))}>
                <BookingHubInputField
                  id={confirmId}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  label="Confirm password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword?.message as string | undefined}
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
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  }
                  {...register('confirmPassword' as Path<T>)}
                />
                {passwordHintVariant === 'default' ? (
                  <p className={BH_INPUT_FIELD_HINT}>
                    8+ characters, uppercase letter, number, special character.
                  </p>
                ) : null}
              </div>
            </div>
            {passwordHintVariant === 'checklist' ? (
              <div className="w-full pt-4">
                <BookingHubPasswordRequirementChecklist passwordStrengthPreview={passwordStrengthPreview} />
              </div>
            ) : null}
          </>
        )}
      </section>

      <div className={cn('flex items-start', bhGap('3'))}>
        <input
          {...register('termsAccepted' as Path<T>)}
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
        <p className="bh-small -mt-2 text-red-600">{errors.termsAccepted.message as string}</p>
      ) : null}
    </>
  );
}
