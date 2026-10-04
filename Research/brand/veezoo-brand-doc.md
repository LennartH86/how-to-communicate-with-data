---
name: brand-doc
description: "Veezoo brand reference — colors, typography, logo, visual patterns, and UI conventions. Use when you need brand-accurate styling for any Veezoo content: documents, presentations, artifacts, emails, or web content. This skill is a reference library, not a content generator."
---

# Veezoo Brand Reference

## Colors

### Accent (Primary Action Color)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#00b4d8` | Buttons, links, accent borders, CTAs |
| `accent-light` | `#48cae4` | Hover states, secondary accents |
| `accent-dark` | `#0096c7` | Text gradient end, pressed states |

### Brand Teal Scale
Used sparingly for data viz and product UI references:
`#f0fdfb` → `#cbfcf5` → `#97f8eb` → `#5aeddf` → `#28d9cc` → `#0fbdb2` → `#099892` → `#0c7976` → `#0f605f` → `#114f4e`

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#111827` | Headlines, body text |
| `text-secondary` | `#6b7280` | Subheadings, descriptions |
| `text-muted` | `#9ca3af` | Captions, metadata |

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#ffffff` | Cards, main content |
| `bg-secondary` | `#f9fafb` | Page backgrounds, alternating sections |
| `bg-tertiary` | `#f3f4f6` | Subtle dividers, input fields |
| `bg-mesh-base` | `#fafafa` | Base for gradient mesh backgrounds |

### Borders
| Token | Hex |
|-------|-----|
| `border-light` | `#e5e7eb` |
| `border-medium` | `#d1d5db` |

### Shadows
```
shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

---

## Typography

### Font Stack
| Role | Font | Weights | CSS Variable | Usage |
|------|------|---------|--------------|-------|
| **Hero** | Outfit | 400, 500, 600, 700 | `--font-outfit` | Hero headlines, large display text |
| **Display** | DM Sans | 500, 600, 700 | `--font-cabinet` | Section headings (h1–h3) |
| **Body** | Inter | 400–700 | `--font-inter` | Body text, UI, labels |

All loaded via Google Fonts. For HTML artifacts, use:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale (Tailwind classes)
- `h1`: `text-4xl md:text-5xl lg:text-6xl` — font-display, font-semibold, tracking-tight
- `h2`: `text-3xl md:text-4xl lg:text-5xl` — font-display, font-semibold, tracking-tight
- `h3`: `text-2xl md:text-3xl` — font-display, font-semibold, tracking-tight
- Body: `leading-relaxed` (1.625 line-height)

### Text Gradient Effect
For accent-colored headings:
```css
background-image: linear-gradient(135deg, #00b4d8 0%, #0096c7 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## Logo

### Dark Version (for light backgrounds)
Cyan circles `#30c7df` + dark text `#2c2e35`. Use on white/light backgrounds.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 49" width="400" height="77"><style>.shp0{fill:#30c7df}.shp1{fill:#2c2e35}</style><g><g><g><path fill-rule="evenodd" class="shp0" d="M189.69 2.59C201.92 2.59 211.82 12.5 211.82 24.73C211.82 36.95 201.92 46.86 189.69 46.86C177.47 46.86 167.56 36.95 167.56 24.73C167.56 12.5 177.47 2.59 189.69 2.59ZM209.34 24.73C209.34 15.22 201.64 7.52 192.14 7.52C182.64 7.52 174.94 15.22 174.94 24.73C174.94 34.23 182.64 41.93 192.14 41.93C201.64 41.93 209.34 34.23 209.34 24.73Z"/><path fill-rule="evenodd" class="shp0" d="M253.6 24.73C253.6 36.95 243.7 46.86 231.47 46.86C219.25 46.86 209.34 36.95 209.34 24.73C209.34 12.5 219.25 2.59 231.47 2.59C243.7 2.59 253.6 12.5 253.6 24.73ZM229.03 41.93C238.53 41.93 246.23 34.23 246.23 24.73C246.23 15.22 238.53 7.52 229.03 7.52C219.53 7.52 211.82 15.22 211.82 24.73C211.82 34.23 219.53 41.93 229.03 41.93Z"/></g><g><path fill-rule="evenodd" class="shp1" d="M108.84 41.46C114.69 41.46 118.81 39.07 122.27 35.44L126.23 38.98C121.95 43.76 116.75 46.98 108.68 46.98C96.97 46.98 87.41 37.99 87.41 24.73C87.41 12.36 96.07 2.45 107.85 2.47C119.38 2.49 126.36 10.84 127.58 22.07C127.84 24.55 127.03 27.28 123.97 27.28L93.84 27.28C94.75 36.26 101.34 41.46 108.84 41.46ZM119.03 22.17C121.28 22.17 121.32 21.78 120.81 19.45C119.4 12.94 115.02 7.83 107.69 7.83C100.35 7.83 94.75 13.93 93.84 22.17L119.03 22.17Z"/><path class="shp1" d="M28.83 43.08L45.96 3.15L39.55 3.15L25.1 38.59C24.44 40.12 23.72 40.12 23.12 38.59L8.73 3.18L2.18 3.18L19.24 43.08C20.71 47.39 26.96 47.41 28.83 43.08Z"/><path class="shp1" d="M134.42 45.99L166.33 45.99L166.33 40.6L139.4 40.6C138.22 40.59 138.17 40.19 139.04 39.2L164.09 9.84C166.18 7.87 166.01 3.12 161.13 3.16L130.21 3.16L130.21 8.54L156.37 8.54C157.05 8.54 157.18 9.09 156.67 9.68L132.04 38.62C128.87 41.76 129.84 45.95 134.42 45.99Z"/><path fill-rule="evenodd" class="shp1" d="M64.77 41.46C70.62 41.46 74.74 39.07 78.2 35.44L82.16 38.98C77.87 43.76 72.68 46.98 64.61 46.98C52.9 46.98 43.34 37.99 43.34 24.73C43.34 12.36 52 2.45 63.78 2.47C75.31 2.49 82.29 10.84 83.51 22.07C83.77 24.55 82.96 27.28 79.9 27.28L49.77 27.28C50.68 36.26 57.27 41.46 64.77 41.46ZM74.96 22.17C77.21 22.17 77.25 21.78 76.74 19.45C75.33 12.94 70.95 7.83 63.62 7.83C56.28 7.83 50.68 13.93 49.77 22.17L74.96 22.17Z"/></g></g></g></svg>
```

### White Version (for dark/colored backgrounds)
Cyan circles `#30c7df` + white text `#ffffff`. Use on gradient mesh headers or dark sections.

Same SVG structure but with `.shp1 { fill: #ffffff }`.

### Logo Usage Rules
- Minimum width: 120px
- Clear space: at least 1x the height of the "oo" circles on all sides
- Never stretch, rotate, or recolor the logo
- On gradient mesh backgrounds, use the white version

---

## Signature Background: Hero Style

This is the "Veezoo look" — a **light, airy background** with colorful blobs, glass panels, and a blueprint grid. Used on the homepage hero and should be adapted for branded documents. **The background is always LIGHT with DARK text** — never a dark/navy background.

### Layer 1: Base Mesh (subtle pastel radials on near-white)
```css
background-color: #fafafa;
background-image:
  radial-gradient(at 0% 0%, hsla(250, 50%, 95%, 1) 0px, transparent 50%),
  radial-gradient(at 100% 0%, hsla(280, 45%, 95%, 1) 0px, transparent 50%),
  radial-gradient(at 0% 50%, hsla(220, 50%, 96%, 1) 0px, transparent 50%),
  radial-gradient(at 100% 50%, hsla(260, 40%, 96%, 1) 0px, transparent 50%),
  radial-gradient(at 0% 100%, hsla(230, 45%, 95%, 1) 0px, transparent 50%),
  radial-gradient(at 100% 100%, hsla(270, 45%, 95%, 1) 0px, transparent 50%);
```

### Layer 2: Large Colorful Blobs (key visual element!)
Three large floating gradient circles, absolutely positioned:
1. **Blue/cyan blob** (top-left area): `radial-gradient(circle, rgba(50, 170, 240, 0.85) 0%, transparent 55%)` — large, ~50vw
2. **Cyan/teal blob** (bottom-right): `radial-gradient(circle, rgba(60, 170, 220, 0.7) 0%, transparent 60%)` — large, ~42vw
3. **Purple blob** (top-right): `radial-gradient(circle, rgba(190, 120, 220, 0.7) 0%, transparent 60%)` — medium, ~35vw

These blobs are the most visually distinctive part of the Veezoo brand. They should be large, vivid, and partially overlapping or extending off-screen.

### Layer 3: Glassmorphism Accordion Panels
Vertical glass stripes across the full width:
- 80px wide panels with 80px gaps (alternating)
- `background: rgba(255, 255, 255, 0.15)` with `backdrop-filter: blur(2px)`
- Subtle white left border `rgba(255, 255, 255, 0.12)` and dark right border `rgba(75, 85, 110, 0.08)`
- Masked to fade out toward bottom and edges

### Layer 4: Blueprint Grid
SVG pattern overlay with minor (20px) and major (80px) grid:
- Minor grid: `stroke: rgba(160, 160, 160, 0.12)`, strokeWidth 0.5
- Major grid: `stroke: rgba(140, 140, 140, 0.18)`, strokeWidth 1
- Masked to fade in from top (transparent → visible toward bottom)

### Layer 5: Noise Texture
SVG fractal noise overlay at ~0.85 opacity for subtle paper texture feel.

### Layer 6 (optional): Decorative SVG Elements
The homepage adds a knowledge graph (bottom-left) and column chart (bottom-right) in muted gray strokes. For branded documents, these can be simplified or omitted.

### For Static HTML/Thumbnail Reproduction
Since the full React implementation uses animations and backdrop-filter, a simplified CSS-only version should:
1. Use the base mesh background
2. Add 2-3 large absolutely-positioned gradient circle divs for the blobs
3. Add an SVG blueprint grid overlay
4. Add SVG noise texture
5. Use **dark text** (gray-900) on this light background — NOT white text

### When to Use
- **Full hero style** (mesh + blobs + grid + glass panels): Thumbnails, presentation covers, title slides
- **Simplified** (mesh + blobs only): One-pager headers, section backgrounds
- **Mesh only** (no blobs): Subtle page backgrounds
- **Never use a dark/navy background** as the Veezoo hero style — the brand look is light and airy

---

## UI Patterns

### Cards
- Background: white
- Border: `1px solid #e5e7eb`
- Border radius: `16px` (rounded-2xl)
- Shadow: `shadow-sm` default, `shadow-md` on hover
- Padding: `24px` (p-6)

### Callout/Quote Blocks
- Left border: `4px solid #00b4d8`
- Background: white
- Padding: `32px–40px`
- Shadow: `0 4px 20px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`

### Buttons
- Primary: `bg-accent text-white rounded-full px-6 py-3 font-medium`
- Hover: `bg-accent/90`
- Outline: `border-2 border-accent text-accent rounded-full px-6 py-3`

### Stats/Metrics Strip
Horizontal row of 3–5 stat items, each with:
- Large number in accent color or text-gradient
- Label below in text-secondary
- Optional icon above
- Used on the homepage claims strip and good for one-pager highlights

---

## Source Files Reference
For deeper customization, these are the authoritative source files in the website repo:
- `app/globals.css` — CSS variables, component classes, all custom styles
- `tailwind.config.ts` — color scales, font families, animations, gradients
- `app/layout.tsx` — font loading configuration
- `components/sections/BackgroundElements.tsx` — hero background implementation
- `components/sections/HeroSection.tsx` — hero layout, claims strip, trust bar
- `public/veezoo_logo.svg` / `public/veezoo_logo_white.svg` — logo files
