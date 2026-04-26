# wheels2deels — Custom Design System
> Inspired by Bugatti · Ferrari · Lamborghini · Renault · Tesla · BMW · Porsche
> Not a copy of any one brand. A synthesis built for a premium used-car showroom platform.

---

## 1. Design Philosophy

wheels2deels is a **digital showroom, not a marketplace**. The platform presents used cars with the gravity of a luxury dealership — cinematic, restrained, and confident. Every pixel either shows the car or gets out of the way.

**Two-mode identity:**
- **Landing page** — dark, cinematic, dramatic. White text on near-black. This is the brand's first impression — a luxury showroom at night
- **Everything else** — off-white surfaces, near-black text. Clean, editorial, breathable. A premium magazine, not a void

This split is intentional. The landing page seduces. The rest of the platform serves.

**Core Principles:**
- **Light-dominant platform, dark landing** — most users spend time on off-white surfaces; darkness is reserved for the first impression
- **Photography leads** — the UI is infrastructure; the car is the design
- **Buttons are black and white** — BRG is an accent, never a button fill. CTAs earn attention through placement, not color
- **BRG as signal, Gulf Gold as whisper** — British Racing Green carries authority across the platform; Gulf Gold appears so rarely it stops people when it does
- **Chiaroscuro** — the contrast between the dark landing and the light interior of the site IS the design rhythm
- **Precision over decoration** — sharp corners, tight type, no gradients on chrome
- **Purposeful motion** — cinematic, slow, controlled. Transitions serve clarity, never performance

---

## 2. Typography

### Font Stack

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Hero headings | **Big Shoulders Display** | 800 / 700 | Uppercase only. Cinematic, architectural |
| Subheadings | **Raleway** | 600 (SemiBold) | Sentence case or Title Case |
| Body | **Raleway** | 400 (Regular) | All body copy, descriptions, metadata |
| Buttons | **Raleway** | 500 (Medium) | Sentence case. Never all-caps on buttons |
| Labels / Tags | **Raleway** | 600 (SemiBold) | Small, uppercase, letter-spacing 1.5px |

### Import (Google Fonts)
```
Big Shoulders Display: weights 700, 800
Raleway: weights 400, 500, 600
```

### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| `display-hero` | Big Shoulders Display | 96–128px fluid | 800 | 0.92 | 0 | Landing hero, single-word moments |
| `display-feature` | Big Shoulders Display | 64–80px fluid | 800 | 0.95 | 0 | Section hero titles, car name on detail page |
| `display-section` | Big Shoulders Display | 48px | 700 | 1.0 | 0 | Section headings (ALL CAPS) |
| `heading-xl` | Raleway | 36px | 600 | 1.15 | -0.5px | Page-level subheadings |
| `heading-lg` | Raleway | 28px | 600 | 1.2 | -0.3px | Card headings, section titles |
| `heading-md` | Raleway | 22px | 600 | 1.25 | 0 | Component headings |
| `heading-sm` | Raleway | 18px | 600 | 1.3 | 0 | Label headings, sidebar titles |
| `body-lg` | Raleway | 18px | 400 | 1.6 | 0 | Lead paragraphs |
| `body-md` | Raleway | 16px | 400 | 1.65 | 0 | Standard body text |
| `body-sm` | Raleway | 14px | 400 | 1.6 | 0 | Supporting text, metadata |
| `body-xs` | Raleway | 12px | 400 | 1.5 | 0 | Captions, legal, timestamps |
| `label` | Raleway | 11px | 600 | 1.0 | 1.5px | Uppercase tags, badges, eyebrows |
| `button` | Raleway | 15px | 500 | 1.0 | 0.5px | All button labels |

### Rules
- `display-hero` and `display-feature` are **ALWAYS uppercase** — Big Shoulders Display is the architectural voice
- Raleway subheadings are **never uppercase** (except `label` token) — elegance through restraint
- Never mix Big Shoulders Display with body text in the same text block
- Pair `display-section` with `body-lg` or `heading-xl` — always step down 2 levels
- Tight line-heights (0.92–1.0) on Big Shoulders Display. It's designed to be dense
- Never use Raleway weights below 400 or above 600 in the system

---

## 3. Color Palette

### Platform Default — Light (All pages except Landing)

Off-white backgrounds, near-black text. Premium editorial. Think a luxury car magazine, not a tech dashboard.

| Name | Hex | Usage |
|------|-----|-------|
| **Ivory** | `#F6F5F1` | Page background — warm off-white, not clinical pure white |
| **Mist** | `#EEECE8` | Card backgrounds, alternate surfaces |
| **Chalk** | `#E0DDD8` | Borders, dividers, input backgrounds |
| **Pebble** | `#D0CCC6` | Strong borders, separators |
| **Ink** | `#0F0F0F` | Primary text — near-black, warmer than `#000000` |
| **Charcoal** | `#2A2A2A` | Secondary headings, prominent labels |
| **Slate** | `#555555` | Body text, descriptions |
| **Smoke** | `#888888` | Metadata, captions, tertiary text |
| **Ghost** | `#BBBBBB` | Placeholder text, disabled states |

### Landing Page Only — Dark

Near-black canvas, white text. Cinematic. One screen to make the impression.

| Name | Hex | Usage |
|------|-----|-------|
| **Void** | `#080808` | Landing page background — Cinematic Black |
| **Carbon** | `#141414` | Dark card/section surfaces on landing |
| **Graphite** | `#1E1E1E` | Elevated dark panels |
| **Iron** | `#333333` | Dark borders, dividers |
| **White** | `#FFFFFF` | Primary text on landing |
| **Silver** | `#AAAAAA` | Secondary text on landing |
| **Ash** | `#666666` | Tertiary text on landing |

### Accent — British Racing Green (BRG)

The authority accent. Used for prices, labels, focus states, active nav, eyebrows, and badges. **Never as a button background.**

| Name | Hex | Usage |
|------|-----|-------|
| **BRG** | `#005C2E` | On light backgrounds — prices, eyebrows, focus rings, active states |
| **BRG Dark** | `#1A6B3C` | On dark backgrounds (landing, login) |
| **BRG Hover** | `#004A25` | Hover state on BRG text links |
| **BRG Pressed** | `#003318` | Active/pressed state |

> **Rule:** BRG is an accent signal, not a button fill. It appears on prices, eyebrow labels, input focus rings, active nav indicators, and the "New Arrival" badge. If BRG is on a button, it's wrong.

### Accent — Gulf Gold (Whisper)

Barely-there. Used so sparingly it commands attention when it appears.

| Name | Value | Usage |
|------|-------|-------|
| **Gulf Gold** | `#C8981A` | CPO (Certified Pre-Owned) badge text only |
| **Gold Surface** | `rgba(200,152,26,0.07)` | CPO badge background |
| **Gold Border** | `rgba(200,152,26,0.25)` | CPO badge border |

> **Rule:** Gulf Gold appears on CPO badges only — maximum twice per page. The moment it appears more than twice, it becomes noise. Remove it until it has power again.

### Buttons — Black & White Only

Buttons are never BRG or Gold. They earn attention through placement and proportion.

| Surface | Primary | Secondary | Ghost |
|---------|---------|-----------|-------|
| Light bg | `#0F0F0F` fill, white text | Transparent, `#0F0F0F` border + text | Transparent, chalk border, slate text |
| Dark bg | `#FFFFFF` fill, `#0F0F0F` text | Transparent, white-18% border, white text | — |
| Hero CTA | Transparent pill, white border, white text | — | — |

> **Rule:** The landing hero uses a **pill-shaped outline** button — transparent fill, white border, white text, 9999px radius. This is the only place pills are used. All other buttons stay at 4px radius.

### Semantic Colors

| State | Color | Hex |
|-------|-------|-----|
| Available | Success Green | `#22C55E` |
| Reserved | Amber | `#F59E0B` |
| Sold | Muted Gray | `#6B7280` |
| Error | Rose | `#EF4444` |
| Info | Blue | `#3B82F6` |

### Gradient — Text Legibility Only

```css
/* Applied over photography/video when white text sits on image */
background: linear-gradient(to top, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0) 60%);
```
> This is the **only** gradient in the system. No decorative gradients on surfaces, buttons, or backgrounds.

---

## 4. Layout & Grid

### Max Widths
| Container | Width |
|-----------|-------|
| Default content | `1280px` |
| Wide (editorial/hero text) | `1440px` |
| Full-bleed | `100vw` |
| Narrow (forms, modals) | `640px` |

### Grid
- **12 columns**, fluid gutters
- **Gutter**: 24px (desktop), 16px (tablet), 12px (mobile)
- **Outer padding**: 80px (desktop), 40px (tablet), 20px (mobile)

### Breakpoints
| Name | Width | Notes |
|------|-------|-------|
| `xs` | < 480px | Mobile small |
| `sm` | 480–767px | Mobile large |
| `md` | 768–1023px | Tablet |
| `lg` | 1024–1279px | Desktop |
| `xl` | 1280–1535px | Large desktop |
| `2xl` | ≥ 1536px | Ultra-wide |

### Spacing Scale (8px base)
| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Micro gaps |
| `space-2` | 8px | Tight component gaps |
| `space-3` | 12px | Small internal padding |
| `space-4` | 16px | Component padding |
| `space-5` | 24px | Section subcomponent gaps |
| `space-6` | 32px | Card padding, component separation |
| `space-7` | 48px | Section padding (inner) |
| `space-8` | 64px | Section gaps |
| `space-9` | 80px | Large section padding |
| `space-10` | 96px | Hero vertical padding |
| `space-11` | 128px | Monumental spacing |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | `0px` | Full-bleed images, section edges |
| `radius-sm` | `4px` | Buttons, inputs, badges — interactive elements |
| `radius-md` | `8px` | Cards, panels, dropdowns |
| `radius-lg` | `12px` | Modals, bottom sheets |
| `radius-full` | `9999px` | Hero CTA pill + status badge pills only |

> **Rule:** All platform buttons are `4px`. The single exception is the landing hero CTA — pill-shaped to signal "enter the experience", not "click a product button." Status badges also use pill. Nothing else.

---

## 6. Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `1px solid rgba(255,255,255,0.06)` | Default card borders on dark |
| `border-default` | `1px solid rgba(255,255,255,0.12)` | Inputs, containers on dark |
| `border-strong` | `1px solid rgba(255,255,255,0.25)` | Focused inputs, active cards on dark |
| `border-brg` | `1px solid rgba(0,92,46,0.4)` | BRG-accented focus rings on light |
| `border-light-subtle` | `1px solid rgba(0,0,0,0.06)` | Cards on light backgrounds |
| `border-light-default` | `1px solid rgba(0,0,0,0.12)` | Inputs on light |

---

## 7. Components

### Navigation

**Layout — Bugatti-inspired tri-zone:**
```
Left:    Hamburger menu icon (Menu, 20px, white, stroke 1.5)
         Opens full-screen overlay nav drawer

Center:  W2D logo (SVG, white, absolutely centered — not flow positioned)
         Height: 26px on desktop, 22px on mobile

Right:   User icon (User, 20px, white, stroke 1.5)
         Links to login / account page

Background:   rgba(8,8,8,0.88) + backdrop-filter: blur(20px)
Border-bottom: 1px solid rgba(255,255,255,0.06)
Height:       64px
Position:     fixed, top 0, full width, z-index 100
```

**Overlay Nav (when hamburger is open):**
```
Background:   #080808 full screen
Links:        Big Shoulders Display 48px, uppercase, white, centered
Close:        X icon top-right
Animation:    Fade + translateY, 0.4s ease-out
```

### Buttons

**Primary — on light surfaces**
```
Background:   #0F0F0F (Ink)
Text:         #FFFFFF
Font:         Raleway Medium 15px, letter-spacing 0.5px
Padding:      12px 28px
Border:       none
Radius:       4px
Hover:        background → #2A2A2A (Charcoal), transition 0.15s ease-out
Focus:        box-shadow: 0 0 0 3px rgba(0,92,46,0.35)
```

**Primary — on dark surfaces**
```
Background:   #FFFFFF
Text:         #0F0F0F (Ink)
Font:         Raleway Medium 15px, letter-spacing 0.5px
Padding:      12px 28px
Border:       none
Radius:       4px
Hover:        background → #F6F5F1, transition 0.15s ease-out
```

**Secondary (Outline) — on light surfaces**
```
Background:   transparent
Text:         #0F0F0F (Ink)
Border:       1.5px solid #0F0F0F
Font:         Raleway Medium 15px
Padding:      11px 28px
Radius:       4px
Hover:        background → rgba(15,15,15,0.06)
```

**Ghost (outline) — on dark surfaces**
```
Background:   transparent
Text:         #FFFFFF
Border:       1.5px solid rgba(255,255,255,0.18)
Font:         Raleway Medium 15px
Padding:      11px 28px
Radius:       4px
Hover:        border-color → rgba(255,255,255,0.4)
```

**Hero CTA — landing page only**
```
Background:   transparent
Text:         #FFFFFF
Border:       1.5px solid rgba(255,255,255,0.5)
Font:         Raleway Medium 14px, letter-spacing 2px, UPPERCASE
Padding:      14px 40px
Radius:       9999px (pill)
Hover:        background → rgba(255,255,255,0.08), border-color → rgba(255,255,255,0.8)
Transition:   0.3s ease-out
```

**Danger**
```
Background:   transparent
Text:         #EF4444
Border:       1px solid rgba(239,68,68,0.4)
Hover:        background → rgba(239,68,68,0.08)
```

### Cards — Car Listing

```
Background:   #111111
Border:       1px solid rgba(255,255,255,0.06)
Radius:       8px
Overflow:     hidden
Shadow:       none at rest

Image area:   16:9 aspect ratio, object-fit: cover, radius 0
              Hover: scale(1.02) on image only, transition 0.35s ease-out

Content area:
  Padding:    20px
  Car name:   Big Shoulders Display 22px uppercase, #FFFFFF
  Brand/Year: Raleway Regular 13px, #666666
  Price:      Big Shoulders Display 28px weight 700, #1A6B3C (BRG Dark)
  Specs row:  Raleway Regular 13px, #AAAAAA (km · fuel · transmission)
  CTA:        Black fill button, "View Car", 4px radius

Hover state:
  Border: 1px solid rgba(255,255,255,0.15)
  Shadow: 0 8px 32px rgba(0,0,0,0.4)
  Transition: all 0.25s ease-out
```

### Car Status Badges

```
Available:  bg rgba(34,197,94,0.12),    text #22C55E, border 1px solid rgba(34,197,94,0.25)
Reserved:   bg rgba(245,158,11,0.12),   text #F59E0B, border 1px solid rgba(245,158,11,0.25)
Sold:       bg rgba(107,114,128,0.12),  text #6B7280, border 1px solid rgba(107,114,128,0.2)
New:        bg rgba(0,92,46,0.10),      text #005C2E, border none
CPO:        bg rgba(200,152,26,0.07),   text #92700D, border 1px solid rgba(200,152,26,0.25)
```

### Inputs & Forms

```
Background:   #1C1C1C (dark) / #F6F5F1 (light)
Border:       1px solid rgba(255,255,255,0.1) (dark) / 1.5px solid #E0DDD8 (light)
Radius:       4px
Text:         Raleway Regular 15px
Placeholder:  #444444 (dark) / #BBBBBB (light)
Padding:      12px 16px
Height:       44–48px

Focus (both):
  Border:   1.5px solid #005C2E (BRG)
  Shadow:   0 0 0 3px rgba(0,92,46,0.12)
  Outline:  none

Error:
  Border:   1.5px solid rgba(239,68,68,0.5)

Label:        Raleway SemiBold 12px, #888888, uppercase, letter-spacing 1px
              Margin-bottom: 8px
```

### Image Treatment

- **Hero**: Full-viewport, `object-fit: cover`, zero radius, zero padding. Legibility gradient applied
- **Car gallery**: 16:9 primary image + thumbnail strip. Corners: `8px` on container, `0px` on images
- **Placeholder**: Dark `#1C1C1C` with centered car icon in `#3A3A3A`
- **Lazy loading**: `loading="lazy"` on all below-fold images
- **Hover on listings**: `scale(1.02)` on image only, `overflow: hidden` on card

### Modals

```
Backdrop:   rgba(0,0,0,0.7), backdrop-filter: blur(4px)
Container:  #111111, radius 12px, border 1px solid rgba(255,255,255,0.08)
Max-width:  600px (default), 900px (gallery)
Padding:    32px
Close btn:  Top-right, ghost X button, 40×40px touch target
Animation:  opacity + translateY(-8px) → 0, 0.25s ease-out
```

---

## 8. Page Sections — Layout Patterns

### Hero (Landing Page)

```
Height:           100svh
Background:       Full-bleed looping video (hero.webm + hero.mp4 from Supabase)
                  + dark overlay: rgba(8,8,8,0.45)
                  + bottom fade: linear-gradient(to top, #080808 0%, transparent 40%)
Content position: Horizontally centered, vertically ~55–60% down (slightly below middle)
Animation:        Content fades in + settles upward on load (0.8s ease-out, 0.3s delay)

Eyebrow:          Raleway SemiBold 11px, #1A6B3C (BRG Dark), uppercase, letter-spacing 3px
Headline:         Big Shoulders Display 96–128px fluid, 800, uppercase, #FFFFFF, line-height 0.92
Subtext:          Raleway Regular 16px, #AAAAAA, max-width 480px, centered
CTA:              Single pill outline button (see hero CTA spec above)
                  Label: "EXPLORE COLLECTION" or similar — uppercase, tracked

Scroll indicator: Bottom-center — thin animated vertical line, 40px, white-30%
```

**Video sources (Supabase Storage):**
```
WebM: https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero.webm
MP4:  https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero.mp4
```

### Brand / Story Section (Below Hero)

```
Background:       #080808 (continues from hero fade)
Section padding:  120px 0
Layout:           Large left text block + right accent element or image
Eyebrow:          BRG accent text, 11px uppercase, letter-spacing 3px
Heading:          Big Shoulders Display 64px uppercase, white
Body:             Raleway Regular 18px, #AAAAAA, max-width 560px, line-height 1.7
```

### Featured Listings (Dark section)

```
Background:       #080808
Section padding:  80px 0
Eyebrow:          Big Shoulders Display 14px uppercase, #1A6B3C (BRG Dark), letter-spacing 3px
Heading:          Big Shoulders Display 48px uppercase, #FFFFFF
Grid:             3 columns (desktop), 2 (tablet), 1 (mobile), gap 24px
CTA row:          Black-fill "View All" button centered below grid
```

### Car Detail Page

```
Hero image:       Full-width 16:9, no radius, legibility gradient at bottom
Car name:         Big Shoulders Display 64px uppercase, #FFFFFF
Brand · Year:     Raleway Regular 16px, #666666
Price:            Big Shoulders Display 48px, #1A6B3C (BRG Dark)
CTA:              Black fill "Enquire Now" + Ghost "Share"

Specs grid:       2×3 or 3×2 grid
  Each spec:      Icon + Raleway SemiBold 13px uppercase label + Raleway Regular 18px value

Description:      Raleway Regular 16px, #AAAAAA, line-height 1.65
Image gallery:    Thumbnail strip, click to expand modal
```

### Editorial / Light Section

```
Background:       #F6F5F1 (Ivory)
Text:             #0F0F0F (Ink)
Heading:          Big Shoulders Display uppercase, #0F0F0F
Body:             Raleway Regular 16px, #555555
Accent elements:  BRG #005C2E (labels, eyebrows, active states)
```

---

## 9. Motion & Animation

Cinematic — slow, controlled, never decorative.

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-instant` | 0.1s | linear | Immediate feedback (checkbox, toggle) |
| `motion-fast` | 0.15s | ease-out | Hover states, color transitions |
| `motion-base` | 0.3s | ease-out | Default transitions, nav, dropdowns |
| `motion-moderate` | 0.5s | ease-out | Modals entering, slide panels |
| `motion-slow` | 0.8s | ease-out | Page transitions, hero reveals, carousels |
| `motion-cinematic` | 1.2s | ease-out | Section scroll reveals, full-page transitions |

**Scroll reveal pattern (all sections below hero):**
```css
/* Initial state */
opacity: 0;
transform: translateY(24px);
filter: blur(4px);

/* Revealed state (when in viewport) */
opacity: 1;
transform: translateY(0);
filter: blur(0);
transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.6s ease-out;
```

**Parallax on hero video:**
```css
/* Video moves at 40% of scroll speed */
transform: translateY(calc(var(--scroll-y) * 0.4px));
```

**Rules:**
- Never use `ease-in` for elements entering the screen — always `ease-out`
- No bounce, no spring, no overshoot — this is a showroom, not a toy
- Hover image zoom: `scale(1.04)`, `0.6s ease-out` — slow and controlled
- Buttons: color/opacity transitions only — never scale on buttons
- Motion must be `prefers-reduced-motion` safe — wrap all animations

---

## 10. Elevation & Depth

Depth through surface layering, not shadows:

| Layer | Background | Border | Usage |
|-------|------------|--------|-------|
| 0 — Abyss | `#080808` | none | Landing page background |
| 1 — Surface | `#111111` | `rgba(255,255,255,0.06)` | Cards, panels |
| 2 — Raised | `#1C1C1C` | `rgba(255,255,255,0.08)` | Dropdowns, tooltips |
| 3 — Float | `#242424` | `rgba(255,255,255,0.1)` | Modals, drawers |
| 4 — Overlay | `rgba(0,0,0,0.7) + blur(4px)` | none | Modal backdrop |
| Nav | `rgba(8,8,8,0.88) + blur(20px)` | `rgba(255,255,255,0.06)` | Sticky nav always |

**Shadows** — used sparingly on elevated elements only:
```css
shadow-card:   0 4px 24px rgba(0,0,0,0.4)
shadow-modal:  0 16px 64px rgba(0,0,0,0.6)
shadow-hover:  0 8px 32px rgba(0,0,0,0.5)
```

---

## 11. Iconography

- **Library:** Lucide Icons (matches project's existing stack)
- **Size:** 16px (inline), 20px (default), 24px (prominent)
- **Color:** Inherits from parent text color — never hardcoded
- **Stroke width:** 1.5px (refined, not chunky)
- **Never fill icons** — stroke only

---

## 12. Do's and Don'ts

### Do
- Use Big Shoulders Display **only for headings** — minimum 22px, always uppercase at display sizes
- Use BRG for prices, focus rings, eyebrow labels, active states — never as a button fill
- Use Gulf Gold only for CPO badges — maximum twice per page
- Keep buttons black on light, white on dark — no color fills
- Use the hero CTA as a pill — it's a cinematic invitation, not a product button
- Use the legibility gradient over every photo/video where text sits
- Keep all motion slow and ease-out — cinematic, not bouncy
- Apply status badges consistently on every car card
- Keep `4px` radius on all platform buttons — `9999px` for hero CTA and status badges only

### Don't
- Don't use BRG or Gulf Gold as button backgrounds
- Don't put the logo anywhere except on a dark surface
- Don't use Big Shoulders Display for body text, captions, or button labels
- Don't use gradients on surfaces or buttons (only the legibility vignette over media)
- Don't add drop shadows to cards — elevation comes from surface color and border
- Don't use Raleway below weight 400 or above 600
- Don't use ease-in for entering elements — always ease-out
- Don't use scale transforms on buttons — color transitions only
- Don't mix dark and light surfaces on the same page

---

## 13. Page Inventory (Reference)

| Page | Route | Background | Text | Notes |
|------|-------|------------|------|-------|
| Landing | `/` | `#080808` dark | White | Full-bleed hero video, cinematic, dark nav |
| Car Listings | `/listings` | `#F6F5F1` ivory | `#0F0F0F` ink | Editorial grid, breathable |
| Car Detail | `/listings/[slug]` | `#F6F5F1` ivory | `#0F0F0F` ink | Light overall; hero image is full-bleed |
| Admin Dashboard | `/admin` | `#F6F5F1` ivory | `#0F0F0F` ink | Clean workspace feel |
| Admin — Add Car | `/admin/cars/new` | `#F6F5F1` ivory | `#0F0F0F` ink | Form-heavy, needs clarity |
| Admin — Edit Car | `/admin/cars/[id]/edit` | `#F6F5F1` ivory | `#0F0F0F` ink | Same as above |
| Auth Login | `/auth/login` | `#080808` dark | White | Mirrors landing — brand moment |

**Summary:** Dark = Landing + Login only. Off-white = everywhere the user spends actual time.

---

## 14. CSS Variables (Tailwind Config Reference)

```js
colors: {
  // Platform default — light surfaces
  ivory:    '#F6F5F1',   // page background
  mist:     '#EEECE8',   // card background
  chalk:    '#E0DDD8',   // borders, input bg
  pebble:   '#D0CCC6',   // strong borders

  // Text on light
  ink:      '#0F0F0F',   // primary text
  charcoal: '#2A2A2A',   // secondary headings
  slate:    '#555555',   // body text
  smoke:    '#888888',   // metadata, captions
  ghost:    '#BBBBBB',   // placeholders, disabled

  // Landing / Login — dark surfaces
  void:     '#080808',   // Cinematic Black, landing bg
  carbon:   '#141414',   // dark cards
  graphite: '#1E1E1E',   // dark panels
  iron:     '#333333',   // dark borders
  white:    '#FFFFFF',
  silver:   '#AAAAAA',   // body on dark
  ash:      '#666666',   // muted on dark

  // BRG — authority accent (never on buttons)
  brg: {
    DEFAULT: '#005C2E',  // on light bg
    dark:    '#1A6B3C',  // on dark bg
    hover:   '#004A25',
    pressed: '#003318',
  },

  // Gulf Gold — whisper accent (CPO badge only)
  gold: {
    DEFAULT: '#C8981A',
    surface: 'rgba(200,152,26,0.07)',
    border:  'rgba(200,152,26,0.25)',
  },

  // Semantic — car status
  available: '#22C55E',
  reserved:  '#F59E0B',
  sold:      '#6B7280',

  // Semantic — UI states
  error:   '#EF4444',
  info:    '#3B82F6',
}
```

---

## 15. Assets

| Asset | Path | Usage |
|-------|------|-------|
| Logo SVG | `public/logo.svg` | Nav, all UI — always on dark surface |
| Logo PNG | `public/logo.png` | Fallback / social sharing |
| Logo UHD | `public/logo_UHD.png` | Large format display only |
| Hero Video WebM | Supabase `car-videos/hero.webm` | Landing hero (primary) |
| Hero Video MP4 | Supabase `car-videos/hero.mp4` | Landing hero (fallback) |
