# Wheels2Deals — Website Redesign Strategy
### Production-Level Design & Content Plan | v1.0 | May 2026
### For Client Review & Approval

---

> **Purpose of this document**
> This document defines the complete visual design system, landing page section-by-section plan, and full page inventory for the Wheels2Deals website redesign. It is written for client review before any design or development work begins. Every decision in this document is rooted in the official Brand Strategy & Identity Guidelines (April 2026).

---

## 01 | What We Are Correcting

The previous design used a Bugatti-inspired ultra-dark aesthetic (pure black, cinematic, exotic-only cars). While visually bold, it communicated the wrong business — it read as a **luxury supercar showroom**, not a **car broker platform**.

The client feedback confirmed this directly:
- "Website looks dull"
- "Not showing what we are doing in a 1st glance"
- "Overall website feel is not aligned with our services"
- "Giving a picture that we are a showroom selling high-end cars"

**The core identity shift:**
> W2D does not sell cars. W2D is the intelligent broker that connects buyers, sellers, dealers, and service partners across the entire UAE automotive market.

Every design decision in this document supports that identity.

---

## 02 | Design System

### 2.1 Colour Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary BG | Sovereign Navy | `#0D1B3E` | All hero sections, headers, dark surfaces |
| Primary Accent | Prestige Gold | `#C9A84C` | CTAs, highlights, icons, borders |
| Base | Pure White | `#FFFFFF` | Page backgrounds, breathing space |
| Gradient | Deep Sapphire | `#1A2F5E` | Navy gradient companion |
| Light Accent | Champagne Gold | `#F0D890` | Soft background tints |
| Dark Accent | Antique Gold | `#9E7B2A` | Subheadings, secondary highlights |
| Digital/EV | Emirate Teal | `#1A6B72` | EV, inspection, digital service badges |
| Card BG | Desert Sand | `#E8E4DC` | Card backgrounds, section dividers |
| Body Text | Stone Grey | `#5A5A5A` | Captions, meta text, secondary content |

**Critical Rules:**
- Never use pure black `#000000` — use Sovereign Navy instead
- Gold is an accent only — never use it as a full background
- Max 2 primary colours per section
- No red, green, or purple anywhere in the UI

**Section Colour Map:**
| Section Type | Background | Text | CTA |
|---|---|---|---|
| Hero / Banner | Sovereign Navy | White + Gold | Gold BG + Navy text |
| Cards | White or Desert Sand | Sovereign Navy | Gold accent |
| Service Badges | Emirate Teal | White | — |
| Captions / Meta | Desert Sand | Stone Grey | — |

---

### 2.2 Typography

| Style | Font | Weight | Size | Usage |
|---|---|---|---|---|
| H1 — Hero | Montserrat | ExtraBold (800) | 48–64px | Homepage hero, campaign headlines |
| H2 — Section | Montserrat | Bold (700) | 32–40px | Section titles |
| H3 — Card Title | Montserrat | Bold (700) | 18–24px | Card titles, partner names |
| Body Large | Inter | Medium (500) | 14–16px | Primary body, descriptions |
| Body Small | Inter | Regular (400) | 11–13px | Captions, secondary content |
| Label / Tag | Inter | Bold / ALL CAPS | 9–11px | Category badges, status labels |
| Tagline | Montserrat | ExtraBold | 13–15px tracked | "DRIVE SMART. DEAL BETTER." |

**Font Loading:** Google Fonts — `Montserrat` (700, 800) + `Inter` (400, 500, 700)

---

### 2.3 Spacing & Layout System

- **Base unit:** 8px
- **Section vertical padding:** 80px desktop / 48px mobile
- **Max content width:** 1280px centered
- **Grid:** 12-column CSS grid, 24px gutters
- **Border radius:** 4px (small), 8px (cards), 24px (pills/badges), full (avatar/icons)
- **Mobile breakpoint:** 768px — all sections reflow to single column

---

### 2.4 Component Library

#### Buttons
| Type | Style | Usage |
|---|---|---|
| Primary CTA | Gold BG `#C9A84C` + Navy text, 48px height, 24px padding | Main actions: "I'm Buying", "Get a Quote" |
| Secondary CTA | Navy BG + Gold border + White text | Supporting actions: "Learn More" |
| Ghost | Transparent + Gold border + Gold text | Tertiary or on dark BG |
| WhatsApp | Green `#25D366` + White text + icon | Mobile conversion actions |

#### Cards
| Type | Style | Usage |
|---|---|---|
| Service Card | White BG, Navy text, Gold top-border accent, subtle shadow | Service overview tiles |
| Car Card | Image top, Desert Sand BG, Navy title, Gold price, Teal badge | Listings, featured inventory |
| Partner Card | White BG, logo centered, Navy name, Stone Grey description | Dealer / service partners |
| Stat Card | Navy BG, Gold large number, White label | Trust counters, metrics |

#### Badges / Tags
- **Service type:** Teal BG + White text (e.g. "INSPECTION", "EV")
- **Car category:** Desert Sand BG + Stone Grey text (e.g. "Luxury SUV", "Sedan")
- **Status:** Champagne Gold BG + Antique Gold text (e.g. "AVAILABLE", "SOLD")

#### Navigation
- Sticky top nav, Navy BG with 90% opacity blur backdrop
- Logo left, Menu button right
- Mega menu: full-width dropdown, Navy BG, gold accents on hover
- Mobile: slide-in drawer, full-screen

---

### 2.5 Animation & Interaction Patterns

| Pattern | Implementation | Usage |
|---|---|---|
| Scroll reveal | IntersectionObserver, fade-up + opacity 0→1, 600ms ease-out | All sections on enter |
| Stagger reveal | Children stagger 80ms apart | Card grids, stat rows |
| CTA hover | Gold button: scale 1.03 + box-shadow pulse | All primary buttons |
| Card hover | translateY(-4px) + shadow deepen, 200ms | Service cards, car cards |
| Counter animation | CountUp.js, triggered on scroll into view | Deals closed, partners, listings |
| Nav scroll | Transparent → Navy (with backdrop blur) after 80px scroll | Top navigation |
| Image hover | scale 1.06 on parent hover, 400ms ease | Car images in cards |
| Section transitions | No abrupt color jumps — fade via gradient dividers | Section boundaries |

**What we are NOT doing:**
- No full-page GSAP color-shift transitions (too slow, confuses the broker message)
- No custom cursor effects (reduces accessibility)
- No autoplay video heroes (performance + mobile data concern)
- No parallax on mobile (performance)

---

## 03 | Landing Page — Section by Section

The landing page is the single most important page. It must answer three questions in under 5 seconds:
1. **What is W2D?** (Car broker — not a showroom)
2. **What can I do here?** (Buy, sell, get services)
3. **Why should I trust W2D?** (Vetted, fast, UAE-expert)

---

### Section 1 — Hero

**Purpose:** Instant brand identity + dual conversion entry point

**Layout:** Full viewport height (100svh). Navy background with a deep gradient. No video. Full-bleed photography of a Dubai skyline with a car — not a supercar closeup. Connotes UAE location and aspiration without screaming "showroom."

**Content:**
```
Eyebrow (Gold, ALL CAPS, tracked):  DRIVE SMART. DEAL BETTER.

H1 (White, Montserrat ExtraBold):   Your Car Deal,
                                     Expertly Brokered.

Body (White 70% opacity, Inter):    We connect UAE buyers and sellers to
                                     verified dealers and service partners.
                                     Free for you. Instant results.

CTAs (side by side):
  [  I'm Buying  ]  ← Gold BG, Navy text
  [  I'm Selling ]  ← Ghost, Gold border
```

**Trust micro-line below CTAs:**
`Trusted by 200+ UAE dealers · Free to use · Same-day connections`

**Bottom anchor:** Scroll indicator (animated chevron, White 50% opacity)

---

### Section 2 — How It Works (The Bridge Model)

**Purpose:** Immediately explain the W2D model in 3 steps. Most visitors won't know what a car broker is — show them.

**Layout:** White BG, centered, 3-column step cards with connecting arrows

**Content:**
```
Section Label (Teal, ALL CAPS):  HOW W2D WORKS

H2 (Navy):  One Platform. Every Car Deal.

Step 1 — CONNECT       Step 2 — MATCH         Step 3 — DEAL
Gold icon: person       Gold icon: bridge       Gold icon: handshake
"Tell us what           "We find the right      "Meet your match.
you need — buy,         verified dealer or      Close the deal.
sell, or service."      service partner."       Zero hassle."
```

**Bottom note (Stone Grey, small):**
`Partners pay W2D per qualified connection. You use W2D completely free.`

---

### Section 3 — Services Grid

**Purpose:** Show the full breadth of W2D — not just cars. This kills the "showroom" perception.

**Layout:** Navy BG, 3×2 grid of service cards (collapses to 2×3 on mobile, 1×6 on small mobile)

**Content:**

| Service | Icon | Tagline | Link |
|---|---|---|---|
| Buy a Car | Car icon | Find your perfect match, vetted by experts | `/buy` |
| Sell Your Car | Tag icon | Get the best price without the hassle | `/sell` |
| Finance & Loans | Percent icon | Drive now, structure the deal that works | `/finance` |
| RTA Inspection | Shield icon | Know exactly what you're buying | `/inspect` |
| Insurance | Umbrella icon | Full coverage, best UAE rates | `/insurance` |
| Transfer & Renewals | Document icon | Paperwork handled, same day | `/transfer` |

**Each card:** White BG, Gold top-border, Navy H3, Stone Grey body, Ghost CTA on hover

---

### Section 4 — Trust Signals Bar

**Purpose:** Build instant credibility with hard numbers. UAE buyers are data-driven.

**Layout:** Full-width Navy stripe, 4-column stat row with CountUp animation on scroll

**Content:**
```
[  500+  ]          [  200+  ]          [  10,000+  ]       [  4.9★  ]
Deals Closed        Dealer Partners      Cars Sold            Client Rating
This Year           UAE-Wide             Through W2D          on Google
```

**Sub-label (Champagne Gold, small):** `Updated monthly · Independently verified`

---

### Section 5 — Featured Listings

**Purpose:** Show real inventory — but position it as "matched for you", not "look at our showroom." Include diverse price points to counter the exotic-only perception.

**Layout:** White BG, horizontal scroll carousel (desktop: 3 visible, mobile: 1.2 visible with peek)

**Content Header:**
```
Section Label (Teal):  AVAILABLE NOW
H2 (Navy):             Cars Matched to UAE Buyers
Subtext (Stone Grey):  From sedans to SUVs — every car verified, every price transparent.
Link:                  View All Listings →
```

**Car Cards:** Image, Year + Make + Model (Navy H3), AED price (Gold), Teal badge for category, mileage + specs row, "Get Connected" CTA button

**Price range shown deliberately spans:** AED 45,000 (budget) to AED 500,000+ (premium) — not just AED 1M+ exotics

---

### Section 6 — Why W2D (Brand Pillars)

**Purpose:** Reinforce the 4 brand pillars with real supporting proof.

**Layout:** Desert Sand BG, 2×2 grid, icon + heading + 2 lines of copy

**Content:**
```
TRUST                        SPEED
Every partner is vetted.     Fast matches. Instant quotes.
Every deal tracked.          Same-day connections.
No hidden fees.              Time is money in UAE.

EXPERTISE                    PRESTIGE
Deep UAE market knowledge.   Premium experience.
RTA, insurance, finance —    Language that respects UAE's
all under one roof.          culture and buyers.
```

---

### Section 7 — Partner Ecosystem

**Purpose:** Show that W2D has real, established dealer and service partners. This is a key B2B trust signal.

**Layout:** White BG, logo marquee ticker (auto-scroll, pauses on hover), framed by intro copy

**Content:**
```
Section Label (Teal):  OUR PARTNERS
H2 (Navy):             Backed by UAE's Best
Body (Stone Grey):     We work exclusively with vetted dealers, RTA-approved
                       inspection centres, and leading insurance providers.

[  Logo  ] [  Logo  ] [  Logo  ] [  Logo  ] [  Logo  ]  →  continuous scroll

CTA:  Become a Partner →  (Ghost button, links to /contact with partner flag)
```

---

### Section 8 — WhatsApp CTA (Mobile Conversion)

**Purpose:** UAE's #1 conversion channel is WhatsApp. This section captures mobile users who don't want to fill a form.

**Layout:** Full-width Navy BG, split layout — left text, right phone mockup showing WhatsApp chat

**Content:**
```
H2 (White):   Talk to a Car Expert.
              Right Now. On WhatsApp.

Body (White 70%):  Tell us what you're looking for.
                   We'll reply in under 2 minutes.

CTA:  [  Chat on WhatsApp  ]  ← WhatsApp green button, prominent

Sub-note (Gold, small):  Available 9AM – 10PM · English & Arabic
```

---

### Section 9 — Testimonials

**Purpose:** Social proof from both buyers and sellers. Mix nationalities (expat + Emirati).

**Layout:** White BG, 3-column card row (mobile: scroll)

**Each card:**
- Gold `★★★★★` stars
- Quote in italic Inter
- Name (Navy), Role (Stone Grey e.g. "Car Buyer, Dubai")
- Verified badge (Teal, "Google Review")

---

### Section 10 — Footer

**Layout:** Navy BG, 4-column grid, Gold top-border divider line

**Column 1 — Brand:**
```
W2D Logo (Gold)
"DRIVE SMART. DEAL BETTER."
© 2026 Wheels2Deals.com
Dubai, UAE
```

**Column 2 — Services:**
Buy a Car · Sell Your Car · Finance · Inspection · Insurance · Transfer

**Column 3 — Company:**
About · Contact · Partner with Us · Careers

**Column 4 — Legal + Social:**
Privacy Policy · Terms of Use
Instagram · LinkedIn · TikTok · WhatsApp

**Bottom bar:**
`Arabic | English` toggle · `RTA Approved Partner` badge

---

## 04 | All Pages — Complete Inventory

### 4.1 `/` — Home (Landing)
Covered in full above. The primary conversion page.

---

### 4.2 `/buy` — Buy a Car

**Purpose:** Help buyers browse verified inventory with filter/search. Position as "matched by experts" not a classifieds dump.

**Sections:**
1. **Page Hero** (Navy, compact 40vh) — "Find Your Next Car" + search bar (Make / Model / Budget / Type)
2. **Filter Bar** — Type (All / Sedan / SUV / Electric / Luxury), Budget slider, Year range, Brand
3. **Listings Grid** — 3-col grid of Car Cards, lazy-loaded. Sort by: Newest / Price Low-High / High-Low
4. **Car Card** — Image, badge (VERIFIED / EV / NEW ARRIVAL), Year + Make + Model, AED price, mileage, "Get Connected" CTA
5. **Empty State** — "No matches yet — tell us what you need" → WhatsApp CTA
6. **Sticky Bottom Bar (Mobile)** — "Talk to an Expert" WhatsApp button always visible

---

### 4.3 `/sell` — Sell Your Car

**Purpose:** Capture sellers. Reassure them W2D gets them the best price without hassle.

**Sections:**
1. **Page Hero** (Navy) — "Get the Best Price for Your Car" + "Sell With Confidence"
2. **3-Step Sell Process** — Submit details → W2D matches buyer/dealer → Deal closed, you get paid
3. **Sell Form** — Make, Model, Year, Mileage, Condition, Contact (WhatsApp preferred), Photos upload
4. **Why Sell With W2D** — No listing fees, vetted buyers only, RTA paperwork handled, same-week deal
5. **Recent Sell Success Stories** — "2023 Toyota Land Cruiser · Sold in 3 days · AED 245,000"

---

### 4.4 `/finance` — Finance & Loans

**Purpose:** Connect buyers to UAE bank/finance partners. Show affordability options.

**Sections:**
1. **Page Hero** (Navy) — "Drive Now. Pay Smart." + "Calculate Your Monthly Payment"
2. **EMI Calculator** — Car price input, down payment %, loan term (12/24/36/48/60 months) → Live monthly estimate
3. **Finance Partners Grid** — Logos of partner banks/finance houses
4. **How Finance Works** — 4-step: Pre-approval → Car selection → Documentation → Drive away
5. **FAQ** — UAE residents vs. expats, required documents, typical rates
6. **CTA** — "Get Pre-Approved Today" → WhatsApp or form

---

### 4.5 `/inspect` — RTA Inspection

**Purpose:** Build trust with buyers. Show W2D connects them to certified inspection centres.

**Sections:**
1. **Page Hero** (Teal accent) — "Know Exactly What You're Buying" + RTA approved badge
2. **What's Included** — 150-point checklist visual: Engine, Bodywork, Electrics, Interior, Safety, Tyres
3. **Partner Inspection Centres** — Map or grid of UAE inspection locations (Dubai, Abu Dhabi, Sharjah)
4. **Inspection Report Sample** — PDF thumbnail showing what the report looks like
5. **Booking CTA** — "Book an Inspection" → Form with Car details + preferred date + location

---

### 4.6 `/insurance` — Car Insurance

**Purpose:** White-label insurance comparison. W2D earns commission, user gets best rate.

**Sections:**
1. **Page Hero** (Navy) — "Best Car Insurance. UAE's Top Providers." + "Compare in 2 Minutes"
2. **Insurance Form** — Car details (year/make/model), driver age, Emirates, current insurer
3. **Comparison Results UI** — Side-by-side 3 quotes (Partner logo, AED/year, key features, "Select" CTA)
4. **Coverage Types Explained** — Third Party vs. Comprehensive vs. Agency Repair — clear comparison table
5. **Insurance Partners** — Partner logos row
6. **FAQ** — New car vs. used, expat vs. citizen, claims process

---

### 4.7 `/transfer` — Transfer & Renewals

**Purpose:** Handle UAE RTA paperwork — ownership transfer, Mulkiya renewal, export plates. UAE-specific.

**Sections:**
1. **Page Hero** (Navy) — "Paperwork Handled. Same Day." 
2. **Service Tiles** — Ownership Transfer / Mulkiya Renewal / Export Certificate / NOC Services / Number Plate
3. **Required Documents Checklist** — Per service, clear visual list (Emirates ID, current Mulkiya, etc.)
4. **Pricing Table** — Transparent fee breakdown per service type
5. **Book Service CTA** — Select service → WhatsApp or form with date picker

---

### 4.8 `/about` — About W2D

**Purpose:** Tell the brand story. Build trust with buyers AND potential partners.

**Sections:**
1. **Hero** (Navy, full-width) — Brand essence quote: *"The Smartest Bridge Between Every Car Deal in the UAE"*
2. **Our Story** — Origin, mission, why the UAE market needed W2D
3. **The Bridge Model Explained** — Visual diagram: Buyers/Sellers → W2D → Dealers/Services
4. **Team Section** — Founder + key team, headshots with Navy card treatment
5. **By the Numbers** — Stat bar (same as homepage trust section)
6. **Our Partners** — Partner logos grid
7. **Brand Values** — 4 pillars: Trust, Speed, Expertise, Prestige (expanded copy vs. homepage)
8. **Join Us CTA** — "Partner with W2D" + "Work at W2D"

---

### 4.9 `/contact` — Contact

**Purpose:** Primary enquiry capture for both consumers and B2B partners.

**Sections:**
1. **Page Hero** (Navy, compact) — "Let's Talk Cars"
2. **Contact Split Layout:**
   - **Left — Consumer:** WhatsApp number (large, prominent), working hours, map embed (Dubai HQ)
   - **Right — Partner Enquiry Form:** Company name, type (Dealer / Insurance / Inspection / Other), email, message, "Submit"
3. **Office Details** — Address, phone, email
4. **Social Links** — Instagram, LinkedIn, TikTok

---

### 4.10 `/login` — Authentication

**Purpose:** Minimal, clean login. For both consumers (saved searches, enquiry history) and partner dashboard access.

**Design:** Centered card on Navy BG. W2D logo top. Email + Password. "Continue with Google." Forgot password. Partners use same entry → redirected to dashboard post-login.

---

### 4.11 `/inventory` — Full Inventory

**Purpose:** Complete car listings — same as `/buy` but without the buyer-focused hero. SEO-friendly URL for car listings.

Identical to `/buy` page, URL alias or redirect. Decision TBD based on SEO strategy.

---

### 4.12 `/privacy` — Privacy Policy

Standard legal page. Navy top bar with W2D logo, white content area, Stone Grey body text, Inter font. Covers UAE data law compliance (Federal Law No. 45 of 2021).

---

### 4.13 `/terms` — Terms of Use

Same treatment as `/privacy`. Covers broker model disclaimer, partner revenue disclosure, user responsibilities.

---

## 05 | Navigation Structure

### Desktop Mega Menu (Already in Code)
```
MENU
├── Buy & Sell
│   ├── Buy a Car          /buy
│   ├── Sell Your Car      /sell
│   └── Finance & Loans    /finance
├── Vehicle Services
│   ├── Inspection         /inspect
│   ├── Insurance          /insurance
│   └── Transfer & Renewals /transfer
└── Company
    ├── About              /about
    └── Contact            /contact
```

### Mobile Drawer (Already in Code)
Same links, linear list, "Sign In" at bottom.

### Footer Navigation
Same links + Privacy + Terms

---

## 06 | Mobile-First Priorities

UAE has 96%+ smartphone penetration. Every section is designed mobile-first:

- Hero: Single-column, CTAs stacked vertically
- Services Grid: 2-column on mobile, 1-column on small screens
- Car Cards: Full-width, horizontal image with content below
- Finance Calculator: Full-width inputs, result prominently displayed
- WhatsApp CTA: Sticky bottom bar on ALL pages below mobile breakpoint
- Arabic support: Right-to-left layout toggle, Dubai Font for Arabic text

---

## 07 | What Is NOT in Scope (This Phase)

The following are noted for Phase 2 / future consideration:
- Partner dashboard / B2B portal (live leads, analytics)
- WhatsApp Business API automation
- Arabic full translation (content to be supplied by client)
- EV specialist channel (Teal sub-brand)
- Fleet / Corporate services page
- Blog / SEO content hub

---

## 08 | Design Reference Inspiration

The following sites were provided by the client as reference points:
- **carswitch.com/uae** — Functional broker UX, clear buyer/seller split, trust signals
- **automall.ae** — UAE-native, practical, full-service navigation
- **carbuyingpeople.com** — Concierge broker positioning, clear "how it works"

W2D sits **above** these three in brand prestige (Navy + Gold, Montserrat, premium spacing) while matching their **clarity of purpose** (instantly obvious what you can do).

---

## 09 | Next Steps After Client Approval

1. ✅ Client reviews and approves this document (with any change requests)
2. Design mockups created in **Google Stitch** using this strategy as the brief
3. Client reviews Stitch designs — one round of revisions
4. Development begins (Next.js, Tailwind, brand tokens applied globally)
5. Content population — car listings, partner logos, team photos
6. QA → UAT → Launch

---

*Document prepared by Wheels2Deals development team · May 2026*
*All design decisions align with the official Brand Strategy & Identity Guidelines (April 2026)*
*Version 1.0 — Awaiting client sign-off*
