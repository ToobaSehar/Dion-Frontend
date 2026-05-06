Read-only pull from the **Figma MCP** (`get_metadata`, `get_design_context`, `get_variable_defs`). **Nothing in the repo was changed.**

**File key:** `dRB94UmUgc4cgLjWc3NvPo`  
**Layer name (all instances):** `Buttons/Button`

---

### How sm / md / lg were chosen (so you can verify)

The MCP **does not return** variant properties like `Size`, `Hierarchy`, or `State`. To hold **Hierarchy = primary** and **State = default** constant and only vary **size**, three instances were taken from the **same horizontal row** (`y = 16`) with **three different frame sizes** (left → right):

| Label used below | Node id | `get_metadata` frame |
|------------------|---------|----------------------|
| **sm** | `16638:46334` | **154 × 36** at **(16, 16)** |
| **md** | `16638:46335` | **158 × 40** at **(202, 16)** |
| **lg** | `16638:46336` | **177 × 44** at **(392, 16)** |

**Your URL** points to **`16638:46337`**. In the **current** file, MCP reports it as **154 × 36** at **(601, 16)** — **same width/height as `16638:46334` (sm)**, i.e. it is **not** the largest frame in that row. So **`16638:46337` is not used as “lg”** below; it gets its **own** section at the end so you can confirm the grid (likely a **different variant axis** than size, e.g. another column).

---

## sm — node `16638:46334`  
*(assumed: primary, default — confirm in Figma)*

**1. Size & position (`get_metadata`)**  
- Width **154** px, height **36** px  
- **x = 16**, **y = 16**

**2. Auto layout (`get_design_context`)**  
- Flex **row** (leading icon → text → trailing icon)  
- **Gap:** **4** px  
- **Padding:** **12** px horizontal, **8** px vertical  
- **Align:** `items-center`, `justify-center`  
- **“Text padding”** wrapper: **2** px horizontal on the label row  

**3. Clip content**  
- Root: `overflow-clip`  
- Icon wrappers: `overflow-clip`, **20 × 20** px  

**4. Appearance**  
- Corner radius **8** px  
- Icon boxes **20 × 20** px  

**5. Fill**  
- Background: **`#00BAB5`** (`Brand/600`) full-bleed behind content  
- Label: **white** (`Base/White`)  

**6. Stroke**  
- Outer: `border-2` **`rgba(255,255,255,0.12)`** solid (from codegen)  
- Inner edge: inset shadow stack **`inset 0 0 0 1px rgba(10,13,18,0.18)`** and **`inset 0 -2px 0 0 rgba(10,13,18,0.05)`**  

**7. Effects**  
- Drop: **(0, 1)**, blur **2**, `#0A0D120D`  
- Inner: **(0, -2)** `#0A0D120D`; **(0, 0)** spread **1** `#0A0D122E`  
- Design line + token: **`Shadows/shadow-xs-skeuomorphic`** (same stack)  
- Also listed: **`Gradient/skeuemorphic-gradient-border`** (empty in variable payload)

**8. Typography**  
- Token **`Text sm/Semibold`**: Inter Semi Bold, **14** px, weight **600**, line height **20**, letter spacing **0**

**9. Selection colors / variables (`get_variable_defs`)**  
`Brand/300` **#00E9E3**, `Base/White` **#FFFFFF**, `Text sm/Semibold` (as above), `Brand/600` **#00BAB5**, `Gradient/skeuemorphic-gradient-border` **""**, `Shadows/shadow-xs-skeuomorphic` (full effect string)

---

## md — node `16638:46335`  
*(assumed: primary, default — confirm in Figma)*

**1. Size & position**  
- **158 × 40** px  
- **x = 202**, **y = 16**

**2. Auto layout**  
- **Gap:** **4** px  
- **Padding:** **14** px horizontal, **10** px vertical  
- Same row structure, centering, text padding **2** px  

**3. Clip content**  
- Same pattern: root + **20 × 20** icon areas `overflow-clip`  

**4. Appearance**  
- Radius **8** px; icons **20 × 20** px  

**5. Fill**  
- **`#00BAB5`**, label white — same idea as sm  

**6. Stroke**  
- `border-2` **`rgba(255,255,255,0.12)`** + inner inset shadows (same pattern as sm)  

**7. Effects**  
- Same **`Shadows/shadow-xs-skeuomorphic`** stack + empty gradient border token  

**8. Typography**  
- Still **`Text sm/Semibold`** **14 / 20** (per design line and `get_variable_defs`)

**9. Selection colors / variables**  
- Same set as **sm** (including **`Shadows/shadow-xs-skeuomorphic`**)

---

## lg — node `16638:46336`  
*(assumed: primary, default — confirm in Figma)*

**1. Size & position**  
- **177 × 44** px  
- **x = 392**, **y = 16**

**2. Auto layout**  
- **Gap:** **6** px  
- **Padding:** **16** px horizontal, **10** px vertical  
- Same structure / alignment / text padding **2** px  

**3. Clip content**  
- Root + icons: `overflow-clip`; icons **20 × 20** px  

**4. Appearance**  
- Radius **8** px; icons **20 × 20** px  

**5. Fill**  
- **`#00BAB5`**, white label text  

**6. Stroke**  
- `border-2` **`rgba(255,255,255,0.12)`** + same inner inset shadow pair  

**7. Effects**  
- Same **`Shadows/shadow-xs-skeuomorphic`** stack  

**8. Typography**  
- Token **`Text md/Semibold`**: Inter Semi Bold, **16** px, **600**, line height **24**, letter spacing **0**

**9. Selection colors / variables**  
`Brand/300`, `Base/White`, **`Text md/Semibold`**, `Brand/600`, empty gradient border, **`Shadows/shadow-xs-skeuomorphic`**

---

## Your link — node `16638:46337`  
*(separate from sm/md/lg mapping above)*

**1. Size & position (`get_metadata`)**  
- **154 × 36** px  
- **x = 601**, **y = 16**

**2. Auto layout (`get_design_context`)**  
- **Gap:** **4** px  
- **Padding:** **12** px horizontal, **8** px vertical  
- Same icon + label + icon structure  

**3. Clip / appearance**  
- Same **overflow-clip** pattern; **8** px radius; **20** px icons  

**4. Fill**  
- **`#00BAB5`** background; **14** px white label (**Text sm/Semibold** in design line)  

**5. Stroke**  
- Codegen shows **`border border-black border-solid`** on the outer frame (treat as **suspect** vs real stroke; inner inset shadows still present)  

**6. Effects**  
- Inset shadow pair still in code; design **styles line** for this call **did not** repeat the full **`Shadows/shadow-xs-skeuomorphic`** string (unlike sm/md/lg pulls).  

**7. Selection colors (`get_variable_defs`)**  
Only: **`Brand/300`**, **`Base/White`**, **`Text sm/Semibold`**, **`Brand/600`** — **no** `Shadows/...` or gradient key in this response for this node.

---

### What to confirm in Figma

1. **Row `y = 16`** is really **primary + default** for every column you care about.  
2. That **sm = 46334, md = 46335, lg = 46336** matches your **Size** variant names (MCP cannot see those names).  
3. **`16638:46337`** — which variant axes apply (your URL no longer matches “largest” size in this row in the **current** file).

If any column is wrong, send **three node-ids** that are exactly **sm / md / lg** with **primary / default** in the UI and we can re-run MCP on those ids only.
