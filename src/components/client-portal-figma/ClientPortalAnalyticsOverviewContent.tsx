'use client';

import Image from 'next/image';
import { MoreVertical } from 'lucide-react';

import { ClientPortalFigmaBlogPostCard } from '@/components/client-portal-figma/ClientPortalFigmaBlogPostCard';
import { ClientPortalFigmaMemberRow } from '@/components/client-portal-figma/ClientPortalFigmaMemberRow';
import { ClientPortalFigmaMetricChange } from '@/components/client-portal-figma/ClientPortalFigmaMetricChange';
import { clientPortalFigmaAssets } from '@/components/client-portal-figma/figmaAssets';
import { cn } from '@/lib/utils';

const CHART_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const TOP_MEMBERS = [
  {
    name: 'Phoenix Baker',
    subtitle: 'Member since Feb 2025',
    avatarSrc: clientPortalFigmaAssets.avatarPhoenix,
    avatarVariant: 'circle' as const,
    avatarTintClass: 'bg-[#d6cfb7]',
    showNotificationDot: true,
  },
  {
    name: 'Lana Steiner',
    subtitle: 'Member since Jan 2025',
    avatarSrc: clientPortalFigmaAssets.avatarLana,
    avatarTintClass: 'bg-[#d7e3e8]',
    showNotificationDot: true,
  },
  {
    name: 'Demi Wikinson',
    subtitle: 'Member since Mar 2025',
    avatarSrc: clientPortalFigmaAssets.avatarDemi,
    avatarTintClass: 'bg-[#dadcd6]',
    showNotificationDot: true,
  },
  {
    name: 'Candice Wu',
    subtitle: 'Member since Feb 2025',
    avatarSrc: clientPortalFigmaAssets.avatarCandice,
    avatarTintClass: 'bg-[#d9d0e6]',
  },
  {
    name: 'Natali Craig',
    subtitle: 'Member since Mar 2025',
    avatarSrc: clientPortalFigmaAssets.avatarNatali,
    avatarTintClass: 'bg-[#e9dcbb]',
  },
  {
    name: 'Orlando Diggs',
    subtitle: 'Member since Apr 2025',
    avatarSrc: clientPortalFigmaAssets.avatarOrlando,
    avatarTintClass: 'bg-[#e5ddce]',
  },
  {
    name: 'Drew Cano',
    subtitle: 'Member since Apr 2025',
    avatarSrc: clientPortalFigmaAssets.avatarDrew,
    avatarTintClass: 'bg-[#d9e5cc]',
  },
  {
    name: 'Kate Morrison',
    subtitle: 'Member since Jan 2025',
    avatarSrc: clientPortalFigmaAssets.avatarKate,
    avatarTintClass: 'bg-[#cfcbdc]',
  },
  {
    name: 'Koray Okumus',
    subtitle: 'Member since Feb 2025',
    avatarSrc: clientPortalFigmaAssets.avatarKoray,
    avatarTintClass: 'bg-[#e5cfe7]',
  },
  {
    name: 'Ava Wright',
    subtitle: 'Member since Mar 2025',
    avatarSrc: clientPortalFigmaAssets.avatarAva,
    avatarTintClass: 'bg-[#ddd0be]',
  },
];

function SectionMenuButton({ label }: { label: string }) {
  return (
    <button type="button" className="flex shrink-0 flex-col items-start rounded-md p-0.5 text-[#414651]" aria-label={label}>
      <MoreVertical className="size-5" strokeWidth={2} />
    </button>
  );
}

function SectionHeader({ title, menuLabel }: { title: string; menuLabel: string }) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full items-start gap-4">
        <p className="font-avenir-regular min-w-0 flex-1 text-lg font-semibold leading-7 text-[#0b1d37]">{title}</p>
        <SectionMenuButton label={menuLabel} />
      </div>
      <div className="h-px w-full bg-[#e9eaeb]" />
    </div>
  );
}

export type ClientPortalAnalyticsOverviewContentProps = {
  className?: string;
};

/** Legacy analytics / content dashboard (MRR, posts, members) — shown on the Payments tab. */
export function ClientPortalAnalyticsOverviewContent({ className }: ClientPortalAnalyticsOverviewContentProps) {
  const a = clientPortalFigmaAssets;
  return (
    <div className={cn('flex w-full flex-col gap-8', className)}>
      <header className="flex w-full flex-col gap-5 px-8">
        <div className="flex flex-wrap items-start gap-4">
          <h1 className="font-avenir-regular min-w-[320px] flex-1 text-2xl font-semibold leading-8 text-[#0b1d37]">Payments</h1>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="relative flex isolate overflow-hidden rounded-lg border border-[#d5d7da] shadow-[0px_1px_1px_rgba(10,13,18,0.05)]">
            {(['12 months', '30 days', '7 days', '24 hours'] as const).map((label, i) => (
              <button
                key={label}
                type="button"
                className={cn(
                  'relative z-[1] flex min-h-10 items-center justify-center border-r border-[#d5d7da] px-4 py-2 last:border-r-0',
                  i === 0 ? 'bg-[#fafafa]' : 'bg-white',
                )}
              >
                <span
                  className={cn(
                    'font-avenir-regular whitespace-nowrap text-sm font-semibold leading-5',
                    i === 0 ? 'text-[#18335a]' : 'text-[#414651]',
                  )}
                >
                  {label}
                </span>
              </button>
            ))}
            <span
              className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]"
              aria-hidden
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex items-center justify-center gap-1 rounded-lg border border-[#d5d7da] bg-white px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            >
              <Image src={a.calendarIcon} alt="" width={20} height={20} className="object-contain" />
              <span className="font-avenir-regular px-0.5 text-sm font-semibold leading-5 text-[#717680]">Select dates</span>
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]"
                aria-hidden
              />
            </button>
            <div className="relative flex items-center justify-center gap-1 rounded-lg border border-[#d5d7da] bg-white px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
              <Image src={a.filterIcon} alt="" width={20} height={20} className="object-contain" />
              <span className="font-avenir-regular px-0.5 text-sm font-semibold leading-5 text-[#414651]">Filters</span>
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </header>

      <section className="flex w-full flex-wrap items-start gap-x-8 gap-y-6 px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2">
            <p className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">MRR</p>
            <div className="flex flex-wrap items-start gap-2">
              <div className="flex items-start gap-0.5">
                <span className="font-avenir-regular pt-0.5 text-xl font-medium leading-[30px] text-[#0b1d37]">$</span>
                <span className="font-avenir-regular text-4xl font-semibold leading-[44px] tracking-[-0.72px] text-[#0b1d37]">
                  18,880
                </span>
              </div>
              <ClientPortalFigmaMetricChange value="7.4%" />
            </div>
          </div>
          <div className="relative h-[240px] min-w-[min(100%,560px)] flex-1">
            <div className="absolute inset-0 flex flex-col">
              <div className="flex min-h-0 flex-1 flex-col justify-between py-0">
                {[0, 1, 2, 3, 4].map((k) => (
                  <div key={k} className="h-px w-full bg-[#e9eaeb]" />
                ))}
              </div>
              <div className="relative flex shrink-0 justify-between px-6 pb-0 pt-1 text-center text-xs font-normal leading-[18px] text-[#535862]">
                {CHART_MONTHS.map((m) => (
                  <span key={m} className="shrink-0">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-[27px] left-0 right-0 top-[46px]">
              <div className="relative h-full w-full">
                <Image src={a.chartSeries} alt="" fill className="object-contain object-bottom" sizes="(max-width: 1200px) 100vw, 800px" />
              </div>
            </div>
          </div>
        </div>
        <aside className="flex w-full shrink-0 flex-col gap-5 sm:w-[240px]" aria-label="Key metrics">
          <div className="flex flex-col gap-2">
            <p className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">Total members</p>
            <div className="flex items-start gap-2">
              <p className="font-avenir-regular text-[30px] font-semibold leading-[38px] text-[#0b1d37]">4,862</p>
              <ClientPortalFigmaMetricChange value="9.2%" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">Paid members</p>
            <div className="flex items-start gap-2">
              <p className="font-avenir-regular text-[30px] font-semibold leading-[38px] text-[#0b1d37]">2,671</p>
              <ClientPortalFigmaMetricChange value="6.6%" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">Email open rate</p>
            <div className="flex items-start gap-2">
              <p className="font-avenir-regular text-[30px] font-semibold leading-[38px] text-[#0b1d37]">82%</p>
              <ClientPortalFigmaMetricChange value="8.1%" />
            </div>
          </div>
        </aside>
      </section>

      <section className="flex w-full flex-col gap-6 px-8">
        <SectionHeader title="Start creating content" menuLabel="Section options for Start creating content" />
        <div className="flex flex-wrap gap-6">
          <div className="flex min-w-[min(100%,320px)] flex-1 gap-3 rounded-xl border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)]">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-[10px] border border-[#d5d7da] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
              <Image src={a.userPlus} alt="" width={24} height={24} className="absolute left-[11px] top-[11px] object-contain" />
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]"
                aria-hidden
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-avenir-regular text-base font-semibold leading-6 text-[#414651]">Create your first member</p>
              <p className="font-avenir-regular truncate text-sm font-normal leading-5 text-[#535862]">Add yourself or import from CSV</p>
            </div>
          </div>
          <div className="flex min-w-[min(100%,320px)] flex-1 gap-3 rounded-xl border border-[#e9eaeb] bg-white p-5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)]">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-[10px] border border-[#d5d7da] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
              <Image src={a.editIcon} alt="" width={24} height={24} className="absolute left-[11px] top-[11px] object-contain" />
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]"
                aria-hidden
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-avenir-regular text-base font-semibold leading-6 text-[#414651]">Create a new post</p>
              <p className="font-avenir-regular truncate text-sm font-normal leading-5 text-[#535862]">Dive into the editor and start creating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-6 px-8">
        <div className="flex flex-col gap-6">
          <SectionHeader title="Recent posts" menuLabel="Section options for Recent posts" />
          <div className="flex flex-wrap items-start gap-6 xl:flex-nowrap">
            <div className="flex min-w-0 flex-1 flex-wrap gap-6">
              <ClientPortalFigmaBlogPostCard
                imageSrc={a.post1}
                meta="Olivia Rhye • 20 Jan 2025"
                title="UX review presentations"
                description="How do you create compelling presentations that wow your colleagues and impress your managers?"
                tags={[
                  { label: 'Design', dotClass: 'bg-[#7f56d9]' },
                  { label: 'Research', dotClass: 'bg-[#2e90fa]' },
                  { label: 'Presentation', dotClass: 'bg-[#f79009]' },
                ]}
              />
              <ClientPortalFigmaBlogPostCard
                imageSrc={a.post2}
                meta="Phoenix Baker • 19 Jan 2025"
                title="Migrating to Linear 101"
                description="Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get..."
                tags={[
                  { label: 'Design', dotClass: 'bg-[#7f56d9]' },
                  { label: 'Research', dotClass: 'bg-[#2e90fa]' },
                ]}
              />
            </div>
            <div className="flex w-full shrink-0 flex-col gap-6 sm:w-[240px]">
              <p className="font-avenir-regular text-sm font-medium leading-5 text-[#535862]">Top members</p>
              <div className="flex flex-col gap-5">
                {TOP_MEMBERS.map((m) => (
                  <ClientPortalFigmaMemberRow key={m.name} {...m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
