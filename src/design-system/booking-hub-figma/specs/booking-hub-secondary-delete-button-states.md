# Secondary delete button — all states (Figma MCP pull)

Read-only documentation from **Figma MCP** (`get_design_context`, `use_figma`). **Component set:** `Buttons/Button destructive` · **Component set id:** `5969:7471`.

**Note on file access:** The linked guideline file `O5tre8Es58GIWIkr7LZhZk` may require explicit share/seat access for MCP; specs below were validated from the canonical **`dRB94UmUgc4cgLjWc3NvPo`** copy using the **same node ids** (e.g. Secondary xl Default `3287:428631` matches the URL node).

**Scope:** **Hierarchy = Secondary**, **Icon only = False** — same **padding, radius (8), gap, frame sizes** as `Buttons/Button` Primary/Secondary non-icon-only (`booking-hub-primary-button-states-focused-disabled-loading.md` §1).

---

## Reference nodes (xl, Secondary, Icon only=False)

| State | Node id | URL fragment |
|-------|---------|--------------|
| Default | `3287:428631` | `node-id=3287-428631` |
| Hover | `3287:428799` | `node-id=3287-428799` |
| Focused | `3287:428743` | `node-id=3287-428743` |
| Disabled | `3287:428687` | `node-id=3287-428687` |
| Loading | `10251:215363` | `node-id=10251-215363` |

---

## Semantic colours (error scale)

| Role | Hex | Token name (Figma) |
|------|-----|-------------------|
| Label Default / Focused / Loading | **#d92d20** | Error/600 |
| Label Hover | **#b42318** | Error/700 |
| Border (interactive, not disabled) | **#fda29b** | Error/300 |
| Hover / Loading surface | **#fef3f2** | Error/50 |
| Focus ring (outer) | **#f04438** spread **4** | Error/500 |
| Focus ring (inner) | **#ffffff** spread **2** | Base/White |
| Disabled border | **#e9eaeb** | Gray/200 |
| Disabled label / icons | **#a4a7ae** / **#d5d7da** | Gray/400 / Gray (icons) |
| Spinner accent | **#f04438** | Error/500 |

---

## Layout (xl — matches Primary / Secondary same size)

- **Corner radius:** **8**
- **Padding:** **18 / 18 / 12 / 12** · **Item spacing:** **6**
- **Default / Hover / Focused / Disabled frame:** **181 × 48**
- **Loading frame:** **165 × 48** (narrower, same convention as Primary loading)

---

## Effects

- **Default, Hover, Focused, Loading:** **shadow-xs** + **skeuomorphic inset** (`INNER_SHADOW` pair — `@/components/booking-hub-button/bookingHubButtonTokens` `BH_BTN_SKEUO_INSET`).
- **Focused:** adds **focus ring** before xs drop — **Error/500** spread **4**, **white** spread **2**, then **shadow-xs**, then the same inset stack (see generated Tailwind in MCP output).
- **Disabled:** **shadow-xs only** — **no** inset overlays; fill **white**, stroke **Gray/200**.

---

## Typography

Matches **Secondary** label pipeline: **Inter Semi Bold** in Figma; app implementation uses `bhSecondaryButtonTypography` (**Inter** via `bookingHubButtonSizes.ts`).

---

## Implementation

- **`BookingHubSecondaryDeleteButton`** — `@/components/booking-hub-button`
- **Focus ring token:** `BH_BTN_FOCUS_RING_DESTRUCTIVE` in `bookingHubButtonTokens.ts`

---

*Re-validate in Figma if the design system is updated.*
