# Tertiary button — Figma MCP pull

**File:** `dRB94UmUgc4cgLjWc3NvPo` (Booking Hub Guidelines and UI)

## Reference nodes

- **Matrix (Primary / Secondary / Tertiary × sizes × states):** `16638:46333`  
  https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=16638-46333
- **Tertiary xl + icon + label (default, non–icon-only):** `16641:107347`  
  https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=16641-107347

## Pulled from `16641:107347` (`get_design_context`)

| Token | Value |
|--------|--------|
| Corner radius | `8px` → `rounded-[8px]` |
| Horizontal padding (xl) | `18px` → `px-[18px]` / `xl:px-[18px]` in responsive padding scale |
| Vertical padding (xl) | `12px` → `py-3` / `xl:py-3` in responsive padding scale |
| Gap (icon ↔ label ↔ icon) | `6px` → `gap-1.5` at `lg` (`bhResponsiveGap`) |
| Label | **Text md / Semibold** — `16px` / `24px`, **Gray/600** `#535862` |
| Icon | **Gray/400** `#A4A7AE` (placeholder icon slot in Figma) |
| Background | Transparent (ghost) |
| Border | None on default (implementation: `border border-transparent` for stable layout where needed) |

## States (implementation parity with matrix `16638:46333`)

- **Default:** `text-[#535862]`, `[&_svg]:text-[#535862]` (icons align to secondary gray treatment).
- **Hover:** `bg-[#fafafa]`, `text-[#414651]`, `hover:[&_svg]:text-[#414651]` (Gray/50 surface, Gray/700 label).
- **Focused:** `BH_BTN_FOCUS_RING_TERTIARY` — white 2px + brand 4px ring, no `shadow-xs` on the control.
- **Disabled:** `text-[#a4a7ae]`, `[&_svg]:text-[#a4a7ae]`, `cursor-not-allowed`.
- **Loading:** `bg-[#fafafa]`, spinner + label Gray/600; responsive loading min-width matches primary loading ladder when not `fullWidth`.

## Code

- Component: `src/components/booking-hub-button/BookingHubTertiaryButton.tsx`
- Responsive padding / min-heights: `bookingHubButtonSizes.ts` (`bhButtonResponsivePadding`, `bhTertiaryResponsiveFrame`, `bhTertiaryResponsiveOuterFrame`)
- Focus token: `bookingHubButtonTokens.ts` (`BH_BTN_FOCUS_RING_TERTIARY`)
