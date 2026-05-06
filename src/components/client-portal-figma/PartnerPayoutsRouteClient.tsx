'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ClientPortalMainTopBar } from '@/components/client-portal-figma/ClientPortalMainTopBar';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { partnerPayoutBreakdownHref } from '@/components/client-portal-figma/partnerPayoutBreakdownData';
import { PartnerPortalPayoutsView } from '@/components/client-portal-figma/PartnerPortalPayoutsView';
import {
  PARTNER_PORTAL_PAYOUTS_HREF,
  type PartnerPortalFigmaMainView,
} from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return 'P';
}

export type PartnerPayoutsRouteClientProps = {
  className?: string;
};

/**
 * Partner shell for **Payouts** at `{@link PARTNER_PORTAL_PAYOUTS_HREF}`.
 */
export function PartnerPayoutsRouteClient({ className }: PartnerPayoutsRouteClientProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const [landlordName, setLandlordName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadLandlord = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('landlord')
      .select('full_name, company_name')
      .eq('id', user.id)
      .maybeSingle();
    if (!error && data) {
      setLandlordName(data.full_name || user.full_name || '');
      setCompanyName(data.company_name || '');
    } else {
      setLandlordName(user.full_name || '');
    }
  }, [user?.id, user?.full_name]);

  useEffect(() => {
    if (user?.role === 'landlord') {
      void loadLandlord();
    }
  }, [user?.role, loadLandlord]);

  useEffect(() => {
    const el = mainRef.current;
    if (el) el.scrollTop = 0;
  }, []);

  const displayName = landlordName || user?.full_name || '';
  const userInitials = useMemo(() => initialsFromName(displayName || 'Partner'), [displayName]);
  const profileSubtitle = companyName || 'Partner';

  const handlePartnerNav = useCallback(
    (view: PartnerPortalFigmaMainView) => {
      if (view === 'contact-info') {
        router.push('/partner?tab=contact-info');
        return;
      }
      if (view === 'dashboard') {
        router.push('/partner/dashboard');
        return;
      }
      if (view === 'payouts') {
        router.push(PARTNER_PORTAL_PAYOUTS_HREF);
        return;
      }
      router.push(`/partner/dashboard?view=${encodeURIComponent(view)}`);
    },
    [router],
  );

  const confirmLogout = useCallback(async () => {
    setLogoutOpen(false);
    router.push('/');
    if (user) await signOut();
  }, [router, signOut, user]);

  if (loading) {
    return (
      <div className="flex h-svh items-center justify-center bg-[#F6F6F4]">
        <p className="font-avenir-regular text-sm text-[#4B4E53]">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'font-avenir-regular flex h-svh min-h-0 w-full overflow-hidden bg-white text-[#0b1d37]',
        className,
      )}
    >
      <ClientPortalSidebar
        portal="partner"
        activeMainView="payouts"
        onMainViewChange={handlePartnerNav}
        isCollapsed={sidebarCollapsed}
        partnerProfileCard={{
          initials: userInitials,
          name: displayName || 'Partner',
          subtitle: profileSubtitle,
        }}
        partnerOnLogout={() => setLogoutOpen(true)}
      />
      <main
        ref={mainRef}
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-auto bg-[#F6F6F4]',
          'pb-20 sm:pb-24',
        )}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-[#e9eaeb] bg-white shadow-[0px_1px_0px_rgba(10,13,18,0.04)]">
          <ClientPortalMainTopBar userInitials={userInitials} onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        </header>
        <div className="flex min-h-0 flex-1 flex-col pt-6">
          <PartnerPortalPayoutsView
            onPayoutBreakdownNavigate={(payoutRowId) => router.push(partnerPayoutBreakdownHref(payoutRowId))}
          />
        </div>
      </main>

      {logoutOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,29,55,0.45)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-payouts-logout-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#e9eaeb] bg-white p-6 shadow-xl">
            <h2 id="partner-payouts-logout-title" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
              Sign out?
            </h2>
            <p className="mt-2 font-avenir-regular text-sm text-[#4B4E53]">
              You will need to log in again to access your partner account.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-[#e9eaeb] px-4 py-2 text-sm font-medium text-[#4B4E53] hover:bg-[#F6F6F4]"
                onClick={() => setLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#0B1D37] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => void confirmLogout()}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
