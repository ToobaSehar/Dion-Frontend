/**
 * Design system snapshot: Figma **Sidebar navigation** node `1765:460095`
 * File: `Booking-Hub-Guidelines-and-UI--1-` (`dRB94UmUgc4cgLjWc3NvPo`).
 *
 * Sources: Figma MCP `get_design_context` (node `1765:460095`) + style annotations from the same response.
 * Static assets are exported from MCP into `public/client-portal-figma/sidebar-node-1765-460095/`.
 * **Note:** Figma MCP icon exports are SVG markup; they were saved with a `.png` filename initially, which
 * broke browsers (wrong decode). Icons use the `.svg` extension; logos, avatar, and video still use `.png`.
 *
 * **Code Connect:** `get_context_for_code_connect` is unavailable without a Figma Developer seat on this workspace;
 * component usage hints from MCP (search-lg, home-line, etc.) are recorded in `SIDEBAR_COMPONENT_HINTS`.
 */

export const CLIENT_PORTAL_FIGMA_FILE_KEY = 'dRB94UmUgc4cgLjWc3NvPo' as const;

export const SIDEBAR_NAVIGATION_NODE_ID = '1765:460095' as const;

export const SIDEBAR_NAVIGATION_FIGMA_URL =
  `https://www.figma.com/design/${CLIENT_PORTAL_FIGMA_FILE_KEY}/Booking-Hub-Guidelines-and-UI--1-?node-id=1765-460095` as const;

const SIDEBAR_ASSET_BASE = '/client-portal-figma/sidebar-node-1765-460095' as const;

/** Paths to raster exports for this node (local, production-safe). */
export const clientPortalSidebarFigmaAssets = {
  logoMark: `${SIDEBAR_ASSET_BASE}/logo-mark.png`,
  logoText: `${SIDEBAR_ASSET_BASE}/logo-text.png`,
  searchLg: `${SIDEBAR_ASSET_BASE}/search-lg.svg`,
  navHome: `${SIDEBAR_ASSET_BASE}/nav-home.svg`,
  navDashboard: `${SIDEBAR_ASSET_BASE}/nav-dashboard.svg`,
  navProjects: `${SIDEBAR_ASSET_BASE}/nav-projects.svg`,
  navTasks: `${SIDEBAR_ASSET_BASE}/nav-tasks.svg`,
  navReporting: `${SIDEBAR_ASSET_BASE}/nav-reporting.svg`,
  navUsers: `${SIDEBAR_ASSET_BASE}/nav-users.svg`,
  navSupport: `${SIDEBAR_ASSET_BASE}/nav-support.svg`,
  navSettings: `${SIDEBAR_ASSET_BASE}/nav-settings.svg`,
  /** Figma `layout-grid-01` (`3463:403795`) — MCP asset, 2×2 grid (Dashboard). */
  navLayoutGrid01: `${SIDEBAR_ASSET_BASE}/nav-layout-grid-01.svg`,
  /** Figma `layout-alt-03` (`3463:403786`) — MCP asset, document with lines (My Requests). */
  navLayoutAlt03: `${SIDEBAR_ASSET_BASE}/nav-layout-alt-03.svg`,
  /** Figma `plus-circle` (`3463:405285`) — MCP asset (New Request). */
  navPlusCircle: `${SIDEBAR_ASSET_BASE}/nav-plus-circle.svg`,
  /** Figma `log-out-01` (`3463:405222`) — MCP asset (account row control). */
  navLogOut01: `${SIDEBAR_ASSET_BASE}/nav-log-out-01.svg`,
  featuredCloseX: `${SIDEBAR_ASSET_BASE}/featured-close-x.svg`,
  videoPlaceholder: `${SIDEBAR_ASSET_BASE}/video-placeholder.png`,
  videoPlayOverlay: `${SIDEBAR_ASSET_BASE}/video-play-overlay.svg`,
  avatarOlivia: `${SIDEBAR_ASSET_BASE}/avatar-olivia.png`,
  accountChevron: `${SIDEBAR_ASSET_BASE}/account-chevron.svg`,
} as const;

/** Colour tokens named in the MCP design-context payload (Gray / Brand / Success). */
export const sidebarColorTokens = {
  gray50: '#FAFAFA',
  gray200: '#E9EAEB',
  gray300: '#D5D7DA',
  gray400: '#A4A7AE',
  gray500: '#717680',
  gray600: '#535862',
  gray700: '#414651',
  gray800: '#18335A',
  gray900: '#0B1D37',
  white: '#FFFFFF',
  brand700: '#00BAB5',
  /** Selected primary nav row (Dashboard / Payments) — matches `ClientPortalFigmaNavItem` active fill. */
  navRailSurface: '#F6F6F4',
  success500: '#17B26A',
  borderAvatar: 'rgba(0,0,0,0.08)',
  borderVideo: 'rgba(0,0,0,0.1)',
  overlayScrim: 'rgba(0,0,0,0.1)',
} as const;

/** Typography from MCP (Figma uses Inter; Dion maps to `font-avenir-regular` in components). */
export const sidebarTypography = {
  searchPlaceholder: { sizePx: 16, lineHeightPx: 24, weight: 400 as const },
  shortcut: { sizePx: 12, lineHeightPx: 18, weight: 500 as const },
  /** Primary + secondary rail rows — matches `ClientPortalFigmaNavItem` label (`text-[14px] leading-[20px]`). */
  navLabel: { sizePx: 14, lineHeightPx: 20, weight: 300 as const },
  taskBadge: { sizePx: 12, lineHeightPx: 18, weight: 500 as const },
  featuredTitle: { sizePx: 14, lineHeightPx: 20, weight: 600 as const },
  featuredBody: { sizePx: 14, lineHeightPx: 20, weight: 400 as const },
  accountName: { sizePx: 14, lineHeightPx: 20, weight: 600 as const },
  accountEmail: { sizePx: 14, lineHeightPx: 20, weight: 400 as const },
} as const;

export const sidebarRadii = {
  input: 8,
  navPill: 6,
  shortcut: 4,
  taskBadge: 16,
  featuredCard: 12,
  featuredClose: 8,
  video: 8,
  accountCard: 12,
  avatar: 200,
} as const;

export const sidebarSpacing = {
  headerTop: 24,
  headerHorizontal: 20,
  headerLogoSearchGap: 20,
  navHorizontal: 16,
  navItemVerticalPad: 2,
  navContentHorizontal: 12,
  navContentVertical: 8,
  iconTextGap: 8,
  contentBadgeGap: 12,
  footerBottom: 24,
  footerStackGap: 16,
  featuredInnerGap: 16,
  featuredTextGap: 4,
  featuredActionsGap: 12,
  accountPadding: 12,
  accountAvatarTextGap: 8,
} as const;

export const sidebarShadows = {
  inputXs: '0px 1px 2px 0px rgba(10,13,18,0.05)',
} as const;

export const sidebarLayout = {
  /** Width is applied by parent `Desktop` frame in Figma; Dion fixes sidebar to 296px to match that frame. */
  sidebarWidthPx: 296,
} as const;

/** Figma component node descriptions (MCP text); use for QA and future Code Connect. */
/**
 * Ephemeral MCP asset URLs from the last `get_design_context` pull (expire ~7 days on Figma’s CDN).
 * Production code uses `clientPortalSidebarFigmaAssets` (local files under `public/.../sidebar-node-1765-460095/`).
 */
export const SIDEBAR_MCP_ASSET_URLS_LAST_PULL = [
  'https://www.figma.com/api/mcp/asset/730cfdb2-09c2-4cd7-aa74-0a594d899294',
  'https://www.figma.com/api/mcp/asset/f22a2127-35a6-4654-a3e8-0487502e2c97',
  'https://www.figma.com/api/mcp/asset/89ae8bb9-9e71-4d57-83a2-50f2cf222098',
  'https://www.figma.com/api/mcp/asset/2d790060-67be-4f71-ac7c-192921823176',
  'https://www.figma.com/api/mcp/asset/e72c7f4c-59ea-4465-9882-275e70e47b91',
  'https://www.figma.com/api/mcp/asset/34dbdbf4-8ade-4d16-b488-08004fe94e03',
  'https://www.figma.com/api/mcp/asset/195e8bc2-ec5d-4924-a11f-0fb5636181b3',
  'https://www.figma.com/api/mcp/asset/323b2d23-8e04-40bc-acb6-da905678d0ac',
  'https://www.figma.com/api/mcp/asset/daaa2b4a-9b1a-45ae-a480-3ca96322a78e',
  'https://www.figma.com/api/mcp/asset/22908b28-5894-4c3e-985a-e1011412db64',
  'https://www.figma.com/api/mcp/asset/035b867d-f7e5-46f5-a6d0-471832c507aa',
  'https://www.figma.com/api/mcp/asset/d2424ac7-ddf5-4e98-83e5-b7f14867aabf',
  'https://www.figma.com/api/mcp/asset/5e2612a7-6e27-4bfb-b0d8-e34acbb5e405',
  'https://www.figma.com/api/mcp/asset/476e9081-b580-47c6-8cc8-3be8773742ef',
  'https://www.figma.com/api/mcp/asset/458d704a-ce46-4dbc-8f9e-7ff8cf2a147d',
  'https://www.figma.com/api/mcp/asset/3e8263ac-f2b9-421d-abc7-da424af34308',
] as const;

export const SIDEBAR_COMPONENT_HINTS: Record<string, { nodeId: string; hint: string }> = {
  'search-lg': { nodeId: '3463:405300', hint: 'search, search bar, searchbar, magnify, magnifying glass, filter' },
  'home-line': { nodeId: '3463:405438', hint: 'home, homepage, return, house, menu' },
  'bar-chart-square-02': { nodeId: '3463:403899', hint: 'bar, chart, square, barchart, graph, data' },
  'rows-01': { nodeId: '3463:403825', hint: 'columns, horizontal, divider, grid, table' },
  'check-done-01': { nodeId: '3463:404973', hint: 'check, done, tick, confirm, checklist, checkbox' },
  'pie-chart-03': { nodeId: '3463:403971', hint: 'pie, chart, piechart, percentage, data' },
  'users-01': { nodeId: '3463:405729', hint: 'users, persona, account, people, team' },
  'life-buoy-01': { nodeId: '3463:405456', hint: 'life bouy, help, support, documentation, question, marine, boat' },
  'settings-01': { nodeId: '3463:405312', hint: 'settings, preferences, cog' },
  'x-close': { nodeId: '3463:405165', hint: 'x, close, exit, remove, cross, delete' },
  'chevron-selector-vertical': { nodeId: '3463:404554', hint: 'chevron, selector, vertical, expand, open' },
};
