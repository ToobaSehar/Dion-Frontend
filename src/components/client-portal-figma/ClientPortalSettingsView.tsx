'use client';

import { useState, type ReactNode } from 'react';
import { AlertTriangle, Building2, CreditCard, ExternalLink, Save } from 'lucide-react';

import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPrimaryButton } from '@/components/booking-hub-button';
import { BookingHubSelectField, type BookingHubSelectOption } from '@/components/booking-hub-select';
import { cn } from '@/lib/utils';

const INK = '#0B1D37';
const TEAL = '#00BAB5';
const MUTED = '#4B4E53';

function CompanyFieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-avenir-regular text-sm font-semibold leading-5 text-[#0B1D37]">{children}</span>
  );
}

const SECTOR_OPTIONS: BookingHubSelectOption[] = [
  { value: 'contractors', label: 'Contractors' },
  { value: 'insurance-loss-adjusters', label: 'Insurance / Loss Adjusters' },
  { value: 'councils-housing-providers', label: 'Councils / Housing Providers' },
  { value: 'other', label: 'Other' },
];

export type ClientPortalSettingsViewProps = {
  className?: string;
  /** Partner Figma shell: Stripe onboarding + VAT notice replace the primary contact form. */
  variant?: 'client' | 'partner';
};

/**
 * **Account & Company Profile** — client Figma shell (static form until API wiring).
 */
export function ClientPortalSettingsView({ className, variant = 'client' }: ClientPortalSettingsViewProps) {
  const [sector, setSector] = useState('councils-housing-providers');

  return (
    <div className={cn('flex w-full flex-col gap-8 bg-[#F6F6F4] px-6 pb-20 pt-2 sm:px-8 sm:pb-24', className)}>
      <div className="flex min-w-0 flex-col gap-2">
        <h1
          className="font-avenir-regular text-2xl font-semibold leading-8 sm:text-[30px] sm:leading-[38px]"
          style={{ color: INK }}
        >
          Account &amp; Company Profile
        </h1>
        <p className="font-avenir-regular text-sm font-normal leading-5" style={{ color: MUTED }}>
          Manage your company details and payment methods.
        </p>
      </div>

      <section
        className="overflow-hidden rounded-xl border border-[#e9eaeb] bg-white shadow-[0px_1px_3px_rgba(10,13,18,0.08)]"
        aria-labelledby="company-details-heading"
      >
        <div className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-6">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 shrink-0" strokeWidth={1.5} style={{ color: TEAL }} aria-hidden />
            <h2
              id="company-details-heading"
              className="font-avenir-regular text-lg font-semibold leading-7 sm:text-xl sm:leading-8"
              style={{ color: INK }}
            >
              Company Details
            </h2>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-7">
            <div className="w-full min-w-0">
              <BookingHubInputField
                id="settings-company-name"
                name="companyName"
                type="text"
                label={<CompanyFieldLabel>Company Name</CompanyFieldLabel>}
                defaultValue="Acme Council"
                autoComplete="organization"
                size="md"
              />
            </div>

            <div className="w-full min-w-0">
              <BookingHubSelectField
                id="settings-sector"
                name="sector"
                label={<CompanyFieldLabel>Sector</CompanyFieldLabel>}
                size="md"
                options={SECTOR_OPTIONS}
                value={sector}
                onValueChange={setSector}
                placeholder="Select sector"
              />
            </div>

            <div className="w-full min-w-0">
              <BookingHubInputField
                id="settings-billing-address"
                name="billingAddress"
                type="text"
                label={<CompanyFieldLabel>Billing Address</CompanyFieldLabel>}
                defaultValue="City Hall, College Green, Bristol BS1 5TR"
                autoComplete="street-address"
                size="md"
                helperText="Changes to billing address take effect on the next invoice only."
              />
            </div>

            <div className="w-full min-w-0">
              <BookingHubInputField
                id="settings-vat"
                name="vatNumber"
                type="text"
                label={<CompanyFieldLabel>VAT Number</CompanyFieldLabel>}
                defaultValue="GB 123 4567 89"
                autoComplete="off"
                size="md"
                helperText="Changes to VAT number take effect on the next invoice only."
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col gap-3 sm:gap-4">
        {variant === 'partner' ? (
          <>
            <section
              className="overflow-hidden rounded-xl border border-[#e9eaeb] bg-white shadow-[0px_1px_3px_rgba(10,13,18,0.08)]"
              aria-labelledby="partner-stripe-onboarding-heading"
            >
              <div className="flex flex-col gap-6 p-5 sm:gap-7 sm:p-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 shrink-0" strokeWidth={1.75} style={{ color: TEAL }} aria-hidden />
                  <h2
                    id="partner-stripe-onboarding-heading"
                    className="font-avenir-regular text-lg font-semibold leading-7 sm:text-xl sm:leading-8"
                    style={{ color: INK }}
                  >
                    Stripe Onboarding
                  </h2>
                </div>

                <div className="rounded-xl border border-[#FEDF89] bg-[#FFFAEB] p-4 sm:p-5">
                  <div className="flex gap-4">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8A23E] text-white"
                      aria-hidden
                    >
                      <AlertTriangle className="size-5 shrink-0" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <span className="font-avenir-regular text-base font-semibold leading-6 text-[#0B1D37]">
                          Action required – Complete Stripe onboarding
                        </span>
                        <span className="font-avenir-regular inline-flex w-fit shrink-0 rounded-full bg-[#E8A23E] px-2.5 py-0.5 text-xs font-semibold uppercase leading-[18px] text-white">
                          Incomplete
                        </span>
                      </div>
                      <p className="font-avenir-regular text-sm font-normal leading-5 text-[#4B4E53]">
                        You need to complete Stripe Express onboarding before you can receive payouts. Bank details and
                        identity verification are handled securely by Stripe – we never store this information in the
                        portal.
                      </p>
                      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                        <BookingHubPrimaryButton
                          type="button"
                          responsive
                          responsiveCompact
                          iconTrailing={<ExternalLink className="size-5" strokeWidth={2} aria-hidden />}
                        >
                          Complete Onboarding
                        </BookingHubPrimaryButton>
                        <p className="font-avenir-regular text-xs font-normal leading-[18px] text-[#717680]">
                          Takes about 5 minutes • Secured by Stripe
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-avenir-regular text-sm font-normal leading-5 text-[#4B4E53]">
                  Bank details are managed securely through Stripe Express. We do not store bank or tax-ID information
                  in this portal.
                </p>
              </div>
            </section>

            <section
              className="overflow-hidden rounded-xl border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_3px_rgba(10,13,18,0.08)] sm:p-6"
              aria-label="VAT information"
            >
              <p className="font-avenir-regular text-sm font-normal leading-5 text-[#4B4E53]">
                VAT details are managed at the property level, not the account level. Navigate to My Properties to
                update VAT information for each property.
              </p>
            </section>
          </>
        ) : (
          <section
            className="overflow-hidden rounded-xl border border-[#e9eaeb] bg-white shadow-[0px_1px_3px_rgba(10,13,18,0.08)]"
            aria-labelledby="primary-contact-heading"
          >
            <div className="flex flex-col gap-6 p-5 sm:gap-7 sm:p-6">
              <h2
                id="primary-contact-heading"
                className="font-avenir-regular text-lg font-semibold leading-7 sm:text-xl sm:leading-8"
                style={{ color: INK }}
              >
                Primary Contact
              </h2>

              <div className="flex flex-col gap-6 sm:gap-7">
                <BookingHubInputField
                  id="settings-contact-full-name"
                  name="contactFullName"
                  type="text"
                  label={<CompanyFieldLabel>Full Name</CompanyFieldLabel>}
                  defaultValue="James Davies"
                  autoComplete="name"
                  size="md"
                />

                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
                  <BookingHubInputField
                    id="settings-contact-email"
                    name="contactEmail"
                    type="email"
                    label={<CompanyFieldLabel>Email</CompanyFieldLabel>}
                    defaultValue="james.davies@acmecouncil.gov.uk"
                    autoComplete="email"
                    size="md"
                  />
                  <BookingHubInputField
                    id="settings-contact-phone"
                    name="contactPhone"
                    type="tel"
                    label={<CompanyFieldLabel>Phone</CompanyFieldLabel>}
                    defaultValue="07712 345678"
                    autoComplete="tel"
                    size="md"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {variant !== 'partner' ? (
          <BookingHubPrimaryButton
            type="button"
            fullWidth
            responsive
            responsiveCompact
            iconLeading={<Save className="size-5" strokeWidth={2} aria-hidden />}
          >
            Save Changes
          </BookingHubPrimaryButton>
        ) : null}
      </div>
    </div>
  );
}
