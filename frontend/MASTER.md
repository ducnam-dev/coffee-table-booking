# PAM COFFEE & TEA — DESIGN SYSTEM SPECIFICATION (MASTER.MD)
*Adhering to ui-ux-pro-max-skill, taste-skill (Anti-AI-Slop), & pbakaus/impeccable standards*

## 1. Brand Identity & Art Direction
- **Identity**: Traditional Vietnamese Specialty Coffee & Modern Artisanal Teahouse.
- **Mood**: Warm, artisanal, tactile, editorial, refined luxury without sterile minimalism.
- **No AI Slop Policy**:
  - ❌ No generic blue/purple neon glow gradients.
  - ❌ No identical 3-column cookie-cutter cards.
  - ❌ No ungrounded pill buttons scattered without hierarchy.
  - ❌ No low-contrast gray text on dark gray surfaces.

## 2. Color Palette (Heritage Roast & Cream)
- **Primary / Brand**:
  - `primary.main`: `#D97706` (Warm Roasted Amber)
  - `primary.dark`: `#B45309` (Dark Caramel)
  - `primary.light`: `#FDE68A` (Golden Crema)
- **Espresso Dark Tones**:
  - `espresso.deep`: `#1C130E` (Ultra Dark Roast)
  - `espresso.rich`: `#2C1810` (Signature Espresso)
  - `espresso.medium`: `#452618` (Mocha)
- **Cream & Surface**:
  - `cream.bg`: `#FDFBF7` (Alabaster Warm Cream)
  - `cream.surface`: `#FFFFFF` (Pure Card Surface)
  - `cream.subtle`: `#F5EDE2` (Latte Foam Tint)
- **Typography Contrasts (WCAG AA compliant ≥ 4.5:1)**:
  - `text.primary`: `#1C1917` (Deep Obsidian Bean - Contrast ratio 13.8:1 on cream)
  - `text.secondary`: `#574B45` (Warm Mocha Brown - Contrast ratio 6.2:1 on cream)
  - `text.tertiary`: `#8C7E76` (Muted Sand Taupe - Caption only)
  - `text.inverse`: `#FFFFFF`
- **Borders & Elevation**:
  - `border.subtle`: `rgba(44, 24, 16, 0.08)` (Hairline organic border)
  - `border.strong`: `rgba(44, 24, 16, 0.16)`
  - `border.focus`: `#D97706`

## 3. Spatial System (8pt Grid)
- `spacing.xxs`: 2px
- `spacing.xs`: 4px
- `spacing.sm`: 8px
- `spacing.md`: 12px
- `spacing.lg`: 16px
- `spacing.xl`: 20px
- `spacing.xxl`: 24px
- `spacing.xxxl`: 32px
- `spacing.huge`: 48px

## 4. Typography Hierarchy
- `display`: font size 30, line height 38, font weight 800, letter spacing -0.5px
- `title1`: font size 24, line height 30, font weight 700, letter spacing -0.3px
- `title2`: font size 20, line height 26, font weight 700
- `title3`: font size 17, line height 22, font weight 600
- `bodyLarge`: font size 15, line height 22, font weight 500
- `body`: font size 14, line height 20, font weight 400
- `caption`: font size 12, line height 16, font weight 500
- `overline`: font size 11, line height 14, font weight 700, letter spacing 0.8px, uppercase

## 5. Touch Targets & Accessibility (Impeccable Audit)
- All interactive buttons & touchables must have `minHeight: 44px` and `minWidth: 44px`.
- Every text node handling dynamic strings uses `numberOfLines` and `ellipsizeMode="tail"`.
- Responsive layout handles Orientation change smoothly via `useResponsive()`.

