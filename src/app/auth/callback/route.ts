import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const role = requestUrl.searchParams.get('role') || 'client';
  const returnTo = requestUrl.searchParams.get('return_to') || '';
  const { origin } = requestUrl;

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user already has a profile in the appropriate table
        const tableName = role === 'partner' ? 'landlord' : 'contractor';
        const { data: profile } = await supabase
          .from(tableName)
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile) {
          // New SSO user — needs to complete profile (company name, phone, T&Cs)
          const name = encodeURIComponent(
            user.user_metadata?.full_name || user.user_metadata?.name || ''
          );
          const email = encodeURIComponent(user.email || '');
          const rt = returnTo ? `&return_to=${encodeURIComponent(returnTo)}` : '';
          return NextResponse.redirect(
            `${origin}/auth/complete-profile?role=${role}&name=${name}&email=${email}${rt}`
          );
        }

        // Existing user — send to portal or original destination
        if (returnTo) {
          return NextResponse.redirect(`${origin}${returnTo}`);
        }
        const portal = role === 'partner' ? '/partner/dashboard' : '/client/dashboard';
        return NextResponse.redirect(`${origin}${portal}`);
      }
    }
  }

  // Fallback to home on any failure
  return NextResponse.redirect(`${origin}/`);
}
