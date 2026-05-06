/**
 * All supported calling countries from `libphonenumber-js/max` (Google lib rules),
 * with English labels via `Intl.DisplayNames` — used by {@link BookingHubPhoneField}.
 */
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/max';

export type BookingHubPhoneCountry = {
  value: string;
  /** ISO 3166-1 alpha-2 code, e.g. "GB". */
  iso: string;
  /** Unicode regional indicator flag emoji, e.g. "🇬🇧". */
  flag: string;
  /** E.164 calling code prefix including "+", e.g. "+44". */
  dialCode: string;
  label: string;
};

const displayNamesEn = new Intl.DisplayNames(['en'], { type: 'region' });

/** Converts ISO 3166-1 alpha-2 to a flag emoji via regional indicator symbols. */
function isoToFlag(iso: string): string {
  return iso
    .toUpperCase()
    .split('')
    .map((ch) => String.fromCodePoint(ch.charCodeAt(0) + 127397))
    .join('');
}

function buildCountries(): BookingHubPhoneCountry[] {
  const countries: BookingHubPhoneCountry[] = [];
  for (const code of getCountries()) {
    try {
      const callingCode = getCountryCallingCode(code);
      if (!callingCode) continue;
      countries.push({
        value: code,
        iso: code,
        flag: isoToFlag(code),
        dialCode: `+${callingCode}`,
        label: displayNamesEn.of(code) ?? code,
      });
    } catch {
      // Skip territories where libphonenumber-js throws (e.g. disputed regions)
    }
  }
  return countries;
}

/** Sorted A–Z by label; stable module singleton. */
export const BOOKING_HUB_PHONE_COUNTRIES: BookingHubPhoneCountry[] = buildCountries().sort((a, b) =>
  a.label.localeCompare(b.label, 'en'),
);

/** Longest calling codes first, then +1 → US first, then label. */
const BOOKING_HUB_PHONE_COUNTRIES_BY_PREFIX: BookingHubPhoneCountry[] = [...BOOKING_HUB_PHONE_COUNTRIES].sort(
  (a, b) => {
    if (b.dialCode.length !== a.dialCode.length) return b.dialCode.length - a.dialCode.length;
    if (a.dialCode === '+1' && b.dialCode === '+1') {
      if (a.value === 'US') return -1;
      if (b.value === 'US') return 1;
    }
    return a.label.localeCompare(b.label, 'en');
  },
);

export function findCountryByDialPrefix(phone: string): BookingHubPhoneCountry | undefined {
  const trimmed = phone.trim();
  for (const c of BOOKING_HUB_PHONE_COUNTRIES_BY_PREFIX) {
    if (trimmed.startsWith(c.dialCode)) return c;
  }
  return undefined;
}

export function findCountryByIso(iso: string): BookingHubPhoneCountry | undefined {
  return BOOKING_HUB_PHONE_COUNTRIES.find((c) => c.value === iso.toUpperCase());
}
