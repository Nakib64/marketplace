---
name: Decentralized Talent Network
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#62dcad'
  on-secondary: '#003827'
  secondary-container: '#18a479'
  on-secondary-container: '#003121'
  tertiary: '#31e193'
  on-tertiary: '#003920'
  tertiary-container: '#00ba75'
  on-tertiary-container: '#004227'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#80f9c8'
  secondary-fixed-dim: '#62dcad'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#59fead'
  tertiary-fixed-dim: '#31e193'
  on-tertiary-fixed: '#002111'
  on-tertiary-fixed-variant: '#005231'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system defines a decentralized talent acquisition and freelancing ecosystem that merges institutional-grade escrow protocols with modern, frictionless recruitment. The aesthetic blends high-precision technical fintech with human-centric collaborative workspaces. It projects absolute financial security, cryptographic transparency, and progressive innovation without the visual noise often associated with Web3.

The visual direction uses an evolved **Dark Modern / High-Precision Technical** aesthetic. Key attributes include:
- **Matte Foundations**: Rejection of high-gloss skeumorphism in favor of deep, absorptive charcoal substrates that reduce eye strain during prolonged portfolio reviews and code audits.
- **Architectural Clarity**: Micro-radii hierarchy, low-luminance border definition, and precise data density.
- **Cryptographic Trust Cues**: Strategic employment of laser-focused vibrant emerald and mint elements reserved strictly for system feedback, wallet operations, escrow settlement states, and verified talent credentials.

## Colors

The palette is engineered around dark value tiers to establish spatial hierarchy while sustaining contrast for complex marketplace data tables, smart contract states, and talent metrics.

### Primary Color
`#10b981` (Vibrant Emerald) functions as the core transactional engine. Used for primary actionable elements, cryptographic verification badges, positive yield/payout values, and affirmative interactive components. An energized variant, `#00d084`, is reserved for critical active states, focused nodes, and smart contract execution highlights.

### Secondary Color
`#6ee7b7` (Mint Green) operates as an illumination layer for badges, soft badge backgrounds (at 10%–15% opacity), secondary chart vectors, and muted metadata indicators that must remain distinct from primary actions.

### Canvas & Surface Architecture
- **Canvas / Root Background**: `#111317` (Deep Matte Charcoal)
- **Container / Card Level 1**: `#1d2026` (Neutral Dark Slate)
- **Elevated Interactive Surface / Level 2**: `#262a32` (Elevated Slate)
- **Subtle Structural Borders**: `#2d323b` (Subtle Slate Border)

### Typography & Neutrals
- **High-Emphasis Text / Headings**: `#f8fafc` (Crisp White Slate)
- **Muted Body / Metadata**: `#94a3b8` (Muted Slate Body)
- **Subtle / Disabled / Captions**: `#64748b` (Deep Slate)
- **Critical Alert / Escrow Dispute**: `#ef4444` (Vibrant Crimson)

## Typography

Typography prioritizes ultra-high legibility across structural data sets, bid tables, smart contract parameters, and editorial portfolio displays.

- **Primary UI & Editorial**: `Inter` is implemented for all displays, headlines, body contexts, and interactive labels. Variable optical tracking tightens headline styles (`-0.02em` tracking for headings above 24px) to retain punchiness, while body copy remains at natural tracking (`0em`) for extended scanning.
- **Web3 & Cryptographic Metadata**: `JetBrains Mono` handles wallet addresses, transaction hashes, crypto denominations (e.g., `USDC`, `ETH`), block heights, and micro-metric chips. This split establishes an instant cognitive distinction between narrative text and immutable ledger data.

## Layout & Spacing

The layout is built on a 12-column fluid grid system on desktop that transitions to an 8-column layout on tablet, and a 4-column stack on mobile devices.

- **Grid Geometry**: Desktop max container width is set to `1280px` centered, utilizing `1.5rem` (`24px`) gutters and `2rem` (`32px`) baseline outer screen padding.
- **Rhythm Principle**: Internal spatial distribution follows an absolute 8pt base grid with a 4pt micro-subdivision (`0.25rem`). Padding across interactive containers enforces modular ratios (e.g., standard cards utilize `1.5rem` internal padding, while dense data nodes utilize `1rem`).
- **Breakpoints**:
  - `Desktop`: ≥ 1200px (12 columns)
  - `Tablet`: 768px – 1199px (8 columns)
  - `Mobile`: < 768px (4 columns, outer margin collapsing to `1rem`)

## Elevation & Depth

Visual hierarchy is communicated through pure tonal separation paired with hair-thin slate boundaries, entirely avoiding aggressive drop shadows in favor of a clean, technical interface.

- **Level 0 (Canvas Base)**: `#111317` — Absorbs peripheral light; foundation for root workspace viewports.
- **Level 1 (Standard Card / Panel)**: `#1d2026` — Outlined with a continuous `1px` border using `#2d323b`. Depth is completely non-shadowed, relying purely on the 12-step surface luminance shift.
- **Level 2 (Active / Hover / Nested Modals)**: `#262a32` — Used for active cards, flyouts, and dropdowns. Receives a faint ambient shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.45)`.
- **Level 3 (Focused / Transaction / Escrow Lockout)**: `#262a32` highlighted with a directional `1px` inner glow or border tinted in `#10b981` at 30% alpha, combined with an ambient bloom of `0 12px 32px -8px rgba(16, 185, 129, 0.12)`.

## Shapes

The design system incorporates geometric curves designed to soften the heavy technical nature of smart contracts while preserving structural authority:

- **Standard Base Radii (`rounded-xl` / 1rem)**: Applied to medium cards, workspace panels, smart-contract summary drawers, and large data visualizations.
- **Container Radii (`rounded-2xl` / 1.5rem)**: Applied to top-level feature cards, marketplace profile hero containers, and global modals.
- **Component Radii (`rounded-lg` / 0.5rem)**: Applied to text input fields, drop-down menus, and micro-tables.
- **Full Pill (`rounded-full` / 9999px)**: Strictly reserved for status chips, KYC verification marks, tabbed switchers, and standalone action buttons.

## Components

### Buttons
- **Primary Action**: Background `#10b981`, text `#111317` (bold weight for contrast), borderless. Hover shifts background to `#00d084` with subtle transformation. Active state scales to `0.98`.
- **Secondary Action**: Background `#262a32`, text `#f8fafc`, `1px` border in `#2d323b`. Hover transitions border to `#94a3b8` and background to `#1d2026`.
- **Destructive/Dispute Action**: Deep crimson slate background (`rgba(239, 68, 68, 0.1)`), border in `rgba(239, 68, 68, 0.3)`, text `#ef4444`.

### Verification Badges & Web3 Tags
- **KYC Verified Tag**: Fully rounded pill badge (`rounded-full`). Background is `rgba(16, 185, 129, 0.12)`, text `#6ee7b7`, border `1px solid rgba(16, 185, 129, 0.25)`. Features a leading emerald shield/check icon.
- **Web3 Wallet Indicator**: Fully rounded pill badge (`rounded-full`). Surface `#1d2026`, border `#2d323b`, text formatted in `JetBrains Mono` (`label-md`). Displays network status via a persistent `6px` circular pulse indicator (`#10b981` for connected, `#ef4444` for unconfirmed).

### Escrow Safety Guarantees
- Specialized callout container using `#1d2026` surface with an accent border: `1px solid rgba(16, 185, 129, 0.4)`. Contains a prominent lock/shield symbol, displaying smart contract safety metadata, multi-signature release triggers, and programmatic payment milestones in `JetBrains Mono`.

### Tabbed Pills
- Segmented control wrappers sit on a `#111317` background with `0.25rem` inner padding and `rounded-full` contour.
- Inactive tabs display text in `#94a3b8` with transparent backgrounds.
- Active tabs transition smoothly to `#262a32` background with `#f8fafc` text, bounded by a fine `1px solid #2d323b` ring.

### Input Fields
- Flat background in `#1d2026` with border `1px solid #2d323b` and `rounded-lg` radius. Text color is `#f8fafc` with placeholder at `#64748b`.
- On focus: shifts border color to `#10b981` with an outer ring of `0 0 0 1px #10b981`.

### Cards
- **Talent & Job Cards**: Base `#1d2026`, border `1px solid #2d323b`, radius `rounded-xl`, padding `1.5rem`. Smooth transition on hover to `#262a32` with border shifting to `rgba(110, 231, 183, 0.2)`. Headings strictly use `#f8fafc`, metadata displays in `#94a3b8`.