# Wheels2Deals — Design System
> UAE Car Broker Platform · Brand Strategy v2.0 · May 2026
> Updated to reflect the current Olive Green & Gold design implementation.

---

## 1. Design Philosophy

Wheels2Deals is a **B2B car broker platform**. The design must communicate trust, prestige, and expertise.

**Core Principles:**
- **Broker, not showroom** — the UI connects people to deals.
- **Olive Green is the foundation** — Olive/Dark Khaki signals prestige, exclusivity, and wealth in the UAE market.
- **Gold is the action** — Prestige Gold appears on CTAs, highlights, and accents.
- **Pill-shaped buttons** — Fully rounded (`rounded-full`) buttons create a modern, approachable, yet premium feel.
- **Immersive media** — Full-bleed images with dark overlays create dramatic and premium entrances.
- **Glassmorphism** — Used extensively for cards overlaid on images or dark backgrounds (`bg-white/[0.10] backdrop-blur-sm`).

---

## 2. Colour Palette

### Primary Brand Colours

| Name | Hex | Usage |
|---|---|---|
| **Deep Olive** | `#2A3510` | Primary text on light surfaces, borders, strong accents |
| **Olive** | `#3A4A20` | Secondary dark background, scrollbars, heart pops |
| **Prestige Gold** | `#C9A84C` | CTAs, highlights, icons, borders, active states |
| **Page Background** | `var(--color-page-bg)` (`#DCE1BA`) | Default light page background (light olive/sand) |

### Secondary & Support Colours

| Name | Hex | Usage |
|---|---|---|
| **Champagne Gold** | `#F5D97A` / `#F0C040` | Used in text gradients alongside Prestige Gold |
| **Pure White** | `#FFFFFF` | Text on dark surfaces, glassmorphism base |
| **Teal** | `#1A6B72` | Service badges, EV category |
| **Desert Sand** | `#E8E4DC` | Form borders, secondary tags |

### Colour Usage Rules

**DO:**
- Use Deep Olive (`#2A3510`) for primary headings and text on light backgrounds.
- Use Gold for interactive elements, underlines, and icons.
- Use `var(--color-page-bg)` (`#DCE1BA`) for default section backgrounds.
- Use Glassmorphism (`bg-white/[0.10] backdrop-blur-sm`) for cards sitting on top of images or dark backgrounds.

**DON'T:**
- Do not use Navy (`#0D1B3E`) as the primary brand color — we have transitioned to Olive.
- Do not use harsh pure black (`#000000`) for text; use `#2A3510` instead.

---

## 3. Typography

### Font Stack

| Role | Font Variable | Notes |
|---|---|---|
| Headings | `var(--font-display)` | Used for all `h1`, `h2`, `h3` and display text |
| Body text | `var(--font-body)` | Used for paragraphs, descriptions, tags |

### Type Scale

| Role | Font | Size | Weight | Tracking (Letter Spacing) |
|---|---|---|---|---|
| Hero Headline | Display | `clamp(38px, 6vw, 80px)` | Semibold / Bold | `-0.04em` |
| Section Headline | Display | `clamp(28px, 3.5vw, 44px)` | Semibold | Tight |
| Section Sub-tag | Body | `13px` | Bold | `0.22em` (Uppercase) |
| Body Text | Body | `14px` - `17px` | Regular | Normal |
| Learn More Link | Body | `13px` | Bold | Wider (Uppercase) |

### Rules
- Section Sub-tags are ALWAYS `13px` uppercase with extremely wide tracking (`0.22em`) and Gold text.
- Headings often have tight or negative tracking to feel solid and modern.

---

## 4. Layout & Grid

### Max Widths
- **Default content container**: `max-w-[1440px] mx-auto`
- **Standard side padding**: `px-3.5` (14px)

### Breakpoints
Follow standard Tailwind breakpoints (`md`, `lg`, `xl`). Mobile views usually utilize horizontal scrolling (`overflow-x-auto snap-x`), while Desktop views use CSS Grids (often Bento-style layouts).

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| Sections / Big Cards | `20px` or `24px` | Main hero wrapper, service background wrappers |
| Standard Cards | `10px` or `16px` | Category cards, individual service bento boxes |
| Buttons | `9999px` (Full) | ALL primary CTAs and links use `rounded-full` |
| Icons | `12px` (xl) | Icon wrappers inside service cards |

> **Rule:** Buttons are ALWAYS pill-shaped (`rounded-full`). We embrace the modern, smooth aesthetic.

---

## 6. Components

### Buttons & Links

**Primary CTA (Ghost / Glass)**
```css
Background:   bg-white/15 backdrop-blur-sm
Border:       border border-white/25
Radius:       rounded-full
Hover:        bg-white/25
```

**"Learn More" / Text Links**
```css
Font:         var(--font-body), 13px, uppercase, tracking-wider
Color:        #C9A84C (Gold)
Animation:    Bottom underline span that expands from left to right on hover.
```

**Arrow Icon Button**
```css
Background:   White
Text Color:   #2A3510 (Olive)
Radius:       rounded-full (w-9 h-9)
Hover:        translate-x-0.5 -translate-y-0.5
```

### Cards

**Bento Grid Service Card**
```css
Background:   bg-white/[0.10] backdrop-blur-sm
Border:       border border-white/10
Radius:       rounded-2xl
Padding:      p-7
Hover:        bg-white/15
```

**Image Cards (Categories / Journey)**
```css
Image:        Absolute fill, object-cover
Overlay:      bg-gradient-to-t from-black/80 via-black/40 to-transparent
Hover:        Image scales up (scale-105 or scale-[1.08]) duration 700ms
```

---

## 7. Motion & Animation

| Token | Duration | Usage |
|---|---|---|
| Image Zoom | `700ms` | `duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]` for luxury slow zooms. |
| Reveal | `700ms` | Scroll reveal animations (`.reveal`) translating up 20px. |
| Hover States | `300ms` | Standard hover transitions for opacities and colors. |

---

## 8. Do's and Don'ts

### Do
- Use **Olive Green (`#2A3510`, `#3A4A20`)** as the primary dark brand colors.
- Use **Prestige Gold (`#C9A84C`)** for accents, small sub-headings, and active states.
- Use **Pill-shaped (`rounded-full`)** buttons for all primary actions.
- Use **Glassmorphism** for cards floating over dark backgrounds or images.
- Ensure all sections use the `var(--color-page-bg)` variable for standard light backgrounds.

### Don't
- Don't use Navy (`#0D1B3E`) — the design has moved to Olive Green.
- Don't use square or `8px` rounded buttons — we exclusively use pill shapes.
- Don't use pure black for text. Use Deep Olive (`#2A3510`).
