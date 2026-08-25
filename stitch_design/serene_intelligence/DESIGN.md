---
name: Serene Intelligence
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#40484b'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#70787b'
  outline-variant: '#c0c8cb'
  surface-tint: '#2d6674'
  primary: '#003641'
  on-primary: '#ffffff'
  primary-container: '#0d4e5c'
  on-primary-container: '#87bece'
  inverse-primary: '#98cfe0'
  secondary: '#556062'
  on-secondary: '#ffffff'
  secondary-container: '#d9e5e7'
  on-secondary-container: '#5b6668'
  tertiary: '#4c2704'
  on-tertiary: '#ffffff'
  tertiary-container: '#673d18'
  on-tertiary-container: '#e5a97b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b4ebfc'
  primary-fixed-dim: '#98cfe0'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#0c4e5c'
  secondary-fixed: '#d9e5e7'
  secondary-fixed-dim: '#bdc9cb'
  on-secondary-fixed: '#121d1f'
  on-secondary-fixed-variant: '#3d494b'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#f7ba8a'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#673d18'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  status-safe: '#1A8245'
  status-warning: '#D97706'
  status-critical: '#D31130'
  surface-muted: '#F9FAFB'
  border-subtle: '#E5E7EB'
typography:
  display-hero:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  metric-value:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.03em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is anchored in the concept of "Cognitive Ease." Recognizing that caregivers operate under high stress, the interface acts as a calming agent rather than an additional source of noise. The aesthetic is a fusion of **Modern Minimalism** and **Tactile Softness**, prioritizing information density through generous whitespace rather than cramped data tables. 

The emotional response should be one of "Quiet Authority"—the platform doesn't shout; it guides with clarity and precision. Every element is designed to reduce the "time-to-insight," ensuring that the most critical health indicators are the most visually prominent.

## Colors
This design system utilizes a "Calm Professional" palette. The primary color is a Deep Teal (#0D4E5C), chosen to evoke trust and surgical precision without the coldness of a pure navy. 

Status colors are meticulously calibrated for accessibility and immediate recognition:
- **Within Limit:** A grounded botanical green.
- **Consideration:** A warm, non-vibrant amber to signal caution without panic.
- **Exceeds Limit:** A refined, high-visibility red.

The background uses a hierarchy of soft whites and cool-toned grays to define sections, ensuring the primary content layer feels elevated and clear.

## Typography
The typography strategy prioritizes **Manrope** for headlines and metrics to provide a modern, friendly, yet structured feel. **Inter** is utilized for body text and functional labels due to its exceptional legibility at small sizes.

- **Metric Value:** Used for critical data points (e.g., heart rate, oxygen levels). These should be the largest elements on the screen.
- **Label Caps:** Used for metadata categories to provide a clear visual "anchor" above data points.
- **Line Heights:** Generous line heights are maintained throughout to prevent visual fatigue.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain a premium "magazine-style" feel, transitioning to a fluid stack on mobile devices.

- **The 8px Rhythm:** All spacing (padding, margins, gap) must be a multiple of 8.
- **Negative Space:** Use 40px+ margins between major logical sections to allow the eye to rest.
- **Content Grouping:** Related health metrics should be grouped within cards, with 16px internal padding and 24px external gutters.
- **Mobile Reflow:** On mobile, side-by-side metrics should stack vertically unless they are part of a horizontal scrolling "Trend Carousel."

## Elevation & Depth
Depth is conveyed through **Tonal Layering** rather than heavy shadows. 

- **Level 0 (Background):** Soft gray (#F9FAFB).
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF).
- **Elevation Shadow:** Use a very diffused, low-opacity shadow for the primary "Active" card: `0px 4px 20px rgba(13, 78, 92, 0.04)`. This subtle teal-tinted shadow reinforces the brand color while feeling organic.
- **Interactions:** Hover states should not lift the element higher, but rather change the border color to the primary teal or apply a subtle inner glow.

## Shapes
The shape language is **Rounded (Level 2)** to maintain a "human" and approachable feel.

- **Primary Cards:** 16px (1rem) corner radius.
- **Buttons & Inputs:** 8px (0.5rem) corner radius.
- **Metric Badges:** Fully rounded (pill) to distinguish them from actionable buttons.
- **Visual Continuity:** Avoid mixing sharp corners with rounded ones; all interactive and container elements must adhere to the 8px or 16px radius standards.

## Components

### Buttons
- **Primary:** Solid Teal (#0D4E5C) with white text. High-contrast and substantial height (48px).
- **Secondary:** Secondary color background (#E6F2F4) with Teal text. Used for non-urgent actions.

### Cards (The "Insight" Card)
- The core of the system. Each card should represent one health domain (e.g., "Vital Signs").
- Must include a clear header, a `metric-value` display, and a "Trend Indicator" (a subtle sparkline or arrow).

### Status Indicators
- **Dots:** 8px circles using the status color palette, placed next to text labels for quick scanning.
- **Progress Rings:** High-stroke, low-diameter rings for percentage-based metrics (e.g., hydration or sleep goals).

### Input Fields
- Subtle 1px borders (#E5E7EB) that transition to the primary teal on focus. 
- Labels should always be visible (never use placeholder text only) to ensure clarity during data entry.

### Lists
- Use wide-set list items with 16px vertical padding and a subtle bottom divider. 
- Icons used in lists should be "duotone" style, utilizing the primary teal and its 20% opacity variant.