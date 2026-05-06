# Primary button — Focused, Disabled, Loading (Figma MCP pull)

Read-only documentation from the **Figma MCP** (`get_metadata`, `get_design_context`, `use_figma` plugin API). **Component set:** `Buttons/Button` · **Figma file key:** `dRB94UmUgc4cgLjWc3NvPo` · **Component set node id:** `3287:427074`.

**Scope:** **Hierarchy = Primary**, **Icon only = False**, sizes **sm / md / lg / xl**, states **Default** (baseline), **Focused**, **Disabled**, **Loading**.

**Verify in Figma:** [Booking Hub Guidelines — `16638-46337`](https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=16638-46337)

---

## 1. Layout constants by size (Default / Focused / Loading — Disabled matches except where noted in §3)

**Disabled** uses the same auto layout, padding, clip, and radius as Default for that size; only colours/effects/stroke change.

| Property | **sm** | **md** | **lg** | **xl** |
|----------|--------|--------|--------|--------|
| **Position in set** (grid x; y varies by state row) | x **16** | x **202** | x **392** | x **601** |
| **Frame size** (Default / Focused / Disabled) | **154 × 36** | **158 × 40** | **177 × 44** | **181 × 48** |
| **Frame size (Loading)** | **139 × 36** | **143 × 40** | **161 × 44** | **165 × 48** |
| **Clip content** | **true** | **true** | **true** | **true** |
| **Appearance** | opacity **1**, visible **true** | same | same | same |
| **Corner radius** | **8** | **8** | **8** | **8** |
| **Layout sizing** | **HUG × HUG** | same | same | same |
| **Auto layout** | Horizontal, primary/counter **AUTO**, **CENTER / CENTER**, **NO_WRAP** | same | same | same |
| **Padding (L / R / T / B)** | **12 / 12 / 8 / 8** | **14 / 14 / 10 / 10** | **16 / 16 / 10 / 10** | **18 / 18 / 12 / 12** |
| **Item spacing** | **4** | **4** | **6** | **6** |

### Typography (label — Default Primary, Icon only False)

| | **sm** | **md** | **lg** | **xl** |
|--|--------|--------|--------|--------|
| Font | Inter **Semi Bold** | same | same | same |
| Size / line height | **14px / 20px** | **14px / 20px** | **16px / 24px** | **16px / 24px** |
| Letter spacing | **0%** | **0%** | **0%** | **0%** |
| Label fill (Default / Focused / Loading) | **#FFFFFF** | **#FFFFFF** | **#FFFFFF** | **#FFFFFF** |

**Inner “Text padding” frame:** horizontal auto-layout, padding **L/R 2px**, **T/B 0**, gap **0**; **clipsContent: false** on that frame.

---

## 2. Stroke & fill shared by interactive states (Default, Focused, Loading — not Disabled)

**Main frame fill**

- **Default & Focused:** **#00bab5**
- **Loading:** **#008884**

**Main frame stroke** (when not Disabled)

- **Weight:** **2** · **Align:** **INSIDE**
- **Type:** `GRADIENT_LINEAR` (read from **md Primary Default**): stops **#FFFFFF** @ α ≈ **0.12** → **#FFFFFF** @ α **0**

**Effects (Default & Loading — same three-layer stack)**

1. **DROP_SHADOW** — **#0a0d12** α **0.05**, offset **(0, 1)**, radius **2**, spread **0**
2. **INNER_SHADOW** — **#0a0d12** α **0.05**, offset **(0, -2)**
3. **INNER_SHADOW** — **#0a0d12** α **0.18**, offset **(0, 0)**, spread **1**

---

## 3. What changes by state (Primary — all sizes behave the same way)

### Focused vs Default

- **Fill:** unchanged **#00bab5**
- **Stroke:** still **2px INSIDE** + **GRADIENT_LINEAR** (same pattern as Default)
- **Effects:** **adds two** drop shadows **before** the Default stack:
  - **DROP_SHADOW** **#00bab5**, α **1**, offset **(0, 0)**, radius **0**, **spread 4**
  - **DROP_SHADOW** **#ffffff**, α **1**, offset **(0, 0)**, radius **0**, **spread 2**
  - then the **same three** effects as Default (outer drop + two inners)
- **Layout / padding / clip / radius:** unchanged vs Default for that size

**Net:** extra focus-ring shadows only.

### Disabled vs Default

- **Fill:** **#f5f5f5**
- **Stroke:** **SOLID #e9eaeb**, **weight 1** (replaces 2px gradient)
- **Effects:** **only** the first **DROP_SHADOW** (**#0a0d12** α **0.05**, **(0, 1)**, radius **2**) — **inner shadows removed**
- **Text fill:** **#a4a7ae**
- **Icon stroke (placeholders):** **#d5d7da**

**Net:** neutral surface, grey border, muted label/icons, simplified shadow.

### Loading vs Default

- **Fill:** **#008884** (replaces **#00bab5**)
- **Stroke / inner effects:** same pattern as Default (**gradient stroke**, same **three** effects as Default)
- **Structure:** leading **Buttons/Button loading icon** spinner; **no trailing** placeholder icon → **width** decreases (see §1 table)
- **Spinner:** see **§7** (ellipse strokes **#00e9e3**, track **30%** opacity, **2** px, **20×20** slot)
- **Label:** **#FFFFFF**

**Net:** darker teal surface, spinner, narrower width.

---

## 4. Semantic colours (“selection” / token-style summary)

The Plugin API does not expose Figma editor **selection** colour. Semantic colours used in this Primary set:

| Role | Hex |
|------|-----|
| Default / focus surface | **#00bab5** |
| Focus ring (shadows) | **#00bab5** + **#ffffff** (spreads **4** and **2**) |
| Loading surface | **#008884** |
| Disabled surface / border / text | **#f5f5f5** / **#e9eaeb** / **#a4a7ae** |
| Default-path icon accent | **#00e9e3** |
| Shadow base | **#0a0d12** at α **0.05** / **0.05** / **0.18** per effect |

---

## 5. Variant node IDs (spot-check in Figma)

**Icon only = False**, **Hierarchy = Primary**.

| Size | Default | Focused | Disabled | Loading |
|------|---------|---------|----------|---------|
| **sm** | `3287:429411` | `3287:429467` | `3287:429439` | `10250:215092` |
| **md** | `3287:427299` | `3287:427355` | `3287:427327` | `10250:215036` |
| **lg** | `3287:427827` | `3287:427883` | `3287:427855` | `10250:215050` |
| **xl** | `3287:428579` | `3287:428691` | `3287:428635` | `10250:215064` |

---

## 6. xl — quick reference (same rules as above)

- **Default y** in set: **y = 16**; Focused **144**, Disabled **208**, Loading **272** (x **601** for all).
- **Padding:** **18 / 18 / 12 / 12** · **Item spacing:** **6** · **Radius:** **8**
- **Text padding** inner frame width shifts slightly on Loading (e.g. **93 → 103**) because layout content changes.

---

## 7. Loading indicator — `Buttons/Button loading icon` (Figma MCP pull)

**On-canvas reference (your link):** [node `16638-46353`](https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/Booking-Hub-Guidelines-and-UI--1-?node-id=16638-46353) = instance **`Buttons/Button`** · **Size = xl**, **Hierarchy = Primary**, **State = Loading**, **Icon only = False** (frame **165 × 48** px at **601, 272**). The loader below is the **leading** nested instance in that variant (same structure for **sm / md / lg / xl** Primary Loading).

### 7.1 Component

| | |
|--|--|
| **Component set** | `Buttons/Button loading icon` |
| **Resolved variant** (main component on instance) | **`Size=sm`** · node id **`10250:214874`** |
| **Instance inside xl Primary Loading** | **`10251:215863`** · name **`Buttons/Button loading icon`** |

### 7.2 Slot (wrapper)

| Property | Value |
|----------|--------|
| **Size** | **20 × 20** px |
| **Position** (in **xl** Primary Loading parent) | **x = 18**, **y = 14** (aligns with leading icon column; **y** matches vertical centering for **48** px row height) |
| **Clip content** | **false** |
| **Opacity** | **1** |

### 7.3 Layers (two stacked ellipses, identical geometry)

Both ellipses sit at **x = 1**, **y = 1** inside the **20 × 20** slot → drawable **18 × 18** px circles.

#### Background (track)

| Property | Value |
|----------|--------|
| **Node name** | `Background` |
| **Type** | `ELLIPSE` |
| **Layer opacity** | **0.3** |
| **Stroke** | **SOLID #00e9e3**, opacity **1** |
| **Stroke weight** | **2** |
| **Stroke align** | **CENTER** |
| **Stroke cap / join** | **ROUND** |
| **Arc** | **Full ring** — `startingAngle` **0**, `endingAngle` **≈ 6.28319** rad (**2π**) |
| **`arcData.innerRadius`** | **1** (Figma API) |

#### Line (active segment)

| Property | Value |
|----------|--------|
| **Node name** | `Line` |
| **Type** | `ELLIPSE` |
| **Layer opacity** | **1** |
| **Stroke** | **SOLID #00e9e3**, opacity **1** |
| **Stroke weight** | **2** |
| **Stroke align** | **CENTER** |
| **Stroke cap / join** | **ROUND** |
| **Arc** | **Partial** — `startingAngle` **≈ 4.71239** rad (**3π/2**, 270°), `endingAngle` **≈ 6.28319** rad (**2π**, 360°) → **quarter-turn** arc (spinner “sweep”) |
| **`arcData.innerRadius`** | **1** (Figma API) |

### 7.4 Token summary (loader only)

| Token role | Value |
|------------|--------|
| Spinner stroke / track colour | **#00e9e3** |
| Track ring opacity | **0.3** (layer) |
| Active arc opacity | **1** |
| Stroke weight (both rings) | **2** px |
| Slot | **20 × 20** px · drawable rings **18 × 18** px |

### 7.5 Implementation note

The repo’s `BookingHubButtonSpinner` is a simplified SVG spinner; matching **pixel-perfect** parity requires **two** stroked circles (full track at **30%** opacity + **~90°** arc at full opacity), **2** px stroke, **#00e9e3**, **round** caps — values above are authoritative from the file.

---

*Last captured from Figma MCP plugin API reads; re-validate in file if the design system is updated.*
