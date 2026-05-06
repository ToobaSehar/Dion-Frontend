'use client';

import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import type { CountryCode } from 'libphonenumber-js';
import { AlertCircle, Check, ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BH_INPUT_FIELD_ERROR_MESSAGE,
  BH_INPUT_FIELD_HINT,
  BH_INPUT_FIELD_ICON_COLOR,
  BH_INPUT_FIELD_LABEL_ROW,
  BH_INPUT_FIELD_PLACEHOLDER_TEXT,
  BH_INPUT_FIELD_REQUIRED_DEFAULT,
  BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE,
  BH_INPUT_FIELD_STACK_GAP,
  BH_INPUT_FIELD_VALUE,
} from '@/components/bookingHubInputFieldTypography';
import { BH_RESPONSIVE_CONTROL_MIN_H } from '@/components/bookingHubControlHeight';
import { bhButtonResponsivePadding } from '@/components/booking-hub-button/bookingHubButtonSizes';
import {
  BH_SELECT_CHECK_ICON,
  BH_SELECT_MENU_BORDER,
  BH_SELECT_MENU_SHADOW,
} from '@/components/booking-hub-select/bookingHubSelectFieldTokens';
import {
  BOOKING_HUB_PHONE_COUNTRIES,
  findCountryByDialPrefix,
  findCountryByIso,
} from '@/components/bookingHubPhoneFieldCountries';
import {
  formatPhoneDisplay,
  getInternationalExamplePlaceholder,
  tryParsePastedPhone,
} from '@/components/bookingHubPhoneFormat';

/**
 * Hub phone field — Figma `3285:379950` (country + formatted `tel` + optional help):
 * https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/…?node-id=3285-379950
 *
 * Display uses `parsePhoneNumberFromString` → `formatInternational()` (Google lib rules) with
 * `AsYouType` fallback for incomplete numbers. Shell matches {@link BookingHubInputField}.
 */
export type BookingHubPhoneFieldSize = 'sm' | 'md';
export type BookingHubPhoneFieldVariant = 'default' | 'destructive';

function assignRef<T>(instance: T | null, r: React.Ref<T> | undefined) {
  if (!r) return;
  if (typeof r === 'function') r(instance);
  else (r as React.MutableRefObject<T | null>).current = instance;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((r) => assignRef(node, r));
  };
}

function setNativeInputValue(el: HTMLInputElement, value: string) {
  const proto = window.HTMLInputElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, 'value');
  desc?.set?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Count significant chars (digits + leading "+") before `cursorPos`. */
function countSignificantBefore(value: string, cursorPos: number): number {
  let n = 0;
  for (let i = 0; i < cursorPos && i < value.length; i++) {
    if (/[\d+]/.test(value[i])) n++;
  }
  return n;
}

/** Find the cursor index in `formatted` so that `sigCount` significant chars precede it. */
function findCursorFor(formatted: string, sigCount: number): number {
  let n = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/[\d+]/.test(formatted[i])) {
      n++;
      if (n === sigCount) return i + 1;
    }
  }
  return formatted.length;
}

export type BookingHubPhoneFieldProps = {
  label?: React.ReactNode;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: BookingHubPhoneFieldVariant;
  size?: BookingHubPhoneFieldSize;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  /** Initial ISO when empty — Figma default `US`. */
  defaultCountryIso?: string;
  showHelpIcon?: boolean;
  onHelpClick?: () => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>;

export const BookingHubPhoneField = forwardRef<HTMLInputElement, BookingHubPhoneFieldProps>(
  function BookingHubPhoneField(
    {
      label,
      placeholder,
      helperText,
      error,
      disabled,
      required,
      variant = 'default',
      size = 'md',
      className,
      fieldClassName,
      inputClassName,
      id: idProp,
      defaultCountryIso = 'US',
      showHelpIcon,
      onHelpClick,
      defaultValue,
      value: controlledValue,
      onChange,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const reactId = useId();
    const id = idProp ?? `bh-phone-${reactId}`;
    const countrySelectId = `${id}-country`;

    const innerRef = useRef<HTMLInputElement>(null);
    const hasError = Boolean(error);
    const destructive = variant === 'destructive' || hasError;

    const pad = bhButtonResponsivePadding();
    const shellMinH = BH_RESPONSIVE_CONTROL_MIN_H;
    const shellShadowXs = 'shadow-[0px_1px_2px_rgba(16,24,40,0.05)]';

    const shellClass = cn(
      'box-border flex w-full flex-row justify-start gap-1 rounded-[8px] transition-[border-color,box-shadow,background-color] lg:gap-1.5',
      'items-stretch overflow-hidden',
      pad,
      shellMinH,
      disabled &&
        cn(
          'cursor-not-allowed border border-solid border-gray-300 bg-[#fafafa]',
          shellShadowXs,
        ),
      !disabled &&
        destructive &&
        cn('border border-solid border-[#fda29b] bg-white', shellShadowXs),
      !disabled &&
        !destructive &&
        cn('border border-solid border-[#d5d7da] bg-white', shellShadowXs),
      !disabled &&
        'focus-within:border focus-within:border-solid focus-within:border-[#00cbc5] focus-within:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]',
    );

    const singleLineNativeInputClass = cn(
      'min-w-0 flex-1 border-0 bg-transparent p-0',
      BH_INPUT_FIELD_VALUE,
      'appearance-none rounded-none',
    );

    const inputTextClass = cn(
      singleLineNativeInputClass,
      'outline-none ring-0 shadow-none',
      'focus:!border-0 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none',
      'focus-visible:!border-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none',
      disabled && BH_INPUT_FIELD_PLACEHOLDER_TEXT,
    );

    const [countryIso, setCountryIso] = useState(defaultCountryIso);
    const selectedCountry = useMemo(
      () => findCountryByIso(countryIso) ?? findCountryByIso(defaultCountryIso)!,
      [countryIso, defaultCountryIso],
    );
    /**
     * `setNativeInputValue` dispatches a synchronous `input` event, so {@link handleInputChange}
     * runs before the `setCountryIso` re-render commits. Reading from this ref instead of the
     * closed-over state avoids re-formatting the new dial code with the *previous* country's
     * rules (which produced corrupt hybrids like `+44 1` when switching GB → US).
     */
    const selectedCountryRef = useRef(selectedCountry);
    selectedCountryRef.current = selectedCountry;
    /** Set true while we're programmatically replacing the value (country switch, paste, mount). */
    const programmaticChangeRef = useRef(false);

    const examplePlaceholder = useMemo(
      () => getInternationalExamplePlaceholder(selectedCountry.value),
      [selectedCountry.value],
    );
    const effectivePlaceholder = placeholder ?? examplePlaceholder ?? undefined;

    /** Sync + format when form state drives `value` (e.g. reset). */
    useEffect(() => {
      if (controlledValue == null) return;
      const el = innerRef.current;
      if (!el) return;
      const s = String(controlledValue).trim();
      if (!s) {
        const fallback = findCountryByIso(defaultCountryIso);
        if (fallback) selectedCountryRef.current = fallback;
        setCountryIso(defaultCountryIso);
        programmaticChangeRef.current = true;
        setNativeInputValue(el, '');
        programmaticChangeRef.current = false;
        return;
      }
      const c = findCountryByDialPrefix(s) ?? findCountryByIso(defaultCountryIso)!;
      selectedCountryRef.current = c;
      setCountryIso(c.value);
      const composed = formatPhoneDisplay(c.value as CountryCode, c.dialCode, s);
      if (composed !== el.value) {
        programmaticChangeRef.current = true;
        setNativeInputValue(el, composed);
        programmaticChangeRef.current = false;
      }
    }, [controlledValue, defaultCountryIso]);

    /**
     * Uncontrolled: format initial `defaultValue` once, or seed with the dial code when the
     * field starts empty (Airbnb / Google pattern — the field always shows at least the code).
     */
    useLayoutEffect(() => {
      if (controlledValue != null) return;
      const el = innerRef.current;
      if (!el) return;
      if (el.value.trim()) {
        const c = findCountryByDialPrefix(el.value) ?? findCountryByIso(defaultCountryIso);
        if (!c) return;
        selectedCountryRef.current = c;
        setCountryIso(c.value);
        const composed = formatPhoneDisplay(c.value as CountryCode, c.dialCode, el.value);
        if (composed !== el.value) {
          programmaticChangeRef.current = true;
          setNativeInputValue(el, composed);
          programmaticChangeRef.current = false;
        }
      } else {
        const c = findCountryByIso(defaultCountryIso);
        if (c) {
          selectedCountryRef.current = c;
          programmaticChangeRef.current = true;
          setNativeInputValue(el, c.dialCode.replace(/\s/g, ''));
          programmaticChangeRef.current = false;
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot on mount
    }, []);

    const selectOptions = useMemo(
      () =>
        BOOKING_HUB_PHONE_COUNTRIES.map((c) => ({
          value: c.value,
          flag: c.flag,
          label: c.label,
          dialCode: c.dialCode,
        })),
      [],
    );

    const applyCountryChange = useCallback(
      (nextIso: string, _prevIso: string) => {
        const el = innerRef.current;
        if (!el) return;
        const next = findCountryByIso(nextIso) ?? selectedCountryRef.current;
        const dial = next.dialCode.replace(/\s/g, '');

        // Update the ref *before* dispatching so the re-entrant `handleInputChange`
        // sees the new country, not the stale one.
        selectedCountryRef.current = next;
        programmaticChangeRef.current = true;
        setNativeInputValue(el, dial);
        programmaticChangeRef.current = false;
        setCountryIso(next.value);

        // Focus the input with the caret at the end so the user can keep typing
        // (Airbnb / Stripe behaviour).
        requestAnimationFrame(() => {
          el.focus();
          const len = el.value.length;
          el.setSelectionRange(len, len);
        });
      },
      [],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // setNativeInputValue dispatches a synchronous `input` event that React turns into
        // another onChange call. Bail out here so onChange fires exactly once per keystroke
        // and the cursor-restore rAF is not double-scheduled.
        if (programmaticChangeRef.current) return;

        const el = e.target;
        // Always read the *current* country from the ref — closure may be stale.
        const country = selectedCountryRef.current;

        // Preserve caret position across reformatting by counting significant chars before it.
        const cursorPos = el.selectionStart ?? el.value.length;
        const sigBefore = countSignificantBefore(el.value, cursorPos);

        const composed = formatPhoneDisplay(
          country.value as CountryCode,
          country.dialCode,
          el.value,
        );
        if (composed !== el.value) {
          programmaticChangeRef.current = true;
          setNativeInputValue(el, composed);
          programmaticChangeRef.current = false;
          // Restore the caret after React's render cycle has settled.
          const newCursor = findCursorFor(composed, sigBefore);
          requestAnimationFrame(() => {
            el.setSelectionRange(newCursor, newCursor);
          });
        }
        onChange?.({ ...e, target: el, currentTarget: el } as React.ChangeEvent<HTMLInputElement>);
      },
      [onChange],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        const text = e.clipboardData.getData('text/plain');
        // Pass the currently-selected country as a hint so national-format pastes
        // (e.g. "07700 900000" pasted while GB is selected) are handled correctly.
        const parsed = tryParsePastedPhone(text, selectedCountryRef.current.value as CountryCode);
        if (!parsed) return;
        e.preventDefault();
        const el = innerRef.current;
        if (!el) return;
        const c = findCountryByIso(parsed.country);
        if (c) selectedCountryRef.current = c;
        setCountryIso(parsed.country);
        programmaticChangeRef.current = true;
        setNativeInputValue(el, parsed.formatted);
        programmaticChangeRef.current = false;
      },
      [disabled],
    );

    const mergedRef = useCallback(mergeRefs(ref, innerRef), [ref]);

    const bottomMessage = hasError ? error : helperText;
    const showLabelRow = label != null && label !== '';

    const triggerTypo =
      size === 'sm'
        ? 'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#535862]'
        : 'font-avenir-regular text-sm font-normal leading-5 tracking-normal text-[#535862] lg:text-base lg:leading-6';

    return (
      <div className={cn('flex w-full flex-col', BH_INPUT_FIELD_STACK_GAP, className)}>
        {(showLabelRow || required) &&
          (showLabelRow && id ? (
            <label htmlFor={id} className={BH_INPUT_FIELD_LABEL_ROW}>
              <span>{label}</span>
              {required ? (
                <span
                  className={destructive ? BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE : BH_INPUT_FIELD_REQUIRED_DEFAULT}
                >
                  *
                </span>
              ) : null}
            </label>
          ) : (
            <div className={BH_INPUT_FIELD_LABEL_ROW}>
              {showLabelRow ? <span>{label}</span> : null}
              {required ? (
                <span className={destructive ? BH_INPUT_FIELD_REQUIRED_DESTRUCTIVE : BH_INPUT_FIELD_REQUIRED_DEFAULT}>
                  *
                </span>
              ) : null}
            </div>
          ))}

        <div className={cn('relative flex flex-col', BH_INPUT_FIELD_STACK_GAP, fieldClassName)}>
          <div className={shellClass}>
            <SelectPrimitive.Root
              value={countryIso}
              onValueChange={(v) => applyCountryChange(v, countryIso)}
              disabled={disabled}
            >
              <SelectPrimitive.Trigger
                id={countrySelectId}
                type="button"
                aria-label={`Country or region, ${selectedCountry.label}`}
                className={cn(
                  'flex shrink-0 items-center gap-0.5 self-stretch rounded-md bg-transparent py-0 outline-none',
                  'text-left transition-colors',
                  'hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booking-teal focus-visible:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  triggerTypo,
                  'pr-1',
                )}
              >
                <span className="whitespace-nowrap" aria-hidden>
                  {selectedCountry.flag}
                </span>
                <SelectPrimitive.Icon asChild>
                  <span className="flex size-4 shrink-0 items-center justify-center self-center overflow-hidden">
                    <ChevronDown className={cn('shrink-0', BH_INPUT_FIELD_ICON_COLOR, 'size-4')} aria-hidden strokeWidth={2} />
                  </span>
                </SelectPrimitive.Icon>
              </SelectPrimitive.Trigger>

              <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                  position="popper"
                  sideOffset={4}
                  className={cn(
                    'z-50 max-h-[min(320px,70vh)] overflow-hidden rounded-lg bg-white py-1',
                    BH_SELECT_MENU_BORDER,
                    BH_SELECT_MENU_SHADOW,
                    'min-w-[max(var(--radix-select-trigger-width),280px)]',
                    size === 'sm' ? 'text-sm leading-5' : 'text-base leading-6',
                    'font-avenir-regular tracking-normal',
                  )}
                >
                  <SelectPrimitive.Viewport className="max-h-[min(320px,70vh)] overflow-y-auto px-1.5 py-0">
                    {selectOptions.map((opt) => (
                      <SelectPrimitive.Item
                        key={opt.value}
                        value={opt.value}
                        className={cn(
                          'relative my-px flex w-full cursor-default select-none rounded-md outline-none',
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                          'data-[highlighted]:bg-[#fafafa]',
                          'data-[state=checked]:bg-[#fafafa]',
                        )}
                      >
                        <div className="flex w-full flex-1 items-center gap-2 overflow-hidden py-2.5 pl-2 pr-2.5">
                          <SelectPrimitive.ItemText asChild>
                            <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden whitespace-nowrap text-left">
                              <span aria-hidden className="shrink-0 text-base leading-none">
                                {opt.flag}
                              </span>
                              <span className="min-w-0 truncate font-medium text-[#0b1d37]">{opt.label}</span>
                              <span className="shrink-0 tabular-nums font-normal text-[#535862]">{opt.dialCode}</span>
                            </span>
                          </SelectPrimitive.ItemText>
                          <SelectPrimitive.ItemIndicator className="flex shrink-0">
                            <Check className={cn('size-5', BH_SELECT_CHECK_ICON)} strokeWidth={2} aria-hidden />
                          </SelectPrimitive.ItemIndicator>
                        </div>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>

            <div className="flex min-h-0 min-w-0 flex-1 items-center gap-2 self-stretch">
              <input
                ref={mergedRef}
                id={id}
                type="tel"
                autoComplete="tel"
                disabled={disabled}
                placeholder={effectivePlaceholder}
                defaultValue={defaultValue}
                {...(controlledValue !== undefined ? { value: controlledValue } : {})}
                onChange={handleInputChange}
                onPaste={handlePaste}
                onBlur={onBlur}
                aria-invalid={hasError || undefined}
                className={cn(inputTextClass, 'w-full min-w-0', inputClassName)}
                {...rest}
              />
              {showHelpIcon ? (
                <button
                  type="button"
                  tabIndex={-1}
                  className="flex size-5 shrink-0 items-center justify-center self-center text-[#a4a7ae] outline-none hover:text-[#717680] focus-visible:ring-2 focus-visible:ring-booking-teal focus-visible:ring-offset-2"
                  aria-label={typeof label === 'string' ? `${label} help` : 'Phone field help'}
                  onClick={(e) => {
                    e.preventDefault();
                    onHelpClick?.();
                  }}
                >
                  <HelpCircle className="size-4 shrink-0" aria-hidden strokeWidth={2} />
                </button>
              ) : null}
            </div>

            {hasError ? (
              <AlertCircle className="size-4 shrink-0 self-center text-[#f04438]" aria-hidden strokeWidth={2} />
            ) : null}
          </div>

          {bottomMessage ? (
            <p className={hasError ? BH_INPUT_FIELD_ERROR_MESSAGE : BH_INPUT_FIELD_HINT}>{bottomMessage}</p>
          ) : null}
        </div>
      </div>
    );
  },
);

BookingHubPhoneField.displayName = 'BookingHubPhoneField';
