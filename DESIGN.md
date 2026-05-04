# Wheels2Deals — Design System
> UAE Car Broker Platform · Brand Strategy v1.0 · May 2026
> Approved by client. Replaces previous Bugatti-inspired showroom design.

---

## 1. Design Philosophy

Wheels2Deals is a **B2B car broker platform**, not a showroom. The design must communicate trust, speed, and expertise — the three things a buyer or seller needs to feel before they take action.

**The single most important rule:**
> A visitor must understand what W2D does within 3 seconds of landing. Clarity beats beauty. Confidence beats drama.

**Core Principles:**
- **Broker, not showroom** — the UI connects people to deals; it does not sell cars
- **Navy is the foundation** — Sovereign Navy signals authority, trust, and UAE premium culture
- **Gold is the action** — Prestige Gold appears only on CTAs, highlights, and accents. Never overused
- **White creates breathing room** — generous whitespace on content pages, never crowded
- **Photography supports, not leads** — unlike the old design, cars support the broker message; they don't dominate it
- **Mobile-first always** — UAE has 96%+ smartphone penetration; every layout starts at 375px
- **WhatsApp is a conversion channel** — treat it as a first-class CTA throughout the platform

**Two-surface identity:**
- **Hero / Banner sections** — Sovereign Navy background, white + gold text, full authority
- **Content sections** — Pure white or Desert Sand, Navy text, breathable editorial feel

---

## 2. Colour Palette

### Primary Brand Colours

| Name | Hex | Usage |
|---|---|---|
| **Sovereign Navy** | `#0D1B3E` | All hero sections, headers, dark surfaces, nav background |
| **Prestige Gold** | `#C9A84C` | CTAs, highlights, icons, borders, active states |
| **Pure White** | `#FFFFFF` | Page backgrounds, text on dark, breathing space |

### Secondary & Support Colours

| Name | Hex | Usage |
|---|---|---|
| **Deep Sapphire** | `#1A2F5E` | Gradient companion to Navy, section depth |
| **Champagne Gold** | `#F0D890` | Soft background tints, light gold surfaces |
| **Antique Gold** | `#9E7B2A` | Subheadings, secondary gold on light backgrounds |
| **Emirate Teal** | `#1A6B72` | Service badges, EV category, digital CTAs |
| **Desert Sand** | `#E8E4DC` | Card backgrounds, section dividers, alternating surfaces |
| **Stone Grey** | `#5A5A5A` | Body text, captions, secondary content |

### Colour Usage Rules

**DO:**
- Navy on all hero/banner backgrounds
- Gold for all CTAs, highlights, active icons, borders
- White for breathing space — never crowd the layout
- Teal only for service category badges and EV-related content
- Champagne Gold as a soft background tint behind content blocks
- Deep Sapphire for Navy gradient depth

**DON'T:**
- Never use pure black `#000000` — use Sovereign Navy `#0D1B3E` instead
- Never use Gold as a full-section background — it reads as cheap
- Never use more than 2 primary colours in a single section
- Never use red, green, or purple anywhere in brand materials
- Never reduce Gold opacity below 70% — it loses its luxury signal

### Section Colour Combinations

| Section Type | Background | Primary Text | CTA |
|---|---|---|---|
| Hero / Banner | `#0D1B3E` Sovereign Navy | `#FFFFFF` White + `#C9A84C` Gold | Gold BG + Navy text |
| Cards & Content | `#FFFFFF` White | `#0D1B3E` Navy | Gold accent border |
| Alternating sections | `#E8E4DC` Desert Sand | `#0D1B3E` Navy | Navy ghost |
| Service Badges | `#1A6B72` Emirate Teal | `#FFFFFF` White | — |
| Captions / Meta | `#E8E4DC` Desert Sand | `#5A5A5A` Stone Grey | — |
| Trust / Stats bar | `#0D1B3E` Navy | `#C9A84C` Gold numbers + White labels | — |

### Semantic Colours

| State | Hex | Usage |
|---|---|---|
| Available | `#22C55E` | Car availability badge |
| Reserved | `#F59E0B` | Pending/reserved status |
| Sold | `#6B7280` | Sold out state |
| New Arrival | `#C9A84C` | Gold — same as brand accent |
| EV | `#1A6B72` | Teal — electric vehicle badge |
| Error | `#EF4444` | Form errors, destructive actions |
| Info | `#3B82F6` | Informational states |

---

## 3. Typography

### Font Stack

| Role | Font | Weight | Notes |
|---|---|---|---|
| Hero headings | **Montserrat** | ExtraBold (800) | Confident, geometric, modern |
| Section headings | **Montserrat** | Bold (700) | Page section titles |
| Card titles | **Montserrat** | Bold (700) | Service cards, partner names |
| Body text | **Inter** | Medium (500) | Primary descriptions |
| Body secondary | **Inter** | Regular (400) | Captions, meta, supporting text |
| Labels / Tags | **Inter** | Bold (700) / ALL CAPS | Category badges, status labels |
| Tagline | **Montserrat** | ExtraBold (800) | "DRIVE SMART. DEAL BETTER." — tracked |

### Google Fonts Import
```
Montserrat: weights 700, 800
Inter: weights 400, 500, 700
```

### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `display-hero` | Montserrat | 48–64px fluid | 800 | 1.05 | -0.02em | Homepage hero headline |
| `display-section` | Montserrat | 32–40px | 700 | 1.1 | -0.01em | Page section titles |
| `display-card` | Montserrat | 18–24px | 700 | 1.2 | 0 | Card titles, partner names |
| `body-lg` | Inter | 16–17px | 500 | 1.7 | 0 | Primary body, descriptions |
| `body-md` | Inter | 14–15px | 400 | 1.65 | 0 | Standard body text |
| `body-sm` | Inter | 11–13px | 400 | 1.5 | 0 | Captions, secondary content |
| `label` | Inter | 9–11px | 700 | 1.0 | 0.15em | Category labels, ALL CAPS badges |
| `tagline` | Montserrat | 13–15px | 800 | 1.0 | 0.12em | "DRIVE SMART. DEAL BETTER." |

### Rules
- `display-hero` is never ALL CAPS — sentence case or title case only
- `label` tokens are ALWAYS ALL CAPS with tracked letter-spacing
- Never use Montserrat for body paragraphs
- Never use Inter for hero headlines
- Tagline "DRIVE SMART. DEAL BETTER." — always Montserrat ExtraBold, always ALL CAPS, always tracked

---

## 4. Layout & Grid

### Max Widths

| Container | Width |
|---|---|
| Default content | `1280px` |
| Wide hero text | `1440px` |
| Full-bleed | `100vw` |
| Narrow (forms, modals) | `640px` |

### Grid
- **12 columns**, fluid gutters
- **Gutter**: 24px desktop / 16px tablet / 12px mobile
- **Outer padding**: 80px desktop / 40px tablet / 20px mobile

### Breakpoints

| Name | Width | Notes |
|---|---|---|
| `xs` | < 480px | Mobile small |
| `sm` | 480–767px | Mobile large |
| `md` | 768–1023px | Tablet |
| `lg` | 1024–1279px | Desktop |
| `xl` | 1280–1535px | Large desktop |
| `2xl` | ≥ 1536px | Ultra-wide |

### Spacing Scale (8px base)

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps |
| `space-2` | 8px | Tight component gaps |
| `space-3` | 12px | Small internal padding |
| `space-4` | 16px | Component padding |
| `space-5` | 24px | Section sub-gaps |
| `space-6` | 32px | Card padding, component separation |
| `space-7` | 48px | Section inner padding |
| `space-8` | 64px | Section gaps |
| `space-9` | 80px | Large section padding |
| `space-10` | 96px | Hero vertical padding |
| `space-11` | 128px | Monumental spacing |

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-none` | `0px` | Full-bleed images, section edges |
| `radius-sm` | `4px` | Inputs, small interactive elements |
| `radius-md` | `8px` | Buttons, cards, panels, dropdowns |
| `radius-lg` | `12px` | Modals, bottom sheets |
| `radius-xl` | `24px` | Pill badges, tags, eyebrow labels |
| `radius-full` | `9999px` | Avatar only |

> **Rule:** Buttons are `8px`. Badges and eyebrow pills are `24px`. No pill-shaped buttons anywhere — that was the old showroom language.

---

## 6. Borders

| Token | Value | Usage |
|---|---|---|
| `border-subtle` | `1px solid rgba(13,27,62,0.08)` | Cards on white background |
| `border-default` | `1px solid rgba(13,27,62,0.15)` | Inputs, containers on white |
| `border-strong` | `1px solid rgba(13,27,62,0.25)` | Active cards, focused inputs |
| `border-gold` | `1px solid #C9A84C` | Gold accent borders on dark surfaces |
| `border-gold-subtle` | `1px solid rgba(201,168,76,0.3)` | Subtle gold on light surfaces |
| `border-dark-subtle` | `1px solid rgba(255,255,255,0.1)` | Borders on Navy backgrounds |

---

## 7. Components

### Navigation

**Sticky top bar — desktop:**
```
Height:           64px
Background:       #0D1B3E (Navy) — solid, not transparent
Border-bottom:    1px solid rgba(201,168,76,0.25) (subtle gold)
Position:         sticky, top 0, z-50

Left:             W2D logo text — Montserrat ExtraBold, #C9A84C gold, 22px
Center:           Nav links — Inter Medium 14px, #FFFFFF
                  Active link: #C9A84C gold with 2px gold underline
                  Links: "Buy a Car" · "Sell" · "Services" · "About" · "Contact"
Right:            "Login" ghost button (white border, white text)
                  + "List Your Car" solid CTA (gold bg, navy text)
                  — 8px radius, 40px height, 16px horizontal padding

Mega menu:        Full-width dropdown, #0D1B3E Navy BG, gold accents on hover
                  Opens on "Services" hover/click
```

**Mobile drawer:**
```
Trigger:          Hamburger icon, white stroke 1.5px, 20px
Drawer:           Full-height slide-in from left, #0D1B3E Navy BG
Links:            Montserrat Bold 20px, #FFFFFF, 48px row height
Active:           #C9A84C gold left border 3px
Footer:           "Sign In" CTA — Gold BG, Navy text
Animation:        translateX(-100%) → 0, 0.3s ease-out
```

### Buttons

**Primary CTA — Gold (main conversion action)**
```
Background:   #C9A84C (Prestige Gold)
Text:         #0D1B3E (Sovereign Navy)
Font:         Montserrat Bold 15px
Padding:      14px 28px
Height:       48px
Radius:       8px
Border:       none
Hover:        background → #B8963C (darkened gold), scale 1.02, 0.2s ease-out
Shadow hover: 0 4px 16px rgba(201,168,76,0.35)
Focus:        box-shadow 0 0 0 3px rgba(201,168,76,0.4)
```

**Secondary — Navy ghost**
```
Background:   transparent
Text:         #0D1B3E
Border:       2px solid #0D1B3E
Font:         Montserrat Bold 15px
Padding:      13px 28px
Height:       48px
Radius:       8px
Hover:        background → rgba(13,27,62,0.06)
```

**Ghost on dark (Navy sections)**
```
Background:   transparent
Text:         #C9A84C
Border:       2px solid #C9A84C
Font:         Montserrat Bold 15px
Padding:      13px 28px
Radius:       8px
Hover:        background → rgba(201,168,76,0.1)
```

**WhatsApp CTA**
```
Background:   #25D366
Text:         #FFFFFF
Font:         Montserrat Bold 15px
Icon:         WhatsApp SVG, 20px, white, left of text
Padding:      14px 28px
Radius:       8px
Hover:        background → #1ebe5d
```

**Danger**
```
Background:   transparent
Text:         #EF4444
Border:       1px solid rgba(239,68,68,0.4)
Hover:        background → rgba(239,68,68,0.08)
Radius:       8px
```

### Cards

**Service Card**
```
Background:   #FFFFFF
Border:       1px solid rgba(13,27,62,0.1)
Border-top:   3px solid #C9A84C (gold top accent)
Radius:       8px
Padding:      28px
Shadow:       0 4px 24px rgba(13,27,62,0.08)

Icon:         24px, #C9A84C gold
Title:        Montserrat Bold 18px, #0D1B3E
Body:         Inter Regular 14px, #5A5A5A, line-height 1.6
CTA:          Ghost navy button on hover only

Hover:        translateY(-4px), shadow deepens to 0 8px 32px rgba(13,27,62,0.14)
Transition:   0.2s ease-out
```

**Car Listing Card**
```
Background:   #FFFFFF
Border:       1px solid rgba(13,27,62,0.1)
Radius:       8px
Overflow:     hidden
Shadow:       0 4px 24px rgba(13,27,62,0.08)

Image area:   16:9 aspect ratio, object-fit cover, radius 0
              Hover: scale(1.04) on image, transition 0.4s ease-out
              Badge: Teal or Sand pill, top-left, 8px margin

Content:
  Padding:    20px
  Year+Make:  Inter Medium 12px, #5A5A5A, ALL CAPS tracked
  Model:      Montserrat Bold 18px, #0D1B3E
  Price:      Montserrat ExtraBold 22px, #C9A84C gold
  Specs row:  Inter Regular 13px, #5A5A5A (km · fuel · transmission)
  CTA:        "Get Connected" — Gold primary button, full width

Hover state:
  Border:     1px solid rgba(201,168,76,0.4)
  Shadow:     0 8px 32px rgba(13,27,62,0.14)
```

**Stat / Trust Card**
```
Background:   #0D1B3E (Navy)
Radius:       8px
Padding:      32px 24px
Text-align:   center

Number:       Montserrat ExtraBold 40px, #C9A84C gold
Label:        Inter Regular 13px, #FFFFFF 75% opacity, ALL CAPS tracked
```

**Partner Card**
```
Background:   #FFFFFF
Border:       1px solid rgba(13,27,62,0.1)
Radius:       8px
Padding:      24px
Shadow:       0 2px 12px rgba(13,27,62,0.06)

Logo:         centered, max 120px wide, max 48px tall, grayscale → full color on hover
Name:         Montserrat Bold 14px, #0D1B3E, centered
Type:         Inter Regular 12px, #5A5A5A, centered
```

### Badges / Tags

```
Service type (Teal):
  Background: #1A6B72, Text: #FFFFFF
  Font: Inter Bold 10px ALL CAPS, letter-spacing 0.12em
  Padding: 4px 10px, Radius: 24px

Car category (Sand):
  Background: #E8E4DC, Text: #5A5A5A
  Same font spec, Radius: 24px

Status — Available:
  Background: rgba(34,197,94,0.12), Text: #22C55E
  Border: 1px solid rgba(34,197,94,0.25), Radius: 24px

Status — Sold:
  Background: rgba(107,114,128,0.12), Text: #6B7280
  Border: 1px solid rgba(107,114,128,0.2), Radius: 24px

Status — New Arrival:
  Background: rgba(201,168,76,0.12), Text: #9E7B2A
  Border: 1px solid rgba(201,168,76,0.3), Radius: 24px

Status — EV:
  Background: rgba(26,107,114,0.12), Text: #1A6B72
  Border: 1px solid rgba(26,107,114,0.25), Radius: 24px
```

### Inputs & Forms

```
Background:   #FFFFFF
Border:       1.5px solid #E8E4DC (Desert Sand)
Radius:       8px
Text:         Inter Regular 15px, #0D1B3E
Placeholder:  #BBBBBB
Padding:      12px 16px
Height:       48px

Focus:
  Border:     1.5px solid #C9A84C (Prestige Gold)
  Shadow:     0 0 0 3px rgba(201,168,76,0.2)
  Outline:    none

Error:
  Border:     1.5px solid rgba(239,68,68,0.5)
  Shadow:     0 0 0 3px rgba(239,68,68,0.12)

Label:        Inter Bold 11px, #0D1B3E, ALL CAPS, letter-spacing 0.1em
              Margin-bottom: 8px

Select:       Same as input, custom gold chevron icon
Textarea:     Same as input, min-height 120px, resize vertical only
```

### Modals

```
Backdrop:     rgba(13,27,62,0.6), backdrop-filter: blur(4px)
Container:    #FFFFFF, radius 12px, border 1px solid rgba(13,27,62,0.1)
Max-width:    600px default / 900px gallery
Padding:      40px
Header:       Montserrat Bold 22px, #0D1B3E + gold top border 3px
Close:        Top-right, 40×40px touch target, Stone Grey X icon
Animation:    opacity + translateY(-12px) → 0, 0.25s ease-out
Shadow:       0 24px 80px rgba(13,27,62,0.2)
```

---

## 8. Page Sections — Layout Patterns

### Hero Section (Landing Page)

```
Height:           100svh, min 600px
Background:       Full-bleed photography — Dubai road/skyline, golden hour
                  Navy-to-transparent gradient over left 60%:
                  linear-gradient(to right, rgba(13,27,62,0.88) 0%, rgba(13,27,62,0.6) 50%, transparent 100%)

Content:          Left-aligned, vertically centered, 80px left padding, max 560px wide
                  z-index above gradient

Eyebrow:          Teal pill badge — #1A6B72 bg, white text, Inter Bold ALL CAPS tracked
                  Text: "UAE'S #1 CAR BROKER"

H1:               Montserrat ExtraBold 56–64px, white, line-height 1.05
                  Second line keyword in #C9A84C Prestige Gold

Body:             Inter Regular 17px, rgba(255,255,255,0.75), line-height 1.7, max 480px

CTA row:          32px margin-top, 16px gap between buttons
                  Primary: "I'm Buying" — Gold BG, Navy text, 8px radius
                  Secondary: "I'm Selling" — Gold border ghost, Gold text

Trust line:       20px below CTAs
                  Inter Regular 13px, rgba(255,255,255,0.55)
                  "✓ 500+ Deals Closed   ✓ 200+ Verified Partners   ✓ Free to Use"

Scroll indicator: Bottom-center, chevron icon, rgba(255,255,255,0.5), animated pulse
```

### How It Works Section

```
Background:       #FFFFFF
Padding:          96px 0

Header:
  Label:          Teal badge, "HOW W2D WORKS"
  H2:             Montserrat Bold 36px, #0D1B3E
  Subtext:        Inter Regular 16px, #5A5A5A, max 520px centered

Steps:            3-column grid, connecting gold arrow between steps
Each step card:
  Icon:           40px circle, #C9A84C gold bg, Navy icon
  Step number:    Inter Bold 11px, #C9A84C, ALL CAPS "STEP 01"
  Title:          Montserrat Bold 18px, #0D1B3E
  Body:           Inter Regular 14px, #5A5A5A, line-height 1.6

Footer note:      Inter Regular 13px, #5A5A5A, centered, italic
                  "Partners pay W2D per qualified connection. You use W2D completely free."
```

### Services Grid Section

```
Background:       #0D1B3E (Navy)
Padding:          96px 0

Header:
  Label:          Gold text, "OUR SERVICES"
  H2:             Montserrat Bold 36px, #FFFFFF

Grid:             3×2 desktop / 2×3 tablet / 1×6 mobile, 24px gap

Service cards on Navy:
  Background:     rgba(255,255,255,0.06)
  Border:         1px solid rgba(201,168,76,0.2)
  Border-top:     2px solid #C9A84C
  Radius:         8px
  Padding:        28px
  Icon:           #C9A84C gold, 28px
  Title:          Montserrat Bold 17px, #FFFFFF
  Body:           Inter Regular 13px, rgba(255,255,255,0.65)
  CTA:            Gold ghost arrow link on hover
  Hover:          background → rgba(255,255,255,0.1), translateY(-3px)
```

### Trust Signals Bar

```
Background:       #0D1B3E (Navy, continues from or precedes services)
Padding:          64px 0
Border-top:       1px solid rgba(201,168,76,0.2)
Border-bottom:    1px solid rgba(201,168,76,0.2)

Layout:           4-column stat row, centered

Each stat:
  Number:         Montserrat ExtraBold 48px, #C9A84C — CountUp animation on scroll
  Label:          Inter Regular 13px, rgba(255,255,255,0.7), ALL CAPS tracked
  Divider:        1px vertical, rgba(201,168,76,0.2), between each stat

Sub-label:        Inter Regular 12px, rgba(255,255,255,0.4), centered below row
                  "Updated monthly · Independently verified"
```

### Featured Listings Section

```
Background:       #FFFFFF
Padding:          96px 0

Header (split layout):
  Left:           Label + H2 + subtext
  Right:          "View All Listings →" link — Gold, Montserrat Bold 14px

Carousel:         3 cards visible desktop / 1.2 mobile (peek right edge)
                  Prev/Next arrows: Navy circle, Gold chevron icon
                  Dots: Gold active, Sand inactive

Card:             See Car Listing Card spec above
```

### Why W2D / Brand Pillars Section

```
Background:       #E8E4DC (Desert Sand)
Padding:          96px 0

Header:
  H2:             Montserrat Bold 36px, #0D1B3E, centered

Grid:             2×2 desktop / 1 column mobile, 32px gap

Each pillar:
  Icon:           Gold, 32px
  Title:          Montserrat Bold 20px, #0D1B3E, #C9A84C gold left border 3px accent
  Body:           Inter Regular 15px, #5A5A5A, line-height 1.65

Pillars:          TRUST · SPEED · EXPERTISE · PRESTIGE
```

### WhatsApp CTA Section

```
Background:       #0D1B3E (Navy)
Padding:          80px 0

Layout:           Split — left 55% text content, right 45% phone mockup illustration

Left:
  Label:          Teal badge "INSTANT RESPONSE"
  H2:             Montserrat ExtraBold 40px, #FFFFFF
  Body:           Inter Regular 16px, rgba(255,255,255,0.75)
  CTA:            WhatsApp green button — large, 56px height
  Sub-note:       Inter Regular 12px, #C9A84C — "Available 9AM–10PM · English & Arabic"

Right:            Phone mockup, WhatsApp chat UI screenshot
                  Subtle gold glow behind phone: radial-gradient(ellipse, rgba(201,168,76,0.15), transparent)
```

### Partner Ecosystem Section

```
Background:       #FFFFFF
Padding:          80px 0

Header:           Label + H2 + body centered
Marquee:          Auto-scrolling logo strip, pauses on hover
                  Speed: 40s linear infinite
                  Logos: grayscale, opacity 0.6 → full colour on hover
Dividers:         Thin gold lines above and below marquee

CTA:              "Become a Partner →" — Navy ghost button, centered below
```

### Footer

```
Background:       #0D1B3E (Navy)
Border-top:       3px solid #C9A84C (Gold)
Padding:          64px 0 32px

Layout:           4-column grid desktop / 2-col tablet / 1-col mobile

Column 1 — Brand:
  Logo:           "W2D" Montserrat ExtraBold, #C9A84C gold, 28px
  Tagline:        "DRIVE SMART. DEAL BETTER." Inter Bold ALL CAPS, rgba(255,255,255,0.5)
  Copyright:      Inter Regular 12px, rgba(255,255,255,0.4)
  Location:       "Dubai, UAE" with pin icon

Column 2 — Services:
  Heading:        Inter Bold 11px, #C9A84C, ALL CAPS tracked
  Links:          Inter Regular 14px, rgba(255,255,255,0.7)
                  Hover: #FFFFFF

Column 3 — Company:
  Same treatment
  Links: About · Contact · Partner With Us

Column 4 — Connect:
  Social icons:   Instagram · LinkedIn · TikTok · WhatsApp
  Icon style:     24px, rgba(255,255,255,0.6) → #C9A84C on hover
  Language:       Arabic / English toggle pill

Bottom bar:       Border-top rgba(255,255,255,0.1), 24px padding-top
                  Privacy · Terms · left aligned
                  "RTA Approved Partner" badge right aligned
```

---

## 9. Motion & Animation

Purposeful and trust-building — not cinematic drama. Transitions serve clarity.

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `motion-instant` | 0.1s | linear | Checkbox, toggle, immediate feedback |
| `motion-fast` | 0.15s | ease-out | Hover colour transitions |
| `motion-base` | 0.25s | ease-out | Buttons, links, nav items |
| `motion-moderate` | 0.4s | ease-out | Dropdowns, drawers, modals |
| `motion-reveal` | 0.6s | ease-out | Scroll reveal on sections |
| `motion-counter` | 1.5s | ease-out | CountUp stat animations |

**Scroll reveal — all sections:**
```css
/* Initial state */
opacity: 0;
transform: translateY(20px);

/* Revealed (IntersectionObserver threshold 0.12) */
opacity: 1;
transform: translateY(0);
transition: opacity 0.6s ease-out, transform 0.6s ease-out;
```

**Stagger — card grids:**
```css
/* Each child delays 80ms more than previous */
transition-delay: calc(var(--index) * 80ms);
```

**CountUp — trust stats:**
Triggered on scroll into view. Duration 1.5s, ease-out curve, starts from 0.

**Card hover:**
```css
transform: translateY(-4px);
box-shadow: 0 8px 32px rgba(13,27,62,0.14);
transition: all 0.2s ease-out;
```

**Rules:**
- Never use `ease-in` for entering elements — always `ease-out`
- No bounce, spring, or overshoot — this is a broker platform, not a consumer app
- No parallax on mobile — performance cost is not worth it
- All animations must respect `prefers-reduced-motion`
- No autoplay video on hero — use photography instead (mobile data, performance)

---

## 10. Elevation & Depth

| Layer | Background | Border | Shadow | Usage |
|---|---|---|---|---|
| 0 — Page | `#FFFFFF` | — | — | Base page surface |
| 1 — Card | `#FFFFFF` | `rgba(13,27,62,0.1)` | `0 4px 24px rgba(13,27,62,0.08)` | Cards, panels |
| 2 — Raised | `#FFFFFF` | `rgba(13,27,62,0.15)` | `0 8px 32px rgba(13,27,62,0.12)` | Dropdowns, tooltips |
| 3 — Float | `#FFFFFF` | `rgba(13,27,62,0.1)` | `0 24px 80px rgba(13,27,62,0.18)` | Modals |
| 4 — Overlay | `rgba(13,27,62,0.6) + blur(4px)` | — | — | Modal backdrop |
| Nav | `#0D1B3E` solid | `rgba(201,168,76,0.25)` | — | Sticky nav |
| Dark card | `rgba(255,255,255,0.06)` | `rgba(201,168,76,0.2)` | — | Cards on Navy BG |

---

## 11. Iconography

- **Library:** Lucide Icons
- **Size:** 16px inline / 20px default / 24px prominent / 28–32px feature icons
- **Color:** `#C9A84C` gold for feature icons on Navy; `#0D1B3E` navy on white; inherits on body text
- **Stroke width:** 1.5px — refined, not chunky
- **Style:** Stroke only, never filled
- **Service icons:** Use Lucide for all service icons — Car, Tag, Percent, Shield, Umbrella, FileText

---

## 12. Tailwind CSS Variables Reference

```js
colors: {
  // Primary brand
  navy:    '#0D1B3E',   // Sovereign Navy — primary bg
  gold:    '#C9A84C',   // Prestige Gold — primary accent
  white:   '#FFFFFF',

  // Secondary
  sapphire:    '#1A2F5E',   // Navy gradient
  champagne:   '#F0D890',   // Light gold tint
  antique:     '#9E7B2A',   // Dark gold subheadings
  teal:        '#1A6B72',   // Emirate Teal — service badges
  sand:        '#E8E4DC',   // Desert Sand — card bg
  stone:       '#5A5A5A',   // Stone Grey — body text

  // Semantic
  available:   '#22C55E',
  reserved:    '#F59E0B',
  sold:        '#6B7280',
  error:       '#EF4444',
  info:        '#3B82F6',
  whatsapp:    '#25D366',
}
```

---

## 13. Page Inventory

| Page | Route | Hero BG | Content BG | Notes |
|---|---|---|---|---|
| Landing | `/` | Navy + photo | White / Navy alt | Dual CTA hero, full broker messaging |
| Buy a Car | `/buy` | Navy compact | White | Filter bar, listings grid |
| Sell Your Car | `/sell` | Navy | White | 3-step process, sell form |
| Finance | `/finance` | Navy | White | EMI calculator, partner logos |
| Inspection | `/inspect` | Navy (Teal accent) | White | Checklist, centre map, booking |
| Insurance | `/insurance` | Navy | White | Quote form, comparison results |
| Transfer | `/transfer` | Navy | White | Service tiles, pricing table |
| About | `/about` | Navy | White / Sand | Story, team, bridge model diagram |
| Contact | `/contact` | Navy compact | White | Split: WhatsApp left, partner form right |
| Login | `/login` | Navy | White card centered | Minimal, email + Google |
| Inventory | `/inventory` | Navy compact | White | Full listings, same as /buy |
| Privacy | `/privacy` | Navy compact | White | Standard legal |
| Terms | `/terms` | Navy compact | White | Standard legal |

**Summary:** Sovereign Navy for all hero/banner surfaces. White for all content. Desert Sand for alternating sections. No pure black anywhere.

---

## 14. Do's and Don'ts

### Do
- Use Sovereign Navy `#0D1B3E` for all dark surfaces — never pure black
- Use Prestige Gold `#C9A84C` only on CTAs, highlights, icons, borders — never overuse
- Use Montserrat ExtraBold for all H1 heroes, Montserrat Bold for H2/H3
- Use Inter for all body text, captions, labels
- Show the dual CTA ("I'm Buying" / "I'm Selling") on every hero section
- Include trust signals (deal counter, partner count) near every primary CTA
- Make WhatsApp a first-class CTA — especially on mobile
- Use Emirate Teal only for service badges and EV-related content
- Keep Gold opacity above 70% at all times

### Don't
- Don't use pure black `#000000` — Sovereign Navy is the dark surface
- Don't use Gold as a background for full sections — only for CTA buttons and accents
- Don't show only exotic/luxury cars — show full price range to counter showroom perception
- Don't use Bugatti-era language ("Driven By Legends", "Explore Collection") — this is a broker
- Don't use pill-shaped buttons — `8px` radius everywhere
- Don't use Big Shoulders Display, Raleway, or any font from the old system
- Don't use BRG (British Racing Green) anywhere — that was the old showroom system
- Don't use more than 2 primary colours per section
- Don't use red, green, or purple in any brand context
