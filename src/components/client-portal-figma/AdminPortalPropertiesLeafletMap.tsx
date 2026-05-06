'use client';

import { useCallback, useEffect, useRef } from 'react';

import type { AdminPortalPropertyListingKind } from '@/components/client-portal-figma/AdminPortalPropertiesView';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'bh-admin-properties-map-view-v1';

export type AdminPortalPropertyMapRow = {
  id: string;
  propertyName: string;
  partnerName: string;
  location: string;
  beds: number;
  nightlyFromGbp: number;
  listingKind: AdminPortalPropertyListingKind;
  latitude: number;
  longitude: number;
};

export type LatLngBoundsLiteral = { south: number; west: number; north: number; east: number };

type LeafletNs = typeof import('leaflet');

function listingLabel(kind: AdminPortalPropertyListingKind): string {
  switch (kind) {
    case 'available':
      return 'Available';
    case 'unavailable':
      return 'Unavailable';
    case 'inactive':
      return 'Inactive';
    case 'approved':
      return 'Approved';
  }
}

function isPinGrey(listingKind: AdminPortalPropertyListingKind): boolean {
  return listingKind === 'unavailable' || listingKind === 'inactive';
}

/** Lucide `MapPin` outer path (24×24) — filled for Leaflet markers. */
const MAP_PIN_PATH = 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z';

const PIN_BTN_CLASS =
  'bh-admin-prop-pin-btn m-0 block cursor-pointer border-0 bg-transparent p-0 outline-none transition-transform hover:scale-[1.06] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#00BAB5] focus-visible:ring-offset-2';

function propertyPinIconHtml(teal: boolean, ariaLabel: string): string {
  const fill = teal ? '#00BAB5' : '#4B4E53';
  return `<button type="button" class="${PIN_BTN_CLASS}" aria-label="${escapeAttr(ariaLabel)}">
<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="display:block;filter:drop-shadow(0 1px 2px rgba(11,29,55,0.22))">
<path d="${MAP_PIN_PATH}" fill="${fill}" stroke="#ffffff" stroke-width="1.15" stroke-linejoin="round"/>
<circle cx="12" cy="10" r="2.85" fill="#ffffff"/>
</svg>
</button>`;
}

function clusterPinIconHtml(count: number): string {
  return `<div class="bh-admin-prop-cluster-pin" style="position:relative;width:42px;height:44px;display:block" aria-hidden="true">
<svg width="42" height="42" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 1px 2px rgba(11,29,55,0.2))">
<path d="${MAP_PIN_PATH}" fill="rgba(0,186,181,0.96)" stroke="#ffffff" stroke-width="1.15" stroke-linejoin="round"/>
</svg>
<span style="pointer-events:none;position:absolute;left:50%;top:11px;transform:translateX(-50%);font-size:13px;font-weight:700;line-height:1;color:#fff;font-family:inherit,var(--font-inter),ui-sans-serif,system-ui,sans-serif">${count}</span>
</div>`;
}

function readStoredView(): { lat: number; lng: number; zoom: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { lat?: number; lng?: number; zoom?: number };
    if (
      typeof v.lat === 'number' &&
      typeof v.lng === 'number' &&
      typeof v.zoom === 'number' &&
      Number.isFinite(v.lat) &&
      Number.isFinite(v.lng) &&
      Number.isFinite(v.zoom)
    ) {
      return { lat: v.lat, lng: v.lng, zoom: v.zoom };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeStoredView(lat: number, lng: number, zoom: number) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, zoom }));
  } catch {
    /* ignore */
  }
}

function boundsFromLeafletBounds(bounds: import('leaflet').LatLngBounds): LatLngBoundsLiteral {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return { south: sw.lat, west: sw.lng, north: ne.lat, east: ne.lng };
}

export type AdminPortalPropertiesLeafletMapProps = {
  className?: string;
  properties: AdminPortalPropertyMapRow[];
  viewportFilter: boolean;
  onViewportFilterChange: (next: boolean) => void;
  onMapBoundsChange: (bounds: LatLngBoundsLiteral) => void;
  onViewProperty: (id: string) => void;
};

/**
 * Leaflet + OSM tiles + marker clusters for admin Properties map view.
 * Loads `leaflet`, `leaflet.markercluster`, and CSS only on the client.
 */
export default function AdminPortalPropertiesLeafletMap({
  className,
  properties,
  viewportFilter,
  onViewportFilterChange,
  onMapBoundsChange,
  onViewProperty,
}: AdminPortalPropertiesLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const clusterRef = useRef<import('leaflet').LayerGroup | null>(null);
  const LRef = useRef<LeafletNs | null>(null);
  const propertiesRef = useRef(properties);
  propertiesRef.current = properties;
  const onViewPropertyRef = useRef(onViewProperty);
  onViewPropertyRef.current = onViewProperty;
  const onMapBoundsChangeRef = useRef(onMapBoundsChange);
  onMapBoundsChangeRef.current = onMapBoundsChange;

  const rebuildMarkers = useCallback(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    const LExt = L as LeafletNs & {
      markerClusterGroup?: (opts?: Record<string, unknown>) => import('leaflet').LayerGroup;
    };
    if (typeof LExt.markerClusterGroup !== 'function') {
      return;
    }

    const cluster = LExt.markerClusterGroup({
      maxClusterRadius: 64,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction(clusterGroup: { getChildCount: () => number }) {
        const count = clusterGroup.getChildCount();
        return L.divIcon({
          html: clusterPinIconHtml(count),
          className: 'bh-admin-prop-cluster',
          iconSize: L.point(42, 44),
          iconAnchor: L.point(21, 40),
        });
      },
    });

    for (const p of propertiesRef.current) {
      const teal = !isPinGrey(p.listingKind);
      const icon = L.divIcon({
        className: 'bh-admin-prop-pin-wrap',
        html: propertyPinIconHtml(teal, `${p.propertyName}, ${listingLabel(p.listingKind)}`),
        iconSize: [30, 30],
        iconAnchor: [15, 27],
      });

      const marker = L.marker([p.latitude, p.longitude], {
        icon,
        title: `${p.propertyName} — ${listingLabel(p.listingKind)}`,
        keyboard: true,
      });
      marker.bindTooltip(
        `${p.propertyName} · ${p.partnerName} · ${listingLabel(p.listingKind)}`,
        { direction: 'top', sticky: true, opacity: 0.95, className: 'font-avenir-regular' },
      );

      const popupHtml = `
        <div class="bh-admin-prop-popup font-avenir-regular min-w-[200px] max-w-[260px] space-y-2 p-1 text-[#0B1D37]">
          <p class="text-sm font-semibold leading-5">${escapeHtml(p.propertyName)}</p>
          <p class="text-xs leading-4 text-[#717680]">${escapeHtml(p.partnerName)}</p>
          <p class="text-xs leading-4 text-[#717680]">${p.beds} bed${p.beds === 1 ? '' : 's'} · from £${p.nightlyFromGbp}/night</p>
          <span class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isPinGrey(p.listingKind) ? 'bg-[#E9EAEB] text-[#4B4E53]' : 'bg-[#00BAB5] text-white'
          }">${escapeHtml(listingLabel(p.listingKind))}</span>
          <p class="pt-1">
            <button type="button" class="bh-admin-prop-view text-sm font-semibold text-[#00BAB5] hover:underline" data-property-id="${escapeAttr(
              p.id,
            )}">
              View property →
            </button>
          </p>
        </div>`;
      marker.bindPopup(popupHtml, { maxWidth: 280, className: 'bh-admin-prop-popup-wrap' });
      marker.on('popupopen', () => {
        const el = marker.getPopup()?.getElement?.();
        const btn = el?.querySelector<HTMLButtonElement>('.bh-admin-prop-view');
        if (!btn) return;
        const handler = (e: MouseEvent) => {
          e.preventDefault();
          const id = btn.getAttribute('data-property-id');
          if (id) onViewPropertyRef.current(id);
        };
        btn.addEventListener('click', handler);
        marker.once('popupclose', () => btn.removeEventListener('click', handler));
      });

      cluster.addLayer(marker);
    }

    map.addLayer(cluster);
    clusterRef.current = cluster;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    void (async () => {
      await import('leaflet/dist/leaflet.css');
      await import('leaflet.markercluster/dist/MarkerCluster.css');
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css');

      const L = await import('leaflet');
      (window as unknown as { L?: LeafletNs }).L = L;
      await import('leaflet.markercluster');

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 5,
        maxZoom: 10,
      });

      LRef.current = L;
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.fitBounds(
        [
          [49.8, -8.6],
          [59.5, 2.2],
        ],
        { padding: [12, 12] },
      );

      const stored = readStoredView();
      if (stored) {
        map.setView([stored.lat, stored.lng], Math.min(10, Math.max(5, stored.zoom)), { animate: false });
      }

      const persist = () => {
        const c = map.getCenter();
        const z = map.getZoom();
        writeStoredView(c.lat, c.lng, z);
        onMapBoundsChangeRef.current(boundsFromLeafletBounds(map.getBounds()));
      };

      map.on('moveend', persist);
      map.on('zoomend', persist);
      persist();

      rebuildMarkers();

      requestAnimationFrame(() => map.invalidateSize());
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      clusterRef.current = null;
      LRef.current = null;
    };
  }, [rebuildMarkers]);

  useEffect(() => {
    if (!mapRef.current || !LRef.current) return;
    rebuildMarkers();
    requestAnimationFrame(() => mapRef.current?.invalidateSize());
  }, [properties, rebuildMarkers]);

  return (
    <div
      className={cn(
        'relative mt-6 overflow-hidden rounded-xl border border-solid border-[#e9eaeb] bg-white shadow-[0_1px_2px_rgba(11,29,55,0.06)]',
        className,
      )}
    >
      <div
        ref={containerRef}
        className="relative z-0 min-h-[520px] w-full"
        aria-label="Property map"
        role="region"
      />

      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex max-w-[min(100%,280px)] flex-col gap-2">
        <label className="pointer-events-auto flex cursor-pointer items-start gap-2 rounded-lg border border-solid border-[#e9eaeb] bg-white/95 px-3 py-2 text-xs font-medium leading-snug text-[#0B1D37] shadow-sm backdrop-blur-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 rounded border-[#d5d7da] text-[#00BAB5] focus:ring-[#00BAB5]"
            checked={viewportFilter}
            onChange={(e) => onViewportFilterChange(e.target.checked)}
          />
          <span>Only show properties in the current map view (updates when you pan or zoom).</span>
        </label>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 z-[1000]">
        <div className="pointer-events-auto rounded-lg border border-solid border-[#e9eaeb] bg-white/95 px-3 py-2.5 text-xs shadow-sm backdrop-blur-sm">
          <p className="font-avenir-regular mb-2 font-semibold uppercase tracking-wide text-[#717680]">Legend</p>
          <div className="font-avenir-regular flex items-center gap-2 text-[#0B1D37]">
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              className="shrink-0 drop-shadow-[0_1px_2px_rgba(11,29,55,0.18)]"
              aria-hidden
            >
              <path
                d={MAP_PIN_PATH}
                fill="#00BAB5"
                stroke="#ffffff"
                strokeWidth={1.15}
                strokeLinejoin="round"
              />
              <circle cx={12} cy={10} r={2.85} fill="#ffffff" />
            </svg>
            Available / Approved
          </div>
          <div className="font-avenir-regular mt-1.5 flex items-center gap-2 text-[#0B1D37]">
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              className="shrink-0 drop-shadow-[0_1px_2px_rgba(11,29,55,0.18)]"
              aria-hidden
            >
              <path
                d={MAP_PIN_PATH}
                fill="#4B4E53"
                stroke="#ffffff"
                strokeWidth={1.15}
                strokeLinejoin="round"
              />
              <circle cx={12} cy={10} r={2.85} fill="#ffffff" />
            </svg>
            Unavailable / Inactive
          </div>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}
