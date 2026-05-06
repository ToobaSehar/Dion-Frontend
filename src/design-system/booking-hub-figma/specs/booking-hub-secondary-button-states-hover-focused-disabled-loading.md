# Secondary button — Hover, Focused, Disabled, Loading (Figma MCP pull)

Read-only documentation from the **Figma MCP** (`get_metadata`, `use_figma`). **File key:** `dRB94UmUgc4cgLjWc3NvPo` · **Scope:** **Hierarchy = Secondary**, **Icon only = False**, states **Hover**, **Focused**, **Disabled**, **Loading** — **xl** node reads below; **sm / md / lg** use the **same layout metrics** as **Primary** for the matching state (padding, gap, radius, clip, frame W×H; **Loading** width matches Primary loading).

---

## Reference nodes (xl)

| State | Node id | URL fragment |
|-------|---------|--------------|
| Hover | `3287:428795` | `node-id=3287-428795` |
| Focused | `3287:428739` | `node-id=3287-428739` |
| Disabled | `3287:428683` | `node-id=3287-428683` |
| Loading | `10250:215074` | `node-id=10250-215074` |

**Primary xl counterparts** (for diff): Hover `3287:428747`, Focused `3287:428691`, Disabled `3287:428635`, Loading `10250:215064`.

---

## Layout (all four states — matches Primary same state)

- **Corner radius:** **8**
- **Clip content:** **true**
- **Auto layout (xl):** padding **18 / 18 / 12 / 12**, item spacing **6**
- **Hover / Focused / Disabled (xl):** frame **181 × 48**
- **Loading (xl):** frame **165 × 48** (narrower slot, same as Primary loading)

---

## Hover — Secondary vs Primary (xl)

| Property | Primary | Secondary |
|----------|---------|-----------|
| **Main fill** | **#008884** | **#fafafa** |
| **Stroke** | **GRADIENT_LINEAR**, **2** px | **SOLID #d5d7da**, **1** px |
| **Effects** | shadow-xs + 2× inner | **Same 3** |
| **Label** | **#ffffff** | **#18335a** |
| **Icon stroke** | **#00f9f2** | **#717680** |

---

## Focused — Secondary vs Primary (xl)

| Property | Primary | Secondary |
|----------|---------|-----------|
| **Main fill** | **#00bab5** | **#ffffff** |
| **Stroke** | **GRADIENT_LINEAR**, **2** px | **SOLID #d5d7da**, **1** px |
| **Effects** | **5** layers (teal + white ring, xs drop, 2 inners) | **Same 5** |
| **Label** | **#ffffff** | **#414651** |
| **Icon stroke** | **#00e9e3** | **#a4a7ae** |

---

## Disabled — Secondary vs Primary (xl)

| Property | Primary | Secondary |
|----------|---------|-----------|
| **Main fill** | **#f5f5f5** | **#ffffff** |
| **Stroke** | **SOLID #e9eaeb**, **1** px | **SOLID #e9eaeb**, **1** px |
| **Effects** | xs drop only | **Same** |
| **Label** | **#a4a7ae** | **#a4a7ae** |
| **Icon stroke** | **#d5d7da** | **#d5d7da** |

---

## Loading — Secondary vs Primary (xl)

| Property | Primary | Secondary |
|----------|---------|-----------|
| **Main fill** | **#008884** | **#fafafa** |
| **Stroke** | **GRADIENT_LINEAR**, **2** px | **SOLID #d5d7da**, **1** px |
| **Effects** | xs + 2 inners | **Same 3** |
| **Label** | **#ffffff** | **#414651** |
| **Spinner** | Teal system (`#00e9e3` accent on `#008884`) | **#414651** on `#fafafa` (label-aligned grey) |

---

## Summary

- **Secondary** keeps **outline** behaviour: **1 px** greys / **#e9eaeb** when disabled; **Primary** uses **teal** fills and **2 px** gradient except disabled.
- **Hover:** Secondary **#fafafa** surface + **#18335a** label + **#717680** icons.
- **Focused:** Same **focus ring** stack as Primary; Secondary label/icons stay **default** palette (**#414651** / **#a4a7ae**).
- **Loading:** Secondary **#fafafa** + **#414651** copy; Primary **#008884** + white copy.

---

*Captured from Figma MCP; re-validate in file if the design system is updated.*
