# Design System: Scientific Animal Release Mini-Program

## 1. Overview & Creative North Star: "The Living Manuscript"
This design system moves away from the sterile, plastic feel of modern apps toward a "Living Manuscript" aesthetic. It blends the precision of scientific documentation with the soulful, tactile quality of traditional rice paper and ink. 

**Creative North Star: The Scientific Sanctuary**
The goal is to create a digital environment that feels like an intentional pause. We break the "template" look through:
*   **Intentional Asymmetry:** Using Bento Grid layouts where the weight of information is balanced but not perfectly mirrored.
*   **Organic Flow:** Elements should feel as though they were placed by hand on high-quality stationery, rather than snapped to a rigid digital grid.
*   **High-Contrast Scale:** Using dramatic differences between large Serif titles and functional Sans-Serif labels to create an editorial, high-end feel.

---

## 2. Colors & Surface Philosophy

The palette is rooted in the natural world: the deep forest (`primary`), weathered minerals (`secondary`), and the glow of dawn (`accent`).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Boundaries must be defined solely through background tonal shifts.
*   A `surface-container-low` section sitting on a `surface` background creates a soft, sophisticated transition that feels more "Zen" than a harsh line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials. 
*   **Level 0 (Background):** `surface` (#faf9f4) - The base "Rice Paper."
*   **Level 1 (Sections):** `surface-container` (#efeee9) - Defines major content areas.
*   **Level 2 (Cards):** `surface-container-lowest` (#ffffff) - Pure white cards that appear to "lift" off the paper.

### Signature Textures: The Gold Foil (烫金)
The `secondary` (#6e5e00) and `secondary-fixed` (#fee264) tokens are not just colors; they are light.
*   **The Foil Effect:** For high-impact highlights (e.g., "Species Released" count), use a linear gradient from `secondary` to `secondary-fixed` at a 135-degree angle. This mimics the way light hits physical gold foil.

---

## 3. Typography: The Editorial Voice

We utilize a dual-font strategy to balance scientific authority with serene elegance.

*   **Display & Headlines (Noto Serif):** These are the "soul" of the program. Used for species names, chapter titles, and hero impact numbers. High-contrast serifs convey prestige and history.
*   **Body & Labels (Plus Jakarta Sans):** These are the "tools." Used for scientific data, descriptions, and UI navigation. The geometric clarity ensures readability at small scales (e.g., `label-sm`).

| Level | Token | Font | Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-md` | Noto Serif | 2.75rem | 600 | Hero data points (e.g., "1,240 Released") |
| **Headline**| `headline-sm`| Noto Serif | 1.5rem | 500 | Section titles, Animal names |
| **Title**   | `title-md`   | Plus Jakarta | 1.125rem| 600 | Card headings, Navigation |
| **Body**    | `body-md`    | Plus Jakarta | 0.875rem| 400 | Research notes, descriptions |
| **Label**   | `label-sm`   | Plus Jakarta | 0.6875rem| 500 | Metadata, timestamps, buttons |

---

## 4. Elevation & Depth: Tonal Layering

Traditional "drop shadows" are too heavy for a Zen atmosphere. Instead, we use **Ambient Light.**

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container` (#efeee9) background. The 4% brightness difference is enough to define the edge without visual noise.
*   **Atmospheric Shadows:** For floating elements (e.g., a "Release Now" FAB), use a shadow with a 24px blur, 0px offset, and 6% opacity of the `on-surface` color.
*   **Glassmorphism:** For top navigation bars or floating menus, use `surface` at 80% opacity with a `backdrop-filter: blur(20px)`. This creates a "Cloud Mist" effect where the content below flows softly under the glass.

---

## 5. Components & The Bento Grid

### The Bento Grid Layout
Instead of long lists, use the **Bento Grid** for data visualization. Combine `xl` (1.5rem) and `md` (0.75rem) corner radii to create a modular, organic mosaic of information.

### Buttons & Interaction
*   **Primary Action:** A solid `primary-container` (#4a5d4e) background with `on-primary` text. Use `xl` (1.5rem) rounding for a soft, pebble-like feel.
*   **Gold Highlight (CTA):** For scientific breakthroughs or special releases, use the "Gold Foil" gradient mentioned in Section 2.
*   **Tertiary:** No background, just `primary` text with a `label-md` weight.

### Cards & Data Visualization
*   **No Dividers:** Forbid the use of line-dividers. Use `Spacing 4` (1.4rem) to separate content groups.
*   **Visual Soul:** Every card should have a "breathing" margin. Do not crowd the edges.
*   **Input Fields:** Use `surface-container-low` with a "Ghost Border" (outline-variant at 20% opacity). When focused, the border transitions to a soft `primary` glow.

### Specialized Components
*   **The "Trace" Chip:** Small, transparent pills with a `primary` tint used for scientific tags (e.g., "Endangered," "GPS Tracked").
*   **Progress Orbs:** Instead of linear bars, use circular "Zen" rings in `secondary-fixed` to show release milestones.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical spacing. If the left margin is `6` (2rem), try a `4` (1.4rem) internal margin for a more hand-crafted feel.
*   **Do** prioritize "Rice Paper" (`surface`) white space. 40% of the screen should be "empty" to maintain a serene atmosphere.
*   **Do** use the `secondary` gold sparingly. It is a reward for the user's eye, not a primary UI color.

### Don't:
*   **Don't** use 100% black (#000). Use `on-surface` (#1b1c19) to maintain the warmth of the palette.
*   **Don't** use sharp corners. Everything must feel weathered and smooth, like a river stone (minimum `12rpx`).
*   **Don't** use "Pop" animations. Use ease-in-out transitions with a duration of 400ms to mimic the "flowing" atmosphere requested.

---
*Director's Final Note: Remember, we are not building an app; we are building a sanctuary for scientific progress. Every pixel should feel like a deep breath.*