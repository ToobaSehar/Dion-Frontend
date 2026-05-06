Here is a structured dump from **Figma MCP `get_design_context`** for  
`https://www.figma.com/design/dRB94UmUgc4cgLjWc3NvPo/…?node-id=1141-81479`  
(`fileKey=dRB94UmUgc4cgLjWc3NvPo`, **`node-id=1141:81479`**, **`data-name="Content"`**).  
**No repo files were changed.**

---

## Root: `Content` — `1141:81479`

| Property | Value (from MCP export) |
|----------|-------------------------|
| **Node** | `1141:81479`, name `Content` |
| **Layout** | `content-stretch` (stretch-aligned children), **`flex`**, **`gap-[16px]`**, **`items-start`**, **`justify-center`**, **`relative`**, **`size-full`** (fills parent) |
| **Direction** | Row (horizontal step strip) |

---

## Connector line: `Lines` — `1141:81480`

| Property | Value |
|----------|--------|
| **Position** | **`-translate-x-1/2` `absolute` `left-1/2` `top-[12px]`** — horizontally centered, **12px** from top of `Content` |
| **Size** | **`h-0` `w-[768px]`** (zero height container; line is raster asset) |
| **Inner** | **`absolute inset-[-1px_-0.13%]`** wrapping an **`<img>`** (`imgLines`) |

**Asset:** `imgLines` → `https://www.figma.com/api/mcp/asset/fa8472c5-1272-4875-96b7-cf1d65e533db`

---

## Repeated column: `_Step base` (×4)

Each step column (`1141:81484`, `1141:81485`, `1141:81486`, `1141:81487`) shares this shell:

| Property | Value |
|----------|--------|
| **Layout** | **`flex` `flex-col`**, **`gap-[12px]`**, **`items-center`**, **`relative`**, **`min-w-px`**, **`content-stretch`** |
| **Flex** | **`flex-[1_0_0]`** — equal grow, no shrink, zero basis (equal-width columns) |
| **Shrink** | **`shrink-0`** on icon and text stack where applied |

Vertical stack per step: **icon (24×24 area)** → **12px gap** → **text block**.

---

## `StepIconBase` — sizes / states (from export + usage)

**Shared frame**

| Property | Value |
|----------|--------|
| **Corner** | **`rounded-[12px]`** |
| **Icon box** | **`size-[24px]`** (24×24) |
| **Overflow** | **`overflow-clip`**, **`relative`**, **`shrink-0`** |

**State: Incomplete (`sm`)**

| Property | Value |
|----------|--------|
| **Fill** | **`bg-white`** |
| **Stroke** | **`border-[1.5px] border-solid border-[#e9eaeb]`** |
| **Inner** | **8×8** dot, **`absolute` `left-1/2` `top-1/2` `-translate-x-1/2 -translate-y-1/2`**, asset **`imgDot`** |

**Asset:** `imgDot` → `https://www.figma.com/api/mcp/asset/858b2c86-ce16-45ff-8338-dfe74b8c2bac`

**State: Current (`sm`)**

| Property | Value |
|----------|--------|
| **Fill** | **`bg-[#00bab5]`** |
| **Focus ring (shadow)** | **`shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#00bab5]`** |
| **Inner dot** | **8×8**, asset **`imgDot1`** |

**Asset:** `imgDot1` → `https://www.figma.com/api/mcp/asset/97a82385-2f2b-4aed-9957-a4704a33d9d3`

**State: Complete (`sm`)**

| Property | Value |
|----------|--------|
| **Fill** | **`bg-[#00bab5]`** |
| **Check** | **12×12** container, centered; icon asset **`imgIcon`** |

**Asset:** `imgIcon` → `https://www.figma.com/api/mcp/asset/da683ba4-bfb9-47d8-8130-269662db0309`

*(MCP also references internal node ids `1139:79866`, `1139:80037`, `1139:80097`, etc., on variants.)*

---

## Text stack under each step (`Content` inside `_Step base`)

Shared wrapper (`data-name="Content"` on each column’s text block):

| Property | Value |
|----------|--------|
| **Layout** | **`flex` `flex-col`**, **`items-center`**, **`text-center`**, **`w-full`**, **`shrink-0`**, **`relative`**, **`content-stretch`** |
| **Type size** | **`text-[14px]`** |
| **Line height** | **`leading-[20px]`** |
| **Font style** | **`not-italic`** |

**Title line (primary label)**

| Property | Value |
|----------|--------|
| **Font** | **`font-['Inter:Semi_Bold',sans-serif]` `font-semibold`** |
| **Colors (by step in this frame)** | **`#414651`** (default), **`#008884`** (current step title in sample), **`#414651`** (others) |

**Subtitle line**

| Property | Value |
|----------|--------|
| **Font** | **`font-['Inter:Regular',sans-serif]` `font-normal`** |
| **Colors (by step)** | **`#535862`** (default/upcoming), **`#00bab5`** (current step subtitle in sample), **`#535862`** (others) |

Both title and subtitle use **`w-full`**, **`shrink-0`**, **`relative`**.

---

## Design tokens named in the MCP “styles” blurb

- **Brand/600:** `#00BAB5`  
- **Brand/700:** `#008884`  
- **Gray/200:** `#E9EAEB`  
- **Gray/300:** `#D5D7DA`  
- **Gray/600:** `#535862`  
- **Gray/700:** `#414651`  
- **Base/White:** `#FFFFFF`  
- **Text sm/Semibold:** Inter Semi Bold, **14px**, weight **600**, line height **20**, letter-spacing **0**  
- **Text sm/Regular:** Inter Regular, **14px**, weight **400**, line height **20**, letter-spacing **0**  
- **Focus ring (effect):** drop shadow **#00BAB5**, spread **4**; drop shadow **#FFFFFF**, spread **2** (matches current-step ring stack in code)

---

## Copy shown in this instance (example content only)

1. **Your details** / *Name and email* — Complete (teal + check)  
2. **Company details** / *Website and location* — Current (teal + dot + ring)  
3. **Invite your team** / *Start collaborating* — Incomplete  
4. **Add your socials** / *Automatic sharing* — Incomplete  

---

## MCP image / description summary

The bundled description matches: **horizontal** layout, **four** steps, **line through icon centers**, **teal** for complete/active segments and **light gray** for upcoming, **title + subtitle** under each icon with spacing as above.

---

## What was **not** done

Per your instruction: **nothing in the project was modified** — this is documentation-only from **`get_design_context`**.

---

**Note:** Figma MCP returns **Tailwind-style** snippets plus **temporary asset URLs** (MCP notes ~7-day expiry). For authoritative numeric specs in Dev Mode, use the same **`1141:81479`** node in Figma directly.
