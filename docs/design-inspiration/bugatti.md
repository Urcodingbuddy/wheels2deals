# Bugatti Design Inspiration

## Context for Claude (read this first)

This file is a design reference for the **wheels2deals** project — a luxury car marketplace built with Next.js 16, React 19, Tailwind CSS v4, and Supabase.

When the user says "use the Bugatti file" or "refer to Bugatti design", they mean: apply the visual language, typography choices, layout patterns, spacing, color philosophy, and interaction cues documented below to whatever UI/design task they're working on.

The goal is not to copy Bugatti's site, but to extract the *feeling* — ultra-premium, minimal, dramatic, performance-oriented — and translate it into wheels2deals components and pages.

Key things to extract from the pasted content below:
- Color palette (backgrounds, text, accent colors)
- Typography scale and font choices
- Layout density and whitespace usage
- Hero/banner patterns
- Navigation style
- Card and listing patterns (if any)
- Micro-interactions or animation cues described

---

## Bugatti Website — Scrolled Content

Here's a complete breakdown of everything I captured from the Bugatti website — the GIF has been downloaded as **bugatti-scroll-animation.gif** so you can visually review the scroll journey.

---

## 🎬 Animation Style & Design Pattern Breakdown

### 1. Scroll-Triggered Fade-In + Blur (Primary Entrance Animation)

**The most dominant pattern on the entire site.** Every page section fades and unblurs as it enters the viewport.

```css
/* Hidden state (before entering viewport) */
.section-wrapper {
  opacity: 0;
  filter: blur(8px);
  transition: all 700ms ease-out;
}

/* Revealed state (when IntersectionObserver fires) */
.section-wrapper.in-view {
  opacity: 1;
  filter: blur(0px);
}
```

**Tailwind classes used:**
```html
<div class="transition-all duration-700 ease-out opacity-0 blur-sm">
  <!-- becomes -->
<div class="transition-all duration-700 ease-out opacity-100 blur-0">
```

The site uses the **IntersectionObserver API** (confirmed in code) to toggle these classes when sections scroll into view.

---

### 2. Auto-playing Looping Hero Videos (No Animation — Just Video)

```html
<video autoplay muted loop playsinline
  class="pointer-events-none h-full w-full object-cover">
  <source src="hero.mp4">
</video>
```

The "animation" feel on the hero is entirely from **cinematic video backgrounds**, not CSS animations. This creates instant luxury impact at zero performance cost.

---

### 3. Full-Screen Section Stacking (Scroll Snap / Section Takeover)

Each major content block fills the full viewport height with a fixed-image or video background. The visual effect is that each section "replaces" the previous one as you scroll — a **full-page scrolljacking aesthetic** without actually hijacking scroll.

```css
.hero-section {
  height: 100vh; /* or min-h-screen */
  position: relative;
  overflow: hidden;
}
```

---

### 4. Horizontal Marquee (Continuous Scroll Ticker)

A CSS-only infinite horizontal scrolling ticker for brand names or highlights:

```css
@keyframes marquee-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(calc(-100% - var(--gap))); }
}

.animate-marquee-left {
  animation: marquee-left [duration] linear infinite;
  --gap: 1rem;
}
```

```html
<div class="flex overflow-hidden">
  <div class="flex shrink-0 animate-marquee-left gap-[1rem]">
    <!-- content duplicated twice for seamless loop -->
  </div>
  <div class="flex shrink-0 animate-marquee-left gap-[1rem]" aria-hidden="true">
    <!-- duplicate -->
  </div>
</div>
```

---

### 5. Card Image Zoom on Hover (Scale Transform)

The car product cards use a group-hover scale effect on the inner image:

```css
/* Tailwind equivalent */
.card-image {
  transition: transform 300ms;
}
.card:hover .card-image {
  transform: scale(1.05);
}
```

```html
<div class="group overflow-hidden rounded">
  <img class="absolute inset-0 h-full w-full 
              transition-transform duration-300 
              group-hover:scale-105" />
</div>
```

---

### 6. Crossfade Image Reveal on Hover (Opacity Swap)

Some cards have TWO overlaid images — one fades out, another fades in on hover (dark/light treatment of the same car):

```html
<div class="group relative overflow-hidden">
  <!-- Default image -->
  <img class="absolute inset-0 h-full w-full 
              transition duration-300 
              group-hover:opacity-0" />
  <!-- Hover image -->
  <img class="absolute inset-0 opacity-0 
              transition duration-300 
              group-hover:opacity-100" />
</div>
```

---

### 7. Handwriting Script Text (Static SVG/Image, Not Animated)

The cursive car name logos (Solitaire, Tourbillon, Chiron etc.) are **pre-rendered SVG or PNG images**, not animated SVG path-drawing. They are centered over the hero image and fade in with the section. If you want the handwriting draw-on effect you'd use:

```css
/* SVG path animation for handwriting effect */
path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

---

### 8. Typography & Font System

Four custom Bugatti fonts are loaded:
- `Bugatti Display` — the script/serif logo font
- `Bugatti Text Bold` / `Bugatti Text Regular` — body/UI text
- `Bugatti Monospace` — used for all caps labels, prices, small text

Text styling is **ALL CAPS**, widely tracked (`letter-spacing: 0.1em+`), and always white on dark backgrounds.

---

### 9. Navigation Behavior

The nav starts **transparent with a gradient fade** from black at top and becomes sticky/visible on scroll:

```css
nav {
  position: absolute; /* then becomes fixed */
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  transition: all 300ms;
}
```

---

### 10. Button Style

Pill/rounded ghost buttons with border, all caps monospace text:

```css
.btn {
  border: 1px solid white;
  border-radius: 9999px;
  padding: 12px 24px;
  color: white;
  font-family: 'Bugatti Monospace';
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.75rem;
  transition: background 300ms;
}
.btn:hover {
  background: rgba(255,255,255,0.15);
}
```

---

### 11. Overall Design Pattern: **Dark Luxury Editorial**

| Property | Value |
|---|---|
| **Background** | Pure black (`#000`) throughout |
| **Text** | White only |
| **Accent** | None — restrained, no color accents |
| **Grid** | 2-column equal cards, full-width hero |
| **Spacing** | Generous vertical padding (100px+ between sections) |
| **Images** | Full-bleed, cinematic, motion-blur photography |
| **Framework** | Tailwind CSS + React/custom bundler (no Next.js) |

---

### Implementation Quickstart (Tailwind + JS)

```js
// IntersectionObserver for scroll-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('opacity-0', 'blur-sm');
      entry.target.classList.add('opacity-100', 'blur-0');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

```html
<!-- Wrap each section -->
<div class="animate-on-scroll transition-all duration-700 ease-out opacity-0 blur-sm">
  <!-- section content -->
</div>
```

This gives you the exact same "sections materialize from a blurry void" effect Bugatti uses throughout their site. Combine it with full-height video heroes and 2-column image cards with `group-hover:scale-105`, and you'll have the same design language.
