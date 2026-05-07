'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

import {
  AlertTriangle,
  Banknote,
  Bell,
  Building2,
  Calendar,
  CalendarCheck,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  MapPin,
  PoundSterling,
  Receipt,
  Users,
} from 'lucide-react';

import {
  clientPortalSidebarFigmaAssets as a,
  sidebarLayout,
} from '@/components/client-portal-figma/clientPortalFigmaSidebarDesignSystem';

import type { AdminPortalFigmaMainView } from '@/components/client-portal-figma/adminPortalFigmaMainView';
import type { ClientPortalFigmaMainView } from '@/components/client-portal-figma/clientPortalFigmaMainView';
import type { PartnerPortalFigmaMainView } from '@/components/client-portal-figma/partnerPortalFigmaMainView';
import { ClientPortalFigmaNavItem } from '@/components/client-portal-figma/ClientPortalFigmaNavItem';

import { cn } from '@/lib/utils';

/** Lucide stroke aligned with light nav labels (14px); SVG nav assets use the same value. */
const SIDEBAR_NAV_ICON_STROKE = 1;

const sectionHeadingClass =
  'font-avenir-regular w-full shrink-0 px-[16px] text-[11px] font-light uppercase leading-[16px] tracking-[0.06em] text-[#4B4E53]';

const PRIMARY_NAV_CLIENT: Array<{
  label: string;
  iconSrc?: string;
  iconKind?: 'layoutDashboard' | 'calendar' | 'credit';
}> = [
  { label: 'Dashboard', iconKind: 'layoutDashboard' },
  { label: 'New Request', iconSrc: a.navPlusCircle },
  { label: 'My Requests', iconSrc: a.navLayoutAlt03 },
  { label: 'My Bookings', iconKind: 'calendar' },
  { label: 'Payments', iconKind: 'credit' },
];

/** Partner Figma shell — primary nav matches client sidebar structure (Navigation + System). */
const PARTNER_PRIMARY_ITEMS: Array<{ label: string; view: PartnerPortalFigmaMainView }> = [
  { label: 'Dashboard', view: 'dashboard' },
  { label: 'Requests In My Area', view: 'requests-in-my-area' },
  { label: 'My Offers', view: 'my-offers' },
  { label: 'My Bookings', view: 'my-bookings' },
  { label: 'My Properties', view: 'my-properties' },
  { label: 'Payouts', view: 'payouts' },
];

/** Admin Figma shell — grouped nav (OPERATIONS / WORKFLOW / FINANCIALS / CRM); Lucide icons match admin reference. */
const ADMIN_NAV_GROUPS: Array<{
  section: string;
  items: Array<{ label: string; view: AdminPortalFigmaMainView }>;
}> = [
  {
    section: 'Operations',
    items: [
      { label: 'Dashboard', view: 'dashboard' },
      { label: 'Alerts', view: 'alerts' },
    ],
  },
  {
    section: 'Workflow',
    items: [
      { label: 'Requests', view: 'requests' },
      { label: 'Bookings', view: 'bookings' },
    ],
  },
  {
    section: 'Financials',
    items: [
      { label: 'Payments', view: 'payments' },
      { label: 'Payouts', view: 'payouts' },
      { label: 'Invoices', view: 'invoices' },
    ],
  },
  {
    section: 'CRM',
    items: [
      { label: 'Clients', view: 'clients' },
      { label: 'Partners', view: 'partners' },
      { label: 'Properties', view: 'properties' },
    ],
  },
];

function adminShellNavIcon(view: AdminPortalFigmaMainView): ReactNode {
  const cls = 'size-5 text-current';
  switch (view) {
    case 'dashboard':
      return <LayoutDashboard className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'alerts':
      return <AlertTriangle className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'requests':
      return <FileText className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'bookings':
      return <Calendar className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'payments':
      return <CreditCard className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'payouts':
      return <Banknote className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'invoices':
      return <Receipt className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'clients':
      return <Users className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'partners':
      return <Building2 className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'properties':
      return <Home className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    default:
      return null;
  }
}

function partnerPrimaryNavIcon(view: PartnerPortalFigmaMainView): ReactNode {
  const cls = 'size-5 text-current';
  switch (view) {
    case 'dashboard':
      return <LayoutDashboard className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'requests-in-my-area':
      return <MapPin className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'my-offers':
      return <FileText className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'my-bookings':
      return <CalendarCheck className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'my-properties':
      return <Building2 className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    case 'payouts':
      return <PoundSterling className={cls} strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />;
    default:
      return null;
  }
}

const FOOTER_NAV: Array<{
  label: string;
  iconSrc?: string;
  icon?: ReactNode;
}> = [
  {
    label: 'Notifications',
    icon: (
      <span className="relative block text-current">
        <Bell className="size-5 text-current" strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />
        <span className="pointer-events-none absolute -right-px -top-px size-2 rounded-full bg-[#00BAB5]" aria-hidden />
      </span>
    ),
  },
  { label: 'Settings', iconSrc: a.navSettings },
];

/** Booking Hub wordmark from `public/blue-teal.webp` (client portal dashboard shell). */
function ClientPortalFigmaSidebarLogo() {
  return (
    <div className="relative flex h-8 min-w-0 max-w-[160px] shrink items-center" data-node-id="1019:33137">
      <Image
        src="/blue-teal.webp"
        alt="Booking Hub"
        width={200}
        height={56}
        className="h-8 w-auto max-h-8 max-w-full object-contain object-left"
        sizes="160px"
        priority
      />
    </div>
  );
}

export type ClientPortalSidebarProps =
  | ({
      portal?: 'client';
      className?: string;
      isCollapsed?: boolean;
      activeMainView: ClientPortalFigmaMainView;
      onMainViewChange: (view: ClientPortalFigmaMainView) => void;
    })
  | ({
      portal: 'partner';
      className?: string;
      isCollapsed?: boolean;
      activeMainView: PartnerPortalFigmaMainView;
      onMainViewChange: (view: PartnerPortalFigmaMainView) => void;
      partnerProfileCard: { initials: string; name: string; subtitle: string };
      partnerOnLogout?: () => void;
    })
  | ({
      portal: 'admin';
      className?: string;
      isCollapsed?: boolean;
      activeMainView: AdminPortalFigmaMainView;
      onMainViewChange: (view: AdminPortalFigmaMainView) => void;
      /** Defaults to Booking Hub admin chip if omitted. */
      adminProfileCard?: { initials: string; name: string; subtitle: string };
      /** When set, the footer logout control is enabled (same pattern as partner). */
      adminOnLogout?: () => void;
    });

/**
 * Client / partner portal shell sidebar — same structure as Figma node `1765:460095`; reusable across screens.
 * (Tokens in `clientPortalFigmaSidebarDesignSystem.ts`.)
 */
export function ClientPortalSidebar(props: ClientPortalSidebarProps) {
  const { className, isCollapsed = false } = props;
  const isPartner = props.portal === 'partner';
  const isAdmin = props.portal === 'admin';
  const adminOnLogout = isAdmin ? props.adminOnLogout : undefined;

  const portalLabel = isPartner ? 'PARTNER PORTAL' : isAdmin ? 'ADMIN PORTAL' : 'CLIENT PORTAL';

  const profileChip = isPartner
    ? props.partnerProfileCard
    : isAdmin
      ? {
          initials: props.adminProfileCard?.initials ?? 'AD',
          name: props.adminProfileCard?.name ?? 'Admin User',
          subtitle: props.adminProfileCard?.subtitle ?? 'Platform Admin',
        }
      : { initials: 'JD', name: 'James Davies', subtitle: 'Acme Council' };

  const collapsedWidth = 64;
  const expandedWidth = sidebarLayout.sidebarWidthPx;
  const sidebarWidth = isCollapsed ? collapsedWidth : expandedWidth;

  return (
    <aside
      data-node-id="1765:460095"
      className={cn(
        'flex h-full min-h-0 shrink-0 flex-col border-r border-solid border-[#e9eaeb] bg-white',
        className,
      )}
      style={{ width: sidebarWidth, minWidth: sidebarWidth }}
    >
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        {/* Logo + portal label — hidden when collapsed */}
        {!isCollapsed ? (
          <div className="relative z-[2] flex w-full shrink-0 flex-col items-start gap-[20px] px-[20px] pt-[24px]">
            <div className="relative flex w-full min-w-0 shrink-0 items-center">
              <ClientPortalFigmaSidebarLogo />
              <div className="flex min-w-0 flex-1 items-center justify-center pl-4">
                <p className="font-avenir-regular shrink-0 whitespace-nowrap text-[14px] font-light uppercase leading-[20px] tracking-[0.08em] text-[#4B4E53]">
                  {portalLabel}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-[2] flex w-full shrink-0 items-center justify-center pt-[24px]">
            <Image
              src="/blue-teal-icon (1).webp"
              alt="Booking Hub"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <nav
            className={cn(
              'relative z-[1] flex w-full shrink-0 flex-col items-start pt-6',
              isCollapsed ? 'px-[4px]' : 'px-[16px]',
            )}
            aria-label="Primary"
            data-node-id="I1765:460095;1163:99019"
          >
            {!isAdmin && !isCollapsed ? <p className={cn(sectionHeadingClass, 'pb-1 pt-0')}>Navigation</p> : null}
            {!isPartner && !isAdmin ? (
              <>
                {PRIMARY_NAV_CLIENT.map((item) => {
                  const isDashboard = item.label === 'Dashboard';
                  const isPayments = item.label === 'Payments';
                  const isNewRequest = item.label === 'New Request';
                  const isMyRequests = item.label === 'My Requests';
                  const isMyBookings = item.label === 'My Bookings';
                  const active =
                    (isDashboard &&
                      (props.activeMainView === 'dashboard' || props.activeMainView === 'extend-rebook')) ||
                    (isPayments &&
                      (props.activeMainView === 'payments' || props.activeMainView === 'make-payment')) ||
                    (isNewRequest && props.activeMainView === 'new-request') ||
                    (isMyRequests &&
                      (props.activeMainView === 'my-requests' ||
                        props.activeMainView === 'request-detail' ||
                        props.activeMainView === 'request-confirm' ||
                        props.activeMainView === 'request-amendment')) ||
                    (isMyBookings && props.activeMainView === 'my-bookings');
                  const onClick = isDashboard
                    ? () => props.onMainViewChange('dashboard')
                    : isPayments
                      ? () => props.onMainViewChange('payments')
                      : isNewRequest
                        ? () => props.onMainViewChange('new-request')
                        : isMyRequests
                          ? () => props.onMainViewChange('my-requests')
                          : isMyBookings
                            ? () => props.onMainViewChange('my-bookings')
                            : undefined;

                  return (
                    <ClientPortalFigmaNavItem
                      key={item.label}
                      label={item.label}
                      iconSrc={item.iconSrc}
                      icon={
                        item.iconKind === 'layoutDashboard' ? (
                          <LayoutDashboard className="size-5 text-current" strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />
                        ) : item.iconKind === 'calendar' ? (
                          <Calendar className="size-5 text-current" strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />
                        ) : item.iconKind === 'credit' ? (
                          <CreditCard className="size-5 text-current" strokeWidth={SIDEBAR_NAV_ICON_STROKE} aria-hidden />
                        ) : undefined
                      }
                      active={active}
                      onClick={onClick}
                      iconOnly={isCollapsed}
                    />
                  );
                })}
              </>
            ) : isAdmin ? (
              <>
                {ADMIN_NAV_GROUPS.map((group, groupIndex) => (
                  <div key={group.section} className={cn('flex w-full flex-col items-start', groupIndex > 0 && 'mt-5')}>
                    {!isCollapsed ? (
                      <p className={cn(sectionHeadingClass, 'pb-1 pt-0')}>{group.section.toUpperCase()}</p>
                    ) : null}
                    {group.items.map((item) => (
                      <ClientPortalFigmaNavItem
                        key={item.view}
                        label={item.label}
                        icon={adminShellNavIcon(item.view)}
                        active={props.activeMainView === item.view}
                        onClick={() => props.onMainViewChange(item.view)}
                        iconOnly={isCollapsed}
                      />
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <>
                {PARTNER_PRIMARY_ITEMS.map((item) => (
                  <ClientPortalFigmaNavItem
                    key={item.label}
                    label={item.label}
                    icon={partnerPrimaryNavIcon(item.view)}
                    active={props.activeMainView === item.view}
                    onClick={() => props.onMainViewChange(item.view)}
                    iconOnly={isCollapsed}
                  />
                ))}
              </>
            )}
          </nav>

          {!isAdmin ? (
            <div
              className={cn(
                'flex w-full shrink-0 flex-col items-start pb-2 pt-6',
                isCollapsed ? 'px-[4px]' : 'px-[16px]',
              )}
              data-node-id="I1765:460095;1163:99026"
            >
              {!isCollapsed ? <p className={cn(sectionHeadingClass, 'pb-1 pt-0')}>System</p> : null}
              <nav className="relative flex w-full shrink-0 flex-col items-start" aria-label="Secondary" data-node-id="I1765:460095;1163:99027">
                {isPartner ? (
                  <ClientPortalFigmaNavItem
                    label="Account & Profile"
                    iconSrc={a.navSettings}
                    active={props.activeMainView === 'settings'}
                    onClick={() => props.onMainViewChange('settings')}
                    iconOnly={isCollapsed}
                  />
                ) : (
                  FOOTER_NAV.map((item) => {
                    const isNotifications = item.label === 'Notifications';
                    const isSettings = item.label === 'Settings';
                    const active =
                      (isNotifications && props.activeMainView === 'notifications') ||
                      (isSettings && props.activeMainView === 'settings');
                    const onClick = isNotifications
                      ? () => props.onMainViewChange('notifications')
                      : isSettings
                        ? () => props.onMainViewChange('settings')
                        : undefined;
                    return (
                      <ClientPortalFigmaNavItem
                        key={item.label}
                        label={item.label}
                        iconSrc={item.iconSrc}
                        icon={item.icon}
                        active={active}
                        onClick={onClick}
                        iconOnly={isCollapsed}
                      />
                    );
                  })
                )}
              </nav>
            </div>
          ) : null}
        </div>

        {/* Profile chip — full card when expanded, avatar-only when collapsed */}
        {isCollapsed ? (
          <div className="flex w-full shrink-0 flex-col items-center pb-[24px] pt-4">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[200px] border border-solid',
                isAdmin
                  ? 'border-[#00BAB5]/25 bg-[#00BAB5]/12'
                  : 'border-[rgba(0,0,0,0.08)] bg-[#00BAB5]',
              )}
            >
              <span
                className={cn(
                  'font-avenir-regular text-[14px] font-semibold leading-none',
                  isAdmin ? 'text-[#0B1D37]' : 'text-white',
                )}
              >
                {profileChip.initials}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex w-full shrink-0 flex-col px-[16px] pb-[24px] pt-4">
            <div className="relative flex w-full shrink-0 items-start gap-[16px] rounded-[12px] border border-solid border-[#e9eaeb] bg-white p-[12px] text-left">
              <div className="relative flex min-w-0 flex-1 items-center gap-[8px]" data-node-id="7616:376060">
                <div
                  className={cn(
                    'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[200px] border border-solid',
                    isAdmin
                      ? 'border-[#00BAB5]/25 bg-[#00BAB5]/12'
                      : 'border-[rgba(0,0,0,0.08)] bg-[#00BAB5]',
                  )}
                  data-node-id="I7616:376060;1034:778"
                >
                  <span
                    className={cn(
                      'font-avenir-regular text-[14px] font-semibold leading-none',
                      isAdmin ? 'text-[#0B1D37]' : 'text-white',
                    )}
                  >
                    {profileChip.initials}
                  </span>
                </div>
                <div
                  className="font-avenir-regular relative flex min-w-0 flex-1 flex-col items-start text-left text-[14px] leading-[20px] not-italic"
                  data-node-id="I7616:376060;82:2790"
                >
                  <p
                    className={cn(
                      'relative max-w-full truncate font-semibold',
                      isAdmin ? 'text-[#0B1D37]' : 'text-[#4B4E53]',
                    )}
                    data-node-id="I7616:376060;82:2788"
                  >
                    {profileChip.name}
                  </p>
                  <p
                    className={cn(
                      'relative max-w-full truncate font-normal',
                      isAdmin ? 'text-[#717680]' : 'text-[#4B4E53]',
                    )}
                    data-node-id="I7616:376060;82:2789"
                  >
                    {profileChip.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={isPartner || adminOnLogout ? 'Sign out' : undefined}
                aria-hidden={!(isPartner || adminOnLogout)}
                tabIndex={isPartner || adminOnLogout ? 0 : -1}
                className={cn(
                  'absolute right-[5px] top-[5px] flex items-start rounded-[6px] p-[6px] text-[#4B4E53] outline-none transition-colors hover:bg-[#F6F6F4] hover:text-[#0B1D37] focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2',
                  !isPartner && !adminOnLogout && 'pointer-events-none',
                )}
                data-node-id="7616:375995"
                onClick={() => {
                  if (isPartner && props.partnerOnLogout) props.partnerOnLogout();
                  if (isAdmin && adminOnLogout) adminOnLogout();
                }}
              >
                <span className="relative flex size-8 shrink-0 flex-wrap items-center justify-center rounded-[6px]">
                  <span className="relative size-5 shrink-0 overflow-visible">
                    <span className="absolute inset-[16.67%_29.17%]">
                      <span className="absolute inset-[-6.25%_-10%]">
                        <img src={a.navLogOut01} width={20} height={20} alt="" className="block max-w-none object-contain" decoding="async" />
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
