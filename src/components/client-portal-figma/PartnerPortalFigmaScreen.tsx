'use client';

import { Suspense, useCallback, useEffect, useMemo, useState, type ComponentProps } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import AddPropertyModal, {
  PARTNER_MANUAL_LISTING_EDIT_SCREENSHOT_PRESET,
} from '@/components/AddPropertyModal';
import { ClientPortalSidebar } from '@/components/client-portal-figma/ClientPortalSidebar';
import { PartnerPortalFigmaDashboard } from '@/components/client-portal-figma/PartnerPortalFigmaDashboard';
import type { PartnerPortalFigmaMainView } from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import {
  PARTNER_PORTAL_HUB_VIEW_QUERY_KEY,
  PARTNER_PORTAL_PAYOUTS_HREF,
  partnerHubMainViewFromSearchParam,
} from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { useAuth } from '@/lib/auth-context';
import { partnerSubmitNewProperty } from '@/lib/partner-submit-property';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  return 'P';
}

function firstNameFromFull(full: string): string {
  const p = full.trim().split(/\s+/)[0];
  return p || 'there';
}

function PartnerPortalFigmaScreenInner({ className }: { className?: string }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewKey = searchParams.get(PARTNER_PORTAL_HUB_VIEW_QUERY_KEY);

  const [mainView, setMainView] = useState<PartnerPortalFigmaMainView>(() =>
    partnerHubMainViewFromSearchParam(viewKey),
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [landlordName, setLandlordName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [addPropertyInitialManual, setAddPropertyInitialManual] = useState<
    ComponentProps<typeof AddPropertyModal>['initialManualListing']
  >(null);

  useEffect(() => {
    setMainView(partnerHubMainViewFromSearchParam(viewKey));
  }, [viewKey]);

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

  const displayName = landlordName || user?.full_name || '';
  const firstName = useMemo(() => firstNameFromFull(displayName), [displayName]);
  const userInitials = useMemo(() => initialsFromName(displayName || 'Partner'), [displayName]);

  const profileSubtitle = companyName || 'Partner';

  const handlePartnerNav = useCallback(
    (view: PartnerPortalFigmaMainView) => {
      setIsAddPropertyModalOpen(false);
      setAddPropertyInitialManual(null);
      if (view === 'my-properties') {
        setMainView('my-properties');
        return;
      }
      if (view === 'contact-info') {
        router.push('/partner?tab=contact-info');
        return;
      }
      if (view === 'payouts') {
        router.push(PARTNER_PORTAL_PAYOUTS_HREF);
        return;
      }
      setMainView(view);
    },
    [router],
  );

  const handleAddPropertySubmit = useCallback(async (propertyData: any) => {
    await partnerSubmitNewProperty(user?.id, propertyData);
  }, [user?.id]);

  const onAddProperty = useCallback(() => {
    setAddPropertyInitialManual(null);
    setIsAddPropertyModalOpen(true);
  }, []);

  const onEditPartnerProperty = useCallback(() => {
    setAddPropertyInitialManual({
      title: 'Edit Property',
      subtitle: 'Update your listing details and availability.',
      values: PARTNER_MANUAL_LISTING_EDIT_SCREENSHOT_PRESET,
    });
    setIsAddPropertyModalOpen(true);
  }, []);

  const onViewRequest = useCallback(() => {
    router.push('/partner?tab=my-properties');
  }, [router]);

  const onAddNow = useCallback(() => {
    setAddPropertyInitialManual(null);
    setIsAddPropertyModalOpen(true);
  }, []);

  const onCloseListProperty = useCallback(() => {
    setIsAddPropertyModalOpen(false);
    setAddPropertyInitialManual(null);
  }, []);

  const onCompleteProfile = useCallback(() => {
    router.push('/partner?tab=contact-info');
  }, [router]);

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
        activeMainView={mainView}
        onMainViewChange={handlePartnerNav}
        isCollapsed={sidebarCollapsed}
        partnerProfileCard={{
          initials: userInitials,
          name: displayName || 'Partner',
          subtitle: profileSubtitle,
        }}
        partnerOnLogout={() => setLogoutOpen(true)}
      />
      <PartnerPortalFigmaDashboard
        activeMainView={mainView}
        userInitials={userInitials}
        firstName={firstName}
        onAddProperty={onAddProperty}
        onViewRequest={onViewRequest}
        onAddNow={onAddNow}
        onCompleteProfile={onCompleteProfile}
        listPropertyOpen={isAddPropertyModalOpen}
        onCloseListProperty={onCloseListProperty}
        onSubmitListProperty={handleAddPropertySubmit}
        addPropertyInitialManual={addPropertyInitialManual}
        onEditPartnerProperty={onEditPartnerProperty}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
      />

      {logoutOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,29,55,0.45)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-logout-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#e9eaeb] bg-white p-6 shadow-xl">
            <h2 id="partner-logout-title" className="font-avenir-regular text-lg font-semibold text-[#0B1D37]">
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

/** Full desktop frame — partner shell reusing client Figma sidebar + top bar. */
export function PartnerPortalFigmaScreen({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'font-avenir-regular flex min-h-svh items-center justify-center bg-[#F6F6F4] text-sm text-[#4B4E53]',
            className,
          )}
        >
          Loading…
        </div>
      }
    >
      <PartnerPortalFigmaScreenInner className={className} />
    </Suspense>
  );
}
