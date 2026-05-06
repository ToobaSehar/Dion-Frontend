import type { DesignElementSpec } from "./types";

/**
 * Canonical registry of layout specs traced to Figma: “Booking-Hub-Guidelines-and-UI--1-”
 * Extend this array as new nodes are measured; keep one entry per logical component.
 */
export const designElements: readonly DesignElementSpec[] = [
  {
    id: "buttons/button",
    figma: {
      fileKey: "dRB94UmUgc4cgLjWc3NvPo",
      nodeId: "16638:46337",
      layerName: "Buttons/Button",
    },
    layout: {
      // Measured on node 16638:46337 — base frame in file (not yet split by responsive variants in this registry).
      base: { width: 181, height: 48 },
      // Add sm/md/lg/xl/2xl when corresponding Figma frames or component variants exist.
    },
    positionInFile: { x: 601, y: 16 },
    notes:
      "Primary button frame from guidelines file. Add breakpoint-specific sizes when variant nodes are documented in Figma.",
    lastVerified: {
      source: "figma-mcp-get-metadata",
      at: "2026-05-02",
    },
    // Full Figma MCP transcript (size, position, auto layout, clip, fill, stroke, effects, typography, variables): ./specs/booking-hub-button-16638-46337-figma-mcp-pull.md
  },
];

export function getDesignElementById(
  id: DesignElementSpec["id"]
): DesignElementSpec | undefined {
  return designElements.find((el) => el.id === id);
}
