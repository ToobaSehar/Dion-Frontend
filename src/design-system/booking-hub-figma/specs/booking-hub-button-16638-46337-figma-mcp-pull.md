Here is a **read-only** pull from the Figma MCP for your link. **Nothing in the repo was changed.**

**Resolved URL**

- **File key:** `dRB94UmUgc4cgLjWc3NvPo`  
- **Node id:** `16638:46337` (from `node-id=16638-46337`)  
- **Layer name:** `Buttons/Button`  

**Tools used:** `get_metadata`, `get_design_context` (screenshot omitted in the call), `get_variable_defs`.

---

### Important: Size / hierarchy / state

The MCP responses **do not include text fields** like `Size = xl`, `Hierarchy = primary`, `State = default`. Those come from **component variant properties in the Figma UI**.  

So: **if** the node you have selected in that URL is the variant **xl + primary + default**, then everything below is the spec for **that** node. Please confirm in Figma’s right panel that this instance matches those variant values.

---

### 1. Size (`get_metadata`)

| Spec | Value |
|------|--------|
| **Width** | **181** px |
| **Height** | **48** px |

---

### 2. Position (`get_metadata`)

| Spec | Value |
|------|--------|
| **x** | **601** |
| **y** | **16** |

*(Figma layout coordinates in the parent frame / page.)*

---

### 3. Auto layout (`get_design_context` codegen)

| Spec | Value |
|------|--------|
| **Layout mode** | Flex (**horizontal** row: leading icon → label → trailing icon) |
| **Gap** | **6** px between items |
| **Padding** | **18** px horizontal, **12** px vertical (`px-[18px] py-[12px]`) |
| **Primary axis alignment** | **Center** (`justify-center`) |
| **Counter axis alignment** | **Center** (`items-center`) |
| **Child sizing** | Icons / text use `shrink-0` where noted; text block uses horizontal padding **2** px inside “Text padding” |

---

### 4. Clip content (`get_design_context`)

| Spec | Value |
|------|--------|
| **Root** | `overflow-clip` |
| **Icon placeholders** | `overflow-clip` on each **20×20** placeholder wrapper |

---

### 5. Appearance (geometry & corners) (`get_design_context`)

| Spec | Value |
|------|--------|
| **Corner radius** | **8** px (`rounded-[8px]`) |
| **Icon boxes** | **20×20** px |

---

### 6. Fill (`get_design_context` + `get_variable_defs`)

| Layer / use | Value |
|-------------|--------|
| **Main button fill** | **`#00BAB5`** — token **`Brand/600`** |
| **Highlight / spec line** | **`#00E9E3`** — token **`Brand/300`** (listed in variable defs for this node) |
| **Label text** | **`#FFFFFF`** — token **`Base/White`** |
| **Implementation note** | Code uses an **absolute** full-bleed layer with `#00bab5` behind content (same as Brand/600). |

---

### 7. Stroke (`get_design_context`)

| Spec | Value |
|------|--------|
| **Explicit vector stroke** | Codegen includes `border border-black border-solid` on the outer frame — **treat as suspect** until you eyeball in Figma; primary look is **fill + shadows**, not a hard black stroke. |
| **“Edge” treatment** | **Inner** shadow stack reads as a **1 px** inner edge: `inset 0 0 0 1px` with **rgba(10,13,18,0.18)** (see Effects). |

---

### 8. Effects (`get_variable_defs` + design text)

**Token:** `Shadows/shadow-xs-skeuomorphic`

| Effect | Spec |
|--------|------|
| **Drop shadow** | **DROP_SHADOW**, color **`#0A0D120D`**, offset **(0, 1)**, radius **2**, spread **0** |
| **Inner shadow 1** | **INNER_SHADOW**, color **`#0A0D120D`**, offset **(0, -2)**, radius **0**, spread **0** |
| **Inner shadow 2** | **INNER_SHADOW**, color **`#0A0D122E`**, offset **(0, 0)**, radius **0**, spread **1** |

*(Same stack is summarized in the design-context line: drop + two inners for the “skeuomorphic” treatment.)*

---

### 9. Typography (`get_design_context` + `get_variable_defs`)

**Token:** `Text md/Semibold`

| Spec | Value |
|------|--------|
| **Family** | **Inter** |
| **Style** | **Semi Bold** |
| **Size** | **16** |
| **Weight** | **600** |
| **Line height** | **24** |
| **Letter spacing** | **0** |
| **Label** | “Button CTA” in the export |

---

### 10. “Selection colors” / bound variables (`get_variable_defs`)

These are the **named variables** returned for this node (typical “applied styles” view):

| Token name | Value |
|------------|--------|
| **Brand/300** | `#00E9E3` |
| **Base/White** | `#FFFFFF` |
| **Brand/600** | `#00BAB5` |
| **Text md/Semibold** | `Font(Inter, Semi Bold, 16, 600, lineHeight 24, letterSpacing 0)` |
| **Shadows/shadow-xs-skeuomorphic** | *(full effect stack as in §8)* |

---

### What you should confirm in Figma

1. **Variants:** Right sidebar shows **Size = xl**, **Hierarchy = primary**, **State = default** for instance `16638:46337`.  
2. **Stroke:** Whether a real **stroke** exists or only **fill + inner shadows** (codegen often mislabels).  

If any of that doesn’t match your selection, share the **exact node-id** for the variant you want and we can re-run MCP on that id only (still read-only).
