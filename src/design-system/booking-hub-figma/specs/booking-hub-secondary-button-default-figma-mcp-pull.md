# Secondary button — Default (Figma MCP pull)

Read-only documentation from the **Figma MCP** (`get_metadata`, `get_design_context`, `use_figma` plugin API). **Component:** `Buttons/Button` · **Figma file key:** `dRB94UmUgc4cgLjWc3NvPo`.

**Scope:** **Hierarchy = Secondary**, **State = Default**, **Icon only = False**, sizes **sm / md / lg / xl**.

**On-canvas reference (xl):** [node `3287-428627`](https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=3287-428627) — `Buttons/Button/xl/Secondary/Default/False` (**181 × 48**).

**Design tokens surfaced in codegen:** Gray/300 `#D5D7DA`, Gray/700 `#414651`, Base/White `#FFFFFF`, **Shadows/shadow-xs-skeuomorphic** (same three-layer stack as Primary).

---

## 1. What the linked node is

| | |
|--|--|
| **Node id** | `3287:428627` |
| **Name** | `Buttons/Button/xl/Secondary/Default/False` |
| **Type** | `COMPONENT` (sits on **Frame 1** with other size/state slices, alongside the main `COMPONENT_SET` grid) |
| **Role** | **xl** · **Secondary** · **Default** · **Icon only = False** |

---

## 2. Sizes sm / md / lg / xl — same as Primary (Default, Icon only False)

Frame **width × height**, **padding**, **gap**, **radius**, **clip**, and **auto-layout** match **Primary Default** for each size (verified by comparing component roots in file).

| Size | Frame (W×H) | Padding L/R · T/B | Item spacing |
|------|-------------|-------------------|--------------|
| **sm** | **154 × 36** | **12 · 8** | **4** |
| **md** | **158 × 40** | **14 · 10** | **4** |
| **lg** | **177 × 44** | **16 · 10** | **6** |
| **xl** | **181 × 48** | **18 · 12** | **6** |

### Shared with Primary Default

- **Layout:** horizontal auto-layout, **CENTER / CENTER**, **NO_WRAP**
- **Clip content:** **true**
- **Corner radius:** **8**
- **Effects (identical stack):**
  1. **DROP_SHADOW** **#0a0d12** α **0.05**, offset **(0, 1)**, radius **2**
  2. **INNER_SHADOW** **#0a0d12** α **0.05**, offset **(0, -2)**
  3. **INNER_SHADOW** **#0a0d12** α **0.18**, offset **(0, 0)**, spread **1**

### Typography (label) — MCP pull (Secondary Default, Icon only False)

Read via Figma Plugin API (`use_figma`) on label `Text` nodes — component node IDs in §4.

| Size | Font | Weight / style | Size | Line height | Letter spacing | Text case | Decoration |
|------|------|----------------|------|-------------|----------------|-----------|------------|
| **sm** | **Inter** | **Semi Bold** | **14** px | **20** px (fixed) | **0%** | ORIGINAL | NONE |
| **md** | **Inter** | **Semi Bold** | **14** px | **20** px (fixed) | **0%** | ORIGINAL | NONE |
| **lg** | **Inter** | **Semi Bold** | **16** px | **24** px (fixed) | **0%** | ORIGINAL | NONE |
| **xl** | **Inter** | **Semi Bold** | **16** px | **24** px (fixed) | **0%** | ORIGINAL | NONE |

**Figma text-style alignment:** matches **Text sm / Text md Semibold** (14/20) and **Text md / base Semibold** (16/24) for larger breakpoints — same metrics as Primary button labels; **colour** for Secondary is **#414651** (see §3).

**Reference (xl):** [node `3287-428627`](https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=3287-428627).

---

## 3. Secondary Default vs Primary Default — what changes

| Property | Primary Default | Secondary Default |
|----------|-----------------|-------------------|
| **Main fill** | **#00bab5** (Brand/600) | **#ffffff** |
| **Stroke type** | **GRADIENT_LINEAR** (white fade / skeuomorphic border) | **SOLID #d5d7da** (Gray/300) |
| **Stroke weight** | **2** | **1** |
| **Stroke align** | INSIDE | INSIDE |
| **Label text** | **#ffffff** | **#414651** (Gray/700) |
| **Placeholder icon stroke** (`Icon` vector) | **#00e9e3** | **#a4a7ae** (Gray/400) |

**Summary:** Secondary Default = **white** surface, **1px** **#d5d7da** outline, **#414651** label, **#a4a7ae** icon strokes; **same** layout metrics and **same** three-part shadow stack as Primary. Primary = **teal** fill, **2px** gradient border, **white** label, **#00e9e3** icons.

---

## 4. Component node IDs (Secondary Default, Icon only False)

| Size | Node ID |
|------|---------|
| **sm** | `3287:429435` |
| **md** | `3287:427323` |
| **lg** | `3287:427851` |
| **xl** | `3287:428627` |

---

## 5. Note on `COMPONENT_SET` vs Frame 1

`Buttons/Button` set **`3287:427074`** lists **Secondary + Default** for **Icon only = True** in this file. The **`…/False`** slices (including **xl** above) also live on **Frame 1** as separate named components with the **same frame dimensions** as Primary **Icon only False** variants.

---

## Related

- **Hover / Focused / Disabled / Loading:** `booking-hub-secondary-button-states-hover-focused-disabled-loading.md`

---

*Captured from Figma MCP; re-validate in file if the design system is updated.*
