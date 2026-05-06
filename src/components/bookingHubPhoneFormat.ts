import type { CountryCode, Examples } from 'libphonenumber-js';
import {
  AsYouType,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';

const examplesTyped = examples as Examples;

/**
 * Extract national significant digits for `country` / `dialCode` from the raw field.
 * Prefer stripping the selected calling prefix; otherwise parse with `hintCountry`.
 *
 * Returns an empty string when:
 *  - the field is blank, OR
 *  - the user is mid-deleting the dial code itself (e.g. "+4" while dial is "+44")
 *    so callers can restore to the full dial code rather than producing garbage.
 */
export function stripDialToNationalDigits(
  value: string,
  dialCode: string,
  hintCountry: CountryCode,
): string {
  const noSpaces = value.replace(/\s/g, '');
  const dial = dialCode.replace(/\s/g, '');
  if (!noSpaces || noSpaces === '+') return '';
  if (noSpaces.startsWith(dial)) {
    return noSpaces.slice(dial.length).replace(/\D/g, '');
  }
  if (noSpaces.startsWith('+')) {
    // User is mid-deleting the dial code prefix (e.g. "+4" while dial is "+44") — treat as empty.
    if (dial.startsWith(noSpaces)) return '';
    const intl = parsePhoneNumberFromString(noSpaces);
    if (intl?.country === hintCountry) {
      return String(intl.nationalNumber);
    }
    // Unrecognised international prefix — strip the "+" and keep only digits.
    return noSpaces.slice(1).replace(/\D/g, '');
  }
  const asNational = parsePhoneNumberFromString(noSpaces, hintCountry);
  if (asNational) {
    return String(asNational.nationalNumber);
  }
  return noSpaces.replace(/\D/g, '');
}

/**
 * Canonical international display (spaces per libphonenumber), e.g. `+1 (555) 123-4567`, `+44 7700 900000`.
 * Builds `dialCode + nationalDigits`, parses with `country`, then {@link PhoneNumber.formatInternational}.
 *
 * Always returns at least the dial code — the field is never left blank (Airbnb/Google pattern).
 */
export function formatPhoneDisplay(country: CountryCode, dialCode: string, rawFieldValue: string): string {
  const nationalDigits = stripDialToNationalDigits(rawFieldValue, dialCode, country);
  const dial = dialCode.replace(/\s/g, '');
  // No national digits → restore to dial code only; prevents the field going blank.
  if (!nationalDigits) return dial;
  const compact = `${dial}${nationalDigits}`;
  try {
    const parsed = parsePhoneNumberFromString(compact, country);
    if (parsed) {
      return parsed.formatInternational();
    }
  } catch {
    /* fall through */
  }
  const ayt = new AsYouType(country);
  return ayt.input(compact);
}

/** After a country switch: national digits were read with `prevCountry`; format for `nextCountry`. */
export function formatPhoneFromNationalDigits(
  nextCountry: CountryCode,
  nextDialCode: string,
  nationalDigitsOnly: string,
): string {
  const digits = nationalDigitsOnly.replace(/\D/g, '');
  const dial = nextDialCode.replace(/\s/g, '');
  if (!digits) return dial;
  const compact = `${dial}${digits}`;
  try {
    const parsed = parsePhoneNumberFromString(compact, nextCountry);
    if (parsed) return parsed.formatInternational();
  } catch {
    /* fall through */
  }
  const ayt = new AsYouType(nextCountry);
  return ayt.input(compact);
}

/** Figma-style international example (e.g. `+1 (555) 000-0000` for US). */
export function getInternationalExamplePlaceholder(iso: string): string | undefined {
  try {
    const ex = getExampleNumber(iso as CountryCode, examplesTyped);
    return ex?.formatInternational();
  } catch {
    return undefined;
  }
}

/**
 * If pasted text is a parseable phone number, return country + formatted international.
 * Tries international parse first, then falls back to national parse with `hintCountry`.
 * Returns `undefined` when the text cannot be resolved to a valid number.
 */
export function tryParsePastedPhone(
  text: string,
  hintCountry?: CountryCode,
): { country: CountryCode; formatted: string } | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  try {
    // Prefer international parse (starts with "+")
    const intl = parsePhoneNumberFromString(trimmed);
    if (intl?.country) {
      return { country: intl.country, formatted: intl.formatInternational() };
    }
    // Fall back to national parse with hint (e.g. "07700900000" pasted while GB is selected)
    if (hintCountry) {
      const national = parsePhoneNumberFromString(trimmed, hintCountry);
      if (national?.country) {
        return { country: national.country, formatted: national.formatInternational() };
      }
    }
  } catch {
    /* ignore parse errors */
  }
  return undefined;
}

/**
 * Returns `true` when `value` is a fully-valid E.164 phone number.
 * Useful for form validation (Zod, react-hook-form, etc.).
 */
export function validatePhoneNumber(value: string): boolean {
  if (!value?.trim()) return false;
  try {
    return isValidPhoneNumber(value.trim());
  } catch {
    return false;
  }
}
