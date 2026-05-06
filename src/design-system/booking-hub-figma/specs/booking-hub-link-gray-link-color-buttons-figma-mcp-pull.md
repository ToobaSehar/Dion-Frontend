# Link gray & Link color buttons — Figma MCP pull

**File:** `dRB94UmUgc4cgLjWc3NvPo`

## Link gray — `3287:428603`

https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=3287-428603

| Spec | Value |
|------|--------|
| Layout | Horizontal flex, `gap` **6px** (`gap-1` → `lg:gap-1.5` with responsive inner row) |
| Label | **Text md / Semibold** 16/24, **Gray/600** `#535862` |
| Icons | **Gray/400** `#A4A7AE` (placeholder slots in Figma) |
| Radius / padding | Same **8px** radius and **sm→xl** padding ladder as `Buttons/Button` primary/secondary (`bhButtonPadding` / `bhButtonResponsivePadding`) |
| Surface | Transparent (link-style); hover/focus/disabled/loading aligned with ghost **tertiary** interaction pattern in implementation |

## Link color — `3287:428595`

https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=3287-428595

| Spec | Value |
|------|--------|
| Layout | Same as link gray (`gap` 6px, optional leading/trailing icons) |
| Label | **Text md / Semibold** 16/24, **Brand/700** `#008884` |
| Icons | Match label **Brand/700** `#008884` (Figma lists Brand/500 `#00CBC5` in token set; default instance uses **#008884** on label) |
| Hover (implementation) | Slight brighten toward brand teal `#00bab5` for label + icons; optional **Gray/50** `#fafafa` hover surface for parity with link gray |

## Shared implementation notes

- **Frame / min-width / loading / `fullWidth` / `responsiveCompact` / `contentSized`:** Same as `BookingHubTertiaryButton` (`bhTertiaryResponsiveOuterFrame`, `bhPrimaryDefaultFrame`, etc.).
- **Focus:** `BH_BTN_FOCUS_RING_TERTIARY` (ring-only, no `shadow-xs`), `focus-visible:bg-white`.
- **Components:** `BookingHubLinkGrayButton.tsx`, `BookingHubLinkColorButton.tsx` in `src/components/booking-hub-button/`.
