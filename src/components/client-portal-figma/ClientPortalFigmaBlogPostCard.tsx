'use client';

import Image from 'next/image';
import { clientPortalFigmaAssets } from '@/components/client-portal-figma/figmaAssets';
import { cn } from '@/lib/utils';

export type ClientPortalFigmaBlogPostCardProps = {
  imageSrc: string;
  meta: string;
  title: string;
  description: string;
  tags: { label: string; dotClass: string }[];
};

/** Figma `Blog post card` (`1765:462598` / `1765:462680`). */
export function ClientPortalFigmaBlogPostCard({
  imageSrc,
  meta,
  title,
  description,
  tags,
}: ClientPortalFigmaBlogPostCardProps) {
  return (
    <article className="flex min-w-[min(100%,320px)] flex-1 flex-col gap-4">
      <div className="relative aspect-[384/256] w-full shrink-0 overflow-hidden rounded-xl">
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 384px" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-avenir-regular text-sm font-semibold leading-5 text-[#008884]">{meta}</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-4">
              <h3 className="font-avenir-regular max-w-[344px] text-lg font-semibold leading-7 text-[#0b1d37]">{title}</h3>
              <span className="relative mt-0.5 size-6 shrink-0">
                <Image
                  src={clientPortalFigmaAssets.arrowUpRight}
                  alt=""
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </span>
            </div>
            <p className="font-avenir-regular line-clamp-3 text-base font-normal leading-6 text-[#535862]">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#d5d7da] bg-white px-2 py-0.5 shadow-[0px_1px_1px_rgba(10,13,18,0.05)]"
            >
              <span className={cn('size-2 rounded-full', t.dotClass)} aria-hidden />
              <span className="font-avenir-regular text-sm font-medium leading-5 text-[#414651]">{t.label}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
