---
name: Obsidian Emerald Web3 Workspace
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#68dba9'
  on-secondary: '#003825'
  secondary-container: '#25a475'
  on-secondary-container: '#00311f'
  tertiary: '#c4c6d1'
  on-tertiary: '#2d3038'
  tertiary-container: '#a0a2ac'
  on-tertiary-container: '#363941'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#e0e2ed'
  tertiary-fixed-dim: '#c4c6d1'
  on-tertiary-fixed: '#181b23'
  on-tertiary-fixed-variant: '#44474f'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-performance, dark-matte workspace built for modern decentralized commerce, freelancing, and creative tech workflows. The emotional tone is precise, focused, and distinctly executive—stripping away distracting decorative neon glows in favor of deep, warm-neutral charcoal surfaces contrasted against high-clarity emerald green interactive cues.

### Visual Aesthetic & Style
- **Dark Neutral Matte Minimal:** The interface prioritizes deep charcoal tones (`#111317` base, `#1d2026` card layers) over cold corporate blues or harsh pitch-black OLED surfaces. Surfaces feel tactile and engineered.
- **Controlled High-Signal Accents:** Emerald green (`#10b981`) serves strictly as an intentional focal point—identifying active states, primary actions, positive verification, and progress markers without visual clutter.
- **Structured Precision:** Crisp, subtle structural framing via low-contrast hairline borders (`#2d323b`) provides spatial separation without relying on heavy dropshadows.

## Colors

The color palette is strictly balanced to eliminate cyan and navy undertones, maintaining a true neutral slate-charcoal foundation with pure emerald accents.

### Palette Architecture
- **Base Background (`#111317`):** Deep, ultra-matte neutral charcoal for canvas and foundational backgrounds.
- **Card & Surface Container (`#1d2026`):** Primary structural surface for dashboard cards, banners, lists, and modular panels.
- **Elevated & Interactive Surfaces (`#252830`):** Secondary interactive tier applied to inputs, inactive chip tags, modal backgrounds, and hover fills.
- **Hairline Border (`#2d323b`):** Deliberate, crisp separation border applied across container outlines, dividers, and card boundaries.
- **Primary Emerald Accent (`#10b981`):** High-energy functional green for primary CTAs, active toggles, badge confirmations, and progress fills.
- **Primary Hover/Active Accent (`#059669`):** Grounded emerald shade for interactive press states and focused outlines.
- **Text Primary (`#ffffff`):** Pure white typography for headlines, critical data figures, and active button text.
- **Text Secondary / Muted Slate (`#94a3b8`):** Balanced neutral slate for descriptions, metadata, input placeholders, and inactive icons.

## Typography

The typography utilizes **Plus Jakarta Sans** across all primary headline, body, and label roles. Its geometric construction, crisp letterforms, and generous x-height maintain high legibility against dark slate surfaces.

For Web3 wallet hashes, hex IDs, and numeric code sequences, a dedicated monospace font (`JetBrains Mono`) is incorporated at the token level to provide alignment and precision.

### Typographic Hierarchy Rules
- **Display & Headings:** Set in 600 or 700 weight with tight tracking (`-0.01em` to `-0.02em`) to produce confident, editorial titles.
- **Body & Data:** Set in regular (400) weight with relaxed line-height to guarantee high scan efficiency against dark backgrounds.
- **Labels & Microcopy:** Rendered with medium (500) or semi-bold (600) weights, keeping metadata and status markers visually distinct without increasing font size.

## Layout & Spacing

The layout model is structured on an 8pt spatial grid, relying on a 12-column responsive fluid grid inside a 1440px desktop container.

### Breakpoints & Adaptive Layout
- **Desktop (1024px+):** 12 columns, `1.5rem` (24px) gutters, and `2rem` (32px) exterior margins. Dashboards employ asymmetrical multi-column layouts (e.g., 4-column profile/wallet sidebars alongside 8-column main content feeds).
- **Tablet (768px – 1023px):** 8 columns, `1rem` (16px) gutters, `1.5rem` (24px) margins. Sidebars collapse above or below the primary job and project feeds.
- **Mobile (<768px):** 4 columns, `0.75rem` (12px) gutters, `1rem` (16px) outer margins. Horizontal chip bars become horizontally scrollable Carousels; cards collapse into single-column vertical stacks.

## Elevation & Depth

This design system avoids exaggerated, glossy blur layers and colored glow artifacts. Depth is achieved via disciplined tonal layering, boundary strokes, and restrained ambient shadows.

### Tonal Tiers
1. **Tier 0 (Base Canvas):** `#111317` creates the recessed, non-interactive environment floor.
2. **Tier 1 (Surface Containers):** `#1d2026` bordered with a 1px solid `#2d323b` outline. Applied to cards, table bodies, and persistent navigation bars.
3. **Tier 2 (Elevated Controls & Floating Layers):** `#252830` bordered with `#2d323b`. Used for input boxes, nested status capsules, dropdown popovers, and dialogs.
4. **Tier 3 (Overlay & Tooltips):** `#2d323b` with a soft ambient shadow (`0 8px 24px -4px rgba(0, 0, 0, 0.45)`).

## Shapes

The interface balances sharp, technical precision with friendly modern curves. 

### Corner Radius Mapping
- **Cards & Primary Modules:** Use `rounded-xl` (1.5rem / 24px) to define structural content blocks and highlight card frames.
- **Buttons & Search Bars:** Use `rounded-lg` (1rem / 16px) or `rounded-md` (0.5rem / 8px) depending on density. Search inputs pair directly with integrated action buttons sharing complementary interior radii.
- **Pills & Status Chips:** Use full pill rounding (`9999px`) for verification badges, skill tags, and categorical filters.

## Components

### Buttons
- **Primary CTA:** Background `#10b981`, text `#ffffff`, font weight 600. On hover, background shifts to `#059669`. On focus/press, an active ring of `2px solid rgba(16, 185, 129, 0.4)` appears.
- **Secondary / Outline:** Background transparent, border `1px solid #2d323b`, text `#ffffff`. On hover, background shifts to `#252830` with border `#10b981`.
- **Icon / Ghost:** Background transparent, text `#94a3b8`. On hover, background `#252830`, text `#ffffff`.

### Inputs & Search Bars
- **Search Composite:** Background `#181b20`, border `1px solid #2d323b`, border radius `1rem` (16px). Left-aligned search icon tinted `#94a3b8`, placeholder in `#94a3b8`. Attached or embedded action buttons sit flush within the right padding boundary.
- **Active Focus:** Border transitions smoothly to `#10b981` with zero fuzzy drop shadow.

### Cards & Container Panels
- Base card background `#1d2026` with a uniform `1px solid #2d323b` border and `1.5rem` (`rounded-xl`) corner radius. Internal padding adheres to `1.5rem` (`space-lg`) on desktop and `1rem` (`space-md`) on mobile.

### Chips & Filter Pills
- **Skill / Metadata Chips:** Background `#252830`, border `1px solid transparent`, text `#94a3b8`, radius `9999px`, font size `12px`.
- **Active Filter Chips:** Background `rgba(16, 185, 129, 0.12)`, border `1px solid #10b981`, text `#10b981`.

### Status Indicators & Badges
- **Verified Badges:** `#10b981` icon paired with `#94a3b8` or `#ffffff` typography.
- **Wallet & Monospace Fields:** Embedded `#181b20` inner tray with a copy-to-clipboard trigger button and truncated hex typography.