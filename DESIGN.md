# Design System Document

## 1. Overview & Creative North Star

### The Digital Curator
This design system is built upon the philosophy of "The Digital Curator." It moves away from the dense, cluttered marketplace aesthetic and toward a high-end, editorial gallery experience. By leveraging the depth of a true-black environment, we treat every product as a singular masterpiece. 

The system breaks traditional "template" rigidity through **intentional asymmetry** and **tonal layering**. We do not use lines to contain ideas; we use space and light to suggest them. By employing a high-contrast typography scale against a dark, monochromatic base, we create an authoritative yet breathable atmosphere that feels both premium and futuristic.

---

## 2. Colors

The palette is engineered for a "Deep Dark" mode that maximizes the contrast of high-quality product photography and vibrant accent colors.

### The Foundation
*   **Surface (`#131313`)**: The canvas. This deep black provides the infinite depth required for high-end product rendering.
*   **On-Surface (`#e2e2e2`)**: A crisp, high-legibility white for primary information.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. Use `surface-container-low` to set a section apart from the main `surface`. If a transition feels too abrupt, use a soft vertical gradient rather than a stroke.

### Surface Hierarchy & Nesting
Depth is achieved by stacking surface tiers. Treat the UI as physical layers of frosted glass:
*   **Main Background:** `surface` (`#131313`)
*   **Primary Cards:** `surface-container` (`#1f1f1f`)
*   **Nested Elements:** `surface-container-high` (`#2a2a2a`) inside a card to highlight a specific feature or price table.

### The "Glass & Gradient" Rule
For floating navigation or prominent feature cards, apply **Glassmorphism**. Use a semi-transparent `surface-variant` with a `backdrop-blur` of 20px+. To provide "visual soul," use subtle linear gradients (e.g., `primary` to `primary-container`) for CTA backgrounds, ensuring they feel like glowing light sources rather than flat blocks.

---

## 3. Typography

The typography system relies on the **San Francisco (Inter)** aesthetic to convey precision and modernity.

*   **Display Scale (`display-lg` at 3.5rem)**: Used for hero value propositions. Set with tight letter-spacing (-0.02em) and bold weights to command attention.
*   **Headline Scale**: These are the "editorial hooks." Use `headline-lg` for product titles to create a clear entry point into each section.
*   **Tabular Precision**: For prices and technical specs, use `title-md` or `body-lg`. Ensure the use of "tabular num" OpenType features so that prices align perfectly in vertical columns, reflecting the distributor's reliability.
*   **Labels**: Use `label-md` in all-caps with increased letter-spacing for category tags (e.g., "NEW," "PRO") to provide a structural rhythm without adding weight.

---

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering**. 

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift. This mimics the way light falls on different depths of matte material.
*   **Ambient Shadows:** If an element must float (like a modal or a floating action button), use a "tinted shadow." Instead of `#000000`, use a 10% opacity version of the `primary` or `on-surface` color with a 40px+ blur radius.
*   **The "Ghost Border" Fallback:** If accessibility requires a container definition, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.
*   **Product Focus:** Use `high-quality product imagery` as the primary driver of depth. Images should feature natural shadows that bleed into the `#131313` background, making the product appear to sit within the UI rather than on top of it.

---

## 5. Components

### Buttons
*   **Primary**: Pill-shaped (`rounded-full`), utilizing the `primary` to `primary-container` gradient. High-contrast `on-primary` text.
*   **Secondary**: Glassmorphic background (semi-transparent `surface-variant`) with a `Ghost Border`.

### Chips & Sub-options
*   **Selection Chips**: Used for color or storage variants. When selected, use the `primary` accent color. For unselected states, use `surface-container-highest` with no border.
*   **Horizontal Scroll**: For color swatches and model sub-options, utilize horizontal carousels with a "fade-to-black" edge mask to signal more content.

### Tables & Lists
*   **The Price Grid**: Forbid divider lines. Use `spacing-4` vertical gaps between rows and `surface-container-low` alternating "zebra" backgrounds for long technical data sets.
*   **Cards**: Apply `rounded-xl` (1.5rem/24px) to all main product cards. Cards should feature a subtle `surface-bright` inner glow (0.5px top-only stroke) to mimic light catching the top edge of a physical object.

### Input Fields
*   **Text Inputs**: Deep charcoal (`surface-container-lowest`) with `outline-variant` ghost borders. On focus, the border transitions to a `primary` glow.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme vertical whitespace (`spacing-16` to `spacing-24`) to separate major product categories.
*   **Do** allow product imagery to overlap container boundaries to create a sense of scale and luxury.
*   **Do** use vibrant accents (Apple Blue, Pro Orange) sparingly—only for status, action, or category markers.
*   **Do** optimize for a single-column mobile flow, ensuring large touch targets (minimum 44px height).

### Don't
*   **Don't** use 100% opaque white borders; they shatter the "Digital Curator" atmosphere.
*   **Don't** use standard "Material" drop shadows; they feel dated and "heavy."
*   **Don't** crowd the layout. If you feel the need to add a divider line, add more whitespace instead.
*   **Don't** use low-resolution imagery. The entire system relies on the "Premium" feel of the product photography to define the quality of the distributor.