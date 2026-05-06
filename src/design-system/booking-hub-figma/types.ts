/**
 * Booking Hub — Figma-aligned design tokens (layout).
 * Source of truth for node dimensions: Figma file + node IDs; values verified via MCP metadata when noted.
 *
 * This module is standalone; import where needed. It does not register globals or affect the build unless imported.
 */

/** Matches Tailwind 3 default `screens` min-widths (px). */
export const BREAKPOINT_MIN_WIDTH = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointId = keyof typeof BREAKPOINT_MIN_WIDTH;

/** Physical size in Figma’s layout coordinate space (px). */
export type LayoutSize = {
  width: number;
  height: number;
};

/** Optional absolute position when needed for spec parity (Figma x/y). */
export type LayoutPosition = {
  x: number;
  y: number;
};

/**
 * Responsive layout: use the narrowest defined breakpoint that matches `min-width` in CSS,
 * or the largest defined key below the viewport — same mental model as mobile-first CSS.
 * Undefined at a breakpoint means “not specified in this file yet” (fill from Figma or design review).
 */
export type ResponsiveLayout = Partial<Record<BreakpointId, LayoutSize>> & {
  /** Default / design baseline when no breakpoint applies or as desktop reference. */
  base?: LayoutSize;
};

export type FigmaNodeRef = {
  fileKey: string;
  /** e.g. `16638:46337` */
  nodeId: string;
  layerName: string;
};

export type DesignElementSpec = {
  /** Stable id for code lookup, kebab-case */
  id: string;
  figma: FigmaNodeRef;
  /** Last verified dimensions (read-only MCP / manual sync). */
  layout: ResponsiveLayout;
  /** Documented position in file (optional; often only meaningful on a specific artboard). */
  positionInFile?: LayoutPosition;
  notes?: string;
  /** Audit trail */
  lastVerified?: {
    source: "figma-mcp-get-metadata" | "manual";
    at: string;
  };
};
