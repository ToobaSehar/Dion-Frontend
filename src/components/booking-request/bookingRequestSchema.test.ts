import { describe, expect, it } from 'vitest';
import { bookingRequestFormSchema, bookingRequestStep1Schema } from './bookingRequestSchema';

describe('bookingRequestStep1Schema', () => {
  it('accepts filled location and guests', () => {
    const r = bookingRequestStep1Schema.safeParse({
      city: 'Swansea',
      projectPostcode: 'SA1 1AA',
      teamSize: '4',
    });
    expect(r.success).toBe(true);
  });

  it('accepts empty strings', () => {
    const r = bookingRequestStep1Schema.safeParse({
      city: '',
      projectPostcode: '',
      teamSize: '',
    });
    expect(r.success).toBe(true);
  });
});

describe('bookingRequestFormSchema', () => {
  const base = {
    city: 'London',
    projectPostcode: 'E1',
    teamSize: '2',
    budgetPerPerson: '100',
    paymentFrequency: '',
    specialRequirements: '',
    name: 'Test User',
    companyName: 'Co',
    email: 'test@example.com',
    phone: '07123456789',
    password: 'Aa1!aaaa',
    confirmPassword: 'Aa1!aaaa',
    termsAccepted: true as boolean,
  };

  it('accepts valid payload', () => {
    const r = bookingRequestFormSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it('accepts weak password (no policy enforcement in schema)', () => {
    const r = bookingRequestFormSchema.safeParse({
      ...base,
      password: 'short',
      confirmPassword: 'short',
    });
    expect(r.success).toBe(true);
  });

  it('accepts mismatched passwords (no match rule in schema)', () => {
    const r = bookingRequestFormSchema.safeParse({
      ...base,
      confirmPassword: 'Aa1!aaaab',
    });
    expect(r.success).toBe(true);
  });

  it('accepts terms unchecked (no terms rule in schema)', () => {
    const r = bookingRequestFormSchema.safeParse({
      ...base,
      termsAccepted: false,
    });
    expect(r.success).toBe(true);
  });
});
